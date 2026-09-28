import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { collectOfficialPrices } from "../worker/scraper.js";

const execFileAsync = promisify(execFile);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runStartedAt = new Date().toISOString();
const timestamp = runStartedAt.replace(/[-:.TZ]/g, "");
const output = resolve(projectRoot, process.argv[2] ?? `updates/fuel-sync-${timestamp}.sql`);
const dataUrl = "https://fresh-scope.pages.dev/api/fuel";

const hasCorePrices = (event) => event.price_92 != null && event.price_95 != null && event.price_0 != null;
const sqlValue = (value) => value == null ? "NULL" : typeof value === "number" ? String(value) : `'${String(value).replaceAll("'", "''")}'`;

const response = await fetch(dataUrl, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`读取云端现有记录失败：HTTP ${response.status}`);
const existingData = await response.json();
if (!Array.isArray(existingData.events)) throw new Error("云端油价接口没有返回公告记录，停止同步以保护现有数据。");

const existingEvents = existingData.events;
const completeSourceKeys = new Set(existingEvents
  .filter((event) => event.is_no_change
    ? hasCorePrices({ price_92: event.price_92, price_95: event.price_95, price_0: event.price_0 })
    : event.effective_at && hasCorePrices({ price_92: event.price_92, price_95: event.price_95, price_0: event.price_0 }))
  .map((event) => event.source_key));

const events = await collectOfficialPrices(completeSourceKeys, 3);
const existingKeys = new Set(existingEvents.map((event) => event.source_key));
const timeline = new Map(existingEvents.map((event) => [event.source_key, {
  sourceKey: event.source_key,
  announcedOn: event.announced_on,
  isNoChange: Boolean(event.is_no_change),
  price89: event.price_89,
  price92: event.price_92,
  price95: event.price_95,
  price0: event.price_0,
  priceM10: event.price_m10,
}]));

for (const event of events) {
  const existing = timeline.get(event.sourceKey);
  timeline.set(event.sourceKey, {
    sourceKey: event.sourceKey,
    announcedOn: event.announcedOn,
    isNoChange: event.isNoChange,
    price89: existing?.price89 ?? event.price89,
    price92: existing?.price92 ?? event.price92,
    price95: existing?.price95 ?? event.price95,
    price0: existing?.price0 ?? event.price0,
    priceM10: existing?.priceM10 === 4.98 ? event.priceM10 ?? existing.priceM10 : existing?.priceM10 ?? event.priceM10,
  });
}

const eventsToWrite = new Map(events.map((event) => [event.sourceKey, event]));
let previousPrices = null;
for (const entry of [...timeline.values()].sort((left, right) => left.announcedOn.localeCompare(right.announcedOn))) {
  const event = eventsToWrite.get(entry.sourceKey);
  if (event?.isNoChange && previousPrices) {
    event.price89 ??= previousPrices.price89;
    event.price92 ??= previousPrices.price92;
    event.price95 ??= previousPrices.price95;
    event.price0 ??= previousPrices.price0;
    event.priceM10 ??= previousPrices.priceM10;
    entry.price89 = event.price89;
    entry.price92 = event.price92;
    entry.price95 = event.price95;
    entry.price0 = event.price0;
    entry.priceM10 = event.priceM10;
  }
  if (entry.price92 != null && entry.price95 != null && entry.price0 != null) previousPrices = entry;
}

const eventRows = events.map((event) => {
  if (!event.isNoChange && (!event.price92 || !event.price95 || !event.price0)) {
    throw new Error(`${event.announcedOn} 公告缺少必需价格，停止同步以保护现有数据。`);
  }
  const values = [
    event.sourceKey, event.announcedOn, event.effectiveAt, Number(event.isNoChange),
    event.price89, event.price92, event.price95, event.price0, event.priceM10, event.sourceUrl,
  ];
  return `(${values.map(sqlValue).join(", ")})`;
});

const sqlStatements = [];
if (eventRows.length > 0) {
  sqlStatements.push(`INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES
  ${eventRows.join(",\n  ")}
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END,
  collected_at = CURRENT_TIMESTAMP;`);
}

const runFinishedAt = new Date().toISOString();
const insertedCount = events.filter((event) => !existingKeys.has(event.sourceKey)).length;
sqlStatements.push(`INSERT INTO collection_runs
  (trigger_type, started_at, finished_at, status, discovered_count, inserted_count)
VALUES ('manual', ${sqlValue(runStartedAt)}, ${sqlValue(runFinishedAt)}, 'success', ${events.length}, ${insertedCount});`);

const sql = `-- 本机采集浙江发改委官网公告并同步至 Cloudflare D1。\n${sqlStatements.join("\n\n")}\n`;
await mkdir(dirname(output), { recursive: true });
await writeFile(output, sql, "utf8");

console.log(`官网采集完成：${events.length} 条公告（新增 ${insertedCount} 条，补全 ${events.length - insertedCount} 条）。`);
console.log(`同步 SQL 已保存：${output}`);
console.log("正在通过 Wrangler 写入 Cloudflare D1 fresh-scope-db …");

const wranglerCli = resolve(projectRoot, "node_modules/wrangler/bin/wrangler.js");
try {
  const { stdout, stderr } = await execFileAsync(process.execPath, [
    wranglerCli, "d1", "execute", "fresh-scope-db", "--remote", "--file", output, "--yes",
  ], { cwd: projectRoot, windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
} catch (error) {
  if (error.stdout) process.stdout.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw new Error(`Wrangler 写入失败：${error.message}`);
}

console.log("Cloudflare D1 同步完成。网页刷新后会显示最新记录和同步时间。");
