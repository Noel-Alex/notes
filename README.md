# Notes

A responsive, GitHub Pages study library for four engineering subjects:

- Exploratory Data Analysis
- Data Mining
- Deep Learning
- Compiler Design

## Structure

`/subjects/<subject>/` is the subject hub. Each hub is organized into CAT 1, CAT 2, quizzes, module notes and FAT. The root `catalog.json` is the central searchable registry for finished note sets.

### Current live material

- **EDA → CAT 2 → Modules 3–5**: complete exam command center with source-grounded notes, numericals, code vault, interactive visualizations, previous-paper coverage and printable cheat sheet.

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
- EDA: Modules 1–7 mapped to 24 supplied lecture resources, 29 study chapters, lecture pointers, numerical drills and source notes.
- Other subjects: foundational study pathways linked to the existing complete CAT 2 guides. Earlier/later module material is supplemental until additional FAT PDFs/PPTs are supplied and verified.
- Shared study room features: progress stored in localStorage, searchable chapter outline, formula vault, quiz explanations, interactive numeric/algorithm labs, responsive editorial theme.
- The status notes are intentional: **FAT source coverage must not be claimed complete for the other three subjects without their actual lecture bundles.**

### EDA numerical problem atlas

`subjects/eda/fat/workbook/` includes 27 solution-first revision cases. Ten transcribe numerical inputs from supplied lecture materials, sixteen are newly constructed exercises, and one is an MDS supplement. Detailed sources, assumptions and pitfalls are visible per exercise. The Module 7 salary source has been transcribed from an embedded PPT image and independently calculated. The Module 6 4D SOM example is worked with each winner comparison and sequential weight update. The workbook remembers checked problem mastery in browser localStorage.

### VIT FAT PYQ practice, paper provenance, and mocks

`fat/past-papers/` is an editorial interactive archive of **eight individually identified VIT FAT paper records** (2023–2025) with exam year, slot, source, independent-verification status, topics and raw external source URLs. It deliberately does not redistribute third-party scanned papers. Four original 100-mark mock exams with 39 ten/fifteen-mark long-form questions provide marking guidance and browser-local scoring. The audit does NOT currently certify exam readiness: major Data Mining, Deep Learning and Compiler Design gaps are explicitly listed, and complete EDA past-paper text remains unreviewed. Index course codes: EDA BCSE331L, Data Mining BCSE208L, Deep Learning BCSE332L, Compiler Design BCSE307L.
