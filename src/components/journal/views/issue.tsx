'use client';

import { useFetch } from '@/lib/journal-client';
import { ArticleRow, ErrorBox, ListSkeleton, SectionHeading } from '../bits';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface IssueDetail {
  issue: {
    id: string; volume: number; issue: number; year: number; month: string;
    theme: string; description: string; publishedDate: string; status: string; isSpecial: boolean;
  };
  articles: {
    id: string; status: string; title: string; abstractText: string; keywords: string[];
    doi: string; volume: number; issue: number; year: number; month: string; pages: string;
    type: string; section: string; publishedDate: string; citations: number; downloads: number;
    authors: { id: string; name: string; isCorresponding: boolean }[];
  }[];
}

export function IssueView({ id }: { id: string }) {
  const { data, loading, error, reload } = useFetch<IssueDetail>(`/api/issues/${encodeURIComponent(id)}`);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><ListSkeleton rows={6} /></div>;
  if (error || !data) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Issue not found'} onRetry={reload} /></div>;

  const { issue, articles } = data;
  const published = articles.filter(a => a.status === 'published');
  const inPress = articles.filter(a => a.status === 'in_press');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5 text-zinc-500">
        <a href="#/issues"><ArrowLeft className="h-4 w-4" aria-hidden /> All issues</a>
      </Button>

      <header className="border-b-2 border-crimson pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-crimson">
          {issue.status === 'upcoming' ? 'Forthcoming issue' : 'Journal issue'}
        </p>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">
          Volume {issue.volume}, Issue {issue.issue} — {issue.month} {issue.year}
        </h1>
        {issue.isSpecial && (
          <p className="mt-3 inline-flex rounded-full bg-crimson-light px-3 py-1 text-xs font-bold uppercase tracking-wide text-crimson">
            {issue.theme}
          </p>
        )}
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">{issue.description}</p>
        <p className="mt-2 text-xs text-zinc-400">
          {issue.status === 'upcoming'
            ? `Expected publication: 25 ${issue.month} ${issue.year}`
            : `Published: ${issue.publishedDate} · ${published.length} articles`}
        </p>
      </header>

      {published.length > 0 && (
        <div className="mt-4">
          <SectionHeading title="Articles in this issue" />
          {published.map(a => <ArticleRow key={a.id} article={a} />)}
        </div>
      )}

      {inPress.length > 0 && (
        <div className="mt-4">
          <SectionHeading
            title="Articles in press"
            sub="Accepted manuscripts that will appear in this forthcoming issue"
          />
          {inPress.map(a => <ArticleRow key={a.id} article={a} />)}
        </div>
      )}

      {articles.length === 0 && (
        <p className="py-16 text-center text-sm text-zinc-500">No articles have been assigned to this issue yet.</p>
      )}
    </div>
  );
}
