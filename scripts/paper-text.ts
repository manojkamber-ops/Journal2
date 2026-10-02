// ─────────────────────────────────────────────────────────────────────────────
// Template-based generator that expands a generated article (task, method,
// dataset, metrics) into a COMPLETE research paper body: Introduction,
// Literature Review, Methodology, Experimental Setup, Results & Discussion,
// and Conclusion. Output is a list of PaperBlock objects consumed by the web
// view and the PDF renderer. Deterministic via the passed PRNG.
// ─────────────────────────────────────────────────────────────────────────────
import type { PaperBlock } from '../src/lib/journal-types';

type Rand = () => number;

export interface PaperCtx {
  task: string;        // e.g. 'anomaly detection in industrial processes'
  method: string;      // e.g. 'Deep Learning'
  method2: string;     // second method, e.g. 'Attention Mechanism'
  dataset: string;     // e.g. 'the NSL-KDD and CICIDS2017 benchmark suites'
  type: string;        // article type
  section: string;
  title: string;
  acc: number;         // headline accuracy percent, e.g. 92.4
  f1: number;          // e.g. 0.91
  impr: number;        // relative improvement percent vs best baseline
  nRefs: number;       // number of references (citation bound)
  keywords: string[];
}

// ── helpers ──────────────────────────────────────────────────────────────────
const pick = <T,>(r: Rand, arr: T[]): T => arr[Math.floor(r() * arr.length)];
const rint = (r: Rand, a: number, b: number) => Math.floor(r() * (b - a + 1)) + a;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function cite(r: Rand, max: number, n = 1): string {
  const nums = new Set<number>();
  while (nums.size < n) nums.add(rint(r, 1, Math.max(2, max)));
  const sorted = [...nums].sort((a, b) => a - b);
  return `[${sorted.join(', ')}]`;
}
const methodLow = (m: string) => m.toLowerCase();

// ── phrase pools ─────────────────────────────────────────────────────────────
const CHALLENGES = [
  'limited labeled data and expensive annotation cycles',
  'noisy, heterogeneous operating conditions in real deployments',
  'high computational cost that blocks on-device or real-time use',
  'poor generalization across sites, vendors, and time periods',
  'severe class imbalance in which minority cases are the most important',
  'distribution drift between training conditions and production traffic',
  'the scarcity of publicly reproducible baselines and protocols',
  'privacy and governance constraints on the data that may be pooled',
];
const CONTEXTS = [
  'a growing body of engineering practice',
  'a decade of rapid methodological progress',
  'an active industrial adoption cycle',
  'a substantial academic literature',
  'an expanding open-source ecosystem',
];
const MOTIVATIONS = [
  'Because the cost of a wrong decision scales with operational stakes, accuracy alone is an incomplete quality criterion; robustness and cost must be co-designed.',
  'Deployed systems additionally face latency budgets, hardware limits, and audit requirements that pure accuracy-driven research tends to ignore.',
  'In practice, the value of the pipeline is determined by its weakest stage - data quality, modeling, or monitoring - rather than by the peak performance of any single component.',
  'Operational teams require solutions that degrade gracefully under shift, remain auditable, and can be retrained on schedule rather than on demand.',
  'As these systems move from prototypes to production, engineering constraints become as decisive as model architecture.',
];
const GAP_SENTS = [
  'However, existing approaches rarely address {challenge} in a unified way, and reported results are difficult to compare because protocols differ across studies.',
  'The literature is fragmented: each study optimizes a slice of the pipeline, and the interaction between {m1} and {m2} remains poorly characterized.',
  'Prior work usually assumes idealized inputs, and the sensitivity of {m1}-based pipelines to {challenge} is documented only anecdotally.',
  'What is missing is a systematic treatment that couples {m1} with {m2} under a single, reproducible evaluation protocol.',
];
const CONTRIB_FORMS = [
  'a principled pipeline that couples {m1} with {m2}, yielding a formulation that is both accurate and deployable',
  'an end-to-end framework in which {m1} provides the representational backbone and {m2} supplies adaptive behavior',
  'a unified architecture that integrates {m1} and {m2} with a lightweight regularization and calibration stage',
  'a modular design in which {m1}-based encoders, {m2}-based adaptation, and a task head can be tuned independently',
];
const BASELINE_SENT = [
  'We compare against {k} representative baselines under identical data splits and training budgets, re-running each baseline with tuned hyperparameters rather than quoting published numbers.',
  'Seven baselines, spanning classical learning and recent deep architectures, are retrained on the same splits with tuned hyperparameters, so that comparisons reflect implementations rather than reporting conventions.',
  'Baselines cover three families: statistical and shallow learners, convolutional and recurrent deep models, and a recent transformer-style architecture; all are tuned on the validation split.',
];
const METRIC_SENTS = [
  'We report task-appropriate metrics - accuracy, F1, and ROC-AUC for classification; MAE and RMSE for regression - together with parameter counts, latency, and energy proxies, because deployment value depends on all of them.',
  'Evaluation uses standard task metrics computed after identical preprocessing for all systems, and every experiment is repeated with five random seeds.',
  'Accuracy metrics are complemented by robustness diagnostics: performance under input noise, class-conditional error rates, and calibration error.',
];
const IMPL_SENTS = [
  'All models are implemented in PyTorch and trained with AdamW, cosine learning-rate decay, and early stopping on validation loss; hyperparameters are tuned by Bayesian optimization over 60 trials.',
  'Our implementation uses PyTorch 2.x with mixed-precision training; the search space and the selected configurations are listed in the repository for exact reproduction.',
  'Training uses AdamW with a warmup schedule, batch size 64, and early stopping; all experiments fit on a single mid-range GPU.',
];
const FINDING_SENTS = [
  'The results show that {m1} contributes most of the raw capacity while {m2} stabilizes behavior under shift, and the combination is consistently better than either alone.',
  'Across seeds, the proposed pipeline improves the strongest baseline by {impr}% relative {metric} while using {resource}, which we attribute to the interaction of its two core components.',
  'Gains are largest on the minority classes and on the most volatile time periods, exactly where aggregate metrics usually hide failure.',
  'The margin over baselines is stable across seeds (standard deviation below 0.3 points) and remains significant under paired bootstrap testing.',
];
const ABLATION_SENTS = [
  'Removing the {m2} module costs {drop} {metric} points, confirming that adaptive behavior, not raw capacity alone, drives the gain.',
  'Replacing the learned components with hand-tuned rules recovers only part of the performance, and the residual gap widens under distribution shift.',
  'Shrinking the model by half costs {drop} points on average but {drop2} points on the hardest subset, quantifying where capacity actually pays.',
];
const LIMIT_SENTS = [
  'Limitations remain: the evaluation, while broad, does not include longitudinal deployment, and the computational cost of the full pipeline may still exceed some embedded budgets.',
  'Our protocol uses public benchmarks plus one domain dataset; conclusions about other domains should be drawn with care until replications accumulate.',
  'The approach inherits the usual data requirements of deep methods, and cold-start scenarios without historical data are not addressed here.',
];

const INTRO_EXTRA = [
  'The application context reinforces the urgency. Organizations that adopted early versions of these systems report both the promised efficiency gains and a set of failure modes that were absent from the original evaluations, and closing that gap requires exactly the kind of end-to-end treatment this paper attempts.',
  'It is worth emphasizing the economic dimension. Even modest percentage improvements in this task compound across thousands of daily decisions, which is why incremental-looking gains of a few points attract sustained industrial interest and justify the engineering complexity of the proposed pipeline.',
  'A further motivation is reproducibility. Too many results in this area rest on private data and unreported hyperparameters; by releasing the full pipeline, configurations, and splits, we hope to raise the evidentiary standard for follow-up work.',
  'The timing is also favorable. Compute and data infrastructure that was exotic five years ago is now commodity, which makes the proposed coupling practical for mid-sized teams rather than only for large laboratories.',
];
const LIT_EXTRA = [
  'Benchmark resources deserve separate mention. The datasets used across the surveyed studies vary widely in size, class balance, and annotation quality, and several widely cited results have been re-examined when annotation errors surfaced. We therefore restrict quantitative claims in the remainder of this paper to datasets with documented provenance and released splits.',
  'A complementary line of work studies the problem under simplifications - reduced input dimensionality, synthetic data, or relaxed latency constraints. These studies illuminate mechanisms but do not transfer directly; we cite them where they inform design choices and exclude them from headline comparisons.',
  'Finally, adjacent domains have converged on similar architectures for related tasks, and cross-domain evidence strengthens the case for the design decisions made here; where such evidence exists, we reference it as supporting rather than decisive.',
];
const RES_EXTRA = [
  'Compared with published numbers, our retrained baselines often exceed the originally reported figures, sometimes by several points - a finding consistent with the wider observation that careful tuning narrows apparent gaps between methods. We therefore regard the margins reported here as conservative estimates of the proposed approach\'s advantage.',
  'Error stratification by input characteristics reveals a consistent pattern: errors concentrate where the input signal is weakest, and the proposed pipeline recovers a larger share of these cases than the baselines, which supports the claim that its gains are structural rather than statistical accidents.',
  'We also examined behavior under reduced training data. The proposed pipeline degrades more slowly than the baselines as the training set shrinks, retaining most of its advantage down to a third of the full corpus, which matters for organizations that cannot collect data at benchmark scale.',
  'A qualitative inspection of predictions complements the numbers. Success cases show the expected behavior - evidence anchored to the right input regions - while residual failures tend to involve genuinely ambiguous inputs where even expert annotators disagree, suggesting the remaining headroom is bounded.',
];

function bib(r: Rand, max: number, n: number): string { return cite(r, max, n); }

// ── main generator ───────────────────────────────────────────────────────────
export function generateFullPaper(ctx: PaperCtx, r: Rand): PaperBlock[] {
  const B: PaperBlock[] = [];
  const m1 = ctx.method;
  const m2 = ctx.method2;
  const maxRef = ctx.nRefs;
  const isReview = ctx.type === 'Review Article';
  const isShort = ctx.type === 'Short Communication';
  const isTech = ctx.type === 'Technical Note';
  // Length variation: reviews are longest, short/technical notes shortest,
  // plain research articles span the middle with three extension levels.
  const variant = isReview ? 3 : (isShort || isTech) ? 0 : rint(r, 0, 3);
  const metric = r() < 0.5 ? 'accuracy' : 'F1';
  const resource = pick(r, ['22% fewer parameters', '31% less inference time', 'a 27% smaller memory footprint', '18% lower training energy']);
  const drop = (1.5 + r() * 2.4).toFixed(1);
  const drop2 = (Number(drop) + 1.6 + r() * 1.8).toFixed(1);
  const kBaselines = rint(r, 5, 9);
  const nSeeds = rint(r, 3, 6);
  const c1 = bib(r, maxRef, r() < 0.5 ? 1 : 2);
  const c2 = bib(r, maxRef, r() < 0.5 ? 1 : 2);
  const c3 = bib(r, maxRef, r() < 0.5 ? 1 : 2);
  const c4 = bib(r, maxRef, r() < 0.5 ? 1 : 2);
  const c5 = bib(r, maxRef, r() < 0.5 ? 1 : 2);
  const c6 = bib(r, maxRef, r() < 0.5 ? 1 : 2);
  const challenge = pick(r, CHALLENGES);

  // ── 1. Introduction ──
  B.push({ kind: 'h2', text: '1. Introduction' });
  if (isReview) {
    B.push({ kind: 'p', text: `${cap(ctx.task)} has accumulated ${pick(r, CONTEXTS)} over the past fifteen years, and the volume of published work now makes synthesis itself a research contribution. Surveys in adjacent areas ${c1} have organized parts of this literature, but the field lacks a mapping that connects data characteristics, model families, and evaluation practice for this specific task. Without such a mapping, practitioners extrapolate from a handful of high-profile results, and researchers duplicate effort on questions already answered.` });
    B.push({ kind: 'p', text: `This review addresses the gap through a systematic protocol: ${rint(r, 88, 160)} studies published between 2010 and 2026 are screened, coded, and organized along three axes - data representation, learning strategy, and evaluation methodology. The protocol follows PRISMA-style screening ${c2}, with inclusion criteria documented in Section 3, and every coding decision was adjudicated by two reviewers. Inter-rater agreement on the final taxonomy is 0.87 Cohen kappa.` });
  } else {
    B.push({ kind: 'p', text: `${cap(ctx.task)} is a recurring requirement across computing systems, and decisions made here propagate directly into cost, safety, and user experience. The past decade transformed what is achievable: ${methodLow(m1)} methods raised achievable quality well beyond classical pipelines ${c1}, and engineering practice has followed. Yet the same decade also exposed a persistent mismatch between what papers optimize and what deployments need, particularly around ${challenge}.` });
    B.push({ kind: 'p', text: `Existing approaches built on ${methodLow(m1)} demonstrate strong results under controlled conditions ${c2}, but three practical frictions recur. First, ${challenge} degrades them unpredictably. Second, the pipelines that perform best are heavy, which conflicts with realistic latency and hardware budgets. Third, evaluation conventions differ across studies, making it hard to tell which reported gains are transferable rather than protocol artifacts ${c3}.` });
  }
  B.push({ kind: 'p', text: `In this paper we argue that the missing ingredient is an explicit coupling between representation and adaptation: ${methodLow(m1)} supplies the former, and ${methodLow(m2)} supplies the latter. Concretely, we contribute ${pick(r, CONTRIB_FORMS).replace('{m1}', methodLow(m1)).replace('{m2}', methodLow(m2))}. The design choices are motivated stage by stage in Section 3, and each is individually ablated in Section 5.` });
  B.push({ kind: 'p', text: `An overview of the approach is as follows. The input pipeline normalizes and augments the raw data, the ${methodLow(m1)} encoder extracts structured representations at multiple granularities, and the ${methodLow(m2)} component adapts these representations to the current operating conditions. A compact prediction head then produces the final output, and a calibration stage aligns confidence with observed reliability. The full pipeline trains end to end with standard optimizers and fits modest hardware ${c4}.` });
  if (variant >= 1 && !isReview) B.push({ kind: 'p', text: pick(r, INTRO_EXTRA) });
  B.push({
    kind: 'list', ordered: true, items: [
      `A unified formulation that couples ${methodLow(m1)} with ${methodLow(m2)} for ${ctx.task}, with design decisions justified by ablations rather than intuition.`,
      `A reproducible evaluation protocol spanning ${ctx.dataset}, with baselines retrained under identical budgets.`,
      `Empirical evidence that the proposed approach improves ${metric} by ${ctx.impr}% relative over the strongest baseline while consuming ${resource}.`,
      'An open implementation and a documented sensitivity analysis supporting further research.',
    ],
  });
  B.push({ kind: 'p', text: `The remainder of this paper is organized as follows. Section 2 reviews related work and positions our contribution. Section 3 details the methodology. Section 4 describes the experimental protocol, Section 5 presents results and analysis, and Section 6 concludes with directions for future work.` });

  // ── 2. Literature Review ──
  B.push({ kind: 'h2', text: isReview ? '2. Background and Scope of the Review' : '2. Literature Review' });
  if (isReview) {
    B.push({ kind: 'p', text: `The corpus is organized into three thematic clusters. The first cluster comprises feature-engineering approaches ${c1}: hand-designed descriptors, statistical summaries, and rule-based systems that remain common in regulated industries. The second cluster covers representation learning with ${methodLow(m1)} ${c2}, from shallow autoencoders to modern attention-based encoders. The third cluster, the youngest, couples learning with adaptation - ${methodLow(m2)} strategies that adjust behavior under changing conditions ${c3}.` });
    B.push({ kind: 'p', text: `Across the three clusters, evaluation practice is the weakest link. Roughly ${rint(r, 35, 55)}% of surveyed studies use private or unshared data, and fewer than ${rint(r, 8, 20)}% release code. Reported baselines are frequently re-implementations rather than tuned originals, and studies that measure robustness under shift are a small minority. These conventions inflate apparent progress and make cross-study synthesis uncertain, a problem documented across adjacent fields as well ${c4}.` });
  } else {
    B.push({ kind: 'p', text: `Research on ${ctx.task} spans three methodological generations. Early systems relied on hand-crafted features and shallow models, which remain attractive where data is scarce or interpretability is mandatory ${c1}. The second generation applied ${methodLow(m1)} end to end, absorbing feature engineering into learned representations and raising benchmark quality substantially ${c2}. The current generation emphasizes adaptation and robustness - ${methodLow(m2)}, domain alignment, and calibration - reflecting the recognition that production data distributions move ${c3}.` });
    B.push({ kind: 'p', text: `Within the current generation, two strategies dominate. The first post-processes a strong static model: calibration, ensembling, and drift monitors wrapped around a frozen predictor. This is cheap but cannot recover information the frozen encoder never captured. The second integrates adaptation into the architecture, conditioning internal representations on context; this is our design choice, and Section 5 quantifies its benefit relative to the post-processing strategy under matched budgets ${c4}.` });
    B.push({ kind: 'p', text: `Our contribution differs from prior work in the tightness of the coupling between ${methodLow(m1)} and ${methodLow(m2)}: rather than stacking an adaptive layer on top of a frozen encoder, both components train jointly with a shared objective, and the interface between them is explicitly gated so adaptation cannot destabilize the representational core. Table 1 positions the proposed approach among representative systems.` });
  }
  if (variant >= 1 && !isReview) B.push({ kind: 'p', text: pick(r, LIT_EXTRA) });
  if (variant >= 3) {
    // Deep extension for long papers and reviews: structured review methodology.
    B.push({ kind: 'h3', text: isReview ? '2.1 Review methodology' : '2.1 Scope of prior evaluations' });
    B.push({ kind: 'p', text: `We screened ${rint(r, 320, 940)} candidate records and retained ${rint(r, 88, 160)} studies that report quantitative results on at least one public dataset, describe their experimental protocol in sufficient detail to reproduce, and were published in a peer-reviewed venue between 2010 and 2026. Each retained study was coded along three axes: input representation (raw signals, engineered features, or learned representations), learning strategy (supervised, self-supervised, or hybrid), and evaluation realism (static splits, temporal validation, or online deployment). Coding was performed independently by two annotators, with disagreements resolved by discussion; inter-annotator agreement reached ${rint(r, 82, 93)}% before adjudication.` });
    B.push({ kind: 'p', text: `The geographic and institutional distribution of the retained literature is informative: ${rint(r, 55, 75)}% of studies originate from three countries, fewer than ${rint(r, 6, 15)}% evaluate on data from the Global South, and only ${rint(r, 2, 9)}% release trained models. This concentration matters for generalization claims, because acquisition conditions, demographics, and operational constraints differ systematically across regions. Our own evaluation, which includes data collected in Iran, directly addresses one part of this gap.` });
  }
  B.push({
    kind: 'table',
    caption: 'Table 1. Qualitative positioning of the proposed approach among representative prior systems.',
    headers: ['System family', 'Representative work', 'Handles shift', 'Cost profile', 'Protocol reproducibility'],
    rows: [
      ['Feature engineering', `Classical pipelines for ${ctx.task.slice(0, 28)}…`, 'Partial (manual)', 'Very low', 'Medium'],
      [`${m1} end-to-end`, 'Deep encoders, supervised', 'Weak', 'Medium-high', 'Medium'],
      [`Post-hoc adaptation`, 'Calibration, ensembles', 'Partial', 'Low', 'Medium'],
      [`${m2}-integrated (proposed)`, 'This work', 'Strong (learned)', 'Medium', 'High (released)'],
    ],
  });

  // ── 3. Methodology ──
  B.push({ kind: 'h2', text: '3. Methodology' });
  B.push({ kind: 'h3', text: '3.1 Problem formulation' });
  B.push({ kind: 'p', text: `Let x denote an observation drawn from the operational environment and y the target associated with it. The task is to learn a mapping f from inputs to predictions that minimizes expected task loss under the deployment distribution, which differs from the training distribution in ways that are partly observable through side information. We therefore model the predictor as f(x; theta, z), where theta are learned parameters and z is the adaptation context derived by the ${methodLow(m2)} component. The optimization objective combines the task loss with a regularization term that penalizes deviation of f(·; theta, z) from the nominal predictor, keeping adaptation stable and auditable ${c5}.` });
  B.push({ kind: 'eq', text: 'L(theta, z) = E_[x,y] ( loss( f(x; theta, z), y ) ) + lambda * || z - z_nominal ||^2', label: '(1)' });
  B.push({ kind: 'p', text: `Equation (1) makes the stability requirement explicit: adaptation is free to move predictions, but large deviations are penalized with weight lambda = ${ (0.05 + r() * 0.2).toFixed(2) }, tuned on validation data. This formulation matches the operational requirement that behavior changes be explainable and bounded, and it degrades cleanly to the static predictor when context is uninformative.` });
  B.push({ kind: 'h3', text: '3.2 Architecture overview' });
  B.push({ kind: 'p', text: `The architecture has three stages. The encoder, built from ${methodLow(m1)} components, maps raw inputs to a structured representation at multiple granularities; its width and depth follow the scaling schedule described below. The adaptation stage consumes the representation plus context features and produces modulated features through a gated mechanism - a learned gate initialized near zero admits adaptive behavior gradually during training, which we found stabilizes optimization ${c6}. The head is deliberately small (two layers), so that the representational and adaptive stages carry the modeling load and the head cannot overfit.` });
  B.push({ kind: 'p', text: `Two engineering details matter in practice. First, normalization uses group rather than batch statistics, since batch statistics couple examples in ways that harm calibration when inputs are heterogeneous. Second, all stochastic components are seeded independently so that any result can be attributed to its exact configuration - a small discipline that saved considerable debugging time and is preserved in the released code.` });
  B.push({ kind: 'eq', text: 'h_out = h_enc + g * W_v * sigma( W_k * h_enc + W_q * z ),   g = sigmoid( alpha ),  alpha init 0.1', label: '(2)' });
  B.push({ kind: 'p', text: `Equation (2) specifies the gated modulation: h_enc is the encoder output, z the context embedding, and g a learned gate per channel. The design follows the intuition that adaptation should be additive and reversible; when the gate closes, the system is exactly the static ${methodLow(m1)} model, which is also the fallback in production if the context stream fails.` });
  B.push({ kind: 'fig', caption: 'Fig. 1. Overview of the proposed pipeline. Inputs are normalized and augmented; the encoder produces multi-granularity representations; the gated adaptation stage modulates them using context; a compact head produces predictions, followed by calibration.', description: 'Left-to-right diagram: input block, encoder stack, gated adaptation module receiving context features, prediction head, and calibration output.' });
  B.push({ kind: 'h3', text: '3.3 Training procedure' });
  B.push({ kind: 'p', text: `Training proceeds in two phases. In the first phase, the pipeline trains on the nominal distribution with augmentation drawn from realistic perturbations, using AdamW, a cosine learning-rate schedule, and early stopping on validation loss. In the second phase, adaptation is enabled and the model trains on the shifted or context-rich splits, with the stability penalty of Equation (1) active. Data augmentation choices follow the task conventions: geometric and intensity augmentations for perceptual inputs, masking and jittering for temporal inputs, and back-translation or paraphrase for textual inputs ${c5}.` });
  B.push({
    kind: 'table',
    caption: 'Table 2. Training configuration used for all reported results.',
    headers: ['Item', 'Value', 'Item', 'Value'],
    rows: [
      ['Optimizer', 'AdamW', 'Learning rate', `3e-4, cosine decay`],
      ['Batch size', `${rint(r, 32, 128)}`, 'Warmup', '10% of steps'],
      ['Phase 1 epochs', `${rint(r, 60, 120)}`, 'Phase 2 epochs', `${rint(r, 20, 50)}`],
      ['Stability weight lambda', `${(0.05 + r() * 0.2).toFixed(2)}`, 'Seeds per config', `${nSeeds}`],
    ],
  });
  if (variant >= 2) {
    B.push({ kind: 'h3', text: '3.4 Complexity and implementation notes' });
    B.push({ kind: 'p', text: `The computational profile is favorable. Training complexity is linear in the number of examples with a constant factor dominated by the encoder; the adaptation stage adds only ${rint(r, 4, 12)}% overhead because its bottleneck projections are low-rank. Inference cost is similarly modest: the full pipeline answers in ${rint(r, 8, 25)} ms per batch on a single mid-range GPU and ${rint(r, 30, 90)} ms on server-class CPUs, comfortably within interactive budgets. Memory occupancy after 8-bit quantization is roughly ${rint(r, 8, 26)} MB, which permits deployment adjacent to the data source rather than in a separate serving tier.` });
    B.push({ kind: 'p', text: `Implementation notes for practitioners: the gate initialization of Equation (2) should not be set to one - early training then chases adaptation noise before the encoder is meaningful; the stability penalty should be annealed rather than fixed if the second training phase is short; and the calibration stage must be refit whenever the upstream data pipeline changes, a rule violated more often than any modeling error in our deployment experience.` });
  }

  // ── 4. Experimental Setup ──
  B.push({ kind: 'h2', text: '4. Experimental Setup' });
  B.push({ kind: 'p', text: `Datasets. We evaluate on ${ctx.dataset}, split chronologically or by held-out groups to prevent leakage; the final split never shares entities, sessions, or time periods with training data. Preprocessing follows the conventions of each source, is applied identically to all systems, and is documented in the released configuration files so that the exact splits can be reconstructed.` });
  B.push({ kind: 'p', text: pick(r, BASELINE_SENT).replace('{k}', String(kBaselines)) });
  B.push({ kind: 'p', text: pick(r, METRIC_SENTS) });
  B.push({ kind: 'p', text: pick(r, IMPL_SENTS) });

  // ── 5. Results and Discussion ──
  B.push({ kind: 'h2', text: '5. Results and Discussion' });
  B.push({ kind: 'h3', text: '5.1 Main results' });
  B.push({ kind: 'p', text: `Table 3 reports the main comparison. The proposed pipeline reaches ${ctx.acc}% ${metric} and an F1 of ${ctx.f1} on the primary dataset, improving the strongest retrained baseline by ${ctx.impr}% relative while using ${resource}. All improvements are consistent across ${nSeeds} seeds, with standard deviations below 0.3 points, and paired bootstrap tests attribute significance at p < 0.05 for every baseline comparison. Gains concentrate on the difficult subsets - minority classes and high-entropy periods - which is where the adaptation component earns its contribution.` });
  B.push({
    kind: 'table',
    caption: 'Table 3. Main results on the primary dataset (mean over ' + nSeeds + ' seeds; best in bold).',
    headers: ['Model', 'Accuracy %', 'F1', 'Params (M)', 'Latency (ms)'],
    rows: [
      ['Classical baseline', (ctx.acc - 9.4 - r() * 3).toFixed(1), (ctx.f1 - 0.09).toFixed(2), '0.4', '2.1'],
      ['Shallow learner', (ctx.acc - 7.1 - r() * 2).toFixed(1), (ctx.f1 - 0.07).toFixed(2), '1.2', '3.4'],
      [`${m1} (static)`, (ctx.acc - 3.2 - r() * 1.2).toFixed(1), (ctx.f1 - 0.035).toFixed(2), `${rint(r, 4, 18)}.${rint(r, 1, 9)}`, `${rint(r, 8, 22)}`],
      [`${m1} + post-hoc calibration`, (ctx.acc - 2.1 - r() * 0.9).toFixed(1), (ctx.f1 - 0.024).toFixed(2), `${rint(r, 4, 18)}.${rint(r, 1, 9)}`, `${rint(r, 9, 24)}`],
      [`${m2} variant`, (ctx.acc - 1.6 - r() * 0.8).toFixed(1), (ctx.f1 - 0.019).toFixed(2), `${rint(r, 6, 24)}.${rint(r, 1, 9)}`, `${rint(r, 11, 28)}`],
      ['Proposed pipeline', `${ctx.acc.toFixed(1)}`, `${ctx.f1.toFixed(2)}`, `${rint(r, 6, 24)}.${rint(r, 1, 9)}`, `${rint(r, 10, 26)}`],
    ],
    note: 'Latency is single-batch CPU inference, measured over 1,000 runs after warm-up.',
  });
  B.push({ kind: 'h3', text: '5.2 Robustness and secondary analyses' });
  B.push({ kind: 'p', text: pick(r, FINDING_SENTS).replace('{m1}', methodLow(m1)).replace('{m2}', methodLow(m2)).replace('{impr}', String(ctx.impr)).replace('{metric}', metric).replace('{resource}', resource) });
  if (variant >= 1) B.push({ kind: 'p', text: pick(r, RES_EXTRA) });
  if (variant >= 3) {
    B.push({ kind: 'p', text: `To probe generality, we repeat the comparison on the secondary datasets and on two difficulty-stratified subsets. The ranking of systems is preserved across datasets, though margins compress where data is abundant - consistent with the view that adaptation matters most exactly where data or coverage is limited. Statistical significance holds for all comparisons against the strongest baseline (paired bootstrap, p < ${ (0.01 + r() * 0.04).toFixed(2) }).` });
    B.push({
      kind: 'table',
      caption: 'Table 5. Cross-dataset generalization of the proposed pipeline versus the strongest baseline.',
      headers: ['Dataset', 'Baseline ' + metric + ' %', 'Proposed ' + metric + ' %', 'Relative gain %'],
      rows: [
        ['Primary dataset', (ctx.acc - ctx.impr).toFixed(1), ctx.acc.toFixed(1), `${ctx.impr}`],
        ['Secondary dataset A', (ctx.acc - 4.2 - r() * 2).toFixed(1), (ctx.acc - 2.1 - r()).toFixed(1), `${(1 + r() * 2).toFixed(1)}`],
        ['Secondary dataset B', (ctx.acc - 5.6 - r() * 2).toFixed(1), (ctx.acc - 2.9 - r()).toFixed(1), `${(1.4 + r() * 2).toFixed(1)}`],
        ['Hard subset (tail)', (ctx.acc - 8.9 - r() * 3).toFixed(1), (ctx.acc - 3.8 - r()).toFixed(1), `${(2.5 + r() * 2).toFixed(1)}`],
      ],
      note: 'Relative gain is computed on the error complement so that improvements remain comparable across datasets.',
    });
    B.push({ kind: 'p', text: `Beyond aggregate numbers, three qualitative observations summarize what the extension buys. First, on borderline inputs the adaptive pathway shifts decisions toward the class supported by contextual evidence, which is the statistically correct behavior even when individual flips are hard to eyeball. Second, the calibration improvement means downstream consumers can threshold on confidence without per-deployment tuning. Third, the stability penalty keeps the behavior auditable: when we diff predictions between the static and adapted configurations, disagreements localize to inputs with genuine ambiguity rather than scattering across the score distribution.` });
  }
  B.push({ kind: 'p', text: `Robustness diagnostics support the same reading. Under input perturbations of realistic magnitude, quality degrades by ${ (2 + r() * 4).toFixed(1) } points for the proposed pipeline versus ${ (5 + r() * 4).toFixed(1) } for the static encoder, and the calibration error improves from ${(0.06 + r() * 0.05).toFixed(3)} to ${(0.02 + r() * 0.02).toFixed(3)}, meaning confidence estimates become usable for downstream decisions such as selective prediction or human escalation.` });
  B.push({ kind: 'h3', text: '5.3 Ablation study' });
  B.push({ kind: 'p', text: `Table 4 dissects the contribution of each component. The adaptation stage is the single most valuable element, followed by the augmentation scheme and the gated interface; removing the stability penalty does not change headline accuracy but increases variance across seeds by a factor of three, an unacceptable production profile even at equal average quality.` });
  B.push({
    kind: 'table',
    caption: 'Table 4. Ablation study (primary dataset, ' + nSeeds + '-seed means).',
    headers: ['Variant', `Accuracy %`, 'F1', 'Notes'],
    rows: [
      ['Full pipeline', ctx.acc.toFixed(1), ctx.f1.toFixed(2), 'Reference'],
      ['No adaptation stage', (ctx.acc - 3.1 - r() * 1).toFixed(1), (ctx.f1 - 0.031).toFixed(2), 'Static encoder only'],
      ['No augmentation', (ctx.acc - 2.2 - r() * 0.8).toFixed(1), (ctx.f1 - 0.021).toFixed(2), 'Largest drop on minority classes'],
      ['No gate (always-on adaptation)', (ctx.acc - 1.1 - r() * 0.5).toFixed(1), (ctx.f1 - 0.012).toFixed(2), 'Unstable across seeds'],
      ['No stability penalty', (ctx.acc - 0.2).toFixed(1), (ctx.f1 - 0.002).toFixed(2), 'Seed variance triples'],
    ],
  });
  B.push({ kind: 'p', text: pick(r, ABLATION_SENTS).replace('{m2}', methodLow(m2)).replace('{drop}', drop).replace('{drop2}', drop2).replace('{metric}', metric) });
  B.push({ kind: 'fig', caption: 'Fig. 2. Behavior of the proposed pipeline versus the strongest baseline across evaluation periods. The proposed approach tracks the target more closely during the shifted periods (shaded), which drive the aggregate gains of Table 3.', description: 'Two-panel line chart over evaluation periods: predicted versus realized quality for the proposed pipeline and the strongest baseline, with shaded shift periods.' });
  B.push({ kind: 'h3', text: '5.4 Limitations' });
  B.push({ kind: 'p', text: pick(r, LIMIT_SENTS) });
  B.push({ kind: 'p', text: `Second, the evaluation metrics, though standard, compress information: deployment value depends on the joint distribution of errors and costs, which we summarize only partially through the class-conditional and period-conditional analyses. A third limitation concerns scale - the largest configuration fits a single GPU, and behavior at multi-node training scale is extrapolated rather than measured. We consider these acceptable for the claims made, and we state them explicitly so that replications can target them directly.` });

  // Review-only thematic synthesis extends the paper further.
  if (isReview) {
    B.push({ kind: 'h3', text: '5.5 Thematic synthesis' });
    B.push({ kind: 'p', text: `Synthesizing across the retained studies, four themes dominate the evidence. Theme one: representation choices explain more of the between-study variance than learning algorithms themselves - studies using learned representations outperform feature-engineered counterparts by ${rint(r, 6, 14)}% on average at comparable budgets. Theme two: evaluation realism is the strongest predictor of reported failure; studies with temporal or online validation report ${rint(r, 20, 40)}% lower headline metrics than static-split studies of similar architecture, an uncomfortable but consistent pattern.` });
    B.push({ kind: 'p', text: `Theme three: hybrid designs that couple ${methodLow(m1)} with explicit adaptation (${methodLow(m2)} family) occupy most of the Pareto frontier in our normalized comparison, which corroborates the design position taken by this and related empirical works. Theme four: reproducibility infrastructure - released code, splits, and configurations - has improved markedly since 2020, yet fewer than a fifth of studies provide all three, leaving ample room for consolidation work of exactly the kind this special section collects.` });
    B.push({
      kind: 'table',
      caption: 'Table 6. Thematic summary of the reviewed literature (share of retained studies and dominant findings).',
      headers: ['Theme', 'Share of studies', 'Dominant finding', 'Maturity'],
      rows: [
        ['Representation learning', `${rint(r, 38, 52)}%`, 'Learned representations beat hand-crafted features at equal budget', 'High'],
        ['Evaluation realism', `${rint(r, 18, 30)}%`, 'Static splits overstate performance by 20-40%', 'Medium'],
        ['Adaptive / hybrid designs', `${rint(r, 14, 26)}%`, 'Coupled adaptation dominates the accuracy-cost frontier', 'Emerging'],
        ['Reproducibility practice', `${rint(r, 8, 18)}%`, 'Full artifact release remains below one fifth of studies', 'Low'],
      ],
    });
  }

  // ── 6. Conclusion ──
  B.push({ kind: 'h2', text: '6. Conclusion' });
  B.push({ kind: 'p', text: `This paper presented a pipeline that couples ${methodLow(m1)} with ${methodLow(m2)} for ${ctx.task}, with a gated, stability-regularized interface between representation and adaptation. The evaluation - ${ctx.dataset}, retrained baselines, ${nSeeds} seeds, and component-level ablations - supports the central claim: explicit, bounded adaptation of a strong representation improves ${metric} by ${ctx.impr}% relative over the strongest baseline while consuming ${resource}, and improves robustness and calibration as well. The released implementation is intended as a reproducible reference point.` });
  B.push({ kind: 'p', text: `Future work follows three threads. First, extending the adaptation stage to longer horizons and richer context streams, where the stability machinery of Equation (1) should face its hardest tests. Second, compressing the pipeline for embedded targets, since the ablations indicate that most of the gain survives aggressive quantization. Third, longitudinal deployment studies with operational partners, because the ultimate criterion for ${ctx.task} is behavior in production rather than on any benchmark, however carefully constructed.` });

  return B;
}

// ── page estimation ──────────────────────────────────────────────────────────
// Calibrated against the actual PDF renderer so displayed page ranges match
// the generated PDFs (~700 words per content page at 10.5pt/14.2 leading).
export function estimatePdfPages(blocks: PaperBlock[], type: string, nRefs: number): number {
  let words = 0, tables = 0, figs = 0, eqs = 0;
  for (const b of blocks) {
    if (b.kind === 'p') words += b.text.split(/\s+/).length;
    else if (b.kind === 'list') words += b.items.join(' ').split(/\s+/).length;
    else if (b.kind === 'table') tables += 1 + Math.max(0, b.rows.length - 5) * 0.12;
    else if (b.kind === 'fig') figs += 1;
    else if (b.kind === 'eq') eqs += 1;
  }
  const pages = 0.9 /* front matter */ + words / 700 + tables * 0.3 + figs * 0.24 + eqs * 0.07 + nRefs * 0.042;
  const min = 6;
  const max = 13;
  return Math.max(min, Math.min(max, Math.round(pages)));
}
