# サイト構築 引き継ぎメモ（Claude Code向け）

## 1. サイト概要

### サイト名

**薬剤師の成分チェック**

### 独自ドメイン

**https://health-evidence.jp**

### サイトの目的

薬剤師が、市販の健康関連商品を**成分・一次情報・根拠ベースで評価する情報サイト**。

主な対象カテゴリは以下。

* サプリメント
* オーラルケア

今後、必要に応じて健康食品・スキンケア等への拡張も想定。

### 収益モデル

* ASPアフィリエイト
* Amazonアソシエイト
* 楽天アフィリエイト等の物販

### 運営

個人1名、ペンネーム運用。

勤務先・企業名はサイト上に一切掲載しない。

---

# 2. 技術構成

以下の構成で既にサイトを立ち上げ済み。

* **Astro 6系**
* Markdown（`.md`）で記事管理
* Git
* GitHub
* Cloudflare Workers
* 独自ドメイン：`health-evidence.jp`

WordPressは使用していない。

記事生成は今後もMarkdownを前提とする。

---

# 3. ローカル環境

Windows環境。

プロジェクトの場所：

```text
C:\Users\araid\health-site
```

開発時はPowerShellで以下を実行。

```powershell
cd C:\Users\araid\health-site
npm.cmd run dev
```

ローカル確認URL：

```text
http://localhost:4321/
```

テスト記事：

```text
http://localhost:4321/supplement/test/
```

---

# 4. Node / Astroについて

当初Astro 7系で構築したが、Windows環境でMarkdown処理時に`Satteri`関連のnative bindingエラーが発生。

そのため、現在は**Astro 6系にダウングレード済み**。

Astro 7へのアップグレードは、明確な必要性が出るまで行わないこと。

以前トラブル対応のため追加したWindows専用依存関係、

```text
@bruits/satteri-win32-x64-msvc
```

は既に削除済み。

CloudflareはLinux環境なので、OS専用依存関係を安易に`dependencies`へ追加しないこと。

---

# 5. GitHub

GitHubリポジトリ：

```text
https://github.com/araidesu07/health-site
```

ブランチ：

```text
main
```

通常の更新フロー：

```powershell
git add .
git commit -m "変更内容"
git push
```

GitHubへpushすると、Cloudflare側で自動ビルド・自動デプロイされる。

---

# 6. Cloudflare

Cloudflare Workersで公開中。

元のWorkers URL：

```text
https://health-site.araidesu07.workers.dev
```

現在は独自ドメイン：

```text
https://health-evidence.jp
```

をProduction環境に接続済み。

Cloudflare上のWorker名：

```text
health-site
```

---

# 7. Cloudflare設定

プロジェクト直下に以下のファイルを配置済み。

```text
wrangler.jsonc
```

内容：

```json
{
  "name": "health-site",
  "compatibility_date": "2026-08-24",
  "assets": {
    "directory": "./dist"
  }
}
```

CloudflareのBuild command：

```text
npm run build
```

Astroの静的出力先：

```text
dist
```

デプロイ時は、

```text
npx wrangler deploy
```

がCloudflare側で実行される。

---

# 8. ドメイン管理

ドメイン取得先：

**XServer Domain**

ドメイン：

```text
health-evidence.jp
```

ネームサーバーはXServerではなくCloudflareに変更済み。

Cloudflare指定ネームサーバー：

```text
millie.ns.cloudflare.com
quincy.ns.cloudflare.com
```

XServer標準の以下ネームサーバーは使用していない。

```text
ns1.xserver.jp
ns2.xserver.jp
ns3.xserver.jp
ns4.xserver.jp
ns5.xserver.jp
```

---

# 9. 現在のディレクトリ構成

主な構成は以下。

```text
health-site/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ layouts/
│  │  ├─ Layout.astro
│  │  └─ ArticleLayout.astro
│  ├─ pages/
│  │  ├─ index.astro
│  │  └─ supplement/
│  │     └─ test.md
│  └─ styles/
│     └─ global.css
├─ astro.config.mjs
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ wrangler.jsonc
├─ CLAUDE.md
└─ AGENTS.md
```

今後、

```text
src/pages/oral-care/
```

等を追加していく想定。

---

# 10. Markdown記事の基本仕様

現在、Markdown記事は以下の形式で表示できる。

例：

```markdown
---
layout: ../../layouts/ArticleLayout.astro
title: "テスト記事"
---

これはMarkdownで作ったテスト記事です。

## サプリメント比較

| 製品 | 内容量 | 価格 |
|---|---:|---:|
| 商品A | 30粒 | 980円 |
| 商品B | 60粒 | 1,500円 |

[参考リンク](https://example.com)
```

URLは、

```text
src/pages/supplement/test.md
```

なら、

```text
/supplement/test/
```

になる。

---

# 11. 今後の記事frontmatter方針

今後の記事は、最低でも以下のfrontmatterを持たせたい。

```markdown
---
layout: ../../layouts/ArticleLayout.astro
title: "記事タイトル"
description: "記事の概要"
datePublished: "2026-08-24"
dateModified: "2026-08-24"
author: "トウノ"
affiliate: true
---
```

今後Claude Code側の記事生成パイプラインも、この形式に合わせること。

---

# 12. 記事レイアウト

現在、

```text
src/layouts/ArticleLayout.astro
```

を共通の記事テンプレートとして使用。

現状は最低限以下を実装済み。

* CSS読み込み
* 記事タイトル表示
* 広告表記
* Markdown本文表示

現在の広告表記：

```text
本記事はプロモーションを含みます。
```

現状は全記事に表示される実装。

今後は、

```yaml
affiliate: true
```

のときだけ表示するように改修したい。

---

# 13. CSS

共通CSS：

```text
src/styles/global.css
```

最低限以下を実装済み。

* コンテンツ最大幅：約760px
* 中央寄せ
* 左右余白
* 見出し
* 本文行間
* リンク色
* Markdown tableの罫線
* table header背景
* スマホ時のテーブル横スクロール

比較表が重要なサイトなので、テーブルの可読性は維持すること。

---

# 14. 現在のトップページ

```text
src/pages/index.astro
```

現在は仮の最低限構成。

表示内容：

```text
薬剤師の成分チェック

薬剤師が、市販の健康関連商品を成分と根拠から評価するサイトです。

カテゴリ
・サプリメント
・オーラルケア
```

まだ本番デザインではない。

---

# 15. サイト構造の予定

最終的に以下を想定。

```text
/
├─ supplement/
├─ oral-care/
├─ about/
├─ editorial-policy/
├─ privacy/
└─ disclaimer/
```

記事URL例：

```text
/supplement/iron-supplement-comparison/
```

---

# 16. 必須固定ページ

今後以下を作成する。

## `/about/`

運営者情報。

記載予定：

* ペンネーム：トウノ
* 資格：薬剤師
* 実務年数：4年
* サイト運営方針
* 編集ポリシーへのリンク

勤務先・企業名は絶対に掲載しない。

---

## `/editorial-policy/`

記載予定：

* 原則として一次情報を優先
* メーカー公式情報
* 行政・公的機関
* 原著論文
* ガイドライン等
* 他サイトのレビューを根拠にしない
* AI・自動化ツールを制作工程で使用
* 公開前に薬剤師である運営者が確認
* 誤り判明時の訂正方針

---

## `/privacy/`

記載予定：

* アクセス解析
* Cookie
* アフィリエイト利用
* Amazonアソシエイト表記
* 個人情報取扱い

Amazonを利用する場合は、

```text
Amazonのアソシエイトとして、トウノは適格販売により収入を得ています。
```

の趣旨の表記を入れる。

---

## `/disclaimer/`

記載予定：

* 一般的な情報提供であること
* 診断・治療・服薬指導の代替ではない
* 必要に応じて医師・薬剤師等へ相談するよう案内
* 商品情報は変更される可能性がある
* 最終的にはメーカー・販売元の最新情報を確認
* アフィリエイトリンク先との取引責任はリンク先事業者にある

---

# 17. 広告表記

アフィリエイトリンクを含む記事には、記事上部に明瞭に、

```text
本記事はプロモーションを含みます。
```

と表示する。

設置位置：

```text
記事タイトル
↓
広告表記
↓
著者・公開日・更新日
↓
本文
```

を基本とする。

CSSで極端に小さくしたり、目立たなくしたりしない。

---

# 18. 記事生成フロー

記事はClaude Codeを使った複数エージェント構成で生成している。

今後の理想フロー：

```text
Claude Code
↓
記事生成
↓
.mdファイル出力
↓
src/pages/supplement/
または
src/pages/oral-care/
へ保存
↓
npm.cmd run dev
↓
ローカル確認
↓
git add .
↓
git commit
↓
git push
↓
Cloudflare自動公開
```

記事作成後にWordPress等へコピペする運用にはしない。

---

# 19. JSON-LD

既存の記事生成フローでは、Markdown末尾に、

```html
<script type="application/ld+json">
...
</script>
```

を含める場合がある。

Astro上でもHTMLとして扱える構成を維持する。

ただし長期的には、

```text
frontmatter
↓
ArticleLayout.astro
↓
JSON-LD自動生成
```

へ変更し、日付・著者・タイトル等の二重管理をなくしたい。

---

# 20. HTMLコメント

記事本文中に、

```html
<!-- 公開確認：... -->
```

のような内部メモが含まれる場合がある。

ブラウザ上で表示されなければ問題ないため、そのままソースに残してよい。

---

# 21. サイト設計上の重要方針

このサイトは記事大量生産型ではない。

想定記事数：

```text
月2〜5本
```

したがって、

* CMS導入
* 複雑な管理画面
* 過剰なプラグイン
* 高度な記事管理システム

は現段階では不要。

優先順位は、

```text
① Markdownの運用の簡単さ
② 表示速度
③ SEO・構造化データ
④ 比較表の読みやすさ
⑤ 更新の簡単さ
```

とする。

---

# 22. 当面実装しないもの

現段階では以下は不要。

* コメント機能
* 会員機能
* ログイン
* 問い合わせフォーム
* 多言語
* CMS
* サイト内検索
* 複雑なタグ機能
* 高度な関連記事ロジック

必要になってから追加する。

---

# 23. 次にやるべきこと

サイトの公開基盤は完成している。

次は以下の順番で進めたい。

### STEP 1

サイト全体の共通レイアウトを整える。

* ヘッダー
* ロゴまたはサイト名
* グローバルナビ
* フッター

### STEP 2

`ArticleLayout.astro`を本番仕様にする。

* title
* description
* datePublished
* dateModified
* author
* affiliate
* 広告表記
* 著者情報
* JSON-LD

をfrontmatterから取得する。

### STEP 3

固定ページ作成。

* about
* editorial-policy
* privacy
* disclaimer

### STEP 4

カテゴリページ。

* `/supplement/`
* `/oral-care/`

### STEP 5

現在手元にある本番記事Markdownを1本投入。

### STEP 6

スマホ表示・表・JSON-LD・内部リンクを確認。

---

# 24. Claude Codeへの依頼方針

以降の実装では、既存構成をむやみに作り直さないこと。

特に、

* Astro 6を勝手に7へ上げない
* Cloudflare構成を変更しない
* 独自ドメイン設定を変更しない
* Markdown中心の運用を崩さない
* WordPress等へ移行しない

こと。

まず現在のファイル構成とコードを確認し、既存実装を活かしながら段階的に改修すること。

また、サイト構築初心者でも確認できるように、変更時には

```text
どのファイルを変更するか
何を変更するか
なぜ変更するか
```

を明示すること。
