'use client';

import { useFetch, fmtNum, fmtDate } from '@/lib/journal-client';
import { ArticleDetail, PaperBlock } from '@/lib/journal-types';
import { TypeBadge, ErrorBox, ListSkeleton, DoiLink, OaBadge } from '../bits';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Download, Quote, FileText, Copy, Check, ExternalLink, BookOpen, CalendarDays, Scale, Users, ListTree,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useState } from 'react';

// ── Full-paper block renderer ─────────────────────────────────────────────────
function PaperBlocks({ blocks }: { blocks: PaperBlock[] }) {
  const h2Index = new Map<string, number>();
  let h2n = 0;
  for (const b of blocks) if (b.kind === 'h2') h2Index.set(b.text, ++h2n);

  return (
    <div className="paper-body">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h2':
            return (
              <h2
                key={i}
                id={`sec-${h2Index.get(b.text)}`}
                className="mt-10 scroll-mt-28 border-b-2 border-crimson pb-1.5 text-xl font-bold text-ink first:mt-2"
              >
                {b.text}
              </h2>
            );
          case 'h3':
            return <h3 key={i} className="mt-7 scroll-mt-28 text-[16px] font-bold text-ink">{b.text}</h3>;
          case 'p':
            return <p key={i} className="mt-4 text-justify text-[15px] leading-7 text-zinc-700">{b.text}</p>;
          case 'list':
            return b.ordered ? (
              <ol key={i} className="mt-4 list-decimal space-y-2 pl-7 text-[14.5px] leading-7 text-zinc-700">
                {b.items.map((it, j) => <li key={j} className="pl-1">{it}</li>)}
              </ol>
            ) : (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-7 text-[14.5px] leading-7 text-zinc-700">
                {b.items.map((it, j) => <li key={j} className="pl-1">{it}</li>)}
              </ul>
            );
          case 'eq':
            return (
              <div key={i} className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 rounded bg-zinc-50 px-4 py-3">
                <span className="break-words font-serif text-[15px] italic text-ink">{b.text}</span>
                {b.label ? <span className="text-sm text-zinc-400">{b.label}</span> : null}
              </div>
            );
          case 'table':
            return (
              <figure key={i} className="mt-7">
                <figcaption className="mb-2 text-[13px] font-bold text-ink">{b.caption}</figcaption>
                <div className="overflow-x-auto rounded border border-zinc-300">
                  <table className="w-full border-collapse text-left text-[12.5px]">
                    <thead>
                      <tr className="bg-zinc-100">
                        {b.headers.map((h, j) => (
                          <th key={j} className="border-b border-zinc-300 px-3 py-2 font-bold text-ink">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, j) => (
                        <tr key={j} className="even:bg-zinc-50/60">
                          {row.map((c, k) => (
                            <td key={k} className="border-b border-zinc-100 px-3 py-2 align-top text-zinc-700">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.note ? <p className="mt-1.5 text-xs italic text-zinc-500">{b.note}</p> : null}
              </figure>
            );
          case 'fig':
            return (
              <figure key={i} className="mt-7">
                <div className="flex h-40 items-center justify-center rounded border border-zinc-300 bg-zinc-50">
                  <div className="flex items-center gap-4 text-zinc-400" aria-hidden>
                    <span className="rounded border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-500">Input</span>
                    <span className="h-px w-10 bg-zinc-300" />
                    <span className="rounded border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-500">Model</span>
                    <span className="h-px w-10 bg-zinc-300" />
                    <span className="rounded border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-500">Output</span>
                  </div>
                </div>
                <figcaption className="mt-2 text-[13px] italic text-zinc-600">{b.caption}</figcaption>
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export function ArticleView({ id }: { id: string }) {
  const { data: a, loading, error, reload } = useFetch<ArticleDetail>(`/api/articles/${encodeURIComponent(id)}`);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const sections = useMemo(() => {
    if (!a?.fullText) return [] as { text: string; idx: number }[];
    const out: { text: string; idx: number }[] = [];
    a.fullText.forEach((b, i) => { if (b.kind === 'h2') out.push({ text: b.text, idx: out.length + 1 }); });
    return out;
  }, [a]);

  const scrollTo = (idx: number) => {
    document.getElementById(`sec-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><ListSkeleton rows={7} /></div>;
  }
  if (error || !a) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Article not found'} onRetry={reload} /></div>;

  const inPress = a.status === 'in_press';
  const apaText = `${a.authors.map((x, i) => `${x.name}${i < a.authors.length - 1 ? ', ' : ''}`).join('')} (${a.year}). ${a.title}. Iran Journal of Computer Science, ${a.volume}(${a.issue}), ${a.pages || 'in press'}. https://doi.org/${a.doi}`;
  const words = a.fullText
    ? a.fullText.reduce((n, b) => n + (b.kind === 'p' ? b.text.split(/\s+/).length : b.kind === 'list' ? b.items.join(' ').split(/\s+/).length : 0), 0)
    : 0;
  const readMin = Math.max(1, Math.round(words / 220));

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

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ── Main column ── */}
        <article className="min-w-0">
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
                  <span key={ad.id}>
                    <span className="whitespace-nowrap">
                      <span className="font-semibold text-ink">{ad.givenName} {ad.familyName}</span>
                      {ad.isCorresponding ? <span className="text-crimson">*</span> : null}
                      <sup className="text-[11px] text-crimson">{affNo}</sup>
                    </span>
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

          {/* DOI + access bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-crimson/20 bg-crimson-light/50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <FileText className="h-3.5 w-3.5 text-crimson" aria-hidden /> DOI:
                <DoiLink doi={a.doi} articleId={a.id} href={`/api/articles/${encodeURIComponent(a.id)}/pdf`} external className="!text-[12px]" />
              </span>
              <span className="text-zinc-500">{a.pdfPages} pages · ~{readMin} min read</span>
              <OaBadge />
            </div>
            <a
              href={`/api/articles/${encodeURIComponent(a.id)}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-crimson px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-crimson-dark"
            >
              <Download className="h-3.5 w-3.5" aria-hidden /> Full text PDF
            </a>
          </div>

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

          {/* ── Full paper body ── */}
          {a.fullText && a.fullText.length > 0 && (
            <section className="mt-8" aria-label="Full text">
              <h2 className="sr-only">Full text</h2>
              <PaperBlocks blocks={a.fullText} />
            </section>
          )}

          {/* References */}
          <section className="mt-10" aria-labelledby="refs-h">
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
            <div className="mt-3 flex justify-center">
              <OaBadge />
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-400">
              CC BY 4.0 · {a.pdfPages} pages
            </p>
          </section>

          {sections.length > 2 && (
            <section className="rounded-lg border border-zinc-200 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
                <ListTree className="h-4 w-4 text-crimson" aria-hidden /> On this page
              </h3>
              <nav aria-label="Article sections" className="mt-3 space-y-1.5">
                {sections.map(s => (
                  <button
                    key={s.idx}
                    onClick={() => scrollTo(s.idx)}
                    className="block w-full truncate text-left text-[12.5px] text-zinc-600 transition-colors hover:text-crimson"
                  >
                    {s.text}
                  </button>
                ))}
              </nav>
            </section>
          )}

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
                <dd className="break-all"><DoiLink doi={a.doi} articleId={a.id} href={`/api/articles/${encodeURIComponent(a.id)}/pdf`} external className="!text-[12px]" /></dd>
              </div>
              <div>
                <dt className="text-zinc-400">Journal</dt>
                <dd className="text-zinc-700">Iran J Comput Sci {a.volume}({a.issue}){a.pages ? `, pp. ${a.pages}` : ''}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Indexed in</dt>
                <dd className="flex items-center gap-1 text-zinc-700">
                  <span className="inline-flex items-center gap-1 rounded bg-scopus/90 px-1.5 py-0.5 text-[10px] font-bold text-white">Scopus</span>
                  2018–2026
                </dd>
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
