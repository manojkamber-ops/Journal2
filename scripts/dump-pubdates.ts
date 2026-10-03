// Dump every article's id + publishedDate to stdout as JSON (for before/after diff).
import { db } from '../src/lib/db';

const rows = await db.article.findMany({
  select: { id: true, publishedDate: true },
  orderBy: { id: 'asc' },
});
console.log(JSON.stringify(rows));
