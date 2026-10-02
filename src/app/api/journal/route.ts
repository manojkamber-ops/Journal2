import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ArticleListItem, JournalOverview } from '@/lib/journal-types';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const articleInclude = {
  authors: {
    orderBy: { order: 'asc' as const },
    include: { author: true },
  },
};

function toListItem(a: Prisma.ArticleGetPayload<{ include: typeof articleInclude }>): ArticleListItem {
  return {
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
  };
}

export async function GET() {
  try {
    const [
      totalArticles, totalAuthors, totalIssues,
      aggDownloads, aggCountries,
      latestIssueDb, announcements,
      latestArticles, mostCited, mostDownloaded, justAccepted,
      sectionGroups, volumeGroups,
    ] = await Promise.all([
      db.article.count({ where: { status: 'published' } }),
      db.author.count(),
      db.issue.count(),
      db.article.aggregate({ _sum: { downloads: true } }),
      db.author.findMany({ select: { country: true }, distinct: ['country'] }),
      db.issue.findFirst({ where: { status: 'published' }, orderBy: [{ volume: 'desc' }, { issue: 'desc' }] }),
      db.announcement.findMany({ orderBy: { date: 'desc' } }),
      db.article.findMany({
        where: { status: 'published' },
        orderBy: [{ year: 'desc' }, { volume: 'desc' }, { issue: 'desc' }, { pages: 'asc' }],
        take: 6,
        include: articleInclude,
      }),
      db.article.findMany({ where: { status: 'published' }, orderBy: { citations: 'desc' }, take: 5, include: articleInclude }),
      db.article.findMany({ where: { status: 'published' }, orderBy: { downloads: 'desc' }, take: 5, include: articleInclude }),
      db.article.findMany({ where: { status: 'in_press' }, orderBy: { acceptedDate: 'desc' }, take: 4, include: articleInclude }),
      db.article.groupBy({ by: ['section'], _count: { section: true }, where: { status: 'published' } }),
      db.article.groupBy({ by: ['volume', 'year'], _count: { volume: true } }),
    ]);

    const issueCounts = await db.issue.groupBy({ by: ['volume'], _count: { volume: true } });
    const issueCountMap = new Map(issueCounts.map(g => [g.volume, g._count.volume]));

    const overview: JournalOverview = {
      metrics: {
        citeScore: 4.6,
        citeScoreHistory: [
          { year: 2020, value: 1.2 }, { year: 2021, value: 1.6 }, { year: 2022, value: 2.1 },
          { year: 2023, value: 3.0 }, { year: 2024, value: 3.9 }, { year: 2025, value: 4.6 },
        ],
        sjr: 0.52,
        snip: 0.83,
        hIndex: 21,
        downloads2025: 148317,
        acceptanceRate: '24%',
        daysToFirstDecision: 38,
        percentile: 74,
        quartile: 'Q2',
      },
      stats: {
        totalArticles,
        totalAuthors,
        totalIssues,
        totalCountries: aggCountries.length,
        totalDownloads: aggDownloads._sum.downloads ?? 0,
      },
      latestIssue: latestIssueDb
        ? {
            id: latestIssueDb.id, volume: latestIssueDb.volume, issue: latestIssueDb.issue,
            year: latestIssueDb.year, month: latestIssueDb.month, theme: latestIssueDb.theme,
            isSpecial: latestIssueDb.isSpecial, publishedDate: latestIssueDb.publishedDate,
          }
        : null,
      latestArticles: latestArticles.map(toListItem),
      mostCited: mostCited.map(toListItem),
      mostDownloaded: mostDownloaded.map(toListItem),
      justAccepted: justAccepted.map(toListItem),
      announcements: announcements.map(a => ({ id: a.id, date: a.date, title: a.title, body: a.body, type: a.type })),
      sections: sectionGroups
        .map(g => ({ name: g.section, count: g._count.section }))
        .sort((a, b) => b.count - a.count),
      volumes: volumeGroups
        .map(g => ({ volume: g.volume, year: g.year, issueCount: issueCountMap.get(g.volume) ?? 0, articleCount: g._count.volume }))
        .sort((a, b) => b.volume - a.volume),
    };

    return NextResponse.json(overview);
  } catch (e) {
    console.error('journal overview error', e);
    return NextResponse.json({ error: 'Failed to load journal overview' }, { status: 500 });
  }
}
