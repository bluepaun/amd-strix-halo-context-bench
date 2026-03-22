import readline from "node:readline";
import { formatElapsed, formatLiveElapsed } from "../time/elapsed.js";
import type { BenchmarkRow, ReporterModelSummary } from "../types.js";

const formatNumber = (value: number | undefined): string =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(3) : "-";

const formatThreshold = (value: number | null | undefined): string => {
  if (typeof value === "number") {
    return `${value}K`;
  }

  if (value === null) {
    return "not found";
  }

  return "pending";
};

export class ConsoleStatusReporter {
  private readonly recentRows: BenchmarkRow[] = [];
  private readonly summaries: ReporterModelSummary[] = [];
  private runStartedAt: number | undefined;
  private currentBucketStartedAt: number | undefined;
  private ticker: NodeJS.Timeout | undefined;
  private totalModels = 0;
  private completedModels = 0;
  private currentModel = "-";
  private currentContextK = "-";
  private loadState = "idle";
  private decodeTps: number | undefined;
  private prefillTps: number | undefined;
  private thresholdContextK: number | null | undefined;
  private message = "Waiting to start.";

  start(totalModels: number): void {
    this.totalModels = totalModels;
    this.completedModels = 0;
    this.runStartedAt = Date.now();
    this.currentBucketStartedAt = undefined;
    this.startTicker();
    this.render();
  }

  setLoadState(loadState: string, message?: string): void {
    this.loadState = loadState;
    if (message) {
      this.message = message;
    }
    this.render();
  }

  startModel(modelId: string): void {
    this.currentModel = modelId;
    this.currentContextK = "-";
    this.currentBucketStartedAt = undefined;
    this.loadState = "preparing";
    this.decodeTps = undefined;
    this.prefillTps = undefined;
    this.thresholdContextK = undefined;
    this.message = `Preparing ${modelId}`;
    this.render();
  }

  startBucket(contextK: number, phase: string): void {
    this.currentContextK = `${contextK}K (${phase})`;
    this.currentBucketStartedAt = Date.now();
    this.decodeTps = undefined;
    this.prefillTps = undefined;
    this.message = `Benchmarking ${contextK}K`;
    this.render();
  }

  recordRow(row: BenchmarkRow): void {
    this.currentBucketStartedAt = undefined;
    this.decodeTps = row.decode_tps;
    this.prefillTps = row.prefill_tps;
    this.recentRows.unshift(row);
    if (this.recentRows.length > 8) {
      this.recentRows.pop();
    }
    this.message = `${row.model_name} ${row.context_k}K -> ${row.status} (${formatElapsed(row.elapsed_ms) || "-"})`;
    this.render();
  }

  completeModel(modelId: string, thresholdContextK: number | null): void {
    this.completedModels += 1;
    this.thresholdContextK = thresholdContextK;
    this.loadState = "done";
    this.message = `${modelId} finished`;
    this.summaries.unshift({ modelId, thresholdContextK });
    if (this.summaries.length > 8) {
      this.summaries.pop();
    }
    this.render();
  }

  finish(outputPath: string, rowCount: number): void {
    this.loadState = "complete";
    this.currentBucketStartedAt = undefined;
    this.message = `Stored ${rowCount} rows in ${outputPath}`;
    this.render();
    this.stopTicker();
  }

  log(message: string): void {
    this.message = message;
    this.render();
  }

  private startTicker(): void {
    this.stopTicker();

    if (!process.stdout.isTTY) {
      return;
    }

    this.ticker = setInterval(() => {
      this.render();
    }, 1_000);
    this.ticker.unref?.();
  }

  private stopTicker(): void {
    if (!this.ticker) {
      return;
    }

    clearInterval(this.ticker);
    this.ticker = undefined;
  }

  private render(): void {
    const now = Date.now();
    const lines = [
      "Llama.cpp Context Threshold Benchmark",
      "",
      `Progress: ${this.completedModels}/${this.totalModels}`,
      `Run elapsed: ${formatLiveElapsed(this.runStartedAt, now)}`,
      `Model: ${this.currentModel}`,
      `Load state: ${this.loadState}`,
      `Context bucket: ${this.currentContextK}`,
      `Current bucket elapsed: ${formatLiveElapsed(this.currentBucketStartedAt, now)}`,
      `Decode tok/sec: ${formatNumber(this.decodeTps)}`,
      `Prefill tok/sec: ${formatNumber(this.prefillTps)}`,
      `Threshold: ${formatThreshold(this.thresholdContextK)}`,
      `Status: ${this.message}`,
      "",
      "Recent points:",
      ...(this.recentRows.length > 0
        ? this.recentRows.map(
            (row) =>
              `- ${row.model_name} ${row.context_k}K ${row.search_phase} ${row.status} decode=${formatNumber(row.decode_tps)} prefill=${formatNumber(row.prefill_tps)} elapsed=${formatElapsed(row.elapsed_ms) || "-"}`,
          )
        : ["- none yet"]),
      "",
      "Model thresholds:",
      ...(this.summaries.length > 0
        ? this.summaries.map((summary) => `- ${summary.modelId}: ${formatThreshold(summary.thresholdContextK)}`)
        : ["- none yet"]),
    ];

    if (process.stdout.isTTY) {
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      process.stdout.write(`${lines.join("\n")}\n`);
      return;
    }

    console.log(lines.join("\n"));
  }
}
