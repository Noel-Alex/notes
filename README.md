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
