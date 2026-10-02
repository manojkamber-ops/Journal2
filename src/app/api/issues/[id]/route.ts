import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) return NextResponse.json({ error: 'Issue not found' }, { status: 404 });

    const articles = await db.article.findMany({
      where: { volume: issue.volume, issue: issue.issue },
      orderBy: [{ status: 'asc' }, { pages: 'asc' }],
      include: {
        authors: { orderBy: { order: 'asc' }, include: { author: true } },
      },
    });

    return NextResponse.json({
      issue: {
        id: issue.id,
        volume: issue.volume,
        issue: issue.issue,
        year: issue.year,
        month: issue.month,
        theme: issue.theme,
        description: issue.description,
        publishedDate: issue.publishedDate,
        status: issue.status,
        isSpecial: issue.isSpecial,
      },
      articles: articles.map(a => ({
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
        publishedDate: a.publishedDate,
        citations: a.citations,
        downloads: a.downloads,
        authors: a.authors.map(aa => ({
          id: aa.authorId,
          name: `${aa.author.givenName} ${aa.author.familyName}`,
          isCorresponding: aa.isCorresponding,
        })),
      })),
    });
  } catch (e) {
    console.error('issue detail error', e);
    return NextResponse.json({ error: 'Failed to load issue' }, { status: 500 });
  }
}
