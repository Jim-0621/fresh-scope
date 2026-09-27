# 知新 FreshScope

追踪浙江省成品油价格公告的轻量网页应用。首期使用 Cloudflare Worker、Static Assets 和 D1；每日北京时间 08:00 采集，页面也提供带服务端凭证校验的手动更新。

## 已有首发数据

数据库迁移中预置交接文档已核对的 2026-09-24 价格：92 号汽油 8.58 元/升、95 号汽油 9.12 元/升、0 号柴油 8.28 元/升；另保留 2026-01-06 “不作调整”事件。首页会明确显示采集检查状态。首次采集器运行后，从浙江省发改委油价栏目补录可识别的 2026 年公告，事件按公告链接去重。

官方来源：

- [浙江省发改委成品油价格栏目](https://fzggw.zj.gov.cn/col/col1632199/cpyjg/index.html)
- [2026-09-24 公告](https://fzggw.zj.gov.cn/col/col1632199/cpyjg/art/2026/art_ed9666e8c2204d60b9207d75412e7cee.html)
- [2026-01-06 不调整公告](https://fzggw.zj.gov.cn/col/col1229629046/art/2026/art_6008c994616a47b8b6366e28cf329b7d.html)
- [2025-12-22 价格基准](https://fzggw.zj.gov.cn/art/2025/12/22/art_1229629046_5720443.html)

## 本地运行

需要 Node.js 20.19 或更高版本，或 22.12 或更高版本。前端由 Vite 构建，不依赖远程字体或前端运行时 CDN。

```sh
npm install
npm run db:migrate:local
npm run dev
```

Vite 将 `/api` 请求代理到 Wrangler 开发服务器（默认 `http://localhost:8787`）。本地 Worker 开发时可单独运行：

```sh
npx wrangler dev
```

## Cloudflare 初始化和部署

登录 Wrangler 后创建 D1 数据库，并把返回的数据库 ID 写入 `wrangler.jsonc` 的 `d1_databases[0].database_id`：

```sh
npx wrangler login
npx wrangler d1 create fresh-scope-db
npm run db:migrate:remote
npm run build
npx wrangler secret put UPDATE_TOKEN --name fresh-scope
npx wrangler deploy
```

`UPDATE_TOKEN` 只在 Worker 服务端保存。手动更新页面第一次使用时会要求输入凭证；输入值保存在当前浏览器的本地存储中，不会写入前端构建产物。保护凭证应保持私密并使用足够随机的值。

Cron `0 0 * * *` 使用 UTC，即每天北京时间 08:00。请到 Cloudflare Dashboard 确认部署后触发器已启用。未配置 `UPDATE_TOKEN` 时手动更新接口会拒绝服务；只读页面无需登录。

## 数据处理

- 价格公告按来源 URL 幂等去重；“不作调整”以独立事件保留，价格沿用上一份有效价格。
- 手动更新接口要求 `Authorization: Bearer <UPDATE_TOKEN>`，并有 5 分钟频率限制和共享采集锁。
- 公告解析和字段校验全部完成后才开始写入。采集失败写入运行记录，保留原有有效价格。
- 页面时间按 `Asia/Shanghai` 显示，公告日期和价格生效时间分开存储。
- 需监控浙江发改委公告 HTML 结构变化；解析器无法确认必需价格时会拒绝本轮写入。
