# Contributing to Walkcode

Walkcode is a mobile-first, no-build frontend served by a small Node backend. The browser code stays dependency-free vanilla ES modules; the server (`server/`) serves the app and a read-only content API. Keep it lightweight and understandable — no bundler, no frontend framework.

## Where content lives (M5+)

The `src/data/**` modules are still the **authored source of truth**, but at runtime the frontend loads content from **`/api/content`** (backed by Postgres), falling back to the bundled modules when offline. `src/data/assemble.js` turns the modules into the exact bundle the API serves and the app renders, so the DB, the API, and the offline fallback are identical by construction.

Two ways content reaches production:
- **Edit the `src/data/**` modules and redeploy.** The server auto-seeds Postgres on boot whenever the bundled content's hash changes, so a redeploy re-mirrors the DB from the files. This is the normal path for authoring.
- **Write directly to the DB.** A row inserted/edited in Postgres shows up on the next page load with no redeploy. Auto-seed only runs on an empty DB or a content-hash change, so direct DB edits survive restarts.

## Project map

- `src/data/curriculum.js` is the roadmap: topic names and problem titles.
- `src/data/lesson-records.js`, `drills.js`, `supplemental-drills.js`, `languages.js`, and `difficulty.js` together are the content source of truth. Keep explanations, walkthrough records, drills, language variants, and difficulty metadata in their matching file.
- `src/data/assemble.js` assembles the modules into the runtime content bundle (`assembleBundle`/`assembleClientBundle`). `src/data/model.js` is a thin selector over the loaded bundle (`initContent`, `cards`, `lessonFor`, `drillItems`, …). `src/lib/content-loader.js` loads `/api/content` with cache + offline fallback.
- `src/data/lesson-records.js` is the single source of authored lesson records (`featured`). Since **M12** every problem is **one self-contained `lesson()` record** (via the `lesson()`/`ex()` helpers): `brief`, `concepts`, `intuition`, `inputOutput`, `conceptChoices`, `algorithm` (ordered steps), `fixes`, `complexity`, `exercises` (≥2 whole-line code fixes), and `complexityGuide` — all **inline**. The full JS+Python solution lives in `supplemental-solutions.js` (`supplementalFullCode`), which `lesson()` blanks lines from; Python code-fix variants live in `languages.js` (`walkthroughPythonExercises`). *(The former object-literal records and their side maps — `briefs`, `conceptChoices`, `complexityLessons`, `codeExercises`, `pythonSolutions` — were merged inline and removed.)*
- `server/server.js` serves the static app and `/api/**`; `server/db.js` owns the schema, auto-seed, and the `/api/content` query. `server/llm.js` (M9) is the optional AI-feedback proxy behind `POST /api/algorithm-feedback` — provider-agnostic (OpenAI-compatible), config via `NVIDIA_API_KEY`/`LLM_BASE_URL`/`LLM_MODEL`, key never sent to the browser, off (route 503s) when no key is set. `pg` is the only backend dependency (the LLM proxy uses built-in `fetch`).
- `src/views/` renders one screen each. Keep screen-specific markup and event logic in the relevant view.
- `src/lib/state.js` owns device-local progress and UI state, plus the persisted prefs (language, theme, text size, reduce-motion) and the **`filters`** object (drill `types[]` + `difficulties[]` + `includeCompleted`) that is the single source of truth for content filtering.
- `src/lib/ui.js` owns shared rendering helpers such as answer shuffling, tags, feedback, the top bar, the settings gear, and the "Adjust in Filters" link (`filtersLink`).
- `src/app.js` only coordinates navigation and connects views to data; it also renders the two-tab settings/filters overlay and applies theme + reduce-motion. Do not add lesson content there.
- `src/styles.css` contains the shared visual system. **Every colour is a semantic CSS variable** (a light value in `:root`, a dark override under `:root[data-theme="dark"]` and the `prefers-color-scheme` media query) — add new colours as tokens and **never hardcode a hex**, so both themes stay correct.

## Adding or upgrading a problem

1. Add the title to `curriculum.js` under its category.
2. Add a plain-language `problemExplanations` entry in `lesson-records.js` (the fuller Understand-step statement; also the fallback for still-WIP problems).
3. Add **one self-contained `lesson()` record** in `lesson-records.js` with everything inline: `brief`; `concepts`; a one-line problem-specific `intuition` (the recognizing/approaching "aha" — no code, no spoiler; renders on Recognize, omit rather than writing a generic hint); `inputOutput` (input, return, one concrete example); an ordered `conceptChoices` list (first value is the answer key — the UI randomizes display position); `algorithm` (ordered steps; a nested array is an any-order group and `{ seq: [...] }` an ordered block — no `distractors`, the builder is a pure ordering task); `fixes`; `complexity`; `exercises` (two or more whole-line code fixes as specs — full solution with one line blanked, complete-line choices, specific correct + per-wrong-answer feedback; see **Drills and choices**); and a `complexityGuide`.
4. Add the full JS + Python solution to `supplementalFullCode` in `supplemental-solutions.js` — `lesson()` blanks each exercise's `correct` line from it, so every `correct` must be a line that is **present and unique (trimmed)** in the solution.
5. Add the Python code-fix variants to `walkthroughPythonExercises` in `languages.js`, index-matched to the JS `exercises` (each `correct` a present-and-unique trimmed line in the Python solution).
6. Optional enrichment: extra worked cases in `examplesByTitle` and a fuller statement in `descriptionsByTitle` (`examples.js`) — enrichment only (they don't affect completeness), rendered on the Understand step, and spoiler-free (they show before the concept check).
7. Classify difficulty in `difficulty.js` (Medium is the fallback).
8. If this problem's Code-step exercises should **also** appear as standalone fill-blank drills, add its title to `drillFillBlankTitles` in `assemble.js`.
9. **Review & certify to publish (final step).** The fields above make a problem *content-complete*, but it stays hidden until certified. Preview via review mode (`?review=1`), and when satisfied add its title to `certifiedTitles` in `src/data/assemble.js` — the gate that shows it to learners. `node server/scripts/validate-content.mjs` fails if a certified problem is incomplete and lists pending-review problems.
11. Classify the problem through the Easy and Hard title lists or the drill difficulty map. Medium is the fallback.

## Built lesson standard

A problem earns `✓ Built` only when all five stages are concrete, tailored, and interactive:

1. **Recognize** — the full problem statement, then input, output, example, then the concept check. The problem-specific intuition and "what to notice" cues name the pattern, so they stay **hidden until the learner answers the check** and are then revealed as the explanation (don't put them above the check — it spoils the recognition).
2. **Algorithm** — usable, ordered solution steps in technical language (return/iterate/push/pop/increment/index), fine-grained enough that the order isn't obvious at a glance, and phrased so no single word telegraphs a step's position. The offline builder shuffles them and the learner drags them into order; the AI coach (M9) walks the learner through building them. **Interchangeable steps:** the `algorithm` is an ordered list, but a nested array marks an **any-order group** whose members may be reordered (e.g. the `sum == / < / >` branches of a two-pointer scan), and a member may itself be an ordered block (`{ seq: [...] }`) that must stay together but can move as a unit (e.g. an if/else arm). `assemble.js` flattens this to a plain `algorithm` plus an `algorithmTree`; the builder accepts any valid linearization. There are still no `distractors` — it's a pure ordering task.
3. **Code fixes** — multiple short exercises from the actual solution.
4. **Complexity** — guided reasoning about total work and extra memory.
5. **Review** — insight, fit, common mistakes, final complexity, and optional code walkthrough.

Do not badge generic or draft content as Built.

**Built = content-complete AND certified.** Completeness is derived (`isComplete()` in `assemble.js`); certification is the `certifiedTitles` allowlist you add to after review. Only Built problems appear in the library and random walkthroughs. Content-complete but uncertified problems are hidden from the public but show in the owner's **review mode** (`?review=1`) as a "Pending review" band so you can run them before publishing. Incomplete drafts show a WIP banner if ever reached directly. Don't certify draft content — finish and review the five stages first.

## Drills and choices

Drills are **typed** (M10). A drill's `type` picks how it renders/validates; absent ⇒ `fill-blank`, so legacy drills are unchanged. The randomized queue **interleaves** all types. Types:

- **`fill-blank`** (default) — line synthesis. See "Whole-line selection" below.
- **`predict`** (`prediction-drills.js`, `predictionDrills`) — behavior prediction. Author a self-contained, human-traceable function (JS + Python) plus a call (`input`/`pythonInput`); `choices` are candidate return values; `correct` is the exact value. Favor a call whose input/answer isn't already shown in the problem's worked example (or the "Read more" panel spoils it).
- **`debug`** (`debug-drills.js`, `debugDrills`) — a two-step drill: a full function with exactly one wrong line; the learner spots the buggy line, then picks the fix. Author `code`/`pythonCode` (with the bug), `bug`/`fix` (`{line, py}` trimmed line text), `otherLines`/`otherFixes` (distractors + notes), `whyLine`/`whyFix`, and an `input` + `correctReturns`.
- **`edge-case`** (`edge-case-drills.js`, `edgeCaseDrills`) — a function + "which input produces this result?" Author `code`/`pythonCode` and `call`/`pythonCall` (the function name), shared `choices` (input literals — identical in JS/Python), `correct` (the input yielding `target`), `target`, and `why`/`wrong`. Make sure only the correct choice hits the target (the validator enforces uniqueness).
- **The validator EXECUTES the JS variant** of predict/debug/edge-case: `node server/scripts/validate-content.mjs` runs predict code against its call (result must equal `correct`); for debug it runs the buggy code (must differ) and the fixed code (buggy line → fix, must equal `correctReturns`); for edge-case it runs `call(choice)` for every choice (only `correct` may hit `target`). So a wrong answer, a bug that doesn't manifest, or a non-unique edge case fails the build. Keep the Python variant a faithful mirror (it's structurally checked, not executed).

**Whole-line selection** (`fill-blank`):

- Every fill-blank drill shows the full short solution with exactly one line replaced by a highlighted `___`, and the choices are **complete candidate lines** — the learner picks the whole correct line, never a single token. An exercise is `{ prompt, code, choices, correct, why, wrong }`: `code` is the full solution containing one `___` line; `choices` are full lines (one equals `correct`); `wrong` maps each incorrect line to feedback. Nothing is masked, so there is nothing to reverse-engineer — the correct line simply is not shown anywhere else.
- The correct line must be **unique** in the shown solution (no other identical line), or blanking it would leave the answer visible elsewhere. When a solution repeats a line (e.g. `left += 1` twice), blank a different, unique line.
- Code-fix exercises automatically feed the randomized drill queue.
- Standalone drills belong in `extraCodeDrills` or `supplemental-drills.js` and need context, JavaScript and Python variants, and difficulty. Every supplemental drill also needs a JavaScript and Python full solution in `supplemental-solutions.js`; supplemental drills build their shown code with the `blank(fullCode, correctLine)` helper, so the display is always the real solution with one line removed.
- Every walkthrough and drill renders a LeetCode source link from `src/lib/problem-source.js`. Add an explicit slug override there whenever a title does not match its LeetCode page slug.
- Keep every JavaScript and Python drill solution at or below 36 lines (`MAX_DRILL_CONTEXT_LINES`). The complete solution is visible directly below the prompt and scrolls independently of the choices so learners can inspect it without losing their answers.
- Drills offer optional **Read more about the problem** and **Read about the solution** sections. Keep the solution section below the answer choices. After a correct answer, open it, scroll the learner to the feedback, and show the only in-flow **Next random drill** button beneath that explanation. Prefer exact `inputOutput`, concepts, algorithms, and complexity supplied by the lesson record; a new built lesson should fill those fields so its optional explanations are problem-specific.
- Never make answer position part of the answer key. The shared shuffle helper randomizes every multiple-choice display.
- Correct feedback explains why the answer works. Incorrect feedback explains why that choice does not fit this problem without revealing the correct answer.

## Navigation and progress

- Home has Code drills and Full walkthroughs.
- Full walkthroughs presents two equal choices: browse the problem list or start a random walkthrough. Keep the list hidden until browse is chosen. The browse list is a single progression from **easier to harder**, split into **Easy/Medium/Hard bands** (`orderedCards()` in `model.js`) — deliberately **not** grouped by topic, since the category names the pattern the Recognize step asks the learner to spot. Random walkthroughs must select only problems marked Built; WIP problems remain available only through browsing. In a random walkthrough, Next picks another Built lesson and Previous follows that random-session history.
- A lesson uses a **guided stepper** with two clearly separated axes: (1) a tappable progress rail plus one always-present Back/Next-step bottom bar move *through the five steps* (consistent on every step, including Code); (2) a separate footer moves *to another problem*. Don't add a third competing step control. Tab labels are `Understand`/`Algorithm`/`Code`/`Complexity`/`Review`; each step gets a friendly plain-language header.
- Progress is stored only on the learner’s device as Unseen/Seen/Solved but shown to learners as **Not started / In progress / Done** (via `progressLabel` in `state.js`). Keep storage values stable so existing localStorage stays valid. Do not add server persistence without a clear product need for accounts or cross-device sync.
- User-facing content is escaped at render time (`escapeText`/`richText`/`escapeCode` in `ui.js`) because the DB is a supported authoring path. Don't interpolate authored prose raw. **This includes LLM output** — the M9 AI-coach response is untrusted and is escaped before rendering.
- The Algorithm step's **AI coach (M9)** is a Socratic, step-by-step build: it asks a question, judges the learner's proposed step, appends an accepted step to the growing solution or nudges (never revealing the answer), and asks the next. It renders **only** when `/api/health` reports `features.algorithmFeedback`, and **replaces** the drag-and-drop builder while on; the deterministic drag-and-drop builder is the offline/no-key fallback and must stay fully functional. Never make the LLM path required.

## Settings, filters, and theme (M11)

- **One panel, two tabs**, opened by the top-bar gear — a body-level overlay appended outside the zoomed `<main>`. **Settings**: language, theme (Light/Dark/Auto), text size, reduce-motion, reset progress. **Filters**: include-completed, drill types, difficulty.
- **The Filters tab is the single source of truth.** `appState.filters = { types[], difficulties[], includeCompleted }`, persisted as `walkcode-filters`. A drill passes only when **both** its type and difficulty are selected (empty set ⇒ nothing matches). The home chooser, the drill picker, **and** the walkthrough library all read from it, and difficulty also narrows the library and random-walkthrough picks. Don't reintroduce inline filter controls on those screens — link to the Filters tab with `filtersLink()` instead.
- **Theme** is `data-theme` on `<html>`: `auto` **removes** the attribute so `@media (prefers-color-scheme)` drives it (and follows the OS live); `light`/`dark` force it; persisted as `walkcode-theme`. Because colours are CSS variables (see project map), theming needs no per-view work — just use the tokens. **Reduce-motion** sets `data-reduced-motion` and disables the expand/transition animations on top of `prefers-reduced-motion`.
- **Reset progress** clears `walkcode-states` + `walkcode-drills` behind a confirm and keeps every pref.
- **The top bar is identical on every screen** (Home · title · gear). Don't hang per-screen controls off it — e.g. the random-drill **Skip** lives in the card head, and a completed drill is gated behind an "Already done — do it again?" prompt that reuses the *same* header and only swaps the content.

## Interview tracks (curated collections)

- A track is an ordered list of **existing built-problem titles** in `src/data/collections.js` — no per-track content, DB table, or API. To add/edit one, edit that file: give it a stable `id`, a generic `name`/`tagline`/`description` (don't name it after a real company), and a `titles` list. List titles roughly easy→hard; the UI re-sorts by difficulty anyway (`model.js:cardsForTitles`), so grouping stays correct if you reorder.
- **Every title must be a certified/built problem.** `validate-content.mjs` fails on any title that isn't built and on duplicate ids/titles — so run it after editing a track. A title that isn't built is dropped from the track at render time; certify it (see the Built gate) to include it.
- The track surfaces on the home **Interview tracks** card and the `collection` screen; opening a track problem walks the track in order via the lesson footer. No CSS/theme work is needed — the screen reuses existing tokens/classes.

## Before handing off changes

- Run syntax checks for every file in `src/` and `server/` (`node --check`).
- Run the drill validator: `node server/scripts/validate-content.mjs` (must pass — it enforces the whole-line drill contract for every JS and Python variant).
- Run the app with `docker compose up` (app + Postgres) and confirm the site loads, `/api/content` serves, and the flows work: Home, library browse, random walkthrough, the Filters tab (drill types + difficulty) driving random/pick/library, language + theme (incl. Auto) switching, all five lesson steps, and device-local progress. After editing `src/data/**`, restart the app container so it re-seeds Postgres. After editing `index.html`, `docker compose up -d --force-recreate app` (single-file bind mounts on macOS go stale — the served file can truncate).
- For drills, confirm each converted exercise has exactly one blanked line, `correct` among `choices`, feedback for every wrong line, and no other copy of the correct line in the shown code.
- Keep the frontend dependency-free and the backend minimal (`pg` only); no bundler or build step.
- Update this guide in the same change whenever a content schema or user workflow changes.
