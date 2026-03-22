export type SearchPhase = "coarse" | "refine";

export type BenchmarkStatus =
  | "ok"
  | "timeout"
  | "load_failed"
  | "request_failed"
  | "degenerate_response"
  | "threshold_not_found"
  | "unload_failed";

export interface RawModelStatus {
  value?: string;
  args?: string[];
  preset?: string;
}

export interface RawModelInfo {
  id: string;
  status?: RawModelStatus;
  [key: string]: unknown;
}

export interface ModelInfo {
  id: string;
  statusValue: string;
  ctxSizeTokens: number;
  raw: RawModelInfo;
}

export interface CompletionMetrics {
  decodeTps: number;
  prefillTps: number;
}

export interface BenchmarkRow {
  model_name: string;
  context_k: number;
  search_phase: SearchPhase;
  decode_tps?: number;
  prefill_tps?: number;
  below_10: boolean;
  status: BenchmarkStatus;
  elapsed_ms?: number;
}

export interface BucketRunResult {
  row: BenchmarkRow;
  actualPromptTokens?: number;
}

export interface ModelRunResult {
  rows: BenchmarkRow[];
  thresholdContextK: number | null;
}

export interface PromptBuildResult {
  prompt: string;
  actualTokens: number;
}

export interface ReporterModelSummary {
  modelId: string;
  thresholdContextK: number | null;
}
