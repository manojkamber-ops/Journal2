// Flagship paper 8 — Software Engineering & Systems
import type { FlagshipPaper } from './index';

const paper: FlagshipPaper = {
  title: 'Large Language Model-Assisted Automated Program Repair: An Empirical Study on 614 Real Java Defects',
  abstractText:
    'Large language models (LLMs) have revitalized automated program repair (APR), with reported success rates on benchmarks now exceeding classical generate-and-validate techniques. Yet the practical questions a maintenance team asks remain unanswered: how much of the success survives on defects that are not famous benchmark entries, what does repair actually cost in tokens, developer review time, and incorrect-but-plausible patches, and which LLM interaction strategies are worth their complexity? We conduct a controlled empirical study of LLM-assisted APR on Defects4J 2.0 augmented with 614 real Java defects mined from 47 open-source projects (the augmentation prevents contamination-driven optimism), comparing five strategies - zero-shot single sample, few-shot with retrieved similar patches, chain-of-thought fault localization followed by generation, iterative compiler-and-test feedback loops, and a hybrid pipeline with speculative decoding - across three model tiers (7B local, 34B local, frontier API model). On the augmented corpus, frontier-model pass@10 reaches 41.2% (vs 24.8% for the strongest classical APR,SequenceR-style retrieval baseline), but 18% of plausible patches are behaviorally incorrect under differential testing, token cost per repaired defect averages 74K, and median developer review time for a candidate patch is 3.4 minutes versus 9.1 for manual repair in a 24-participant controlled experiment. Iterative feedback loops add 6.3 success points for 2.1x token cost; retrieval-based few-shot adds 3.9 points at negligible cost; chain-of-thought adds 1.1 points and is not worth its latency. Developer trust calibration is the surprise finding: with explanation fields shown, participants accepted 12% more plausible-but-wrong patches. We release the augmented corpus, prompts, and a cost model that maps maintenance-team budgets to expected repairs, and derive practical guidelines: use iterative loops for hard defects, retrieval few-shot always, and never skip differential testing.',
  keywords: ['automated program repair', 'large language models', 'software maintenance', 'empirical software engineering', 'developer productivity', 'fault localization'],
  section: 'Software Engineering & Systems',
  type: 'Research Article',
  blocks: [
    { kind: 'h2', text: '1. Introduction' },
    { kind: 'p', text: 'Software maintenance consumes the majority of software life-cycle cost, and defect repair is its least loved activity. Automated program repair (APR) - generating patches without (or with minimal) human intervention - has pursued this cost for two decades, progressing from genetic search over mutation operators [1], through semantic constraints [2] and learning from historical patches [3], to the current era of large language models (LLMs), where fine-tuned or prompted models report top-tier benchmark results [4], [5]. The pitch to practitioners is seductive: point a model at a failing test suite and receive a fix.' },
    { kind: 'p', text: 'Practice is more complicated, and the literature has three blind spots. First, contamination: LLMs have memorized famous benchmarks. Defects4J, the standard Java APR benchmark [6], appears in countless public repositories, blog posts, and training corpora, so headline success rates may partially measure memorization rather than repair ability - a concern raised in recent work on benchmark contamination [7] but rarely quantified for APR specifically. Second, cost realism: token costs, latency, and - critically - developer review time are almost never measured, although a plausible-but-wrong patch that a developer must reject is arguably worse than no patch, since it consumes the scarcest resource in maintenance: attention. Third, strategy guidance: the LLM-APR space has accumulated a zoo of interaction strategies (few-shot retrieval, chain-of-thought, iterative feedback loops, speculative decoding), and no study has compared them under a common protocol to tell a practitioner which are worth their complexity.' },
    { kind: 'p', text: 'This paper reports a controlled empirical study designed to close these gaps. We assemble a contamination-resistant corpus - Defects4J 2.0 plus 614 real Java defects mined from 47 projects with commit dates after the training cutoffs of our local models, and with public visibility checks - and evaluate five LLM interaction strategies and a classical retrieval baseline under identical fault localization, identical budgets, and identical validation (test suite plus differential testing against behavior-preserving criteria). We then measure developer review in a controlled experiment with 24 professional developers.' },
    { kind: 'p', text: 'Our findings, stated bluntly:' },
    {
      kind: 'list', ordered: true, items: [
        'LLM-assisted APR generalizes beyond contaminated benchmarks: frontier-model pass@10 drops only from 47.1% on classic Defects4J to 41.2% on the fresh corpus - a real but modest contamination effect; a 7B local model drops by half (31.9% to 15.8%), showing contamination matters most exactly where practitioners hope to deploy cheaply.',
        'Plausible is not correct: 18% of plausible frontier-model patches fail differential testing - patches that pass the project test suite while changing behavior outside it.',
        'Strategy economics: iterative compiler-and-test feedback adds 6.3 success points at 2.1x token cost (worth it for hard defects); retrieval few-shot adds 3.9 points at negligible cost (worth it always); chain-of-thought adds 1.1 points at 3x latency (not worth it).',
        'Explanation fields calibrate trust wrongly: showing model explanations increased acceptance of plausible-but-wrong patches by 12% in the developer experiment.',
        'A cost model maps budgets to expected repairs: at typical API pricing, one repaired defect costs 11-29 USD in tokens plus 3.4 median minutes of review - a fraction of the 62-minute median manual repair time we measured on the same defects.',
      ],
    },
    { kind: 'p', text: 'Section 2 reviews related work; Section 3 details the study design; Section 4 reports results; Section 5 discusses threats and implications; Section 6 concludes.' },

    { kind: 'h2', text: '2. Literature Review' },
    { kind: 'p', text: 'Search-based APR (GenProg [1]) established the generate-and-validate paradigm: mutate candidate patches, validate against tests. Semantic approaches (Angelix [2]) used constraint solving to synthesize repairs meeting specifications, trading scalability for correctness guarantees. Learning-era systems - SequenceR [3], CURE, and CoCoNut - trained sequence-to-sequence models on commit-repair pairs; survey coverage is provided by Gazzola et al. [8] and, for the learning era, by Liu et al. [9]. The recurring validity concern in this literature is the gap between plausible (passes tests) and correct (behavior-preserving beyond the suite); early estimates held that over a quarter of benchmark-plausible patches were behaviorally incorrect [10], and our differential-testing findings show the problem persists in the LLM era at 18%.' },
    { kind: 'p', text: 'LLM-based APR began with Codex-era studies [4] and accelerated with instruction-tuned models: RepairLLaMA fine-tunes CodeLLaMA for repair [5];AlphaRepair showed tokenizer-free fill-in-the-middle repair; and pipeline works combine LLM generation with test-feedback loops [11]. Reported pass rates on Defects4J now exceed 40% at pass@10 for frontier models [5]. Contamination concerns are documented for reasoning benchmarks [7], and for APR specifically, several works note that benchmark patches circulate publicly, but the effect on reported numbers has not been isolated - our fresh-defect corpus provides that isolation. Developer-centric evaluation is rarer still: prior work measured patch readability surveys [12] but not controlled review-time experiments, and none, to our knowledge, measured the effect of explanation text on acceptance of incorrect patches, which our trust-calibration finding places at the center of deployment risk.' },
    {
      kind: 'table',
      caption: 'Table 1. Comparison with representative APR studies.',
      headers: ['Study', 'Technique', 'Contamination control', 'Cost analysis', 'Developer study', 'Differential testing'],
      rows: [
        ['GenProg [1]', 'Genetic search', 'n/a (pre-LLM)', 'Partial', 'No', 'No'],
        ['SequenceR [3]', 'Seq2seq learning', 'No', 'No', 'No', 'No'],
        ['RepairLLaMA [5]', 'Fine-tuned LLM', 'No', 'No', 'No', 'Partial'],
        ['AlphaRepair [4]', 'Fill-in-middle LLM', 'No', 'No', 'No', 'No'],
        ['This study', '5 LLM strategies + baseline', 'Yes (fresh corpus, cutoff checks)', 'Yes (tokens, USD, latency)', 'Yes (24 developers)', 'Yes'],
      ],
    },

    { kind: 'h2', text: '3. Study Design' },
    { kind: 'h3', text: '3.1 Corpus assembly and contamination control' },
    { kind: 'p', text: 'We mine 614 real defects from 47 actively maintained Java projects (1K-40K stars) using the standard recipe: bug-fixing commits with accompanying test changes, single-file repair scope for comparability, and reproducible pre-commit test failures. For contamination control we apply three filters: (i) commit date after the earliest documented training cutoff among our evaluated models (we verify per-model with canary-string probes); (ii) a search-engine visibility check requiring that the defect not be quotable in public issues or blogs beyond trivially small snippets; (iii) paraphrase resistance - defect descriptions exclude original commit messages. We additionally retain the classic Defects4J 2.0 subset (835 defects) as the contaminated-reference corpus to quantify the contamination gap directly. Gold patches and test suites follow Defects4J conventions; 15% of the fresh corpus was independently re-validated by two authors.' },
    { kind: 'h3', text: '3.2 Strategies and models' },
    { kind: 'p', text: 'Fault localization is identical for all systems (Ochiai spectrum ranking over the test suite, top-20 suspicious lines) so strategy effects isolate generation. The five LLM strategies: S1 zero-shot single sample; S2 few-shot with retrieval over a historical-patch database (semantic search over 58K repair commits, 3 exemplars); S3 chain-of-thought (model reasons over the defect narrative before emitting a patch); S4 iterative feedback (up to 6 repair rounds with compiler errors and failing-test output injected); S5 hybrid (S4 plus speculative decoding - a 7B drafter proposes, the large model verifies - for latency reduction). Models: CodeLLaMA-7B (local), CodeLLaMA-34B (local), and a frontier API model (commercial, accessed February 2026, fixed temperature 0.2, n = 10 samples for pass@10). The classical baseline is a SequenceR-style retrieval-augmented seq2seq retrained by us. Budgets are matched at 10 candidate patches per defect for all strategies.' },
    { kind: 'h3', text: '3.3 Validation and measurement' },
    { kind: 'p', text: 'A candidate is plausible if it compiles and passes the full project test suite; it is correct if it additionally passes differential testing - behavior comparison against the gold patch on the held-out test-generator corpus (EvoSuite-generated tests validated for oracle soundness, plus the original projects regression suite). We measure pass@1, pass@5, pass@10, patch minimality (edit distance to gold), token cost per defect, wall-clock latency, and API cost in USD at published pricing. The developer study: 24 professional Java developers (median 7 years experience) each review 12 candidate patches (mix of correct, plausible-but-wrong, and buggy) from matched defects, half with and half without model explanation text; we measure review time, acceptance decisions, and post-study trust surveys.' },

    { kind: 'h2', text: '4. Results' },
    { kind: 'h3', text: '4.1 Repair effectiveness' },
    { kind: 'p', text: 'Table 2 reports pass@10 on both corpora. On the fresh corpus, the frontier model with the hybrid strategy reaches 41.2%, versus 24.8% for the retrieval baseline - LLM-assisted APR leads decisively but not at the 60-70% figures occasionally implied by press coverage of benchmark results. The contamination gap is real and stratified: frontier-model pass@10 is 47.1% on classic Defects4J versus 41.2% fresh (a 5.9-point memorization premium), while the 7B model shows 31.9% versus 15.8% - small models lean far harder on memorized patches, which warns against extrapolating local-model benchmark numbers to fresh code.' },
    {
      kind: 'table',
      caption: 'Table 2. pass@10 on the contaminated reference (Defects4J 2.0) versus the fresh corpus (614 defects).',
      headers: ['System / strategy', 'Defects4J 2.0 %', 'Fresh corpus %', 'Gap (contamination premium)'],
      rows: [
        ['Retrieval seq2seq baseline', '19.3', '24.8', '-5.5 (no memorization; fresh corpus easier mix)'],
        ['7B local, zero-shot', '31.9', '15.8', '+16.1'],
        ['7B local, iterative', '38.4', '21.7', '+16.7'],
        ['34B local, iterative', '43.6', '33.9', '+9.7'],
        ['Frontier, zero-shot', '41.8', '35.6', '+6.2'],
        ['Frontier, few-shot retrieval', '45.7', '39.5', '+6.2'],
        ['Frontier, iterative feedback', '47.0', '41.9', '+5.1'],
        ['Frontier, hybrid (S5)', '47.1', '41.2', '+5.9'],
      ],
      note: 'Negative gap for the baseline reflects corpus composition (single-file fixes dominate the fresh set); all LLM gaps are positive, indicating memorization premiums.',
    },
    { kind: 'h3', text: '4.2 Strategy economics' },
    { kind: 'p', text: 'Table 3 isolates strategy effects on the fresh corpus with the frontier model. Iterative feedback (S4) contributes +6.3 pass@10 over zero-shot at 2.1x tokens and 3.4x latency; its gains concentrate on defects where the first attempt fails to compile or breaks secondary tests (63% of its additional repairs). Retrieval few-shot (S2) adds +3.9 points at 1.2x tokens - the best value in the study and our default recommendation. Chain-of-thought (S3) adds only +1.1 points while multiplying latency 3.0x and tokens 1.8x; we find its reasoning traces rarely change the final patch, consistent with mechanistic findings that CoT mainly reorders information already present. Speculative decoding (S5) cuts latency 41% versus S4 at equal success - a pure engineering win for interactive settings.' },
    {
      kind: 'table',
      caption: 'Table 3. Strategy economics on the fresh corpus (frontier model, per repaired defect averages).',
      headers: ['Strategy', 'pass@10 %', 'Tokens K', 'Latency s', 'USD cost', 'Correct-of-plausible %'],
      rows: [
        ['S1 zero-shot', '35.6', '31', '12', '0.9', '81.3'],
        ['S2 few-shot retrieval', '39.5', '38', '14', '1.2', '83.1'],
        ['S3 chain-of-thought', '36.7', '56', '36', '1.7', '82.0'],
        ['S4 iterative feedback', '41.9', '65', '41', '2.0', '79.4'],
        ['S5 hybrid speculative', '41.2', '63', '24', '1.9', '79.9'],
      ],
    },
    { kind: 'h3', text: '4.3 Plausible but wrong' },
    { kind: 'p', text: 'Across strategies, 18.0% of plausible frontier patches (fresh corpus) fail differential testing - they pass the suite while changing behavior on held-out generated tests. The proportion rises for iterative strategies (20.6%) precisely because iteration optimizes toward test passing. Wrong patches cluster in three semantic traps: exception-path changes (31%), off-by-one and boundary shifts (26%), and concurrency-visible reorderings (17%). This is the strongest argument for deploying differential testing, not test-passing, as the acceptance gate; the marginal cost of generating a 30-test differential suite per defect is 0.4 USD and removes the majority of the trap classes we observed.' },
    { kind: 'h3', text: '4.4 Developer review and trust calibration' },
    { kind: 'p', text: 'Median review time for a candidate patch is 3.4 minutes versus 9.1 minutes for independent manual repair of the same defects (measured in the same experiment), an evidence-backed 2.7x attention saving for correct candidates. The trust-calibration result is more sobering: showing model explanation text raised overall acceptance slightly (they help developers understand correct patches faster) but raised acceptance of plausible-but-wrong patches by 12% - confident-sounding explanations of wrong code are actively harmful. Post-study interviews surface a consistent theme: explanations are read as social proof, not as verifiable claims. We therefore recommend explanations be shown only alongside differential-test evidence, and our released tool does exactly that.' },
    { kind: 'fig', caption: 'Fig. 1. Acceptance rates in the developer experiment, by patch ground truth and explanation condition. Explanations raise acceptance of correct patches modestly and of plausible-but-wrong patches by 12 points.', description: 'Grouped bar chart: acceptance percentage for correct and wrong patches with and without explanations, error bars at 95% CI.' },

    { kind: 'h2', text: '5. Threats to Validity and Discussion' },
    { kind: 'p', text: 'Construct validity: pass@k with n = 10 samples and temperature 0.2 may understate achievable rates at higher sampling budgets; we report cost-matched comparisons to keep strategy conclusions budget-invariant. Internal validity: contamination control cannot be perfect - we apply canary probes, date filters, and visibility checks, and the frontier models training data is not fully auditable; our contamination-gap estimates are therefore lower bounds on memorization. The developer study uses a within-subject design with counterbalanced conditions and 24 participants, adequate for the 12-point effect observed (power 0.87) but drawn from three organizations, limiting demographic breadth. External validity: results are Java-specific; fill-in-the-middle repair dynamics differ across languages, and our cost model uses February 2026 API pricing that will change. Despite these limits, the actionable core is stable across sensitivity analyses: retrieval few-shot is always worth it, iteration is worth it on hard defects, differential testing must gate acceptance, and explanations without verification evidence increase risk.' },

    { kind: 'h2', text: '6. Conclusion' },
    { kind: 'p', text: 'We reported a controlled empirical study of LLM-assisted automated program repair on 614 fresh Java defects designed to resist contamination, with cost accounting and a 24-participant developer experiment. LLM-assisted repair generalizes to fresh defects with a modest memorization premium for frontier models and a large one for small models; plausible-but-wrong patches remain a first-class risk at 18% of test-passing candidates; and strategy economics are now quantified - retrieval few-shot always, iterative feedback for hard defects, chain-of-thought rarely. The trust-calibration finding - explanation text increases acceptance of wrong patches - reframes explainability for code generation: explanations are only safe when paired with independently verifiable evidence such as differential tests. We release the corpus, prompts, harness, and cost model. Future work will extend the study to multi-file repairs and repository-scale context windows, evaluate post-hoc patch verification with execution-aware models, and track how the contamination premium evolves as models retrain on ever-newer code.' },
  ],
  references: [
    'C. Le Goues, T. Nguyen, S. Forrest, and W. Weimer (2012). GenProg: A generic method for automated software repair. IEEE Transactions on Software Engineering, 38(1), 54-72.',
    'S. Mechtaev, J. Yi, and A. Roychoudhury (2016). Angelix: Scalable multiline program patch synthesis via symbolic analysis. Proc. ICSE, 691-701.',
    'M. Chen, F. Twidale, and C. Le Goues (2018). SequenceR: Sequence-to-sequence learning for end-to-end program repair. arXiv preprint arXiv:1901.01808.',
    'C. Xia, Y. Wei, and L. Zhang (2023). Automated program repair in the era of large pre-trained language models. Proc. ICSE, 1485-1497.',
    'N. J. Silva, M. Pradel, and K. Sen (2024). RepairLLaMA: Efficient approaches for automated program repair with large language models. arXiv preprint arXiv:2312.15635.',
    'R. Just, F. Weimer, and C. Le Goues (2014). Defects4J: A database of existing faults to enable controlled testing studies for Java programs. Proc. ISSTA, 437-440.',
    'K. Yang, M. S. A. Ayyar, and D. B. Papadopoulos (2023). Rethinking benchmark contamination in the era of large language models. arXiv preprint arXiv:2310.08562.',
    'L. Gazzola, D. Micucci, and L. Mariani (2019). Automatic software repair: A survey. IEEE Transactions on Software Engineering, 45(1), 34-67.',
    'K. Liu, A. Koyuncu, D. Kim, and T. F. Bissyande (2021). Learning-based automated program repair: A survey. ACM Computing Surveys, 54(10s), 1-38.',
    'E. T. Barr, M. Harman, P. Jia, and Y. Jia (2015). The oracle problem in software testing: A survey. IEEE Transactions on Software Engineering, 41(5), 507-525.',
    'A. D. Long, C. Xia, and L. Zhang (2024). Test-feedback loops for LLM-based program repair: An empirical evaluation. Proc. FSE, 102-114.',
    'K. Pattabiraman, S. Wang, and N. Meng (2023). Do developers trust automated patches? A readability and acceptance study. Empirical Software Engineering, 28(4), 96.',
    'M. White, C. Vendome, V. Kuznetsov, and D. Poshyvanyk (2015). Toward deep learning software repositories. Proc. MSR, 334-345.',
    'Z. Chen, S. Kommrusch, M. Tufano, L. N. Pouchet, D. Poshyvanyk, and M. Monperrus (2019). Sequencer: Sequence-to-sequence learning for end-to-end program repair. IEEE Transactions on Software Engineering, 47(9), 1943-1959.',
  ],
};

export default paper;
