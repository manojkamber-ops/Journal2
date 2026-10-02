import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { renderPaperPdf } from '@/lib/pdf-render';
import type { PaperBlock } from '@/lib/journal-types';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const a = await db.article.findUnique({
      where: { id },
      include: { authors: { orderBy: { order: 'asc' }, include: { author: true } } },
    });
    if (!a) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    let fullText: PaperBlock[] = [];
    try { fullText = JSON.parse(a.fullText || '[]'); } catch { fullText = []; }
    let references: string[] = [];
    try { references = JSON.parse(a.references); } catch { references = []; }

    const bytes = await renderPaperPdf({
      title: a.title,
      abstractText: a.abstractText,
      keywords: JSON.parse(a.keywords),
      doi: a.doi,
      volume: a.volume,
      issue: a.issue,
      year: a.year,
      month: a.month,
      pages: a.pages,
      type: a.type,
      section: a.section,
      receivedDate: a.receivedDate,
      acceptedDate: a.acceptedDate,
      publishedDate: a.publishedDate,
      references,
      fullText,
      correspondingEmail: a.correspondingEmail,
      authors: a.authors.map(aa => ({
        givenName: aa.author.givenName,
        familyName: aa.author.familyName,
        isCorresponding: aa.isCorresponding,
        department: aa.author.department,
        affiliation: aa.author.affiliation,
      })),
    });

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
