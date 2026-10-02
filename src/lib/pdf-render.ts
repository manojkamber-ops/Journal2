// Shared full-paper PDF renderer.
// Used by:
//   - /api/articles/[id]/pdf  (serves the PDF)
//   - scripts/seed.ts         (counts exact pages for issue pagination)
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { PaperBlock } from '@/lib/journal-types';

export interface PdfAuthor {
  givenName: string;
  familyName: string;
  isCorresponding: boolean;
  department: string;
  affiliation: string;
}

export interface PaperRenderInput {
  title: string;
  abstractText: string;
  keywords: string[];
  doi: string;
  volume: number;
  issue: number;
  year: number;
  month: string;
  pages: string; // may be '' — the band shows "Article in press"
  type: string;
  section: string;
  receivedDate: string;
  acceptedDate: string;
  publishedDate: string;
  references: string[];
  fullText: PaperBlock[];
  correspondingEmail: string;
  authors: PdfAuthor[];
}

// CP1252-safe sanitizer (WinAnsi). Turkish / typographic chars are mapped.
const REPL: [RegExp, string][] = [
  [/ı/g, 'i'], [/İ/g, 'I'], [/ğ/g, 'g'], [/Ğ/g, 'G'], [/ş/g, 's'], [/Ş/g, 'S'],
  [/[‒–—]/g, '-'], [/[‘’‚]/g, "'"], [/[“”„]/g, '"'], [/…/g, '...'], [/[‐‑]/g, '-'], [/−/g, '-'],
];
function sanitize(t: string): string {
  let s = t;
  for (const [re, to] of REPL) s = s.replace(re, to);
  let out = '';
  for (const c of s) {
    const code = c.codePointAt(0) ?? 63;
    if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255)) out += c;
    else if (c === '\n' || c === '\t') out += ' ';
  }
  return out;
}

const PAGE_W = 595.28, PAGE_H = 841.89;
const M = 56;
const TEXT_W = PAGE_W - 2 * M;
const CRIMSON = rgb(0.75, 0.05, 0.12);
const INK = rgb(0.13, 0.13, 0.15);
const GREY = rgb(0.42, 0.42, 0.47);
const LIGHT = rgb(0.85, 0.85, 0.87);

type PDFFont = import('pdf-lib').PDFFont;

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (font.widthOfTextAtSize(test, size) > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

// Build the PDF and return both bytes and the exact page count.
export async function buildPaperPdf(a: PaperRenderInput): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const pdf = await PDFDocument.create();
  const timesB = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const timesR = await pdf.embedFont(StandardFonts.TimesRoman);
  const timesI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvR = await pdf.embedFont(StandardFonts.Helvetica);
  const helvI = await pdf.embedFont(StandardFonts.HelveticaOblique);

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H;

  // ── Header band (first page) ──
  const bandH = 74;
  page.drawRectangle({ x: 0, y: PAGE_H - bandH, width: PAGE_W, height: bandH, color: CRIMSON });
  page.drawText('Iran Journal of Computer Science', { x: M, y: PAGE_H - 34, size: 17, font: helvB, color: rgb(1, 1, 1) });
  page.drawText(`ISSN 2520-8438 / eISSN 2520-8446  |  Indexed in: Scopus  |  Vol. ${a.volume}, No. ${a.issue}, ${a.month} ${a.year}, pp. ${sanitize(a.pages) || 'Article in press'}`, {
    x: M, y: PAGE_H - 52, size: 8.5, font: helvR, color: rgb(1, 0.92, 0.92),
  });
  page.drawText(`https://doi.org/${sanitize(a.doi)}`, { x: M, y: PAGE_H - 65, size: 8.5, font: helvR, color: rgb(1, 0.92, 0.92) });
  y = PAGE_H - bandH - 30;

  const drawFooter = (p: typeof page, num: number) => {
    p.drawLine({ start: { x: M, y: 52 }, end: { x: PAGE_W - M, y: 52 }, thickness: 0.6, color: LIGHT });
    p.drawText('Iran Journal of Computer Science  |  Open Access - CC BY 4.0  |  Indexed in: Scopus', { x: M, y: 38, size: 7.5, font: helvR, color: GREY });
    p.drawText(`Page ${num}`, { x: PAGE_W - M - 40, y: 38, size: 7.5, font: helvR, color: GREY });
  };
  drawFooter(page, 1);
  let pageNo = 1;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    pageNo += 1;
    y = PAGE_H - M;
    drawFooter(page, pageNo);
  };
  const ensureSpace = (needed: number) => {
    if (y - needed < 72) newPage();
  };

  // ── Type + section ──
  page.drawText(sanitize(`${a.type}  ·  ${a.section}`), { x: M, y: y - 8, size: 9.5, font: helvB, color: CRIMSON });
  y -= 30;

  // ── Title ──
  for (const tl of wrap(sanitize(a.title), timesB, 19, TEXT_W)) {
    page.drawText(tl, { x: M, y: y - 16, size: 19, font: timesB, color: INK });
    y -= 24;
  }
  y -= 12;

  // ── Authors with affiliation numbers ──
  const affList: string[] = [];
  const affMap = new Map<string, number>();
  for (const aa of a.authors) {
    const key = `${aa.department}, ${aa.affiliation}`;
    if (!affMap.has(key)) { affMap.set(key, affMap.size + 1); affList.push(key); }
  }
  const authorLineParts = a.authors.map(aa => {
    const n = affMap.get(`${aa.department}, ${aa.affiliation}`);
    return `${aa.givenName} ${aa.familyName}${aa.isCorresponding ? '*' : ''}${n ? `(${n})` : ''}`;
  });
  for (const line of wrap(sanitize(authorLineParts.join(', ')), helvR, 10.5, TEXT_W)) {
    page.drawText(line, { x: M, y: y - 9, size: 10.5, font: helvR, color: INK });
    y -= 14;
  }
  y -= 4;
  for (let i = 0; i < affList.length; i++) {
    for (const line of wrap(sanitize(`${i + 1} ${affList[i]}`), helvI, 8.5, TEXT_W - 14)) {
      page.drawText(line, { x: M + 14, y: y - 8, size: 8.5, font: helvI, color: GREY });
      y -= 11.5;
    }
  }
  const corr = a.authors.find(aa => aa.isCorresponding) ?? a.authors[0];
  if (corr) {
    page.drawText(sanitize(`* Corresponding author: ${corr.givenName} ${corr.familyName} - ${a.correspondingEmail}`), {
      x: M, y: y - 8, size: 8.5, font: helvR, color: GREY,
    });
    y -= 16;
  }

  // ── Dates ──
  page.drawText(sanitize(`Received: ${a.receivedDate}   Accepted: ${a.acceptedDate}   Published: ${a.publishedDate || '-'}   © The Author(s) ${a.year}`), {
    x: M, y: y - 8, size: 8, font: helvR, color: GREY,
  });
  y -= 22;
  page.drawLine({ start: { x: M, y }, end: { x: PAGE_W - M, y }, thickness: 1.2, color: CRIMSON });
  y -= 26;

  // ── Abstract ──
  page.drawText('Abstract', { x: M, y: y - 11, size: 12.5, font: helvB, color: INK });
  y -= 20;
  for (const line of wrap(sanitize(a.abstractText), timesR, 10.5, TEXT_W)) {
    ensureSpace(16);
    page.drawText(line, { x: M, y: y - 9, size: 10.5, font: timesR, color: INK });
    y -= 14.5;
  }
  y -= 12;

  // ── Keywords ──
  ensureSpace(30);
  page.drawText('Keywords: ', { x: M, y: y - 9, size: 10, font: helvB, color: INK });
  const kwText = a.keywords.join('; ');
  const kx = M + helvB.widthOfTextAtSize('Keywords: ', 10);
  const kwLines = wrap(sanitize(kwText), helvR, 10, TEXT_W - helvB.widthOfTextAtSize('Keywords: ', 10));
  for (let i = 0; i < kwLines.length; i++) {
    page.drawText(kwLines[i], { x: i === 0 ? kx : M, y: y - 9 - i * 13, size: 10, font: helvR, color: INK });
  }
  y -= 13 * kwLines.length + 18;

  // ── Full paper body ──
  const drawParagraph = (text: string, font: PDFFont, size: number, lineHeight: number, indent = 0, color = INK) => {
    for (const line of wrap(sanitize(text), font, size, TEXT_W - indent)) {
      ensureSpace(lineHeight + 2);
      page.drawText(line, { x: M + indent, y: y - size, size, font, color });
      y -= lineHeight;
    }
  };

  const drawTable = (b: Extract<PaperBlock, { kind: 'table' }>) => {
    const nCols = Math.max(1, b.headers.length);
    const colW = TEXT_W / nCols;
    const cellSize = 8, cellPad = 3.2, cellLine = 10;
    const rowHeight = (cells: string[]) => {
      let maxLines = 1;
      cells.forEach((c, ci) => {
        const lines = wrap(sanitize(String(c)), ci === 0 ? helvB : helvR, cellSize, colW - 2 * cellPad).length;
        if (lines > maxLines) maxLines = lines;
      });
      return maxLines * cellLine + 2 * cellPad;
    };

    // caption above the table
    ensureSpace(40);
    y -= 6;
    for (const line of wrap(sanitize(b.caption), helvB, 9, TEXT_W)) {
      ensureSpace(13);
      page.drawText(line, { x: M, y: y - 9, size: 9, font: helvB, color: INK });
      y -= 12.5;
    }
    y -= 4;

    const drawRow = (cells: string[], bold: boolean, shade: boolean) => {
      const h = rowHeight(cells);
      if (y - h < 72) {
        newPage();
      }
      if (shade) {
        page.drawRectangle({ x: M, y: y - h, width: TEXT_W, height: h, color: rgb(0.955, 0.955, 0.96) });
      }
      page.drawLine({ start: { x: M, y: y - h }, end: { x: M + TEXT_W, y: y - h }, thickness: 0.7, color: GREY });
      cells.forEach((c, ci) => {
        const lines = wrap(sanitize(String(c)), bold ? helvB : helvR, cellSize, colW - 2 * cellPad);
        lines.forEach((ln, li) => {
          page.drawText(ln, {
            x: M + ci * colW + cellPad,
            y: y - cellPad - cellSize - li * cellLine,
            size: cellSize, font: bold ? helvB : helvR, color: INK,
          });
        });
      });
      y -= h;
    };

    // top rule
    page.drawLine({ start: { x: M, y }, end: { x: M + TEXT_W, y }, thickness: 1, color: INK });
    drawRow(b.headers.map(String), true, true);
    b.rows.forEach(r => drawRow(r.map(String), false, false));
    page.drawLine({ start: { x: M, y }, end: { x: M + TEXT_W, y }, thickness: 1, color: INK });
    if (b.note) {
      y -= 4;
      drawParagraph(b.note, helvI, 7.8, 10);
    }
    y -= 12;
  };

  const drawFigure = (b: Extract<PaperBlock, { kind: 'fig' }>) => {
    const boxH = 108;
    ensureSpace(boxH + 44);
    page.drawRectangle({ x: M, y: y - boxH, width: TEXT_W, height: boxH, color: rgb(0.97, 0.975, 0.98), borderColor: LIGHT, borderWidth: 0.8 });
    const cy = y - boxH / 2;
    const nodes = [
      { x: M + 60, label: 'Input' },
      { x: M + TEXT_W / 2, label: 'Model' },
      { x: M + TEXT_W - 60, label: 'Output' },
    ];
    page.drawLine({ start: { x: nodes[0].x + 30, y: cy }, end: { x: nodes[1].x - 32, y: cy }, thickness: 1.1, color: GREY });
    page.drawLine({ start: { x: nodes[1].x + 32, y: cy }, end: { x: nodes[2].x - 30, y: cy }, thickness: 1.1, color: GREY });
    nodes.forEach(n => {
      page.drawRectangle({ x: n.x - 30, y: cy - 13, width: 60, height: 26, color: rgb(1, 1, 1), borderColor: GREY, borderWidth: 0.9 });
      page.drawText(n.label, { x: n.x - helvR.widthOfTextAtSize(n.label, 8.5) / 2, y: cy - 3, size: 8.5, font: helvR, color: INK });
    });
    y -= boxH + 6;
    for (const line of wrap(sanitize(b.caption), helvI, 9, TEXT_W)) {
      page.drawText(line, { x: M, y: y - 9, size: 9, font: helvI, color: INK });
      y -= 11.5;
    }
    y -= 10;
  };

  for (const b of a.fullText) {
    if (b.kind === 'h2') {
      ensureSpace(46);
      y -= 8;
      page.drawText(sanitize(b.text), { x: M, y: y - 12, size: 12.5, font: helvB, color: INK });
      page.drawLine({ start: { x: M, y: y - 17 }, end: { x: M + 42, y: y - 17 }, thickness: 1.6, color: CRIMSON });
      y -= 24;
    } else if (b.kind === 'h3') {
      ensureSpace(34);
      y -= 5;
      page.drawText(sanitize(b.text), { x: M, y: y - 10, size: 11, font: helvB, color: INK });
      y -= 19;
    } else if (b.kind === 'p') {
      drawParagraph(b.text, timesR, 10.5, 14.2);
      y -= 6;
    } else if (b.kind === 'list') {
      b.items.forEach((item, i) => {
        const marker = b.ordered ? `${i + 1}.` : '•';
        const indent = 16;
        const lines = wrap(sanitize(item), timesR, 10.3, TEXT_W - indent);
        lines.forEach((ln, li) => {
          ensureSpace(15);
          if (li === 0) {
            page.drawText(marker, { x: M + 2, y: y - 9.5, size: 10.3, font: timesR, color: INK });
          }
          page.drawText(ln, { x: M + indent, y: y - 9.5, size: 10.3, font: timesR, color: INK });
          y -= 13.6;
        });
      });
      y -= 8;
    } else if (b.kind === 'eq') {
      ensureSpace(30);
      y -= 4;
      const eqText = sanitize(b.text);
      const size = 10.5;
      const wEq = timesI.widthOfTextAtSize(eqText, size);
      const wLabel = b.label ? helvR.widthOfTextAtSize(sanitize(b.label), 9.5) : 0;
      const totalW = wEq + wLabel + 16;
      const startX = M + Math.max(0, (TEXT_W - totalW) / 2);
      page.drawText(eqText, { x: startX, y: y - 10, size, font: timesI, color: INK });
      if (b.label) page.drawText(sanitize(b.label), { x: startX + wEq + 16, y: y - 10, size: 9.5, font: helvR, color: GREY });
      y -= 22;
    } else if (b.kind === 'table') {
      drawTable(b);
    } else if (b.kind === 'fig') {
      drawFigure(b);
    }
  }

  // ── References ──
  ensureSpace(60);
  y -= 10;
  page.drawText('References', { x: M, y: y - 11, size: 12.5, font: helvB, color: INK });
  page.drawLine({ start: { x: M, y: y - 16 }, end: { x: M + 42, y: y - 16 }, thickness: 1.6, color: CRIMSON });
  y -= 28;
  a.references.forEach((r, i) => {
    const lines = wrap(sanitize(`[${i + 1}] ${r}`), timesR, 9, TEXT_W - 10);
    for (let li = 0; li < lines.length; li++) {
      ensureSpace(14);
      page.drawText(lines[li], { x: M + (li === 0 ? 0 : 10), y: y - 8, size: 9, font: timesR, color: INK });
      y -= 12;
    }
    y -= 3;
  });

  return { bytes: await pdf.save(), pageCount: pdf.getPageCount() };
}

// Convenience wrapper for the API route.
export async function renderPaperPdf(a: PaperRenderInput): Promise<Uint8Array> {
  const { bytes } = await buildPaperPdf(a);
  return bytes;
}
