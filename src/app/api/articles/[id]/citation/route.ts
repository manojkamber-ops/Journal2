import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface AuthorRow { givenName: string; familyName: string; isCorresponding: boolean; order: number }

function fmtAuthorsBibtex(rows: AuthorRow[]): string {
  return rows.map(r => `${r.familyName}, ${r.givenName}`).join(' and ');
}
function fmtAuthorsApa(rows: AuthorRow[]): string {
  if (rows.length === 1) return `${rows[0].familyName}, ${rows[0].givenName.charAt(0)}.`;
  if (rows.length === 2) return `${rows[0].familyName}, ${rows[0].givenName.charAt(0)}., & ${rows[1].familyName}, ${rows[0].givenName.charAt(0)}.`;
  return `${rows[0].familyName}, ${rows[0].givenName.charAt(0)}., et al.`;
}
function fmtAuthorsRis(rows: AuthorRow[]): string[] {
  return rows.map(r => `AU  - ${r.familyName}, ${r.givenName}`);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const format = (req.nextUrl.searchParams.get('format') || 'bibtex').toLowerCase();
    const a = await db.article.findUnique({
      where: { id },
      include: { authors: { orderBy: { order: 'asc' }, include: { author: true } } },
    });
    if (!a) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    const rows: AuthorRow[] = a.authors.map(aa => ({
      givenName: aa.author.givenName,
      familyName: aa.author.familyName,
      isCorresponding: aa.isCorresponding,
      order: aa.order,
    }));
    const year = a.year;
    const vol = a.volume;
    const iss = a.issue;
    const pages = a.pages.replace('–', '-');
    const title = a.title;
    const jname = 'Iran Journal of Computer Science';
    const doi = a.doi;

    let body = '';
    let filename = `${a.id}.txt`;
    let contentType = 'text/plain; charset=utf-8';

    if (format === 'bibtex') {
      const key = `${rows[0]?.familyName || 'anon'}${year}`.toLowerCase().replace(/[^a-z0-9]/g, '');
      body = [
        `@article{${key}${year},`,
        `  title   = {${title}},`,
        `  author  = {${fmtAuthorsBibtex(rows)}},`,
        `  journal = {${jname}},`,
        `  volume  = {${vol}},`,
        `  number  = {${iss}},`,
        `  pages   = {${pages}},`,
        `  year    = {${year}},`,
        `  doi     = {${doi}},`,
        `  issn    = {2520-8438}`,
        `}`,
      ].join('\n');
      filename = `${a.id}.bib`;
    } else if (format === 'ris') {
      const startPage = pages.split('-')[0];
      body = [
        'TY  - JOUR',
        `TI  - ${title}`,
        ...fmtAuthorsRis(rows),
        `JO  - ${jname}`,
        `VL  - ${vol}`,
        `IS  - ${iss}`,
        `SP  - ${startPage}`,
        `PY  - ${year}`,
        `DO  - ${doi}`,
        'ER  - ',
      ].join('\n');
      filename = `${a.id}.ris`;
    } else {
      // APA 7
      body = `${fmtAuthorsApa(rows)} (${year}). ${title}. ${jname}, ${vol}(${iss}), ${pages}. https://doi.org/${doi}`;
      filename = `${a.id}-citation.txt`;
    }

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error('citation export error', e);
    return NextResponse.json({ error: 'Failed to export citation' }, { status: 500 });
  }
}
