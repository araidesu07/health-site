/**
 * サイト全体で使う定数。
 * サイト名を変えるときは、ここだけを直せば全ページに反映される。
 */

export const SITE_NAME = '薬剤師の成分チェック';

export const SITE_DESCRIPTION =
  '薬剤師が、市販の健康関連商品を成分と根拠から評価するサイトです。';

/** フッターに並べる固定ページへのリンク */
export const FOOTER_LINKS = [
  { href: '/about/', label: '運営者情報' },
  { href: '/editorial-policy/', label: '編集ポリシー' },
  { href: '/privacy/', label: 'プライバシーポリシー' },
  { href: '/disclaimer/', label: '免責事項' },
];

/**
 * 検索エンジンに載せないページ（プレビュー）。
 * 本番用ビルドでは astro.config.mjs が dist から削除するため、本番には存在しない。
 * Validator 用ビルド・ローカル開発では残るので、念のため noindex を出し sitemap から除外する。
 */
const NOINDEX_PATH_PREFIXES = ['/preview/'];

/** pathname が noindex 対象か（末尾スラッシュの有無は問わない） */
export function isNoindexPath(pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return NOINDEX_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}
