CREATE TABLE IF NOT EXISTS fuel_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_key TEXT NOT NULL UNIQUE,
  announced_on TEXT NOT NULL,
  effective_at TEXT,
  is_no_change INTEGER NOT NULL DEFAULT 0 CHECK (is_no_change IN (0, 1)),
  price_89 REAL,
  price_92 REAL,
  price_95 REAL,
  price_0 REAL,
  price_m10 REAL,
  source_url TEXT NOT NULL,
  collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fuel_events_announced_on
  ON fuel_events (announced_on DESC, id DESC);

CREATE TABLE IF NOT EXISTS collection_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('cron', 'manual')),
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed', 'skipped')),
  discovered_count INTEGER NOT NULL DEFAULT 0,
  inserted_count INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT
);

CREATE INDEX IF NOT EXISTS idx_collection_runs_started_at
  ON collection_runs (started_at DESC);

CREATE TABLE IF NOT EXISTS collector_lock (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  locked_until INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS manual_throttle (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_requested_at INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO collector_lock (id, locked_until) VALUES (1, 0);
INSERT OR IGNORE INTO manual_throttle (id, last_requested_at) VALUES (1, 0);

-- Prices verified in the project handoff document against the Zhejiang DRC announcement dated 2026-09-24.
INSERT OR IGNORE INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES
  ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html',
   '2026-09-24', NULL, 0, NULL, 8.58, 9.12, 8.28, NULL,
   'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html');

-- Preserve the announced no-change event separately from a price-changing snapshot.
INSERT OR IGNORE INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, source_url)
VALUES
  ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html',
   '2026-01-06', NULL, 1,
   'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html');
