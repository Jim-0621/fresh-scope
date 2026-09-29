const MODEL_CATALOG_COOLDOWN_SECONDS = 60;
const MODEL_CATALOG_SOURCE = "Artificial Analysis public LLM leaderboard";
const MODEL_CATALOG_URL = "https://artificialanalysis.ai/zh/leaderboards/models";

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
  const raw = parseJson(row.raw_json, null);
  return {
    id: row.model_id,
    name: row.name,
    provider: row.provider,
    createdAt: row.created_at,
    contextLength: nullableNumber(row.context_length),
    inputPriceUsdPerMillionTokens: nullableNumber(row.input_price_usd_per_million_tokens),
    outputPriceUsdPerMillionTokens: nullableNumber(row.output_price_usd_per_million_tokens),
    reasoning: raw?.isReasoning === true,
    effort: modelEffort(raw?.shortName ?? raw?.name),
    intelligenceIndex: nullableNumber(raw?.intelligenceIndex),
    indexEstimated: raw?.intelligenceIndexIsEstimated === true,
    taskCostUsd: nullableNumber(raw?.intelligenceIndexCostPerTask?.cost?.total),
    timePerTaskSeconds: nullableNumber(raw?.medianEndToEndResponseTimeSeconds),
    outputTokensPerSecond: nullableNumber(raw?.medianOutputTokensPerSecond),
    raw,
  };
}

function modelEffort(name) {
  return String(name ?? "").match(/\b(xhigh|high|medium|low|max)\b/i)?.[1].toLowerCase() ?? null;
}

function isTextClientModel(namespace, slug, name) {
  if (!/^(?:anthropic|openai)$/.test(namespace)) return false;
  if (namespace === "anthropic" && !/^claude-/i.test(slug)) return false;
  if (namespace === "openai" && !/^gpt-/i.test(slug)) return false;
  const value = `${slug} ${name}`;
  if (/(?:^|[\s/_-])(?:audio|image|video|speech|vision|realtime|transcribe|transcription|tts|whisper|dall[\s-]?e|sora|non[\s_-]*reasoning)(?:$|[\s/_-])/i.test(value)) return false;
  return !/(?:^|[-_:\s])(?:batch|latest|pro|free|nitro|online|extended|exacto|preview|codex)(?:$|[-_:\s])/i.test(value);
}

function cleanModelName(value) {
  return String(value ?? "")
    .replace(/&#x([\da-f]+);/gi, (_, hex) => {
      const codePoint = parseInt(hex, 16);
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : "";
    })
    .replace(/&#(\d+);/g, (_, decimal) => {
      const codePoint = Number(decimal);
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : "";
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/<[^>]*>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function findEmbeddedJsonArray(serialized, key, predicate) {
  const marker = `"${key}":[`;
  let offset = 0;
  while (true) {
    const markerIndex = serialized.indexOf(marker, offset);
    if (markerIndex < 0) return null;
    const start = markerIndex + marker.length - 1;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < serialized.length; index += 1) {
      const character = serialized[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') inString = true;
      else if (character === "[") depth += 1;
      else if (character === "]") {
        depth -= 1;
        if (depth === 0) {
          try {
            const value = JSON.parse(serialized.slice(start, index + 1));
            if (Array.isArray(value) && predicate(value)) return value;
          } catch {
            // Continue searching if this is another RSC field with the same name.
          }
          break;
        }
      }
    }
    offset = markerIndex + marker.length;
  }
}

function extractArtificialAnalysisModels(html) {
  const chunks = [...html.matchAll(/<script[^>]*>self\.__next_f\.push\(\[1,"((?:\\.|[^"\\])*)"\]\)<\/script>/g)]
    .map((match) => JSON.parse(`"${match[1]}"`));
  if (!chunks.length) throw new Error("Artificial Analysis 未返回可识别的排行榜数据。");
  const serialized = chunks.join("");
  const sourceModels = findEmbeddedJsonArray(serialized, "models", (rows) =>
    rows.length > 0 && typeof rows[0]?.modelCreatorName === "string" && "intelligenceIndex" in rows[0]);
  const modelIdentities = findEmbeddedJsonArray(serialized, "models", (rows) =>
    rows.length > 0 && typeof rows[0]?.releaseSlug === "string");
  const releases = findEmbeddedJsonArray(serialized, "releases", (rows) =>
    rows.length > 0 && typeof rows[0]?.releaseDate === "string" && rows[0]?.creator);
  if (!sourceModels || !modelIdentities || !releases) {
    throw new Error("Artificial Analysis 排行榜结构已变化，无法读取完整模型数据。");
  }

  const releaseSlugByModelSlug = new Map(modelIdentities.map((model) => [model.slug, model.releaseSlug]));
  const releaseDateBySlug = new Map(releases.map((release) => [release.slug, release.releaseDate]));
  return sourceModels.flatMap((model) => {
    const slug = String(model.slug ?? "").toLowerCase();
    const creator = String(model.modelCreatorName ?? "").toLowerCase();
    const provider = creator === "anthropic" ? "Anthropic" : creator === "openai" ? "OpenAI" : null;
    const namespace = provider === "Anthropic" ? "anthropic" : provider === "OpenAI" ? "openai" : null;
    const name = cleanModelName(model.shortName ?? model.name ?? slug);
    if (!provider || !namespace || !slug || !isTextClientModel(namespace, slug, name)) return [];

    const releaseSlug = releaseSlugByModelSlug.get(slug) ?? slug;
    return [{
      id: `${namespace}/${slug}`,
      name,
      provider,
      createdAt: releaseDateBySlug.get(releaseSlug) ?? null,
      contextLength: nullableNumber(model.contextWindowTokens),
      inputPriceUsdPerMillionTokens: nullableNumber(model.price1mInputTokens),
      outputPriceUsdPerMillionTokens: nullableNumber(model.price1mOutputTokens),
      reasoning: model.isReasoning === true,
      effort: modelEffort(model.shortName ?? model.name),
      intelligenceIndex: nullableNumber(model.intelligenceIndex),
      indexEstimated: model.intelligenceIndexIsEstimated === true,
      taskCostUsd: nullableNumber(model.intelligenceIndexCostPerTask?.cost?.total),
      timePerTaskSeconds: nullableNumber(model.medianEndToEndResponseTimeSeconds),
      outputTokensPerSecond: nullableNumber(model.medianOutputTokensPerSecond),
      raw: model,
    }];
  });
}

function baselineFromCatalog(catalog) {
  return {
    source: catalog.source,
    sourceUrl: MODEL_CATALOG_URL,
    retrievedAt: catalog.retrievedAt,
    models: catalog.models.map((model) => ({
      slug: String(model.raw?.slug ?? model.id.split("/").at(-1) ?? model.id),
      name: model.name,
      provider: model.provider,
      releaseDate: model.createdAt,
      reasoning: model.reasoning === true,
      effort: model.effort,
      intelligenceIndex: model.intelligenceIndex,
      indexEstimated: model.indexEstimated === true,
      taskCostUsd: model.taskCostUsd,
      inputPriceUsdPerMillionTokens: model.inputPriceUsdPerMillionTokens,
      outputPriceUsdPerMillionTokens: model.outputPriceUsdPerMillionTokens,
      contextWindowTokens: model.contextLength,
      timePerTaskSeconds: model.timePerTaskSeconds,
      outputTokensPerSecond: model.outputTokensPerSecond,
    })),
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
      .prepare("SELECT id, source, retrieved_at FROM model_catalog_snapshots WHERE id = ? AND source = ?")
      .bind(currentSnapshotId, MODEL_CATALOG_SOURCE)
      .first();
    previousSnapshot = currentSnapshot
      ? await db
        .prepare("SELECT id, source, retrieved_at FROM model_catalog_snapshots WHERE id < ? AND source = ? ORDER BY id DESC LIMIT 1")
        .bind(currentSnapshot.id, MODEL_CATALOG_SOURCE)
        .first()
      : null;
  } else {
    const snapshots = await db
      .prepare("SELECT id, source, retrieved_at FROM model_catalog_snapshots WHERE source = ? ORDER BY id DESC LIMIT 2")
      .bind(MODEL_CATALOG_SOURCE)
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
  let baseline = baselineRow
    ? {
      source: baselineRow.source,
      sourceUrl: MODEL_CATALOG_URL,
      retrievedAt: baselineRow.retrieved_at,
      models: baselineModels,
    }
    : null;
  if (currentCatalog) baseline = baselineFromCatalog(currentCatalog);

  return { baseline, currentCatalog, previousCatalog, storage: "cloudflare-d1" };
}

async function fetchModelCatalog() {
  const upstream = await fetch(MODEL_CATALOG_URL, { headers: { accept: "text/html" } });
  if (!upstream.ok) throw new Error(`Artificial Analysis 模型排行榜返回 ${upstream.status}。`);

  const models = extractArtificialAnalysisModels(await upstream.text())
    .sort((a, b) => a.provider.localeCompare(b.provider) || (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || a.name.localeCompare(b.name));

  if (!["Anthropic", "OpenAI"].every((provider) => models.some((model) => model.provider === provider))) {
    throw new Error("Artificial Analysis 排行榜未同时返回 Anthropic 和 OpenAI 模型，本次未更新快照。");
  }
  return { source: MODEL_CATALOG_SOURCE, retrievedAt: new Date().toISOString(), models };
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
