import "./style.css";

type Event = {
  id: number;
  announced_on: string;
  effective_at: string | null;
  is_no_change: number;
  price_89: number | null;
  price_92: number | null;
  price_95: number | null;
  price_0: number | null;
  price_m10: number | null;
  source_url: string;
};

type FuelData = { events: Event[]; lastSuccessAt: string | null };
type CatalogModel = {
  id: string;
  name: string;
  provider: "Anthropic" | "OpenAI";
  createdAt?: string | null;
  contextLength?: number | null;
  inputPriceUsdPerMillionTokens?: number | null;
  outputPriceUsdPerMillionTokens?: number | null;
  reasoning?: boolean;
  effort?: string | null;
  intelligenceIndex?: number | null;
  indexEstimated?: boolean;
  taskCostUsd?: number | null;
  costEfficiency?: number | null;
  timePerTaskSeconds?: number | null;
  outputTokensPerSecond?: number | null;
  raw?: Record<string, unknown> | null;
};
type ModelCatalog = { source: string; retrievedAt: string; models: CatalogModel[] };
type BenchmarkModel = {
  slug: string;
  name: string;
  provider: "Anthropic" | "OpenAI";
  releaseDate: string | null;
  reasoning: boolean;
  effort: string | null;
  intelligenceIndex: number | null;
  indexEstimated: boolean;
  taskCostUsd: number | null;
  inputPriceUsdPerMillionTokens: number | null;
  outputPriceUsdPerMillionTokens: number | null;
  contextWindowTokens: number | null;
  timePerTaskSeconds: number | null;
  outputTokensPerSecond: number | null;
};
type ModelBaseline = { source: string; sourceUrl: string; retrievedAt: string; models: BenchmarkModel[] };
type ModelStore = { baseline: ModelBaseline | null; currentCatalog: ModelCatalog | null; previousCatalog: ModelCatalog | null; storage: string };

const root = document.querySelector<HTMLDivElement>("#app")!;
const modelChartWidth = () => Math.min(900, Math.max(320, window.innerWidth - (window.innerWidth <= 420 ? 64 : window.innerWidth <= 760 ? 76 : window.innerWidth < 1200 ? 124 : 320)));
const chartLayout = () => {
  const viewport = window.innerWidth;
  const width = Math.min(920, viewport - (viewport <= 420 ? 60 : viewport <= 760 ? 72 : 124));
  return { width, height: 300, pad: { top: 28, right: width <= 500 ? 60 : 82, bottom: 44, left: width <= 500 ? 46 : 58 } };
};
const firstYear = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric" }).format(new Date())) - 2;
const firstDate = `${firstYear}-01-01`;
const availableYears = [String(firstYear + 2), String(firstYear + 1), String(firstYear)];
const modelSortKeys = ["name", "provider", "intelligence", "cost", "efficiency", "context"] as const;
type ModelSortKey = (typeof modelSortKeys)[number];
type ModelSortDirection = "asc" | "desc";
type FilterPreferences = {
  year: string;
  fuel: "price_92" | "price_95" | "price_0";
  modelProvider: "all" | "Anthropic" | "OpenAI";
  excludedChartModelIds: string[];
  modelSearchQuery: string;
  modelSortKey: ModelSortKey;
  modelSortDirection: ModelSortDirection;
};
const FILTER_PREFERENCES_KEY = "fresh-scope:filters:v1";
function readFilterPreferences(): Partial<FilterPreferences> {
  try {
    const saved = localStorage.getItem(FILTER_PREFERENCES_KEY);
    const value = saved ? JSON.parse(saved) : null;
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
const savedFilters = readFilterPreferences();
let selectedYear = typeof savedFilters.year === "string" && availableYears.includes(savedFilters.year) ? savedFilters.year : availableYears[0];
let selectedFuel: FilterPreferences["fuel"] = savedFilters.fuel === "price_92" || savedFilters.fuel === "price_0" ? savedFilters.fuel : "price_95";
let fuelData: FuelData = { events: [], lastSuccessAt: null };
let loadError: string | null = null;
let activePage: "fuel" | "models" = window.location.hash === "#models" ? "models" : "fuel";
let selectedModelProvider: FilterPreferences["modelProvider"] = savedFilters.modelProvider === "Anthropic" || savedFilters.modelProvider === "OpenAI" ? savedFilters.modelProvider : "all";
let modelSortKey: ModelSortKey = modelSortKeys.includes(savedFilters.modelSortKey as ModelSortKey) ? savedFilters.modelSortKey! : "efficiency";
let modelSortDirection: ModelSortDirection = savedFilters.modelSortDirection === "asc" ? "asc" : "desc";
let excludedChartModelIds = new Set(Array.isArray(savedFilters.excludedChartModelIds)
  ? savedFilters.excludedChartModelIds.filter((id): id is string => typeof id === "string").map((id) => id.toLowerCase())
  : []);
let modelSelectorOpen = false;
let modelSearchQuery = typeof savedFilters.modelSearchQuery === "string" ? savedFilters.modelSearchQuery.slice(0, 120) : "";
let modelCatalog: ModelCatalog | null = null;
let benchmarkModels: CatalogModel[] = [];
let benchmarkRetrievedAt: string | null = null;
let modelDataState: "not-loaded" | "loading" | "ready" | "unavailable" = "not-loaded";
let modelStorePromise: Promise<void> | null = null;
let modelCatalogDiff: { firstSync: boolean; added: CatalogModel[]; removed: CatalogModel[]; changed: { model: CatalogModel; field: string; before: string; after: string }[] } | null = null;
let modelCatalogError: string | null = null;
let modelCatalogLoading = false;

function saveFilterPreferences() {
  try {
    localStorage.setItem(FILTER_PREFERENCES_KEY, JSON.stringify({
      year: selectedYear,
      fuel: selectedFuel,
      modelProvider: selectedModelProvider,
      excludedChartModelIds: [...excludedChartModelIds],
      modelSearchQuery,
      modelSortKey,
      modelSortDirection,
    } satisfies FilterPreferences));
  } catch {
    // Filtering still works when browser storage is unavailable.
  }
}

const fuelNames = { price_92: "92 号汽油", price_95: "95 号汽油", price_0: "0 号柴油" };
const formatPrice = (price: number | null) => (price == null ? "—" : price.toFixed(2));
const formatDate = (value: string | null) => {
  if (!value) return "尚未同步";
  const date = new Date(value);
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
};
const formatShortDate = (value: string) => value.slice(5).replace("-", ".");
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

const formatMoney = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return "—";
  const decimals = value >= 1 ? 2 : value >= 0.1 ? 3 : value >= 0.01 ? 4 : value >= 0.001 ? 5 : 7;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: Math.min(2, decimals), maximumFractionDigits: decimals })}`;
};
const formatTokens = (value: number | null | undefined) => value == null || !Number.isFinite(value) ? "—" : new Intl.NumberFormat("zh-CN").format(value);
function compareModelCatalog(previous: ModelCatalog | null, current: ModelCatalog) {
  if (!previous) return { firstSync: true, added: [], removed: [], changed: [] };

  const oldModels = filterClientModels(previous.models);
  const currentModels = filterClientModels(current.models);
  const oldById = new Map(oldModels.map((model) => [model.id.toLowerCase(), model]));
  const currentById = new Map(currentModels.map((model) => [model.id.toLowerCase(), model]));
  const added = currentModels.filter((model) => !oldById.has(model.id.toLowerCase()));
  const removed = oldModels.filter((model) => !currentById.has(model.id.toLowerCase()));
  const changed: { model: CatalogModel; field: string; before: string; after: string }[] = [];
  const fields: { key: keyof CatalogModel; label: string; format: (value: CatalogModel[keyof CatalogModel]) => string }[] = [
    { key: "name", label: "名称", format: (value) => String(value ?? "—") },
    { key: "contextLength", label: "上下文长度", format: (value) => formatTokens(value as number | null) },
    { key: "inputPriceUsdPerMillionTokens", label: "输入价 / 百万 token", format: (value) => formatMoney(value as number | null) },
    { key: "outputPriceUsdPerMillionTokens", label: "输出价 / 百万 token", format: (value) => formatMoney(value as number | null) },
  ];
  currentModels.forEach((model) => {
    const before = oldById.get(model.id.toLowerCase());
    if (!before) return;
    fields.forEach(({ key, label, format }) => {
      if (before[key] !== model[key]) changed.push({ model, field: label, before: format(before[key]), after: format(model[key]) });
    });
  });
  return { firstSync: false, added, removed, changed };
}
function providerLabel(provider: CatalogModel["provider"]) {
  return provider === "Anthropic" ? "Claude" : "GPT";
}

function filterClientModels(models: CatalogModel[]) {
  return models.filter((model) => {
    const [namespace, slug, ...variants] = model.id.toLowerCase().split("/");
    const name = cleanModelName(model.name);
    return !variants.length && Boolean(slug) && isTextModel(`${slug ?? ""} ${name}`) && isStandardClientModelSlug(slug ?? "", name) &&
      ((namespace === "anthropic" && model.provider === "Anthropic") || (namespace === "openai" && model.provider === "OpenAI"));
  }).map((model) => ({ ...model, name: cleanModelName(model.name) }));
}

function cleanModelName(value: string) {
  return value.replace(/&#x([\da-f]+);/gi, (_, hex: string) => {
    const codePoint = parseInt(hex, 16);
    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : "";
  }).replace(/&#(\d+);/g, (_, decimal: string) => {
    const codePoint = Number(decimal);
    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : "";
  }).replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

function isTextModel(value: string) {
  return !/(?:^|[\s/_-])(?:audio|image|video|speech|vision|realtime|transcribe|transcription|tts|whisper|dall[\s-]?e|sora|non[\s_-]*reasoning)(?:$|[\s/_-])/i.test(value);
}

function isStandardClientModelSlug(slug: string, name = "") {
  return /^(?:claude|gpt)-/i.test(slug) && !/(?:^|[-_:\s])(?:batch|latest|pro|free|nitro|online|extended|exacto|preview|codex)(?:$|[-_:\s])/i.test(`${slug} ${name}`);
}

function modelsForRanking() {
  if (!modelCatalog?.models.length) return benchmarkModels;
  const benchmarkBySlug = new Map(benchmarkModels.map((model) => [model.id.toLowerCase(), model]));
  return modelCatalog.models.map((model) => {
    const slug = model.id.toLowerCase().split("/")[1] ?? model.id.toLowerCase();
    const benchmark = benchmarkBySlug.get(slug);
    return benchmark ? { ...model, ...benchmark, id: model.id, name: benchmark.name } : model;
  });
}

function modelCostEfficiency(model: CatalogModel) {
  return model.intelligenceIndex != null && model.taskCostUsd != null && model.taskCostUsd > 0
    ? model.intelligenceIndex / model.taskCostUsd
    : null;
}

function defaultModelSortDirection(key: ModelSortKey): ModelSortDirection {
  return key === "name" || key === "provider" ? "asc" : "desc";
}

function sortModelsForRanking(models: CatalogModel[]) {
  const direction = modelSortDirection === "asc" ? 1 : -1;
  const numericValue = (model: CatalogModel) => {
    if (modelSortKey === "intelligence") return model.intelligenceIndex;
    if (modelSortKey === "cost") return model.taskCostUsd;
    if (modelSortKey === "efficiency") return modelCostEfficiency(model);
    return model.contextLength;
  };
  return models.sort((a, b) => {
    let comparison = 0;
    if (modelSortKey === "name" || modelSortKey === "provider") {
      const first = modelSortKey === "name" ? a.name : a.provider;
      const second = modelSortKey === "name" ? b.name : b.provider;
      comparison = first.localeCompare(second, "en", { numeric: true, sensitivity: "base" });
    } else {
      const first = numericValue(a);
      const second = numericValue(b);
      if (first == null) return second == null ? a.name.localeCompare(b.name, "en") : 1;
      if (second == null) return -1;
      comparison = first - second;
    }
    return comparison * direction || a.name.localeCompare(b.name, "en", { numeric: true }) || a.id.localeCompare(b.id, "en");
  });
}

function setModelSort(key: ModelSortKey, direction: ModelSortDirection, focusSelector: string) {
  modelSortKey = key;
  modelSortDirection = direction;
  saveFilterPreferences();
  render();
  root.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
}

function modelsForSelectedProvider() {
  const providerModels = benchmarkModels.filter((model) => selectedModelProvider === "all" || model.provider === selectedModelProvider);
  return modelSeriesForChart(providerModels).flat();
}

function modelsSelectedForChart() {
  return modelsForSelectedProvider().filter((model) => !excludedChartModelIds.has(model.id.toLowerCase()));
}

function modelHasScatterData(model: CatalogModel) {
  return model.taskCostUsd != null && model.taskCostUsd > 0 && model.intelligenceIndex != null;
}

function modelSeriesForChart(models: CatalogModel[]) {
  const variants = new Map<string, CatalogModel[]>();
  models.filter(modelHasScatterData).forEach((model) => {
    const family = model.id.toLowerCase().replace(/-(?:xhigh|high|medium|low)$/, "");
    variants.set(family, [...(variants.get(family) ?? []), model]);
  });
  return [...variants.values()].filter((family) => family.length > 1);
}

function renderPriceScatter(models: CatalogModel[]) {
  const series = modelSeriesForChart(models);
  const chartable = series.flat();
  if (!chartable.length) {
    const message = modelDataState === "loading"
      ? "正在载入 Claude 与 GPT 评测数据…"
      : models.length ? "请至少选择同一系列中两个有能力指数和任务成本的模型。" : "请在上方选择要显示的模型。";
    return `<div class="model-chart-empty">${message}</div>`;
  }

  const width = modelChartWidth();
  const compact = window.innerWidth <= 760;
  const height = compact ? 360 : 330;
  const pad = { top: 24, right: 24, bottom: compact ? 80 : 52, left: width <= 420 ? 58 : 68 };
  const costs = chartable.map((model) => model.taskCostUsd!);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const costLogRange = Math.log10(maxCost) - Math.log10(minCost);
  const costPadding = Math.max(costLogRange * 0.06, 0.15);
  const xLogMin = Math.log10(minCost) - costPadding;
  const xLogMax = Math.log10(maxCost) + costPadding;
  const intelligenceValues = chartable.map((model) => model.intelligenceIndex!);
  const minIntelligence = Math.min(...intelligenceValues);
  const maxIntelligence = Math.max(...intelligenceValues);
  const intelligencePadding = Math.max((maxIntelligence - minIntelligence) * 0.08, 1);
  const yMin = Math.floor(minIntelligence - intelligencePadding);
  const yMax = Math.ceil(maxIntelligence + intelligencePadding);
  const x = (value: number) => pad.left + ((Math.log10(value) - xLogMin) / (xLogMax - xLogMin)) * (width - pad.left - pad.right);
  const y = (value: number) => pad.top + ((yMax - value) / (yMax - yMin)) * (height - pad.top - pad.bottom);
  const yTicks = Array.from({ length: 5 }, (_, index) => yMin + ((yMax - yMin) * index) / 4);
  const yTickDecimals = yMax - yMin < 8 ? 1 : 0;
  const xTickMultipliers = width <= 420 || xLogMax - xLogMin > 3 ? [1] : [1, 2, 5];
  const xTickLogs: number[] = [];
  for (let exponent = Math.floor(xLogMin); exponent <= Math.ceil(xLogMax); exponent++) {
    for (const multiplier of xTickMultipliers) {
      const logValue = exponent + Math.log10(multiplier);
      if (logValue >= xLogMin && logValue <= xLogMax) xTickLogs.push(logValue);
    }
  }
  if (xTickLogs.length < 2) {
    xTickLogs.unshift(xLogMin);
    xTickLogs.push(xLogMax);
  }
  const grid = `${yTicks.map((intelligence) => {
    return `<line x1="${pad.left}" y1="${y(intelligence)}" x2="${width - pad.right}" y2="${y(intelligence)}" class="model-grid"/><text x="${pad.left - 9}" y="${y(intelligence) + 4}" text-anchor="end" class="model-axis">${intelligence.toFixed(yTickDecimals)}</text>`;
  }).join("")}${xTickLogs.map((logValue) => {
    const cost = 10 ** logValue;
    return `<line x1="${x(cost)}" y1="${pad.top}" x2="${x(cost)}" y2="${height - pad.bottom}" class="model-grid model-grid-vertical"/><text x="${x(cost)}" y="${height - (compact ? 46 : 17)}" text-anchor="middle" class="model-axis">${formatMoney(cost)}</text>`;
  }).join("")}`;

  const seriesLines = series.map((family) => {
    const ordered = [...family].sort((a, b) => (a.taskCostUsd ?? 0) - (b.taskCostUsd ?? 0));
    const points = ordered.map((model) => `${x(model.taskCostUsd ?? 0)},${y(model.intelligenceIndex ?? 0)}`).join(" ");
    return `<polyline points="${points}" class="model-series-line ${family[0].provider === "Anthropic" ? "anthropic" : "openai"}" aria-hidden="true"/>`;
  }).join("");
  const dots = chartable.map((model) => `<circle cx="${x(model.taskCostUsd ?? 0)}" cy="${y(model.intelligenceIndex ?? 0)}" r="5.5" class="model-dot ${model.provider === "Anthropic" ? "anthropic" : "openai"}" tabindex="0" aria-describedby="model-chart-tooltip" aria-label="${escapeHtml(model.name)}，每任务成本 ${formatMoney(model.taskCostUsd)}，能力指数 ${model.intelligenceIndex?.toFixed(1)}，性价比 ${modelCostEfficiency(model)?.toFixed(1)}" data-model-id="${escapeHtml(model.id)}"/>`).join("");
  const yAxisLabelX = width <= 420 ? 7 : 16;
  return `<svg class="model-scatter" viewBox="0 0 ${width} ${height}" role="img" aria-label="Claude 与 GPT 模型性价比图。横轴为每任务成本对数刻度，纵轴按当前系列的 Intelligence Index 数据范围显示；仅显示至少两个有效模型的系列。">${grid}${seriesLines}${dots}<text x="${(pad.left + width - pad.right) / 2}" y="${height - (compact ? 7 : 1)}" text-anchor="middle" class="model-axis-title">每任务成本（美元，对数刻度）</text><text transform="translate(${yAxisLabelX} ${(height - pad.bottom + pad.top) / 2}) rotate(-90)" text-anchor="middle" class="model-axis-title">Intelligence Index（越高越好）</text></svg><div class="model-chart-tooltip" id="model-chart-tooltip" role="tooltip" hidden></div>`;
}

function bindModelChartInteractions() {
  const card = root.querySelector<HTMLElement>(".model-chart-card");
  const tooltip = card?.querySelector<HTMLElement>(".model-chart-tooltip");
  if (!card || !tooltip) return;
  const modelsById = new Map(benchmarkModels.map((model) => [model.id, model]));
  const hideTooltip = () => { tooltip.hidden = true; };
  const showTooltip = (dot: SVGCircleElement) => {
    const model = modelsById.get(dot.dataset.modelId ?? "");
    if (!model) return;
    tooltip.innerHTML = `<strong class="model-tooltip-title">${escapeHtml(model.name)}</strong><span class="model-tooltip-meta">${providerLabel(model.provider)} · ${escapeHtml(model.id)} · ${model.effort ?? "默认推理档"}</span><span class="model-tooltip-row"><span>每任务成本</span><strong>${formatMoney(model.taskCostUsd)}</strong></span><span class="model-tooltip-row"><span>Intelligence Index</span><strong>${model.intelligenceIndex?.toFixed(1) ?? "—"}</strong></span><span class="model-tooltip-row"><span>性价比指数</span><strong>${modelCostEfficiency(model)?.toFixed(2) ?? "—"}</strong></span><span class="model-tooltip-meta">${model.indexEstimated ? "能力指数为估算值" : "能力指数为评测值"}</span>`;
    tooltip.hidden = false;
    const cardRect = card.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const centerX = dotRect.left + dotRect.width / 2 - cardRect.left;
    const left = Math.max(tooltipRect.width / 2 + 8, Math.min(centerX, cardRect.width - tooltipRect.width / 2 - 8));
    const dotTop = dotRect.top - cardRect.top;
    const placeBelow = dotTop < tooltipRect.height + 16;
    tooltip.classList.toggle("below", placeBelow);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${placeBelow ? dotTop + 15 : dotTop - 12}px`;
  };
  card.querySelectorAll<SVGCircleElement>(".model-dot").forEach((dot) => {
    dot.addEventListener("pointerenter", () => showTooltip(dot));
    dot.addEventListener("pointerdown", () => showTooltip(dot));
    dot.addEventListener("pointerleave", () => { if (document.activeElement !== dot) hideTooltip(); });
    dot.addEventListener("focus", () => showTooltip(dot));
    dot.addEventListener("blur", hideTooltip);
  });
}

function renderModelChooserOptions(models: CatalogModel[]) {
  const query = modelSearchQuery.trim().toLowerCase();
  const filtered = models.filter((model) => !query || `${model.name} ${model.id}`.toLowerCase().includes(query));
  if (!filtered.length) return `<p class="model-choice-empty">没有找到匹配的模型。</p>`;
  return filtered.map((model) => `<label class="model-choice"><input type="checkbox" data-model-choice="${escapeHtml(model.id)}" ${excludedChartModelIds.has(model.id.toLowerCase()) ? "" : "checked"}><span>${escapeHtml(model.name)}</span><small>${providerLabel(model.provider)} · ${escapeHtml(model.id)}</small></label>`).join("");
}

function updateModelChartSelectionCount() {
  const scope = modelsForSelectedProvider();
  const selected = scope.filter((model) => !excludedChartModelIds.has(model.id.toLowerCase()));
  const selectedCount = selected.length;
  const plottedCount = modelSeriesForChart(selected).flat().length;
  const count = root.querySelector<HTMLElement>("#model-selector-count");
  const note = root.querySelector<HTMLElement>("#model-chart-selection-note");
  if (count) count.textContent = `${selectedCount} / ${scope.length} 已选`;
  if (note) note.textContent = `已选 ${selectedCount} 个系列模型 · 图中 ${plottedCount} 个`;
}

function refreshModelChart() {
  const card = root.querySelector<HTMLElement>(".model-chart-card");
  if (!card) return;
  const selected = modelsSelectedForChart();
  const plottedCount = modelSeriesForChart(selected).flat().length;
  card.innerHTML = `${renderPriceScatter(selected)}<div class="model-chart-foot"><span>仅显示至少两个有效模型的系列 · 左上角代表更高能力与更低任务成本</span><span>展示 ${plottedCount} 个系列模型</span></div>`;
  bindModelChartInteractions();
  updateModelChartSelectionCount();
}

function bindModelDirectoryControls(scope: CatalogModel[]) {
  root.querySelector<HTMLDetailsElement>("#model-selector")?.addEventListener("toggle", (event) => {
    modelSelectorOpen = (event.currentTarget as HTMLDetailsElement).open;
  });
  const search = root.querySelector<HTMLInputElement>("#model-selector-search");
  const optionList = root.querySelector<HTMLElement>("#model-choice-options");
  search?.addEventListener("input", () => {
    modelSearchQuery = search.value;
    saveFilterPreferences();
    if (optionList) {
      optionList.innerHTML = renderModelChooserOptions(scope);
      bindModelChoiceInputs();
    }
  });
  bindModelChoiceInputs();
  root.querySelectorAll<HTMLButtonElement>("[data-model-selection]").forEach((button) => button.addEventListener("click", () => {
    const includeAll = button.dataset.modelSelection === "all";
    scope.forEach((model) => {
      const id = model.id.toLowerCase();
      if (includeAll) excludedChartModelIds.delete(id);
      else excludedChartModelIds.add(id);
    });
    saveFilterPreferences();
    render();
  }));
}

function bindModelChoiceInputs() {
  root.querySelectorAll<HTMLInputElement>("[data-model-choice]").forEach((input) => input.addEventListener("change", () => {
    const id = input.dataset.modelChoice?.toLowerCase();
    if (!id) return;
    if (input.checked) excludedChartModelIds.delete(id);
    else excludedChartModelIds.add(id);
    saveFilterPreferences();
    refreshModelChart();
  }));
}

function renderModelPage() {
  const allModels = modelsForRanking();
  const scope = modelsForSelectedProvider();
  const selected = scope.filter((model) => !excludedChartModelIds.has(model.id.toLowerCase()));
  const listed = sortModelsForRanking(allModels.filter((model) => selectedModelProvider === "all" || model.provider === selectedModelProvider));
  const sortColumns: { key: ModelSortKey; label: string; header: string }[] = [
    { key: "name", label: "模型 / 推理档", header: "模型 / 推理档" },
    { key: "provider", label: "公司", header: "公司" },
    { key: "intelligence", label: "Intelligence Index", header: "Intelligence<br>Index" },
    { key: "cost", label: "每任务成本", header: "每任务成本" },
    { key: "efficiency", label: "性价比指数", header: "性价比指数" },
    { key: "context", label: "上下文 token", header: "上下文<br>token" },
  ];
  const sortHeaders = sortColumns.map(({ key, label, header }) => {
    const active = modelSortKey === key;
    const nextDirection = active && modelSortDirection === "asc" ? "降序" : active ? "升序" : defaultModelSortDirection(key) === "asc" ? "升序" : "降序";
    return `<th scope="col" ${active ? `aria-sort="${modelSortDirection === "asc" ? "ascending" : "descending"}"` : ""}><button type="button" class="model-sort-button ${active ? "active" : ""}" data-model-sort="${key}" aria-label="按${label}${nextDirection}排序"><span>${header}</span><span class="model-sort-indicator" aria-hidden="true">${active ? modelSortDirection === "asc" ? "↑" : "↓" : "↕"}</span></button></th>`;
  }).join("");
  const mobileSortOptions = sortColumns.map(({ key, label }) => `<option value="${key}" ${modelSortKey === key ? "selected" : ""}>${label}</option>`).join("");
  const filters = [{ id: "all", label: "全部", accessible: "全部公司" }, { id: "Anthropic", label: "Claude", accessible: "Claude（Anthropic）" }, { id: "OpenAI", label: "GPT", accessible: "GPT（OpenAI）" }]
    .map(({ id, label, accessible }) => `<button type="button" class="model-filter ${selectedModelProvider === id ? "selected" : ""}" data-provider="${id}" aria-label="${accessible}" aria-pressed="${selectedModelProvider === id}">${label}</button>`).join("");
  const tableRows = listed.map((model, index) => `<tr><td><span class="rank-number">${index + 1}</span><strong class="model-name">${escapeHtml(model.name)}</strong><small>${escapeHtml(model.id)} · ${model.intelligenceIndex == null ? "暂无评测" : model.effort ?? "默认推理档"}</small></td><td><span class="provider-badge ${model.provider === "Anthropic" ? "anthropic" : "openai"}">${providerLabel(model.provider)}</span></td><td>${model.intelligenceIndex?.toFixed(1) ?? "—"}</td><td>${formatMoney(model.taskCostUsd)}</td><td class="efficiency-value">${modelCostEfficiency(model)?.toFixed(2) ?? "—"}</td><td>${formatTokens(model.contextLength)}</td></tr>`).join("");
  const mobileCards = listed.map((model, index) => `<article class="model-mobile-card"><div class="model-mobile-heading"><span class="rank-number">${index + 1}</span><div><strong>${escapeHtml(model.name)}</strong><small>${escapeHtml(model.id)} · ${model.intelligenceIndex == null ? "暂无评测" : model.effort ?? "默认推理档"}</small></div><span class="provider-badge ${model.provider === "Anthropic" ? "anthropic" : "openai"}">${providerLabel(model.provider)}</span></div><div class="model-mobile-stats"><div><span>性价比指数</span><strong class="efficiency-value">${modelCostEfficiency(model)?.toFixed(2) ?? "—"}</strong></div><div><span>每任务成本</span><strong>${formatMoney(model.taskCostUsd)}</strong></div><div><span>Intelligence Index</span><strong>${model.intelligenceIndex?.toFixed(1) ?? "—"}</strong></div><div><span>上下文</span><strong>${formatTokens(model.contextLength)}</strong></div></div></article>`).join("");
  const catalogStatus = modelCatalog
    ? `目录最近成功同步于 ${formatDate(modelCatalog.retrievedAt)} · 匹配 ${modelCatalog.models.length} 个 Claude / GPT 文本模型`
    : modelDataState === "ready" ? "D1 中尚无在线目录快照；点击更新开始首次同步" : "尚未读取在线目录快照";
  const modelDatabaseStatus = modelDataState === "loading"
    ? "正在从 Cloudflare D1 读取 Claude 与 GPT 文本模型目录…"
    : modelDataState === "ready"
      ? "Cloudflare D1 已连接，在线目录及历史快照已载入"
      : modelDataState === "unavailable"
        ? "Cloudflare D1 暂不可用，当前无法读取在线模型目录"
        : "模型目录保存在 Cloudflare D1；打开模型页后自动读取";
  let diffContent = "";
  if (modelCatalogDiff?.firstSync) {
    diffContent = `<div class="model-diff-note">首次同步已建立 Claude 与 GPT 文本模型目录起点；后续更新会比较新增、目录未返回及名称、价格、上下文变化。</div>`;
  } else if (modelCatalogDiff) {
    const { added, removed, changed } = modelCatalogDiff;
    const changes = [
      ...added.map((model) => `<li><span class="diff-tag added">新增</span><strong>${escapeHtml(model.name)}</strong><small>${escapeHtml(model.id)} · ${providerLabel(model.provider)}</small></li>`),
      ...removed.map((model) => `<li><span class="diff-tag removed">目录未返回</span><strong>${escapeHtml(model.name)}</strong><small>${escapeHtml(model.id)} · ${providerLabel(model.provider)}</small></li>`),
      ...changed.map((item) => `<li><span class="diff-tag changed">${escapeHtml(item.field)}变化</span><strong>${escapeHtml(item.model.name)}</strong><small>${escapeHtml(item.before)} → ${escapeHtml(item.after)}</small></li>`),
    ];
    diffContent = `${changes.length
      ? `<p class="model-diff-count">发现 ${added.length} 个新增、${removed.length} 个目录未返回、${changed.length} 项字段变化</p><ul class="model-diff-list">${changes.slice(0, 24).join("")}</ul>${changes.length > 24 ? `<p class="model-diff-note">另有 ${changes.length - 24} 项变化未展开。</p>` : ""}<p class="model-diff-note">“目录未返回”表示本次公开聚合目录未列出，不等同于官方下架。</p>`
      : `<div class="model-diff-note">与上次在线目录相比，模型名称、上下文长度和公开价格均未发现变化。</div>`}`;
  } else if (modelCatalog) {
    diffContent = `<div class="model-diff-note">已载入上次在线目录。点击更新后会与这份目录逐项比较。</div>`;
  }
  const currentProviderCount = scope.length;
  const selectedCount = selected.length;
  const plottedCount = modelSeriesForChart(selected).flat().length;
  const listedCount = listed.length;

  return `<section class="model-page-content"><div class="model-intro"><div class="eyebrow"><span class="live-dot"></span> MODEL DIRECTORY <span class="eyebrow-divider">/</span> Claude · GPT</div><div class="section-heading model-title-row"><div><h1>Claude 与 GPT 模型<span class="title-period">.</span></h1><p class="intro-copy">对比两家模型的评测能力、每任务成本和性价比。</p></div><div class="model-source-chip">${benchmarkRetrievedAt ? `Artificial Analysis · ${escapeHtml(benchmarkRetrievedAt)}` : "正在读取评测基准"}</div></div><div class="model-method"><span>性价比指数 = Intelligence Index ÷ 每任务成本（美元）</span><span>横轴对数刻度，纵轴随当前系列数据范围变化</span><span>越靠左上越划算；悬停圆点查看模型具体数据</span></div></div>
    <section class="model-controls-panel"><div class="model-control-group"><div class="model-control-label"><strong>公司</strong><span>筛选图表和模型列表</span></div><div class="model-filters" role="group" aria-label="按公司筛选模型">${filters}</div></div><div class="model-control-group"><div class="model-control-label"><strong>图表模型</strong><span id="model-chart-selection-note">已选 ${selectedCount} 个系列模型 · 图中 ${plottedCount} 个</span></div><details class="model-selector" id="model-selector" ${modelSelectorOpen ? "open" : ""}><summary><span>选择图表模型</span><span id="model-selector-count">${selectedCount} / ${currentProviderCount} 已选</span></summary><div class="model-selector-body"><label class="model-search"><span>搜索模型名称或 ID</span><input type="search" id="model-selector-search" value="${escapeHtml(modelSearchQuery)}" placeholder="输入关键词筛选" autocomplete="off"></label><div class="model-selection-actions"><button type="button" data-model-selection="all">全选当前公司</button><button type="button" data-model-selection="none">清空当前公司</button></div><div class="model-choice-options" id="model-choice-options">${renderModelChooserOptions(scope)}</div></div></details></div></section>
    <section class="model-panel"><div class="section-heading"><div><span class="section-kicker">INTELLIGENCE VS TASK COST</span><h2>模型性价比</h2></div><div class="model-legend"><span><i class="anthropic"></i>Claude</span><span><i class="openai"></i>GPT</span></div></div><div class="model-chart-card">${renderPriceScatter(selected)}<div class="model-chart-foot"><span>仅显示至少两个有效模型的系列 · 左上角代表更高能力与更低任务成本</span><span>展示 ${plottedCount} 个系列模型</span></div></div></section>
    <section class="model-panel model-ranking"><div class="section-heading model-ranking-heading"><div><span class="section-kicker">VALUE RANKING</span><h2>性价比与客户端模型</h2><p class="model-list-count">显示 ${listedCount} 个（共 ${allModels.length} 个文本模型）</p></div></div><div class="model-table-wrap"><table class="model-table"><thead><tr>${sortHeaders}</tr></thead><tbody>${tableRows || ("<tr><td colspan=\"6\" class=\"model-table-empty\">" + (modelDataState === "loading" ? "正在读取模型目录…" : "当前筛选下没有模型") + "</td></tr>")}</tbody></table></div><div class="model-mobile-sort"><label for="model-sort-field">排序</label><span class="model-sort-select-wrap"><select id="model-sort-field">${mobileSortOptions}</select></span><button type="button" id="model-sort-direction" aria-label="切换排序方向，当前${modelSortDirection === "asc" ? "升序" : "降序"}">${modelSortDirection === "asc" ? "升序 ↑" : "降序 ↓"}</button></div><div class="model-mobile-list">${mobileCards || ("<p class=\"model-table-empty\">" + (modelDataState === "loading" ? "正在读取模型目录…" : "当前筛选下没有模型") + "</p>")}</div><p class="model-footnote">评测能力指数与每任务成本来自 Artificial Analysis。性价比指数为本页计算值；缺少当前排序指标的模型排在末尾，尚无评测的文本模型仍会列出。</p></section>
    <section class="model-panel model-update-panel"><div class="section-heading model-update-heading"><div><span class="section-kicker">LIVE CATALOG CHECK</span><h2>在线模型目录更新</h2></div><button type="button" class="model-update-button" id="update-model-catalog" ${modelCatalogLoading || modelDataState === "loading" ? "disabled" : ""}>${modelDataState === "loading" ? `<span class="button-spinner"></span>正在读取` : modelCatalogLoading ? `<span class="button-spinner"></span>正在更新` : "↻ 更新目录"}</button></div><p class="catalog-status"><span class="status-signal ${modelDataState === "ready" ? "ok" : "pending"}"></span>${escapeHtml(modelDatabaseStatus)}</p><p class="catalog-status"><span class="status-signal ${modelCatalog ? "ok" : "pending"}"></span>${escapeHtml(catalogStatus)}</p><p class="catalog-disclaimer">统一数据源：Artificial Analysis 公开模型排行榜，提供模型目录、能力指数、价格、上下文、每任务成本和输出速度；仅保留 Anthropic Claude 与 OpenAI GPT 的标准文本模型，过滤多模态专用、路由和预览变体。</p>${modelCatalogError ? `<div class="data-error model-error" role="alert">${escapeHtml(modelCatalogError.replace(/[。.!?]+$/, ""))}${modelDataState === "ready" ? "。上次成功目录已保留。" : "。在线目录历史当前无法读取。"}</div>` : ""}${modelCatalogDiff ? `<div class="model-diff">${diffContent}</div>` : ""}<p class="model-storage-note">筛选后的在线文本模型、公开价格、上下文信息和同步快照均保存在 Cloudflare D1；更新失败不会覆盖已保存的数据。</p></section>
  </section>`;
}

function updateModelChartAfterResize() {
  const card = root.querySelector<HTMLElement>(".model-chart-card");
  if (!card || activePage !== "models") return;
  const selected = modelsSelectedForChart();
  const plottedCount = modelSeriesForChart(selected).flat().length;
  card.innerHTML = `${renderPriceScatter(selected)}<div class="model-chart-foot"><span>仅显示至少两个有效模型的系列 · 左上角代表更高能力与更低任务成本</span><span>展示 ${plottedCount} 个系列模型</span></div>`;
  bindModelChartInteractions();
}

function newestPrice(field: keyof Pick<Event, "price_92" | "price_95" | "price_0">) {
  return fuelData.events.find((event) => event[field] != null)?.[field] ?? null;
}

function changeFor(field: "price_92" | "price_95" | "price_0") {
  const events = fuelData.events.filter((event) => event[field] != null && !event.is_no_change);
  const latest = events[0]?.[field];
  const previous = events[1]?.[field];
  return latest == null || previous == null ? null : Number((latest - previous).toFixed(2));
}

function renderTrend() {
  const events = [...fuelData.events].filter((event) => event.announced_on.startsWith(selectedYear) && event[selectedFuel] != null).reverse();
  const { width, height, pad } = chartLayout();
  if (events.length === 0) return `<div class="chart-empty"><span class="chart-empty-icon">↗</span><p>${selectedYear} 年暂无可绘制的价格</p></div>`;
  const values = events.map((event) => Number(event[selectedFuel]));
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const highestIndex = values.indexOf(highest);
  const lowestIndex = values.indexOf(lowest);
  const min = Math.floor((Math.min(...values) - 0.1) * 2) / 2;
  const max = Math.ceil((Math.max(...values) + 0.1) * 2) / 2;
  const range = Math.max(max - min, 0.5);
  const plotRight = width - pad.right;
  const baseline = height - pad.bottom;
  const x = (index: number) => pad.left + (events.length === 1 ? 0 : (index / (events.length - 1)) * (width - pad.left - pad.right));
  const y = (value: number) => pad.top + ((max - value) / range) * (height - pad.top - pad.bottom);
  const points = events.map((event, index) => ({ event, x: x(index), y: y(Number(event[selectedFuel])) }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;
  const grid = Array.from({ length: 5 }, (_, index) => {
    const value = max - (range * index) / 4;
    const yy = y(value);
    return `<line x1="${pad.left}" y1="${yy}" x2="${plotRight}" y2="${yy}" class="grid-line"/><text x="${pad.left - 12}" y="${yy + 4}" text-anchor="end" class="axis-label">${value.toFixed(1)}</text>`;
  }).join("");
  const guideLine = (kind: "high" | "average" | "low", value: number) =>
    `<line x1="${pad.left}" y1="${y(value)}" x2="${plotRight}" y2="${y(value)}" class="chart-guide-line chart-guide-${kind}"/>`;
  const guides = `${guideLine("high", highest)}${guideLine("average", average)}${guideLine("low", lowest)}`;
  const labelCount = Math.min(events.length, width <= 420 ? 3 : 5);
  const labelIndices = Array.from({ length: labelCount }, (_, index) => labelCount === 1 ? 0 : Math.round((index * (events.length - 1)) / (labelCount - 1)));
  const dates = labelIndices.map((index, labelIndex) => `<text x="${points[index].x}" y="${height - 10}" text-anchor="${labelIndex === 0 ? "start" : labelIndex === labelCount - 1 ? "end" : "middle"}" class="axis-label">${formatShortDate(events[index].announced_on)}</text>`).join("");
  const markers = points.map((point, index) => {
    const isLatest = index === points.length - 1;
    const isHighest = index === highestIndex;
    const isLowest = index === lowestIndex;
    const classes = ["chart-point", isLatest && "chart-point-latest", isHighest && "chart-point-high", isLowest && "chart-point-low"].filter(Boolean).join(" ");
    const tags = [isHighest && "最高价", isLowest && "最低价"].filter(Boolean).join("、");
    return `<circle cx="${point.x}" cy="${point.y}" r="${isHighest || isLowest ? 5.5 : isLatest ? 5 : 3.5}" class="${classes}"><title>${point.event.announced_on} · ¥${formatPrice(point.event[selectedFuel])}${tags ? ` · ${tags}` : ""}</title></circle>`;
  }).join("");
  const legend = `<div class="chart-benchmarks" aria-label="${selectedYear} 年价格参考：最高价 ¥${formatPrice(highest)}，公告均价 ¥${formatPrice(average)}，最低价 ¥${formatPrice(lowest)}"><span class="benchmark-stat benchmark-high"><i></i><span>最高</span><strong>¥ ${formatPrice(highest)}</strong></span><span class="benchmark-stat benchmark-average"><i></i><span>均价</span><strong>¥ ${formatPrice(average)}</strong></span><span class="benchmark-stat benchmark-low"><i></i><span>最低</span><strong>¥ ${formatPrice(lowest)}</strong></span></div>`;
  return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${selectedYear} 年${fuelNames[selectedFuel]}价格趋势，最高价 ¥${formatPrice(highest)}，最低价 ¥${formatPrice(lowest)}，公告均价 ¥${formatPrice(average)}" preserveAspectRatio="none"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6f9a7b" stop-opacity=".25"/><stop offset="100%" stop-color="#6f9a7b" stop-opacity=".015"/></linearGradient></defs>${grid}<path d="${areaPath}" class="chart-area"/>${guides}<path d="${linePath}" class="chart-line"/>${markers}${dates}</svg>${legend}`;
}

function bindChartInteractions() {
  const svg = root.querySelector<SVGSVGElement>(".chart-svg");
  const chartWrap = root.querySelector<HTMLElement>(".chart-wrap");
  if (!svg || !chartWrap) return;
  const layout = chartLayout();

  const events = [...fuelData.events].filter((event) => event.announced_on.startsWith(selectedYear) && event[selectedFuel] != null).reverse();
  const points = [...svg.querySelectorAll<SVGCircleElement>(".chart-point")];
  const tooltip = document.createElement("div");
  const dateLabel = document.createElement("span");
  const priceLabel = document.createElement("strong");
  const priceValue = document.createElement("span");
  tooltip.className = "chart-tooltip";
  tooltip.setAttribute("role", "status");
  tooltip.setAttribute("aria-live", "polite");
  tooltip.hidden = true;
  priceLabel.textContent = "¥ ";
  priceLabel.append(priceValue);
  tooltip.append(dateLabel, priceLabel);
  chartWrap.append(tooltip);

  const hoverLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  hoverLine.setAttribute("class", "chart-hover-line");
  hoverLine.setAttribute("y1", String(layout.pad.top));
  hoverLine.setAttribute("y2", String(layout.height - layout.pad.bottom));
  hoverLine.style.opacity = "0";
  svg.insertBefore(hoverLine, points[0] ?? null);
  const hoverPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  hoverPoint.setAttribute("class", "chart-hover-point");
  hoverPoint.setAttribute("r", "6");
  hoverPoint.style.opacity = "0";
  svg.append(hoverPoint);
  let pinnedIndex: number | null = null;

  const showPoint = (index: number) => {
    const event = events[index];
    const point = points[index];
    if (!event || !point) return;
    const x = Number(point.getAttribute("cx"));
    const y = Number(point.getAttribute("cy"));
    hoverLine.setAttribute("x1", String(x));
    hoverLine.setAttribute("x2", String(x));
    hoverLine.style.opacity = "1";
    hoverPoint.setAttribute("cx", String(x));
    hoverPoint.setAttribute("cy", String(y));
    hoverPoint.style.opacity = "1";
    dateLabel.textContent = event.announced_on;
    priceValue.textContent = formatPrice(event[selectedFuel]);
    tooltip.hidden = false;

    const wrapBounds = chartWrap.getBoundingClientRect();
    const svgBounds = svg.getBoundingClientRect();
    const pointX = (x / layout.width) * svgBounds.width;
    const pointY = (y / layout.height) * svgBounds.height;
    const halfWidth = tooltip.offsetWidth / 2;
    const left = Math.max(halfWidth + 4, Math.min(wrapBounds.width - halfWidth - 4, pointX));
    const top = pointY < tooltip.offsetHeight + 12 ? pointY + 12 : pointY - tooltip.offsetHeight - 10;
    tooltip.style.left = left + "px";
    tooltip.style.top = Math.max(3, top) + "px";
    tooltip.setAttribute("aria-label", event.announced_on + "，" + fuelNames[selectedFuel] + " " + formatPrice(event[selectedFuel]) + " 元每升");
  };

  const hidePoint = () => {
    if (pinnedIndex !== null) return;
    tooltip.hidden = true;
    hoverLine.style.opacity = "0";
    hoverPoint.style.opacity = "0";
  };

  const nearestPoint = (clientX: number) => {
    const bounds = svg.getBoundingClientRect();
    const viewX = ((clientX - bounds.left) / bounds.width) * layout.width;
    const plotStart = layout.pad.left;
    const plotWidth = layout.width - plotStart - layout.pad.right;
    if (viewX < plotStart - 12 || viewX > plotStart + plotWidth + 12) return null;
    return Math.max(0, Math.min(events.length - 1, Math.round(((viewX - plotStart) / plotWidth) * (events.length - 1))));
  };

  points.forEach((point, index) => {
    point.setAttribute("tabindex", "0");
    point.setAttribute("aria-label", events[index].announced_on + "，" + fuelNames[selectedFuel] + " " + formatPrice(events[index][selectedFuel]) + " 元每升");
    point.addEventListener("focus", () => showPoint(index));
    point.addEventListener("blur", hidePoint);
  });
  svg.addEventListener("pointermove", (event) => {
    const index = nearestPoint(event.clientX);
    if (index !== null) showPoint(index);
  });
  svg.addEventListener("pointerleave", hidePoint);
  svg.addEventListener("click", (event) => {
    const index = nearestPoint(event.clientX);
    if (index === null) return;
    pinnedIndex = pinnedIndex === index ? null : index;
    if (pinnedIndex === null) hidePoint();
    else showPoint(index);
  });
}

function render() {
  const activeEvents = fuelData.events.filter((event) => !event.is_no_change);
  const latestEvent = activeEvents[0];
  const latestValues = [
    { code: "92", label: "92 号汽油", field: "price_92" as const, unit: "元 / 升", change: changeFor("price_92") },
    { code: "95", label: "95 号汽油", field: "price_95" as const, unit: "元 / 升", change: changeFor("price_95") },
    { code: "D0", label: "0 号柴油", field: "price_0" as const, unit: "元 / 升", change: changeFor("price_0") },
  ];
  const recordEvents = fuelData.events.filter((event) => event.announced_on >= firstDate);
  const eventsByYear = new Map<string, Event[]>();
  recordEvents.forEach((event) => {
    const year = event.announced_on.slice(0, 4);
    const yearEvents = eventsByYear.get(year) ?? [];
    yearEvents.push(event);
    eventsByYear.set(year, yearEvents);
  });
  const history = [...eventsByYear.entries()].filter(([year]) => year === selectedYear).map(([year, events]) => {
    const rows = events.map((event) => {
      const index = fuelData.events.indexOf(event);
      const previous = fuelData.events.slice(index + 1).find((item) => !item.is_no_change);
      const deltas = previous ? (["price_92", "price_95", "price_0"] as const)
        .map((field) => event[field] == null || previous[field] == null ? 0 : Math.sign(Number(event[field]) - Number(previous[field])))
        .filter((delta) => delta !== 0) : [];
      const movement = event.is_no_change ? "不作调整" : !previous || deltas.length === 0 ? "价格记录" : deltas.every((delta) => delta > 0) ? "上调" : deltas.every((delta) => delta < 0) ? "下调" : "分品种调整";
      const chipClass = event.is_no_change ? "quiet" : movement === "上调" ? "upward" : movement === "下调" ? "downward" : "active";
      return `<tr><td><span class="date-cell">${event.announced_on}</span>${event.effective_at ? `<span class="effective-cell">${escapeHtml(event.effective_at.slice(0, 16).replace("T", " "))} 生效</span>` : ""}</td><td><span class="event-chip ${chipClass}"><i></i>${movement}</span></td><td>${formatPrice(event.price_92)}</td><td>${formatPrice(event.price_95)}</td><td>${formatPrice(event.price_0)}</td><td><a class="source-link" href="${escapeHtml(event.source_url)}" target="_blank" rel="noreferrer" aria-label="查看 ${event.announced_on} 官方公告">↗</a></td></tr>`;
    }).join("");
    return `<section class="history-year"><div class="history-year-heading"><h3>${escapeHtml(year)} 年</h3><span>${events.length} 条调价记录</span></div><div class="history-card"><div class="table-scroll"><table><thead><tr><th>公告日期 / 生效时间</th><th>事件</th><th>92 号汽油</th><th>95 号汽油</th><th>0 号柴油</th><th>来源</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-foot"><span><i class="record-dot"></i> 每条价格均可追溯至官方公告</span><span>${year} 年 · 按公告日期倒序</span></div></div></section>`;
  }).join("");
  const yearEvents = eventsByYear.get(selectedYear) ?? [];
  const yearPrice = yearEvents.find((event) => event[selectedFuel] != null)?.[selectedFuel] ?? null;
  const yearTabs = (label: string) => `<div class="year-tabs" role="tablist" aria-label="${label}">${availableYears.map((year) => `<button type="button" role="tab" aria-selected="${selectedYear === year}" class="year-tab ${selectedYear === year ? "selected" : ""}" data-year="${year}">${year} 年</button>`).join("")}</div>`;
  const lastUpdate = formatDate(fuelData.lastSuccessAt);
  const stateText = fuelData.lastSuccessAt ? `最近同步于 ${lastUpdate}` : "等待本地脚本首次同步";

  root.innerHTML = `
    <div class="shell">
      <header class="topbar"><a class="brand" href="#top" aria-label="知新 FreshScope 首页"><span class="brand-mark"><i></i><i></i><i></i></span><span class="brand-word">Fresh<span>Scope</span></span></a><nav class="app-nav" aria-label="应用页面"><button type="button" data-page="fuel" aria-pressed="${activePage === "fuel"}">油价</button><button type="button" data-page="models" aria-pressed="${activePage === "models"}">模型</button></nav><div class="topbar-right"><a class="top-link" href="${activePage === "fuel" ? "#history" : "https://artificialanalysis.ai/zh/leaderboards/models"}" ${activePage === "models" ? `target="_blank" rel="noreferrer"` : ""}>${activePage === "fuel" ? "数据来源" : "目录来源"} <span>↗</span></a><span class="top-divider"></span><span class="top-context">${activePage === "fuel" ? "浙江 · 成品油" : "Claude · GPT"}</span></div></header>
      <main id="top">
        <div class="app-view ${activePage === "fuel" ? "is-active" : ""}" id="fuel-view">
        <section class="intro"><div class="eyebrow"><span class="live-dot"></span> FUEL WATCH <span class="eyebrow-divider">/</span> 浙江省</div><div class="intro-row"><div><h1>让变化，有迹可循<span class="title-period">.</span></h1><p class="intro-copy">浙江成品油价格 · 官方公告追踪</p></div></div><div class="status-line"><span class="status-signal ${fuelData.lastSuccessAt ? "ok" : "pending"}"></span><span>${stateText}</span><span class="status-separator">·</span><span>由本地脚本手动同步</span><span class="status-spacer"></span><span class="source-status"><span class="source-mark">浙</span> 浙江省发展和改革委员会</span></div></section>
        ${loadError ? `<div class="data-error" role="status">${escapeHtml(loadError)}</div>` : ""}
        <section class="price-section"><div class="section-heading"><div><span class="section-kicker">CURRENT SNAPSHOT</span><h2>当前零售限价</h2></div><div class="snapshot-note"><span class="note-dot"></span> ${latestEvent ? `${latestEvent.announced_on} 调价公告` : "等待官方数据"}</div></div><div class="price-grid">${latestValues.map((item, index) => `<article class="price-card card-${index}"><div class="card-top"><span class="fuel-code">${item.code}</span><span class="fuel-label">${item.label}</span><span class="card-more">↗</span></div><div class="price-main"><span class="currency">¥</span><span class="price-number">${formatPrice(newestPrice(item.field))}</span></div><div class="card-foot"><span>${item.unit}</span><span class="change-pill ${item.change == null ? "neutral" : item.change > 0 ? "up" : item.change < 0 ? "down" : "neutral"}">${item.change == null ? "历史待补录" : item.change > 0 ? `↑ ${item.change.toFixed(2)}` : item.change < 0 ? `↓ ${Math.abs(item.change).toFixed(2)}` : "— 0.00"}</span></div><div class="card-accent"></div></article>`).join("")}</div><p class="price-footnote">价格单位为元 / 升 · 涨跌对比上一条调价公告</p></section>
        <section class="trend-section"><div class="section-heading trend-heading"><div><span class="section-kicker">PRICE HISTORY</span><h2>价格走势</h2></div><div class="fuel-tabs" role="tablist" aria-label="选择油品">${Object.entries(fuelNames).map(([key, label]) => `<button role="tab" aria-selected="${selectedFuel === key}" class="fuel-tab ${selectedFuel === key ? "selected" : ""}" data-fuel="${key}">${label}</button>`).join("")}</div></div><div class="year-bar"><span>查看年份</span>${yearTabs("选择走势图年份")}</div><div class="trend-card"><div class="trend-meta"><div><span class="trend-current-label">${fuelNames[selectedFuel]} · ${selectedYear} 年最新</span><div class="trend-current-price">¥ ${formatPrice(yearPrice)}<span> / 升</span></div></div><div class="trend-period"><span class="period-label">追踪区间</span><span>${yearEvents.length ? `${formatShortDate(yearEvents[yearEvents.length - 1].announced_on)} — ${formatShortDate(yearEvents[0].announced_on)}` : `${selectedYear} 年暂无记录`}</span></div></div><div class="chart-wrap">${renderTrend()}</div><div class="chart-legend"><span><i></i> 每次调价公告价格</span><span class="chart-range">${yearEvents.length} 条 ${selectedYear} 年事件</span></div></div></section>
        <section class="history-section" id="history"><div class="section-heading history-heading"><div><span class="section-kicker">OFFICIAL RECORDS</span><h2>调价记录</h2></div><div class="history-controls"><a class="all-records" href="https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html" target="_blank" rel="noreferrer">访问官方栏目 <span>↗</span></a></div></div><div class="history-years">${history || `<div class="history-empty"><span>${selectedYear} 年暂无价格记录</span><small>该年有新公告后会显示在这里</small></div>`}</div></section>
        </div>
        <div class="app-view ${activePage === "models" ? "is-active" : ""}" id="model-view">${renderModelPage()}</div>
      </main>
      <footer><span class="footer-brand">知新 <span>FreshScope</span></span><span>把值得关注的信息，收进一页。</span><span class="footer-source-note">数据来源见各页面标注</span></footer>
    </div>`;

  bindChartInteractions();
  bindModelChartInteractions();
  root.querySelectorAll<HTMLButtonElement>(".app-nav button").forEach((button) => button.addEventListener("click", () => {
    activePage = button.dataset.page === "models" ? "models" : "fuel";
    window.history.replaceState(null, "", activePage === "models" ? "#models" : "#top");
    render();
    if (activePage === "models") void loadModelStore();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  root.querySelectorAll<HTMLButtonElement>(".fuel-tab").forEach((button) => button.addEventListener("click", () => {
    selectedFuel = button.dataset.fuel as typeof selectedFuel;
    saveFilterPreferences();
    render();
  }));
  root.querySelectorAll<HTMLButtonElement>(".year-tab").forEach((button) => button.addEventListener("click", () => {
    selectedYear = button.dataset.year ?? selectedYear;
    saveFilterPreferences();
    render();
  }));
  root.querySelectorAll<HTMLButtonElement>(".model-filter").forEach((button) => button.addEventListener("click", () => {
    selectedModelProvider = button.dataset.provider as typeof selectedModelProvider;
    saveFilterPreferences();
    render();
  }));
  root.querySelectorAll<HTMLButtonElement>("[data-model-sort]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.modelSort as ModelSortKey;
    const direction = key === modelSortKey ? modelSortDirection === "asc" ? "desc" : "asc" : defaultModelSortDirection(key);
    setModelSort(key, direction, `[data-model-sort="${key}"]`);
  }));
  root.querySelector<HTMLSelectElement>("#model-sort-field")?.addEventListener("change", (event) => {
    const key = (event.currentTarget as HTMLSelectElement).value as ModelSortKey;
    setModelSort(key, defaultModelSortDirection(key), "#model-sort-field");
  });
  root.querySelector<HTMLButtonElement>("#model-sort-direction")?.addEventListener("click", () => {
    setModelSort(modelSortKey, modelSortDirection === "asc" ? "desc" : "asc", "#model-sort-direction");
  });
  bindModelDirectoryControls(modelsForSelectedProvider());
  root.querySelector<HTMLButtonElement>("#update-model-catalog")?.addEventListener("click", () => void updateModelCatalog());
}

function applyModelStore(result: ModelStore) {
  benchmarkRetrievedAt = result.baseline?.retrievedAt ?? null;
  benchmarkModels = (result.baseline?.models ?? []).filter((model) => model.reasoning !== false && isTextModel(`${model.slug} ${model.name}`)).map((model) => ({
    id: model.slug,
    name: model.name,
    provider: model.provider,
    createdAt: model.releaseDate,
    contextLength: model.contextWindowTokens,
    inputPriceUsdPerMillionTokens: model.inputPriceUsdPerMillionTokens,
    outputPriceUsdPerMillionTokens: model.outputPriceUsdPerMillionTokens,
    reasoning: model.reasoning,
    effort: model.effort,
    intelligenceIndex: model.intelligenceIndex,
    indexEstimated: model.indexEstimated,
    taskCostUsd: model.taskCostUsd,
    costEfficiency: model.intelligenceIndex != null && model.taskCostUsd != null && model.taskCostUsd > 0 ? model.intelligenceIndex / model.taskCostUsd : null,
    timePerTaskSeconds: model.timePerTaskSeconds,
    outputTokensPerSecond: model.outputTokensPerSecond,
  }));
  modelCatalog = result.currentCatalog ? { ...result.currentCatalog, models: filterClientModels(result.currentCatalog.models) } : null;
  modelCatalogDiff = modelCatalog ? compareModelCatalog(result.previousCatalog, modelCatalog) : null;
  modelDataState = "ready";
  modelCatalogError = null;
}
async function loadModelStore() {
  if (modelDataState === "ready") return;
  if (modelStorePromise) return modelStorePromise;
  modelDataState = "loading";
  modelCatalogError = null;
  render();
  modelStorePromise = (async () => {
    try {
      const response = await fetch("/api/models", { headers: { accept: "application/json" } });
      if (!response.ok) {
        const errorResult = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(errorResult?.error ?? `模型数据库请求失败（${response.status}）`);
      }
      const result = await response.json() as ModelStore;
      if (!result || !(result.currentCatalog == null || Array.isArray(result.currentCatalog.models))) {
        throw new Error("Cloudflare D1 返回的在线目录格式不正确");
      }
      if (!Array.isArray(result.baseline?.models)) throw new Error("Cloudflare D1 未返回 Artificial Analysis 评测基准");
      applyModelStore(result);
    } catch (error) {
      modelDataState = "unavailable";
      modelCatalogError = error instanceof Error ? error.message : "暂时无法读取 Cloudflare D1 中的模型数据";
    } finally {
      modelStorePromise = null;
      render();
    }
  })();
  return modelStorePromise;
}

async function updateModelCatalog() {
  modelCatalogLoading = true;
  modelCatalogError = null;
  render();
  try {
    const response = await fetch("/api/models", { method: "POST", headers: { accept: "application/json" } });
    if (!response.ok) {
      const errorResult = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(errorResult?.error ?? `目录请求失败（${response.status}）`);
    }
    const result = await response.json() as ModelStore;
    if (!result || !result.currentCatalog || !Array.isArray(result.currentCatalog.models)) throw new Error("在线模型目录格式不正确");
    applyModelStore(result);
  } catch (error) {
    modelCatalogError = error instanceof Error ? error.message : "在线目录暂时不可用";
  } finally {
    modelCatalogLoading = false;
    render();
  }
}

async function loadData() {
  try {
    const response = await fetch("/api/fuel", { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("请求失败");
    const result = await response.json() as FuelData;
    fuelData = { events: result.events, lastSuccessAt: result.lastSuccessAt };
    loadError = null;
  } catch {
    fuelData = { events: [], lastSuccessAt: null };
    loadError = "暂时无法连接价格服务，请检查网络后重试。";
  }
}

await Promise.all([loadData(), activePage === "models" ? loadModelStore() : Promise.resolve()]);
render();

let lastChartWidth = chartLayout().width;
window.addEventListener("resize", () => {
  const nextWidth = chartLayout().width;
  if (nextWidth === lastChartWidth) return;
  lastChartWidth = nextWidth;
  const chartWrap = root.querySelector<HTMLElement>(".chart-wrap");
  if (!chartWrap) return;
  chartWrap.innerHTML = renderTrend();
  bindChartInteractions();
});

let lastModelChartWidth = modelChartWidth();
window.addEventListener("resize", () => {
  const nextWidth = modelChartWidth();
  if (nextWidth === lastModelChartWidth) return;
  lastModelChartWidth = nextWidth;
  updateModelChartAfterResize();
});
