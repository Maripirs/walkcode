// Content validator for Walkcode. Runs against the assembled bundle (the single source used by
// the seeder, the API, and the offline fallback), so it checks exactly what ships.
//
// (A) Every drill exercise (JS + Python) obeys the whole-line drill contract from CONTRIBUTING.md:
//     one blanked line, `correct` ∈ `choices`, unique choices, feedback for each wrong choice, and
//     no visible copy of the correct line.
// (B) Certification integrity: every CERTIFIED (published) problem must be content-complete; and
//     complete-but-uncertified problems are listed as "pending review".
//
// Usage: `node server/scripts/validate-content.mjs` — exits non-zero if anything fails.
import { assembleBundle, certifiedTitles } from '../../src/data/assemble.js';
import { collections } from '../../src/data/collections.js';
import { BLANK, indentOf } from '../../src/data/blank-line.js';

const errors = [];

// Shared across all drill types: the answer is offered, choices are distinct, and every wrong
// choice explains itself.
function validateChoices(where, exercise) {
  const choices = exercise.choices || [];
  if (!choices.includes(exercise.correct)) errors.push(`${where}: correct answer is not among the choices`);

  const seen = new Set();
  for (const choice of choices) {
    if (seen.has(choice)) errors.push(`${where}: duplicate choice ${JSON.stringify(choice)}`);
    seen.add(choice);
  }
  for (const choice of choices) {
    if (choice === exercise.correct) continue;
    const why = exercise.wrong?.[choice];
    if (!why || !String(why).trim()) errors.push(`${where}: missing wrong-answer feedback for ${JSON.stringify(choice)}`);
  }
}

// Fill-blank: exactly one blanked line, and the correct line is not visible elsewhere (no leak).
function validateFillBlank(where, exercise) {
  const lines = exercise.code.split('\n');
  const blanks = lines.filter((line) => line.trim() === BLANK).length;
  if (blanks !== 1) errors.push(`${where}: expected exactly one blanked line, found ${blanks}`);
  validateChoices(where, exercise);
  const correctTrim = String(exercise.correct ?? '').trim();
  if (correctTrim && lines.some((line) => line.trim() === correctTrim)) {
    errors.push(`${where}: the correct line is still visible in the shown code (answer leak)`);
  }
}

// Runs a self-contained snippet against a call expression, returning the value. Used to prove that
// authored predict answers / debug bugs actually hold. We only execute the JS variant (Node).
function runCode(code, input) {
  // eslint-disable-next-line no-new-func -- validating our own authored content, Node-only.
  return Function(`"use strict";\n${code}\n;return (${input});`)();
}

// Parse `correct`/`correctReturns` (a string like "5" or "[1, 2]") to the value it denotes.
function expectedValue(raw) {
  try { return JSON.parse(raw); } catch { return raw; }
}

// A named choice set (predict/debug reuse this via their own field names).
function validateChoiceSet(where, label, choices, correct, wrong) {
  if (!choices.includes(correct)) errors.push(`${where}: ${label} correct answer is not among the choices`);
  const seen = new Set();
  for (const choice of choices) {
    if (seen.has(choice)) errors.push(`${where}: ${label} duplicate choice ${JSON.stringify(choice)}`);
    seen.add(choice);
  }
  for (const choice of choices) {
    if (choice === correct) continue;
    const why = wrong?.[choice];
    if (!why || !String(why).trim()) errors.push(`${where}: ${label} missing feedback for ${JSON.stringify(choice)}`);
  }
}

// Predict: needs a call, and — for the JS variant — the code is actually RUN against that call and
// the result must equal `correct`, so a wrong authored answer can't slip through.
function verifyPredictExecution(where, exercise) {
  let result;
  try { result = runCode(exercise.code, exercise.input); }
  catch (error) { errors.push(`${where}: predict code threw when run — ${error.message}`); return; }
  if (JSON.stringify(result) !== JSON.stringify(expectedValue(exercise.correct))) {
    errors.push(`${where}: predict answer mismatch — code returns ${JSON.stringify(result)} but "correct" is ${JSON.stringify(exercise.correct)}`);
  }
}

function validatePredict(where, exercise, runJs) {
  if (typeof exercise.input !== 'string' || !exercise.input.trim()) errors.push(`${where}: predict drill is missing an input call`);
  validateChoices(where, exercise);
  if (runJs && exercise.input) verifyPredictExecution(where, exercise);
}

// Debug: the buggy line appears once, the fix isn't already shown, choices are real code lines, and
// — for the JS variant — running the buggy code must differ from correctReturns while running the
// FIXED code (buggy line swapped for the fix) must equal it. So the bug and its fix both hold up.
function verifyDebugExecution(where, exercise, lines) {
  let buggy;
  try { buggy = runCode(exercise.code, exercise.input); }
  catch (error) { errors.push(`${where}: buggy code threw when run — ${error.message}`); return; }
  const idx = lines.findIndex((line) => line.trim() === String(exercise.buggyLine).trim());
  if (idx < 0) return;
  const indent = indentOf(lines[idx]);
  const fixedLines = [...lines];
  fixedLines[idx] = indent + String(exercise.fix).trim();
  let fixed;
  try { fixed = runCode(fixedLines.join('\n'), exercise.input); }
  catch (error) { errors.push(`${where}: fixed code threw when run — ${error.message}`); return; }
  if (JSON.stringify(fixed) !== JSON.stringify(expectedValue(exercise.correctReturns))) {
    errors.push(`${where}: applying the fix returns ${JSON.stringify(fixed)} but correctReturns is ${JSON.stringify(exercise.correctReturns)}`);
  }
  if (JSON.stringify(buggy) === JSON.stringify(fixed)) {
    errors.push(`${where}: buggy and fixed code return the same value ${JSON.stringify(buggy)} — the bug doesn't manifest on this input`);
  }
}

function validateDebug(where, exercise, runJs) {
  const lines = exercise.code.split('\n');
  const trimmed = lines.map((line) => line.trim());
  const bugCount = trimmed.filter((line) => line === String(exercise.buggyLine).trim()).length;
  if (bugCount !== 1) errors.push(`${where}: the buggy line should appear exactly once in the code, found ${bugCount}`);
  if (trimmed.includes(String(exercise.fix).trim())) errors.push(`${where}: the fix line is already visible in the code (answer leak)`);
  for (const choice of exercise.lineChoices || []) {
    if (!trimmed.includes(String(choice).trim())) errors.push(`${where}: step-1 choice is not a line in the code: ${JSON.stringify(choice)}`);
  }
  validateChoiceSet(where, 'step-1', exercise.lineChoices || [], exercise.buggyLine, exercise.wrongLine);
  validateChoiceSet(where, 'step-2', exercise.fixChoices || [], exercise.fix, exercise.wrongFix);
  if (typeof exercise.input !== 'string' || !exercise.input.trim()) errors.push(`${where}: debug drill is missing an input call`);
  if (exercise.correctReturns === undefined) errors.push(`${where}: debug drill is missing correctReturns`);
  if (runJs && exercise.input && exercise.correctReturns !== undefined) verifyDebugExecution(where, exercise, lines);
}

// Edge-case: each choice is an input; running call(choice) must yield `target` for the correct
// choice and something else for every other — so exactly one choice is the answer.
function verifyEdgeCaseExecution(where, exercise) {
  const expected = expectedValue(exercise.target);
  for (const choice of exercise.choices || []) {
    let result;
    try { result = runCode(exercise.code, `${exercise.call}(${choice})`); }
    catch (error) { errors.push(`${where}: edge-case choice ${JSON.stringify(choice)} threw — ${error.message}`); continue; }
    const hitsTarget = JSON.stringify(result) === JSON.stringify(expected);
    if (choice === exercise.correct && !hitsTarget) {
      errors.push(`${where}: correct input ${JSON.stringify(choice)} returns ${JSON.stringify(result)}, not the target ${JSON.stringify(exercise.target)}`);
    }
    if (choice !== exercise.correct && hitsTarget) {
      errors.push(`${where}: distractor ${JSON.stringify(choice)} also yields the target — the answer isn't unique`);
    }
  }
}

function validateEdgeCase(where, exercise, runJs) {
  if (typeof exercise.call !== 'string' || !exercise.call.trim()) errors.push(`${where}: edge-case drill is missing a call (function name)`);
  if (exercise.target === undefined) errors.push(`${where}: edge-case drill is missing target`);
  validateChoices(where, exercise);
  if (runJs && exercise.call && exercise.target !== undefined) verifyEdgeCaseExecution(where, exercise);
}

// runJs: only the JavaScript variant is executed to verify its answer (we can't run Python here).
function validateExercise(where, exercise, runJs = false) {
  if (!exercise || typeof exercise.code !== 'string') {
    errors.push(`${where}: missing exercise code`);
    return;
  }
  const type = exercise.type || 'fill-blank';
  if (type === 'fill-blank') validateFillBlank(where, exercise);
  else if (type === 'predict') validatePredict(where, exercise, runJs);
  else if (type === 'debug') validateDebug(where, exercise, runJs);
  else if (type === 'edge-case') validateEdgeCase(where, exercise, runJs);
  else errors.push(`${where}: unknown drill type ${JSON.stringify(type)}`);
}

// The fields a problem needs to be publishable. Kept in sync with assemble.js `isComplete()`, plus
// a couple of sanity checks that a real (non-fallback) lesson always has.
function missingFields(js) {
  const missing = [];
  if (!(js.explanation || js.brief)) missing.push('statement');
  if (!js.inputOutput) missing.push('inputOutput');
  if (!(js.concepts && js.concepts.length)) missing.push('concepts');
  if (!js.conceptChoices) missing.push('conceptChoices');
  if (!js.intuition) missing.push('intuition');
  if (!(js.algorithm && js.algorithm.length >= 2)) missing.push('algorithm');
  if (!(js.exercises && js.exercises.length)) missing.push('exercises');
  if (!js.complexityGuide) missing.push('complexityGuide');
  if (!(js.fixes && js.fixes.length)) missing.push('fixes');
  if (!js.complexity) missing.push('complexity');
  return missing;
}

const bundle = assembleBundle();

// (A) Drills
let count = 0;
for (const drill of bundle.drills) {
  const label = `${drill.title}${drill.index !== undefined ? ` [#${drill.index}]` : ''}`;
  validateExercise(`${label} (JavaScript)`, drill.exercise, true);
  validateExercise(`${label} (Python)`, drill.pythonExercise, false);
  count += 2;
}

// (B) Certification integrity
const cards = bundle.problems.filter((p) => p.isCard);
const pending = [];
for (const card of cards) {
  const js = bundle.lessons[card.id].JavaScript;
  const certified = certifiedTitles.has(card.title);
  if (certified && !card.isBuilt) {
    errors.push(`CERTIFIED but incomplete — "${card.title}" is published but missing: ${missingFields(js).join(', ') || '(unknown)'}`);
  }
  if (card.isComplete && !certified) pending.push(card.title);
}

// (C) Interview tracks: every collection title must resolve to a certified/built problem, so a typo
// can't silently drop a problem from a track (cardsForTitles filters non-built titles out at render).
const builtTitles = new Set(cards.filter((c) => c.isBuilt).map((c) => c.title));
const seenIds = new Set();
for (const collection of collections) {
  if (seenIds.has(collection.id)) errors.push(`TRACK "${collection.id}": duplicate collection id`);
  seenIds.add(collection.id);
  const seenTitles = new Set();
  for (const title of collection.titles) {
    if (!builtTitles.has(title)) errors.push(`TRACK "${collection.name}": "${title}" is not a certified/built problem`);
    if (seenTitles.has(title)) errors.push(`TRACK "${collection.name}": "${title}" listed more than once`);
    seenTitles.add(title);
  }
}

const certifiedCount = cards.filter((c) => c.isBuilt).length;
console.log(`Cards: ${cards.length} | certified/live: ${certifiedCount} | pending review (complete, uncertified): ${pending.length} | tracks: ${collections.length}`);
if (pending.length) {
  console.log('\nPending review — content-complete, awaiting certification:');
  for (const title of pending) console.log(`  • ${title}`);
  console.log('\nCertify by adding the title to `certifiedTitles` in src/data/assemble.js.');
}

if (errors.length) {
  console.error(`\nContent validation FAILED — ${errors.length} issue(s):\n`);
  for (const error of errors) console.error(`  • ${error}`);
  process.exit(1);
}
console.log(`\nContent validation passed: ${count} drill exercises across ${bundle.drills.length} drills; all certified problems complete.`);
