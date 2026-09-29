const MODEL_CATALOG_COOLDOWN_SECONDS = 60;
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

function latestSuccessfulSync(db) {
  return db
    .prepare("SELECT finished_at FROM collection_runs WHERE status = 'success' ORDER BY id DESC LIMIT 1")
    .first();
}

function nullableNumber(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapCatalogRow(row) {
  return {
    id: row.model_id,
    name: row.name,
    provider: row.provider,
    createdAt: row.created_at,
    contextLength: nullableNumber(row.context_length),
    inputPriceUsdPerMillionTokens: nullableNumber(row.input_price_usd_per_million_tokens),
    outputPriceUsdPerMillionTokens: nullableNumber(row.output_price_usd_per_million_tokens),
    raw: parseJson(row.raw_json, null),
  };
}

async function readCatalogSnapshot(db, snapshot) {
  if (!snapshot) return null;
  const rows = await db
    .prepare("SELECT model_id, name, provider, created_at, context_length, input_price_usd_per_million_tokens, output_price_usd_per_million_tokens, raw_json FROM model_catalog_models WHERE snapshot_id = ? ORDER BY provider, COALESCE(created_at, '') DESC, name")
    .bind(snapshot.id)
    .all();
  return {
    source: snapshot.source,
    retrievedAt: snapshot.retrieved_at,
    models: rows.results.map(mapCatalogRow),
  };
}

async function publicModelStore(db, currentSnapshotId = null) {
  const baselineRow = await db
    .prepare("SELECT source, source_url, retrieved_at, models_json FROM model_baseline WHERE id = 1")
    .first();

  let currentSnapshot;
  let previousSnapshot;
  if (currentSnapshotId != null) {
    currentSnapshot = await db
      .prepare("SELECT id, source, retrieved_at FROM model_catalog_snapshots WHERE id = ?")
      .bind(currentSnapshotId)
      .first();
    previousSnapshot = currentSnapshot
      ? await db
        .prepare("SELECT id, source, retrieved_at FROM model_catalog_snapshots WHERE id < ? ORDER BY id DESC LIMIT 1")
        .bind(currentSnapshot.id)
        .first()
      : null;
  } else {
    const snapshots = await db
      .prepare("SELECT id, source, retrieved_at FROM model_catalog_snapshots ORDER BY id DESC LIMIT 2")
      .all();
    [currentSnapshot, previousSnapshot] = snapshots.results;
  }

  const [currentCatalog, previousCatalog] = await Promise.all([
    readCatalogSnapshot(db, currentSnapshot),
    readCatalogSnapshot(db, previousSnapshot),
  ]);
  const baselineData = baselineRow ? parseJson(baselineRow.models_json, null) : null;
  const baselineModels = Array.isArray(baselineData)
    ? baselineData
    : Array.isArray(baselineData?.models) ? baselineData.models : [];
  const baseline = baselineRow
    ? {
      source: baselineRow.source,
      sourceUrl: baselineRow.source_url,
      retrievedAt: baselineRow.retrieved_at,
      models: baselineModels,
    }
    : null;

  return { baseline, currentCatalog, previousCatalog, storage: "cloudflare-d1" };
}

async function fetchModelCatalog() {
  const upstream = await fetch(OPENROUTER_MODELS_URL, {
    headers: {
      accept: "application/json",
      "HTTP-Referer": "https://fresh-scope.pages.dev/",
      "X-Title": "FreshScope",
    },
  });
  if (!upstream.ok) throw new Error(`OpenRouter 模型目录返回 ${upstream.status}。`);

  const payload = await upstream.json();
  const models = (Array.isArray(payload.data) ? payload.data : []).flatMap((model) => {
    const id = String(model.id ?? "");
    const lowerId = id.toLowerCase();
    const description = `${id} ${String(model.name ?? "")}`.toLowerCase();
    if (/non[\s_-]*reasoning/.test(description)) return [];
    const provider = lowerId.startsWith("anthropic/") ? "Anthropic" : lowerId.startsWith("openai/") ? "OpenAI" : null;
    if (!provider) return [];
    const created = nullableNumber(model.created);
    const pricing = model.pricing ?? {};
    return [{
      id,
      name: String(model.name ?? id),
      provider,
      createdAt: created == null ? null : new Date(created * 1000).toISOString(),
      contextLength: nullableNumber(model.context_length),
      inputPriceUsdPerMillionTokens: nullableNumber(pricing.prompt) == null ? null : nullableNumber(pricing.prompt) * 1_000_000,
      outputPriceUsdPerMillionTokens: nullableNumber(pricing.completion) == null ? null : nullableNumber(pricing.completion) * 1_000_000,
      raw: model,
    }];
  }).sort((a, b) => a.provider.localeCompare(b.provider) || (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || a.name.localeCompare(b.name));

  if (!["Anthropic", "OpenAI"].every((provider) => models.some((model) => model.provider === provider))) {
    throw new Error("公开目录没有同时返回 Anthropic 和 OpenAI 模型，本次未更新快照。");
  }
  return { source: "OpenRouter public models API", retrievedAt: new Date().toISOString(), models };
}

async function reserveModelCatalogSync(db, now) {
  const throttle = await db
    .prepare("UPDATE model_catalog_sync_state SET last_requested_at = ? WHERE id = 1 AND last_requested_at <= ?")
    .bind(now, now - MODEL_CATALOG_COOLDOWN_SECONDS)
    .run();
  if (!throttle.meta?.changes) {
    const state = await db.prepare("SELECT last_requested_at FROM model_catalog_sync_state WHERE id = 1").first();
    const retryAfter = Math.max(1, MODEL_CATALOG_COOLDOWN_SECONDS - (now - Number(state?.last_requested_at ?? now)));
    return { retryAfter };
  }
  return { reservedAt: now };
}

async function releaseModelCatalogSync(db, reservedAt) {
  await db
    .prepare("UPDATE model_catalog_sync_state SET last_requested_at = 0 WHERE id = 1 AND last_requested_at = ?")
    .bind(reservedAt)
    .run();
}

async function saveModelCatalog(db, catalog) {
  const statements = [db
    .prepare("INSERT INTO model_catalog_snapshots (source, retrieved_at, model_count) VALUES (?, ?, ?)")
    .bind(catalog.source, catalog.retrievedAt, catalog.models.length)];

  // Keep each statement small: D1 applies tighter bind/query limits than a local SQLite build.
  for (let start = 0; start < catalog.models.length; start += 8) {
    const batch = catalog.models.slice(start, start + 8);
    const placeholders = batch.map(() => "((SELECT id FROM model_catalog_snapshots WHERE source = ? AND retrieved_at = ? ORDER BY id DESC LIMIT 1), ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
    const bindings = batch.flatMap((model) => [
      catalog.source,
      catalog.retrievedAt,
      model.id,
      model.name,
      model.provider,
      model.createdAt,
      model.contextLength,
      model.inputPriceUsdPerMillionTokens,
      model.outputPriceUsdPerMillionTokens,
      JSON.stringify(model.raw),
    ]);
    statements.push(db
      .prepare(`INSERT INTO model_catalog_models (snapshot_id, model_id, name, provider, created_at, context_length, input_price_usd_per_million_tokens, output_price_usd_per_million_tokens, raw_json) VALUES ${placeholders}`)
      .bind(...bindings));
  }

  // One D1 batch keeps the snapshot header and all model rows in one transaction.
  await db.batch(statements);
  const inserted = await db
    .prepare("SELECT id FROM model_catalog_snapshots WHERE source = ? AND retrieved_at = ? ORDER BY id DESC LIMIT 1")
    .bind(catalog.source, catalog.retrievedAt)
    .first();
  if (inserted?.id == null) throw new Error("无法取得新模型快照编号。");
  return { snapshotId: inserted.id };
}

async function api(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/api/models") {
    if (request.method === "GET") return json(await publicModelStore(env.DB));
    if (request.method === "POST") {
      const reservation = await reserveModelCatalogSync(env.DB, Math.floor(Date.now() / 1000));
      if (reservation.retryAfter) {
        return json({ error: `模型目录刚刚更新过，请 ${reservation.retryAfter} 秒后再试。` }, 429, { "retry-after": String(reservation.retryAfter) });
      }
      let catalog;
      try {
        catalog = await fetchModelCatalog();
      } catch (error) {
        await releaseModelCatalogSync(env.DB, reservation.reservedAt);
        return json({ error: error instanceof Error ? error.message : "暂时无法取得在线模型目录。" }, 502);
      }
      const saved = await saveModelCatalog(env.DB, catalog);
      return json(await publicModelStore(env.DB, saved.snapshotId));
    }
    return json({ error: "接口不存在。" }, 404);
  }

  if (request.method !== "GET" || url.pathname !== "/api/fuel") return json({ error: "接口不存在。" }, 404);
  const startYear = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric" }).format(new Date())) - 2;
  const [events, latestSync] = await Promise.all([
    env.DB.prepare("SELECT * FROM fuel_events WHERE announced_on >= ? ORDER BY announced_on DESC, id DESC").bind(`${startYear}-01-01`).all(),
    latestSuccessfulSync(env.DB),
  ]);
  return json({ events: events.results, lastSuccessAt: latestSync?.finished_at ?? null });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(request, env);
      } catch (error) {
        console.error("FreshScope API request failed", {
          path: url.pathname,
          method: request.method,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        const errorMessage = url.pathname === "/api/models"
          ? "暂时无法读取或保存 Cloudflare D1 中的模型数据，请稍后重试。"
          : "暂时无法读取油价数据，请稍后重试。";
        return json({ error: errorMessage }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
