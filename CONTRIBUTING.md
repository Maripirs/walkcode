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
- `src/data/walkthrough-upgrades.js` holds complete lesson records for existing roadmap problems upgraded from Work in progress to Built. Each record needs JavaScript/Python code, input/output/example, concept choices, ordered steps, two code fixes, and guided complexity.
- `server/server.js` serves the static app and `/api/**`; `server/db.js` owns the schema, auto-seed, and the `/api/content` query. `server/llm.js` (M9) is the optional AI-feedback proxy behind `POST /api/algorithm-feedback` — provider-agnostic (OpenAI-compatible), config via `NVIDIA_API_KEY`/`LLM_BASE_URL`/`LLM_MODEL`, key never sent to the browser, off (route 503s) when no key is set. `pg` is the only backend dependency (the LLM proxy uses built-in `fetch`).
- `src/views/` renders one screen each. Keep screen-specific markup and event logic in the relevant view.
- `src/lib/state.js` owns device-local progress and UI state.
- `src/lib/ui.js` owns shared rendering helpers such as answer shuffling, tags, feedback, and pickers.
- `src/app.js` only coordinates navigation and connects views to data; do not add lesson content there.
- `src/styles.css` contains the shared visual system.

## Adding or upgrading a problem

1. Add the title to `curriculum.js` under its category.
2. Add a plain-language explanation in `lesson-records.js`.
3. Add or update a full lesson record in `lesson-records.js` when the problem needs authored concepts, algorithm steps, code, fixes, and complexity.
4. Add input, output, and a concrete example in `lesson-records.js`. For at least two examples total, add extra worked cases to `examplesByTitle` in `examples.js` (`{input, output, note?}` — favor edge cases; author every output from the real solution). Optionally add a fuller statement to `descriptionsByTitle` for subtler/Hard problems. Both are enrichment (they don't affect completeness) and render on the Understand step — examples in a collapsible "More examples", the description under the statement. Keep them free of approach spoilers (they show before the concept check).
5. Add a one-line problem-specific `intuition` (the "aha" for recognizing/approaching the problem — no code, no spoiler) to the lesson record. It renders on the Recognize step; omit it for WIP problems rather than writing a generic hint.
6. **Review & certify to publish (final step).** Authoring the fields above makes a problem *content-complete*, but it stays hidden until certified. Preview it via review mode (`?review=1`), and when you're satisfied add its title to `certifiedTitles` in `src/data/assemble.js` — that's the gate that shows it to learners. `node server/scripts/validate-content.mjs` fails if a certified problem is incomplete and lists pending-review problems. (No `distractors` — the Algorithm builder is a pure ordering task.)
7. Add an ordered concept-choice list in `lesson-records.js`; the first value is the answer key, but the UI randomizes its display position.
8. Add two or more real code exercises in `drills.js` using the whole-line format (see **Drills and choices**): the full solution with one line blanked, complete-line choices, specific correct feedback, and problem-specific wrong-answer feedback.
9. Add Python code and exercise variants when the walkthrough supports Python.
10. Add a tailored complexity record when generic complexity guidance would be inaccurate.
11. Classify the problem through the Easy and Hard title lists or the drill difficulty map. Medium is the fallback.

## Built lesson standard

A problem earns `✓ Built` only when all five stages are concrete, tailored, and interactive:

1. **Recognize** — the full problem statement, then input, output, example, then the concept check. The problem-specific intuition and "what to notice" cues name the pattern, so they stay **hidden until the learner answers the check** and are then revealed as the explanation (don't put them above the check — it spoils the recognition).
2. **Algorithm** — usable, ordered solution steps. The offline builder shuffles them and the learner drags them into order; the AI coach (M9) walks the learner through building them.
3. **Code fixes** — multiple short exercises from the actual solution.
4. **Complexity** — guided reasoning about total work and extra memory.
5. **Review** — insight, fit, common mistakes, final complexity, and optional code walkthrough.

Do not badge generic or draft content as Built.

**Built = content-complete AND certified.** Completeness is derived (`isComplete()` in `assemble.js`); certification is the `certifiedTitles` allowlist you add to after review. Only Built problems appear in the library and random walkthroughs. Content-complete but uncertified problems are hidden from the public but show in the owner's **review mode** (`?review=1`) as a "Pending review" band so you can run them before publishing. Incomplete drafts show a WIP banner if ever reached directly. Don't certify draft content — finish and review the five stages first.

## Drills and choices

- **Whole-line selection.** Every drill shows the full short solution with exactly one line replaced by a highlighted `___`, and the choices are **complete candidate lines** — the learner picks the whole correct line, never a single token. An exercise is `{ prompt, code, choices, correct, why, wrong }`: `code` is the full solution containing one `___` line; `choices` are full lines (one equals `correct`); `wrong` maps each incorrect line to feedback. Nothing is masked, so there is nothing to reverse-engineer — the correct line simply is not shown anywhere else.
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

## Before handing off changes

- Run syntax checks for every file in `src/` and `server/` (`node --check`).
- Run the drill validator: `node server/scripts/validate-content.mjs` (must pass — it enforces the whole-line drill contract for every JS and Python variant).
- Run the app with `docker compose up` (app + Postgres) and confirm the site loads, `/api/content` serves, and the flows work: Home, library browse, random walkthrough, drill filtering, language switching, all five lesson steps, and device-local progress. After editing `src/data/**`, restart the app container so it re-seeds Postgres.
- For drills, confirm each converted exercise has exactly one blanked line, `correct` among `choices`, feedback for every wrong line, and no other copy of the correct line in the shown code.
- Keep the frontend dependency-free and the backend minimal (`pg` only); no bundler or build step.
- Update this guide in the same change whenever a content schema or user workflow changes.
