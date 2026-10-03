'use client';

import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Upload, CheckCircle2, Clock, ShieldCheck, Coins, FileCheck2, Users } from 'lucide-react';
import { OaBadge } from '../bits';

function H2({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="scroll-mt-24 border-b border-zinc-200 pb-2 text-xl font-bold text-ink">
      {children}
    </h2>
  );
}

export function AuthorsView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="border-b-2 border-crimson pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-crimson">Author resources</p>
          <OaBadge />
        </div>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">Submission Guidelines</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-500">
          Thank you for considering the Iran Journal of Computer Science. Before submitting, please read these
          guidelines carefully — manuscripts that do not conform are returned to authors before review.
          The journal operates a double-anonymous peer review, publishes quarterly, and accepts submissions in English only.
        </p>
        <Button asChild className="mt-4 gap-2">
          <a href="#/contact"><Upload className="h-4 w-4" aria-hidden /> Start a submission</a>
        </Button>
      </header>

      <div className="mt-8 space-y-10">
        {/* Article types */}
        <section>
          <H2 id="types">1. Article types and length limits</H2>
          <p className="mt-3 text-[14px] leading-relaxed text-zinc-600">
            The journal accepts four article types. Length limits exclude references and tables, and may be
            exceeded by up to 10% after consultation with the handling editor. Word counts are enforced by the
            editorial office at initial quality check.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50">
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Length</TableHead>
                  <TableHead className="font-semibold">Abstract</TableHead>
                  <TableHead className="font-semibold">References</TableHead>
                  <TableHead className="font-semibold">Typical scope</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Research Article</TableCell>
                  <TableCell>6,000–9,000 words</TableCell>
                  <TableCell>150–250 words</TableCell>
                  <TableCell>≤ 40</TableCell>
                  <TableCell>Original research with a complete evaluation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Review Article</TableCell>
                  <TableCell>8,000–12,000 words</TableCell>
                  <TableCell>200–300 words</TableCell>
                  <TableCell>≤ 120</TableCell>
                  <TableCell>Systematic reviews and surveys of emerging areas</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Short Communication</TableCell>
                  <TableCell>2,500–3,500 words</TableCell>
                  <TableCell>≤ 150 words</TableCell>
                  <TableCell>≤ 20</TableCell>
                  <TableCell>Preliminary but significant findings</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Technical Note</TableCell>
                  <TableCell>2,000–3,000 words</TableCell>
                  <TableCell>≤ 150 words</TableCell>
                  <TableCell>≤ 15</TableCell>
                  <TableCell>Datasets, tools, benchmarks, and reproducibility artifacts</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Manuscript preparation */}
        <section>
          <H2 id="prep">2. Manuscript preparation</H2>
          <div className="mt-3 space-y-4 text-[14px] leading-relaxed text-zinc-600">
            <p>
              Manuscripts must be written in clear, grammatical English and prepared in the journal&apos;s LaTeX or
              Word template. The submission file should contain a title page (title, all authors with affiliations
              and ORCID iDs, corresponding author marked with an asterisk), an unstructured abstract, 4–7 keywords,
              and the main text organized as Introduction, Related Work, Methodology, Experimental Setup, Results
              and Discussion, and Conclusion. Number figures and tables consecutively and cite every one of them in the text.
            </p>
            <p>
              All figures must be legible at print size (minimum 300&nbsp;dpi for raster images; vector formats
              preferred for charts). Colour use is free of charge in the online edition. Mathematical content
              should be typeset consistently; define every abbreviation at first use. Code and datasets underlying
              the results should be deposited in a public repository (e.g., Zenodo, GitHub) and cited in the
              reference list with a persistent identifier, unless privacy or ethical constraints apply.
            </p>
            <p>
              References must follow APA 7 style. Cite works actually consulted; citation-stuffing — including
              coordinated self-citation — is treated as a breach of publication ethics. Where a cited work is
              indexed, include the DOI as a URL. The journal recommends that authors cite the underlying
              datasets used for evaluation and declare any software dependencies in a reproducibility appendix.
            </p>
          </div>
        </section>

        {/* Peer review */}
        <section>
          <H2 id="review">3. Peer review process</H2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FileCheck2, title: '1 · Quality check', body: 'Editorial office screens scope, formatting, and plagiarism (iThenticate) — 3 working days.' },
              { icon: Users, title: '2 · Editor assignment', body: 'A suitable Associate Editor assesses the manuscript and invites 2–3 independent reviewers.' },
              { icon: Clock, title: '3 · Review', body: 'Double-anonymous review; reviewers return reports in ~30 days. Median time to first decision: 38 days.' },
              { icon: CheckCircle2, title: '4 · Decision', body: 'Accept, minor or major revision, or reject. Revised manuscripts are re-reviewed before acceptance.' },
            ].map(s => (
              <div key={s.title} className="rounded-lg border border-zinc-200 bg-white p-4">
                <s.icon className="h-5 w-5 text-crimson" aria-hidden />
                <h3 className="mt-2 text-sm font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-zinc-500">
            The journal operates double-anonymously: anonymize your manuscript (no author names in headers, file
            properties, or self-citations such as &quot;our previous work [12]&quot;) and provide the full author list
            only in the submission system. Appeals against editorial decisions must be submitted within 30 days
            with a point-by-point response.
          </p>
        </section>

        {/* Ethics */}
        <section>
          <H2 id="ethics">4. Ethics and publication policies</H2>
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="cope">
              <AccordionTrigger className="text-sm font-semibold">Publishing ethics (COPE)</AccordionTrigger>
              <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
                IJCS is a member of the Committee on Publication Ethics and follows its flowcharts for handling
                misconduct. Plagiarism, data fabrication, redundant publication, and undeclared conflicts of
                interest lead to rejection or retraction. Retracted articles remain online, watermarked, and
                linked to the retraction notice for the permanent scholarly record.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ai">
              <AccordionTrigger className="text-sm font-semibold">Use of generative AI tools</AccordionTrigger>
              <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
                Authors may use generative AI tools to improve readability and language, but remain fully
                responsible for all content. AI tools do not qualify for authorship. Any use must be disclosed
                in a dedicated statement (tool, version, purpose) placed before the reference list. Reviewers
                must not upload manuscripts to AI services.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="human">
              <AccordionTrigger className="text-sm font-semibold">Human participants and data protection</AccordionTrigger>
              <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
                Research involving human participants or personal data requires approval from the authors&apos;
                institutional review board, stated in the Methods section. Personal data must be anonymized or
                pseudonymized; informed consent for publication of identifiable material must be obtained and
                available on request. Studies on public datasets must document the source and license.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="diversity">
              <AccordionTrigger className="text-sm font-semibold">Inclusive language and citation equity</AccordionTrigger>
              <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
                The journal asks authors to use inclusive language free of bias with respect to gender, ability,
                ethnicity, and geography. Reviewers are encouraged to flag reference lists that omit relevant
                regional scholarship; the journal actively indexes work from the Global South.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Costs */}
        <section>
          <H2 id="costs">5. Open access and article processing charge</H2>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <Coins className="h-5 w-5 text-scopus" aria-hidden />
              <h3 className="mt-2 font-bold text-ink">Article Processing Charge (APC)</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">
                IJCS is fully open access. Accepted articles pay an APC of <strong>USD 1,090</strong>, covering
                professional copy-editing, typesetting, DOI registration, and permanent hosting. There are no
                submission fees, page limits charges, or colour charges, and the APC is due only after acceptance.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
              <h3 className="mt-2 font-bold text-ink">Waivers and licensing</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">
                Full APC waivers are granted automatically to corresponding authors in World Bank low-income
                countries, and discretionary discounts up to 100% are available on request. All articles are
                published under <strong>CC BY 4.0</strong>; authors retain copyright without restrictions.
              </p>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section>
          <H2 id="checklist">6. Pre-submission checklist</H2>
          <ul className="mt-3 grid gap-2.5 text-[13.5px] text-zinc-600 sm:grid-cols-2">
            {[
              'Manuscript anonymized for double-anonymous review',
              'Title page with authors, affiliations, ORCID iDs, corresponding author',
              'Abstract within the word limit; 4–7 keywords',
              'Figures ≥ 300 dpi; tables editable, not embedded as images',
              'References in APA 7 with DOIs where available',
              'Data and code availability statement included',
              'Conflict of interest and funding statements included',
              'AI-use disclosure (if applicable) included',
              'Ethics approval described for human/animal data',
              'All authors approved the final manuscript and submission',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 rounded border border-zinc-200 bg-white px-3 py-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg bg-inkbar p-6 text-white">
            <h3 className="text-lg font-bold">Ready to submit?</h3>
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-zinc-300">
              Send your manuscript and accompanying documents to the editorial office. You will receive an
              acknowledgement within one working day and a first decision typically within six weeks.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-4 gap-2">
              <a href="mailto:submissions@ijcs.ir"><Upload className="h-3.5 w-3.5" aria-hidden /> submissions@ijcs.ir</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
