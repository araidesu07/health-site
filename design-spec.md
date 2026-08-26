# デザイン仕様書（health-evidence.jp）

Claude Code に渡してCSSを実装するための仕様。
`src/styles/global.css` に反映する。

---

## 0. 設計方針

**配色と余白はポップに、文字と情報設計は硬く。**

- 目指すのは「明るいけれど信頼できる比較サイト」
- 避けるのは「サプリ広告サイト」「カジュアルな健康メディア」
- 色は**読みやすくするため**に使う。楽しくするためではない
- **同時に画面に出るアクセント色は2色まで**

このサイトの主役は**比較表と数値**。装飾は情報の構造を助けるものに限る。

---

## 1. カラーパレット

CSS変数として `:root` に定義する。

```css
:root {
  /* ベース */
  --color-bg:           #ffffff;
  --color-bg-subtle:    #f7fafc;  /* 表の交互行、囲みの背景 */
  --color-text:         #1a2b3c;  /* 本文。黒ではなく濃紺寄り */
  --color-text-muted:   #5a6b7c;  /* 注記、日付、出典 */
  --color-border:       #d8e2ea;

  /* メイン：青（信頼・中立） */
  --color-primary:      #1668c1;
  --color-primary-dark: #0f4c8f;
  --color-primary-light:#e8f2fc;  /* 見出し背景、表ヘッダー */

  /* アクセント：緑（明るさ） */
  --color-accent:       #0f9b73;
  --color-accent-light: #e6f6f1;

  /* 注意喚起 */
  --color-warn:         #c9761a;
  --color-warn-light:   #fdf3e7;
}
```

**使用ルール**
- 本文の文字は必ず `--color-text`。色文字は使わない
- 青は「構造」（見出し・表ヘッダー・リンク）
- 緑は「補足・ポイント」（囲みボックス、強調）
- オレンジは「注意」のみ。多用しない

---

## 2. タイポグラフィ

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
               "Noto Sans JP", "Yu Gothic", sans-serif;
  font-size: 16px;
  line-height: 1.9;        /* 日本語は広めに */
  color: var(--color-text);
  letter-spacing: 0.02em;
}
```

- 本文 16px、行間 1.9（現状より広く）
- **コンテンツ最大幅は 720px**（760pxから縮小。日本語は1行が長いと読みにくい）
- スマホでは左右 20px の余白

---

## 3. 見出し

階層が一目で分かることを最優先する。

```css
h1 {
  font-size: 1.75rem;
  line-height: 1.5;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--color-primary);
}

h2 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  padding: 0.6rem 0.9rem;
  background: var(--color-primary-light);
  border-left: 5px solid var(--color-primary);
  border-radius: 4px;
}

h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  padding-left: 0.7rem;
  border-left: 4px solid var(--color-accent);
}
```

**h2 の背景色ブロックが、このサイトの視認性の要。**
スクロール時に構造が掴めるようにする。

---

## 4. 段落・余白

```css
p {
  margin-bottom: 1.5rem;
}

/* セクション間はゆったり取る */
hr {
  margin: 3rem 0;
  border: none;
  border-top: 1px solid var(--color-border);
}
```

**文字が詰まって見えるのが最大の離脱要因。余白を惜しまない。**

---

## 5. 比較表（最重要）

このサイトの主役。可読性を最優先する。

```css
/* 横スクロールの器。
   ここは必ず通常のブロック要素にすること。
   display:flex にすると表がフレックスアイテムになり、幅が親幅に
   固定されて内容より狭く潰れる（列が1文字ずつ折り返す）。 */
.table-wrapper {
  overflow-x: auto;
  margin: 2rem 0;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.925rem;
  line-height: 1.7;
  min-width: 720px;    /* これ以下では横スクロール */
  table-layout: auto;  /* 列幅は内容に合わせる。fixed にしない */
}

/* 製品名など、行の識別に使う1列目は潰さない */
th:first-child,
td:first-child {
  min-width: 14em;
}

th {
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 700;
  padding: 0.75rem 0.9rem;
  text-align: left;
  white-space: nowrap;
}

td {
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
  word-break: normal;    /* break-all にしない。1文字ずつ折り返させない */
  overflow-wrap: normal;
  line-break: strict;    /* 行頭に 、。 ） などが来ないようにする */
}

/* 日本語を文節単位で折り返す（対応ブラウザのみ） */
@supports (word-break: auto-phrase) {
  td { word-break: auto-phrase; }
}

/* 交互行 */
tbody tr:nth-child(even) {
  background: var(--color-bg-subtle);
}

/* 数値列は右寄せ（Markdownの |---:| で指定した列） */
td[align="right"], th[align="right"] {
  text-align: right;
  font-variant-numeric: tabular-nums;  /* 桁を揃える */
}

/* 表内の強調（単価など） */
td strong {
  color: var(--color-primary-dark);
  font-size: 1.05em;
}
```

**スマホ対応**：`min-width: 720px` により狭い画面では横スクロールになる。

**列幅について**：`table-layout` は `auto`（初期値）のまま使う。
列幅を内容から決めさせることが、比較表の可読性の前提になる。
表を包む要素・表自身に、幅を外から固定する指定（`display:flex` の
アイテム化、`table-layout: fixed`、`width` の固定値）を入れないこと。
1文字ずつの折り返しは、ほぼこの種の「幅の固定」が原因。

スクロール可能であることが分かるよう、表の右端にグラデーションの
フェードを付ける。実装は `mask-image` をスクロール量に連動させる
（`animation-timeline: scroll()`）方式とし、**レイアウトに影響する
方法（ラッパーのflex化など）では実装しない**。未対応ブラウザでは
フェードなしとする。

---

## 6. 囲みボックス（3種）

Markdown の引用記法 `>` と、クラス付き div の両方で使えるようにする。

### 6-1. ポイント（緑）

結論、判断基準、覚えておくべきこと。

```css
.box-point {
  background: var(--color-accent-light);
  border-left: 5px solid var(--color-accent);
  border-radius: 4px;
  padding: 1.25rem 1.4rem;
  margin: 2rem 0;
}
.box-point > *:last-child { margin-bottom: 0; }
```

### 6-2. 注意（オレンジ）

読者が誤解しやすい点、注意喚起。

```css
.box-warn {
  background: var(--color-warn-light);
  border-left: 5px solid var(--color-warn);
  border-radius: 4px;
  padding: 1.25rem 1.4rem;
  margin: 2rem 0;
}
```

### 6-3. 補足（グレー）

出典の注記、確認範囲の開示、細かい前提。

```css
.box-note,
blockquote {
  background: var(--color-bg-subtle);
  border-left: 4px solid var(--color-border);
  border-radius: 4px;
  padding: 1.1rem 1.3rem;
  margin: 2rem 0;
  font-size: 0.925rem;
  color: var(--color-text-muted);
}
```

---

## 7. 数値の強調

比較記事なので、キーとなる数値が目に入る必要がある。

```css
.figure {
  display: inline-block;
  font-size: 1.15em;
  font-weight: 700;
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  padding: 0.1em 0.45em;
  border-radius: 4px;
}
```

本文中の `**13.2円／m**` のような強調は、通常の太字で足りる。
特に目立たせたい1〜2箇所でのみ `.figure` を使う。

---

## 8. リンク

```css
a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-thickness: 1px;
}
a:hover {
  color: var(--color-primary-dark);
}

/* 外部リンク（出典）は控えめに */
.source-link {
  font-size: 0.9em;
  color: var(--color-text-muted);
}
```

本文中の出典インラインリンクは数が多いため、
**本文の可読性を壊さない程度の主張**にとどめる。

---

## 9. 広告表記

法的に必須のため、**確実に目立つこと**。ただし煽らない。

```css
.affiliate-notice {
  display: block;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.7rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.925rem;   /* 本文より小さくしない */
  color: var(--color-text);
}
```

**禁止**：グレーアウト、極小フォント、折りたたみ、
`display:none`、本文より小さい文字サイズ。

---

## 10. 著者・日付表示

```css
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 2.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.article-meta .author {
  font-weight: 700;
  color: var(--color-text);
}
```

著者名（薬剤師）は信頼性のシグナルなので、日付より強く見せる。

---

## 11. ヘッダー・フッター

```css
.site-header {
  background: #ffffff;
  border-bottom: 3px solid var(--color-primary);
  padding: 1rem 0;
  margin-bottom: 2.5rem;
}

.site-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  text-decoration: none;
}

.site-footer {
  margin-top: 5rem;
  padding: 2.5rem 0;
  background: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.site-footer a {
  color: var(--color-text-muted);
  margin-right: 1.25rem;
  display: inline-block;  /* スマホで折り返しても行間が詰まらないように */
}

/* フッターのリンク行と著作権表記 */
.footer-nav   { margin-bottom: 1rem; }
.copyright    { margin: 0; }
```

**上下の余白の担当**：ヘッダーの `margin-bottom: 2.5rem` と
フッターの `margin-top: 5rem` が、本文との間隔を受け持つ。
`main` 側に上下パディングを足すと余白が二重にかかるので入れない。

---

## 12. スマホ対応

```css
@media (max-width: 640px) {
  body { font-size: 15.5px; }
  .container { padding: 0 20px; }
  h1 { font-size: 1.45rem; }
  h2 { font-size: 1.2rem; margin-top: 2.5rem; }
  h3 { font-size: 1.05rem; }
  table { font-size: 0.875rem; }
  th, td { padding: 0.6rem 0.7rem; }
}
```

**スマホでの表の可読性が、このサイトの生命線。**
必ず実機で確認すること。

---

## 13. 実装時の注意

- Markdown で生成された `<table>` を自動で `.table-wrapper` で
  囲む必要がある（Astro の rehype プラグイン、または CSS のみで対応）
- 囲みボックスは、Markdown 内で
  `<div class="box-point">...</div>` と書けるようにする
- 既存の構成（Astro 6、Cloudflare、ディレクトリ構造）は変更しない
- 変更するのは原則 `src/styles/global.css` と、
  必要に応じて `ArticleLayout.astro` / `Layout.astro` のクラス付与のみ

---

## 14. 確認項目

実装後、以下を確認する。

- [ ] スマホで比較表が横スクロールできる
- [ ] h2 の背景ブロックでスクロール時に構造が掴める
- [ ] 広告表記が本文と同等以上のサイズで表示される
- [ ] 本文の文字色が黒ではなく濃紺寄りになっている
- [ ] 1行の文字数が長すぎない（720px以内）
- [ ] 同時に画面に出るアクセント色が2色を超えていない
- [ ] 出典リンクが多くても本文が読みにくくなっていない
