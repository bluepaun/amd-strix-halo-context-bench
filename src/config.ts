export const DEFAULT_BASE_URL =
  process.env.LLAMA_BASE_URL ?? 'http://127.0.0.1:8080';
export const DEFAULT_OUTPUT_PATH =
  process.env.BENCHMARK_OUTPUT_PATH ?? 'benchmark_results.csv';

const parseDurationMs = (
  value: string | undefined,
  fallbackMs: number,
): number => {
  if (!value) {
    return fallbackMs;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
};

export const FIXED_SEED = 1337;
export const FIXED_N_PREDICT = 128;
export const FIXED_TEMPERATURE = 0;
export const FIXED_TOP_K = 1;
export const FIXED_TOP_P = 1;
export const COARSE_BUCKETS_HEAD = [0, 1, 10, 20, 30];
export const TOKENS_PER_CONTEXT_K = 1_024;
export const DECODE_THRESHOLD_TPS = 10;
export const MODEL_LOAD_TIMEOUT_MS = 15 * 60 * 1000;
export const REQUEST_TIMEOUT_MS = parseDurationMs(
  process.env.REQUEST_TIMEOUT_MS,
  10 * 60 * 60 * 1000,
);
export const POLL_INTERVAL_MS = 2_000;
export const MAX_REQUEST_FAILED_ATTEMPTS = 3;
export const DEFAULT_CONTEXT_LIMIT_TOKENS = 128_000;
export const CONTEXT_RESERVE_TOKENS = FIXED_N_PREDICT + 256;
export const MINIMAL_READY_PROMPT = 'Ping.';
export const BASELINE_PROMPT =
  'benchmark benchmark benchmark benchmark benchmark benchmark benchmark benchmark';
export const FILLER_UNIT =
  'Throughput benchmark filler text keeps token counts stable across repeated measurements. ';
export const BENCHMARK_CONTINUATION_SUFFIX =
  '\n\nbenchmark benchmark benchmark benchmark benchmark benchmark benchmark benchmark';
export const MIN_BENCHMARK_GENERATED_TOKENS = 8;
