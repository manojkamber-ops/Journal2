import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const members = await db.boardMember.findMany({ orderBy: { order: 'asc' } });
    const groups: Record<string, typeof members> = {
      'Editor-in-Chief': [],
      'Deputy Editor': [],
      'Associate Editor': [],
      'Editorial Board': [],
    };
    for (const m of members) {
      (groups[m.role] ??= []).push(m);
    }
    return NextResponse.json(groups);
  } catch (e) {
    console.error('board error', e);
    return NextResponse.json({ error: 'Failed to load editorial board' }, { status: 500 });
  }
}
