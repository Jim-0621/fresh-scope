# 知新 FreshScope

追踪浙江省成品油价格和 Claude / GPT 在线模型目录的轻量网页应用。网站使用 Cloudflare Pages，数据 API 由 Cloudflare Worker 和 D1 提供；油价由本机脚本读取官网后手动同步到 D1，模型目录和历史快照也保存在 D1。

## 模型观察

“模型”页面展示 OpenRouter 公开目录中 Anthropic 和 OpenAI 发布者的全部模型，列出公开的输入与输出 token 价格、上下文长度和目录日期。价格图的横轴是输入价，纵轴是输出价，均使用线性刻度；同一模型的计费变体用线连接，悬停或聚焦圆点可查看详情。公司筛选同时影响图表和模型列表；单模型勾选只影响图表。

打开模型页时，Worker 从 D1 读取最近两次目录快照。点击“更新目录”后，Worker 拉取 OpenRouter 的公开模型目录，筛选 Anthropic 和 OpenAI 发布者并排除标记为 non-reasoning 的模型，然后把规范化字段及每个模型的原始 JSON 追加保存到 D1。页面会比较新增、目录未返回以及名称、价格、上下文变化；更新失败时保留已有快照。在线目录不是两家公司的官方公告，也不提供能力分数或每任务成本。公开更新接口设有一分钟全局冷却时间。

模型公司、图表模型勾选和选择器搜索词，以及油价页的油品和年份，都保存在当前浏览器中；重新打开后继续使用上次选择。过期年份会自动回到最新可选年份。不同浏览器或设备之间不会同步这些筛选条件。

- [Artificial Analysis 基准页面](https://artificialanalysis.ai/zh#capability-indices)
- [OpenRouter 公共模型目录](https://openrouter.ai/models)

## 已有首发数据

数据库迁移中预置交接文档已核对的 2026-09-24 价格：92 号汽油 8.58 元/升、95 号汽油 9.12 元/升、0 号柴油 8.28 元/升；另保留 2026-01-06 “不作调整”事件。网页显示最近一次成功同步时间；首次运行本机脚本后，可从浙江省发改委油价栏目补录最近三年的公告，事件按公告链接去重。

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

在能访问浙江发改委官网的电脑上运行下面的命令，即可采集并同步到 Cloudflare D1：

```sh
npm run sync:fuel
```

首次使用前安装依赖，并登录 Wrangler 一次：

```sh
npm install
npx wrangler login
```

脚本会读取云端已有记录，只下载新公告或仍缺少价格/生效时间的公告；校验完所有公告后生成 `updates/fuel-sync-*.sql` 留档，再调用 Wrangler 写入远程 D1。来源 URL 用于幂等去重；已有非空价格和生效时间不会被覆盖，之前错误写入的 `-10` 号柴油价格 `4.98` 会按官网值修正。采集或校验失败时不会执行 D1 写入。同步完成后，网页会显示最近同步时间。

脚本采集最近三个自然年（例如 2026 年运行时为 2024—2026 年）。也可以指定 SQL 留档路径：

```sh
npm run sync:fuel -- updates/my-fuel-sync.sql
```

运行机器需要能访问浙江发改委官网，并已通过 `npx wrangler login` 登录有 `fresh-scope-db` 写入权限的 Cloudflare 账号。

登录 Wrangler 后创建 D1 数据库，并把返回的数据库 ID 写入 `wrangler.jsonc` 的 `d1_databases[0].database_id`：

```sh
npx wrangler login
npx wrangler d1 create fresh-scope-db
npm run db:migrate:remote
npm run build
npx wrangler deploy
```

Worker 提供只读油价查询、D1 模型快照读取和模型目录更新接口。首次部署新版前运行 `npm run db:migrate:remote`，迁移会创建模型数据表；迁移中的 Artificial Analysis 基准是早期留档，当前模型页不使用。Worker 不配置官网采集 Cron，也不提供网页手动更新油价接口。公开页面无需登录。

## Cloudflare Pages

网站发布到 https://fresh-scope.pages.dev。Pages Function 通过 Service Binding 将 /api/* 转发到 fresh-scope Worker，因此网页地址不依赖 Cloudflare 账号的 workers.dev 子域名；Worker 只负责从 D1 查询数据。首次部署时先用 Wrangler 创建 fresh-scope Pages 项目，再运行 `npm run deploy:pages`。

## 数据处理

- 价格公告按来源 URL 幂等去重；“不作调整”以独立事件保留，价格沿用上一份有效价格。
- 网页和 Worker 不提供在线更新油价入口；油价更新由本地脚本执行。模型页更新会把每次成功取得的在线目录快照写入 Cloudflare D1。
- 本地脚本先完成公告读取和字段校验，再通过 Wrangler 同步 D1；按公告 URL 去重，只补充缺失字段并保留已有有效值。
- 采集器优先直连浙江省发改委；直连失败时，通过 Jina Reader 读取同一官方公告 URL，来源仍为省发改委原文。
- 页面时间按 `Asia/Shanghai` 显示，公告日期和价格生效时间分开存储。
- 需监控浙江发改委公告 HTML 结构变化；解析器无法确认必需价格时会拒绝本轮写入。
