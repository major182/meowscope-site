// アプリの一覧（要件 F-PG-01・NF-MT-02）
// アプリを足すときは、ここに1つ足し、src/pages/apps/<slug>/ にページを置く

export interface AppInfo {
  /** URL に使う名前（英小文字とハイフン。要件 BR-01） */
  slug: string;
  /** アプリの名前 */
  name: string;
  /** 一覧に出す一言の説明 */
  summary: string;
  /** アイコンの画像（public の下の場所） */
  icon: string;
}

export const apps: AppInfo[] = [
  {
    slug: "meowscope",
    name: "MeowScope",
    summary:
      "猫のご飯・水・トイレ・体重などを記録し、いっしょに暮らす人と共有して、体調の変化に気づくためのアプリ",
    icon: "/apps/meowscope/icon.png",
  },
];

/** アプリのページの中の、ページどうしのリンク（要件 F-NV-01） */
export const appPages = [
  { path: "", label: "アプリの説明" },
  { path: "support/", label: "サポート" },
  { path: "privacy/", label: "プライバシーポリシー" },
  { path: "terms/", label: "利用規約" },
  { path: "account-deletion/", label: "アカウントの削除" },
] as const;

/** 事業の連絡先（要件 BR-02） */
export const contactEmail = "contact@meowscope.dev";
/** アプリの問い合わせ先（要件 BR-02） */
export const supportEmail = "support@meowscope.dev";
