#!/usr/bin/env node
/**
 * 記事サムネイル（1200×630 PNG）を生成する。
 *
 * 使い方：
 *   node thumbnails/generate.mjs <slug>
 *   → thumbnails/articles/<slug>.json を読み、public/images/thumbnails/<slug>.png を書き出す
 *     （サイトが配信する画像に直接書くので、コピー忘れが起きない。
 *       使う側は src/consts.ts の ARTICLE_THUMBNAILS に記事パスを登録する）
 *
 * 仕組み：
 *   デザインは下の buildHtml() に HTML/CSS/SVG で固定してある（確定デザイン：
 *   thumbnails/reference/zinc-thumbnail-reference.png）。記事ごとに変えるのは
 *   JSON の title / subtitle / illustration だけ。
 *   描画はローカルの Chrome（ヘッドレス）で行う。AI 画像生成は使わない。
 *   フォント（thumbnails/fonts/）とトウノのアイコン（thumbnails/assets/）は
 *   HTML に埋め込むので、同じ入力・同じ Chrome なら同じ画像になる。
 *
 * 記事 JSON：
 *   title     メインタイトル。"\n" で改行。{ } で囲んだ部分はブランドの緑
 *   subtitle  サブタイトル。{ } で囲んだ部分は緑で少し大きく（数字の強調用）
 *   illustration.type       図解の種類（ILLUSTRATIONS に追加できる）
 *                           "supplement-bottle"：サプリボトル＋カプセル
 *                           "topical-bottle"   ：外用液ボトル＋しずく（OTC の塗り薬など）
 *   illustration.badge      右上の丸バッジの文字（省略可）
 *   illustration.badgeIcon  バッジに文字の代わりに出すアイコン（ICONS のキー。省略可）
 *   illustration.label      ボトルのラベル文字
 *   illustration.labelIcon  ラベルに文字の代わりに出すアイコン（ICONS のキー。省略可）
 *   商品固有のパッケージは描かない。どの記事でも汎用の形だけを使う
 *
 * タイトル・サブタイトルは枠に収まるまで自動で文字を小さくする。
 * 最小サイズでも収まらない場合は画像を書き出さずに終了する。
 *
 * Chrome の場所は自動で探す。見つからない場合は環境変数 CHROME_PATH で指定する。
 * 依存パッケージ：なし（Node 標準のみ）。描画にはローカルの Chrome / Edge が必要
 */

import { readFileSync, existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;

/* --- 固定要素 --- */
const TAGLINE = '薬剤師が成分・表示をチェック';
/** src/consts.ts の SITE_NAME と同じ文言 */
const SITE_NAME = '薬剤師の成分チェック';
const COLORS = {
  // src/styles/global.css のブランドカラー
  primary: '#10605a',
  primaryDark: '#0a3e3a',
  accent: '#157f74',
  text: '#273130',
  mint: '#e4f3ee',
  mintSoft: '#f1f8f5',
  mintLine: '#93cdb9',
};

/* ------------------------------------------------------------------ */

const slug = process.argv[2];
if (!slug) {
  console.error('usage: node thumbnails/generate.mjs <slug>');
  process.exit(2);
}

const configPath = path.join(HERE, 'articles', `${slug}.json`);
if (!existsSync(configPath)) {
  console.error(`記事設定が無い：${path.relative(process.cwd(), configPath)}`);
  process.exit(2);
}
const config = JSON.parse(readFileSync(configPath, 'utf8'));
for (const key of ['title', 'subtitle', 'illustration']) {
  if (!config[key]) {
    console.error(`記事設定に ${key} が無い：${configPath}`);
    process.exit(2);
  }
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** "{強調}" を <span class="em"> に変える（HTML はエスケープ済み） */
const markup = (s) => escapeHtml(s).replace(/\{([^{}]+)\}/g, '<span class="em">$1</span>');

const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(file).toString('base64')}`;

/** 文字数に応じたフォントサイズ（半角1文字≒0.6em として width に収める。上限 max） */
const fitSize = (text, max, width) => Math.min(max, Math.floor(width / (0.6 * Math.max(String(text).length, 1))));

/* --- 記事固有の図解 --- */

/** 図解用のアイコン（viewBox 0 0 100 100）。color で塗る */
const ICONS = {
  /** 三日月と星 */
  moon: (color) => `
    <path d="M58 10 A40 40 0 1 0 90 66 A32 32 0 1 1 58 10Z" fill="${color}"/>
    <path d="M76 14 L79 23 L88 26 L79 29 L76 38 L73 29 L64 26 L73 23Z" fill="${color}"/>
    <path d="M88 42 L90 47 L95 49 L90 51 L88 56 L86 51 L81 49 L86 47Z" fill="${color}"/>`,
};

const iconSvg = (name, color, attrs) => {
  if (!ICONS[name]) throw new Error(`未対応のアイコン：${name}（対応：${Object.keys(ICONS).join(', ')}）`);
  return `<svg ${attrs} viewBox="0 0 100 100" aria-hidden="true">${ICONS[name](color)}</svg>`;
};

/** 右上の丸バッジ（文字かアイコン） */
const badgeHtml = ({ badge, badgeIcon }) => {
  if (badgeIcon) return `<div class="badge">${iconSvg(badgeIcon, '#ffffff', 'class="badge-icon"')}</div>`;
  return badge ? `<div class="badge" style="font-size:${fitSize(badge, 56, 96)}px">${escapeHtml(badge)}</div>` : '';
};

/** ボトルのラベル（文字かアイコン）。y は文字のベースライン位置 */
const bottleLabel = ({ label = '', labelIcon }, y) =>
  labelIcon
    ? iconSvg(labelIcon, COLORS.primary, `x="55" y="${y - 78}" width="90" height="90"`)
    : `<text x="100" y="${y}" text-anchor="middle" class="bottle-label" style="font-size:${fitSize(label, 76, 150)}px">${escapeHtml(label)}</text>`;

const LEAVES = `
    <svg class="leaves" viewBox="0 0 240 260" aria-hidden="true">
      <path d="M120 250 C110 190 95 130 60 70" stroke="#8cc5b0" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M60 70 C30 60 18 30 22 8 C48 16 66 40 60 70Z" fill="#cde8dd"/>
      <path d="M78 120 C40 118 20 92 16 66 C48 70 72 92 78 120Z" fill="#b4dccc"/>
      <path d="M96 170 C60 174 34 154 24 128 C58 128 86 146 96 170Z" fill="#cde8dd"/>
      <path d="M82 110 C96 80 120 66 146 62 C140 92 116 110 82 110Z" fill="#a6d4c2"/>
      <path d="M104 168 C118 140 144 126 172 124 C164 154 138 170 104 168Z" fill="#b4dccc"/>
    </svg>`;

const ILLUSTRATIONS = {
  /** サプリボトル＋カプセル＋葉。label をボトルに、badge を丸バッジに入れる */
  'supplement-bottle': (opts) => `${LEAVES}
    <svg class="bottle" viewBox="0 0 200 290" aria-hidden="true">
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stop-color="#f4f6f6"/><stop offset="0.35" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#dfe5e4"/>
        </linearGradient>
        <linearGradient id="cap" x1="0" x2="1">
          <stop offset="0" stop-color="#e9edec"/><stop offset="0.4" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#d4dbda"/>
        </linearGradient>
      </defs>
      <rect x="38" y="4" width="124" height="50" rx="8" fill="url(#cap)" stroke="#c9d2d0" stroke-width="2"/>
      ${Array.from({ length: 13 }, (_, i) => `<line x1="${48 + i * 8.6}" y1="10" x2="${48 + i * 8.6}" y2="48" stroke="#d3dad9" stroke-width="2"/>`).join('')}
      <rect x="46" y="54" width="108" height="14" fill="#e6ebea" stroke="#c9d2d0" stroke-width="2"/>
      <path d="M30 68 H170 Q190 68 190 92 V262 Q190 286 166 286 H34 Q10 286 10 262 V92 Q10 68 30 68Z"
            fill="url(#body)" stroke="#c9d2d0" stroke-width="2"/>
      ${bottleLabel(opts, 186)}
      <rect x="44" y="210" width="112" height="10" rx="5" fill="${COLORS.mintLine}"/>
      <rect x="58" y="230" width="84" height="8" rx="4" fill="#c4e3d7"/>
    </svg>
    <svg class="capsule capsule-a" viewBox="0 0 120 56" aria-hidden="true">
      <rect x="2" y="2" width="116" height="52" rx="26" fill="#f7f8f8" stroke="#cfd6d5" stroke-width="2"/>
      <path d="M60 2 V54" stroke="#cfd6d5" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="8" rx="4" fill="#ffffff"/>
    </svg>
    <svg class="capsule capsule-b" viewBox="0 0 120 56" aria-hidden="true">
      <rect x="2" y="2" width="116" height="52" rx="26" fill="#efe6d4" stroke="#d6cbb4" stroke-width="2"/>
      <path d="M60 2 V54" stroke="#d6cbb4" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="8" rx="4" fill="#f9f4ea"/>
    </svg>
    ${badgeHtml(opts)}
  `,

  /** 外用液ボトル（ノズル付きの汎用形）＋しずく＋葉。サプリボトルと同じ位置・大きさに置く */
  'topical-bottle': (opts) => `${LEAVES}
    <svg class="bottle" viewBox="0 0 200 290" aria-hidden="true">
      <defs>
        <linearGradient id="tbody" x1="0" x2="1">
          <stop offset="0" stop-color="#f4f6f6"/><stop offset="0.35" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#dfe5e4"/>
        </linearGradient>
        <linearGradient id="tcap" x1="0" x2="1">
          <stop offset="0" stop-color="#e9edec"/><stop offset="0.4" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#d4dbda"/>
        </linearGradient>
      </defs>
      <path d="M90 34 V12 Q90 4 100 4 Q110 4 110 12 V34Z" fill="url(#tcap)" stroke="#c9d2d0" stroke-width="2"/>
      <path d="M64 34 H136 Q144 34 144 42 V80 H56 V42 Q56 34 64 34Z" fill="url(#tcap)" stroke="#c9d2d0" stroke-width="2"/>
      <rect x="66" y="80" width="68" height="14" fill="#e6ebea" stroke="#c9d2d0" stroke-width="2"/>
      <path d="M58 94 H142 Q166 94 166 120 V264 Q166 286 144 286 H56 Q34 286 34 264 V120 Q34 94 58 94Z"
            fill="url(#tbody)" stroke="#c9d2d0" stroke-width="2"/>
      ${bottleLabel(opts, 200)}
      <rect x="56" y="222" width="88" height="10" rx="5" fill="${COLORS.mintLine}"/>
      <rect x="68" y="242" width="64" height="8" rx="4" fill="#c4e3d7"/>
    </svg>
    <svg class="drop drop-a" viewBox="0 0 40 56" aria-hidden="true">
      <path d="M20 2 C28 16 38 28 38 38 A18 18 0 0 1 2 38 C2 28 12 16 20 2Z" fill="#d7eee6" stroke="#a9d3c4" stroke-width="2"/>
      <ellipse cx="13" cy="38" rx="4" ry="7" fill="#ffffff" opacity="0.8"/>
    </svg>
    <svg class="drop drop-b" viewBox="0 0 40 56" aria-hidden="true">
      <path d="M20 2 C28 16 38 28 38 38 A18 18 0 0 1 2 38 C2 28 12 16 20 2Z" fill="#e6f4ef" stroke="#a9d3c4" stroke-width="2"/>
      <ellipse cx="13" cy="38" rx="4" ry="7" fill="#ffffff" opacity="0.8"/>
    </svg>
    ${badgeHtml(opts)}
  `,
};

const illustration = ILLUSTRATIONS[config.illustration.type];
if (!illustration) {
  console.error(`未対応の illustration.type：${config.illustration.type}（対応：${Object.keys(ILLUSTRATIONS).join(', ')}）`);
  process.exit(2);
}

/* ------------------------------------------------------------------ */

function buildHtml() {
  const font = dataUri(path.join(HERE, 'fonts', 'NotoSansJP-VF.ttf'), 'font/ttf');
  const avatar = dataUri(path.join(HERE, 'assets', 'touno-avatar-master.png'), 'image/png');

  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'ThumbJP'; src: url(${font}) format('truetype'); font-weight: 100 900; }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; position: relative;
    background: #ffffff; font-family: 'ThumbJP', sans-serif; color: ${COLORS.text};
    -webkit-font-smoothing: antialiased;
  }
  .abs { position: absolute; }

  /* 背景の装飾 */
  .blob { position: absolute; border-radius: 50%; }
  .blob-tl { left: -150px; top: -190px; width: 360px; height: 360px; background: ${COLORS.mint}; }
  .blob-tr { right: -140px; top: -200px; width: 380px; height: 380px; background: ${COLORS.mintSoft}; }
  .halo { left: 676px; top: -2px; width: 600px; height: 600px; background: ${COLORS.mintSoft}; }

  /* 上部ラベル */
  .tag {
    left: 32px; top: 58px; height: 64px; padding: 0 30px 0 22px; border-radius: 32px;
    display: flex; align-items: center; gap: 14px;
    background: ${COLORS.primary}; color: #ffffff;
    font-size: 30px; font-weight: 700; letter-spacing: 0.02em; white-space: nowrap;
  }
  .tag svg { width: 40px; height: 40px; flex: none; }

  /* タイトル（枠に収まるまで自動縮小） */
  .title {
    left: 32px; top: 146px; width: 584px; height: 262px;
    font-size: 100px; line-height: 1.25; font-weight: 900; letter-spacing: -0.02em;
    overflow: hidden; display: flex; align-items: center;
  }
  .title-inner { width: 100%; white-space: pre-line; overflow-wrap: anywhere; }
  .title .em { color: ${COLORS.primary}; }

  .rule { left: 36px; top: 424px; width: 270px; height: 5px; border-radius: 3px; background: ${COLORS.mintLine}; }

  .subtitle {
    left: 32px; top: 436px; width: 560px; height: 84px;
    font-size: 50px; line-height: 84px; font-weight: 800; letter-spacing: 0.01em;
    white-space: nowrap; overflow: hidden;
  }
  .subtitle .em { color: ${COLORS.accent}; font-size: 1.32em; font-weight: 900; margin: 0 0.06em; line-height: 1; }

  /* トウノ（正式アイコンをそのまま使う） */
  .avatar { left: 712px; top: 84px; width: 490px; height: 490px; }

  /* 図解 */
  .leaves { position: absolute; left: 586px; top: 296px; width: 200px; height: 220px; }
  .bottle { position: absolute; left: 628px; top: 266px; width: 190px; height: 276px;
            filter: drop-shadow(0 8px 10px rgba(16, 96, 90, 0.12)); }
  .bottle-label { font-family: 'ThumbJP'; font-weight: 800; font-size: 76px; fill: ${COLORS.primary}; letter-spacing: -1px; }
  .capsule { position: absolute; filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.10)); }
  .capsule-a { left: 604px; top: 484px; width: 104px; height: 48px; transform: rotate(24deg); }
  .capsule-b { left: 756px; top: 504px; width: 78px; height: 36px; transform: rotate(-18deg); }
  .badge {
    position: absolute; left: 636px; top: 146px; width: 124px; height: 124px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #4f9e86; color: #ffffff; font-size: 56px; font-weight: 800; letter-spacing: -1px;
    box-shadow: 0 0 0 6px #ffffff;
  }
  .badge-icon { width: 70px; height: 70px; }
  .drop { position: absolute; }
  .drop-a { left: 612px; top: 470px; width: 40px; height: 56px; }
  .drop-b { left: 790px; top: 496px; width: 28px; height: 40px; }

  /* フッター */
  .footer {
    left: 0; top: 548px; width: ${WIDTH}px; height: ${HEIGHT - 548}px;
    background: linear-gradient(90deg, ${COLORS.primaryDark}, ${COLORS.primary});
    /* 文字の左端はタイトル・区切り線（left: 36px）にそろえる */
    display: flex; align-items: center; padding-left: 36px;
    color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 0.03em;
  }
</style></head>
<body>
  <div class="blob blob-tl"></div>
  <div class="blob blob-tr"></div>
  <div class="blob halo"></div>

  <div class="abs tag">
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g transform="rotate(-45 20 20)">
        <rect x="4" y="12" width="32" height="16" rx="8" fill="#ffffff"/>
        <path d="M20 12 H28 A8 8 0 0 1 28 28 H20Z" fill="#bfe6d8"/>
      </g>
    </svg>
    <span>${escapeHtml(TAGLINE)}</span>
  </div>

  <div class="abs title" id="title"><div class="title-inner">${markup(config.title)}</div></div>
  <div class="abs rule"></div>
  <div class="abs subtitle" id="subtitle">${markup(config.subtitle)}</div>

  <img class="abs avatar" src="${avatar}" alt="">
  ${illustration(config.illustration)}

  <div class="abs footer">
    <span>${escapeHtml(SITE_NAME)}</span>
  </div>

  <script>
    /* 文字が枠からはみ出す間、フォントサイズを下げる。結果は body の data 属性に残す */
    document.fonts.ready.then(() => {
      /* 図解の葉（.leaves）の高さにかかる行は、葉の手前で止める（top 以下の行の右端 ≤ right） */
      const LEAVES_SAFE = { top: 300, right: 590 };
      const hitsLeaves = (el) => {
        // 文字そのものの行ボックスだけを見る（要素の箱は幅いっぱいなので含めない）
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          range.selectNodeContents(node);
          for (const r of range.getClientRects()) {
            if (r.width > 0 && r.bottom > LEAVES_SAFE.top && r.right > LEAVES_SAFE.right) return true;
          }
        }
        return false;
      };
      const fit = (el, min, extra = () => false) => {
        let size = parseFloat(getComputedStyle(el).fontSize);
        const over = () => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1 || extra(el);
        while (over() && size > min) { size -= 2; el.style.fontSize = size + 'px'; }
        return { size, ok: !over() };
      };
      const t = fit(document.getElementById('title'), 56, hitsLeaves);
      const s = fit(document.getElementById('subtitle'), 30);
      document.body.dataset.fit = JSON.stringify({ title: t, subtitle: s, font: document.fonts.check('900 40px ThumbJP') });
    });
  </script>
</body></html>`;
}

/** PNG の幅・高さを IHDR チャンクから読む */
function pngSize(file) {
  const buf = readFileSync(file);
  if (buf.toString('ascii', 12, 16) !== 'IHDR') throw new Error('PNG として読めない');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    console.error('Chrome が見つからない。CHROME_PATH で実行ファイルを指定してください');
    process.exit(2);
  }
  return found;
}

/* ------------------------------------------------------------------ */

const chrome = findChrome();
const work = mkdtempSync(path.join(tmpdir(), 'thumb-'));
const htmlPath = path.join(work, 'thumbnail.html');
const outDir = path.join(HERE, '..', 'public', 'images', 'thumbnails');
const outPath = path.join(outDir, `${slug}.png`);

try {
  writeFileSync(htmlPath, buildHtml());
  const url = pathToFileURL(htmlPath).href;
  const base = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--force-device-scale-factor=1',
    `--user-data-dir=${path.join(work, 'profile')}`,
    `--window-size=${WIDTH},${HEIGHT}`, '--virtual-time-budget=10000',
  ];

  // 1回目：文字の自動縮小の結果を確認する
  const dom = execFileSync(chrome, [...base, '--dump-dom', url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  const match = dom.match(/data-fit="([^"]*)"/);
  if (!match) throw new Error('文字サイズの調整結果を取得できなかった（フォント読み込みの失敗など）');
  const fit = JSON.parse(match[1].replace(/&quot;/g, '"'));
  if (!fit.font) throw new Error('埋め込みフォントが使われていない');
  if (!fit.title.ok || !fit.subtitle.ok) {
    throw new Error(`文字が枠に収まらない（最小サイズでも超過）：${JSON.stringify(fit)}。文言を短くしてください`);
  }

  // 2回目：PNG を書き出す
  // 一時フォルダに書き、サイズを確かめてから公開用の場所へ置く（失敗時に壊れた画像を残さない）
  const shotPath = path.join(work, 'thumbnail.png');
  execFileSync(chrome, [...base, `--screenshot=${shotPath}`, url], { stdio: 'ignore' });

  const meta = pngSize(shotPath);
  if (meta.width !== WIDTH || meta.height !== HEIGHT) {
    throw new Error(`画像サイズが ${meta.width}×${meta.height}（期待値 ${WIDTH}×${HEIGHT}）`);
  }
  mkdirSync(outDir, { recursive: true });
  copyFileSync(shotPath, outPath);

  console.log(`OK  ${path.relative(process.cwd(), outPath)}  ${meta.width}×${meta.height}`);
  console.log(`    title ${fit.title.size}px / subtitle ${fit.subtitle.size}px`);
} catch (err) {
  console.error(`FAIL  ${err.message}`);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
