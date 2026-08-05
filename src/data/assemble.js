// Pure content assembly. This is the single source of the assembled content shapes:
//   - the M5 seed importer reads assembleBundle() to fill Postgres,
//   - the server rebuilds the identical shapes from the DB for /api/content,
//   - the frontend uses it as the OFFLINE FALLBACK when /api/content is unreachable.
// Because all three derive from this one function, the DB, the API, and the fallback
// cannot drift. It replaces the old model.js assembly (model.js is now a thin selector
// over a loaded bundle). Keep this file free of DOM/browser globals so Node can run it
// during seeding.
import { curriculum } from './curriculum.js';
import { easyWalkthroughTitles, hardWalkthroughTitles } from './difficulty.js';
import { codeExercises, drillContext, extraCodeDrills } from './drills.js';
import { supplementalCodeDrills } from './supplemental-drills.js';
import { pythonExercises, pythonSolutions } from './languages.js';
import { briefs, complexityLessons, conceptChoices, fallback, featured, problemExplanations, profiles } from './lesson-records.js';
import { descriptionsByTitle, examplesByTitle } from './examples.js';
import { predictionDrills } from './prediction-drills.js';
import { debugDrills } from './debug-drills.js';
import { edgeCaseDrills } from './edge-case-drills.js';

export const LANGUAGES = ['JavaScript', 'Python'];

const featuredTopics = {
  'Two Sum': 'Arrays & Hashing',
  'Two Sum II': 'Two Pointers',
  'Longest Substring Without Repeating Characters': 'Sliding Window',
  'Binary Search': 'Binary Search',
  'Valid Parentheses': 'Stack',
  'Number of Islands': 'Graphs',
};

// A problem is shown to learners only when it is BOTH content-complete (all authored/interactive
// fields present — derived below) AND certified (reviewed & approved — this allowlist). Newly
// authored problems are complete but not yet certified, so they stay out of the live library
// until reviewed. Add a title here to publish it.
export const certifiedTitles = new Set([
  'Contains Duplicate', 'Valid Anagram', 'Valid Palindrome', 'Best Time to Buy and Sell Stock',
  'Min Stack', 'Maximum Depth of Binary Tree', 'Group Anagrams', '3Sum', 'Daily Temperatures',
  'Merge Two Sorted Lists', 'Climbing Stairs', 'Course Schedule', 'Diameter of Binary Tree',
  'Kth Largest Element in an Array', 'Coin Change', 'Distinct Subsequences', 'Two Sum II',
  'Longest Substring Without Repeating Characters', 'Valid Parentheses', 'Binary Search',
  'Reverse Linked List', 'Invert Binary Tree', 'Number of Islands',
]);

// Content-complete = has the full set of authored, interactive fields (what the Built experience
// needs). Distinct from certified: completeness is derived, certification is a human review gate.
function isComplete(lesson) {
  return Boolean(
    lesson.intuition
    && lesson.exercises && lesson.exercises.length
    && lesson.complexityGuide
    && lesson.inputOutput
    && lesson.conceptChoices,
  );
}

function baseCards() {
  return [
    ...Object.entries(curriculum).flatMap(([topic, titles]) => titles.map((title) => ({
      id: `${topic}:${title}`,
      topic,
      title,
    }))),
    ...Object.keys(featured)
      .filter((title) => !Object.values(curriculum).flat().includes(title))
      .map((title) => ({ id: `featured:${title}`, topic: featuredTopics[title] || 'Arrays & Hashing', title })),
  ].map((card, index) => ({ ...card, position: index + 1 }));
}

function difficultyFor(title) {
  if (hardWalkthroughTitles.includes(title)) return 'Hard';
  return easyWalkthroughTitles.includes(title) ? 'Easy' : 'Medium';
}

function localizedExercise(title, index, exercise, language) {
  if (language !== 'Python') return exercise;
  return { ...exercise, ...(pythonExercises[`${title}:${index}`] || {}) };
}

// Assembled lesson for one card in one language — same shape the views consume today.
function lessonFor(card, language) {
  const authored = featured[card.title];
  const profile = profiles[card.topic] || fallback;
  const base = authored || {
    brief: problemExplanations[card.title] || `Solve ${card.title}.`,
    ...profile,
    code: language === 'Python'
      ? `# ${card.title}\ndef solve(input):\n    # preserve the key invariant\n    return result`
      : `// ${card.title}\nfunction solve(input) {\n  // preserve the key invariant\n  return result;\n}`,
  };
  const lesson = {
    ...base,
    title: card.title,
    topic: card.topic,
    explanation: problemExplanations[card.title] || base.brief,
    code: language === 'Python' && (authored?.pythonCode || pythonSolutions[card.title])
      ? authored?.pythonCode || pythonSolutions[card.title]
      : base.code,
    inputOutput: authored?.inputOutput || briefs[card.title] || null,
    // Extra worked examples + an optional fuller statement (enrichment; not part of isComplete).
    examples: authored?.examples || examplesByTitle[card.title] || null,
    description: authored?.description || descriptionsByTitle[card.title] || null,
    conceptChoices: authored?.conceptChoices || conceptChoices[card.title] || null,
    // Problem-specific "aha" shown on the Recognize step (authored lessons only).
    intuition: authored?.intuition || null,
    exercises: (authored?.exercises || codeExercises[card.title] || []).map((exercise, index) => localizedExercise(card.title, index, exercise, language)),
    complexityGuide: authored?.complexityGuide || complexityLessons[card.title] || null,
    drillContext: drillContext[card.title] || null,
  };
  // The algorithm is an ordered sequence of steps, but authors can mark structure the reorder builder
  // should accept flexibly: a nested array is an interchangeable group (its members may be in any
  // order), and a member can itself be an ordered block (`{ seq: [...] }`) that moves as a unit, or a
  // nested group (`{ any: [...] }`). Flatten to a plain `algorithm` (used by display/coach/drills)
  // plus an `algorithmTree` whose leaves are step indices; the builder validates order against it.
  // Omitted for a plain flat sequence, which stays strict-order (unchanged behaviour).
  const flatAlgorithm = [];
  let grouped = false;
  const buildNode = (node) => {
    if (typeof node === 'string') { const index = flatAlgorithm.length; flatAlgorithm.push(node); return index; }
    if (Array.isArray(node)) { grouped = true; return { any: node.map(buildNode) }; }
    if (node && node.seq) { grouped = true; return { seq: node.seq.map(buildNode) }; }
    if (node && node.any) { grouped = true; return { any: node.any.map(buildNode) }; }
    const index = flatAlgorithm.length; flatAlgorithm.push(String(node)); return index;
  };
  const algorithmTree = { seq: (Array.isArray(base.algorithm) ? base.algorithm : []).map(buildNode) };
  lesson.algorithm = flatAlgorithm;
  if (grouped) lesson.algorithmTree = algorithmTree;

  lesson.isComplete = isComplete(lesson);
  // Built (shown to learners) requires BOTH completeness and certification (human review).
  lesson.isBuilt = lesson.isComplete && certifiedTitles.has(card.title);
  return lesson;
}

// A behavior-prediction drill (M10) carries both language variants already built (its code differs
// per language), so assembleBundle uses them directly instead of localizing a shared exercise.
function predictionItem(title, spec, index) {
  const base = { type: 'predict', prompt: spec.prompt, choices: spec.choices, correct: spec.correct, why: spec.why, wrong: spec.wrong };
  return {
    title,
    index,
    difficulty: difficultyFor(title),
    exercise: { ...base, code: spec.code, input: spec.input },
    pythonExercise: { ...base, code: spec.pythonCode, input: spec.pythonInput },
  };
}

// A debugging drill (M10) is a two-step drill (spot the wrong line, then pick the fix). The
// structured spec authors JS + Python line text once; this flattens it into the per-language
// exercise shape the view and validator consume (choices as plain strings, feedback keyed by line).
function debugItem(title, spec, index) {
  const build = (code, input, buggy, fix, lines, fixes) => ({
    type: 'debug', prompt: spec.prompt, code, input, correctReturns: spec.correctReturns,
    buggyLine: buggy, whyLine: spec.whyLine,
    lineChoices: [buggy, ...lines.map((o) => o.text)],
    wrongLine: Object.fromEntries(lines.map((o) => [o.text, o.note])),
    fix, whyFix: spec.whyFix,
    fixChoices: [fix, ...fixes.map((o) => o.text)],
    wrongFix: Object.fromEntries(fixes.map((o) => [o.text, o.note])),
  });
  return {
    title,
    index,
    difficulty: difficultyFor(title),
    exercise: build(spec.code, spec.input, spec.bug.line, spec.fix.line,
      spec.otherLines.map((o) => ({ text: o.line, note: o.note })), spec.otherFixes.map((o) => ({ text: o.line, note: o.note }))),
    pythonExercise: build(spec.pythonCode, spec.pythonInput, spec.bug.py, spec.fix.py,
      spec.otherLines.map((o) => ({ text: o.py, note: o.note })), spec.otherFixes.map((o) => ({ text: o.py, note: o.note }))),
  };
}

// An edge-case drill (M10) shares its input literals across languages (list/string/int syntax is
// identical), so only the function code and its name differ per language.
function edgeCaseItem(title, spec, index) {
  const base = { type: 'edge-case', prompt: spec.prompt, choices: spec.choices, correct: spec.correct, target: spec.target, why: spec.why, wrong: spec.wrong };
  return {
    title,
    index,
    difficulty: difficultyFor(title),
    exercise: { ...base, code: spec.code, call: spec.call },
    pythonExercise: { ...base, code: spec.pythonCode, call: spec.pythonCall },
  };
}

// Raw drill queue. Whole-line fill-blank drills (the default type) plus the typed drills (M10).
// The app shuffles this list, so the new types interleave with the fill-blank ones automatically.
function rawDrillItems() {
  const lessonDrills = Object.entries(codeExercises).flatMap(([title, exercises]) => exercises.map((exercise, index) => ({
    title,
    exercise,
    index,
    difficulty: difficultyFor(title),
  })));
  const predictions = Object.entries(predictionDrills).flatMap(([title, specs]) => specs.map((spec, index) => predictionItem(title, spec, index)));
  const debugs = Object.entries(debugDrills).flatMap(([title, specs]) => specs.map((spec, index) => debugItem(title, spec, index)));
  const edgeCases = Object.entries(edgeCaseDrills).flatMap(([title, specs]) => specs.map((spec, index) => edgeCaseItem(title, spec, index)));
  return [...lessonDrills, ...extraCodeDrills, ...supplementalCodeDrills, ...predictions, ...debugs, ...edgeCases];
}

// Deterministic, dependency-free djb2 string hash (base36, unsigned). Runs identically in Node and
// the browser (no crypto) — the single primitive behind both the content version and the server's
// per-problem review fingerprint (server/db.js imports this).
export function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) hash = (hash * 33) ^ str.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

// Content hash used to auto-detect content changes so a redeploy reseeds only when the bundled
// content actually changed.
function hashContent(value) {
  return `v${djb2(JSON.stringify(value))}`;
}

// The rich bundle the seeder consumes: every problem (cards + synthetic drill-only problems),
// every lesson keyed by problem id, and the ordered drill queue with both language variants
// resolved up front.
export function assembleBundle() {
  const cards = baseCards();
  const cardsByTitle = new Map(cards.map((card) => [card.title, card]));

  const lessons = {};
  for (const card of cards) {
    lessons[card.id] = Object.fromEntries(LANGUAGES.map((language) => [language, lessonFor(card, language)]));
  }

  const problems = cards.map((card) => {
    const lesson = lessons[card.id].JavaScript;
    return {
      id: card.id,
      title: card.title,
      topic: card.topic,
      difficulty: difficultyFor(card.title),
      isBuilt: lesson.isBuilt,       // complete AND certified → shown to learners
      isComplete: lesson.isComplete, // all fields present → eligible for review/certification
      isCard: true,
      position: card.position,
    };
  });

  // Stable per-drill id (for device-local progress and the pick-a-drill screen). Deterministic:
  // `${type}:${title}:${n}` where n counts within a (type, title) group in assembly order.
  const idCounts = new Map();
  const drills = rawDrillItems().map((item) => {
    const type = item.exercise?.type || 'fill-blank';
    const key = `${type}:${item.title}`;
    const n = idCounts.get(key) || 0;
    idCounts.set(key, n + 1);
    const drill = {
      id: `${key}:${n}`,
      title: item.title,
      difficulty: item.difficulty,
      index: item.index,
      exercise: item.exercise,
      pythonExercise: item.pythonExercise || localizedExercise(item.title, item.index, item.exercise, 'Python'),
    };
    if (item.topic) drill.topic = item.topic;
    if (item.context) drill.context = item.context;
    if (item.problemDescription) drill.problemDescription = item.problemDescription;
    return drill;
  });

  // Some drills reference titles that are not browsable cards (standalone drills). The drill
  // screen renders them through a synthetic `drill:<title>` card, so precompute those lessons
  // too — then the client only ever does a pure lesson lookup by id.
  let position = problems.length;
  for (const drill of drills) {
    if (cardsByTitle.has(drill.title)) continue;
    const syntheticId = `drill:${drill.title}`;
    if (lessons[syntheticId]) continue;
    const syntheticCard = { id: syntheticId, title: drill.title, topic: drill.topic || 'Code drill' };
    lessons[syntheticId] = Object.fromEntries(LANGUAGES.map((language) => [language, lessonFor(syntheticCard, language)]));
    position += 1;
    problems.push({
      id: syntheticId,
      title: drill.title,
      topic: syntheticCard.topic,
      difficulty: drill.difficulty || 'Medium',
      isBuilt: false,
      isComplete: false,
      isCard: false,
      position,
    });
  }

  const version = hashContent({ problems, lessons, drills });
  return { version, problems, lessons, drills };
}

// The shape the frontend consumes and /api/content returns: cards (browsable problems only),
// lessons keyed by problem id, and the drill queue. Derived from the rich bundle so the
// offline fallback is byte-for-byte what the DB-backed API produces.
export function clientBundleFrom(rich) {
  return {
    version: rich.version,
    cards: rich.problems
      .filter((problem) => problem.isCard)
      .map(({ id, topic, title, difficulty, isBuilt: built, isComplete: complete, position }) => ({ id, topic, title, difficulty, isBuilt: built, isComplete: complete, position })),
    lessons: rich.lessons,
    drills: rich.drills,
  };
}

// Convenience for the offline fallback path.
export function assembleClientBundle() {
  return clientBundleFrom(assembleBundle());
}
