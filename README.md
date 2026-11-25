# Notes

A responsive, GitHub Pages study library for four engineering subjects:

- Exploratory Data Analysis
- Data Mining
- Deep Learning
- Compiler Design

## Structure

`/subjects/<subject>/` is the subject hub. Each hub is organized into CAT 1, CAT 2, quizzes, module notes and FAT. The root `catalog.json` is the central searchable registry for finished note sets.

### Current live material

- **EDA → FAT → Modules 1–7**: complete 50-chapter textbook rebuilt from 24 supplied lecture PDFs, PPTs and notebooks, with 14 interactive mathematical experiments, formula vault, lesson index, source markers and reading progress.
- **EDA → CAT 2 → Modules 3–5**: the prior exam command center is preserved, with numericals, code and visualizations.

### Data Mining FAT textbook (November 2026)

- Primary reader: `subjects/data-mining/fat/index.html`, linked from the Notes homepage, FAT master library, Data Mining subject hub, and global `catalog.json`.
- Source pack: the supplied `FAT NOTES.zip`. The `LAB NOTES- DM` subfolder is deliberately excluded from the FAT study syllabus.
- Seven teaching modules, 69 expanded lessons, worked CAT-style numericals, 71 reference formulas, and 101 practice questions, with interactive algorithm demonstrations and local browser progress.
- Module 8 is identified as a source-coverage caveat rather than claimed to be fully taught from the archive.
- Earlier Data Mining CAT 2 materials under `subjects/data-mining/cat2/` remain preserved.

### Deep Learning FAT textbook (November 2026)

- Primary interactive reader: `subjects/deep-learning/fat/index.html`, linked from the subject hub, Notes homepage, FAT library, and global catalogue.
- Source: 19 files inside the supplied `WINSEM2025-26_VL_BCSE332L_00100_TH_2026-03-12_Module3_5.zip`; no laboratory content used. Later Fall-2026 teaching slides take priority where they clarify the faculty's organization.
- 73 source-tracked teaching chapters across Modules 1–7; 33 worked numerical/long-answer problems; 64 equations with pitfalls; 105 explained questions; 100-mark original mock and browser-based flashcards.
- Interactive demonstrations for MLP backprop, optimizers, softmax, CNN output shapes, CNN filters, RNNs, attention, LSTM/GRU, transfer learning, GANs, detection/IoU, and Q-learning.
- Includes sticky chapter-index scroll preservation, floating Previous/Next navigation, offline-capable static HTML, topic search, and locally saved progress/bookmarks.
- Naming caveat: Fall-2026 faculty files assign optimisation to Module 2 and CNNs to Module 3; the historical published syllabus reverses these. The site transparently follows the current faculty's deck labels and records the mismatch. No dedicated Module 8 Contemporary Issues lecture file was supplied.
- 2024 public FAT papers and the August 2026 CAT1 key inform answer *formats* only; the site does not assert statistically validated historical question frequencies.

## GitHub Pages

The repository contains a Pages deployment workflow at `.github/workflows/pages.yml`. When Pages is configured to use **GitHub Actions**, every push to `main` publishes the site.

Expected URL: `https://noel-alex.github.io/notes/`

## Adding future notes

1. Create a folder under `subjects/<subject>/<assessment-or-module>/`.
2. Add the study site's `index.html` there.
3. Add an entry to `catalog.json`.
4. Link it from the relevant subject hub.

The root design is intentionally stable so future CATs, quizzes and FAT notes slot into the same navigation rather than becoming disconnected files.


## FAT / Final assessment (November 2026)

- Entry: `fat/` and `subjects/<subject>/fat/`.
- EDA: Modules 1–7 mapped to 24 supplied lecture resources in **50 detailed, long-form textbook chapters**, with 14 interactive instructional experiments and all major lecture examples.
- Other subjects: FAT entries are clearly **pending** until their professor-specific modules are supplied. Existing CAT 2 resources are preserved.
- Shared study room features: progress stored in localStorage, searchable chapter outline, formula vault, quiz explanations, interactive numeric/algorithm labs, responsive editorial theme.
- The status notes are intentional: **FAT source coverage must not be claimed complete for the other three subjects without their actual lecture bundles.**

### EDA numerical problem atlas

`subjects/eda/fat/workbook/` includes 27 solution-first revision cases. Ten transcribe numerical inputs from supplied lecture materials, sixteen are newly constructed exercises, and one is an MDS supplement. Detailed sources, assumptions and pitfalls are visible per exercise. The Module 7 salary table was read from the native PowerPoint table and independently calculated. The Module 6 4D SOM example is worked with each winner comparison and sequential weight update. The workbook remembers checked problem mastery in browser localStorage.

### VIT FAT PYQ practice, paper provenance, and mocks

`fat/past-papers/` is an editorial interactive archive of **eight individually identified VIT FAT paper records** (2023–2025) with exam year, slot, source, independent-verification status, topics and raw external source URLs. It deliberately does not redistribute third-party scanned papers. Four original 100-mark mock exams with 39 ten/fifteen-mark long-form questions provide marking guidance and browser-local scoring. The audit does NOT currently certify exam readiness: major Data Mining, Deep Learning and Compiler Design gaps are explicitly listed, and complete EDA past-paper text remains unreviewed. Current EDA lecture material says **BCSE3311L**; an external historical paper index uses BCSE331L and its course equivalence must not be assumed. Other archived codes: Data Mining BCSE208L, Deep Learning BCSE332L, Compiler Design BCSE307L.

#### 2026-11-05 VIT past-paper audit repair

The source-backed gap audit led to additional exam-length FAT lessons: Data Mining chi-square, Apriori, FP-tree, applied system design; Deep Learning sigmoid backprop, adaptive optimizers, 4×4 matrix convolution and pooling, IoU and Q-learning; Compiler Design LL(1), full small CLR(1) table/trace, target code generation after peephole. These repair specific omissions, but **do not certify complete readiness** without the full current VIT syllabus and timed past-paper attempts. Archived EDA paper text was not accessible for question-by-question comparison.

## EDA FAT source-guided textbook (rebuild)

- Primary reader: `subjects/eda/fat/index.html` (loads seven module chapter bundles `textbook/m01.js` to `m07.js`).
- Long-form lessons: 50 chapters. Each teaches concepts before presenting numerical application, includes mathematical foundations, programming snippets when appropriate, worked examples, warnings, and a precise original lecture reference.
- Reader: `textbook/reader.js` and `textbook/reader.css`; chapter search scans the whole text, module cards show chapter completion, and a dynamically extracted formula vault links equations to their explanations.
- Interactive visual instruction: `textbook/labs.js` offers 14 working experiments including normalization, binning, Pearson correlation, Simpson reversal, rolling windows, frequency graphs, contingency percentages, K-means, cosine retrieval, SOM training, SVD rank, factor loadings, confusion metrics and regression.
- `workbook/` remains separate for practicing full solutions rather than replacing the teaching.
- Specific source corrections: Module 4 handout has a contradictory chi-square comparison; Module 5.4 iteration heading has an inconsistent K-means y-centroid; and `TSA Problem.docx` reports MAPE=3.72% whereas retaining full precision through final rounding yields approximately 3.71%. Notes distinguish source statements from validated calculations.
- Missing item: the Module 6 SVD/MDS slides reference a Moodle `MDS.pdf` that was not provided; classical MDS is independently explained but explicitly labelled supplementary.
- Do not claim a guaranteed perfect score or fully verified past-paper coverage without the complete current FAT syllabus and actual timed practice.


### Beginner-first guided teaching (2026-11-21)

Both the Deep Learning and Data Mining FAT readers now load the shared
`assets/easy-mode.js` / `assets/easy-mode.css` plus source-specific
`easy-data.js` aligned by chapter index. These preserve the existing
complete faculty-based lessons and interactive exercises; they do not delete
exam or syllabus content.

**Default learning experience:** 3 compact steps per lesson:
plain-English meaning with an analogy → a small numerical/application →
how to structure a full-mark written answer. Each course now has a custom
entry for every lesson (Deep Learning 73/73, Data Mining 69/69).
Full lecture-depth source text and formulas remain one click away under
"Complete faculty-based explanation"; existing interactive demonstrations
have their own optional reveal. Reader floating chapter controls and reading
progress persist from the original textbooks.

**Evidence discipline:** the publicly readable November 2024 BCSE332L D1/D2
FAT paper excerpts and April 2025 BCSE208L F1 FAT Q1–Q4 inform numerical and
answer formats. Archive index metadata for other papers cannot establish
question-level frequencies; no guesses about future exam questions.
The existing CAT and supplemental lecture files are not reclassified as
verified FAT papers.


### Data Mining priority-topic completeness audit (22 November 2026)

The handwritten professor importance sheet covers 13 exam-topic groups and 26
linked chapters. The original source ZIP `FAT NOTES.zip` was reopened, with
`LAB NOTES- DM/` excluded entirely. Twenty-four priority chapters now have
additional faculty-source-checked explanations, diagram equivalents, exam
workflows or fully calculated numericals. The two not receiving an extra block:
`4-9` already has a second solved FP-Growth dataset, and `7-8` is explicitly
syllabus-level supplementary statistical mining because the supplied Module 7
archive has no standalone statistical-mining lecture.

Focused repairs:
- M1: warehouse three-tier architecture (M1 DM.ppt 14–19); 0-D apex to 3-D
  base lattice and 2^n counting, with its assumptions (26–28, 55–56).
- M2: descriptive/predictive mining functionalities and four classification
  schemes (M2 DM.pptx 15–26).
- M3: the six data-quality dimensions (M3.1 DM.ppt 4–6); nominal/numeric
  concept hierarchies (M3 DM.ppt 53–61). The age-band numerical is clearly
  **original illustrative practice**, not a claimed original faculty question.
- M4: complete Apriori join/prune passes, strong-rule arithmetic and
  FP-Growth conditional suffix calculations (Association-Rule-Mining-.pptx,
  FP GROWTH ALGORITHMS.pptx, supplied CAT-II question).
- M5: complete cross-validation source methods (Cross-validation Techniques
  DOCX), including the once-overlooked rolling and Monte Carlo variants,
  plus 100-sample k-fold vs LOOCV vs leave-2-out arithmetic.
- M6: clustering requirements (M6 DM.pdf 8–18); full table reconstructed
  from images in K MEDOIDS DM 6.pdf pp. 4–6 and verified independently:
  old total 20, new total 22, reject swap. Full faculty
  single/complete/average linkage p. 53: 2, 5, 3.5; source dendrogram p.63.
- M7: every lesson retains its importance marker. Nine source-backed lessons
  gain extra examples/algorithms from WEB MINING.pdf and the 2024-11-13 M7
  reference PDF, including HITS, PageRank, source-exact precision/recall,
  temporal evolution rules, and STING+. Supplementary 7-8 remains clearly
  marked for lack of dedicated lecture notes.

The existing 69 lessons, bookmarks, completion status, three-step beginner
mode and exam-important highlight flags were preserved. New expansions live
inside the full technical chapter, and a visible shortcut from the important
callout opens the expanded worked explanation.

### Deep Learning visual-first learning upgrade (2026-11-22)

The original 73 source-backed teaching chapters, 33 long-answer worked problems, 64 formulas, 105 questions, source markers, bookmarks, and reading progress remain intact.

- Every chapter has a dedicated interactive concept-flow sequence, with labeled steps and explanations.
- Custom live numerical controls cover neuron arithmetic, activation and softmax, loss, gradient descent, convolution, pooling, CNN output geometry, sequence recurrence, gradient decay, attention, LSTM/GRU, IoU, and Q-learning. The original faculty-aligned interactive demonstrations are preserved.
- Additional architecture diagrams show Inception branches, ResNet shortcuts, VGG stacks, bidirectional recurrence, encoder/decoder bottlenecks, query/key/value attention, gated memory, R-CNN variants, YOLO/SSD, DQN replay/targets, and actor-critic branches.
- Core visual pathways appear on the Deep Learning FAT homepage, with a separate local mastery indicator that does not overwrite existing lesson completion.
- For Deep Learning, original interactive numerical demonstrations are open inside the beginner lesson instead of being hidden in a collapsed details panel.

Files: subjects/deep-learning/fat/visual-studio.js, visual-studio.css, existing Deep Learning index.html, shared assets/easy-mode.js and sw.js. All arithmetic sandboxes are clearly illustrative unless a faculty source is stated in the original chapter; keep the complete faculty-based notes for source-exact examples.

### Deep Learning professor-identified FAT priority list (23 November 2026)

The professor's reported priority-topic and question-pattern message is now built into the actual reader at `subjects/deep-learning/fat/#faculty`. It sits **on top of** the complete faculty-sourced course material, never deletes or downgrades unlisted chapters.

- 7 modules; 23 topic groups; 53 chapter links marked ★ in the sidebar and chapter pages.
- Original reported pattern: 80 marks / 8 ten-mark answers, Module 1 mentioned twice; Q9 A/B references Modules 3/4 and Q10 A/B Modules 5/6. The compulsory/choice mechanics remain ambiguous and are **not** invented.
- Every topic includes a precise five-step 10-mark answer checklist, key formula, mark-losing misconception, course-lesson links and relevant 33-problem workbook solutions (clearly distinguishing source-based and original practice).
- Module 1 has interactive activation graphs including binary step, sigmoid, tanh, ReLU, Leaky ReLU and linear; softmax is correctly treated as vector-valued. Supplementary (non-faculty-slide) classification and K-means mini numericals and hyperparameter table are labeled explicitly.
- A separate self-marked mastery state allows concentrated revision without changing existing reading completion/bookmarking.
- Corrected visual-studio diagrams for original R-CNN vs Fast R-CNN, BERT encoder-only Transformer, seq2seq encoder–decoder, Echo State Networks, GAN's real/fake branches and RNN BPTT.
- The professor's phrase "policy based Q learning" is identified as ambiguous. Standard tabular Q-learning is *value-based and off-policy*; policy gradients, actor–critic and model-based RL are separately explained.

New assets `subjects/deep-learning/fat/faculty-priority.js` and `faculty-priority.css` are linked from the FAT reader, with their offline cache entries in `sw.js`. This is a study-priority layer built from a user-supplied faculty message, **not** a verified official exam paper or a prediction of exact questions.

### Compiler Design FAT · Translation Studio (25 November 2026)

New seven-module study edition at `subjects/compiler-design/fat/`, replacing the placeholder. It draws from the supplied ZIP (26 files, 23 distinct documents) and prefers current-semester slides for overlapping topics. 46 lessons, all 46 with interactive workbenches, 35 workbench types, 13 selected faculty exercise groups, a searchable reader, light/dark mode, mastery/review flags and active recall. General regex direct-DFA construction, FIRST/FOLLOW and LL/LR parser engines compute tables and traces; the register-allocation trace follows the lecture's exact seven instructions. The final advanced layer computes FIRSTVT/LASTVT precedence relations, iterates dataflow to a fixed point, and reproduces the faculty's 12-node five-cycle schedule. Source-level tests verified all 33 non-parser workbench defaults, the LL/LR engines, all lesson routes, and expected conflict cases. Original practice and older-deck-only coverage are labeled. Existing CAT 2 and other subjects remain unchanged except library entry links and service-worker version. Image-only source pages are not exhaustively audited, and no official FAT priority list was supplied.

#### FAT teaching-depth pass
All 46 existing lessons have a second tutorial with sequential worked-example reveal and an extra independently solvable exercise. Added a seven-module 70-mark original written diagnostic with suggested rubric and self-assessed marks, and a lecture-range coverage index. Source precedence is unchanged; there is no claim that the mock paper predicts the actual FAT or that every diagram-only slide has been reconstructed.

Image-only examples inspected and reconstructed in the teaching-depth pass: M6-P2 next-use 10-line array-product loop, six-node interference graph, usage-count table; M7 B1–B7 SSA conversion/JOIN+ and conditional constant propagation example 1. Source notes distinguish the selected reconstructions from a full slide audit.

#### FAT past-paper-first study path
Three complete BCSE307L FAT papers (July 2023 C1, November 2024 C1, November 2025 A1) were classified question by question. The `/fat/#pyq` page includes original PDF links, paraphrased question maps, module-mark estimates and solved original practice variants. The home route now prioritizes recurring exam procedures and completes the other current lecture topics, including SSA. Older-only VM/JIT detail is kept separately and not declared excluded without the instructor's portion. No prediction or claim to have reviewed inaccessible indexed papers is made.
