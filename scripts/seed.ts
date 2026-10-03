// ─────────────────────────────────────────────────────────────────────────────
// Deterministic seed generator for the Iran Journal of Computer Science.
// Run: bun scripts/seed.ts
// Generates 9 volumes (2018–2026), quarterly issues, ~250 fictional articles,
// a reusable author pool, editorial board, and announcements.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import type { PaperBlock } from '../src/lib/journal-types';
import {
  IR_MALE, IR_FEMALE, IR_FAMILY, IR_INSTITUTIONS, INTERNATIONAL, SECTIONS,
  KEYWORDS, TASKS, METHODS, DATASETS, REF_VENUES, REF_FIRST, REF_LAST,
  ANNOUNCEMENTS, BOARD, SPECIAL_ISSUES, JOURNAL,
} from './seed-data';
import { generateFullPaper, estimatePdfPages } from './paper-text';
import { buildPaperPdf } from '../src/lib/pdf-render';
import { fp0, fp1, fp2, fp3, fp4, fp5, fp6, fp7, fp8 } from './flagship/index';
import type { FlagshipPaper } from './flagship/index';

// Hand-written complete papers placed in the latest published issue (Vol. 9, No. 3).
// fp0 is the UPLOADED author manuscript (upload/Researchpaper.docx) and MUST be the
// first element: within an issue, generation order == page order == display order.
const FLAGSHIPS: FlagshipPaper[] = [fp0, fp1, fp2, fp3, fp4, fp5, fp6, fp7, fp8];

// Fixed author IDs for the uploaded manuscript's real authors.
const UPLOAD_AUTHOR_IDS = (fp0.authors ?? []).map((_, i) => `A9${String(i + 1).padStart(3, '0')}`);

const db = new PrismaClient();

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260419);
const R = () => rnd();
const pick = <T,>(arr: T[]): T => arr[Math.floor(R() * arr.length)];
const rint = (min: number, max: number) => Math.floor(R() * (max - min + 1)) + min;
const chance = (p: number) => R() < p;
function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let v = R() * total;
  for (let i = 0; i < items.length; i++) {
    v -= weights[i];
    if (v <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ── Section weights (AI-heavy, like a modern CS journal) ─────────────────────
const SECTION_WEIGHTS: number[] = [
  20, 13, 10, 12, 9, 8, 9, 6, 5, 4, 6, // sums to 102
];

const MONTHS = ['March', 'June', 'September', 'December'];
const MONTH_NUM: Record<string, number> = { March: 3, June: 6, September: 9, December: 12 };

// ── Authors pool ─────────────────────────────────────────────────────────────
interface PoolAuthor {
  id: string; givenName: string; familyName: string; orcid: string;
  affiliation: string; department: string; country: string; email: string;
}
const authorPool: PoolAuthor[] = [];

function buildAuthorPool() {
  const used = new Set<string>();
  let n = 0;
  // Iranian authors
  for (let i = 0; i < 470; i++) {
    let given = chance(0.52) ? pick(IR_MALE) : pick(IR_FEMALE);
    let family = pick(IR_FAMILY);
    let key = `${given} ${family}`;
    let guard = 0;
    while (used.has(key) && guard++ < 30) { given = chance(0.52) ? pick(IR_MALE) : pick(IR_FEMALE); family = pick(IR_FAMILY); key = `${given} ${family}`; }
    if (used.has(key)) continue;
    used.add(key);
    const inst = pick(IR_INSTITUTIONS);
    const orcid = `0000-000${rint(1, 3)}-${rint(1000, 9999)}-${rint(1000, 9999)}`;
    authorPool.push({
      id: `A${String(++n).padStart(4, '0')}`,
      givenName: given, familyName: family, orcid,
      affiliation: `${inst.uni}, ${inst.city}, Iran`,
      department: inst.dept,
      country: 'Iran',
      email: `${given.toLowerCase()}.${family.toLowerCase().replace(/[^a-z]/g, '')}@${inst.domain}`,
    });
  }
  // International authors (some repeated roles)
  for (const p of INTERNATIONAL) {
    for (let k = 0; k < 2; k++) {
      const orcid = `0000-000${rint(1, 3)}-${rint(1000, 9999)}-${rint(1000, 9999)}`;
      const g = k === 0 ? p.given : `${p.given} ${pick(['A.', 'R.', 'M.', 'K.', 'H.'])}`;
      authorPool.push({
        id: `A${String(++n).padStart(4, '0')}`,
        givenName: g, familyName: p.family, orcid,
        affiliation: `${p.uni}, ${p.country}`,
        department: p.dept,
        country: p.country,
        email: `${p.given.toLowerCase().replace(/[^a-z]/g, '')}.${p.family.toLowerCase().replace(/[^a-z]/g, '')}${k}@${p.domain}`,
      });
    }
  }
  // prolific marker
}
buildAuthorPool();
// Prolific subset: authors who publish more often
const prolific = authorPool.filter((_, i) => i % 7 === 0);
const iranians = authorPool.filter(a => a.country === 'Iran');
const internationals = authorPool.filter(a => a.country !== 'Iran');

function pickAuthor(): PoolAuthor {
  if (chance(0.12) && internationals.length) return pick(internationals);
  if (chance(0.42)) return pick(prolific.filter(a => a.country === 'Iran').concat(prolific.filter(a => a.country !== 'Iran')));
  return pick(iranians);
}

// The uploaded manuscript's real authors join the Author table, but they are pushed
// AFTER the prolific/iranians/internationals views are built so pickAuthor() never
// selects them for other articles - they belong exclusively to fp0.
if (fp0.authors) {
  authorPool.push(...fp0.authors.map((fa, i) => ({
    id: UPLOAD_AUTHOR_IDS[i],
    givenName: fa.givenName, familyName: fa.familyName, orcid: fa.orcid,
    affiliation: fa.affiliation, department: fa.department,
    country: fa.country, email: fa.email,
  })));
}

// ── Method acronym generator ─────────────────────────────────────────────────
const ACR_PREFIX = ['D', 'A', 'R', 'S', 'E', 'F', 'H', 'C', 'M', 'P', 'O', 'V', 'G', 'T', 'B', 'N', 'K', 'I', 'L', 'W'];
const ACR_SUFFIX = ['Net', 'Net+', 'CNN', 'Former', 'BERT', 'Graph', 'Cast', 'Sense', 'Mind', 'Guard', 'Flow', 'Learn', 'Predict', 'Detect'];
function makeAcronym(): string {
  let s = '';
  const len = rint(2, 5);
  for (let i = 0; i < len; i++) s += pick(ACR_PREFIX);
  return s + pick(ACR_SUFFIX);
}

// ── Title generation ─────────────────────────────────────────────────────────
const ADJ = ['novel', 'robust', 'efficient', 'scalable', 'lightweight', 'adaptive', 'hybrid', 'explainable', 'privacy-preserving', 'cost-effective', 'energy-aware', 'interpretable', 'uncertainty-aware', 'context-aware', 'multi-task'];

const usedTitles = new Set<string>();

const SMALL = new Set(['for', 'of', 'in', 'and', 'the', 'with', 'on', 'a', 'an', 'to', 'via', 'from', 'by']);
function titleCase(s: string): string {
  const words = s.split(/\s+/);
  return words
    .map((w, i) => {
      const isEdge = i === 0 || i === words.length - 1;
      return w
        .split('-')
        .map(p => {
          if (p.length >= 2 && p === p.toUpperCase()) return p; // ALL-CAPS: CNN, PCB, BLE, R-CNN
          if (!/^[a-z0-9]+$/.test(p)) return p; // mixed case brands unchanged: FastText, YOLOv8, ParsBERT
          const lower = p.toLowerCase();
          if (!isEdge && SMALL.has(lower)) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('-');
    })
    .join(' ');
}
// Article selector based on spelling ("U-Net" → "a U-Net"; "uncertainty" → "an")
function aAn(word: string, upper = true): string {
  const c = word.charAt(0);
  let vowel = ['a', 'e', 'i', 'o', 'u'].includes(c.toLowerCase());
  if (c === 'U') vowel = false; // uppercase U- prefix (U-Net) is pronounced "you"
  const art = vowel ? 'an' : 'a';
  return upper ? art.charAt(0).toUpperCase() + art.slice(1) : art;
}

function makeTitle(section: string, type: string): { title: string } {
  const tasks = TASKS[section];
  const methods = METHODS[section];
  for (let attempt = 0; attempt < 40; attempt++) {
    let title = '';
    const t = pick(tasks);
    const m = pick(methods);
    const adj1 = pick(ADJ), adj2 = pick(ADJ), adj3 = pick(ADJ), adj4 = pick(ADJ), adj5 = pick(ADJ);
    if (type === 'Review Article' || type === 'Survey') {
      const patterns = [
        `${titleCase(m)} for ${titleCase(t)}: A Systematic Review of Methods, Datasets, and Evaluation Metrics`,
        `A Systematic Literature Review on ${titleCase(t)}`,
        `${titleCase(t)}: Advances, Challenges, and Future Research Directions`,
        `A Comprehensive Survey of ${titleCase(m)} Approaches to ${titleCase(t)}`,
      ];
      title = pick(patterns);
    } else if (type === 'Short Communication') {
      const patterns = [
        `A Note on ${titleCase(m)}-Based ${titleCase(t)}`,
        `Rapid Assessment of ${titleCase(m)} for ${titleCase(t)}`,
        `Preliminary Results on ${titleCase(t)} Using ${titleCase(m)}`,
        `${aAn(adj5)} ${titleCase(adj5)} Baseline for ${titleCase(t)}`,
      ];
      title = pick(patterns);
    } else {
      const patterns = [
        `${titleCase(m)}-Based Approach to ${titleCase(t)}`,
        `${titleCase(m)} for ${titleCase(t)}: ${aAn(adj1)} ${titleCase(adj1)} Design and Empirical Evaluation`,
        `Deep ${pick(['Learning', 'Neural Modeling', 'Feature Learning', 'Representation Learning'])} for ${titleCase(t)}: ${aAn(adj2)} ${titleCase(adj2)} Framework`,
        `Enhancing ${titleCase(pick(['Accuracy', 'Robustness', 'Generalization', 'Efficiency', 'Interpretability']))} in ${titleCase(t)} via ${titleCase(m)}`,
        `Toward Reliable ${titleCase(t)}: ${titleCase(m)} and ${titleCase(METHODS[SECTIONS[(SECTIONS.indexOf(section) + 3) % SECTIONS.length]][rint(0, 11)])}`,
        `${aAn(m)} ${titleCase(m)} Framework for ${titleCase(t)} on ${titleCase(pick(['Resource-Constrained Devices', 'Real-World Data Streams', 'Heterogeneous Platforms', 'Low-Resource Settings']))}`,
        `${makeAcronym()}: ${aAn(adj3)} ${titleCase(adj3)} Architecture for ${titleCase(t)}`,
        `Federated ${titleCase(m)} for Privacy-Preserving ${titleCase(t)}`,
        `${titleCase(m)} in the Wild: Benchmarking ${titleCase(t)} under Realistic Conditions`,
        `${aAn(adj4)} ${titleCase(adj4)} Study of ${titleCase(m)} for ${titleCase(t)}`,
      ];
      title = pick(patterns);
    }
    if (!usedTitles.has(title)) { usedTitles.add(title); return { title }; }
  }
  const fallback = `${titleCase(pick(methods))} for ${titleCase(pick(tasks))} — Study ${rint(1000, 9999)}`;
  usedTitles.add(fallback);
  return { title: fallback };
}
function cap(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

// ── Shared generation context (kept consistent between abstract and full text) ─
interface Ctx { task: string; method: string; method2: string; dataset: string; acc: number; f1: number; impr: number }
function makeCtx(section: string): Ctx {
  return {
    task: pick(TASKS[section]),
    method: pick(METHODS[section]),
    method2: pick(METHODS[section]),
    dataset: pick(DATASETS),
    acc: +(87 + R() * 11.5).toFixed(1),
    f1: +(0.84 + R() * 0.13).toFixed(2),
    impr: rint(2, 9),
  };
}

// ── Abstract generation ──────────────────────────────────────────────────────
function makeAbstract(ctx: Ctx, section: string, type: string): string {
  const task = ctx.task;
  const method = ctx.method;
  const dataset = ctx.dataset;
  const acc = ctx.acc.toFixed(1);
  const f1 = ctx.f1.toFixed(2);
  const impr = ctx.impr;
  const secondMethod = ctx.method2;
  const intro = type === 'Review Article'
    ? `${cap(task)} has attracted growing attention over the past decade, yet the literature remains fragmented across datasets, evaluation protocols, and modeling assumptions.`
    : `${cap(task)} is a critical problem in modern computing systems, where decisions must be made accurately and under tight resource constraints.`;
  const gap = type === 'Review Article'
    ? `Despite the breadth of published work, no prior study has systematically mapped how ${method.toLowerCase()} techniques are applied to this task, nor consolidated the evidence on their comparative performance.`
    : `Although recent approaches based on ${method.toLowerCase()} have shown promise, they often struggle with ${pick(['limited labeled data', 'noisy real-world conditions', 'high computational cost', 'poor generalization across sites', 'class imbalance and distribution drift'])}, which limits their practical deployment.`;
  const contrib = type === 'Review Article'
    ? `This article presents a systematic review of ${rint(88, 160)} studies published between 2010 and 2026, organized around a novel taxonomy that separates data representation, learning strategy, and evaluation methodology.`
    : `In this paper, we propose ${aAn(pick(ADJ), false)} ${pick(ADJ)} framework that tightly couples ${method.toLowerCase()} with ${secondMethod.toLowerCase()}, enabling the system to ${pick(['exploit complementary structural cues', 'adapt to unseen operating conditions', 'recover from partial sensor failures', 'balance accuracy against inference latency'])}.`;
  const methodDetail = `The proposed pipeline integrates ${pick(['data augmentation', 'feature fusion', 'multi-scale representation learning', 'curriculum sampling', 'semi-supervised pre-training', 'domain adaptation'])} and ${pick(['an attention-based aggregation module', 'a lightweight regularization scheme', 'a calibration stage', 'an ensemble selection strategy'])}, followed by an end-to-end optimization procedure that is stable and reproducible.`;
  const evalSent = `We conduct extensive experiments on ${dataset}, and compare against ${rint(5, 9)} state-of-the-art baselines under identical settings. The results show that our approach achieves ${acc}% ${pick(['accuracy', 'balanced accuracy'])} and an F1-score of ${f1}, improving the strongest baseline by up to ${impr}% while reducing ${pick(['inference time', 'model size', 'training cost', 'energy consumption'])} by roughly ${rint(15, 45)}%.`;
  const analysis = `Ablation studies confirm that each component contributes measurably to the overall performance, and statistical significance tests indicate that the observed gains are robust across ${rint(3, 6)} random seeds. Additional analyses address ${pick(['fairness across demographic subgroups', 'behaviour under adversarial perturbations', 'scalability with dataset size', 'interpretability of learned representations', 'transferability to related tasks'])}.`;
  const close = `Taken together, these findings suggest that the proposed framework offers a practical and deployable solution, and the released implementation provides a reproducible reference point for future research on ${task}.`;
  return [intro, gap, contrib, methodDetail, evalSent, analysis, close].join(' ');
}

// ── References ───────────────────────────────────────────────────────────────
interface RefCandidate { title: string; year: number; volume: number; issue: number; pages: string; authors: string[] }
let publishedSoFar: RefCandidate[] = [];

function makeRef(rndRef: () => number): string {
  const nA = rint(1, 4);
  const names: string[] = [];
  for (let i = 0; i < nA; i++) names.push(`${pick(REF_FIRST)} ${pick(REF_LAST)}`);
  const namesStr = names.length > 2 ? `${names[0]}, ${names.slice(1, -1).join(', ')}, and ${names[names.length - 1]}` : names.join(' and ');
  const year = rint(2005, 2025);
  const titleKind = Math.floor(rndRef() * 3);
  const venue = pick(REF_VENUES);
  const vol = rint(20, 140);
  const iss = rint(1, 12);
  const p1 = rint(1, 800);
  let title: string;
  if (titleKind === 0) {
    title = `${pick(['A', 'An'])} ${pick(['survey', 'framework', 'method', 'analysis', 'model'])} of ${pick(['deep learning', 'federated systems', 'graph analytics', 'secure computation', 'cloud orchestration'])} for ${pick(['intelligent applications', 'large-scale data', 'resource-constrained environments', 'real-time decision making'])}`;
  } else if (titleKind === 1) {
    title = `${cap(pick(['efficient', 'robust', 'adaptive', 'scalable', 'interpretable']))} ${pick(['neural architectures', 'optimization algorithms', 'detection mechanisms', 'scheduling policies', 'representation learning'])}: ${pick(['theory and practice', 'a comprehensive evaluation', 'lessons from deployment', 'challenges and opportunities'])}`;
  } else {
    title = `${pick(['Benchmarking', 'Understanding', 'Revisiting', 'Rethinking', 'On'])} ${pick(['transfer learning pipelines', 'privacy-utility trade-offs', 'energy-aware protocols', 'model calibration', 'adversarial robustness'])} in ${pick(['modern computing systems', 'distributed environments', 'real-world deployments', 'cross-domain scenarios'])}`;
  }
  return `${namesStr} (${year}). ${title}. ${venue}, ${vol}(${iss}), ${p1}–${p1 + rint(8, 22)}.`;
}

// ── Metrics simulation ───────────────────────────────────────────────────────
function citationFor(year: number, type: string): number {
  const age = 2026 - year;
  const base: Record<number, number> = { 0: 0.4, 1: 1.6, 2: 4, 3: 8, 4: 13, 5: 19, 6: 26, 7: 33, 8: 41, 9: 48 };
  let c = (base[age] ?? 50) * (0.4 + R() * 1.3);
  if (type === 'Review Article' || type === 'Survey') c *= 1.9;
  if (type === 'Short Communication') c *= 0.5;
  return Math.max(0, Math.round(c));
}
function downloadsFor(year: number, citations: number): number {
  const age = 2026 - year;
  return Math.round(citations * 38 + (120 + R() * 700) + age * rint(40, 160));
}

// ── Dates ────────────────────────────────────────────────────────────────────
function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// ── Main generation ──────────────────────────────────────────────────────────
interface GenArticle {
  id: string; status: string; title: string; abstractText: string; keywords: string[]; doi: string;
  volume: number; issue: number; year: number; month: string; pages: string; type: string;
  section: string; receivedDate: string; acceptedDate: string; publishedDate: string;
  citations: number; downloads: number; pdfPages: number; references: string[];
  nRefs: number; fullText: PaperBlock[]; flagship: boolean;
  correspondingEmail: string; authorIds: { id: string; corresponding: boolean }[];
  authorsData: PoolAuthor[];
}

async function main() {
  console.log('Seeding database…');

  // wipe
  await db.articleAuthor.deleteMany();
  await db.article.deleteMany();
  await db.author.deleteMany();
  await db.issue.deleteMany();
  await db.boardMember.deleteMany();
  await db.announcement.deleteMany();
  await db.contactMessage.deleteMany();
  await db.newsletterSubscriber.deleteMany();

  // ── Issues ──
  type IssuePlan = { volume: number; issue: number; year: number; month: string; status: string; articles: number; isSpecial: boolean };
  const plans: IssuePlan[] = [];
  const publishedIssues: { vol: number; iss: number; year: number; month: string }[] = [];
  for (let vol = 1; vol <= 9; vol++) {
    const year = 2017 + vol;
    for (let iss = 1; iss <= 4; iss++) {
      const month = MONTHS[iss - 1];
      const isUpcoming = year === 2026 && iss === 4;
      if (year > 2026) continue;
      // journal growth: early volumes fewer articles
      let perIssue = vol <= 2 ? rint(5, 6) : vol <= 4 ? rint(6, 7) : vol <= 6 ? rint(7, 8) : rint(8, 9);
      // The current issue carries all hand-written/uploaded flagship papers —
      // make sure it has enough slots (value override only, no extra PRNG draw).
      if (vol === 9 && iss === 3) perIssue = Math.max(perIssue, FLAGSHIPS.length);
      const upcoming = isUpcoming ? rint(4, 5) : 0;
      plans.push({ volume: vol, issue: iss, year, month, status: isUpcoming ? 'upcoming' : 'published', articles: isUpcoming ? upcoming : perIssue, isSpecial: !!SPECIAL_ISSUES[`${vol}-${iss}`] });
      if (!isUpcoming) publishedIssues.push({ vol, iss, year, month });
    }
  }

  // ── Articles ──
  const articles: GenArticle[] = [];
  let articleNo = 0;
  let flagshipIdx = 0;

  for (const plan of plans) {
    const special = SPECIAL_ISSUES[`${plan.volume}-${plan.issue}`];
    // section bias for special issues
    const issueSections: string[] = [];
    for (let k = 0; k < plan.articles; k++) {
      let section: string;
      if (special && plan.volume === 9 && plan.issue === 1 && k < 5) section = 'Natural Language Processing';
      else if (special && plan.volume === 8 && plan.issue === 2 && k < 4) section = 'Health & Bioinformatics';
      else if (special && plan.volume === 6 && plan.issue === 4 && k < 4) section = 'Computer Networks & Security';
      else if (special && plan.volume === 4 && plan.issue === 1 && k < 4) section = 'Data Science & Big Data Analytics';
      else section = weightedPick(SECTIONS, SECTION_WEIGHTS);
      issueSections.push(section);
    }

    // page counter
    let pageCursor = 1;
    const pubDateBase = iso(plan.year, MONTH_NUM[plan.month], plan.status === 'upcoming' ? 15 : rint(20, 30));

    for (let k = 0; k < plan.articles; k++) {
      // Hand-written complete flagship papers fill the latest published issue (V9 I3).
      const fp: FlagshipPaper | null = (plan.volume === 9 && plan.issue === 3 && flagshipIdx < FLAGSHIPS.length)
        ? FLAGSHIPS[flagshipIdx++] : null;
      let section = issueSections[k];
      const type = fp ? fp.type : weightedPick(
        ['Research Article', 'Review Article', 'Short Communication', 'Technical Note'],
        plan.status === 'upcoming' ? [72, 14, 8, 6] : [68, 13, 9, 10],
      );
      if (fp) section = fp.section;

      const title = fp ? fp.title : makeTitle(section, type).title;
      const ctx = makeCtx(section);
      const abstractText = fp ? fp.abstractText : makeAbstract(ctx, section, type);

      // authors 2–5 (pool draws always run to keep the PRNG stream stable;
      // for papers with a real author list the result is overridden below)
      const nA = weightedPick([2, 3, 4, 5], [24, 40, 26, 10]);
      let chosen: PoolAuthor[] = [];
      const seen = new Set<string>();
      for (let i = 0; i < nA; i++) {
        let a = pickAuthor();
        let guard = 0;
        while ((seen.has(a.id) || (i > 0 && a.country !== 'Iran' && chance(0.7))) && guard++ < 25) a = pickAuthor();
        if (!seen.has(a.id)) { seen.add(a.id); chosen.push(a); }
      }
      const corrIdx = chance(0.88) ? 0 : rint(1, chosen.length - 1);
      const corr = chosen[corrIdx];
      // Uploaded manuscript: use its real authors verbatim.
      const realCorrIdx = fp?.authors ? fp.authors.findIndex(fa => fa.corresponding) : -1;
      if (fp?.authors) {
        chosen = fp.authors.map((fa, i) => ({
          id: UPLOAD_AUTHOR_IDS[i],
          givenName: fa.givenName, familyName: fa.familyName, orcid: fa.orcid,
          affiliation: fa.affiliation, department: fa.department,
          country: fa.country, email: fa.email,
        }));
      }

      articleNo++;
      const id = `IJCS-2026-${String(articleNo).padStart(4, '0')}`;
      const doi = `${JOURNAL.prefix}.${plan.year}.${String(rint(100000, 999999))}.${String(rint(100, 999))}`;
      const keywords = fp ? fp.keywords : shufflePick(KEYWORDS[section], 5);

      // reference count fixed here so the full-text citations stay in range
      const nRefs = fp ? fp.references.length : (type === 'Review Article' ? rint(26, 34) : rint(15, 24));

      // Complete paper body (6-13 PDF pages).
      const fullText: PaperBlock[] = fp
        ? fp.blocks
        : generateFullPaper(
            {
              task: ctx.task, method: ctx.method, method2: ctx.method2, dataset: ctx.dataset,
              type, section, title, acc: ctx.acc, f1: ctx.f1, impr: ctx.impr,
              nRefs, keywords,
            },
            R,
          );
      const pdfPages = 0; // exact page count computed in the render pass below

      let pages = '';
      let publishedDate = '';
      let received = '', accepted = '';
      let citations = 0, downloads = 0;

      if (plan.status === 'published') {
        publishedDate = pubDateBase;
        const mN = MONTH_NUM[plan.month];
        // received 4-8 months before publication
        let rM = mN - rint(4, 8), rY = plan.year;
        while (rM <= 0) { rM += 12; rY -= 1; }
        received = iso(rY, rM, rint(2, 26));
        let aM = mN - rint(1, 3), aY = plan.year;
        while (aM <= 0) { aM += 12; aY -= 1; }
        accepted = iso(aY, aM, rint(2, 26));
        citations = citationFor(plan.year, type);
        downloads = downloadsFor(plan.year, citations);
      }
      // Uploaded manuscript dates override the simulated ones.
      if (fp?.receivedDate) received = fp.receivedDate;
      if (fp?.acceptedDate) accepted = fp.acceptedDate;
      if (fp?.publishedDate) publishedDate = fp.publishedDate;
      if (fp?.downloads !== undefined) downloads = fp.downloads;

      articles.push({
        id, status: plan.status === 'upcoming' ? 'in_press' : 'published',
        title, abstractText, keywords, doi,
        volume: plan.volume, issue: plan.issue, year: plan.year, month: plan.month,
        pages, type,
        section,
        receivedDate: received, acceptedDate: accepted, publishedDate,
        citations, downloads, pdfPages,
        references: fp ? [...fp.references] : [],
        nRefs,
        fullText,
        flagship: !!fp,
        correspondingEmail: realCorrIdx >= 0 ? chosen[realCorrIdx].email : corr.email,
        authorIds: chosen.map((a, i) => ({ id: a.id, corresponding: realCorrIdx >= 0 ? i === realCorrIdx : i === corrIdx })),
        authorsData: chosen,
      });
    }
  }

  // ── Provisional pagination (needed so self-citations can quote page ranges) ──
  {
    let key = '', pc = 1;
    for (const art of articles) {
      if (`${art.volume}|${art.issue}` !== key) { key = `${art.volume}|${art.issue}`; pc = 1; }
      if (art.status === 'published') {
        const est = estimatePdfPages(art.fullText, art.type, art.nRefs);
        const start = pc;
        pc += est;
        art.pages = `${start}–${pc - 1}`;
        publishedSoFar.push({ title: art.title, year: art.year, volume: art.volume, issue: art.issue, pages: art.pages, authors: art.authorsData.map(a => `${a.familyName}, ${a.givenName.charAt(0)}.`) });
      }
    }
  }

  // ── Attach references (with 1–3 journal self-references for vol ≥ 3) ──
  // Flagship papers keep their hand-written reference lists.
  const refYearCursor: Record<number, number> = {};
  for (const art of articles) {
    if (art.flagship) continue;
    const refs: string[] = [];
    const nRefs = art.nRefs;
    // self references: only cite articles published in earlier volumes
    if (art.volume >= 3) {
      const earlier = publishedSoFar.filter(p => p.volume < art.volume);
      const nSelf = Math.min(earlier.length, rint(1, 3));
      const usedIdx = new Set<number>();
      for (let i = 0; i < nSelf; i++) {
        let idx = Math.floor(R() * earlier.length);
        let guard = 0;
        while (usedIdx.has(idx) && guard++ < 10) idx = Math.floor(R() * earlier.length);
        usedIdx.add(idx);
        const p = earlier[idx];
        refs.push(`${p.authors.join(', ')} (${p.year}). ${p.title}. Iran Journal of Computer Science, ${p.volume}(${p.issue}), ${p.pages}.`);
      }
    }
    while (refs.length < nRefs) refs.push(makeRef(R));
    art.references = refs;
  }

  // ── Render each paper to obtain the EXACT page count, then paginate issues ──
  console.log('Rendering papers to compute exact page counts…');
  let cursorKey = '';
  let pageCursor = 1;
  for (const art of articles) {
    const { pageCount } = await buildPaperPdf({
      title: art.title,
      abstractText: art.abstractText,
      keywords: art.keywords,
      doi: art.doi,
      volume: art.volume,
      issue: art.issue,
      year: art.year,
      month: art.month,
      pages: '',
      type: art.type,
      section: art.section,
      receivedDate: art.receivedDate,
      acceptedDate: art.acceptedDate,
      publishedDate: art.publishedDate,
      references: art.references.length ? art.references : Array.from({ length: art.nRefs }, () => 'Placeholder reference.'),
      fullText: art.fullText,
      correspondingEmail: art.correspondingEmail,
      authors: art.authorsData.map(a => ({
        givenName: a.givenName,
        familyName: a.familyName,
        isCorresponding: false,
        department: a.department,
        affiliation: a.affiliation,
      })),
    });
    art.pdfPages = pageCount;

    const key = `${art.volume}|${art.issue}`;
    if (key !== cursorKey) { cursorKey = key; pageCursor = 1; }

    if (art.status === 'published') {
      const start = pageCursor;
      pageCursor += art.pdfPages;
      art.pages = `${start}–${pageCursor - 1}`;
    }
  }

  // ── Insert authors ──
  console.log(`Inserting ${authorPool.length} authors…`);
  await db.author.createMany({
    data: authorPool.map(a => ({
      id: a.id, givenName: a.givenName, familyName: a.familyName, orcid: a.orcid,
      affiliation: a.affiliation, department: a.department, country: a.country, email: a.email,
    })),
  });

  // ── Insert issues ──
  console.log(`Inserting ${plans.length} issues…`);
  await db.issue.createMany({
    data: plans.map(p => {
      const special = SPECIAL_ISSUES[`${p.volume}-${p.issue}`];
      return {
        id: `V${p.volume}I${p.issue}`,
        volume: p.volume, issue: p.issue, year: p.year, month: p.month,
        theme: special ? special.theme : '',
        description: special
          ? special.description
          : `Regular issue containing ${p.articles} peer-reviewed articles spanning ${SECTIONS.slice(0, 5).slice(0, 3).join(', ')}, and more.`,
        publishedDate: p.status === 'upcoming' ? '' : iso(p.year, MONTH_NUM[p.month], 25),
        status: p.status,
        isSpecial: !!special,
      };
    }),
  });

  // ── Insert articles ──
  console.log(`Inserting ${articles.length} articles…`);
  for (const a of articles) {
    await db.article.create({
      data: {
        id: a.id, status: a.status, title: a.title, abstractText: a.abstractText,
        keywords: JSON.stringify(a.keywords), doi: a.doi,
        volume: a.volume, issue: a.issue, year: a.year, month: a.month,
        pages: a.pages, type: a.type, section: a.section,
        receivedDate: a.receivedDate, acceptedDate: a.acceptedDate, publishedDate: a.publishedDate,
        citations: a.citations, downloads: a.downloads, pdfPages: a.pdfPages,
        references: JSON.stringify(a.references),
        fullText: JSON.stringify(a.fullText),
        correspondingEmail: a.correspondingEmail,
        authors: {
          create: a.authorIds.map((x, i) => ({
            authorId: x.id, order: i, isCorresponding: x.corresponding,
          })),
        },
      },
    });
  }

  // ── Board ──
  await db.boardMember.createMany({
    data: BOARD.map((b, i) => ({
      id: `B${String(i + 1).padStart(2, '0')}`,
      name: b.name, role: b.role, affiliation: b.affiliation, country: b.country,
      field: b.field, email: b.email,
      orcid: `0000-000${rint(1, 3)}-${rint(1000, 9999)}-${rint(1000, 9999)}`,
      order: i,
    })),
  });

  // ── Announcements ──
  await db.announcement.createMany({
    data: ANNOUNCEMENTS.map((a, i) => ({ id: `N${String(i + 1).padStart(2, '0')}`, ...a })),
  });

  const counts = {
    articles: await db.article.count(),
    published: await db.article.count({ where: { status: 'published' } }),
    issues: await db.issue.count(),
    authors: await db.author.count(),
  };
  console.log('Done.', counts);
}

function shufflePick(pool: string[], n: number): string[] {
  const arr = [...pool];
  const out: string[] = [];
  while (out.length < n && arr.length) out.push(arr.splice(Math.floor(R() * arr.length), 1)[0]);
  return out;
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
