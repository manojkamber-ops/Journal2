// Flagship paper 6 — Health & Bioinformatics
import type { FlagshipPaper } from './index';

const paper: FlagshipPaper = {
  title: 'Multi-Scale Wavelet-Graph Attention Network for ECG Arrhythmia Classification',
  abstractText:
    'Electrocardiogram (ECG) arrhythmia classification has reached high benchmark accuracy, but three clinical realities remain unsolved by the standard deep pipeline: class imbalance against rare but lethal arrhythmias, degradation under inter-patient domain shift, and opaque predictions that clinicians cannot verify against the signal. We present WGANet, a multi-scale architecture that represents each ECG lead simultaneously as a 1D waveform and as a dynamic graph whose nodes are adaptive morphological segments connected by learned temporal edges. A wavelet front-end produces scale-specific feature streams that are fused by a graph attention module with top-k sparse edges, and a prototype-based decision head produces predictions whose evidence can be traced back to specific waveform segments. On the PTB-XL benchmark, WGANet reaches an AUROC of 0.938 for the macro 5 superclass task, exceeding XResNet1d101 and a Transformer baseline by 0.9 and 1.4 points, and improves the recall of rare classes (ventricular flutter, AV block III) by 6.9 and 8.1 points respectively over class-balanced focal baselines. Under strict inter-patient transfer to the Chapman-Shaoxing dataset, the architecture retains AUROC 0.889 versus 0.84-0.86 for baselines. A 24-month deployment on 3 hospital monitors (41,000 recordings, prospective shadow mode) confirms that prototype-based explanations match cardiologist-marked evidence on 91% of sampled predictions. The combination of multi-resolution wavelet encoding, sparse graph attention, and traceable prototypes offers a practical template for deployable ECG analysis where trust and rare-class sensitivity matter as much as headline accuracy.',
  keywords: ['electrocardiogram', 'arrhythmia classification', 'graph neural networks', 'wavelet transforms', 'explainable AI', 'biomedical signal processing'],
  section: 'Health & Bioinformatics',
  type: 'Research Article',
  blocks: [
    { kind: 'h2', text: '1. Introduction' },
    { kind: 'p', text: 'The electrocardiogram is the most frequently acquired diagnostic signal in medicine: hundreds of millions of 12-lead recordings are captured annually worldwide, and their interpretation is a trainable but scarce expert skill. Automated ECG analysis therefore has an unusually direct value proposition, and deep learning has delivered on benchmarks: convolutional networks and Transformers now report macro AUROC above 0.93 on the standard PTB-XL task [1], [2], numbers that suggest the classification problem is, for practical purposes, solved.' },
    { kind: 'p', text: 'Clinical deployment tells a different story. Three failure modes dominate post-hoc audits of deployed cardiac AI. First, rare classes: ventricular flutter, third-degree AV block, and other immediately dangerous rhythms occur in well under 1% of recordings, and models tuned to aggregate metrics quietly trade their recall away [3]. Second, domain shift: a model trained on one device populations acquisition hardware, filter settings, and demographic mix degrades measurably on another, and single-center papers systematically overstate readiness [4]. Third, opacity: when a model flags atrial fibrillation, the cardiologist must decide whether the evidence is real; saliency maps that light up arbitrary segments do not answer that question, and several published explanation methods fail sanity checks on time-series models [5].' },
    { kind: 'p', text: 'We argue these are architecture-level problems, not post-processing afterthoughts, and present WGANet (Wavelet-Graph Attention Network) built around three coupled design commitments. Multi-scale structure: cardiac morphology lives at distinct time scales (QRS complex near 80 ms, QT interval near 400 ms, beat-to-beat variability over seconds), so the encoder should represent each scale natively rather than hope a deep stack discovers them. Relational structure: diagnostic evidence is relational - the PR relationship across beats, ST evolution across leads - and graph attention with sparse learned edges is a cheaper inductive bias than global attention over 5,000 raw samples. Traceable evidence: the decision head should be forced to point at specific waveform segments that a clinician can inspect, which prototype heads do naturally.' },
    { kind: 'p', text: 'Our contributions are:' },
    {
      kind: 'list', ordered: true, items: [
        'A dual-representation encoder: continuous wavelet transform streams at three scales feeding a dynamic graph whose nodes are adaptive morphological segments, linked by sparse top-k learned temporal edges.',
        'A class-frequency-aware training scheme with rare-class prototype anchoring that lifts rare-class recall by 7-8 points without damaging macro metrics.',
        'State-of-the-art PTB-XL results (macro AUROC 0.938), the best published inter-dataset transfer to Chapman-Shaoxing among compared models, and a 24-month prospective shadow-mode deployment on hospital monitors.',
        'A clinician-validated explanation pathway: prototype-segment evidence matches cardiologist-marked evidence regions on 91% of 600 sampled predictions.',
      ],
    },
    { kind: 'p', text: 'Section 2 reviews related work; Section 3 describes the architecture; Section 4 the training scheme; Section 5 the data and deployment protocol; Section 6 results; Section 7 conclusions.' },

    { kind: 'h2', text: '2. Literature Review' },
    { kind: 'p', text: 'Deep ECG classification began with 1D CNNs on fixed-length segments [1]; residual architectures scaled this to the PTB-XL benchmark, where Wagner et al. [2] established the evaluation protocol (superclass and subclass tasks, macro AUROC) now standard in the field. Transformer encoders over raw samples or beat tokens [6], [7] added global context with mixed gains: gains on rhythm-level tasks where long-range beat relationships matter, no gain (and sometimes loss) on morphology-level tasks. A parallel line uses signal-processing front ends: learned or fixed wavelet decompositions, QRS-locked segmentations, and phase-folded representations, with reports of improved noise robustness and sample efficiency [8], [9] - evidence that domain structure, when explicit, still pays.' },
    { kind: 'p', text: 'Graph neural networks entered ECG analysis through several routes: lead-adjacency graphs for spatial relationships across the 12 leads, beat graphs where nodes are detected beats and edges encode temporal dynamics, and segment graphs for long recordings where full-resolution attention is infeasible [10], [11]. Published graph-ECG models typically fix the graph construction (hand-detected beats, static edges), which inherits detector failure modes and cannot adapt node boundaries to patient-specific morphology. Class imbalance has been addressed with focal losses, class-balanced sampling, and generative augmentation [3], [12]; reported gains concentrate on mid-frequency classes, with rare-class recall improvements in the 2-4 point range - meaningful but short of what lethal-rhythm screening requires. Explanation methods - Grad-CAM variants, attention rollout, and counterfactual pulses - have been validated mostly qualitatively [5], [13]; prototype-based explanation has strong precedents in vision (ProtoPNet) [14] but, to our knowledge, has not been combined with graph ECG encoders nor validated prospectively against cardiologist annotations. Table 1 positions WGANet.' },
    {
      kind: 'table',
      caption: 'Table 1. Positioning among representative ECG classification approaches.',
      headers: ['Approach', 'Multi-scale front end', 'Learned relational structure', 'Rare-class focus', 'Clinician-validated evidence'],
      rows: [
        ['ResNet family [1], [2]', 'No', 'No', 'Partial', 'No'],
        ['ECG Transformer [6], [7]', 'Partial', 'Global attention', 'No', 'No'],
        ['Wavelet CNNs [8], [9]', 'Yes', 'No', 'No', 'No'],
        ['Graph ECG [10], [11]', 'No', 'Fixed beat graph', 'No', 'No'],
        ['WGANet (proposed)', 'Yes (CWT, 3 scales)', 'Sparse learned graph', 'Yes (prototype anchoring)', 'Yes (600 predictions)'],
      ],
    },

    { kind: 'h2', text: '3. WGANet Architecture' },
    { kind: 'h3', text: '3.1 Wavelet front end and dual representation' },
    { kind: 'p', text: 'Each 10-second 12-lead recording (500 Hz) is decomposed with a continuous wavelet transform using the Morlet mother wavelet at three scale bands - 4-8 Hz (QRS energy), 1-4 Hz (P/T waves), and 0.1-1 Hz (baseline wander and long-range rhythm) - producing three coefficient streams per lead that are subsampled to 250 Hz and passed through shared 1D residual convolutions. In parallel, an adaptive segmentation module partitions each lead into morphological segments: a lightweight boundary detector proposes segment boundaries (trained weakly from R-peak annotations on 10% of PTB-XL), and a differentiable pooling merges proposed boundaries into 24-48 segments per lead, yielding roughly 350-500 nodes across 12 leads. Each node carries a feature vector: segment morphology statistics, the wavelet stream encodings within its interval, and its temporal position. This dual representation - continuous streams for texture, adaptive segments for relations - is the core structural novelty; the segmentation is learned, so node boundaries adapt to the patient rather than to a fixed QRS detector.' },
    { kind: 'h3', text: '3.2 Sparse graph attention' },
    { kind: 'p', text: 'Nodes are connected by two edge families: intra-lead temporal edges to the k = 4 nearest segments in time, and inter-lead correspondence edges between temporally overlapping segments of different leads, pruned by a learned gate. Attention is sparse - each node attends only to its edges - with four heads and an embedding width of 128. After three graph attention layers, a readout pools node embeddings back onto the segment grid, producing a per-segment contextual embedding that retains spatial traceability (every embedding corresponds to a specific waveform interval). The continuous wavelet streams are fused with the graph stream by gated addition at two scales:' },
    { kind: 'eq', text: 'h_seg = LayerNorm( h_graph + g1 * conv( W_1 ) + g2 * up( W_2 ) ),   g_i = sigmoid( alpha_i )', label: '(1)' },
    { kind: 'p', text: 'where W_1 and W_2 are the fine- and coarse-scale wavelet stream encodings aligned to segment intervals, up is linear upsampling, and the gates g_i are learned per channel. Total model size is 6.8 M parameters and one forward pass over a 10-second recording takes 14 ms on a single A100 and 61 ms on a hospital-server CPU.' },
    { kind: 'h3', text: '3.3 Prototype head with segment-traceable evidence' },
    { kind: 'p', text: 'The classification head maintains M = 8 prototypes per superclass, learned as vectors in the segment-embedding space. A prediction is scored by the negative squared distance between segment embeddings and class prototypes, aggregated with a max-soft assignment; the deciding prototype and its nearest segments are emitted as the explanation. Because segment embeddings are spatially anchored, the explanation is a set of concrete waveform intervals - what the clinician inspects. Unlike post-hoc saliency, this pathway is the models actual computation: removing the highlighted segments (occlusion test) flips or degrades the prediction in 94% of validation cases, a self-consistency property we report in Section 6.4.' },
    { kind: 'fig', caption: 'Fig. 1. WGANet overview. Continuous wavelet streams and an adaptive segment graph are fused by gated addition; sparse graph attention links segments across time and leads; a prototype head scores classes and emits segment-level evidence.', description: 'Left: 12-lead ECG into wavelet transform (three scale bands) and adaptive segmentation. Middle: sparse graph attention layers. Right: prototype head with class scores and highlighted evidence segments on the original signal.' },

    { kind: 'h2', text: '4. Training Scheme' },
    { kind: 'p', text: 'Training combines three objectives: the standard multi-label binary cross-entropy over the 5 superclass labels, a class-frequency re-weighted term using effective-number weights, and a rare-class prototype anchoring loss that pulls each rare-class prototype toward the median embedding of its support set and penalizes drift during training, preventing the prototype from being captured by abundant similar classes. Sampling uses a square-root frequency schedule between uniform and natural class frequency. Augmentation is signal-native: baseline wander injection, electrode motion artifacts synthesized from noise models, amplitude rescaling per lead, time warping up to 8%, and random lead dropout of one lead at probability 0.15 (encouraging inter-lead redundancy). Optimization uses AdamW at 3e-4 with a cosine schedule over 120 epochs. For transfer experiments, the encoder is frozen and only fusion gates, graph layers, and the head are fine-tuned for 12 epochs on 20% of the target-domain training set.' },

    { kind: 'h2', text: '5. Data and Deployment Protocol' },
    { kind: 'p', text: 'Benchmarks: PTB-XL (21,837 records, 5 superclass task, official folds) as the primary benchmark; Chapman-Shaoxing (10,646 records, different acquisition hardware and demographics) as the inter-dataset transfer target with the same label mapping; and CPSC2018 for a secondary external check. Deployment: two 12-lead hospital carts and one telemetry central station running the model in shadow mode for 24 months (March 2024 - February 2026), processing 41,000 recordings without influencing care; a two-cardiologist adjudication committee sampled 600 predictions (stratified across classes, confidence levels, and error cases) and marked evidence regions on the waveform independently before seeing model explanations.' },
    {
      kind: 'table',
      caption: 'Table 2. Dataset and deployment summary.',
      headers: ['Source', 'Recordings', 'Purpose', 'Hardware origin'],
      rows: [
        ['PTB-XL', '21,837', 'Training + benchmark', 'Multiple, research grade'],
        ['Chapman-Shaoxing', '10,646', 'Inter-dataset transfer', 'Single-vendor clinical'],
        ['CPSC2018', '6,877', 'Secondary external', 'Single-vendor clinical'],
        ['Hospital shadow mode', '41,000', 'Prospective evaluation', '3 monitor stations, 2 vendors'],
      ],
    },

    { kind: 'h2', text: '6. Results and Discussion' },
    { kind: 'h3', text: '6.1 Benchmark performance' },
    { kind: 'p', text: 'On the PTB-XL superclass task, WGANet reaches a macro AUROC of 0.938, versus 0.929 for XResNet1d101 and 0.924 for a raw-sample Transformer (Table 3). The gains concentrate exactly where the architecture aims: rhythm classes with cross-beat relational evidence (atrial fibrillation, +1.7 AUROC) and rare lethal classes, where recall at fixed 90% precision improves by 6.9 points for ventricular flutter and 8.1 for AV block III relative to the class-balanced focal baseline. On subclass evaluation the margins narrow but hold (0.852 versus 0.846 macro AUROC). All comparisons use the official folds and three seeds; differences are significant at p < 0.01 under a paired bootstrap over recordings.' },
    {
      kind: 'table',
      caption: 'Table 3. PTB-XL superclass results (macro AUROC; three-seed means) and rare-class recall at 90% precision.',
      headers: ['Model', 'Macro AUROC', 'AF AUROC', 'VFlutter recall', 'AVB-III recall'],
      rows: [
        ['XResNet1d101', '0.929', '0.961', '0.612', '0.655'],
        ['Transformer (raw samples)', '0.924', '0.958', '0.598', '0.631'],
        ['Wavelet CNN (no graph)', '0.926', '0.960', '0.620', '0.662'],
        ['Focal + class-balanced', '0.930', '0.963', '0.671', '0.704'],
        ['WGANet (proposed)', '0.938', '0.980', '0.740', '0.785'],
      ],
    },
    { kind: 'h3', text: '6.2 Inter-dataset transfer' },
    { kind: 'p', text: 'Frozen-encoder transfer to Chapman-Shaoxing with 20% fine-tuning data yields macro AUROC 0.889 versus 0.861 (XResNet) and 0.845 (Transformer); full fine-tuning widens the gap slightly (0.902 versus 0.872). The graph components transfer better than the continuous streams alone - ablating them in the transfer setting costs 2.4 AUROC points - consistent with relational evidence being the more domain-invariant representation, since acquisition artifacts corrupt waveform texture more than cross-lead beat structure. On CPSC2018 the ranking is preserved with a smaller margin.' },
    { kind: 'h3', text: '6.3 Shadow-mode deployment' },
    { kind: 'p', text: 'Over 24 months and 41,000 shadow-mode recordings, agreement between model superclass predictions and final cardiologist-reported interpretations was 0.931 Cohen kappa, with the model more sensitive than the first-reading cardiologist on subtle AF (31 additional true AF flagged, confirmed on adjudication) and producing 1.4% false-positive AF alerts at the deployed threshold - within the range that second-reader workflows absorb. Calibration by confidence decile showed an expected calibration error of 0.031, sufficient for threshold-based triage without temperature scaling. No difference in performance was found between the two monitor vendors after per-station normalization, which we attribute to the wavelet front end absorbing filter differences.' },
    { kind: 'h3', text: '6.4 Explanation quality and ablations' },
    { kind: 'p', text: 'The clinician evaluation scored model evidence against cardiologist-marked regions: 91% of sampled predictions had at least 70% overlap between prototype evidence segments and cardiologist marks (73% for the Grad-CAM baseline on the same model backbone). The occlusion self-consistency test - does removing the evidence change the prediction - passed at 94%. Ablations (Table 4) confirm each components contribution: removing the sparse graph costs 1.5 macro AUROC and 9 rare-class recall points; removing wavelet streams costs 1.2 AUROC; replacing the prototype head with a dense head costs 0.6 AUROC but destroys traceable evidence; removing rare-class anchoring costs 7.3 rare-class recall points with no macro benefit.' },
    {
      kind: 'table',
      caption: 'Table 4. Ablation study on PTB-XL (macro AUROC and rare-class macro recall).',
      headers: ['Variant', 'Macro AUROC', 'Rare-class recall', 'Evidence overlap %'],
      rows: [
        ['Full WGANet', '0.938', '0.762', '91'],
        ['No sparse graph', '0.923', '0.669', '84'],
        ['No wavelet streams', '0.926', '0.681', '88'],
        ['Dense head (no prototypes)', '0.932', '0.718', 'n/a (not traceable)'],
        ['No rare-class anchoring', '0.936', '0.689', '90'],
      ],
    },
    { kind: 'h3', text: '6.5 Limitations' },
    { kind: 'p', text: 'Four limitations qualify the claims. First, the deployment, though prospective, was shadow-mode: no care decision depended on the model, and real workflow effects (alert fatigue, time-to-treatment) remain to be measured in an interventional study. Second, our label mapping across datasets follows the standard superclass mapping, which coarsens some clinically meaningful subclass distinctions. Third, the adaptive segmentation depends on a weakly trained boundary detector whose failure mode on extreme tachycardia (node under-segmentation) contributed 22% of the remaining errors; a detector-free formulation is future work. Fourth, all deployment data comes from one national health system; multi-country prospective validation is required before broader claims.' },

    { kind: 'h2', text: '7. Conclusion' },
    { kind: 'p', text: 'We presented WGANet, an ECG arrhythmia classifier that couples multi-scale wavelet encoding with a sparse, learned segment graph and a prototype head whose evidence is traceable to waveform intervals. The architecture delivers state-of-the-art benchmark accuracy, materially better rare-class recall, the strongest inter-dataset transfer among compared models, and - validated in 24 months of hospital shadow mode and by clinician review - explanations that cardiologists recognize as their own evidence regions. The broader message for clinical AI is that trust-relevant properties (traceability, rare-class sensitivity, transfer robustness) are architectural decisions, not post-hoc patches, and they need not sacrifice headline accuracy. Future work will extend the prototype pathway to subclass-level explanations, test detector-free adaptive segmentation, and move from shadow mode to a randomized second-reader trial measuring time-to-diagnosis and alert burden.' },
  ],
  references: [
    'A. Y. Hannun, P. Rajpurkar, M. Haghpanahi, G. H. Tison, C. Bourn, M. P. Turakhia, and A. Y. Ng (2019). Cardiologist-level arrhythmia detection and classification in ambulatory electrocardiograms using a deep neural network. Nature Medicine, 25(1), 65-69.',
    'P. Wagner, N. Strodthoff, R. D. Bousseljot, D. Kreiseler, F. I. Lunze, W. Samek, and T. Schaeffter (2020). PTB-XL, a large publicly available electrocardiography dataset. Scientific Data, 7, 154.',
    'M. Zihni, A. Tumer, and B. Ozkaya (2022). Class imbalance in ECG arrhythmia classification: Beyond focal loss. Computers in Biology and Medicine, 145, 105411.',
    'C. Han and L. Sun (2023). Domain shift in cardiac deep learning: A multi-center audit. IEEE Journal of Biomedical and Health Informatics, 27(6), 2810-2821.',
    'J. Adebayo, J. Gilmer, M. Muelly, I. Goodfellow, M. Hardt, and B. Kim (2018). Sanity checks for saliency maps. Proc. NeurIPS, 9505-9515.',
    'V. Nauta, R. Lim, and A. Schläpfer (2023). ECG Transformers for arrhythmia classification: Benchmarks and pitfalls. Computers in Biology and Medicine, 158, 106766.',
    'S. Hong, Y. Zhou, J. Shang, C. Xiao, and J. Sun (2020). Opportunities and challenges of deep learning methods for electrocardiogram data: A systematic review. Computers in Biology and Medicine, 122, 103801.',
    'M. A. Galgani and J. A. Chamberlin (2021). Wavelet-based deep networks for ECG denoising and classification. Biomedical Signal Processing and Control, 68, 102684.',
    'F. A. Fathabadi and M. B. Shamsollahi (2022). QRS-locked deep representations for 12-lead ECG classification. Physiological Measurement, 43(5), 055003.',
    'Y. Zhang, S. Yan, and X. Chen (2022). Graph neural networks for multi-lead ECG classification. Expert Systems with Applications, 205, 117632.',
    'L. Zhou, M. Chen, and T. Wu (2023). Beat-graph networks for long-term cardiac monitoring. IEEE Journal of Biomedical and Health Informatics, 27(9), 4412-4423.',
    'T. Nguyen and J. Kim (2022). Generative augmentation for rare arrhythmia classification. Proc. ML4H, 1-14.',
    'D. Van Veen, A. Maheshwara, and R. Ranganath (2021). Interpretable ECG analysis via prototype-based explanations. Proc. Machine Learning for Health Workshop.',
    'C. Chen, O. Li, D. Tao, A. Barnett, C. Rudin, and J. K. Su (2019). This looks like that: Deep learning for interpretable image recognition. Proc. NeurIPS, 8928-8939.',
    'N. Strodthoff, P. Wagner, T. Schaeffter, and W. Samek (2021). Deep learning for ECG analysis: Benchmarks and insights from PTB-XL. IEEE Journal of Biomedical and Health Informatics, 25(5), 1519-1528.',
    'A. Isaksson and L. Molnar (2024). Prospective shadow-mode evaluation of cardiac AI: Methodology and first results. npj Digital Medicine, 7, 44.',
  ],
};

export default paper;
