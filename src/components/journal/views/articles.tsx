'use client';

import { useState } from 'react';
import { useFetch } from '@/lib/journal-client';
import { ARTICLE_TYPES, SECTION_LIST } from '@/lib/journal-types';
import { ArticleRow, Pager, ListSkeleton, ErrorBox, OaBadge } from '../bits';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface ListResponse {
  items: {
    id: string; status: string; title: string; abstractText: string; keywords: string[];
    doi: string; volume: number; issue: number; year: number; month: string; pages: string;
    type: string; section: string; publishedDate: string; citations: number; downloads: number;
    authors: { id: string; name: string; isCorresponding: boolean }[];
  }[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const YEARS = Array.from({ length: 9 }, (_, i) => 2026 - i);

export function ArticlesView({ initialQuery, initialSection, initialSort, initialYear }: {
  initialQuery?: string;
  initialSection?: string;
  initialSort?: string;
  initialYear?: string;
}) {
  // The component is mounted with a `key` derived from the hash params,
  // so state initialized here resets on every external navigation.
  const [q, setQ] = useState(initialQuery ?? '');
  const [year, setYear] = useState(initialYear ?? 'all');
  const [type, setType] = useState('all');
  const [section, setSection] = useState(initialSection ?? 'all');
  const [sort, setSort] = useState(initialSort ?? 'newest');
  const [page, setPage] = useState(1);

  const qs = new URLSearchParams();
  if (q.trim()) qs.set('q', q.trim());
  if (year !== 'all') qs.set('year', year);
  if (type !== 'all') qs.set('type', type);
  if (section !== 'all') qs.set('section', section);
  if (sort !== 'newest') qs.set('sort', sort);
  qs.set('page', String(page));
  qs.set('pageSize', '10');

  const { data, loading, error, reload } = useFetch<ListResponse>(`/api/articles?${qs.toString()}`);

  const reset = () => { setQ(''); setYear('all'); setType('all'); setSection('all'); setSort('newest'); setPage(1); };
  const hasFilters = q.trim() || year !== 'all' || type !== 'all' || section !== 'all' || sort !== 'newest';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="border-b-2 border-crimson pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-crimson">Browse the journal</p>
          <OaBadge />
        </div>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">Articles</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Search and filter every article published in IJCS since 2018.
        </p>
      </header>

      {/* Filter toolbar */}
      <div className="sticky top-[44px] z-30 -mx-4 mt-6 border-b border-zinc-200 bg-paper/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-4">
        <form
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
          onSubmit={e => { e.preventDefault(); setPage(1); }}
        >
          <div className="relative col-span-2 sm:col-span-3 lg:col-span-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
            <Input
              value={q}
              onChange={e => { setQ(e.target.value); setPage(1); }}
              placeholder="Title, abstract, author, keyword…"
              className="h-9 border-zinc-300 pl-8 text-sm"
              aria-label="Search articles"
            />
          </div>
          <Select value={year} onValueChange={v => { setYear(v); setPage(1); }}>
            <SelectTrigger className="h-9 border-zinc-300 text-sm" aria-label="Filter by year"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={v => { setType(v); setPage(1); }}>
            <SelectTrigger className="h-9 border-zinc-300 text-sm" aria-label="Filter by article type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {ARTICLE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={section} onValueChange={v => { setSection(v); setPage(1); }}>
            <SelectTrigger className="h-9 border-zinc-300 text-sm" aria-label="Filter by subject area"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">All subject areas</SelectItem>
              {SECTION_LIST.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={v => { setSort(v); setPage(1); }}>
            <SelectTrigger className="h-9 border-zinc-300 text-sm" aria-label="Sort order"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="cited">Most cited</SelectItem>
              <SelectItem value="downloaded">Most downloaded</SelectItem>
            </SelectContent>
          </Select>
        </form>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          <span aria-live="polite">
            {loading ? 'Searching…' : `${data?.total ?? 0} article${(data?.total ?? 0) === 1 ? '' : 's'} found`}
          </span>
          {hasFilters && (
            <button onClick={reset} className="inline-flex items-center gap-1 font-semibold text-crimson hover:underline">
              <X className="h-3 w-3" aria-hidden /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <ListSkeleton rows={6} />
      ) : error ? (
        <div className="mt-8"><ErrorBox message={error} onRetry={reload} /></div>
      ) : data && data.items.length === 0 ? (
        <div className="py-20 text-center">
          <Search className="mx-auto h-10 w-10 text-zinc-300" aria-hidden />
          <p className="mt-3 font-semibold text-ink">No articles match your search</p>
          <p className="mt-1 text-sm text-zinc-500">Try different keywords or remove some filters.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={reset}>Clear all filters</Button>
        </div>
      ) : data ? (
        <>
          <div className="mt-2">
            {data.items.map(a => <ArticleRow key={a.id} article={a} />)}
          </div>
          <Pager page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      ) : null}
    </div>
  );
}
