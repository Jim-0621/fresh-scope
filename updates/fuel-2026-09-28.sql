-- 本机从浙江发改委官网采集；执行前请核对公告来源及价格。
INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html', '2026-01-06', NULL, 1, NULL, NULL, NULL, NULL, NULL, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_0d5f5ed918e74c0e85c278c155000402.html', '2026-01-20', '2026-01-21T00:00:00+08:00', 0, 6.26, 6.75, 7.18, 6.39, 4.98, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_0d5f5ed918e74c0e85c278c155000402.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_9d5b9ceaffa94fe8b93832a7179709a2.html', '2026-02-03', '2026-02-04T00:00:00+08:00', 0, 6.41, 6.91, 7.35, 6.56, 4.98, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_9d5b9ceaffa94fe8b93832a7179709a2.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_8ac7cd1d51e84201b04d382229278cec.html', '2026-02-24', '2026-02-25T00:00:00+08:00', 0, 6.54, 7.05, 7.5, 6.71, 4.98, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_8ac7cd1d51e84201b04d382229278cec.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_fdec8de9085e4584a679d9f6ecbe12e6.html', '2026-03-09', '2026-03-10T00:00:00+08:00', 0, 7.05, 7.61, 8.09, 7.28, 4.98, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_fdec8de9085e4584a679d9f6ecbe12e6.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_7c2b4abc9fbe46d8b9a8a9a9d09b7af3.html', '2026-03-23', '2026-03-24T00:00:00+08:00', 0, 7.91, 8.53, 9.08, 8.23, 4.98, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_7c2b4abc9fbe46d8b9a8a9a9d09b7af3.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_526c80c76a1b4801b34ad37a1ba81f9e.html', '2026-04-07', '2026-04-08T00:00:00+08:00', 0, 8.22, 8.87, 9.43, 8.58, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_526c80c76a1b4801b34ad37a1ba81f9e.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_fb453a1e05104499a3b14f683d7b5657.html', '2026-04-21', '2026-04-22T00:00:00+08:00', 0, 7.81, 8.42, 8.96, 8.12, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_fb453a1e05104499a3b14f683d7b5657.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_4b333cceb53c4535b74b7fe9baff2241.html', '2026-05-08', '2026-05-09T00:00:00+08:00', 0, 8.05, 8.68, 9.23, 8.39, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_4b333cceb53c4535b74b7fe9baff2241.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_2f67d96d980144f78ec5d090f40e1185.html', '2026-05-21', '2026-05-22T00:00:00+08:00', 0, 8.1, 8.74, 9.3, 8.45, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_2f67d96d980144f78ec5d090f40e1185.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_a896d5e9be7d4303a1e2cc5e78753c08.html', '2026-06-04', '2026-06-05T00:00:00+08:00', 0, 7.71, 8.32, 8.85, 8.02, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_a896d5e9be7d4303a1e2cc5e78753c08.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_274905738b2945e98289f869286f6eea.html', '2026-06-18', '2026-06-19T00:00:00+08:00', 0, 7.33, 7.91, 8.41, 7.59, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_274905738b2945e98289f869286f6eea.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_6eb83bc3139749009bdabcc66d6616d9.html', '2026-07-03', '2026-07-04T00:00:00+08:00', 0, 6.63, 7.15, 7.61, 6.81, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_6eb83bc3139749009bdabcc66d6616d9.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_dddc04b9b47d4560bc26fcf36a74ce52.html', '2026-07-17', '2026-07-18T00:00:00+08:00', 0, 6.85, 7.39, 7.86, 7.06, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_dddc04b9b47d4560bc26fcf36a74ce52.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ae07a532588342b9b0c4b9a47a508180.html', '2026-07-31', '2026-08-01T00:00:00+08:00', 0, 7.36, 7.94, 8.44, 7.62, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ae07a532588342b9b0c4b9a47a508180.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_3245a1f8163a4180bd8b2b7f327e52dc.html', '2026-08-14', '2026-08-15T00:00:00+08:00', 0, 7.19, 7.75, 8.25, 7.43, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_3245a1f8163a4180bd8b2b7f327e52dc.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ef6622dd9bb24575b0cbd9aaa88b09f5.html', '2026-08-28', '2026-08-29T00:00:00+08:00', 0, 7.47, 8.05, 8.57, 7.74, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ef6622dd9bb24575b0cbd9aaa88b09f5.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1599544/art/2026/art_00f45baf51384f3c9d3db61b19852946.html', '2026-09-11', '2026-09-12T00:00:00+08:00', 0, 7.66, 8.26, 8.79, 7.95, 4.98, 'https://fzggw.zj.gov.cn/col/col1599544/art/2026/art_00f45baf51384f3c9d3db61b19852946.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html', '2026-09-24', '2026-09-25T00:00:00+08:00', 0, 7.95, 8.58, 9.12, 8.28, 4.98, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = COALESCE(fuel_events.price_m10, excluded.price_m10);
