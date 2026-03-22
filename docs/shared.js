export const REPO_URL = "https://github.com/bluepaun/amd-strix-halo-context-bench";
export const README_URLS = {
  en: `${REPO_URL}/blob/main/README.md`,
  ko: `${REPO_URL}/blob/main/README.ko.md`,
};
export const CSV_URLS = ["./benchmark_results.csv", "../benchmark_results.csv"];
export const STORAGE_KEY = "strix-halo-context-bench-language";

export const COPY = {
  en: {
    meta: {
      mainTitle: "AMD Strix Halo Context Bench",
      mainDescription:
        "GitHub Pages benchmark table for AMD Strix Halo llama.cpp context scaling results.",
      detailTitle: "Model Detail",
      detailDescription:
        "Per-model decode and prefill context scaling charts with raw benchmark rows.",
    },
    hero: {
      eyebrow: "GitHub Pages benchmark table",
      title: "AMD Strix Halo llama.cpp Context Bench",
      lead:
        "Use the main table to scan 1K and max-context throughput, then open a model for decode and prefill scaling charts plus raw CSV rows.",
      badges: [
        "AMD Ryzen AI Max+ 395 · Radeon 8060S · 128GB unified memory",
        "distrobox · kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
        "Kernel 6.19.8-061908-generic",
      ],
      actions: {
        repo: "GitHub",
        readme: "README",
        csv: "CSV",
      },
    },
    main: {
      stats: {
        models: "Benchmarked models",
        deepest: "Deepest context",
        latest: "Latest update",
      },
      controls: {
        search: "Search models",
        searchPlaceholder: "e.g. Qwen, Nemotron, gpt-oss",
        sort: "Sort",
        sortOptions: {
          maxContext: "Max context",
          zeroDecode: "1K decode",
          zeroPrefill: "1K prefill",
          latest: "Latest update",
          name: "Name",
        },
      },
      table: {
        eyebrow: "Model overview",
        title: "Clickable benchmark roster",
        summary: "{count} models shown",
        note: "Click a row to open per-model decode/prefill context scaling graphs and raw rows.",
        empty: "No models match the current search.",
        loading: "Loading benchmark results...",
        headers: {
          model: "Model name",
          zeroDecode: "1K decode tps",
          zeroPrefill: "1K prefill tps",
          maxContext: "Max context K",
          maxDecode: "Max decode tps",
          maxPrefill: "Max prefill tps",
        },
        badges: {
          issue: "Issue",
          threshold: "Threshold {context}",
          deepest: "Deepest {context}",
        },
      },
    },
    detail: {
      back: "Back to main page",
      eyebrow: "Model detail",
      lead: "Decode and prefill scaling from 0K to {context} across {count} recorded rows.",
      missingTitle: "Model not found",
      missingLead: "Go back to the main page and choose a model row.",
      badges: {
        updated: "Updated {date}",
        rows: "{count} rows",
        threshold: "Threshold {context}",
        deepest: "Deepest {context}",
        issue: "Issue rows {count}",
      },
      stats: {
        zeroDecode: "0K decode",
        zeroPrefill: "0K prefill",
        maxContext: "Max context",
        maxDecode: "Max decode",
        maxPrefill: "Max prefill",
      },
      charts: {
        decodeTitle: "Context scaling decode",
        decodeSubtitle: "Decode throughput by context bucket.",
        prefillTitle: "Context scaling prefill",
        prefillSubtitle: "Prefill throughput by context bucket.",
        empty: "No numeric points are available for this chart.",
      },
      raw: {
        eyebrow: "Raw data",
        title: "Raw data rows",
        subtitle: "Sorted by context bucket and record time.",
        headers: {
          context: "Context",
          phase: "Phase",
          status: "Status",
          decode: "Decode",
          prefill: "Prefill",
          below: "Below 10",
          elapsed: "Elapsed",
          date: "Recorded",
        },
      },
    },
    notes: {
      system: {
        title: "System configuration",
        lead: "Reference runtime used for these CSV results.",
        items: {
          platform: "AMD Strix Halo · Ryzen AI Max+ 395 · Radeon 8060S",
          memory: "128GB unified memory · RDNA 3.5 · gfx1151",
          runtime: "distrobox with kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
          kernel: "Linux 6.19.8-061908-generic",
        },
      },
      publish: {
        title: "GitHub Pages publishing",
        lead:
          "The docs/ directory is served by GitHub Pages, and the benchmark CLI mirrors fresh CSV writes to docs/benchmark_results.csv.",
        items: {
          repo: "Repository",
          deployment: "Pages source",
          deploymentValue: "main branch · /docs folder",
          data: "Published CSV",
          dataValue: "docs/benchmark_results.csv",
        },
      },
    },
    labels: {
      notAvailable: "-",
      yes: "Yes",
      no: "No",
    },
    statuses: {
      ok: "OK",
      timeout: "Timeout",
      load_failed: "Load failed",
      request_failed: "Request failed",
      degenerate_response: "Degenerate response",
      threshold_not_found: "Threshold not found",
      unload_failed: "Unload failed",
    },
    errors: {
      loadFailed: "Could not load benchmark_results.csv.",
    },
  },
  ko: {
    meta: {
      mainTitle: "AMD Strix Halo 컨텍스트 벤치마크",
      mainDescription:
        "AMD Strix Halo llama.cpp 컨텍스트 스케일링 결과를 위한 GitHub Pages 벤치마크 테이블입니다.",
      detailTitle: "모델 상세",
      detailDescription: "모델별 decode/prefill 컨텍스트 스케일링 그래프와 원본 벤치마크 행입니다.",
    },
    hero: {
      eyebrow: "GitHub Pages 벤치마크 테이블",
      title: "AMD Strix Halo llama.cpp 컨텍스트 벤치마크",
      lead:
        "메인 테이블에서 1K와 최대 컨텍스트 처리량을 빠르게 비교하고, 각 모델 페이지에서 decode/prefill 스케일링 그래프와 원본 CSV 행을 확인하세요.",
      badges: [
        "AMD Ryzen AI Max+ 395 · Radeon 8060S · 통합 메모리 128GB",
        "distrobox · kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
        "커널 6.19.8-061908-generic",
      ],
      actions: {
        repo: "GitHub",
        readme: "README",
        csv: "CSV",
      },
    },
    main: {
      stats: {
        models: "벤치마크 모델 수",
        deepest: "최대 컨텍스트",
        latest: "최신 업데이트",
      },
      controls: {
        search: "모델 검색",
        searchPlaceholder: "예: Qwen, Nemotron, gpt-oss",
        sort: "정렬",
        sortOptions: {
          maxContext: "최대 컨텍스트 순",
          zeroDecode: "1K decode 순",
          zeroPrefill: "1K prefill 순",
          latest: "최신 업데이트 순",
          name: "이름순",
        },
      },
      table: {
        eyebrow: "모델 개요",
        title: "클릭 가능한 벤치마크 목록",
        summary: "{count}개 모델 표시 중",
        note: "행을 클릭하면 모델별 decode/prefill 컨텍스트 스케일링 그래프와 원본 행 페이지로 이동합니다.",
        empty: "현재 검색과 일치하는 모델이 없습니다.",
        loading: "벤치마크 결과를 불러오는 중...",
        headers: {
          model: "모델 이름",
          zeroDecode: "1K decode tps",
          zeroPrefill: "1K prefill tps",
          maxContext: "최대 context K",
          maxDecode: "max decode tps",
          maxPrefill: "max prefill tps",
        },
        badges: {
          issue: "이슈",
          threshold: "임계점 {context}",
          deepest: "최대 {context}",
        },
      },
    },
    detail: {
      back: "메인 페이지로",
      eyebrow: "모델 상세",
      lead: "0K부터 {context}까지, 총 {count}개 기록 행의 decode/prefill 스케일링입니다.",
      missingTitle: "모델을 찾을 수 없습니다",
      missingLead: "메인 페이지로 돌아가 원하는 모델 행을 선택하세요.",
      badges: {
        updated: "업데이트 {date}",
        rows: "행 {count}개",
        threshold: "임계점 {context}",
        deepest: "최대 {context}",
        issue: "이슈 행 {count}개",
      },
      stats: {
        zeroDecode: "0K decode",
        zeroPrefill: "0K prefill",
        maxContext: "최대 context",
        maxDecode: "max decode",
        maxPrefill: "max prefill",
      },
      charts: {
        decodeTitle: "Context scaling decode 그래프",
        decodeSubtitle: "컨텍스트 버킷별 decode 처리량입니다.",
        prefillTitle: "Context scaling prefill 그래프",
        prefillSubtitle: "컨텍스트 버킷별 prefill 처리량입니다.",
        empty: "이 그래프에 사용할 수 있는 숫자 데이터가 없습니다.",
      },
      raw: {
        eyebrow: "원본 데이터",
        title: "Raw data rows",
        subtitle: "컨텍스트 버킷과 기록 시각 순으로 정렬했습니다.",
        headers: {
          context: "컨텍스트",
          phase: "Phase",
          status: "상태",
          decode: "Decode",
          prefill: "Prefill",
          below: "10 미만",
          elapsed: "경과 시간",
          date: "기록 시각",
        },
      },
    },
    notes: {
      system: {
        title: "시스템 구성",
        lead: "이 CSV 결과에 사용한 기준 런타임입니다.",
        items: {
          platform: "AMD Strix Halo · Ryzen AI Max+ 395 · Radeon 8060S",
          memory: "통합 메모리 128GB · RDNA 3.5 · gfx1151",
          runtime: "distrobox + kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
          kernel: "Linux 6.19.8-061908-generic",
        },
      },
      publish: {
        title: "GitHub Pages 배포",
        lead: "docs/ 디렉터리를 GitHub Pages로 배포하고, 벤치마크 CLI가 docs/benchmark_results.csv로 자동 미러링합니다.",
        items: {
          repo: "저장소",
          deployment: "Pages 소스",
          deploymentValue: "main 브랜치 · /docs 폴더",
          data: "배포 CSV",
          dataValue: "docs/benchmark_results.csv",
        },
      },
    },
    labels: {
      notAvailable: "-",
      yes: "예",
      no: "아니오",
    },
    statuses: {
      ok: "정상",
      timeout: "타임아웃",
      load_failed: "로드 실패",
      request_failed: "요청 실패",
      degenerate_response: "비정상 응답",
      threshold_not_found: "임계점 미발견",
      unload_failed: "언로드 실패",
    },
    errors: {
      loadFailed: "benchmark_results.csv를 불러오지 못했습니다.",
    },
  },
};

export function getCopy(lang) {
  return COPY[lang] ?? COPY.en;
}

export function getInitialLanguage() {
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (savedLanguage === "en" || savedLanguage === "ko") {
    return savedLanguage;
  }

  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (queryLanguage === "en" || queryLanguage === "ko") {
    return queryLanguage;
  }

  return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export function setLanguagePreference(lang) {
  window.localStorage.setItem(STORAGE_KEY, lang);
}

export function syncLanguageInUrl(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url);
}

export function createIndexHref(lang) {
  return `./index.html?lang=${encodeURIComponent(lang)}`;
}

export function createModelHref(modelName, lang) {
  const params = new URLSearchParams({ model: modelName, lang });
  return `./model.html?${params.toString()}`;
}

export async function fetchRows() {
  let lastError = null;

  for (const url of CSV_URLS) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      return parseRows(await response.text());
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to load CSV.");
}

export function summarizeRows(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const bucket = grouped.get(row.model_name);
    if (bucket) {
      bucket.push(row);
    } else {
      grouped.set(row.model_name, [row]);
    }
  }

  return [...grouped.entries()]
    .map(([modelName, modelRows]) => buildSummary(modelName, modelRows))
    .sort((left, right) => left.modelName.localeCompare(right.modelName));
}

export function renderInfoCards(copy, systemCard, publishCard) {
  systemCard.innerHTML = `
    <p class="eyebrow">AMD Strix Halo</p>
    <h3>${escapeHtml(copy.notes.system.title)}</h3>
    <p class="info-copy">${escapeHtml(copy.notes.system.lead)}</p>
    <div class="info-list">
      ${Object.values(copy.notes.system.items)
        .map(
          (item) => `
            <div class="info-item">
              <p class="info-item-copy">${escapeHtml(item)}</p>
            </div>
          `,
        )
        .join("")}
    </div>
  `;

  publishCard.innerHTML = `
    <p class="eyebrow">GitHub Pages</p>
    <h3>${escapeHtml(copy.notes.publish.title)}</h3>
    <p class="info-copy">${escapeHtml(copy.notes.publish.lead)}</p>
    <div class="info-list">
      <div class="info-item">
        <span class="info-item-label">${escapeHtml(copy.notes.publish.items.repo)}</span>
        <p class="info-item-value"><a href="${REPO_URL}" target="_blank" rel="noreferrer">${escapeHtml(REPO_URL)}</a></p>
      </div>
      <div class="info-item">
        <span class="info-item-label">${escapeHtml(copy.notes.publish.items.deployment)}</span>
        <p class="info-item-value">${escapeHtml(copy.notes.publish.items.deploymentValue)}</p>
      </div>
      <div class="info-item">
        <span class="info-item-label">${escapeHtml(copy.notes.publish.items.data)}</span>
        <p class="info-item-value">${escapeHtml(copy.notes.publish.items.dataValue)}</p>
      </div>
    </div>
  `;
}

export function buildChartMarkup({ points, title, emptyText, tone, lang }) {
  if (points.length === 0) {
    return `
      <title>${escapeHtml(title)}</title>
      <text class="chart-empty" x="50%" y="50%" text-anchor="middle">${escapeHtml(emptyText)}</text>
    `;
  }

  const sortedPoints = [...points].sort((left, right) => left.x - right.x);
  const width = 760;
  const height = 360;
  const padding = { top: 24, right: 24, bottom: 44, left: 58 };
  const minX = Math.min(...sortedPoints.map((point) => point.x), 0);
  const maxX = Math.max(...sortedPoints.map((point) => point.x), 1);
  const maxY = Math.max(...sortedPoints.map((point) => point.y), 1);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const xAt = (value) => padding.left + ((value - minX) / Math.max(maxX - minX, 1)) * plotWidth;
  const yAt = (value) => padding.top + plotHeight - (value / maxY) * plotHeight;
  const yTicks = buildTicks(maxY, 4);
  const xTicks = buildTicks(maxX, Math.min(5, Math.max(sortedPoints.length - 1, 1)));
  const line = buildLinePath(sortedPoints, xAt, yAt);
  const area = buildAreaPath(sortedPoints, xAt, yAt, padding.top + plotHeight);

  return `
    <title>${escapeHtml(title)}</title>
    ${yTicks
      .map(
        (tick) => `
          <line class="chart-grid" x1="${padding.left}" y1="${yAt(tick)}" x2="${width - padding.right}" y2="${yAt(tick)}"></line>
          <text class="chart-axis" x="${padding.left - 10}" y="${yAt(tick) + 4}" text-anchor="end">${escapeHtml(
            formatCompactNumber(tick, lang),
          )}</text>
        `,
      )
      .join("")}
    ${xTicks
      .map(
        (tick) => `
          <line class="chart-grid" x1="${xAt(tick)}" y1="${padding.top}" x2="${xAt(tick)}" y2="${padding.top + plotHeight}"></line>
          <text class="chart-axis" x="${xAt(tick)}" y="${height - 12}" text-anchor="middle">${escapeHtml(
            formatContext(Math.round(tick), lang),
          )}</text>
        `,
      )
      .join("")}
    <path class="chart-area chart-area--${tone}" d="${area}"></path>
    <path class="chart-line chart-line--${tone}" d="${line}"></path>
    ${sortedPoints
      .map((point) => {
        const thresholdClass = point.below ? " chart-point--threshold" : "";
        return `
          <circle class="chart-point chart-point--${tone}${thresholdClass}" cx="${xAt(point.x)}" cy="${yAt(point.y)}" r="5.2">
            <title>${escapeHtml(point.label)}</title>
          </circle>
        `;
      })
      .join("")}
  `;
}

export function statusLabel(status, lang) {
  return getCopy(lang).statuses[status] ?? status;
}

export function formatContext(value, lang) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return getCopy(lang).labels.notAvailable;
  }

  return `${value}K`;
}

export function formatTps(value, lang) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return getCopy(lang).labels.notAvailable;
  }

  return formatNumber(value, lang, value >= 100 ? 1 : 2);
}

export function formatMetric(value, lang) {
  const formatted = formatTps(value, lang);
  return formatted === getCopy(lang).labels.notAvailable ? formatted : `${formatted} tok/s`;
}

export function formatDate(value, lang) {
  const timestamp = typeof value === "number" ? value : dateValue(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return getCopy(lang).labels.notAvailable;
  }

  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatInteger(value, lang) {
  return new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function template(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseRows(csvText) {
  const parsed = parseCsv(csvText);
  const header = parsed[0] ?? [];
  const requiredColumns = [
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

  for (const column of requiredColumns) {
    if (!header.includes(column)) {
      throw new Error(`Missing CSV column: ${column}`);
    }
  }

  const headerIndex = new Map(header.map((column, index) => [column, index]));
  const rows = parsed.slice(1).map((fields) => {
    const fieldValue = (column) => fields[headerIndex.get(column)] ?? "";

    return {
      model_name: fieldValue("model_name"),
      context_k: Number.parseInt(fieldValue("context_k"), 10),
      search_phase: fieldValue("search_phase"),
      decode_tps: parseOptionalNumber(fieldValue("decode_tps")),
      prefill_tps: parseOptionalNumber(fieldValue("prefill_tps")),
      below_10: fieldValue("below_10") === "true",
      status: fieldValue("status"),
      elapsed: fieldValue("elapsed"),
      test_date: fieldValue("test_date"),
    };
  });

  return rows
    .filter((row) => row.model_name && Number.isFinite(row.context_k))
    .sort((left, right) => {
      const modelComparison = left.model_name.localeCompare(right.model_name);
      if (modelComparison !== 0) {
        return modelComparison;
      }

      if (left.context_k !== right.context_k) {
        return left.context_k - right.context_k;
      }

      return dateValue(left.test_date) - dateValue(right.test_date);
    });
}

function parseCsv(content) {
  const rows = [];
  let currentRow = [];
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
}

function buildSummary(modelName, rows) {
  const sortedRows = [...rows].sort((left, right) => {
    if (left.context_k !== right.context_k) {
      return left.context_k - right.context_k;
    }

    return dateValue(left.test_date) - dateValue(right.test_date);
  });
  const zeroContextRow = pickLastRow(sortedRows.filter((row) => row.context_k === 0));
  const oneContextRow = pickLastRow(sortedRows.filter((row) => row.context_k === 1));
  const tableContextRow = oneContextRow ?? zeroContextRow;
  const maxContextK = sortedRows.reduce((max, row) => Math.max(max, row.context_k), 0);
  const maxContextRow = pickLastRow(sortedRows.filter((row) => row.context_k === maxContextK));
  const thresholdRow = sortedRows.find((row) => row.status === "ok" && row.below_10) ?? null;
  const issueCount = sortedRows.filter((row) => row.status !== "ok").length;
  const updatedAt = sortedRows.reduce((latest, row) => Math.max(latest, dateValue(row.test_date)), 0);

  return {
    modelName,
    rows: sortedRows,
    zeroContextRow,
    oneContextRow,
    tableContextRow,
    maxContextK,
    maxContextRow,
    thresholdRow,
    hasIssues: issueCount > 0,
    issueCount,
    updatedAt,
  };
}

function pickLastRow(rows) {
  return rows.length === 0 ? null : rows.at(-1);
}

function buildLinePath(points, xAt, yAt) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${xAt(point.x)} ${yAt(point.y)}`).join(" ");
}

function buildAreaPath(points, xAt, yAt, baseline) {
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const upperPath = buildLinePath(points, xAt, yAt);
  return `${upperPath} L ${xAt(lastPoint.x)} ${baseline} L ${xAt(firstPoint.x)} ${baseline} Z`;
}

function buildTicks(maxValue, segments) {
  const ticks = [];
  const safeSegments = Math.max(segments, 1);

  for (let index = 0; index <= safeSegments; index += 1) {
    ticks.push((maxValue / safeSegments) * index);
  }

  return [...new Set(ticks.map((tick) => Number(tick.toFixed(2))))];
}

function dateValue(value) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatNumber(value, lang, fractionDigits = 2) {
  return new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatCompactNumber(value, lang) {
  if (!Number.isFinite(value)) {
    return getCopy(lang).labels.notAvailable;
  }

  return new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}

function parseOptionalNumber(value) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
