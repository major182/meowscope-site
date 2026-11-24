// 出来上がりの HTML（dist）の確かめ（テスト仕様書 4章）。npm run build の後に動かす
// Node.js の標準のテストの仕組み（node:test）を使い、追加の道具を入れない
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";

/** dist の中の HTML のファイルをすべて集める */
function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith(".html") ? [path] : [];
  });
}

const pages = htmlFiles(dist).map((path) => ({
  path,
  html: readFileSync(path, "utf8"),
}));

test("UT-01 HTML のページが1つ以上ある", () => {
  assert.ok(
    pages.length > 0,
    "dist に HTML がない。先に npm run build を動かす",
  );
});

for (const { path, html } of pages) {
  test(`UT-02 ${path}：日本語のページとして書かれている（NF-UX-02）`, () => {
    assert.match(html, /<html[^>]*\slang="ja"/);
  });

  test(`UT-03 ${path}：スマートフォンの幅に合わせる設定がある（NF-UX-01）`, () => {
    assert.match(html, /<meta[^>]*name="viewport"[^>]*width=device-width/);
  });

  test(`UT-04 ${path}：スクリプトを配らない（NF-SC-02）`, () => {
    assert.doesNotMatch(html, /<script\b/i);
  });
}

/**
 * サイトの中のリンク（/ で始まる href・src）が、dist の中のファイルを指しているか（NF-MT-01）
 * 外のサイトへのリンクとメールのリンクは、相手の都合で変わるので確かめない
 */
function targetExists(url: string): boolean {
  const path = decodeURI(url.split(/[?#]/)[0] ?? "");
  const file = join(dist, path);
  // 最後が / の URL は、そのフォルダーの index.html（BR-06）
  return path.endsWith("/")
    ? existsSync(join(file, "index.html"))
    : existsSync(file);
}

for (const { path, html } of pages) {
  test(`UT-05 ${path}：サイトの中のリンクが切れていない（NF-MT-01）`, () => {
    const links = [...html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)].map(
      (m) => m[1] ?? "",
    );
    const broken = links.filter((url) => !targetExists(url));
    assert.deepEqual(broken, [], "切れているリンク");
  });
}

/** 要件定義書 2章のページ（F-PG-01〜09）。出来上がりのファイルの場所 */
const requiredPages = [
  "index.html",
  "about/index.html",
  "contact/index.html",
  "404.html",
  "apps/meowscope/index.html",
  "apps/meowscope/privacy/index.html",
  "apps/meowscope/terms/index.html",
  "apps/meowscope/account-deletion/index.html",
  "apps/meowscope/support/index.html",
];

test("UT-06 要件定義書 2章のページがすべてある（F-PG-01〜09）", () => {
  const missing = requiredPages.filter((p) => !existsSync(join(dist, p)));
  assert.deepEqual(missing, [], "ないページ");
});

for (const { path, html } of pages) {
  test(`UT-07 ${path}：共通の上部と下部のリンクがある（F-NV-01）`, () => {
    for (const href of ["/", "/about/", "/contact/"]) {
      assert.ok(html.includes(`href="${href}"`), `${href} へのリンクがない`);
    }
  });
}

/** アプリのページどうしのリンク（apps.ts の appPages と同じ並び） */
const meowscopeLinks = [
  "/apps/meowscope/",
  "/apps/meowscope/support/",
  "/apps/meowscope/privacy/",
  "/apps/meowscope/terms/",
  "/apps/meowscope/account-deletion/",
];

for (const { path, html } of pages.filter((p) =>
  p.path.replaceAll("\\", "/").startsWith(`${dist}/apps/meowscope/`),
)) {
  test(`UT-08 ${path}：アプリのページどうしのリンクがある（F-NV-01）`, () => {
    for (const href of meowscopeLinks) {
      assert.ok(html.includes(`href="${href}"`), `${href} へのリンクがない`);
    }
  });
}

/** dist の中のファイルの場所から、そのページの URL を作る（例：dist/about/index.html → /about/） */
function urlOf(file: string): string {
  const rel = file.replaceAll("\\", "/").slice(dist.length);
  return rel.replace(/index\.html$/, "");
}

for (const { path, html } of pages) {
  const isNotFound = path.replaceAll("\\", "/") === `${dist}/404.html`;
  test(`UT-09 ${path}：正規の URL が正しい（404 は出さずに noindex）`, () => {
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (isNotFound) {
      // 404 のページはどの URL でも返るので、正規の URL を出さず、検索に載せない
      assert.equal(canonical, undefined);
      assert.match(html, /<meta name="robots" content="noindex"/);
    } else {
      assert.equal(canonical, `https://meowscope.dev${urlOf(path)}`);
      assert.doesNotMatch(html, /noindex/);
    }
  });
}
