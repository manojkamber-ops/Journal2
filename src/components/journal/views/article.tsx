'use client';

import { useFetch, fmtNum, fmtDate } from '@/lib/journal-client';
import { ArticleDetail } from '@/lib/journal-types';
import { TypeBadge, ErrorBox, ListSkeleton } from '../bits';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Download, Quote, FileText, Copy, Check, ExternalLink, BookOpen, CalendarDays, Scale, Users,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ArticleView({ id }: { id: string }) {
  const { data: a, loading, error, reload } = useFetch<ArticleDetail>(`/api/articles/${encodeURIComponent(id)}`);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><ListSkeleton rows={7} /></div>;
  }
  if (error || !a) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Article not found'} onRetry={reload} /></div>;

  const inPress = a.status === 'in_press';
  const apaText = `${a.authors.map((x, i) => `${x.name}${i < a.authors.length - 1 ? ', ' : ''}`).join('')} (${a.year}). ${a.title}. Iran Journal of Computer Science, ${a.volume}(${a.issue}), ${a.pages || 'in press'}. https://doi.org/${a.doi}`;

  const copyApa = async () => {
    try {
      await navigator.clipboard.writeText(apaText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Citation copied', description: 'APA 7 citation copied to clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Your browser blocked clipboard access.', variant: 'destructive' });
    }
  };

  const download = (fmt: string) => window.open(`/api/articles/${encodeURIComponent(a.id)}/citation?format=${fmt}`, '_blank');

  // unique affiliations, numbered
  const affMap = new Map<string, number>();
  a.authorDetails.forEach(ad => {
    const key = `${ad.department}, ${ad.affiliation}`;
    if (!affMap.has(key)) affMap.set(key, affMap.size + 1);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`#/issue/V${a.volume}I${a.issue}`}>Volume {a.volume}, Issue {a.issue}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Article</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* ── Main column ── */}
        <article>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TypeBadge type={inPress ? 'Article in Press' : a.type} />
            <a href={`#/articles?section=${encodeURIComponent(a.section)}`} className="text-xs font-semibold text-crimson hover:underline">
              {a.section}
            </a>
          </div>

          <h1 className="wordmark text-2xl font-bold leading-tight text-ink sm:text-3xl">{a.title}</h1>

          {/* Authors */}
          <div className="mt-4">
            <p className="text-[15px] leading-relaxed text-zinc-700">
              {a.authorDetails.map((ad, i) => {
                const affNo = affMap.get(`${ad.department}, ${ad.affiliation}`);
                return (
                  <span key={ad.id} className="whitespace-nowrap">
                    <span className="font-semibold text-ink">{ad.givenName} {ad.familyName}</span>
                    {ad.isCorresponding ? <span className="text-crimson">*</span> : null}
                    <sup className="text-[11px] text-crimson">{affNo}</sup>
                    {i < a.authorDetails.length - 1 ? ', ' : ''}
                  </span>
                );
              })}
            </p>
            <ul className="mt-3 space-y-1 text-[13px] text-zinc-500">
              {[...affMap.entries()].map(([aff, no]) => (
                <li key={no}><sup className="mr-1 text-[11px] text-crimson">{no}</sup>{aff}</li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] text-zinc-500">
              <span className="text-crimson">*</span> Corresponding author:{' '}
              <a className="font-medium text-crimson hover:underline" href={`mailto:${a.correspondingEmail}`}>{a.correspondingEmail}</a>
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
              {a.authorDetails.map(ad => (
                <span key={`o-${ad.id}`} className="inline-flex items-center gap-1 text-zinc-500">
                  <ExternalLink className="h-3 w-3 text-scopus" aria-hidden />
                  <span className="font-mono">ORCID {ad.orcid}</span>
                </span>
              ))}
            </div>
          </div>

          <hr className="my-6 border-zinc-200" />

          {/* Abstract */}
          <section aria-labelledby="abstract-h">
            <h2 id="abstract-h" className="text-lg font-bold text-ink">Abstract</h2>
            <p className="mt-3 text-[15px] leading-7 text-zinc-700">{a.abstractText}</p>
          </section>

          {/* Keywords */}
          <section className="mt-6" aria-label="Keywords">
            <div className="flex flex-wrap gap-2">
              {a.keywords.map(k => (
                <a
                  key={k}
                  href={`#/articles?q=${encodeURIComponent(k)}`}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-crimson/40 hover:bg-crimson-light hover:text-crimson"
                >
                  {k}
                </a>
              ))}
            </div>
          </section>

          {/* Dates + license */}
          <dl className="mt-8 grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-[13px] sm:grid-cols-3">
            <div><dt className="font-semibold text-zinc-500">Received</dt><dd className="text-zinc-700">{fmtDate(a.receivedDate)}</dd></div>
            <div><dt className="font-semibold text-zinc-500">Accepted</dt><dd className="text-zinc-700">{fmtDate(a.acceptedDate)}</dd></div>
            <div><dt className="font-semibold text-zinc-500">Published</dt><dd className="text-zinc-700">{fmtDate(a.publishedDate)}</dd></div>
          </dl>

          {/* References */}
          <section className="mt-8" aria-labelledby="refs-h">
            <h2 id="refs-h" className="text-lg font-bold text-ink">References</h2>
            <p className="mt-1 text-xs text-zinc-400">{a.references.length} references</p>
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="refs">
                <AccordionTrigger className="text-sm font-semibold text-crimson">
                  Show all references ({a.references.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="max-h-96 space-y-3 overflow-y-auto pr-3 text-[13px] leading-relaxed text-zinc-600 scroll-slim">
                    {a.references.map((r, i) => (
                      <li key={i} className="border-b border-zinc-100 pb-3 last:border-0">
                        <span className="mr-1.5 font-semibold text-zinc-400">[{i + 1}]</span>{r}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Cite this article */}
          <section className="mt-8 rounded-lg border border-zinc-200 p-5" aria-labelledby="cite-h">
            <h2 id="cite-h" className="flex items-center gap-2 text-base font-bold text-ink">
              <Quote className="h-4 w-4 text-crimson" aria-hidden /> Cite this article
            </h2>
            <p className="mt-3 rounded bg-zinc-50 p-3 text-[13px] leading-relaxed text-zinc-700">{apaText}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5 border-zinc-300" onClick={copyApa}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />} Copy APA
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 border-zinc-300" onClick={() => download('bibtex')}>BibTeX</Button>
              <Button size="sm" variant="outline" className="gap-1.5 border-zinc-300" onClick={() => download('ris')}>RIS</Button>
              <Button size="sm" variant="outline" className="gap-1.5 border-zinc-300" onClick={() => download('apa')}>APA file</Button>
            </div>
          </section>
        </article>

        {/* ── Sidebar ── */}
        <aside className="space-y-6">
          <section className="rounded-lg border border-zinc-200 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              <FileText className="h-4 w-4 text-crimson" aria-hidden /> Access article
            </h3>
            <a
              href={`/api/articles/${encodeURIComponent(a.id)}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-crimson px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark"
            >
              <Download className="h-4 w-4" aria-hidden /> Download PDF
            </a>
            <p className="mt-2 text-center text-[11px] text-zinc-400">
              Open access · CC BY 4.0 · {a.pdfPages} pages
            </p>
          </section>

          <section className="rounded-lg border border-zinc-200 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              <Quote className="h-4 w-4 text-crimson" aria-hidden /> Article metrics
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-crimson-light p-3 text-center">
                <div className="text-2xl font-bold text-crimson">{fmtNum(a.citations)}</div>
                <div className="text-[11px] text-zinc-500">Citations (Scopus)</div>
              </div>
              <div className="rounded-md bg-scopus-light p-3 text-center">
                <div className="text-2xl font-bold text-scopus">{fmtNum(a.downloads)}</div>
                <div className="text-[11px] text-zinc-500">Downloads</div>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <CalendarDays className="h-3 w-3" aria-hidden /> Metrics since {a.year}
            </p>
          </section>

          <section className="rounded-lg border border-zinc-200 p-5 text-[13px]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Publishing information</h3>
            <dl className="mt-3 space-y-2.5">
              <div>
                <dt className="text-zinc-400">DOI</dt>
                <dd className="break-all font-mono text-[12px] text-crimson">https://doi.org/{a.doi}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Journal</dt>
                <dd className="text-zinc-700">Iran J Comput Sci {a.volume}({a.issue}){a.pages ? `, pp. ${a.pages}` : ''}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">License</dt>
                <dd className="flex items-center gap-1 text-zinc-700"><Scale className="h-3.5 w-3.5 text-zinc-400" aria-hidden /> CC BY 4.0</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Article type</dt>
                <dd className="text-zinc-700">{a.type}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-zinc-200 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              <BookOpen className="h-4 w-4 text-crimson" aria-hidden /> Similar articles
            </h3>
            <ul className="mt-2 divide-y divide-zinc-100">
              {a.similar.map(s => (
                <li key={s.id} className="py-3">
                  <a href={`#/article/${s.id}`} className="clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-crimson hover:underline">
                    {s.title}
                  </a>
                  <p className="mt-1 text-[11px] text-zinc-500">{s.section} · {s.year} · {s.citations} citations</p>
                </li>
              ))}
            </ul>
            <a href={`#/articles?section=${encodeURIComponent(a.section)}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-crimson hover:underline">
              <Users className="h-3 w-3" aria-hidden /> Browse this subject area
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
}
