const listingApi = new URL("https://fzggw.zj.gov.cn/api-gateway/jpaas-publish-server/front/page/build/unit");
for (const [key, value] of Object.entries({
  parseType: "bulidstatic",
  webId: "3185",
  tplSetId: "o0YcVHHq5vWtr3uiCp4SY",
  pageType: "column",
  tagId: "信息列表",
  editType: "null",
  pageId: "WjmRjo8myrcFv0ZgeuKKh",
  paramJson: JSON.stringify({ pageNo: 1, pageSize: 30 }),
})) listingApi.searchParams.set(key, value);

const allTargets = [
  { id: "api", group: "list", name: "官网油价列表接口", url: listingApi, kind: "json" },
  { id: "column", group: "list", name: "官网油价栏目页", url: "https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html", kind: "html" },
  {
    id: "announcement",
    group: "announcement",
    name: "2026-09-24 官方公告",
    url: "https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html",
    kind: "html",
  },
];
const requestedTarget = process.argv[2];
const targets = requestedTarget ? allTargets.filter((target) => target.id === requestedTarget) : allTargets;
if (requestedTarget && targets.length === 0) throw new Error(`Unknown target: ${requestedTarget}`);

const outcomes = [];
for (const target of targets) {
  const started = Date.now();
  try {
    const response = await fetch(target.url, {
      headers: {
        accept: target.kind === "json" ? "application/json, */*" : "text/html, */*;q=0.9",
        "user-agent": "FreshScope-GitHubActions-Probe/1.0",
        referer: "https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html",
        "x-requested-with": "XMLHttpRequest",
      },
      signal: AbortSignal.timeout(20000),
    });
    const body = await response.text();
    let parsed = false;
    let details = `body_bytes=${Buffer.byteLength(body)}`;
    if (response.ok && target.kind === "json") {
      try {
        const data = JSON.parse(body);
        const html = data.data?.html ?? "";
        const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+\.html?)["']/gi)].length;
        parsed = data.success === true && links > 0;
        details += ` api_success=${data.success === true} announcement_links=${links}`;
      } catch {
        details += " json_parse=false";
      }
    } else if (response.ok) {
      parsed = /<html|<title/i.test(body);
      details += ` html_document=${parsed}`;
    }
    outcomes.push({ group: target.group, name: target.name, reachable: response.ok && parsed });
    console.log(`${target.name}: http=${response.status} elapsed_ms=${Date.now() - started} ${details}`);
  } catch (error) {
    outcomes.push({ group: target.group, name: target.name, reachable: false });
    console.log(`${target.name}: request_error=${error?.name ?? "Error"} elapsed_ms=${Date.now() - started} message=${String(error?.message ?? error).slice(0, 180)}`);
  }
}

const listReachable = outcomes.some((result) => result.group === "list" && result.reachable);
const announcementReachable = outcomes.some((result) => result.group === "announcement" && result.reachable);
console.log(`SUMMARY list_reachable=${listReachable} announcement_reachable=${announcementReachable}`);
if (outcomes.some((result) => !result.reachable)) process.exitCode = 1;
