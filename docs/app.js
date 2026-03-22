const REPO_URL = "https://github.com/bluepaun/amd-strix-halo-context-bench";
const README_URLS = {
  en: `${REPO_URL}/blob/main/README.md`,
  ko: `${REPO_URL}/blob/main/README.ko.md`,
};
const CSV_URLS = ["./benchmark_results.csv", "../benchmark_results.csv"];
const STORAGE_KEY = "strix-halo-context-bench-language";
const METRIC_FIELD = {
  decode: "decode_tps",
  prefill: "prefill_tps",
};

const COPY = {
  en: {
    metaTitle: "AMD Strix Halo Context Benchmark Explorer",
    metaDescription:
      "Bilingual GitHub Pages dashboard for benchmark_results.csv from the AMD Strix Halo llama.cpp context benchmark project.",
    hero: {
      eyebrow: "GitHub Pages benchmark explorer",
      title: "AMD Strix Halo llama.cpp Context Explorer",
      lead:
        "A bilingual static dashboard for benchmark_results.csv. Browse threshold crossings, inspect per-model curves, and review each benchmark point across growing context windows.",
      badges: [
        "AMD Ryzen AI Max+ 395 · Radeon 8060S · 128GB unified memory",
        "distrobox · kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
        "Kernel 6.19.8-061908-generic",
        "Decode threshold < 10 tok/s",
      ],
      actions: {
        repo: "GitHub",
        readme: "README",
        csv: "CSV",
      },
    },
    controls: {
      search: "Search models",
      searchPlaceholder: "e.g. Qwen, gpt-oss, 120B",
      sort: "Sort",
      focus: "Focus",
      metric: "Chart metric",
      sortOptions: {
        threshold: "Highest threshold",
        latest: "Latest update",
        decode: "Fastest 0K decode",
        name: "Name",
      },
      focusOptions: {
        all: "All models",
        crossed: "Threshold crossed",
        max: "Max reached",
        issues: "Has issues",
      },
      metricOptions: {
        decode: "Decode tok/s",
        prefill: "Prefill tok/s",
      },
    },
    stats: {
      models: "Benchmarked models",
      points: "Recorded points",
      deepest: "Deepest context",
      fastest: "Fastest 0K decode",
      crossings: "Threshold crossings",
      meta: {
        models: "{crossed} crossed · {max} max reached",
        points: "Latest sample {date}",
        deepest: "{model}",
        fastest: "{model}",
        crossings: "{share}% of filtered models",
      },
    },
    directory: {
      eyebrow: "Model directory",
      title: "Threshold and context overview",
      count: "{count} models shown",
      loading: "Loading benchmark results...",
      empty: "No models match the current filters.",
      meter: "Context coverage",
      updated: "Updated {date}",
      rows: "{count} rows",
      thresholdCrossed: "Threshold {context}",
      maxReached: "Max tested {context}",
      issues: "{count} issues",
      lastDecode: "Last decode",
      firstDecode: "0K decode",
    },
    detail: {
      empty: "Select a model to inspect benchmark details.",
      eyebrow: "Selected model",
      stats: {
        threshold: "Threshold",
        lastDecode: "Last decode",
        bestPrefill: "Best prefill",
        samples: "Samples",
      },
      badges: {
        crossed: "Threshold crossed",
        max: "Max tested",
        issues: "Issues present",
        updated: "Updated {date}",
      },
      chart: {
        title: "Context scaling",
        decodeSubtitle: "Decode throughput by context bucket",
        prefillSubtitle: "Prefill throughput by context bucket",
        empty: "No numeric samples are available for this metric.",
      },
      timeline: {
        title: "Benchmark buckets",
        subtitle: "Finalized rows preserved in benchmark_results.csv",
      },
      table: {
        title: "Raw rows",
        subtitle: "One row per context bucket",
      },
    },
    table: {
      context: "Context",
      status: "Status",
      decode: "Decode",
      prefill: "Prefill",
      below: "Below 10",
      elapsed: "Elapsed",
      date: "Recorded",
    },
    notes: {
      system: {
        title: "System configuration",
        lead: "Reference environment used for these CSV results.",
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
          "Serve the docs/ directory from GitHub Pages. The benchmark CLI mirrors fresh CSV writes to docs/benchmark_results.csv so this dashboard stays publish-ready.",
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
      okRows: "{count} OK rows",
      points: "{count} points",
      rows: "{count} rows",
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
    metaTitle: "AMD Strix Halo 컨텍스트 벤치마크 탐색기",
    metaDescription:
      "AMD Strix Halo llama.cpp 컨텍스트 벤치마크 프로젝트의 benchmark_results.csv를 위한 GitHub Pages 다국어 대시보드입니다.",
    hero: {
      eyebrow: "GitHub Pages 벤치마크 탐색기",
      title: "AMD Strix Halo llama.cpp 컨텍스트 탐색기",
      lead:
        "benchmark_results.csv를 보기 좋게 탐색할 수 있는 영문·한글 이중 언어 정적 대시보드입니다. 모델별 임계점, 컨텍스트 증가 곡선, 각 벤치마크 포인트를 한눈에 확인할 수 있습니다.",
      badges: [
        "AMD Ryzen AI Max+ 395 · Radeon 8060S · 통합 메모리 128GB",
        "distrobox · kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
        "커널 6.19.8-061908-generic",
        "decode 임계값 < 10 tok/s",
      ],
      actions: {
        repo: "GitHub",
        readme: "README",
        csv: "CSV",
      },
    },
    controls: {
      search: "모델 검색",
      searchPlaceholder: "예: Qwen, gpt-oss, 120B",
      sort: "정렬",
      focus: "보기 기준",
      metric: "차트 지표",
      sortOptions: {
        threshold: "임계점 높은 순",
        latest: "최신 업데이트 순",
        decode: "0K decode 빠른 순",
        name: "이름순",
      },
      focusOptions: {
        all: "전체 모델",
        crossed: "임계점 도달",
        max: "최대 컨텍스트 도달",
        issues: "이슈 포함",
      },
      metricOptions: {
        decode: "Decode tok/s",
        prefill: "Prefill tok/s",
      },
    },
    stats: {
      models: "벤치마크 모델 수",
      points: "기록된 포인트 수",
      deepest: "가장 깊은 컨텍스트",
      fastest: "가장 빠른 0K decode",
      crossings: "임계점 도달 모델",
      meta: {
        models: "임계점 도달 {crossed}개 · 최대 도달 {max}개",
        points: "최신 샘플 {date}",
        deepest: "{model}",
        fastest: "{model}",
        crossings: "필터된 모델의 {share}%",
      },
    },
    directory: {
      eyebrow: "모델 디렉터리",
      title: "임계점 및 컨텍스트 개요",
      count: "{count}개 모델 표시 중",
      loading: "벤치마크 결과를 불러오는 중...",
      empty: "현재 필터와 일치하는 모델이 없습니다.",
      meter: "컨텍스트 범위",
      updated: "업데이트 {date}",
      rows: "{count}개 행",
      thresholdCrossed: "임계점 {context}",
      maxReached: "최대 측정 {context}",
      issues: "이슈 {count}개",
      lastDecode: "마지막 decode",
      firstDecode: "0K decode",
    },
    detail: {
      empty: "모델을 선택하면 세부 벤치마크를 볼 수 있습니다.",
      eyebrow: "선택한 모델",
      stats: {
        threshold: "임계점",
        lastDecode: "마지막 decode",
        bestPrefill: "최고 prefill",
        samples: "샘플 수",
      },
      badges: {
        crossed: "임계점 도달",
        max: "최대 컨텍스트 도달",
        issues: "이슈 포함",
        updated: "업데이트 {date}",
      },
      chart: {
        title: "컨텍스트 스케일링",
        decodeSubtitle: "컨텍스트 버킷별 decode 처리량",
        prefillSubtitle: "컨텍스트 버킷별 prefill 처리량",
        empty: "이 지표에 사용할 수 있는 숫자 샘플이 없습니다.",
      },
      timeline: {
        title: "벤치마크 버킷",
        subtitle: "benchmark_results.csv에 최종 확정된 행만 남깁니다.",
      },
      table: {
        title: "원본 행",
        subtitle: "컨텍스트 버킷별 1개 행",
      },
    },
    table: {
      context: "컨텍스트",
      status: "상태",
      decode: "Decode",
      prefill: "Prefill",
      below: "10 미만",
      elapsed: "경과 시간",
      date: "기록 시각",
    },
    notes: {
      system: {
        title: "시스템 구성",
        lead: "이 CSV 결과에 사용한 기준 환경입니다.",
        items: {
          platform: "AMD Strix Halo · Ryzen AI Max+ 395 · Radeon 8060S",
          memory: "통합 메모리 128GB · RDNA 3.5 · gfx1151",
          runtime: "distrobox + kyuz0/amd-strix-halo-toolboxes:rocm-7.2",
          kernel: "Linux 6.19.8-061908-generic",
        },
      },
      publish: {
        title: "GitHub Pages 배포",
        lead:
          "GitHub Pages에서 docs/ 디렉터리를 서비스하면 됩니다. 벤치마크 CLI가 새 CSV를 docs/benchmark_results.csv로 자동 미러링해서 대시보드를 바로 배포 가능한 상태로 유지합니다.",
        items: {
          repo: "저장소",
          deployment: "Pages 소스",
          deploymentValue: "main 브랜치 · /docs 폴더",
          data: "배포되는 CSV",
          dataValue: "docs/benchmark_results.csv",
        },
      },
    },
    labels: {
      notAvailable: "-",
      yes: "예",
      no: "아니오",
      okRows: "정상 행 {count}개",
      points: "포인트 {count}개",
      rows: "행 {count}개",
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

const state = {
  lang: getInitialLanguage(),
  rows: [],
  summaries: [],
  query: "",
  sort: "threshold",
  view: "all",
  metric: "decode",
  selectedModel: null,
  loading: true,
  error: null,
};

const refs = {};

document.addEventListener("DOMContentLoaded", () => {
  bindRefs();
  bindEvents();
  render();
  void loadDashboard();
});

function bindRefs() {
  const ids = [
    "hero-eyebrow",
    "hero-title",
    "hero-lead",
    "hero-badges",
    "repo-link",
    "readme-link",
    "csv-link",
    "stats-grid",
    "search-label",
    "search-input",
    "sort-label",
    "sort-select",
    "focus-label",
    "focus-options",
    "metric-label",
    "metric-options",
    "directory-eyebrow",
    "directory-title",
    "directory-summary",
    "model-list",
    "detail-empty",
    "detail-content",
    "detail-eyebrow",
    "detail-title",
    "detail-badges",
    "detail-stat-grid",
    "chart-title",
    "chart-subtitle",
    "chart-svg",
    "timeline-title",
    "timeline-subtitle",
    "context-strip",
    "table-title",
    "table-subtitle",
    "table-head-context",
    "table-head-status",
    "table-head-decode",
    "table-head-prefill",
    "table-head-below",
    "table-head-elapsed",
    "table-head-date",
    "table-body",
    "system-card",
    "publish-card",
  ];

  for (const id of ids) {
    refs[toRefKey(id)] = document.getElementById(id);
  }

  refs.languageButtons = Array.from(document.querySelectorAll(".language-button"));
}

function bindEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    state.query = event.currentTarget.value;
    render();
  });

  refs.sortSelect.addEventListener("change", (event) => {
    state.sort = event.currentTarget.value;
    render();
  });

  refs.focusOptions.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button[data-value]") : null;
    if (!button) {
      return;
    }

    state.view = button.dataset.value;
    render();
  });

  refs.metricOptions.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button[data-value]") : null;
    if (!button) {
      return;
    }

    state.metric = button.dataset.value;
    render();
  });

  refs.modelList.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button[data-model]") : null;
    if (!button) {
      return;
    }

    state.selectedModel = button.dataset.model;
    render();
  });

  for (const button of refs.languageButtons) {
    button.addEventListener("click", () => {
      const nextLanguage = button.dataset.lang;
      if (!nextLanguage || nextLanguage === state.lang) {
        return;
      }

      state.lang = nextLanguage;
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
      render();
    });
  }
}

async function loadDashboard() {
  state.loading = true;
  state.error = null;
  render();

  try {
    const rows = await fetchRows();
    state.rows = rows;
    state.summaries = summarizeRows(rows);
  } catch (error) {
    state.error = error instanceof Error ? error : new Error(String(error));
    state.rows = [];
    state.summaries = [];
  } finally {
    state.loading = false;
    render();
  }
}

async function fetchRows() {
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

      return left.context_k - right.context_k;
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

function summarizeRows(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const existing = grouped.get(row.model_name);
    if (existing) {
      existing.push(row);
    } else {
      grouped.set(row.model_name, [row]);
    }
  }

  return [...grouped.entries()].map(([modelName, modelRows]) => buildSummary(modelName, modelRows));
}

function buildSummary(modelName, rows) {
  const sortedRows = [...rows].sort((left, right) => {
    if (left.context_k !== right.context_k) {
      return left.context_k - right.context_k;
    }

    return dateValue(left.test_date) - dateValue(right.test_date);
  });
  const okRows = sortedRows.filter((row) => row.status === "ok");
  const firstDecodeRow =
    okRows.find((row) => row.context_k === 0 && typeof row.decode_tps === "number") ??
    okRows.find((row) => typeof row.decode_tps === "number") ??
    null;
  const lastDecodeRow = [...okRows].reverse().find((row) => typeof row.decode_tps === "number") ?? null;
  const bestPrefillRow = okRows.reduce((best, row) => {
    if (typeof row.prefill_tps !== "number") {
      return best;
    }

    if (!best || row.prefill_tps > best.prefill_tps) {
      return row;
    }

    return best;
  }, null);
  const thresholdRow = okRows.find((row) => row.below_10) ?? okRows.at(-1) ?? sortedRows.at(-1) ?? null;
  const crossedThreshold = okRows.some((row) => row.below_10);
  const hasIssues = sortedRows.some((row) => row.status !== "ok");
  const updatedAt = sortedRows.reduce((latest, row) => {
    const nextValue = dateValue(row.test_date);
    return nextValue > latest ? nextValue : latest;
  }, 0);

  return {
    modelName,
    rows: sortedRows,
    okRows,
    firstDecodeRow,
    lastDecodeRow,
    bestPrefillRow,
    thresholdRow,
    crossedThreshold,
    hasIssues,
    issueCount: sortedRows.filter((row) => row.status !== "ok").length,
    updatedAt,
    updatedAtIso: updatedAt > 0 ? new Date(updatedAt).toISOString() : "",
    displayContextK: thresholdRow ? thresholdRow.context_k : null,
    maxContextK: sortedRows.reduce((max, row) => Math.max(max, row.context_k), 0),
  };
}

function render() {
  const copy = getCopy();
  const filteredSummaries = getFilteredSummaries();
  syncSelection(filteredSummaries);
  const selectedSummary = filteredSummaries.find((summary) => summary.modelName === state.selectedModel) ?? null;

  renderChrome(copy);

  if (state.loading) {
    refs.directorySummary.textContent = copy.directory.loading;
    refs.modelList.innerHTML = `<div class="loading-state">${escapeHtml(copy.directory.loading)}</div>`;
    refs.detailEmpty.textContent = copy.directory.loading;
    refs.detailEmpty.hidden = false;
    refs.detailContent.hidden = true;
    refs.statsGrid.innerHTML = renderLoadingStats(copy);
    renderInfoCards(copy);
    return;
  }

  if (state.error) {
    refs.directorySummary.textContent = copy.errors.loadFailed;
    refs.modelList.innerHTML = `<div class="empty-state">${escapeHtml(copy.errors.loadFailed)}</div>`;
    refs.detailEmpty.textContent = copy.errors.loadFailed;
    refs.detailEmpty.hidden = false;
    refs.detailContent.hidden = true;
    refs.statsGrid.innerHTML = renderErrorStats(copy);
    renderInfoCards(copy);
    return;
  }

  renderStats(copy, filteredSummaries);
  renderDirectory(copy, filteredSummaries);
  renderDetail(copy, selectedSummary);
  renderInfoCards(copy);
}

function renderChrome(copy) {
  document.documentElement.lang = state.lang;
  document.title = copy.metaTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", copy.metaDescription);
  }

  refs.heroEyebrow.textContent = copy.hero.eyebrow;
  refs.heroTitle.textContent = copy.hero.title;
  refs.heroLead.textContent = copy.hero.lead;
  refs.heroBadges.innerHTML = copy.hero.badges
    .map((badge) => `<span class="badge badge--neutral">${escapeHtml(badge)}</span>`)
    .join("");
  refs.repoLink.textContent = copy.hero.actions.repo;
  refs.repoLink.href = REPO_URL;
  refs.readmeLink.textContent = copy.hero.actions.readme;
  refs.readmeLink.href = README_URLS[state.lang];
  refs.csvLink.textContent = copy.hero.actions.csv;

  refs.searchLabel.textContent = copy.controls.search;
  refs.searchInput.placeholder = copy.controls.searchPlaceholder;
  refs.searchInput.value = state.query;
  refs.sortLabel.textContent = copy.controls.sort;
  refs.sortSelect.innerHTML = Object.entries(copy.controls.sortOptions)
    .map(([value, label]) => {
      const selected = value === state.sort ? ' selected="selected"' : "";
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");

  refs.focusLabel.textContent = copy.controls.focus;
  refs.focusOptions.innerHTML = renderSegmentButtons(copy.controls.focusOptions, state.view);
  refs.metricLabel.textContent = copy.controls.metric;
  refs.metricOptions.innerHTML = renderSegmentButtons(copy.controls.metricOptions, state.metric);

  refs.directoryEyebrow.textContent = copy.directory.eyebrow;
  refs.directoryTitle.textContent = copy.directory.title;

  refs.tableHeadContext.textContent = copy.table.context;
  refs.tableHeadStatus.textContent = copy.table.status;
  refs.tableHeadDecode.textContent = copy.table.decode;
  refs.tableHeadPrefill.textContent = copy.table.prefill;
  refs.tableHeadBelow.textContent = copy.table.below;
  refs.tableHeadElapsed.textContent = copy.table.elapsed;
  refs.tableHeadDate.textContent = copy.table.date;

  for (const button of refs.languageButtons) {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  }
}

function renderStats(copy, summaries) {
  const totalPoints = summaries.reduce((count, summary) => count + summary.rows.length, 0);
  const deepestSummary = summaries.reduce((best, summary) => {
    if (!best || summary.maxContextK > best.maxContextK) {
      return summary;
    }

    return best;
  }, null);
  const fastestSummary = summaries.reduce((best, summary) => {
    const bestValue = best?.firstDecodeRow?.decode_tps ?? -1;
    const nextValue = summary.firstDecodeRow?.decode_tps ?? -1;
    return nextValue > bestValue ? summary : best;
  }, null);
  const crossedCount = summaries.filter((summary) => summary.crossedThreshold).length;
  const maxCount = summaries.filter((summary) => !summary.crossedThreshold && summary.okRows.length > 0).length;
  const latestTimestamp = summaries.reduce((latest, summary) => Math.max(latest, summary.updatedAt), 0);
  const crossingShare = summaries.length === 0 ? 0 : Math.round((crossedCount / summaries.length) * 100);
  const cards = [
    {
      label: copy.stats.models,
      value: formatInteger(summaries.length),
      meta: template(copy.stats.meta.models, {
        crossed: formatInteger(crossedCount),
        max: formatInteger(maxCount),
      }),
    },
    {
      label: copy.stats.points,
      value: formatInteger(totalPoints),
      meta: template(copy.stats.meta.points, {
        date: latestTimestamp > 0 ? formatDate(latestTimestamp) : copy.labels.notAvailable,
      }),
    },
    {
      label: copy.stats.deepest,
      value: formatContext(deepestSummary?.maxContextK ?? null),
      meta: template(copy.stats.meta.deepest, {
        model: deepestSummary ? deepestSummary.modelName : copy.labels.notAvailable,
      }),
    },
    {
      label: copy.stats.fastest,
      value: formatMetric(fastestSummary?.firstDecodeRow?.decode_tps),
      meta: template(copy.stats.meta.fastest, {
        model: fastestSummary ? fastestSummary.modelName : copy.labels.notAvailable,
      }),
    },
    {
      label: copy.stats.crossings,
      value: formatInteger(crossedCount),
      meta: template(copy.stats.meta.crossings, {
        share: formatInteger(crossingShare),
      }),
    },
  ];

  refs.statsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="panel stat-card">
          <p class="stat-label">${escapeHtml(card.label)}</p>
          <p class="stat-value">${escapeHtml(card.value)}</p>
          <p class="stat-meta">${escapeHtml(card.meta)}</p>
        </article>
      `,
    )
    .join("");
}

function renderDirectory(copy, summaries) {
  refs.directorySummary.textContent = template(copy.directory.count, {
    count: formatInteger(summaries.length),
  });

  if (summaries.length === 0) {
    refs.modelList.innerHTML = `<div class="empty-state">${escapeHtml(copy.directory.empty)}</div>`;
    return;
  }

  const maxDisplayContext = Math.max(...state.summaries.map((summary) => summary.displayContextK ?? 0), 1);
  refs.modelList.innerHTML = summaries
    .map((summary) => {
      const activeClass = summary.modelName === state.selectedModel ? " is-active" : "";
      const meterWidth = Math.max(4, Math.round(((summary.displayContextK ?? 0) / maxDisplayContext) * 100));
      const statusClass = summary.crossedThreshold ? "crossed" : summary.hasIssues ? "issue" : "max";
      const statusText = summary.crossedThreshold
        ? template(copy.directory.thresholdCrossed, { context: formatContext(summary.displayContextK) })
        : template(copy.directory.maxReached, { context: formatContext(summary.displayContextK) });
      const issuesText = summary.hasIssues
        ? `<span>${escapeHtml(template(copy.directory.issues, { count: formatInteger(summary.issueCount) }))}</span>`
        : "";

      return `
        <button type="button" class="model-card${activeClass}" data-model="${escapeHtml(summary.modelName)}">
          <div class="model-card-head">
            <h3 class="model-card-name">${escapeHtml(summary.modelName)}</h3>
            <span class="status-pill status-pill--${statusClass}">${escapeHtml(statusText)}</span>
          </div>

          <div class="model-card-meta">
            <span>${escapeHtml(template(copy.directory.updated, { date: formatDate(summary.updatedAt) }))}</span>
            <span>${escapeHtml(template(copy.directory.rows, { count: formatInteger(summary.rows.length) }))}</span>
            ${issuesText}
          </div>

          <div class="model-card-meter" aria-label="${escapeHtml(copy.directory.meter)}">
            <span style="width: ${meterWidth}%;"></span>
          </div>

          <div class="model-card-metrics">
            <span><span class="metric-value">${escapeHtml(formatMetric(summary.firstDecodeRow?.decode_tps))}</span> · ${escapeHtml(copy.directory.firstDecode)}</span>
            <span><span class="metric-value">${escapeHtml(formatMetric(summary.lastDecodeRow?.decode_tps))}</span> · ${escapeHtml(copy.directory.lastDecode)}</span>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderDetail(copy, summary) {
  if (!summary) {
    refs.detailEmpty.textContent = copy.detail.empty;
    refs.detailEmpty.hidden = false;
    refs.detailContent.hidden = true;
    refs.contextStrip.innerHTML = "";
    refs.tableBody.innerHTML = "";
    refs.chartSvg.innerHTML = `<title id="chart-svg-title">${escapeHtml(copy.detail.chart.title)}</title>`;
    return;
  }

  refs.detailEmpty.hidden = true;
  refs.detailContent.hidden = false;
  refs.detailEyebrow.textContent = copy.detail.eyebrow;
  refs.detailTitle.textContent = summary.modelName;

  const badges = [
    summary.crossedThreshold
      ? `<span class="badge badge--crossed">${escapeHtml(copy.detail.badges.crossed)}</span>`
      : `<span class="badge badge--max">${escapeHtml(copy.detail.badges.max)}</span>`,
    `<span class="badge badge--neutral">${escapeHtml(template(copy.detail.badges.updated, { date: formatDate(summary.updatedAt) }))}</span>`,
  ];

  if (summary.hasIssues) {
    badges.push(`<span class="badge badge--issue">${escapeHtml(copy.detail.badges.issues)}</span>`);
  }

  refs.detailBadges.innerHTML = badges.join("");
  refs.detailStatGrid.innerHTML = [
    {
      label: copy.detail.stats.threshold,
      value: formatContext(summary.displayContextK),
    },
    {
      label: copy.detail.stats.lastDecode,
      value: formatMetric(summary.lastDecodeRow?.decode_tps),
    },
    {
      label: copy.detail.stats.bestPrefill,
      value: formatMetric(summary.bestPrefillRow?.prefill_tps),
    },
    {
      label: copy.detail.stats.samples,
      value: formatInteger(summary.rows.length),
    },
  ]
    .map(
      (item) => `
        <article class="detail-stat">
          <p class="detail-stat-label">${escapeHtml(item.label)}</p>
          <p class="detail-stat-value">${escapeHtml(item.value)}</p>
        </article>
      `,
    )
    .join("");

  refs.chartTitle.textContent = copy.detail.chart.title;
  refs.chartSubtitle.textContent =
    state.metric === "decode" ? copy.detail.chart.decodeSubtitle : copy.detail.chart.prefillSubtitle;
  refs.timelineTitle.textContent = copy.detail.timeline.title;
  refs.timelineSubtitle.textContent = copy.detail.timeline.subtitle;
  refs.tableTitle.textContent = copy.detail.table.title;
  refs.tableSubtitle.textContent = copy.detail.table.subtitle;

  renderChart(copy, summary);
  renderTimeline(copy, summary);
  renderTable(copy, summary);
}

function renderChart(copy, summary) {
  const metricField = METRIC_FIELD[state.metric];
  const metricClass = state.metric === "decode" ? "decode" : "prefill";
  const points = summary.rows
    .filter((row) => typeof row[metricField] === "number")
    .map((row) => ({
      context: row.context_k,
      value: row[metricField],
      below: row.below_10,
      label: `${summary.modelName} · ${formatContext(row.context_k)} · ${formatMetric(row[metricField])}`,
    }));

  if (points.length === 0) {
    refs.chartSvg.innerHTML = `
      <title id="chart-svg-title">${escapeHtml(copy.detail.chart.title)}</title>
      <text class="chart-empty" x="50%" y="50%" text-anchor="middle">${escapeHtml(copy.detail.chart.empty)}</text>
    `;
    return;
  }

  const width = 760;
  const height = 360;
  const padding = { top: 24, right: 24, bottom: 44, left: 58 };
  const minX = Math.min(...points.map((point) => point.context), 0);
  const maxX = Math.max(...points.map((point) => point.context), 1);
  const maxY = Math.max(...points.map((point) => point.value), 1);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const xAt = (value) => padding.left + ((value - minX) / Math.max(maxX - minX, 1)) * plotWidth;
  const yAt = (value) => padding.top + plotHeight - (value / maxY) * plotHeight;
  const yTicks = buildTicks(maxY, 4);
  const xTicks = buildTicks(maxX, Math.min(5, Math.max(points.length - 1, 1)));
  const line = buildLinePath(points, xAt, yAt);
  const area = buildAreaPath(points, xAt, yAt, padding.top + plotHeight);

  refs.chartSvg.innerHTML = `
    <title id="chart-svg-title">${escapeHtml(copy.detail.chart.title)}</title>
    ${yTicks
      .map(
        (tick) => `
          <line class="chart-grid" x1="${padding.left}" y1="${yAt(tick)}" x2="${width - padding.right}" y2="${yAt(tick)}"></line>
          <text class="chart-axis" x="${padding.left - 10}" y="${yAt(tick) + 4}" text-anchor="end">${escapeHtml(
            formatCompactNumber(tick),
          )}</text>
        `,
      )
      .join("")}
    ${xTicks
      .map(
        (tick) => `
          <line class="chart-grid" x1="${xAt(tick)}" y1="${padding.top}" x2="${xAt(tick)}" y2="${padding.top + plotHeight}"></line>
          <text class="chart-axis" x="${xAt(tick)}" y="${height - 12}" text-anchor="middle">${escapeHtml(
            formatContext(Math.round(tick)),
          )}</text>
        `,
      )
      .join("")}
    <path class="chart-area chart-area--${metricClass}" d="${area}"></path>
    <path class="chart-line chart-line--${metricClass}" d="${line}"></path>
    ${points
      .map((point) => {
        const thresholdClass = point.below ? " chart-point--threshold" : "";
        return `
          <circle class="chart-point chart-point--${metricClass}${thresholdClass}" cx="${xAt(point.context)}" cy="${yAt(point.value)}" r="5.2">
            <title>${escapeHtml(point.label)}</title>
          </circle>
        `;
      })
      .join("")}
  `;
}

function renderTimeline(copy, summary) {
  refs.contextStrip.innerHTML = summary.rows
    .map((row) => {
      const variant = row.status !== "ok" ? "issue" : row.below_10 ? "crossed" : "max";
      const title = [
        `${summary.modelName}`,
        `${copy.table.context}: ${formatContext(row.context_k)}`,
        `${copy.table.status}: ${statusLabel(row.status)}`,
        `${copy.table.decode}: ${formatMetric(row.decode_tps)}`,
        `${copy.table.prefill}: ${formatMetric(row.prefill_tps)}`,
      ].join("\n");

      return `
        <span class="context-pill context-pill--${variant}" title="${escapeHtml(title)}">
          ${escapeHtml(formatContext(row.context_k))}
        </span>
      `;
    })
    .join("");
}

function renderTable(copy, summary) {
  refs.tableBody.innerHTML = summary.rows
    .map((row) => {
      const statusClass = row.status !== "ok" ? "issue" : row.below_10 ? "crossed" : "max";
      return `
        <tr>
          <td class="numeric">${escapeHtml(formatContext(row.context_k))}</td>
          <td><span class="badge badge--${statusClass}">${escapeHtml(statusLabel(row.status))}</span></td>
          <td class="numeric">${escapeHtml(formatMetric(row.decode_tps))}</td>
          <td class="numeric">${escapeHtml(formatMetric(row.prefill_tps))}</td>
          <td>${row.below_10 ? escapeHtml(copy.labels.yes) : escapeHtml(copy.labels.no)}</td>
          <td class="numeric">${escapeHtml(row.elapsed || copy.labels.notAvailable)}</td>
          <td>${escapeHtml(formatDate(row.test_date))}</td>
        </tr>
      `;
    })
    .join("");
}

function renderInfoCards(copy) {
  refs.systemCard.innerHTML = `
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

  refs.publishCard.innerHTML = `
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

function getFilteredSummaries() {
  const query = state.query.trim().toLowerCase();

  return [...state.summaries]
    .filter((summary) => {
      if (query && !summary.modelName.toLowerCase().includes(query)) {
        return false;
      }

      switch (state.view) {
        case "crossed":
          return summary.crossedThreshold;
        case "max":
          return !summary.crossedThreshold && summary.okRows.length > 0;
        case "issues":
          return summary.hasIssues;
        default:
          return true;
      }
    })
    .sort((left, right) => sortSummaries(left, right, state.sort));
}

function syncSelection(summaries) {
  if (summaries.length === 0) {
    state.selectedModel = null;
    return;
  }

  if (!summaries.some((summary) => summary.modelName === state.selectedModel)) {
    state.selectedModel = summaries[0].modelName;
  }
}

function sortSummaries(left, right, mode) {
  switch (mode) {
    case "latest":
      return compareNumbersDesc(left.updatedAt, right.updatedAt) || left.modelName.localeCompare(right.modelName);
    case "decode":
      return (
        compareNumbersDesc(left.firstDecodeRow?.decode_tps ?? -1, right.firstDecodeRow?.decode_tps ?? -1) ||
        compareNumbersDesc(left.displayContextK ?? -1, right.displayContextK ?? -1) ||
        left.modelName.localeCompare(right.modelName)
      );
    case "name":
      return left.modelName.localeCompare(right.modelName);
    default:
      return (
        compareNumbersDesc(left.displayContextK ?? -1, right.displayContextK ?? -1) ||
        compareNumbersDesc(left.lastDecodeRow?.decode_tps ?? -1, right.lastDecodeRow?.decode_tps ?? -1) ||
        left.modelName.localeCompare(right.modelName)
      );
  }
}

function renderSegmentButtons(options, activeValue) {
  return Object.entries(options)
    .map(([value, label]) => {
      const activeClass = value === activeValue ? " is-active" : "";
      return `<button type="button" class="segment-button${activeClass}" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
    })
    .join("");
}

function renderLoadingStats(copy) {
  return [copy.stats.models, copy.stats.points, copy.stats.deepest]
    .map(
      (label) => `
        <article class="panel stat-card">
          <p class="stat-label">${escapeHtml(label)}</p>
          <p class="stat-value">...</p>
          <p class="stat-meta">${escapeHtml(copy.directory.loading)}</p>
        </article>
      `,
    )
    .join("");
}

function renderErrorStats(copy) {
  return `
    <article class="panel stat-card">
      <p class="stat-label">${escapeHtml(copy.stats.models)}</p>
      <p class="stat-value">${escapeHtml(copy.labels.notAvailable)}</p>
      <p class="stat-meta">${escapeHtml(copy.errors.loadFailed)}</p>
    </article>
  `;
}

function getCopy() {
  return COPY[state.lang] ?? COPY.en;
}

function getInitialLanguage() {
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

function statusLabel(status) {
  return getCopy().statuses[status] ?? status;
}

function formatMetric(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return getCopy().labels.notAvailable;
  }

  return `${formatNumber(value, value >= 100 ? 1 : 2)} tok/s`;
}

function formatContext(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return getCopy().labels.notAvailable;
  }

  return `${value}K`;
}

function formatDate(value) {
  const timestamp = typeof value === "number" ? value : dateValue(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return getCopy().labels.notAvailable;
  }

  return new Intl.DateTimeFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function formatNumber(value, fractionDigits = 2) {
  return new Intl.NumberFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatInteger(value) {
  return new Intl.NumberFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) {
    return getCopy().labels.notAvailable;
  }

  return new Intl.NumberFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}

function template(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildLinePath(points, xAt, yAt) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${xAt(point.context)} ${yAt(point.value)}`).join(" ");
}

function buildAreaPath(points, xAt, yAt, baseline) {
  if (points.length === 0) {
    return "";
  }

  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const upperPath = buildLinePath(points, xAt, yAt);
  return `${upperPath} L ${xAt(lastPoint.context)} ${baseline} L ${xAt(firstPoint.context)} ${baseline} Z`;
}

function buildTicks(maxValue, segments) {
  const ticks = [];
  const safeSegments = Math.max(segments, 1);

  for (let index = 0; index <= safeSegments; index += 1) {
    ticks.push((maxValue / safeSegments) * index);
  }

  return [...new Set(ticks.map((tick) => Number(tick.toFixed(2))))];
}

function compareNumbersDesc(left, right) {
  return right - left;
}

function dateValue(value) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function parseOptionalNumber(value) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toRefKey(id) {
  return id.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}
