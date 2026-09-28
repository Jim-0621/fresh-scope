import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { collectOfficialPrices } from "../worker/scraper.js";

const output = resolve(process.argv[2] ?? `updates/fuel-${new Date().toISOString().slice(0, 10)}.sql`);
const events = await collectOfficialPrices(new Set(), 3);
const value = (item) => item == null ? "NULL" : typeof item === "number" ? String(item) : `'${String(item).replaceAll("'", "''")}'`;

const statements = events.map((event) => {
  const fields = [
    event.sourceKey, event.announcedOn, event.effectiveAt, Number(event.isNoChange),
    event.price89, event.price92, event.price95, event.price0, event.priceM10, event.sourceUrl,
  ];
  return `INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES (${fields.map(value).join(", ")})
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;`;
});

const sql = `-- 本机从浙江发改委官网采集；执行前请核对公告来源及价格。\n${statements.join("\n\n")}\n`;
await mkdir(dirname(output), { recursive: true });
await writeFile(output, sql, "utf8");
console.log(`已从官网采集 ${events.length} 条公告，SQL 已写入 ${output}`);
