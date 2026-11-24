// @ts-check
// Astro の設定（技術選定書 4章）
import { defineConfig } from "astro/config";

export default defineConfig({
  // 公開の URL。サイトの中の絶対の URL（正規の URL など）を作るのに使う
  site: "https://meowscope.dev",
  // URL の最後を必ず「/」にする（要件 BR-06）。ページごとのフォルダーに index.html を書き出す
  trailingSlash: "always",
  build: { format: "directory" },
});
