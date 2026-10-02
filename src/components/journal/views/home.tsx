'use client';

import { useFetch, fmtNum, fmtDate } from '@/lib/journal-client';
import type { JournalOverview } from '@/lib/journal-types';
import {
  SectionHeading, ArticleRow, MiniArticle, MetricTile, AnnounceIcon,
  ListSkeleton, BlockSkeleton, ErrorBox, IndexBadge,
} from '../bits';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Upload, TrendingUp, Globe, Users, FileText, Download } from 'lucide-react';

export function HomeView() {
  const { data, loading, error, reload } = useFetch<JournalOverview>('/api/journal');
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <BlockSkeleton h={260} />
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2"><ListSkeleton rows={6} /></div>
          <div><BlockSkeleton h={400} /></div>
        </div>
      </div>
    );
  }
  if (error || !data) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Unknown error'} onRetry={reload} /></div>;

  const m = data.metrics;
  const li = data.latestIssue;
  const maxHistory = Math.max(...m.citeScoreHistory.map(h => h.value));

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-crimson-light/70 to-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-crimson">Journal Home</p>
            <h2 className="wordmark mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Advancing computing research from Iran to the world
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
              The <strong>Iran Journal of Computer Science (IJCS)</strong> publishes peer-reviewed research across
              artificial intelligence, computer vision, networks and security, software engineering, and data science.
              Since 2018 the journal has been covered in <strong>Scopus</strong>, offering rapid review (median 38 days
              to first decision), continuous open access under CC&nbsp;BY&nbsp;4.0, and worldwide discoverability through
              major indexing databases.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <IndexBadge name="Scopus (2018–2026)" />
              <IndexBadge name="Web of Science ESCI" />
              <IndexBadge name="DOAJ" />
              <IndexBadge name="Google Scholar" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href={`#/issue/${li?.id ?? ''}`}>Browse current issue <ArrowRight className="h-4 w-4" aria-hidden /></a>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-zinc-300">
                <a href="#/for-authors"><Upload className="h-4 w-4" aria-hidden /> Submit your manuscript</a>
              </Button>
            </div>
          </div>

          {/* Metrics panel */}
          <aside className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Journal metrics · 2025</h3>
            <div className="mt-3 flex items-end gap-3">
              <div className="text-5xl font-bold text-scopus">{m.citeScore.toFixed(1)}</div>
              <div className="pb-1.5">
                <div className="text-sm font-bold text-ink">CiteScore (Scopus)</div>
                <div className="text-xs text-zinc-500">{m.quartile} · {m.percentile}th percentile · CS Applications</div>
              </div>
            </div>
            {/* CiteScore history bars */}
            <div className="mt-4 flex h-20 items-end gap-2" role="img" aria-label="CiteScore history from 2020 to 2025 rising from 1.2 to 4.6">
              {m.citeScoreHistory.map(h => (
                <div key={h.year} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-zinc-500">{h.value}</span>
                  <div
                    className="w-full rounded-t bg-scopus/80"
                    style={{ height: `${Math.max(8, (h.value / maxHistory) * 52)}px` }}
                  />
                  <span className="text-[10px] text-zinc-400">{h.year}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MetricTile label="SJR 2024" value={m.sjr.toFixed(2)} sub="Q2" />
              <MetricTile label="SNIP" value={m.snip.toFixed(2)} sub="Source-normalized" />
              <MetricTile label="h-index" value={m.hIndex} sub="Scopus" />
              <MetricTile label="Downloads" value="148K" sub="in 2025" accent />
            </div>
          </aside>
        </div>
      </section>

      {/* ── Current issue + sidebar ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading
              title={li ? `Current issue — Volume ${li.volume}, Issue ${li.issue} (${li.month} ${li.year})` : 'Latest articles'}
              sub={li?.theme || 'Peer-reviewed articles published in the most recent issue'}
              action={<Button asChild variant="outline" size="sm" className="border-zinc-300 gap-1.5"><a href="#/issues">View all issues<ArrowRight className="h-3.5 w-3.5" aria-hidden /></a></Button>}
            />
            <div>
              {data.latestArticles.map(a => <ArticleRow key={a.id} article={a} />)}
            </div>
            <Button asChild variant="outline" className="mt-5 border-zinc-300">
              <a href={`#/issue/${li?.id ?? ''}`}>Show all articles in this issue <ArrowRight className="h-4 w-4" aria-hidden /></a>
            </Button>
          </div>

          <aside className="space-y-8">
            {/* Just accepted */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-600">
                <TrendingUp className="h-4 w-4 text-crimson" aria-hidden /> Just accepted
              </h3>
              <ul className="mt-2">
                {data.justAccepted.map(a => <MiniArticle key={a.id} article={a} />)}
              </ul>
              <p className="mt-3 text-[11px] text-zinc-400">Accepted manuscripts awaiting copy-editing and assignment to an issue.</p>
            </section>

            {/* Announcements */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-600">Announcements</h3>
              <ul className="mt-3 space-y-4">
                {data.announcements.slice(0, 4).map(a => (
                  <li key={a.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <AnnounceIcon type={a.type} />
                      <time dateTime={a.date}>{fmtDate(a.date)}</time>
                    </div>
                    <p className="mt-1 text-[13.5px] font-semibold leading-snug text-ink">{a.title}</p>
                    <p className="clamp-2 mt-1 text-xs leading-relaxed text-zinc-500">{a.body}</p>
                  </li>
                ))}
              </ul>
              <a href="#/about" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-crimson hover:underline">
                Journal news &amp; indexing <ArrowRight className="h-3 w-3" aria-hidden />
              </a>
            </section>

            {/* For authors CTA */}
            <section className="rounded-xl bg-inkbar p-5 text-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">For authors</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-300">
                Submit your next paper to IJCS. APC waivers available for low-income countries;
                median 38 days to first decision.
              </p>
              <Button asChild size="sm" className="mt-4 w-full gap-1.5">
                <a href="#/for-authors">Read submission guidelines <ArrowRight className="h-3.5 w-3.5" aria-hidden /></a>
              </Button>
            </section>
          </aside>
        </div>
      </section>

      {/* ── Most cited / most downloaded ─────────────────── */}
      <section className="border-y border-zinc-200 bg-zinc-50/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading title="Most cited" sub="All-time citation leaders in Scopus" />
            <ul className="rounded-xl border border-zinc-200 bg-white px-5 py-2">
              {data.mostCited.map((a, i) => <MiniArticle key={a.id} article={a} rank={i + 1} />)}
            </ul>
            <a href="#/articles?sort=cited" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-crimson hover:underline">
              See all highly cited articles <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
          <div>
            <SectionHeading title="Most downloaded" sub="Full-text downloads, all time" />
            <ul className="rounded-xl border border-zinc-200 bg-white px-5 py-2">
              {data.mostDownloaded.map((a, i) => <MiniArticle key={a.id} article={a} rank={i + 1} />)}
            </ul>
            <a href="#/articles?sort=downloaded" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-crimson hover:underline">
              See all top downloads <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────── */}
      <section className="bg-inkbar text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center sm:px-6 lg:grid-cols-5">
          {[
            { icon: FileText, label: 'Articles published', value: fmtNum(data.stats.totalArticles) },
            { icon: Users, label: 'Authors', value: fmtNum(data.stats.totalAuthors) },
            { icon: BookOpen, label: 'Issues (2018–2026)', value: fmtNum(data.stats.totalIssues) },
            { icon: Globe, label: 'Countries', value: fmtNum(data.stats.totalCountries) },
            { icon: Download, label: 'Total downloads', value: fmtNum(data.stats.totalDownloads) },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <s.icon className="h-5 w-5 text-scopus" aria-hidden />
              <span className="text-2xl font-bold sm:text-3xl">{s.value}</span>
              <span className="text-[11px] uppercase tracking-wider text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subject areas ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeading title="Explore by subject area" sub="Click an area to browse its articles" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.sections.map(s => (
            <a
              key={s.name}
              href={`#/articles?section=${encodeURIComponent(s.name)}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-crimson/40 hover:shadow-md"
            >
              <span className="text-[13.5px] font-semibold leading-snug text-ink group-hover:text-crimson">{s.name}</span>
              <span className="shrink-0 rounded-full bg-crimson-light px-2.5 py-1 text-xs font-bold text-crimson">{s.count}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
