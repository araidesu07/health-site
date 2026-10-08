// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { rm } from 'node:fs/promises';
import { isNoindexPath } from './src/consts.ts';

/**
 * 本番用ビルドから /preview/ を外す。
 *
 * src/pages/preview/ は記事制作のプレビュー用（sync-preview・Validator が使う）。
 * `npm run build`（Cloudflare の本番ビルドもこれ）では dist/preview/ を削除し、本番に載せない。
 * Validator は HEALTH_SITE_PREVIEW=1 でビルドし、dist/preview/<slug>/ を残して確認する。
 * `npm run dev` はビルドしないため影響を受けず、ローカルで /preview/<slug>/ を確認できる。
 *
 * @returns {import('astro').AstroIntegration}
 */
function excludePreviewFromBuild() {
  return {
    name: 'exclude-preview-from-build',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (process.env.HEALTH_SITE_PREVIEW === '1') return;
        await rm(new URL('preview/', dir), { recursive: true, force: true });
      },
    },
  };
}

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

  // noindex のページ（試作・プレビュー）は sitemap に載せない
  integrations: [
    sitemap({ filter: (page) => !isNoindexPath(new URL(page).pathname) }),
    excludePreviewFromBuild(),
  ],

  markdown: {
    // Astro 6 では markdown.rehypePlugins は非推奨。
    // 標準の処理系(unified)にプラグインを足す形で渡す。
    processor: unified({ rehypePlugins: [rehypeTableWrapper] }),
  },
});
