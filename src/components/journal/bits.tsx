'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleListItem } from '@/lib/journal-types';
import { nav, fmtNum, truncate } from '@/lib/journal-client';
import { FileText, Quote, Download, ChevronLeft, ChevronRight, Newspaper, Megaphone, Award, CalendarDays, ExternalLink, LockOpen } from 'lucide-react';

// ── Journal logo ─────────────────────────────────────────────────────────────
export function JournalLogo({ size = 44 }: { size?: number }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="IJCS logo — satellite view of the Iran region from the journal cover"
      width={size}
      height={size}
      priority
      className="shrink-0 rounded-md shadow-sm ring-1 ring-zinc-300"
    />
  );
}

// ── Badges ───────────────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, string> = {
  'Research Article': 'bg-crimson-light text-crimson border-crimson/20',
  'Review Article': 'bg-scopus-light text-scopus border-scopus/25',
  Survey: 'bg-scopus-light text-scopus border-scopus/25',
  'Short Communication': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Technical Note': 'bg-amber-50 text-amber-700 border-amber-200',
  'Article in Press': 'bg-zinc-100 text-zinc-600 border-zinc-300',
};

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${TYPE_STYLES[type] || 'bg-zinc-100 text-zinc-600 border-zinc-300'}`}>
      {type}
    </span>
  );
}

export function SectionTag({ section }: { section: string }) {
  return (
    <span className="text-xs font-medium text-zinc-500">{section}</span>
  );
}

export function IndexBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-zinc-700">
      <span className="h-1.5 w-1.5 rounded-full bg-scopus" aria-hidden />
      {name}
    </span>
  );
}

// ── Open Access publishing-model highlight (shown on every page) ─────────────
export function OaBadge({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return (
    <span
      title="Publishing model: Open Access — every article is free to read, download and reuse under CC BY 4.0"
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded font-bold ${
        onDark
          ? 'bg-emerald-500 px-2 py-0.5 text-[11px] text-white'
          : 'border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] uppercase tracking-wide text-emerald-700'
      } ${className}`}
    >
      <LockOpen className="h-3 w-3 shrink-0" aria-hidden />
      Publishing model: Open Access (OA)
    </span>
  );
}

// ── Metric tile ──────────────────────────────────────────────────────────────
export function MetricTile({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-scopus/30 bg-scopus-light' : 'border-zinc-200 bg-white'}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${accent ? 'text-scopus' : 'text-zinc-500'}`}>{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
      {sub ? <div className="mt-0.5 text-[11px] text-zinc-500">{sub}</div> : null}
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
export function SectionHeading({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-crimson pb-2">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {sub ? <p className="mt-0.5 text-sm text-zinc-500">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

// ── Announcement type icon ───────────────────────────────────────────────────
export function AnnounceIcon({ type }: { type: string }) {
  const cls = 'h-4 w-4 shrink-0';
  if (type === 'call-for-papers') return <Megaphone className={`${cls} text-crimson`} aria-hidden />;
  if (type === 'indexing') return <Award className={`${cls} text-scopus`} aria-hidden />;
  if (type === 'special-issue') return <Newspaper className={`${cls} text-crimson`} aria-hidden />;
  return <CalendarDays className={`${cls} text-zinc-500`} aria-hidden />;
}

// ── DOI link (opens the full research paper) ─────────────────────────────────
export function DoiLink({ doi, articleId, href, external = false, className = '' }: {
  doi: string; articleId: string; href?: string; external?: boolean; className?: string;
}) {
  const resolved = href ?? `#/article/${articleId}`;
  return (
    <a
      href={resolved}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      title="Open the full research paper"
      aria-label={`Open full paper for DOI ${doi}`}
      className={`inline-flex items-center gap-1 break-all font-mono text-[11px] text-crimson transition-colors hover:text-crimson-dark hover:underline ${className}`}
    >
      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
      https://doi.org/{doi}
    </a>
  );
}

// ── Article row (list item used across views) ────────────────────────────────
export function ArticleRow({ article, compact = false }: { article: ArticleListItem; compact?: boolean }) {
  const inPress = article.status === 'in_press';
  return (
    <article className="group border-b border-zinc-200 py-4 last:border-0 sm:py-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <TypeBadge type={inPress ? 'Article in Press' : article.type} />
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          {inPress ? `Forthcoming · Vol ${article.volume}(${article.issue})` : `Vol ${article.volume} · Issue ${article.issue} · pp. ${article.pages}`}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug sm:text-base">
        <a
          href={`#/article/${article.id}`}
          className="text-ink decoration-crimson decoration-2 underline-offset-2 hover:text-crimson hover:underline"
        >
          {article.title}
        </a>
      </h3>
      <p className="mt-1 text-[13px] text-zinc-600">
        {article.authors.map((a, i) => (
          <span key={`${a.id}-${i}`}>
            {a.name}
            {a.isCorresponding ? '*' : ''}
            {i < article.authors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      {!compact && (
        <p className="clamp-2 mt-1.5 text-[13px] leading-relaxed text-zinc-500">{article.abstractText}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
        <SectionTag section={article.section} />
        {!inPress && (
          <>
            <span className="inline-flex items-center gap-1"><Quote className="h-3.5 w-3.5 text-zinc-400" aria-hidden /> {fmtNum(article.citations)} citations</span>
            <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5 text-zinc-400" aria-hidden /> {fmtNum(article.downloads)} downloads</span>
            <DoiLink doi={article.doi} articleId={article.id} className="sm:inline-flex hidden" />
          </>
        )}
      </div>
    </article>
  );
}

// ── Mini article card for sidebars ───────────────────────────────────────────
export function MiniArticle({ article, rank }: { article: ArticleListItem; rank?: number }) {
  return (
    <li className="flex gap-3 border-b border-zinc-100 py-3 last:border-0">
      {rank !== undefined && (
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-crimson-light text-xs font-bold text-crimson">
          {rank}
        </span>
      )}
      <div className="min-w-0">
        <a href={`#/article/${article.id}`} className="clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-crimson hover:underline">
          {article.title}
        </a>
        <div className="mt-1 truncate text-[11px] text-zinc-500">
          {article.authors[0]?.name}{article.authors.length > 1 ? ' et al.' : ''} · {article.year}
        </div>
        <div className="mt-0.5 text-[11px] font-medium text-crimson">
          {fmtNum(article.citations)} citations · {fmtNum(article.downloads)} downloads
        </div>
      </div>
    </li>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────
export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const window = 2;
  const pages: (number | '…')[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= window) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" /> Prev
      </Button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2 text-sm text-zinc-400">…</span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            className="min-w-9"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        ),
      )}
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

// ── Skeletons ────────────────────────────────────────────────────────────────
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-5 py-4" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-zinc-200 pb-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-5 w-4/5" />
          <Skeleton className="mt-2 h-4 w-2/5" />
          <Skeleton className="mt-2 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function BlockSkeleton({ h = 200 }: { h?: number }) {
  return <Skeleton style={{ height: h }} className="w-full" aria-hidden />;
}

// ── Error box ────────────────────────────────────────────────────────────────
export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <FileText className="mx-auto h-8 w-8 text-crimson" aria-hidden />
      <p className="mt-2 font-semibold text-ink">Something went wrong</p>
      <p className="mt-1 text-sm text-zinc-600">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>Try again</Button>
      ) : (
        <Button variant="outline" size="sm" className="mt-4" onClick={() => nav('#/')}>Back to journal home</Button>
      )}
    </div>
  );
}

// ── Abstract snippet expandable ──────────────────────────────────────────────
export function ExpandableAbstract({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p className={`text-[13.5px] leading-relaxed text-zinc-600 ${open ? '' : 'clamp-3'}`}>{text}</p>
      <button
        className="mt-1 text-xs font-semibold text-crimson hover:underline"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {open ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

export function Snippet(s: string, n = 220): string {
  return truncate(s, n);
}
