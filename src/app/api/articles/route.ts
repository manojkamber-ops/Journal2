import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = (sp.get('q') || '').trim();
    const year = sp.get('year');
    const type = sp.get('type');
    const section = sp.get('section');
    const volume = sp.get('volume');
    const issue = sp.get('issue');
    const sort = sp.get('sort') || 'newest';
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const pageSize = Math.min(50, Math.max(5, parseInt(sp.get('pageSize') || '10', 10) || 10));

    const where: Prisma.ArticleWhereInput = { status: 'published' };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { abstractText: { contains: q } },
        { keywords: { contains: q } },
        { section: { contains: q } },
        { authors: { some: { author: { OR: [{ givenName: { contains: q } }, { familyName: { contains: q } }, { affiliation: { contains: q } }] } } } },
      ];
    }
    if (year && !isNaN(Number(year))) where.year = Number(year);
    if (type) where.type = type;
    if (section) where.section = section;
    if (volume && !isNaN(Number(volume))) {
      where.volume = Number(volume);
      if (issue && !isNaN(Number(issue))) where.issue = Number(issue);
    }

    let orderBy: Prisma.ArticleOrderByWithRelationInput[];
    // NOTE: within-issue order uses { id: 'asc' } because page ranges are strings
    // ("1-9" vs "10-16" sort wrongly); IDs are zero-padded, assigned in generation
    // order, and generation order == page order within an issue.
    switch (sort) {
      case 'oldest':
        orderBy = [{ year: 'asc' }, { volume: 'asc' }, { issue: 'asc' }, { id: 'asc' }];
        break;
      case 'cited':
        orderBy = [{ citations: 'desc' }];
        break;
      case 'downloaded':
        orderBy = [{ downloads: 'desc' }];
        break;
      default:
        orderBy = [{ year: 'desc' }, { volume: 'desc' }, { issue: 'desc' }, { id: 'asc' }];
    }

    const [total, articles] = await Promise.all([
      db.article.count({ where }),
      db.article.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          authors: {
            orderBy: { order: 'asc' },
            include: { author: true },
          },
        },
      }),
    ]);

    const items = articles.map(a => ({
      id: a.id,
      status: a.status,
      title: a.title,
      abstractText: a.abstractText,
      keywords: JSON.parse(a.keywords) as string[],
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
    }));

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (e) {
    console.error('articles list error', e);
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}
