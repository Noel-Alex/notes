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
