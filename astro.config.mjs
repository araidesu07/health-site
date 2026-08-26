// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

/**
 * Markdown が生成した <table> を <div class="table-wrapper"> で自動的に包む。
 *
 * 目的：スマホで比較表を横スクロールさせるため（design-spec.md 5節）。
 * 記事の .md 側では今までどおり Markdown の表を書くだけでよい。
 *
 * 外部パッケージ（unist-util-visit 等）は使わず自前で木をたどる。
 * 依存を増やさないことで、Cloudflare（Linux）側のビルドにも影響しない。
 *
 * @returns {(tree: any) => void}
 */
function rehypeTableWrapper() {
  /** すでに .table-wrapper で包まれているか */
  const isWrapper = (/** @type {any} */ node) =>
    node.type === 'element' &&
    node.tagName === 'div' &&
    [].concat(node.properties?.className ?? []).includes('table-wrapper');

  const walk = (/** @type {any} */ node) => {
    if (!Array.isArray(node.children)) return;

    for (const child of node.children) walk(child);

    // 二重に包まない（記事側で手書きされている場合の保険）
    if (isWrapper(node)) return;

    node.children = node.children.map((/** @type {any} */ child) =>
      child.type === 'element' && child.tagName === 'table'
        ? {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrapper'] },
            children: [child],
          }
        : child
    );
  };

  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  // canonical URL / JSON-LD の絶対URL生成に使用
  site: 'https://health-evidence.jp',

  markdown: {
    // Astro 6 では markdown.rehypePlugins は非推奨。
    // 標準の処理系(unified)にプラグインを足す形で渡す。
    processor: unified({ rehypePlugins: [rehypeTableWrapper] }),
  },
});
