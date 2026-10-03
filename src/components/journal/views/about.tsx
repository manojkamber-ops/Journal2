'use client';

import { useFetch } from '@/lib/journal-client';
import type { JournalOverview } from '@/lib/journal-types';
import { ErrorBox, BlockSkeleton, IndexBadge, OaBadge } from '../bits';
import { BookOpen, Landmark, FileText, Globe2, ScrollText, ShieldCheck } from 'lucide-react';

const H2 = ({ id, children }: { id: string; children: string }) => (
  <h2 id={id} className="scroll-mt-24 border-b border-zinc-200 pb-2 text-xl font-bold text-ink">{children}</h2>
);

export function AboutView() {
  const { data, loading, error, reload } = useFetch<JournalOverview>('/api/journal');

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><BlockSkeleton h={500} /></div>;
  if (error || !data) return <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Failed to load'} onRetry={reload} /></div>;

  const m = data.metrics;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="border-b-2 border-crimson pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-crimson">About the journal</p>
          <OaBadge />
        </div>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">Iran Journal of Computer Science</h1>
      </header>

      <div className="mt-8 space-y-10">
        {/* Aims & scope */}
        <section>
          <H2 id="scope">Aims &amp; scope</H2>
          <div className="mt-3 space-y-4 text-[14px] leading-relaxed text-zinc-600">
            <p>
              The <strong>Iran Journal of Computer Science (IJCS)</strong> is a quarterly, international,
              peer-reviewed, fully open-access journal that publishes original research, reviews, short
              communications, and technical notes across the breadth of computer science. The journal seeks
              rigorous work with a clear scientific contribution — new methods, sound theoretical results,
              well-designed empirical studies, and reusable artifacts such as datasets, benchmarks, and tools.
            </p>
            <p>
              Subject coverage includes, but is not limited to: artificial intelligence and machine learning;
              computer vision and pattern recognition; data science and big data analytics; computer networks
              and security; software engineering and systems; natural language processing (with a sustained
              interest in low-resource languages, including Persian); the Internet of Things and embedded
              systems; cloud and distributed computing; human–computer interaction; theoretical computer
              science; and health informatics and bioinformatics.
            </p>
            <p>
              The journal particularly welcomes contributions that address challenges relevant to developing
              economies and resource-constrained environments, and interdisciplinary work that connects
              computing with the natural sciences, engineering, and medicine. Every submission is screened for
              plagiarism and reviewed in a double-anonymous process by at least two independent experts.
            </p>
          </div>
        </section>

        {/* Journal information */}
        <section>
          <H2 id="info">Journal information</H2>
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 rounded-lg border border-zinc-200 bg-white p-5 text-[13.5px] sm:grid-cols-2">
            {[
              ['Print ISSN', '2520-8438'],
              ['Electronic ISSN', '2520-8446'],
              ['Indexing', 'Indexed in: Scopus (2018–2026)'],
              ['Founded', '2018'],
              ['Frequency', 'Quarterly (March, June, September, December)'],
              ['Source type', 'Journal (Scopus) — covered from Vol. 1 (2018) to Vol. 9 (2026)'],
              ['Subject areas (Scopus)', 'Computer Science Applications; Computer Science (miscellaneous)'],
              ['Open access model', 'Gold OA, CC BY 4.0, APC after acceptance'],
              ['Review model', 'Double-anonymous peer review'],
              ['Submission language', 'English'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 border-b border-zinc-100 py-1.5 last:border-0 sm:border-0">
                <dt className="w-44 shrink-0 font-semibold text-zinc-500">{k}</dt>
                <dd className="text-zinc-700">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Metrics */}
        <section>
          <H2 id="metrics">Metrics</H2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-scopus/30 bg-scopus-light p-4">
              <div className="text-3xl font-bold text-scopus">{m.citeScore.toFixed(1)}</div>
              <div className="mt-1 text-xs font-semibold text-zinc-600">CiteScore 2025</div>
              <div className="text-[11px] text-zinc-500">Scopus</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="text-3xl font-bold text-ink">{m.sjr.toFixed(2)}</div>
              <div className="mt-1 text-xs font-semibold text-zinc-600">SJR 2024</div>
              <div className="text-[11px] text-zinc-500">{m.quartile}, {m.percentile}th percentile</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="text-3xl font-bold text-ink">{m.snip.toFixed(2)}</div>
              <div className="mt-1 text-xs font-semibold text-zinc-600">SNIP</div>
              <div className="text-[11px] text-zinc-500">Source-normalized impact</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="text-3xl font-bold text-ink">{m.hIndex}</div>
              <div className="mt-1 text-xs font-semibold text-zinc-600">h-index</div>
              <div className="text-[11px] text-zinc-500">Scopus, all years</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
              <div className="text-xl font-bold text-crimson">{m.acceptanceRate}</div>
              <div className="text-[11px] text-zinc-500">Acceptance rate (2025)</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
              <div className="text-xl font-bold text-crimson">{m.daysToFirstDecision} days</div>
              <div className="text-[11px] text-zinc-500">Median to first decision</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
              <div className="text-xl font-bold text-crimson">18 days</div>
              <div className="text-[11px] text-zinc-500">Acceptance → online</div>
            </div>
          </div>
        </section>

        {/* Indexing */}
        <section>
          <H2 id="indexing">Abstracting &amp; indexing</H2>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Scopus (2018–2026)', 'Web of Science ESCI', 'DOAJ', 'Google Scholar', 'EBSCO', 'ProQuest', 'CNKI', 'Dimensions'].map(name => (
              <IndexBadge key={name} name={name} />
            ))}
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-500">
            Content is archived with CLOCKSS and PORTICO for permanent preservation; DOIs are registered with
            Crossref and all references are deposited for citation tracking.
          </p>
        </section>

        {/* History timeline */}
        <section>
          <H2 id="history">History</H2>
          <ol className="mt-4 space-y-0 border-l-2 border-crimson/30 pl-6">
            {[
              { year: '2018', text: 'Journal founded; Volume 1 published with quarterly issues. Indexed in Scopus from the first volume.' },
              { year: '2020', text: 'First official CiteScore (1.2). Author base expands to 30+ countries.' },
              { year: '2021', text: 'All back content digitized with DOIs; journal joins DOAJ.' },
              { year: '2023', text: 'APC waiver program introduced for low-income countries.' },
              { year: '2024', text: 'Accepted for Web of Science ESCI; CiteScore reaches 3.9 (Q2).' },
              { year: '2026', text: 'CiteScore 4.6; 148,000 annual downloads; Scopus coverage continues uninterrupted through Volume 9.' },
            ].map(t => (
              <li key={t.year} className="relative pb-6 last:pb-0">
                <span className="absolute -left-[31px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-crimson bg-white" aria-hidden />
                <span className="text-sm font-bold text-crimson">{t.year}</span>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-zinc-600">{t.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Policies */}
        <section>
          <H2 id="policies">Editorial policies</H2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {[
              { icon: ScrollText, title: 'Publication ethics', body: 'The journal follows COPE guidelines; misconduct leads to rejection, retraction, and notification of institutions.' },
              { icon: ShieldCheck, title: 'Peer review integrity', body: 'Double-anonymous review with at least two independent referees; editorial decisions are appealable within 30 days.' },
              { icon: Globe2, title: 'Open access & licensing', body: 'Gold open access under CC BY 4.0. Authors retain copyright; no embargo periods apply to any content.' },
              { icon: Landmark, title: 'Ownership & management', body: 'The journal title and editorial process are managed by the IJCS Editorial Office, with worldwide discoverability ensured through Scopus, Web of Science, and DOAJ indexing.' },
              { icon: BookOpen, title: 'Archiving', body: 'CLOCKSS and PORTICO preservation; self-archiving of accepted versions is permitted without embargo.' },
              { icon: FileText, title: 'Authorship', body: 'Authorship follows ICMJE criteria; AI tools cannot be authors; all listed authors must approve the final version.' },
            ].map(p => (
              <div key={p.title} className="rounded-lg border border-zinc-200 bg-white p-4">
                <p.icon className="h-5 w-5 text-crimson" aria-hidden />
                <h3 className="mt-2 text-sm font-bold text-ink">{p.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
