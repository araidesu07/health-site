/**
 * frontmatter の文章に書かれた、ごく限られたインライン記法を解釈する。
 *
 * 対応するのは **太字** だけ。Markdown 全体は解釈しない。
 * HTML 文字列は作らず「テキスト片の配列」を返す。描画側（InlineText.astro）が
 * 通常のテキストとして出力するため、記事側に書かれた < > & などは常にエスケープされる。
 *
 * 規則：
 *   - `**` と `**` で囲まれた、空でない範囲を太字にする
 *   - 囲みの内側の先頭・末尾が空白の場合は太字にしない（`** a **` はそのまま）
 *   - 対にならない `**` や単独の `*` は、文字としてそのまま残す
 *   - 入れ子・複数行・他の記法（斜体・リンク等）は扱わない
 */

export interface InlineSegment {
  text: string;
  bold: boolean;
}

const BOLD_PATTERN = /\*\*(?=\S)([^\n]*?\S)\*\*/g;

export function parseInlineText(input: unknown): InlineSegment[] {
  if (typeof input !== 'string' || input === '') return [];

  const segments: InlineSegment[] = [];
  let last = 0;

  for (const match of input.matchAll(BOLD_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ text: input.slice(last, start), bold: false });
    segments.push({ text: match[1], bold: true });
    last = start + match[0].length;
  }
  if (last < input.length) segments.push({ text: input.slice(last), bold: false });

  return segments;
}
