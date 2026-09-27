import { stripTypeScriptTypes } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const output = new URL("../dist/", import.meta.url);
const assets = new URL("assets/", output);
mkdirSync(assets, { recursive: true });

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
  .replace('<script type="module" src="/src/main.ts"></script>', '<script type="module" src="/assets/main.js"></script>')
  .replace("</head>", '    <link rel="stylesheet" href="/assets/style.css" />\n  </head>');
const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const javascript = stripTypeScriptTypes(source, { mode: "strip" }).replace(/^import\s+["']\.\/style\.css["'];\s*/m, "");

writeFileSync(new URL("index.html", output), html);
writeFileSync(new URL("main.js", assets), javascript);
writeFileSync(new URL("style.css", assets), readFileSync(new URL("../src/style.css", import.meta.url)));
console.log("静态资源已生成到 dist/");
