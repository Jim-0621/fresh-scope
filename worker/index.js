import { collectOfficialPrices } from "./scraper.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function acquireLock(db) {
  const result = await db
    .prepare("UPDATE collector_lock SET locked_until = unixepoch() + 180 WHERE id = 1 AND locked_until <= unixepoch()")
    .run();
  return result.meta.changes === 1;
}

async function runCollection(db, triggerType) {
  if (!(await acquireLock(db))) return { status: "skipped", message: "采集任务正在运行，请稍后再试。" };

  const run = await db
    .prepare("INSERT INTO collection_runs (trigger_type, started_at, status) VALUES (?, ?, 'running')")
    .bind(triggerType, new Date().toISOString())
    .run();
  const runId = run.meta.last_row_id;

  try {
    const knownEvents = await db.prepare("SELECT * FROM fuel_events").all();
    const knownBySourceKey = new Map(knownEvents.results.map((event) => [event.source_key, event]));
    const completeSourceKeys = new Set(
      knownEvents.results
        .filter((event) => event.is_no_change || (event.effective_at && event.price_92 != null && event.price_95 != null && event.price_0 != null))
        .map((event) => event.source_key),
    );
    const events = await collectOfficialPrices(completeSourceKeys);
    let insertedCount = 0;
    let updatedCount = 0;
    for (const event of events) {
      if (knownBySourceKey.has(event.sourceKey)) {
        const result = await db
          .prepare(
            `UPDATE fuel_events SET
               effective_at = COALESCE(effective_at, ?),
               price_89 = COALESCE(price_89, ?),
               price_92 = COALESCE(price_92, ?),
               price_95 = COALESCE(price_95, ?),
               price_0 = COALESCE(price_0, ?),
               price_m10 = COALESCE(price_m10, ?)
             WHERE source_key = ? AND (effective_at IS NULL OR price_92 IS NULL OR price_95 IS NULL OR price_0 IS NULL)`,
          )
          .bind(event.effectiveAt, event.price89, event.price92, event.price95, event.price0, event.priceM10, event.sourceKey)
          .run();
        updatedCount += result.meta.changes;
        continue;
      }

      const result = await db
        .prepare(
          `INSERT OR IGNORE INTO fuel_events
            (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          event.sourceKey,
          event.announcedOn,
          event.effectiveAt,
          event.isNoChange ? 1 : 0,
          event.price89,
          event.price92,
          event.price95,
          event.price0,
          event.priceM10,
          event.sourceUrl,
        )
        .run();
      insertedCount += result.meta.changes;
    }

    await db
      .prepare("UPDATE collection_runs SET finished_at = ?, status = 'success', discovered_count = ?, inserted_count = ? WHERE id = ?")
      .bind(new Date().toISOString(), events.length, insertedCount, runId)
      .run();
    const discoveredCount = events.filter((event) => !knownBySourceKey.has(event.sourceKey)).length;
    return { status: "success", discoveredCount, insertedCount, updatedCount };
  } catch (error) {
    const summary = String(error?.message || error).slice(0, 300);
    const message = /备用读取 HTTP 429/i.test(summary)
      ? "官网直连失败，备用读取服务触发 HTTP 429 限流；现有油价数据已保留。"
      : /timeout/i.test(summary)
        ? "浙江发改委官网暂未响应，现有油价数据已保留，请稍后重试。"
        : "官方公告读取或校验失败，现有油价数据已保留。";
    await db
      .prepare("UPDATE collection_runs SET finished_at = ?, status = 'failed', error_summary = ? WHERE id = ?")
      .bind(new Date().toISOString(), summary, runId)
      .run();
    return { status: "failed", message, error: summary };
  } finally {
    await db.prepare("UPDATE collector_lock SET locked_until = 0 WHERE id = 1").run();
  }
}

function latestSuccessfulCheck(db) {
  return db
    .prepare("SELECT finished_at FROM collection_runs WHERE status = 'success' ORDER BY id DESC LIMIT 1")
    .first();
}

async function api(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/api/fuel" && request.method === "GET") {
    const startYear = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric" }).format(new Date())) - 2;
    const [events, latestRun, latestSuccess] = await Promise.all([
      env.DB.prepare("SELECT * FROM fuel_events WHERE announced_on >= ? ORDER BY announced_on DESC, id DESC").bind(`${startYear}-01-01`).all(),
      env.DB.prepare("SELECT trigger_type, started_at, finished_at, status, discovered_count, inserted_count, error_summary FROM collection_runs ORDER BY id DESC LIMIT 1").first(),
      latestSuccessfulCheck(env.DB),
    ]);
    return json({ events: events.results, latestRun, lastSuccessAt: latestSuccess?.finished_at ?? null });
  }

  if (url.pathname === "/api/update" && request.method === "POST") {
    if (!env.UPDATE_TOKEN) return json({ error: "尚未配置更新凭证，请先配置 Cloudflare secret。" }, 503);
    const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!constantTimeEqual(provided, env.UPDATE_TOKEN)) return json({ error: "更新凭证无效。" }, 401);

    const throttle = await env.DB
      .prepare("UPDATE manual_throttle SET last_requested_at = unixepoch() WHERE id = 1 AND last_requested_at <= unixepoch() - 300")
      .run();
    if (throttle.meta.changes !== 1) return json({ error: "更新请求过于频繁，请 5 分钟后再试。" }, 429);

    const result = await runCollection(env.DB, "manual");
    return json(result, result.status === "failed" ? 502 : result.status === "skipped" ? 409 : 200);
  }

  return json({ error: "接口不存在。" }, 404);
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(request, env);
      } catch {
        return json({ error: "暂时无法读取油价数据，请稍后重试。" }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller, env, context) {
    context.waitUntil(runCollection(env.DB, "cron"));
  },
};
