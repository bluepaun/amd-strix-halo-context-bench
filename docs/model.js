import {
  REPO_URL,
  README_URLS,
  buildChartMarkup,
  createIndexHref,
  escapeHtml,
  fetchRows,
  formatContext,
  formatDate,
  formatInteger,
  formatMetric,
  formatTps,
  getCopy,
  getInitialLanguage,
  setLanguagePreference,
  statusLabel,
  summarizeRows,
  syncLanguageInUrl,
  template,
} from "./shared.js";

const state = {
  lang: getInitialLanguage(),
  requestedModel: new URLSearchParams(window.location.search).get("model") ?? "",
  rows: [],
  summaries: [],
  summary: null,
  loading: true,
  error: null,
};

const refs = {};

document.addEventListener("DOMContentLoaded", () => {
  bindRefs();
  bindEvents();
  render();
  void loadPage();
});

function bindRefs() {
  const ids = [
    "back-link",
    "detail-eyebrow",
    "detail-title",
    "detail-lead",
    "detail-badges",
    "repo-link",
    "readme-link",
    "csv-link",
    "detail-empty",
    "detail-content",
    "detail-stat-grid",
    "decode-title",
    "decode-subtitle",
    "decode-chart-svg",
    "prefill-title",
    "prefill-subtitle",
    "prefill-chart-svg",
    "raw-eyebrow",
    "raw-title",
    "raw-subtitle",
    "raw-head-context",
    "raw-head-phase",
    "raw-head-status",
    "raw-head-decode",
    "raw-head-prefill",
    "raw-head-below",
    "raw-head-elapsed",
    "raw-head-date",
    "raw-body",
  ];

  for (const id of ids) {
    refs[toRefKey(id)] = document.getElementById(id);
  }

  refs.languageButtons = Array.from(document.querySelectorAll(".language-button"));
}

function bindEvents() {
  for (const button of refs.languageButtons) {
    button.addEventListener("click", () => {
      const nextLanguage = button.dataset.lang;
      if (!nextLanguage || nextLanguage === state.lang) {
        return;
      }

      state.lang = nextLanguage;
      setLanguagePreference(nextLanguage);
      syncLanguageInUrl(nextLanguage);
      render();
    });
  }
}

async function loadPage() {
  state.loading = true;
  state.error = null;
  render();

  try {
    state.rows = await fetchRows();
    state.summaries = summarizeRows(state.rows);
    state.summary = state.summaries.find((summary) => summary.modelName === state.requestedModel) ?? null;
  } catch (error) {
    state.error = error instanceof Error ? error : new Error(String(error));
    state.rows = [];
    state.summaries = [];
    state.summary = null;
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  const copy = getCopy(state.lang);
  renderChrome(copy);

  if (state.loading) {
    renderEmpty(copy.main?.table?.loading ?? copy.errors.loadFailed);
    return;
  }

  if (state.error) {
    renderEmpty(copy.errors.loadFailed);
    return;
  }

  if (!state.summary) {
    renderMissing(copy);
    return;
  }

  renderDetail(copy, state.summary);
}

function renderChrome(copy) {
  document.documentElement.lang = state.lang;
  document.title = state.summary ? `${state.summary.modelName} - ${copy.meta.mainTitle}` : copy.meta.detailTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", copy.meta.detailDescription);
  }

  refs.backLink.textContent = copy.detail.back;
  refs.backLink.href = createIndexHref(state.lang);
  refs.detailEyebrow.textContent = copy.detail.eyebrow;
  refs.repoLink.textContent = copy.hero.actions.repo;
  refs.repoLink.href = REPO_URL;
  refs.readmeLink.textContent = copy.hero.actions.readme;
  refs.readmeLink.href = README_URLS[state.lang];
  refs.csvLink.textContent = copy.hero.actions.csv;

  refs.decodeTitle.textContent = copy.detail.charts.decodeTitle;
  refs.decodeSubtitle.textContent = copy.detail.charts.decodeSubtitle;
  refs.prefillTitle.textContent = copy.detail.charts.prefillTitle;
  refs.prefillSubtitle.textContent = copy.detail.charts.prefillSubtitle;
  refs.rawEyebrow.textContent = copy.detail.raw.eyebrow;
  refs.rawTitle.textContent = copy.detail.raw.title;
  refs.rawSubtitle.textContent = copy.detail.raw.subtitle;
  refs.rawHeadContext.textContent = copy.detail.raw.headers.context;
  refs.rawHeadPhase.textContent = copy.detail.raw.headers.phase;
  refs.rawHeadStatus.textContent = copy.detail.raw.headers.status;
  refs.rawHeadDecode.textContent = copy.detail.raw.headers.decode;
  refs.rawHeadPrefill.textContent = copy.detail.raw.headers.prefill;
  refs.rawHeadBelow.textContent = copy.detail.raw.headers.below;
  refs.rawHeadElapsed.textContent = copy.detail.raw.headers.elapsed;
  refs.rawHeadDate.textContent = copy.detail.raw.headers.date;

  for (const button of refs.languageButtons) {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  }
}

function renderEmpty(text) {
  refs.detailTitle.textContent = getCopy(state.lang).meta.detailTitle;
  refs.detailLead.textContent = text;
  refs.detailBadges.innerHTML = "";
  refs.detailEmpty.textContent = text;
  refs.detailEmpty.hidden = false;
  refs.detailContent.hidden = true;
}

function renderMissing(copy) {
  refs.detailTitle.textContent = copy.detail.missingTitle;
  refs.detailLead.textContent = copy.detail.missingLead;
  refs.detailBadges.innerHTML = "";
  refs.detailEmpty.textContent = copy.detail.missingLead;
  refs.detailEmpty.hidden = false;
  refs.detailContent.hidden = true;
}

function renderDetail(copy, summary) {
  refs.detailTitle.textContent = summary.modelName;
  refs.detailLead.textContent = template(copy.detail.lead, {
    context: formatContext(summary.maxContextK, state.lang),
    count: formatInteger(summary.rows.length, state.lang),
  });

  const badges = [
    `<span class="badge badge--neutral">${escapeHtml(template(copy.detail.badges.updated, {
      date: formatDate(summary.updatedAt, state.lang),
    }))}</span>`,
    `<span class="badge badge--neutral">${escapeHtml(template(copy.detail.badges.rows, {
      count: formatInteger(summary.rows.length, state.lang),
    }))}</span>`,
    summary.thresholdRow
      ? `<span class="badge badge--crossed">${escapeHtml(template(copy.detail.badges.threshold, {
          context: formatContext(summary.thresholdRow.context_k, state.lang),
        }))}</span>`
      : `<span class="badge badge--max">${escapeHtml(template(copy.detail.badges.deepest, {
          context: formatContext(summary.maxContextK, state.lang),
        }))}</span>`,
  ];

  if (summary.hasIssues) {
    badges.push(
      `<span class="badge badge--issue">${escapeHtml(template(copy.detail.badges.issue, {
        count: formatInteger(summary.issueCount, state.lang),
      }))}</span>`,
    );
  }

  refs.detailBadges.innerHTML = badges.join("");
  refs.detailStatGrid.innerHTML = [
    {
      label: copy.detail.stats.zeroDecode,
      value: formatTps(summary.zeroContextRow?.decode_tps, state.lang),
    },
    {
      label: copy.detail.stats.zeroPrefill,
      value: formatTps(summary.zeroContextRow?.prefill_tps, state.lang),
    },
    {
      label: copy.detail.stats.maxContext,
      value: formatContext(summary.maxContextK, state.lang),
    },
    {
      label: copy.detail.stats.maxDecode,
      value: formatTps(summary.maxContextRow?.decode_tps, state.lang),
    },
    {
      label: copy.detail.stats.maxPrefill,
      value: formatTps(summary.maxContextRow?.prefill_tps, state.lang),
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

  refs.decodeChartSvg.innerHTML = buildChartMarkup({
    points: buildMetricPoints(summary, "decode_tps"),
    title: copy.detail.charts.decodeTitle,
    emptyText: copy.detail.charts.empty,
    tone: "decode",
    lang: state.lang,
  });
  refs.prefillChartSvg.innerHTML = buildChartMarkup({
    points: buildMetricPoints(summary, "prefill_tps"),
    title: copy.detail.charts.prefillTitle,
    emptyText: copy.detail.charts.empty,
    tone: "prefill",
    lang: state.lang,
  });
  refs.rawBody.innerHTML = summary.rows
    .map(
      (row) => `
        <tr>
          <td class="numeric">${escapeHtml(formatContext(row.context_k, state.lang))}</td>
          <td>${escapeHtml(row.search_phase || getCopy(state.lang).labels.notAvailable)}</td>
          <td><span class="badge ${row.status === "ok" ? "badge--max" : "badge--issue"}">${escapeHtml(
            statusLabel(row.status, state.lang),
          )}</span></td>
          <td class="numeric">${escapeHtml(formatMetric(row.decode_tps, state.lang))}</td>
          <td class="numeric">${escapeHtml(formatMetric(row.prefill_tps, state.lang))}</td>
          <td>${row.below_10 ? escapeHtml(copy.labels.yes) : escapeHtml(copy.labels.no)}</td>
          <td class="numeric">${escapeHtml(row.elapsed || copy.labels.notAvailable)}</td>
          <td>${escapeHtml(formatDate(row.test_date, state.lang))}</td>
        </tr>
      `,
    )
    .join("");

  refs.detailEmpty.textContent = "";
  refs.detailEmpty.hidden = true;
  refs.detailContent.hidden = false;
}

function buildMetricPoints(summary, field) {
  return summary.rows
    .filter((row) => typeof row[field] === "number")
    .map((row) => ({
      x: row.context_k,
      y: row[field],
      below: row.below_10,
      label: `${summary.modelName} · ${formatContext(row.context_k, state.lang)} · ${formatMetric(row[field], state.lang)}`,
    }));
}

function toRefKey(id) {
  return id.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}
