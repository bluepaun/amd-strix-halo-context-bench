import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { formatElapsed } from "../time/elapsed.js";
import type { BenchmarkRow, BenchmarkStatus, SearchPhase } from "../types.js";

const CSV_HEADER = [
  "model_name",
  "context_k",
  "search_phase",
  "decode_tps",
  "prefill_tps",
  "below_10",
  "status",
  "elapsed",
  "test_date",
];

const ELAPSED_MS_CSV_HEADER = [...CSV_HEADER.slice(0, -2), "elapsed_ms", "test_date"];
const LEGACY_CSV_HEADER = CSV_HEADER.slice(0, -2);
const TEST_DATE_ONLY_CSV_HEADER = CSV_HEADER.filter((column) => column !== "elapsed");

type PersistedBenchmarkRow = BenchmarkRow & {
  test_date: string;
};

const escapeCsv = (value: string): string => {
  if (value.includes(",") || value.includes("\n") || value.includes("\"")) {
    return `"${value.replaceAll("\"", "\"\"")}"`;
  }

  return value;
};

const formatNumber = (value: number | undefined): string =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(3) : "";

const parseElapsed = (value: string): number | undefined => {
  const compact = value.trim().replaceAll(" ", "");
  if (compact.length === 0) {
    return undefined;
  }

  let totalMilliseconds = 0;
  let position = 0;

  while (position < compact.length) {
    const remaining = compact.slice(position);
    const match = remaining.match(/^(\d+)(ms|h|m|s)/);
    if (!match) {
      throw new Error(`Invalid elapsed value '${value}' in benchmark CSV.`);
    }

    const amount = Number.parseInt(match[1] ?? "", 10);
    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid elapsed value '${value}' in benchmark CSV.`);
    }

    const unit = match[2];
    switch (unit) {
      case "h":
        totalMilliseconds += amount * 3_600_000;
        break;
      case "m":
        totalMilliseconds += amount * 60_000;
        break;
      case "s":
        totalMilliseconds += amount * 1_000;
        break;
      case "ms":
        totalMilliseconds += amount;
        break;
      default:
        throw new Error(`Invalid elapsed unit '${unit}' in benchmark CSV.`);
    }

    position += match[0].length;
  }

  return totalMilliseconds;
};

const sortRows = (left: BenchmarkRow, right: BenchmarkRow): number => {
  const modelComparison = left.model_name.localeCompare(right.model_name);
  if (modelComparison !== 0) {
    return modelComparison;
  }

  return left.context_k - right.context_k;
};

const isCsvHeader = (header: string[], expected: string[]): boolean =>
  header.length === expected.length && header.every((value, index) => value === expected[index]);

const parseCsv = (content: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (character === '"') {
      if (inQuotes && content[index + 1] === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && content[index + 1] === "\n") {
        index += 1;
      }

      currentRow.push(currentField);
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
      continue;
    }

    currentField += character;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((value) => value.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const parseInteger = (value: string, fieldName: string): number => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName} value '${value}' in benchmark CSV.`);
  }

  return parsed;
};

const parseOptionalNumber = (value: string, fieldName: string): number | undefined => {
  if (value.length === 0) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName} value '${value}' in benchmark CSV.`);
  }

  return parsed;
};

const parseSearchPhase = (value: string): SearchPhase => {
  if (value === "coarse" || value === "refine") {
    return value;
  }

  throw new Error(`Invalid search_phase value '${value}' in benchmark CSV.`);
};

const parseBenchmarkStatus = (value: string): BenchmarkStatus => {
  switch (value) {
    case "ok":
    case "timeout":
    case "load_failed":
    case "request_failed":
    case "degenerate_response":
    case "threshold_not_found":
    case "unload_failed":
      return value;
    default:
      throw new Error(`Invalid status value '${value}' in benchmark CSV.`);
  }
};

type CsvHeaderVariant = "legacy" | "test_date_only" | "elapsed_ms" | "elapsed";

const parsePersistedRow = (fields: string[], headerVariant: CsvHeaderVariant): PersistedBenchmarkRow => {
  const expectedLength =
    headerVariant === "elapsed" || headerVariant === "elapsed_ms"
      ? CSV_HEADER.length
      : headerVariant === "test_date_only"
        ? TEST_DATE_ONLY_CSV_HEADER.length
        : LEGACY_CSV_HEADER.length;

  if (fields.length !== expectedLength) {
    throw new Error(`Expected ${expectedLength} CSV fields, received ${fields.length}.`);
  }

  const model_name = fields[0] ?? "";
  const context_k = fields[1] ?? "";
  const search_phase = fields[2] ?? "";
  const decode_tps = fields[3] ?? "";
  const prefill_tps = fields[4] ?? "";
  const below_10 = fields[5] ?? "";
  const status = fields[6] ?? "";
  const elapsed = headerVariant === "elapsed" || headerVariant === "elapsed_ms" ? fields[7] ?? "" : "";
  const test_date =
    headerVariant === "elapsed" || headerVariant === "elapsed_ms"
      ? fields[8] ?? ""
      : headerVariant === "test_date_only"
        ? fields[7] ?? ""
        : "";

  return {
    model_name,
    context_k: parseInteger(context_k, "context_k"),
    search_phase: parseSearchPhase(search_phase),
    decode_tps: parseOptionalNumber(decode_tps, "decode_tps"),
    prefill_tps: parseOptionalNumber(prefill_tps, "prefill_tps"),
    below_10: below_10 === "true",
    status: parseBenchmarkStatus(status),
    elapsed_ms: headerVariant === "elapsed" ? parseElapsed(elapsed) : parseOptionalNumber(elapsed, "elapsed_ms"),
    test_date,
  };
};

const rowKey = (row: Pick<BenchmarkRow, "model_name" | "context_k">): string =>
  `${row.model_name}\u0000${row.context_k}`;

export class ResultsCsvStore {
  private readonly rows = new Map<string, PersistedBenchmarkRow>();
  private loaded = false;

  constructor(
    private readonly outputPath: string,
    private readonly mirrorPaths: string[] = [],
  ) {}

  async upsertRow(row: BenchmarkRow, testDate: string = new Date().toISOString()): Promise<void> {
    await this.ensureLoaded();

    this.rows.set(rowKey(row), {
      ...row,
      test_date: testDate,
    });

    await this.flush();
  }

  async getRowCount(): Promise<number> {
    await this.ensureLoaded();
    return this.rows.size;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) {
      return;
    }

    try {
      const content = await readFile(this.outputPath, "utf8");
      this.loadExistingRows(content);
    } catch (error) {
      const errorCode = error instanceof Error && "code" in error ? error.code : undefined;
      if (errorCode !== "ENOENT") {
        throw error;
      }
    }

    this.loaded = true;
  }

  private loadExistingRows(content: string): void {
    const parsedRows = parseCsv(content);
    if (parsedRows.length === 0) {
      return;
    }

    const header = parsedRows[0];
    const dataRows = parsedRows.slice(1);
    if (!header) {
      return;
    }

    const hasElapsed = isCsvHeader(header, CSV_HEADER);
    const hasElapsedMs = isCsvHeader(header, ELAPSED_MS_CSV_HEADER);
    const hasTestDateOnly = isCsvHeader(header, TEST_DATE_ONLY_CSV_HEADER);
    const isLegacy = isCsvHeader(header, LEGACY_CSV_HEADER);

    if (!hasElapsed && !hasElapsedMs && !hasTestDateOnly && !isLegacy) {
      throw new Error(`Unexpected benchmark CSV header in ${this.outputPath}.`);
    }

    const headerVariant: CsvHeaderVariant = hasElapsed
      ? "elapsed"
      : hasElapsedMs
        ? "elapsed_ms"
        : hasTestDateOnly
          ? "test_date_only"
          : "legacy";

    for (const fields of dataRows) {
      const row = parsePersistedRow(fields, headerVariant);
      this.rows.set(rowKey(row), row);
    }
  }

  private async flush(): Promise<void> {
    const sortedRows = [...this.rows.values()].sort(sortRows);
    const lines = [CSV_HEADER.join(",")];

    for (const row of sortedRows) {
      lines.push([
        escapeCsv(row.model_name),
        String(row.context_k),
        row.search_phase,
        formatNumber(row.decode_tps),
        formatNumber(row.prefill_tps),
        row.below_10 ? "true" : "false",
        row.status,
        formatElapsed(row.elapsed_ms),
        escapeCsv(row.test_date),
      ].join(","));
    }

    const content = `${lines.join("\n")}\n`;
    const outputPaths = [...new Set([this.outputPath, ...this.mirrorPaths].map((outputPath) => resolve(outputPath)))];

    await Promise.all(outputPaths.map(async (outputPath) => {
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, content, "utf8");
    }));
  }
}

export async function writeResultsCsv(
  outputPath: string,
  rows: BenchmarkRow[],
  mirrorPaths: string[] = [],
): Promise<void> {
  const store = new ResultsCsvStore(outputPath, mirrorPaths);

  for (const row of [...rows].sort(sortRows)) {
    await store.upsertRow(row);
  }
}
