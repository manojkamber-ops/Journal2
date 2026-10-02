import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const issues = await db.issue.findMany({
      orderBy: [{ volume: 'desc' }, { issue: 'desc' }],
    });
    const counts = await db.article.groupBy({
      by: ['volume', 'issue'],
      _count: { issue: true },
    });
    const countMap = new Map(counts.map(c => [`${c.volume}-${c.issue}`, c._count.issue]));

    return NextResponse.json(
      issues.map(i => ({
        id: i.id,
        volume: i.volume,
        issue: i.issue,
        year: i.year,
        month: i.month,
        theme: i.theme,
        description: i.description,
        publishedDate: i.publishedDate,
        status: i.status,
        isSpecial: i.isSpecial,
        articleCount: countMap.get(`${i.volume}-${i.issue}`) ?? 0,
      })),
    );
  } catch (e) {
    console.error('issues list error', e);
    return NextResponse.json({ error: 'Failed to load issues' }, { status: 500 });
  }
}
