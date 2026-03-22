import { Agent } from "undici";
import {
  DEFAULT_CONTEXT_LIMIT_TOKENS,
  FIXED_N_PREDICT,
  FIXED_SEED,
  FIXED_TEMPERATURE,
  FIXED_TOP_K,
  FIXED_TOP_P,
  MIN_BENCHMARK_GENERATED_TOKENS,
  MINIMAL_READY_PROMPT,
  MODEL_LOAD_TIMEOUT_MS,
  POLL_INTERVAL_MS,
  REQUEST_TIMEOUT_MS,
} from "../config.js";
import type { CompletionMetrics, ModelInfo, RawModelInfo } from "../types.js";

class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class DegenerateCompletionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DegenerateCompletionError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

type TimedRequestInit = RequestInit & {
  dispatcher?: Agent;
};

const extractModelList = (payload: unknown): RawModelInfo[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord) as RawModelInfo[];
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data.filter(isRecord) as RawModelInfo[];
  }

  return [];
};

const extractCtxSize = (raw: RawModelInfo): number => {
  const args = Array.isArray(raw.status?.args) ? raw.status.args : [];

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if ((value === "--ctx-size" || value === "-c") && typeof args[index + 1] === "string") {
      const parsed = Number.parseInt(args[index + 1] as string, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  const preset = raw.status?.preset;
  if (typeof preset === "string") {
    const match = preset.match(/ctx-size\s*=\s*(\d+)/);
    const capturedValue = match?.[1];
    if (capturedValue) {
      const parsed = Number.parseInt(capturedValue, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return DEFAULT_CONTEXT_LIMIT_TOKENS;
};

const toModelInfo = (raw: RawModelInfo): ModelInfo => ({
  id: raw.id,
  statusValue: raw.status?.value ?? "unknown",
  ctxSizeTokens: extractCtxSize(raw),
  raw,
});

const extractCompletionMetrics = (payload: unknown): CompletionMetrics => {
  if (!isRecord(payload)) {
    throw new Error("Completion response is not an object.");
  }

  const timings = isRecord(payload.timings)
    ? payload.timings
    : isRecord(payload.timing)
      ? payload.timing
      : null;

  const decode = timings?.predicted_per_second;
  const prefill = timings?.prompt_per_second;

  if (typeof decode !== "number" || typeof prefill !== "number") {
    throw new Error("Completion response did not include timing metrics.");
  }

  return {
    decodeTps: decode,
    prefillTps: prefill,
  };
};

const validateCompletionPayload = (payload: unknown): void => {
  if (!isRecord(payload)) {
    throw new Error("Completion response is not an object.");
  }

  const timings = isRecord(payload.timings) ? payload.timings : null;
  const tokensPredicted =
    typeof payload.tokens_predicted === "number"
      ? payload.tokens_predicted
      : typeof timings?.predicted_n === "number"
        ? timings.predicted_n
        : undefined;
  const stopType = typeof payload.stop_type === "string" ? payload.stop_type : "";
  const content = typeof payload.content === "string" ? payload.content : "";

  if (typeof tokensPredicted === "number" && tokensPredicted < MIN_BENCHMARK_GENERATED_TOKENS) {
    throw new DegenerateCompletionError(
      `Completion generated only ${tokensPredicted} tokens; benchmark prompt likely hit EOS too early.`,
    );
  }

  if (stopType === "eos" && content.trim().length === 0) {
    throw new DegenerateCompletionError("Completion stopped on EOS without generating benchmark text.");
  }
};

export class LlamaApiClient {
  private readonly dispatcherByTimeoutMs = new Map<number, Agent>();

  constructor(
    private readonly baseUrl: string,
    private readonly requestTimeoutMs: number = REQUEST_TIMEOUT_MS,
  ) {}

  async listModels(): Promise<ModelInfo[]> {
    const payload = await this.requestJson("/models", { method: "GET" });
    return extractModelList(payload)
      .map(toModelInfo)
      .sort((left, right) => left.id.localeCompare(right.id));
  }

  async loadModel(model: string): Promise<void> {
    await this.requestJson("/models/load", {
      method: "POST",
      body: JSON.stringify({ model }),
    });
  }

  async unloadModel(model: string): Promise<void> {
    await this.requestJson("/models/unload", {
      method: "POST",
      body: JSON.stringify({ model }),
    });
  }

  async waitForModelLoaded(model: string, timeoutMs: number = MODEL_LOAD_TIMEOUT_MS): Promise<ModelInfo> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() <= deadline) {
      const models = await this.listModels();
      const match = models.find((candidate) => candidate.id === model);

      if (match?.statusValue === "loaded") {
        return match;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new Error(`Timed out waiting for model '${model}' to load.`);
  }

  async readyCheck(model: string): Promise<void> {
    await this.completion(model, MINIMAL_READY_PROMPT, {
      n_predict: 1,
      seed: FIXED_SEED,
      temperature: FIXED_TEMPERATURE,
      top_k: FIXED_TOP_K,
      top_p: FIXED_TOP_P,
      cache_prompt: false,
    }, this.requestTimeoutMs, false);
  }

  async tokenize(model: string, content: string): Promise<number> {
    const payload = await this.requestJsonWithFallbacks("/tokenize", [
      { method: "POST", body: JSON.stringify({ model, content }) },
      { method: "POST", body: JSON.stringify({ model, prompt: content }) },
      { method: "POST", body: JSON.stringify({ content }) },
      { method: "POST", body: JSON.stringify({ prompt: content }) },
    ]);

    if (Array.isArray(payload)) {
      return payload.length;
    }

    if (isRecord(payload)) {
      if (Array.isArray(payload.tokens)) {
        return payload.tokens.length;
      }

      if (typeof payload.tokens === "number") {
        return payload.tokens;
      }

      if (typeof payload.n_tokens === "number") {
        return payload.n_tokens;
      }
    }

    throw new Error("Tokenize response did not contain token counts.");
  }

  async completion(
    model: string,
    prompt: string,
    overrides: Record<string, unknown> = {},
    timeoutMs: number = this.requestTimeoutMs,
    validateOutput: boolean = true,
  ): Promise<CompletionMetrics> {
    const payload = await this.requestJson(
      "/completion",
      {
        method: "POST",
        body: JSON.stringify({
          model,
          prompt,
          n_predict: FIXED_N_PREDICT,
          cache_prompt: false,
          temperature: FIXED_TEMPERATURE,
          top_k: FIXED_TOP_K,
          top_p: FIXED_TOP_P,
          seed: FIXED_SEED,
          stream: false,
          ...overrides,
        }),
      },
      timeoutMs,
    );

    if (validateOutput) {
      validateCompletionPayload(payload);
    }

    return extractCompletionMetrics(payload);
  }

  private async requestJsonWithFallbacks(path: string, requests: RequestInit[]): Promise<unknown> {
    let lastError: unknown;

    for (const request of requests) {
      try {
        return await this.requestJson(path, request);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error(`Request to ${path} failed.`);
  }

  private getDispatcher(timeoutMs: number): Agent {
    const cached = this.dispatcherByTimeoutMs.get(timeoutMs);
    if (cached) {
      return cached;
    }

    const dispatcher = new Agent({
      headersTimeout: timeoutMs,
      bodyTimeout: timeoutMs,
      connectTimeout: 30_000,
    });

    this.dispatcherByTimeoutMs.set(timeoutMs, dispatcher);
    return dispatcher;
  }

  private async requestJson(path: string, init: RequestInit, timeoutMs: number = this.requestTimeoutMs): Promise<unknown> {
    const requestInit: TimedRequestInit = {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
      dispatcher: this.getDispatcher(timeoutMs),
    };

    const response = await fetch(new URL(path, this.baseUrl), requestInit);

    if (!response.ok) {
      const responseBody = await response.text();
      throw new HttpError(
        `Request to ${path} failed with status ${response.status}.`,
        response.status,
        responseBody,
      );
    }

    return parseJson(response);
  }
}

export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return true;
  }

  if (error instanceof Error && error.name === "TimeoutError") {
    return true;
  }

  return false;
};

export const formatApiError = (error: unknown): string => {
  if (error instanceof HttpError) {
    const body = error.responseBody.trim();
    return body ? `${error.message} ${body}` : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};
