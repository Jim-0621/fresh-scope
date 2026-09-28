-- 本机从浙江发改委官网采集；执行前请核对公告来源及价格。
INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/1/3/art_1229629046_5239679.html', '2024-01-03', '2024-01-04T00:00:00+08:00', 0, 7.12, 7.67, 8.16, 7.34, 7.79, 'https://fzggw.zj.gov.cn/art/2024/1/3/art_1229629046_5239679.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/1/17/art_1229629046_5252004.html', '2024-01-17', '2024-01-18T00:00:00+08:00', 0, 7.08, 7.63, 8.12, 7.3, 7.74, 'https://fzggw.zj.gov.cn/art/2024/1/17/art_1229629046_5252004.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/1/31/art_1229629046_5259785.html', '2024-01-31', '2024-02-01T00:00:00+08:00', 0, 7.23, 7.79, 8.29, 7.47, 7.92, 'https://fzggw.zj.gov.cn/art/2024/1/31/art_1229629046_5259785.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/2/19/art_1229629046_5266178.html', '2024-02-19', NULL, 1, 7.23, 7.79, 8.29, 7.47, 7.92, 'https://fzggw.zj.gov.cn/art/2024/2/19/art_1229629046_5266178.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/3/4/art_1229629046_5271565.html', '2024-03-04', '2024-03-05T00:00:00+08:00', 0, 7.32, 7.89, 8.4, 7.58, 8.03, 'https://fzggw.zj.gov.cn/art/2024/3/4/art_1229629046_5271565.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/3/18/art_1229629046_5278510.html', '2024-03-18', NULL, 1, 7.32, 7.89, 8.4, 7.58, 8.03, 'https://fzggw.zj.gov.cn/art/2024/3/18/art_1229629046_5278510.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/4/1/art_1229629046_5285761.html', '2024-04-01', '2024-04-02T00:00:00+08:00', 0, 7.47, 8.05, 8.57, 7.74, 8.2, 'https://fzggw.zj.gov.cn/art/2024/4/1/art_1229629046_5285761.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/4/16/art_1229629046_5291035.html', '2024-04-16', '2024-04-17T00:00:00+08:00', 0, 7.61, 8.21, 8.74, 7.91, 8.38, 'https://fzggw.zj.gov.cn/art/2024/4/16/art_1229629046_5291035.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/4/29/art_1229629046_5295278.html', '2024-04-29', '2024-04-30T00:00:00+08:00', 0, 7.56, 8.16, 8.68, 7.85, 8.32, 'https://fzggw.zj.gov.cn/art/2024/4/29/art_1229629046_5295278.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/5/15/art_1229629046_5299722.html', '2024-05-15', '2024-05-16T00:00:00+08:00', 0, 7.39, 7.97, 8.48, 7.65, 8.11, 'https://fzggw.zj.gov.cn/art/2024/5/15/art_1229629046_5299722.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/5/29/art_1229629046_5310649.html', '2024-05-29', NULL, 1, 7.39, 7.97, 8.48, 7.65, 8.11, 'https://fzggw.zj.gov.cn/art/2024/5/29/art_1229629046_5310649.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/6/13/art_1229629046_5315987.html', '2024-06-13', '2024-06-14T00:00:00+08:00', 0, 7.25, 7.82, 8.32, 7.5, 7.95, 'https://fzggw.zj.gov.cn/art/2024/6/13/art_1229629046_5315987.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/6/27/art_1229629046_5323081.html', '2024-06-27', '2024-06-28T00:00:00+08:00', 0, 7.4, 7.99, 8.49, 7.67, 8.13, 'https://fzggw.zj.gov.cn/art/2024/6/27/art_1229629046_5323081.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/7/11/art_1229629046_5328880.html', '2024-07-11', '2024-07-12T00:00:00+08:00', 0, 7.49, 8.07, 8.59, 7.76, 8.23, 'https://fzggw.zj.gov.cn/art/2024/7/11/art_1229629046_5328880.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/7/25/art_1229629046_5337432.html', '2024-07-25', '2024-07-26T00:00:00+08:00', 0, 7.38, 7.96, 8.46, 7.64, 8.1, 'https://fzggw.zj.gov.cn/art/2024/7/25/art_1229629046_5337432.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/8/8/art_1229629046_5345605.html', '2024-08-08', '2024-08-09T00:00:00+08:00', 0, 7.15, 7.71, 8.21, 7.39, 7.83, 'https://fzggw.zj.gov.cn/art/2024/8/8/art_1229629046_5345605.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/8/22/art_1229629046_5360407.html', '2024-08-22', NULL, 1, 7.15, 7.71, 8.21, 7.39, 7.83, 'https://fzggw.zj.gov.cn/art/2024/8/22/art_1229629046_5360407.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/9/5/art_1229629046_5370234.html', '2024-09-05', '2024-09-06T00:00:00+08:00', 0, 7.08, 7.63, 8.12, 7.31, 7.74, 'https://fzggw.zj.gov.cn/art/2024/9/5/art_1229629046_5370234.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/9/20/art_1229629046_5376454.html', '2024-09-20', '2024-09-21T00:00:00+08:00', 0, 6.81, 7.34, 7.81, 7.01, 7.43, 'https://fzggw.zj.gov.cn/art/2024/9/20/art_1229629046_5376454.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/10/10/art_1229629046_5382263.html', '2024-10-10', '2024-10-11T00:00:00+08:00', 0, 6.91, 7.45, 7.93, 7.12, 7.55, 'https://fzggw.zj.gov.cn/art/2024/10/10/art_1229629046_5382263.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/10/23/art_1229629046_5389143.html', '2024-10-23', '2024-10-24T00:00:00+08:00', 0, 6.98, 7.53, 8.01, 7.19, 7.63, 'https://fzggw.zj.gov.cn/art/2024/10/23/art_1229629046_5389143.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/11/6/art_1229629046_5394210.html', '2024-11-06', '2024-11-07T00:00:00+08:00', 0, 6.87, 7.41, 7.88, 7.07, 7.5, 'https://fzggw.zj.gov.cn/art/2024/11/6/art_1229629046_5394210.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/11/20/art_1229629046_5399701.html', '2024-11-20', NULL, 1, 6.87, 7.41, 7.88, 7.07, 7.5, 'https://fzggw.zj.gov.cn/art/2024/11/20/art_1229629046_5399701.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/12/4/art_1229629046_5419646.html', '2024-12-04', NULL, 1, 6.87, 7.41, 7.88, 7.07, 7.5, 'https://fzggw.zj.gov.cn/art/2024/12/4/art_1229629046_5419646.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2024/12/18/art_1229629046_5426263.html', '2024-12-18', NULL, 1, 6.87, 7.41, 7.88, 7.07, 7.5, 'https://fzggw.zj.gov.cn/art/2024/12/18/art_1229629046_5426263.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/1/2/art_1229629046_5436880.html', '2025-01-02', '2025-01-03T00:00:00+08:00', 0, 6.92, 7.47, 7.94, 7.13, 7.56, 'https://fzggw.zj.gov.cn/art/2025/1/2/art_1229629046_5436880.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/1/16/art_1229629046_5445387.html', '2025-01-16', '2025-01-17T00:00:00+08:00', 0, 7.17, 7.74, 8.23, 7.41, 7.86, 'https://fzggw.zj.gov.cn/art/2025/1/16/art_1229629046_5445387.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/2/6/art_1229629046_5453419.html', '2025-02-06', NULL, 1, 7.17, 7.74, 8.23, 7.41, 7.86, 'https://fzggw.zj.gov.cn/art/2025/2/6/art_1229629046_5453419.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/2/19/art_1229629046_5459226.html', '2025-02-19', '2025-02-20T00:00:00+08:00', 0, 7.05, 7.6, 8.09, 7.28, 7.71, 'https://fzggw.zj.gov.cn/art/2025/2/19/art_1229629046_5459226.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/3/5/art_1229629046_5471296.html', '2025-03-05', '2025-03-06T00:00:00+08:00', 0, 6.95, 7.49, 7.97, 7.16, 7.59, 'https://fzggw.zj.gov.cn/art/2025/3/5/art_1229629046_5471296.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/3/19/art_1229629046_5479775.html', '2025-03-19', '2025-03-20T00:00:00+08:00', 0, 6.74, 7.27, 7.73, 6.93, 7.35, 'https://fzggw.zj.gov.cn/art/2025/3/19/art_1229629046_5479775.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/4/2/art_1229629046_5487740.html', '2025-04-02', '2025-04-03T00:00:00+08:00', 0, 6.91, 7.45, 7.93, 7.12, 7.55, 'https://fzggw.zj.gov.cn/art/2025/4/2/art_1229629046_5487740.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/4/17/art_1229629046_5498912.html', '2025-04-17', '2025-04-18T00:00:00+08:00', 0, 6.56, 7.07, 7.52, 6.72, 7.13, 'https://fzggw.zj.gov.cn/art/2025/4/17/art_1229629046_5498912.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/4/30/art_1229629046_5505408.html', '2025-04-30', NULL, 1, 6.56, 7.07, 7.52, 6.72, 7.13, 'https://fzggw.zj.gov.cn/art/2025/4/30/art_1229629046_5505408.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/5/19/art_1229629046_5513068.html', '2025-05-19', '2025-05-20T00:00:00+08:00', 0, 6.39, 6.89, 7.33, 6.54, 6.93, 'https://fzggw.zj.gov.cn/art/2025/5/19/art_1229629046_5513068.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/6/3/art_1229629046_5525572.html', '2025-06-03', '2025-06-04T00:00:00+08:00', 0, 6.43, 6.94, 7.38, 6.59, 6.98, 'https://fzggw.zj.gov.cn/art/2025/6/3/art_1229629046_5525572.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/6/17/art_1229629046_5531857.html', '2025-06-17', '2025-06-18T00:00:00+08:00', 0, 6.63, 7.15, 7.6, 6.81, 7.21, 'https://fzggw.zj.gov.cn/art/2025/6/17/art_1229629046_5531857.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/7/1/art_1229629046_5539222.html', '2025-07-01', '2025-07-02T00:00:00+08:00', 0, 6.8, 7.33, 7.8, 7, 7.42, 'https://fzggw.zj.gov.cn/art/2025/7/1/art_1229629046_5539222.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/7/15/art_1229629046_5546293.html', '2025-07-15', '2025-07-16T00:00:00+08:00', 0, 6.7, 7.23, 7.69, 6.89, 7.3, 'https://fzggw.zj.gov.cn/art/2025/7/15/art_1229629046_5546293.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/7/29/art_1229629046_5556446.html', '2025-07-29', NULL, 1, 6.7, 7.23, 7.69, 6.89, 7.3, 'https://fzggw.zj.gov.cn/art/2025/7/29/art_1229629046_5556446.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/8/12/art_1229629046_5566183.html', '2025-08-12', NULL, 1, 6.7, 7.23, 7.69, 6.89, 7.3, 'https://fzggw.zj.gov.cn/art/2025/8/12/art_1229629046_5566183.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/8/26/art_1229629046_5588811.html', '2025-08-26', '2025-08-27T00:00:00+08:00', 0, 6.57, 7.09, 7.54, 6.74, 7.15, 'https://fzggw.zj.gov.cn/art/2025/8/26/art_1229629046_5588811.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/9/9/art_1229629046_5638003.html', '2025-09-09', NULL, 1, 6.57, 7.09, 7.54, 6.74, 7.15, 'https://fzggw.zj.gov.cn/art/2025/9/9/art_1229629046_5638003.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/9/23/art_1229629046_5644970.html', '2025-09-23', NULL, 1, 6.57, 7.09, 7.54, 6.74, 7.15, 'https://fzggw.zj.gov.cn/art/2025/9/23/art_1229629046_5644970.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/10/13/art_1229629046_5658283.html', '2025-10-13', '2025-10-14T00:00:00+08:00', 0, 6.52, 7.03, 7.48, 6.68, 7.08, 'https://fzggw.zj.gov.cn/art/2025/10/13/art_1229629046_5658283.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/10/27/art_1229629046_5667899.html', '2025-10-27', '2025-10-28T00:00:00+08:00', 0, 6.32, 6.82, 7.25, 6.46, 6.85, 'https://fzggw.zj.gov.cn/art/2025/10/27/art_1229629046_5667899.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/11/10/art_1229629046_5673458.html', '2025-11-10', '2025-11-11T00:00:00+08:00', 0, 6.41, 6.92, 7.36, 6.57, 6.96, 'https://fzggw.zj.gov.cn/art/2025/11/10/art_1229629046_5673458.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/11/24/art_1229629046_5678066.html', '2025-11-24', '2025-11-25T00:00:00+08:00', 0, 6.36, 6.86, 7.3, 6.51, 6.9, 'https://fzggw.zj.gov.cn/art/2025/11/24/art_1229629046_5678066.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/12/8/art_1229629046_5681829.html', '2025-12-08', '2025-12-09T00:00:00+08:00', 0, 6.32, 6.82, 7.25, 6.46, 6.85, 'https://fzggw.zj.gov.cn/art/2025/12/8/art_1229629046_5681829.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/art/2025/12/22/art_1229629046_5720443.html', '2025-12-22', '2025-12-23T00:00:00+08:00', 0, 6.19, 6.68, 7.11, 6.32, 6.7, 'https://fzggw.zj.gov.cn/art/2025/12/22/art_1229629046_5720443.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html', '2026-01-06', NULL, 1, 6.19, 6.68, 7.11, 6.32, 6.7, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_0d5f5ed918e74c0e85c278c155000402.html', '2026-01-20', '2026-01-21T00:00:00+08:00', 0, 6.26, 6.75, 7.18, 6.39, 6.78, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_0d5f5ed918e74c0e85c278c155000402.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_9d5b9ceaffa94fe8b93832a7179709a2.html', '2026-02-03', '2026-02-04T00:00:00+08:00', 0, 6.41, 6.91, 7.35, 6.56, 6.96, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_9d5b9ceaffa94fe8b93832a7179709a2.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_8ac7cd1d51e84201b04d382229278cec.html', '2026-02-24', '2026-02-25T00:00:00+08:00', 0, 6.54, 7.05, 7.5, 6.71, 7.11, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_8ac7cd1d51e84201b04d382229278cec.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_fdec8de9085e4584a679d9f6ecbe12e6.html', '2026-03-09', '2026-03-10T00:00:00+08:00', 0, 7.05, 7.61, 8.09, 7.28, 7.72, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_fdec8de9085e4584a679d9f6ecbe12e6.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_7c2b4abc9fbe46d8b9a8a9a9d09b7af3.html', '2026-03-23', '2026-03-24T00:00:00+08:00', 0, 7.91, 8.53, 9.08, 8.23, 8.73, 'https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_7c2b4abc9fbe46d8b9a8a9a9d09b7af3.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_526c80c76a1b4801b34ad37a1ba81f9e.html', '2026-04-07', '2026-04-08T00:00:00+08:00', 0, 8.22, 8.87, 9.43, 8.58, 9.09, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_526c80c76a1b4801b34ad37a1ba81f9e.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_fb453a1e05104499a3b14f683d7b5657.html', '2026-04-21', '2026-04-22T00:00:00+08:00', 0, 7.81, 8.42, 8.96, 8.12, 8.61, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_fb453a1e05104499a3b14f683d7b5657.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_4b333cceb53c4535b74b7fe9baff2241.html', '2026-05-08', '2026-05-09T00:00:00+08:00', 0, 8.05, 8.68, 9.23, 8.39, 8.89, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_4b333cceb53c4535b74b7fe9baff2241.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_2f67d96d980144f78ec5d090f40e1185.html', '2026-05-21', '2026-05-22T00:00:00+08:00', 0, 8.1, 8.74, 9.3, 8.45, 8.96, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_2f67d96d980144f78ec5d090f40e1185.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_a896d5e9be7d4303a1e2cc5e78753c08.html', '2026-06-04', '2026-06-05T00:00:00+08:00', 0, 7.71, 8.32, 8.85, 8.02, 8.5, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_a896d5e9be7d4303a1e2cc5e78753c08.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_274905738b2945e98289f869286f6eea.html', '2026-06-18', '2026-06-19T00:00:00+08:00', 0, 7.33, 7.91, 8.41, 7.59, 8.05, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_274905738b2945e98289f869286f6eea.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_6eb83bc3139749009bdabcc66d6616d9.html', '2026-07-03', '2026-07-04T00:00:00+08:00', 0, 6.63, 7.15, 7.61, 6.81, 7.22, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_6eb83bc3139749009bdabcc66d6616d9.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_dddc04b9b47d4560bc26fcf36a74ce52.html', '2026-07-17', '2026-07-18T00:00:00+08:00', 0, 6.85, 7.39, 7.86, 7.06, 7.48, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_dddc04b9b47d4560bc26fcf36a74ce52.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ae07a532588342b9b0c4b9a47a508180.html', '2026-07-31', '2026-08-01T00:00:00+08:00', 0, 7.36, 7.94, 8.44, 7.62, 8.08, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ae07a532588342b9b0c4b9a47a508180.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_3245a1f8163a4180bd8b2b7f327e52dc.html', '2026-08-14', '2026-08-15T00:00:00+08:00', 0, 7.19, 7.75, 8.25, 7.43, 7.88, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_3245a1f8163a4180bd8b2b7f327e52dc.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ef6622dd9bb24575b0cbd9aaa88b09f5.html', '2026-08-28', '2026-08-29T00:00:00+08:00', 0, 7.47, 8.05, 8.57, 7.74, 8.2, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ef6622dd9bb24575b0cbd9aaa88b09f5.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1599544/art/2026/art_00f45baf51384f3c9d3db61b19852946.html', '2026-09-11', '2026-09-12T00:00:00+08:00', 0, 7.66, 8.26, 8.79, 7.95, 8.43, 'https://fzggw.zj.gov.cn/col/col1599544/art/2026/art_00f45baf51384f3c9d3db61b19852946.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;

INSERT INTO fuel_events
  (source_key, announced_on, effective_at, is_no_change, price_89, price_92, price_95, price_0, price_m10, source_url)
VALUES ('https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html', '2026-09-24', '2026-09-25T00:00:00+08:00', 0, 7.95, 8.58, 9.12, 8.28, 8.78, 'https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html')
ON CONFLICT(source_key) DO UPDATE SET
  effective_at = COALESCE(fuel_events.effective_at, excluded.effective_at),
  price_89 = COALESCE(fuel_events.price_89, excluded.price_89),
  price_92 = COALESCE(fuel_events.price_92, excluded.price_92),
  price_95 = COALESCE(fuel_events.price_95, excluded.price_95),
  price_0 = COALESCE(fuel_events.price_0, excluded.price_0),
  price_m10 = CASE WHEN fuel_events.price_m10 = 4.98 THEN COALESCE(excluded.price_m10, fuel_events.price_m10)
                   ELSE COALESCE(fuel_events.price_m10, excluded.price_m10) END;
