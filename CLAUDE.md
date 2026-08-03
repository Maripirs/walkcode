# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Walkcode is a **static, dependency-free, no-build** web app for guided coding walkthroughs and quick code drills (NeetCode-style problems). Everything is vanilla ES modules loaded directly by the browser from `index.html`. There is no backend, bundler, package manager, or test runner.

## Commands

- **Preview locally:** serve the repo root with any static server, then open `index.html` through it (ES module imports require HTTP, not `file://`). E.g. `python3 -m http.server` or `npx serve .`.
- **Syntax check (the only "test" available):** `node --check <file.js>` per source file. Check all of `src/` before handing off changes, e.g. `find src -name '*.js' -exec node --check {} \;`.
- **Deploy:** push to publish via GitHub Pages (root is served as-is). Custom domain `walkcode.maripi.net` is pinned by the root `CNAME` file. Push only when ready to publish.

## Architecture

Pure render-on-state-change loop with no framework. The single source of truth is a mutable `appState` object; every view is a function returning an HTML string that `app.js` writes into `#app`, then re-binds event listeners.

- **`src/app.js`** — the only coordinator. Owns `render()` (a switch on `appState.screen`: `home` | `library` | `drill` | `lesson`), navigation, random-walkthrough history, and drill-queue setup. Wires views to data and re-binds listeners on every render. **Do not add lesson/drill content here.**
- **`src/lib/state.js`** — `appState` (in-memory UI state) plus device-local progress persisted in `localStorage` (`walkcode-states` = per-card `Unseen`/`Seen`/`Solved`; `walkcode-language` = JS/Python). No server persistence.
- **`src/lib/ui.js`** — shared render helpers (`shuffle`, `languagePicker`, `difficultyTag`, `feedback`, `topBar`). `shuffle` is what keeps answer position out of the answer key.
- **`src/lib/problem-source.js`** — derives each problem's LeetCode URL from its title; add a slug to `leetCodeSlugOverrides` when a title doesn't map cleanly.
- **`src/views/`** — one file per screen (`home`, `library`, `drill`, `lesson`), each returning markup and (for interactive screens) exporting a `bind*` function for its listeners.

### The data layer is the product

Content lives in `src/data/` and is assembled by **`src/data/model.js`** — the key file to read first. It merges the fragments below into the `cards`, `lessonFor(card, language)`, and `drillItems()` that views consume:

- **`curriculum.js`** — the roadmap: topic → problem-title lists. Defines which cards exist.
- **`lesson-records.js`** — explanations, `featured` full lesson records, concept choices, briefs, complexity lessons, per-topic `profiles`/`fallback`.
- **`walkthrough-upgrades.js`** — full lesson records for roadmap problems upgraded from WIP to Built (JS + Python code, steps, fixes, complexity).
- **`drills.js`** — code-fix exercises (`codeExercises`), standalone `extraCodeDrills`, `drillContext`, `drillDifficultyByTitle`.
- **`supplemental-drills.js`** + **`supplemental-solutions.js`** — extra standalone drills and their full JS/Python reference solutions (the drill view redacts the tested answer everywhere it appears).
- **`languages.js`** — Python variants (`pythonSolutions`, `pythonExercises`) keyed by title / `title:index`.
- **`difficulty.js`** — Easy/Hard title overrides; **Medium is the fallback**.

**"Built" is a curated allowlist**, not derived from content presence: a title only shows `✓ Built` if it's in the `builtTitles` Set in `model.js`. Everything else is auto-labeled "Work in progress" with a placeholder banner. `isBuilt` also gates which problems random walkthroughs can pick (WIP is browse-only).

## Content conventions (from CONTRIBUTING.md)

- A problem earns **Built** only when all five lesson stages are concrete and interactive: **Recognize → Algorithm → Code fixes → Complexity → Review**. Don't badge generic/draft content as Built or remove the WIP signal early.
- Adding/upgrading a problem touches multiple data files in step: title in `curriculum.js`, explanation + full record + concept choices + input/output in `lesson-records.js` (or a record in `walkthrough-upgrades.js`), exercises in `drills.js`, Python variants in `languages.js`, difficulty classification. Keep each kind of content in its matching file.
- **Concept-choice lists: the first element is the answer key**; the UI randomizes display order via `shuffle`. Never encode the answer as a position.
- Every drill needs one correct answer, correct feedback that explains *why*, and problem-specific wrong-answer feedback that does *not* reveal the answer.
- Keep every JS/Python drill solution **≤ 36 lines** (`MAX_DRILL_CONTEXT_LINES` in `views/drill.js`); the full answer-safe code context stays visible with the worked line shown as a highlighted `___` and any other occurrence of the answer masked.
- Keep the app lightweight and mobile-first; **add no dependencies or build step**. Update `CONTRIBUTING.md` in the same change whenever a content schema or user workflow changes.
