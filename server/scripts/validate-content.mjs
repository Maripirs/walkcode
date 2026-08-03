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

const BLANK = '___';
const errors = [];

function validateExercise(where, exercise) {
  if (!exercise || typeof exercise.code !== 'string') {
    errors.push(`${where}: missing exercise code`);
    return;
  }
  const lines = exercise.code.split('\n');
  const blanks = lines.filter((line) => line.trim() === BLANK).length;
  if (blanks !== 1) errors.push(`${where}: expected exactly one blanked line, found ${blanks}`);

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

  const correctTrim = String(exercise.correct ?? '').trim();
  if (correctTrim && lines.some((line) => line.trim() === correctTrim)) {
    errors.push(`${where}: the correct line is still visible in the shown code (answer leak)`);
  }
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
  validateExercise(`${label} (JavaScript)`, drill.exercise);
  validateExercise(`${label} (Python)`, drill.pythonExercise);
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

const certifiedCount = cards.filter((c) => c.isBuilt).length;
console.log(`Cards: ${cards.length} | certified/live: ${certifiedCount} | pending review (complete, uncertified): ${pending.length}`);
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
