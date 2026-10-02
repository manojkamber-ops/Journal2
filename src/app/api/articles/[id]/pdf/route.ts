import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const dynamic = 'force-dynamic';

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
const CRIMSON = rgb(0.75, 0.05, 0.12);
const INK = rgb(0.13, 0.13, 0.15);
const GREY = rgb(0.42, 0.42, 0.47);

function wrap(text: string, font: { widthOfTextAtSize(t: string, s: number): number }, size: number, maxW: number): string[] {
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const a = await db.article.findUnique({
      where: { id },
      include: { authors: { orderBy: { order: 'asc' }, include: { author: true } } },
    });
    if (!a) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    const pdf = await PDFDocument.create();
    const timesB = await pdf.embedFont(StandardFonts.TimesRomanBold);
    const timesR = await pdf.embedFont(StandardFonts.TimesRoman);
    const timesI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
    const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
    const helvR = await pdf.embedFont(StandardFonts.Helvetica);
    const helvI = await pdf.embedFont(StandardFonts.HelveticaOblique);

    let page = pdf.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H;

    // ── Header band ──
    const bandH = 74;
    page.drawRectangle({ x: 0, y: PAGE_H - bandH, width: PAGE_W, height: bandH, color: CRIMSON });
    page.drawText('Iran Journal of Computer Science', { x: M, y: PAGE_H - 34, size: 17, font: helvB, color: rgb(1, 1, 1) });
    page.drawText(`ISSN 2520-8438 / eISSN 2520-8446  |  Springer Nature  |  Vol. ${a.volume}, No. ${a.issue}, ${a.month} ${a.year}, pp. ${sanitize(a.pages) || 'Article in press'}`, {
      x: M, y: PAGE_H - 52, size: 8.5, font: helvR, color: rgb(1, 0.92, 0.92),
    });
    page.drawText(`https://doi.org/${sanitize(a.doi)}`, { x: M, y: PAGE_H - 65, size: 8.5, font: helvR, color: rgb(1, 0.92, 0.92) });
    y = PAGE_H - bandH - 30;

    const drawFooter = (p: typeof page, num: number) => {
      p.drawLine({ start: { x: M, y: 52 }, end: { x: PAGE_W - M, y: 52 }, thickness: 0.6, color: rgb(0.85, 0.85, 0.87) });
      p.drawText('Iran Journal of Computer Science (2026)  |  Open Access — CC BY 4.0', { x: M, y: 38, size: 7.5, font: helvR, color: GREY });
      p.drawText(`Page ${num}`, { x: PAGE_W - M - 40, y: 38, size: 7.5, font: helvR, color: GREY });
    };
    drawFooter(page, 1);
    let pageNo = 1;

    const ensureSpace = (needed: number) => {
      if (y - needed < 72) {
        page = pdf.addPage([PAGE_W, PAGE_H]);
        pageNo += 1;
        y = PAGE_H - M;
        drawFooter(page, pageNo);
      }
    };

    // ── Type + section ──
    page.drawText(sanitize(`${a.type}  ·  ${a.section}`), { x: M, y: y - 8, size: 9.5, font: helvB, color: CRIMSON });
    y -= 30;

    // ── Title ──
    const titleLines = wrap(sanitize(a.title), timesB, 19, PAGE_W - 2 * M);
    for (const tl of titleLines) {
      page.drawText(tl, { x: M, y: y - 16, size: 19, font: timesB, color: INK });
      y -= 24;
    }
    y -= 12;

    // ── Authors with affiliation numbers ──
    const affList: string[] = [];
    const affMap = new Map<string, number>();
    for (const aa of a.authors) {
      const key = `${aa.author.department}, ${aa.author.affiliation}`;
      if (!affMap.has(key)) { affMap.set(key, affMap.size + 1); affList.push(key); }
    }
    const authorLineParts = a.authors.map(aa => {
      const n = affMap.get(`${aa.author.department}, ${aa.author.affiliation}`);
      return `${aa.author.givenName} ${aa.author.familyName}${aa.isCorresponding ? '*' : ''}${n ? `(${n})` : ''}`;
    });
    for (const line of wrap(sanitize(authorLineParts.join(', ')), helvR, 10.5, PAGE_W - 2 * M)) {
      page.drawText(line, { x: M, y: y - 9, size: 10.5, font: helvR, color: INK });
      y -= 14;
    }
    y -= 4;
    for (let i = 0; i < affList.length; i++) {
      for (const line of wrap(sanitize(`${i + 1} ${affList[i]}`), helvI, 8.5, PAGE_W - 2 * M - 14)) {
        page.drawText(line, { x: M + 14, y: y - 8, size: 8.5, font: helvI, color: GREY });
        y -= 11.5;
      }
    }
    const corr = a.authors.find(aa => aa.isCorresponding) ?? a.authors[0];
    if (corr) {
      page.drawText(sanitize(`* Corresponding author: ${corr.author.givenName} ${corr.author.familyName} — ${a.correspondingEmail}`), {
        x: M, y: y - 8, size: 8.5, font: helvR, color: GREY,
      });
      y -= 16;
    }

    // ── Dates ──
    page.drawText(sanitize(`Received: ${a.receivedDate}   Accepted: ${a.acceptedDate}   Published: ${a.publishedDate || '—'}   © The Author(s) ${a.year}`), {
      x: M, y: y - 8, size: 8, font: helvR, color: GREY,
    });
    y -= 22;
    page.drawLine({ start: { x: M, y }, end: { x: PAGE_W - M, y }, thickness: 1.2, color: CRIMSON });
    y -= 26;

    // ── Abstract ──
    page.drawText('Abstract', { x: M, y: y - 11, size: 12.5, font: helvB, color: INK });
    y -= 20;
    for (const line of wrap(sanitize(a.abstractText), timesR, 10.5, PAGE_W - 2 * M)) {
      ensureSpace(16);
      page.drawText(line, { x: M, y: y - 9, size: 10.5, font: timesR, color: INK });
      y -= 14.5;
    }
    y -= 12;

    // ── Keywords ──
    ensureSpace(30);
    page.drawText('Keywords: ', { x: M, y: y - 9, size: 10, font: helvB, color: INK });
    const kwText = JSON.parse(a.keywords).join('; ');
    let kx = M + helvB.widthOfTextAtSize('Keywords: ', 10);
    const kwLines = wrap(sanitize(kwText), helvR, 10, PAGE_W - 2 * M - helvB.widthOfTextAtSize('Keywords: ', 10));
    for (let i = 0; i < kwLines.length; i++) {
      page.drawText(kwLines[i], { x: i === 0 ? kx : M, y: y - 9 - i * 13, size: 10, font: helvR, color: INK });
    }
    y -= 13 * kwLines.length + 16;

    // ── References ──
    ensureSpace(60);
    page.drawText('References', { x: M, y: y - 11, size: 12.5, font: helvB, color: INK });
    y -= 22;
    const refs: string[] = JSON.parse(a.references);
    refs.forEach((r, i) => {
      const lines = wrap(sanitize(`[${i + 1}] ${r}`), timesR, 9, PAGE_W - 2 * M - 10);
      for (let li = 0; li < lines.length; li++) {
        ensureSpace(14);
        page.drawText(lines[li], { x: M + (li === 0 ? 0 : 10), y: y - 8, size: 9, font: timesR, color: INK });
        y -= 12;
      }
      y -= 3;
    });

    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${a.id}.pdf"`,
      },
    });
  } catch (e) {
    console.error('pdf generation error', e);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
