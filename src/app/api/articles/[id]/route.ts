import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const a = await db.article.findUnique({
      where: { id },
      include: {
        authors: {
          orderBy: { order: 'asc' },
          include: { author: true },
        },
      },
    });
    if (!a) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    // Similar articles: same section, prefer published with citations, exclude self
    const similarDb = await db.article.findMany({
      where: { section: a.section, id: { not: a.id }, status: 'published' },
      orderBy: { citations: 'desc' },
      take: 5,
      select: { id: true, title: true, year: true, citations: true, section: true },
    });

    return NextResponse.json({
      id: a.id,
      status: a.status,
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
      citations: a.citations,
      downloads: a.downloads,
      pdfPages: a.pdfPages,
      references: JSON.parse(a.references),
      fullText: JSON.parse(a.fullText || '[]'),
      correspondingEmail: a.correspondingEmail,
      authors: a.authors.map(aa => ({
        id: aa.authorId,
        name: `${aa.author.givenName} ${aa.author.familyName}`,
        isCorresponding: aa.isCorresponding,
      })),
      authorDetails: a.authors.map(aa => ({
        id: aa.author.id,
        givenName: aa.author.givenName,
        familyName: aa.author.familyName,
        orcid: aa.author.orcid,
        affiliation: aa.author.affiliation,
        department: aa.author.department,
        country: aa.author.country,
        email: aa.isCorresponding ? a.correspondingEmail : aa.author.email,
        order: aa.order,
        isCorresponding: aa.isCorresponding,
      })),
      similar: similarDb,
    });
  } catch (e) {
    console.error('article detail error', e);
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }
}
