import {
  REPO_URL,
  README_URLS,
  createModelHref,
  escapeHtml,
  fetchRows,
  formatContext,
  formatDate,
  formatInteger,
  formatTps,
  getCopy,
  getInitialLanguage,
  renderInfoCards,
  setLanguagePreference,
  summarizeRows,
  syncLanguageInUrl,
  template,
} from "./shared.js";

const state = {
  lang: getInitialLanguage(),
  rows: [],
  summaries: [],
  query: "",
  sort: "maxContext",
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
    "table-eyebrow",
    "table-title",
    "table-summary",
    "table-note",
    "summary-head-model",
    "summary-head-zero-decode",
    "summary-head-zero-prefill",
    "summary-head-max-context",
    "summary-head-max-decode",
    "summary-head-max-prefill",
    "summary-body",
    "empty-state",
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

  refs.summaryBody.addEventListener("click", (event) => {
    const row = event.target instanceof Element ? event.target.closest("tr[data-href]") : null;
    if (!row) {
      return;
    }

    window.location.href = row.dataset.href;
  });

  refs.summaryBody.addEventListener("keydown", (event) => {
    const row = event.target instanceof Element ? event.target.closest("tr[data-href]") : null;
    if (!row) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = row.dataset.href;
    }
  });

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
  } catch (error) {
    state.error = error instanceof Error ? error : new Error(String(error));
    state.rows = [];
    state.summaries = [];
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  const copy = getCopy(state.lang);
  const summaries = getFilteredSummaries();

  renderChrome(copy);
  renderInfoCards(copy, refs.systemCard, refs.publishCard);

  if (state.loading) {
    refs.statsGrid.innerHTML = renderLoadingStats(copy);
    refs.summaryBody.innerHTML = "";
    refs.emptyState.hidden = false;
    refs.emptyState.textContent = copy.main.table.loading;
    refs.tableSummary.textContent = copy.main.table.loading;
    return;
  }

  if (state.error) {
    refs.statsGrid.innerHTML = renderErrorStats(copy);
    refs.summaryBody.innerHTML = "";
    refs.emptyState.hidden = false;
    refs.emptyState.textContent = copy.errors.loadFailed;
    refs.tableSummary.textContent = copy.errors.loadFailed;
    return;
  }

  renderStats(copy, summaries);
  renderTable(copy, summaries);
}

function renderChrome(copy) {
  document.documentElement.lang = state.lang;
  document.title = copy.meta.mainTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", copy.meta.mainDescription);
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

  refs.searchLabel.textContent = copy.main.controls.search;
  refs.searchInput.placeholder = copy.main.controls.searchPlaceholder;
  refs.searchInput.value = state.query;
  refs.sortLabel.textContent = copy.main.controls.sort;
  refs.sortSelect.innerHTML = Object.entries(copy.main.controls.sortOptions)
    .map(([value, label]) => {
      const selected = value === state.sort ? ' selected="selected"' : "";
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");

  refs.tableEyebrow.textContent = copy.main.table.eyebrow;
  refs.tableTitle.textContent = copy.main.table.title;
  refs.tableNote.textContent = copy.main.table.note;
  refs.summaryHeadModel.textContent = copy.main.table.headers.model;
  refs.summaryHeadZeroDecode.textContent = copy.main.table.headers.zeroDecode;
  refs.summaryHeadZeroPrefill.textContent = copy.main.table.headers.zeroPrefill;
  refs.summaryHeadMaxContext.textContent = copy.main.table.headers.maxContext;
  refs.summaryHeadMaxDecode.textContent = copy.main.table.headers.maxDecode;
  refs.summaryHeadMaxPrefill.textContent = copy.main.table.headers.maxPrefill;

  for (const button of refs.languageButtons) {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  }
}

function renderStats(copy, summaries) {
  const deepestSummary = summaries.reduce((best, summary) => {
    if (!best || summary.maxContextK > best.maxContextK) {
      return summary;
    }

    return best;
  }, null);
  const latestTimestamp = summaries.reduce((latest, summary) => Math.max(latest, summary.updatedAt), 0);
  const cards = [
    {
      label: copy.main.stats.models,
      value: formatInteger(summaries.length, state.lang),
      meta: template(copy.main.table.summary, { count: formatInteger(summaries.length, state.lang) }),
    },
    {
      label: copy.main.stats.deepest,
      value: formatContext(deepestSummary?.maxContextK ?? null, state.lang),
      meta: deepestSummary ? deepestSummary.modelName : copy.labels.notAvailable,
    },
    {
      label: copy.main.stats.latest,
      value: formatDate(latestTimestamp, state.lang),
      meta: latestTimestamp > 0 ? "benchmark_results.csv" : copy.labels.notAvailable,
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

function renderTable(copy, summaries) {
  refs.tableSummary.textContent = template(copy.main.table.summary, {
    count: formatInteger(summaries.length, state.lang),
  });

  if (summaries.length === 0) {
    refs.summaryBody.innerHTML = "";
    refs.emptyState.hidden = false;
    refs.emptyState.textContent = copy.main.table.empty;
    return;
  }

  refs.emptyState.hidden = true;
  refs.summaryBody.innerHTML = summaries
    .map((summary) => {
      const href = createModelHref(summary.modelName, state.lang);
      const badge = summary.hasIssues
        ? `<span class="badge badge--issue">${escapeHtml(copy.main.table.badges.issue)}</span>`
        : summary.thresholdRow
          ? `<span class="badge badge--crossed">${escapeHtml(
              template(copy.main.table.badges.threshold, {
                context: formatContext(summary.thresholdRow.context_k, state.lang),
              }),
            )}</span>`
          : `<span class="badge badge--max">${escapeHtml(
              template(copy.main.table.badges.deepest, { context: formatContext(summary.maxContextK, state.lang) }),
            )}</span>`;

      return `
        <tr class="summary-row" data-href="${escapeHtml(href)}" tabindex="0">
          <td>
            <div class="model-name-cell">
              <span class="model-name">${escapeHtml(summary.modelName)}</span>
              ${badge}
            </div>
          </td>
          <td class="numeric">${escapeHtml(formatTps(summary.tableContextRow?.decode_tps, state.lang))}</td>
          <td class="numeric">${escapeHtml(formatTps(summary.tableContextRow?.prefill_tps, state.lang))}</td>
          <td class="numeric">${escapeHtml(formatContext(summary.maxContextK, state.lang))}</td>
          <td class="numeric">${escapeHtml(formatTps(summary.maxContextRow?.decode_tps, state.lang))}</td>
          <td class="numeric">${escapeHtml(formatTps(summary.maxContextRow?.prefill_tps, state.lang))}</td>
        </tr>
      `;
    })
    .join("");
}

function getFilteredSummaries() {
  const query = state.query.trim().toLowerCase();

  return [...state.summaries]
    .filter((summary) => !query || summary.modelName.toLowerCase().includes(query))
    .sort((left, right) => sortSummaries(left, right));
}

function sortSummaries(left, right) {
  switch (state.sort) {
    case "zeroDecode":
      return compareNumbersDesc(left.tableContextRow?.decode_tps ?? -1, right.tableContextRow?.decode_tps ?? -1);
    case "zeroPrefill":
      return compareNumbersDesc(left.tableContextRow?.prefill_tps ?? -1, right.tableContextRow?.prefill_tps ?? -1);
    case "latest":
      return compareNumbersDesc(left.updatedAt, right.updatedAt) || left.modelName.localeCompare(right.modelName);
    case "name":
      return left.modelName.localeCompare(right.modelName);
    default:
      return compareNumbersDesc(left.maxContextK, right.maxContextK) || left.modelName.localeCompare(right.modelName);
  }
}

function renderLoadingStats(copy) {
  return [copy.main.stats.models, copy.main.stats.deepest, copy.main.stats.latest]
    .map(
      (label) => `
        <article class="panel stat-card">
          <p class="stat-label">${escapeHtml(label)}</p>
          <p class="stat-value">...</p>
          <p class="stat-meta">${escapeHtml(copy.main.table.loading)}</p>
        </article>
      `,
    )
    .join("");
}

function renderErrorStats(copy) {
  return `
    <article class="panel stat-card">
      <p class="stat-label">${escapeHtml(copy.main.stats.models)}</p>
      <p class="stat-value">${escapeHtml(copy.labels.notAvailable)}</p>
      <p class="stat-meta">${escapeHtml(copy.errors.loadFailed)}</p>
    </article>
  `;
}

function compareNumbersDesc(left, right) {
  return right - left;
}

function toRefKey(id) {
  return id.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}
