# MeowScope の Web サイト（meowscope-site）

## 概要

- 本リポジトリは、major182 の事業 MeowScope の公開の Web サイト（https://meowscope.dev）のソース
- 事業の紹介とアプリの一覧、各アプリの説明・プライバシーポリシー・利用規約・アカウントの削除の案内・問い合わせを置く
- 1本目のアプリは、猫の体調管理アプリ MeowScope

## 構成

| URL | 中身 |
|---|---|
| `/` | トップ（事業の紹介とアプリの一覧） |
| `/about/` | 運営者の情報 |
| `/contact/` | 事業の連絡 |
| `/apps/meowscope/` | アプリ MeowScope の説明 |
| `/apps/meowscope/privacy/` | プライバシーポリシー |
| `/apps/meowscope/terms/` | 利用規約 |
| `/apps/meowscope/account-deletion/` | アカウントの削除の案内 |
| `/apps/meowscope/support/` | よくある質問・使い方 |

## 使用技術

- サイトの組み立て：Astro 7.4.13
- 実行環境（組み立てだけ）：Node.js 26.13.1
- 公開：GitHub Pages、独自ドメイン meowscope.dev（Cloudflare）
