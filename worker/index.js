const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

function latestSuccessfulSync(db) {
  return db
    .prepare("SELECT finished_at FROM collection_runs WHERE status = 'success' ORDER BY id DESC LIMIT 1")
    .first();
}

async function api(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/fuel" || request.method !== "GET") {
    return json({ error: "接口不存在。" }, 404);
  }

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
      } catch {
        return json({ error: "暂时无法读取油价数据，请稍后重试。" }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
