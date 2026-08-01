# Contributing to Walkcode

Walkcode is a static site. Keep it lightweight, mobile-friendly, and understandable without a backend or build pipeline.

## Project map

- `src/data/curriculum.js` is the roadmap: topic names and problem titles.
- `src/data/lesson-records.js`, `drills.js`, `supplemental-drills.js`, `languages.js`, and `difficulty.js` together are the content source of truth. Keep explanations, walkthrough records, drills, language variants, and difficulty metadata in their matching file.
- `src/views/` renders one screen each. Keep screen-specific markup and event logic in the relevant view.
- `src/lib/state.js` owns device-local progress and UI state.
- `src/lib/ui.js` owns shared rendering helpers such as answer shuffling, tags, feedback, and pickers.
- `src/app.js` only coordinates navigation and connects views to data; do not add lesson content there.
- `src/styles.css` contains the shared visual system.

## Adding or upgrading a problem

1. Add the title to `curriculum.js` under its category.
2. Add a plain-language explanation in `lesson-records.js`.
3. Add or update a full lesson record in `lesson-records.js` when the problem needs authored concepts, algorithm steps, code, fixes, and complexity.
4. Add input, output, and a concrete example in `lesson-records.js`.
5. Add an ordered concept-choice list in `lesson-records.js`; the first value is the answer key, but the UI randomizes its display position.
6. Add two or more real code exercises in `drills.js`. Every exercise needs one correct answer, specific correct feedback, and problem-specific wrong-answer feedback.
7. Add Python code and exercise variants when the walkthrough supports Python.
8. Add a tailored complexity record when generic complexity guidance would be inaccurate.
9. Classify the problem through the Easy and Hard title lists or the drill difficulty map. Medium is the fallback.

## Built lesson standard

A problem earns `✓ Built` only when all five stages are concrete, tailored, and interactive:

1. **Recognize** — real input, output, example, and a concept check.
2. **Algorithm** — usable solution steps plus at least one believable extra step; learners assemble and order their answer.
3. **Code fixes** — multiple short exercises from the actual solution.
4. **Complexity** — guided reasoning about total work and extra memory.
5. **Review** — insight, fit, common mistakes, final complexity, and optional code walkthrough.

Do not badge generic or draft content as Built.

Every problem that is not Built is automatically labeled **Work in progress** in the library and shows a placeholder banner inside its walkthrough. Do not remove or soften that signal until the lesson meets the full Built standard.

## Drills and choices

- Code-fix exercises automatically feed the randomized drill queue.
- Standalone drills belong in `extraCodeDrills` or `supplemental-drills.js` and need context, JavaScript and Python variants, and difficulty. Every supplemental drill also needs a JavaScript and Python full solution in `supplemental-solutions.js`; keep the line containing the blank as a real segment of that solution.
- Every walkthrough and drill renders a LeetCode source link from `src/lib/problem-source.js`. Add an explicit slug override there whenever a title does not match its LeetCode page slug.
- A full-code context reveal is shown only when the completed blank line is a real segment of a meaningfully larger solution. It must retain that focused line with a visibly highlighted `___`, show the actual surrounding code, and never fake context by repeating the preview. If the answer naturally occurs elsewhere in that real solution, the renderer masks those repeats rather than leaking it.
- Never make answer position part of the answer key. The shared shuffle helper randomizes every multiple-choice display.
- Correct feedback explains why the answer works. Incorrect feedback explains why that choice does not fit this problem without revealing the correct answer.

## Navigation and progress

- Home has Code drills and Full walkthroughs.
- Full walkthroughs presents two equal choices: browse by category or start a random walkthrough. Keep the list hidden until browse is chosen. Random walkthroughs must select only problems marked Built; WIP problems remain available only through browsing. In a random walkthrough, Next picks another Built lesson and Previous follows that random-session history.
- Progress is stored only on the learner’s device as Unseen, Seen, or Solved. Do not add server persistence without a clear product need for accounts or cross-device sync.

## Before handing off changes

- Run syntax checks for every file in `src/`.
- Verify Home, library browse, random walkthrough, drill filtering, language switching, all five lesson steps, and device-local progress.
- Keep the entry point small and avoid new dependencies.
- Update this guide in the same change whenever a content schema or user workflow changes.
