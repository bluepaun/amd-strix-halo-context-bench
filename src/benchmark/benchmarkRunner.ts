import {
  COARSE_BUCKETS_HEAD,
  CONTEXT_RESERVE_TOKENS,
  DECODE_THRESHOLD_TPS,
  MAX_REQUEST_FAILED_ATTEMPTS,
  TOKENS_PER_CONTEXT_K,
} from "../config.js";
import { DegenerateCompletionError, formatApiError, isTimeoutError, LlamaApiClient } from "../api/llamaClient.js";
import type { ResultsCsvStore } from "../csv/writeResults.js";
import { PromptSizer } from "../prompt/promptSizer.js";
import { ConsoleStatusReporter } from "../ui/statusReporter.js";
import type {
  BenchmarkRow,
  BenchmarkStatus,
  BucketRunResult,
  ModelInfo,
  ModelRunResult,
  SearchPhase,
} from "../types.js";

const buildCoarseBuckets = (maxContextK: number): number[] => {
  const buckets = new Set<number>();

  for (const bucket of COARSE_BUCKETS_HEAD) {
    if (bucket <= maxContextK) {
      buckets.add(bucket);
    }
  }

  for (let bucket = 40; bucket <= maxContextK; bucket += 10) {
    buckets.add(bucket);
  }

  if (maxContextK > 0) {
    buckets.add(maxContextK);
  }

  return [...buckets].sort((left, right) => left - right);
};

const classifyStatus = (error: unknown, fallback: BenchmarkStatus = "request_failed"): BenchmarkStatus =>
  isTimeoutError(error)
    ? "timeout"
    : error instanceof DegenerateCompletionError
      ? "degenerate_response"
      : fallback;

const withElapsedMs = (row: BenchmarkRow, startedAt: number): BenchmarkRow => ({
  ...row,
  elapsed_ms: Math.max(0, Date.now() - startedAt),
});

export class BenchmarkRunner {
  constructor(
    private readonly client: LlamaApiClient,
    private readonly promptSizer: PromptSizer,
    private readonly reporter: ConsoleStatusReporter,
    private readonly resultsStore: ResultsCsvStore,
  ) {}

  async runModels(selectedModels: string[]): Promise<BenchmarkRow[]> {
    const rows: BenchmarkRow[] = [];

    this.reporter.start(selectedModels.length);

    for (const modelId of selectedModels) {
      const result = await this.runModel(modelId);
      rows.push(...result.rows);
      this.reporter.completeModel(modelId, result.thresholdContextK);
    }

    return rows;
  }

  private async runModel(modelId: string): Promise<ModelRunResult> {
    this.reporter.startModel(modelId);
    const modelStartedAt = Date.now();

    const modelSnapshot = await this.client.listModels();
    const modelInfo = modelSnapshot.find((candidate) => candidate.id === modelId);

    if (!modelInfo) {
      const missingModelRow = withElapsedMs(this.makeStatusRow(modelId, 0, "coarse", "load_failed"), modelStartedAt);
      await this.resultsStore.upsertRow(missingModelRow);
      return {
        rows: [missingModelRow],
        thresholdContextK: null,
      };
    }

    const initiallyLoaded = new Set(
      modelSnapshot.filter((candidate) => candidate.statusValue === "loaded").map((candidate) => candidate.id),
    );
    const loadedByUs = !initiallyLoaded.has(modelId);
    let result: ModelRunResult | null = null;

    try {
      if (loadedByUs) {
        this.reporter.setLoadState("loading", `Loading ${modelId}`);
        await this.client.loadModel(modelId);
      }

      this.reporter.setLoadState("waiting", `Waiting for ${modelId} to report loaded`);
      const loadedModel = await this.client.waitForModelLoaded(modelId);
      this.reporter.setLoadState("ready-check", `Running tiny readiness check for ${modelId}`);
      await this.client.readyCheck(modelId);
      this.reporter.setLoadState("benchmarking", `Benchmarking ${modelId}`);

      result = await this.runContextSearch(loadedModel);
    } catch (error) {
      const status = classifyStatus(error, "load_failed");
      const setupFailureRow = withElapsedMs(this.makeStatusRow(modelId, 0, "coarse", status), modelStartedAt);
      this.reporter.log(`Model setup failed for ${modelId}: ${formatApiError(error)}`);
      await this.resultsStore.upsertRow(setupFailureRow);
      result = {
        rows: [setupFailureRow],
        thresholdContextK: null,
      };
    } finally {
      if (loadedByUs) {
        const unloadStartedAt = Date.now();
        try {
          this.reporter.setLoadState("unloading", `Unloading ${modelId}`);
          await this.client.unloadModel(modelId);
        } catch (error) {
          const unloadFailureRow = withElapsedMs(
            this.makeStatusRow(modelId, 0, "coarse", classifyStatus(error, "unload_failed")),
            unloadStartedAt,
          );
          result ??= {
            rows: [],
            thresholdContextK: null,
          };
          result.rows.push(unloadFailureRow);
          await this.resultsStore.upsertRow(unloadFailureRow);
          this.reporter.log(`Unload warning for ${modelId}: ${formatApiError(error)}`);
        }
      }
    }

    if (result) {
      return result;
    }

    const fallbackFailureRow = withElapsedMs(this.makeStatusRow(modelId, 0, "coarse", "request_failed"), modelStartedAt);
    await this.resultsStore.upsertRow(fallbackFailureRow);
    return {
      rows: [fallbackFailureRow],
      thresholdContextK: null,
    };
  }

  private async runContextSearch(modelInfo: ModelInfo): Promise<ModelRunResult> {
    const rows: BenchmarkRow[] = [];
    let thresholdContextK: number | null = null;
    let firstBadCoarse: BenchmarkRow | undefined;
    let lastSuccessfulCoarse: BenchmarkRow | undefined;
    let stoppedByRequestFailure = false;

    const maxContextK = Math.max(0, Math.floor((modelInfo.ctxSizeTokens - CONTEXT_RESERVE_TOKENS) / TOKENS_PER_CONTEXT_K));
    const coarseBuckets = buildCoarseBuckets(maxContextK);

    for (const contextK of coarseBuckets) {
      const result = await this.runBucketWithRetries(modelInfo.id, contextK, "coarse");
      rows.push(result.finalRow);

      if (result.finalRow.status === "request_failed" && result.exhaustedRequestFailures) {
        thresholdContextK = contextK;
        stoppedByRequestFailure = true;
        this.reporter.log(`Stopping ${modelInfo.id} at ${contextK}K after repeated request_failed responses`);
        break;
      }

      if (result.finalRow.status !== "ok") {
        continue;
      }

      lastSuccessfulCoarse = result.finalRow;

      if (result.finalRow.below_10) {
        firstBadCoarse = result.finalRow;
        thresholdContextK = result.finalRow.context_k;
        break;
      }
    }

    if (!firstBadCoarse && !stoppedByRequestFailure) {
      thresholdContextK = lastSuccessfulCoarse?.context_k ?? null;
    }

    return { rows, thresholdContextK };
  }

  private async runBucketWithRetries(
    modelId: string,
    contextK: number,
    searchPhase: SearchPhase,
  ): Promise<{ finalRow: BenchmarkRow; exhaustedRequestFailures: boolean }> {
    const bucketStartedAt = Date.now();
    this.reporter.startBucket(contextK, searchPhase);

    for (let attempt = 1; attempt <= MAX_REQUEST_FAILED_ATTEMPTS; attempt += 1) {
      const result = await this.runBucket(modelId, contextK, searchPhase);

      if (result.row.status !== "request_failed") {
        const finalRow = withElapsedMs(result.row, bucketStartedAt);
        await this.resultsStore.upsertRow(finalRow);
        this.reporter.recordRow(finalRow);
        return {
          finalRow,
          exhaustedRequestFailures: false,
        };
      }

      if (attempt < MAX_REQUEST_FAILED_ATTEMPTS) {
        this.reporter.log(
          `Retrying ${modelId} ${contextK}K after request_failed (${attempt}/${MAX_REQUEST_FAILED_ATTEMPTS - 1} retries used)`,
        );
      }
    }

    const finalRow = withElapsedMs(this.makeStatusRow(modelId, contextK, searchPhase, "request_failed"), bucketStartedAt);
    await this.resultsStore.upsertRow(finalRow);
    this.reporter.recordRow(finalRow);

    return {
      finalRow,
      exhaustedRequestFailures: true,
    };
  }

  private async runBucket(modelId: string, contextK: number, searchPhase: SearchPhase): Promise<BucketRunResult> {
    try {
      const promptResult = await this.promptSizer.buildPrompt(modelId, contextK);
      const metrics = await this.client.completion(modelId, promptResult.prompt, {
        ignore_eos: true,
      });

      return {
        actualPromptTokens: promptResult.actualTokens,
        row: {
          model_name: modelId,
          context_k: contextK,
          search_phase: searchPhase,
          decode_tps: metrics.decodeTps,
          prefill_tps: metrics.prefillTps,
          below_10: metrics.decodeTps < DECODE_THRESHOLD_TPS,
          status: "ok",
        },
      };
    } catch (error) {
      this.reporter.log(`Bucket failed for ${modelId} ${contextK}K: ${formatApiError(error)}`);
      return {
        row: this.makeStatusRow(modelId, contextK, searchPhase, classifyStatus(error)),
      };
    }
  }

  private makeStatusRow(
    modelId: string,
    contextK: number,
    searchPhase: SearchPhase,
    status: BenchmarkStatus,
  ): BenchmarkRow {
    return {
      model_name: modelId,
      context_k: contextK,
      search_phase: searchPhase,
      below_10: false,
      status,
    };
  }
}
