const LIST_PAGE_URL = "https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html";
const LIST_URL = "https://fzggw.zj.gov.cn/api-gateway/jpaas-publish-server/front/page/build/unit";
const EXTRA_URLS = [
  "https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html",
  "https://fzggw.zj.gov.cn/art/2025/12/22/art_1229629046_5720443.html",
];

function decodeHtml(value) {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(parseInt(code, 16)));
}

function plainText(html) {
  return decodeHtml(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/[\t\r\n\u3000 ]+/g, " ")
    .trim();
}

function collectLinks(html) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = decodeHtml(match[1]).replace(/\\/g, "/");
    const title = plainText(match[2]);
    if (!/\.html?(?:[?#]|$)/i.test(href)) continue;
    let resolved;
    try {
      resolved = new URL(href, LIST_PAGE_URL);
    } catch {
      continue;
    }
    if (resolved.hostname !== "fzggw.zj.gov.cn") continue;
    if (/\/art\/2026\//.test(resolved.pathname) || /(?:2026|二〇二六|二○二六)/.test(title)) {
      links.push({ url: resolved.href.split("#")[0], title });
    }
  }
  return links;
}

function eventDate(title, url, body) {
  const sources = `${title} ${url} ${body.slice(0, 1500)}`;
  const iso = sources.match(/(202[56])[/-](\d{1,2})[/-](\d{1,2})/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const chinese = sources.match(/(202[56])\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (chinese) return `${chinese[1]}-${chinese[2].padStart(2, "0")}-${chinese[3].padStart(2, "0")}`;
  const pathDate = url.match(/\/art\/(\d{4})\/(\d{1,2})\/(\d{1,2})\//);
  if (pathDate) return `${pathDate[1]}-${pathDate[2].padStart(2, "0")}-${pathDate[3].padStart(2, "0")}`;
  return null;
}

function priceAfterLabel(body, labelPattern, nextLabels) {
  const label = new RegExp(labelPattern, "i").exec(body);
  if (!label) return null;
  const tail = body.slice(label.index + label[0].length);
  let end = Math.min(tail.length, 180);
  for (const nextPattern of nextLabels) {
    const next = new RegExp(nextPattern, "i").exec(tail);
    if (next && next.index < end) end = next.index;
  }
  const matches = [...tail.slice(0, end).matchAll(/([0-9]{1,2}\.[0-9]{2})/g)];
  for (const match of matches.reverse()) {
    const value = Number(match[1]);
    if (value >= 3 && value <= 15) return value;
  }
  return null;
}

function parsePrices(body) {
  const normalized = body.replace(/\s+/g, " ");
  const labels = [
    "(?:89\\s*号(?:汽油)?|89#)",
    "(?:92\\s*号(?:汽油)?|92#)",
    "(?:95\\s*号(?:汽油)?|95#)",
    "(?:0\\s*号(?:柴油)?|0#柴油)",
    "(?:-10\\s*号(?:柴油)?|零下10\\s*号(?:柴油)?|-10#柴油)",
  ];
  const value = (index) => priceAfterLabel(normalized, labels[index], labels.slice(index + 1));
  return { price89: value(0), price92: value(1), price95: value(2), price0: value(3), priceM10: value(4) };
}

function effectiveTime(body) {
  const match = body.match(/(?:自|从)\s*(?:2026年)?\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(?:(\d{1,2})\s*时|零时)?(?:起|开始|零时起(?:生效|执行|施行|实施)?)/);
  if (!match) return null;
  const hour = Number(match[3] ?? 0);
  const date = new Date(Date.UTC(2026, Number(match[1]) - 1, Number(match[2]) + (hour === 24 ? 1 : 0)));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}T${String(hour === 24 ? 0 : hour).padStart(2, "0")}:00:00+08:00`;
}

async function fetchText(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: {
        "user-agent": "FreshScope/1.0 (+personal price tracker)",
        referer: LIST_PAGE_URL,
      },
      signal: AbortSignal.timeout(12000),
    });
  } catch (error) {
    throw new Error(`读取官网页面失败（${url}）：${error?.message || error}`);
  }
  if (!response.ok) throw new Error(`官网页面 ${url} 返回 HTTP ${response.status}`);
  return response.text();
}

export async function collectOfficialPrices() {
  const listingUrl = new URL(LIST_URL);
  for (const [key, value] of Object.entries({
    parseType: "bulidstatic",
    webId: "3185",
    tplSetId: "o0YcVHHq5vWtr3uiCp4SY",
    pageType: "column",
    tagId: "信息列表",
    editType: "null",
    pageId: "WjmRjo8myrcFv0ZgeuKKh",
    paramJson: JSON.stringify({ pageNo: 1, pageSize: 100 }),
  })) {
    listingUrl.searchParams.set(key, value);
  }
  const listingResponse = await fetchText(listingUrl.href);
  let listingData;
  try {
    listingData = JSON.parse(listingResponse);
  } catch {
    throw new Error("官网油价列表接口返回了无法识别的数据。");
  }
  if (!listingData.success || typeof listingData.data?.html !== "string") {
    throw new Error("官网油价列表接口未返回公告列表。");
  }
  const links = collectLinks(listingData.data.html);
  const uniqueLinks = new Map([...links, ...EXTRA_URLS.map((url) => ({ url, title: "浙江省成品油价格公告" }))].map((item) => [item.url, item]));
  if (links.length === 0) throw new Error("未能从官方油价栏目找到 2026 年公告链接，可能是页面结构发生变化。");

  const events = [];
  const pages = [...uniqueLinks.values()];
  for (let offset = 0; offset < pages.length; offset += 4) {
    const batch = await Promise.all(pages.slice(offset, offset + 4).map(async ({ url, title }) => {
      const html = await fetchText(url);
      const body = plainText(html);
      const htmlTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
      const announcedOn = eventDate(`${title} ${plainText(htmlTitle)}`, url, body);
      if (!announcedOn || announcedOn < "2025-12-01") return null;

      const isNoChange = /不作调整|暂不调整|维持现行价格|不作变动/.test(body);
      const prices = parsePrices(body);
      if (announcedOn >= "2026-01-01" && !isNoChange && (!prices.price92 || !prices.price95 || !prices.price0)) {
        throw new Error(`${announcedOn} 公告缺少 92、95 号汽油或 0 号柴油价格，未保存此次采集结果。`);
      }
      return { sourceKey: url, announcedOn, effectiveAt: effectiveTime(body), isNoChange, ...prices, sourceUrl: url };
    }));
    events.push(...batch.filter(Boolean));
  }
  if (events.length === 0) throw new Error("找到的官方公告中没有可识别的 2026 年调价事件。");
  events.sort((left, right) => left.announcedOn.localeCompare(right.announcedOn));
  let lastPrices = null;
  for (const event of events) {
    if (event.isNoChange && lastPrices) {
      event.price89 ??= lastPrices.price89;
      event.price92 ??= lastPrices.price92;
      event.price95 ??= lastPrices.price95;
      event.price0 ??= lastPrices.price0;
      event.priceM10 ??= lastPrices.priceM10;
    }
    if (event.price92 != null && event.price95 != null && event.price0 != null) lastPrices = event;
  }
  return events.filter((event) => event.announcedOn >= "2026-01-01");
}
