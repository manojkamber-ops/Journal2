'use client';

import { useMemo, useState } from 'react';
import { useFetch } from '@/lib/journal-client';
import { ErrorBox, BlockSkeleton, SectionHeading, OaBadge } from '../bits';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react';

interface IssueDTO {
  id: string; volume: number; issue: number; year: number; month: string;
  theme: string; description: string; publishedDate: string; status: string;
  isSpecial: boolean; articleCount: number;
}

export function IssuesView() {
  const { data, loading, error, reload } = useFetch<IssueDTO[]>('/api/issues');
  const [filter, setFilter] = useState<'all' | 'special'>('all');
  const [q, setQ] = useState('');

  const grouped = useMemo(() => {
    if (!data) return [];
    const filtered = data.filter(i => {
      if (filter === 'special' && !i.isSpecial) return false;
      if (q.trim()) {
        const t = `${i.theme} ${i.month} ${i.year}`.toLowerCase();
        if (!t.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
    const map = new Map<number, IssueDTO[]>();
    for (const i of filtered) {
      if (!map.has(i.volume)) map.set(i.volume, []);
      map.get(i.volume)!.push(i);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [data, filter, q]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><BlockSkeleton h={500} /></div>;
  if (error || !data) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Failed to load issues'} onRetry={reload} /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="border-b-2 border-crimson pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-crimson">Archive</p>
          <OaBadge />
        </div>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">Issues</h1>
        <p className="mt-1 text-sm text-zinc-500">All volumes of the journal, 2018–2026 (Volume 1–9).</p>
      </header>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          <Input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search themes, months, years…"
            className="h-9 w-64 border-zinc-300 pl-8 text-sm"
            aria-label="Search issues"
          />
        </div>
        <div className="flex rounded-md border border-zinc-300 p-0.5">
          <button
            className={`rounded px-3 py-1.5 text-xs font-semibold ${filter === 'all' ? 'bg-crimson text-white' : 'text-zinc-600 hover:text-crimson'}`}
            onClick={() => setFilter('all')}
          >
            All issues ({data.length})
          </button>
          <button
            className={`rounded px-3 py-1.5 text-xs font-semibold ${filter === 'special' ? 'bg-crimson text-white' : 'text-zinc-600 hover:text-crimson'}`}
            onClick={() => setFilter('special')}
          >
            Special issues only ({data.filter(i => i.isSpecial).length})
          </button>
        </div>
      </div>

      {/* Volumes */}
      <div className="mt-8 space-y-10">
        {grouped.map(([volume, issues]) => {
          const year = issues[0]?.year;
          const total = issues.reduce((s, i) => s + i.articleCount, 0);
          return (
            <section key={volume} aria-labelledby={`vol-${volume}`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id={`vol-${volume}`} className="flex items-baseline gap-2 text-xl font-bold text-ink">
                  <span className="wordmark">Volume {volume}</span>
                  <span className="text-sm font-semibold text-zinc-400">· {year}</span>
                </h2>
                <span className="text-xs text-zinc-400">{total} articles</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {issues.map(i => (
                  <a
                    key={i.id}
                    href={`#/issue/${i.id}`}
                    className="group flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-crimson/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded bg-crimson-light text-sm font-bold text-crimson">
                        {i.issue}
                      </span>
                      {i.isSpecial ? (
                        <span className="rounded-full bg-scopus-light px-2 py-0.5 text-[10px] font-bold uppercase text-scopus">Special</span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm font-bold text-ink group-hover:text-crimson">{i.month} {i.year}</p>
                    {i.theme ? (
                      <p className="clamp-2 mt-1 text-[12px] font-medium text-crimson/90">{i.theme.replace(/^Special Issue:\s*/i, '')}</p>
                    ) : (
                      <p className="mt-1 text-[12px] text-zinc-500">Regular quarterly issue</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-zinc-400">
                      <span>{i.articleCount} articles</span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3 w-3" aria-hidden />
                        {i.status === 'upcoming' ? 'Forthcoming' : 'Published'}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
        {grouped.length === 0 && (
          <p className="py-16 text-center text-sm text-zinc-500">No issues match your search.</p>
        )}
      </div>

      {/* Jump links */}
      <section className="mt-14">
        <SectionHeading title="Quick jump" sub="Jump directly to a volume" />
        <div className="flex flex-wrap gap-2">
          {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(v => (
            <a
              key={v}
              href={`#vol-${v}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(`vol-${v}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-crimson/50 hover:text-crimson"
            >
              Vol {v} <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </a>
          ))}
          <Button variant="ghost" size="sm" className="gap-1 text-zinc-500" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top <ChevronUp className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
      </section>
    </div>
  );
}
