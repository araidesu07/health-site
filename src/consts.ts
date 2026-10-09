/**
 * サイト全体で使う定数。
 * サイト名を変えるときは、ここだけを直せば全ページに反映される。
 */

export const SITE_NAME = '薬剤師の成分チェック';

export const SITE_DESCRIPTION =
  '薬剤師が、市販の健康関連商品を成分と根拠から評価するサイトです。';

/**
 * 著者トウノの正式アイコン（表示用）。
 * マスター thumbnails/assets/touno-avatar-master.png（1024px）を 256px に縮小した可逆 WebP。
 * デザインは変えない。マスターを差し替えたら作り直す
 */
export const AUTHOR_AVATAR = '/images/touno-avatar.webp';

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

/** pathname を末尾スラッシュ付きにそろえる */
const withSlash = (pathname: string) => (pathname.endsWith('/') ? pathname : `${pathname}/`);

/** pathname が noindex 対象か（末尾スラッシュの有無は問わない） */
export function isNoindexPath(pathname: string): boolean {
  const path = withSlash(pathname);
  return NOINDEX_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/** 記事サムネイルの大きさ（thumbnails/generate.mjs の出力と同じ） */
export const THUMBNAIL_SIZE = { width: 1200, height: 630 };

/**
 * 記事サムネイル。OGP 画像とカテゴリ一覧で使う。キーは記事のパス。
 * 画像は thumbnails/generate.mjs が public/images/thumbnails/ に直接書き出す。
 * ここに無いページには OGP 画像を出さない。
 */
const ARTICLE_THUMBNAILS: Record<string, string> = {
  '/supplement/iron-supplement-comparison/': '/images/thumbnails/iron-supplement-comparison.png',
  '/supplement/sleep-support-supplement/': '/images/thumbnails/sleep-support-supplement.png',
  '/supplement/zinc-supplement/': '/images/thumbnails/zinc-supplement.png',
  '/otc/minoxidil-5-otc/': '/images/thumbnails/minoxidil-5-otc.png',
};

/** 記事パスに対応するサムネイル（サイト内パス）。無ければ undefined */
export function thumbnailFor(pathname: string): string | undefined {
  return ARTICLE_THUMBNAILS[withSlash(pathname)];
}
