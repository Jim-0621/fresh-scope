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

type FuelData = { events: Event[]; lastSuccessAt: string | null; latestRun: { status: string; error_summary: string | null } | null };

const root = document.querySelector<HTMLDivElement>("#app")!;
const tokenStorageKey = "fresh-scope-update-token";
const chartLayout = { width: 920, height: 300, pad: { top: 28, right: 82, bottom: 40, left: 58 } };
const firstYear = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric" }).format(new Date())) - 2;
const firstDate = `${firstYear}-01-01`;
let selectedFuel: "price_92" | "price_95" | "price_0" = "price_95";
let fuelData: FuelData = { events: [], lastSuccessAt: null, latestRun: null };
let isUpdating = false;
let notice = "";

const fuelNames = { price_92: "92 号汽油", price_95: "95 号汽油", price_0: "0 号柴油" };
const formatPrice = (price: number | null) => (price == null ? "—" : price.toFixed(2));
const formatDate = (value: string | null) => {
  if (!value) return "尚未检查";
  const date = new Date(value);
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
};
const formatShortDate = (value: string) => value.slice(5).replace("-", ".");
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

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
  const events = [...fuelData.events].filter((event) => event.announced_on >= firstDate && event[selectedFuel] != null).reverse();
  const { width, height, pad } = chartLayout;
  if (events.length === 0) return `<div class="chart-empty"><span class="chart-empty-icon">↗</span><p>官网历史数据采集后，价格曲线会显示在这里</p></div>`;
  const values = events.map((event) => Number(event[selectedFuel]));
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
  const labelCount = Math.min(events.length, 5);
  const labelIndices = Array.from({ length: labelCount }, (_, index) => labelCount === 1 ? 0 : Math.round((index * (events.length - 1)) / (labelCount - 1)));
  const dates = labelIndices.map((index, labelIndex) => `<text x="${points[index].x}" y="${height - 10}" text-anchor="${labelIndex === 0 ? "start" : labelIndex === labelCount - 1 ? "end" : "middle"}" class="axis-label">${formatShortDate(events[index].announced_on)}</text>`).join("");
  const markers = points.map((point, index) => `<circle cx="${point.x}" cy="${point.y}" r="${index === points.length - 1 ? 5 : 3.5}" class="chart-point ${index === points.length - 1 ? "chart-point-latest" : ""}"><title>${point.event.announced_on} · ¥${formatPrice(point.event[selectedFuel])}</title></circle>`).join("");
  const latest = points[points.length - 1];
  return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${fuelNames[selectedFuel]}历史价格趋势" preserveAspectRatio="none"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6f9a7b" stop-opacity=".25"/><stop offset="100%" stop-color="#6f9a7b" stop-opacity=".015"/></linearGradient></defs>${grid}<path d="${areaPath}" class="chart-area"/><line x1="${pad.left}" y1="${latest.y}" x2="${plotRight}" y2="${latest.y}" class="chart-latest-line"/><path d="${linePath}" class="chart-line"/>${markers}<text x="${width - 5}" y="${latest.y + 4}" text-anchor="end" class="chart-latest-label">¥ ${formatPrice(latest.event[selectedFuel])}</text>${dates}</svg>`;
}

function bindChartInteractions() {
  const svg = root.querySelector<SVGSVGElement>(".chart-svg");
  const chartWrap = root.querySelector<HTMLElement>(".chart-wrap");
  if (!svg || !chartWrap) return;

  const events = [...fuelData.events].filter((event) => event[selectedFuel] != null).reverse();
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
  hoverLine.setAttribute("y1", String(chartLayout.pad.top));
  hoverLine.setAttribute("y2", String(chartLayout.height - chartLayout.pad.bottom));
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
    const pointX = (x / chartLayout.width) * svgBounds.width;
    const pointY = (y / chartLayout.height) * svgBounds.height;
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
    const viewX = ((clientX - bounds.left) / bounds.width) * chartLayout.width;
    const plotStart = chartLayout.pad.left;
    const plotWidth = chartLayout.width - plotStart - chartLayout.pad.right;
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
  const history = [...eventsByYear.entries()].sort(([left], [right]) => right.localeCompare(left)).map(([year, events]) => {
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
  const yearEvents = recordEvents;
  const lastUpdate = formatDate(fuelData.lastSuccessAt);
  const stateText = isUpdating ? "正在检查官方公告" : fuelData.lastSuccessAt ? `最近检查于 ${lastUpdate}` : "等待首次采集";

  root.innerHTML = `
    <div class="shell">
      <header class="topbar"><a class="brand" href="#top" aria-label="知新 FreshScope 首页"><span class="brand-mark"><i></i><i></i><i></i></span><span class="brand-word">Fresh<span>Scope</span></span></a><div class="topbar-right"><a class="top-link" href="#history">数据来源 <span>↗</span></a><span class="top-divider"></span><span class="top-context">浙江 · 成品油</span></div></header>
      <main id="top">
        <section class="intro"><div class="eyebrow"><span class="live-dot"></span> FUEL WATCH <span class="eyebrow-divider">/</span> 浙江省</div><div class="intro-row"><div><h1>让变化，有迹可循<span class="title-period">.</span></h1><p class="intro-copy">浙江成品油价格 · 官方公告追踪</p></div><button class="update-button" id="update-button" ${isUpdating ? "disabled" : ""}><span class="button-icon ${isUpdating ? "spin" : ""}">${isUpdating ? "◌" : "↻"}</span>${isUpdating ? "正在更新" : "立即更新"}<span class="button-arrow">↗</span></button></div><div class="status-line"><span class="status-signal ${fuelData.lastSuccessAt ? "ok" : "pending"}"></span><span>${stateText}</span><span class="status-separator">·</span><span>每日 08:00 自动检查</span><span class="status-spacer"></span><span class="source-status"><span class="source-mark">浙</span> 浙江省发展和改革委员会</span></div></section>
        ${fuelData.latestRun?.status === "failed" ? `<div class="sync-warning"><span>ⓘ</span> 上次检查没有完成，页面仍保留此前有效价格。${fuelData.latestRun.error_summary ? ` <span>${escapeHtml(fuelData.latestRun.error_summary)}</span>` : ""}</div>` : ""}
        ${notice ? `<div class="notice ${notice.startsWith("更新成功") ? "success" : "error"}" role="status">${escapeHtml(notice)}</div>` : ""}
        <section class="price-section"><div class="section-heading"><div><span class="section-kicker">CURRENT SNAPSHOT</span><h2>当前零售限价</h2></div><div class="snapshot-note"><span class="note-dot"></span> ${latestEvent ? `${latestEvent.announced_on} 调价公告` : "等待官方数据"}</div></div><div class="price-grid">${latestValues.map((item, index) => `<article class="price-card card-${index}"><div class="card-top"><span class="fuel-code">${item.code}</span><span class="fuel-label">${item.label}</span><span class="card-more">↗</span></div><div class="price-main"><span class="currency">¥</span><span class="price-number">${formatPrice(newestPrice(item.field))}</span></div><div class="card-foot"><span>${item.unit}</span><span class="change-pill ${item.change == null ? "neutral" : item.change > 0 ? "up" : item.change < 0 ? "down" : "neutral"}">${item.change == null ? "历史待补录" : item.change > 0 ? `↑ ${item.change.toFixed(2)}` : item.change < 0 ? `↓ ${Math.abs(item.change).toFixed(2)}` : "— 0.00"}</span></div><div class="card-accent"></div></article>`).join("")}</div><p class="price-footnote">价格单位为元 / 升 · 涨跌对比上一条调价公告</p></section>
        <section class="trend-section"><div class="section-heading trend-heading"><div><span class="section-kicker">PRICE HISTORY</span><h2>价格走势</h2></div><div class="fuel-tabs" role="tablist" aria-label="选择油品">${Object.entries(fuelNames).map(([key, label]) => `<button role="tab" aria-selected="${selectedFuel === key}" class="fuel-tab ${selectedFuel === key ? "selected" : ""}" data-fuel="${key}">${label}</button>`).join("")}</div></div><div class="trend-card"><div class="trend-meta"><div><span class="trend-current-label">${fuelNames[selectedFuel]} · 当前</span><div class="trend-current-price">¥ ${formatPrice(newestPrice(selectedFuel))}<span> / 升</span></div></div><div class="trend-period"><span class="period-label">追踪区间</span><span>${yearEvents.length ? `${formatShortDate(yearEvents[yearEvents.length - 1].announced_on)} — ${formatShortDate(yearEvents[0].announced_on)}` : `${firstYear} 年至今`}</span></div></div><div class="chart-wrap">${renderTrend()}</div><div class="chart-legend"><span><i></i> 每次调价公告价格</span><span class="chart-range">${yearEvents.length} 条记录 · 自 ${firstYear} 年起</span></div></div></section>
        <section class="history-section" id="history"><div class="section-heading history-heading"><div><span class="section-kicker">OFFICIAL RECORDS</span><h2>调价记录</h2></div><a class="all-records" href="https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html" target="_blank" rel="noreferrer">访问官方栏目 <span>↗</span></a></div><div class="history-years">${history || `<div class="history-empty"><span>${firstYear} 年起暂无价格记录</span><small>点击“立即更新”从浙江省发改委补录公告</small></div>`}</div></section>
      </main>
      <footer><span class="footer-brand">知新 <span>FreshScope</span></span><span>把值得关注的信息，收进一页。</span><a href="https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html" target="_blank" rel="noreferrer">数据来自浙江省发展和改革委员会 <span>↗</span></a></footer>
    </div>
    <dialog class="token-dialog" id="token-dialog"><form method="dialog" id="token-form"><button class="dialog-close" value="cancel" aria-label="关闭">×</button><span class="section-kicker">PRIVATE ACTION</span><h2>验证后更新</h2><p>立即更新会重新读取官方公告。请输入仅保存在您浏览器中的更新凭证。</p><label for="update-token">更新凭证</label><input id="update-token" type="password" autocomplete="current-password" placeholder="输入 Cloudflare 更新凭证" required/><div class="dialog-actions"><button class="cancel-button" value="cancel">取消</button><button class="confirm-button" value="confirm" id="confirm-update">验证并更新 <span>↗</span></button></div></form></dialog>`;

  bindChartInteractions();
  root.querySelector<HTMLButtonElement>("#update-button")?.addEventListener("click", beginUpdate);
  root.querySelectorAll<HTMLButtonElement>(".fuel-tab").forEach((button) => button.addEventListener("click", () => {
    selectedFuel = button.dataset.fuel as typeof selectedFuel;
    render();
  }));
  root.querySelector<HTMLFormElement>("#token-form")?.addEventListener("submit", async (event) => {
    if ((event as SubmitEvent).submitter?.getAttribute("value") !== "confirm") return;
    event.preventDefault();
    const token = root.querySelector<HTMLInputElement>("#update-token")!.value.trim();
    root.querySelector<HTMLDialogElement>("#token-dialog")?.close();
    await updatePrices(token);
  });
}

function beginUpdate() {
  const savedToken = localStorage.getItem(tokenStorageKey);
  if (savedToken) {
    void updatePrices(savedToken);
    return;
  }
  const dialog = root.querySelector<HTMLDialogElement>("#token-dialog")!;
  dialog.showModal();
  root.querySelector<HTMLInputElement>("#update-token")?.focus();
}

async function updatePrices(token: string) {
  isUpdating = true;
  notice = "";
  render();
  try {
    const response = await fetch("/api/update", { method: "POST", headers: { authorization: `Bearer ${token}` } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || result.error || "更新失败。");
    if (result.status === "success") localStorage.setItem(tokenStorageKey, token);
    notice = result.status === "success"
      ? result.discoveredCount === 0 && result.updatedCount === 0
        ? "更新成功，暂无新公告。"
        : "更新成功，发现 " + result.discoveredCount + " 条新公告，补全 " + result.updatedCount + " 条记录，新增 " + result.insertedCount + " 条记录。"
      : result.message;
    if (result.status === "success") await loadData();
  } catch (error) {
    if (error instanceof Error && /凭证无效/.test(error.message)) localStorage.removeItem(tokenStorageKey);
    notice = error instanceof Error ? error.message : "更新失败，请稍后重试。";
  } finally {
    isUpdating = false;
    render();
  }
}

async function loadData() {
  try {
    const response = await fetch("/api/fuel", { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("请求失败");
    fuelData = await response.json();
  } catch {
    fuelData = { events: [], lastSuccessAt: null, latestRun: null };
    notice = "暂时无法连接价格服务，请检查网络后重试。";
  }
}

await loadData();
render();
