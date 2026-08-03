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
import { codeExercises, drillContext, drillDifficultyByTitle, extraCodeDrills } from './drills.js';
import { supplementalCodeDrills } from './supplemental-drills.js';
import { walkthroughUpgrades } from './walkthrough-upgrades.js';
import { pythonExercises, pythonSolutions } from './languages.js';
import { briefs, complexityLessons, conceptChoices, fallback, featured, problemExplanations, profiles } from './lesson-records.js';

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
  if (drillDifficultyByTitle[title]) return drillDifficultyByTitle[title];
  if (hardWalkthroughTitles.includes(title)) return 'Hard';
  return easyWalkthroughTitles.includes(title) ? 'Easy' : 'Medium';
}

function localizedExercise(title, index, exercise, language) {
  if (language !== 'Python') return exercise;
  return { ...exercise, ...(pythonExercises[`${title}:${index}`] || {}) };
}

// Assembled lesson for one card in one language — same shape the views consume today.
function lessonFor(card, language) {
  const authored = featured[card.title] || walkthroughUpgrades[card.title];
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
    conceptChoices: authored?.conceptChoices || conceptChoices[card.title] || null,
    // Problem-specific "aha" shown on the Recognize step (authored lessons only).
    intuition: authored?.intuition || null,
    exercises: (authored?.exercises || codeExercises[card.title] || []).map((exercise, index) => localizedExercise(card.title, index, exercise, language)),
    complexityGuide: authored?.complexityGuide || complexityLessons[card.title] || null,
    drillContext: drillContext[card.title] || null,
  };
  lesson.isComplete = isComplete(lesson);
  // Built (shown to learners) requires BOTH completeness and certification (human review).
  lesson.isBuilt = lesson.isComplete && certifiedTitles.has(card.title);
  return lesson;
}

// Raw drill queue in the same order the app renders it today.
function rawDrillItems() {
  const lessonDrills = Object.entries(codeExercises).flatMap(([title, exercises]) => exercises.map((exercise, index) => ({
    title,
    exercise,
    index,
    difficulty: difficultyFor(title),
  })));
  return [...lessonDrills, ...extraCodeDrills, ...supplementalCodeDrills];
}

// Deterministic, dependency-free content hash (djb2). Runs identically in Node and the
// browser (no crypto). Used to auto-detect content changes so a redeploy reseeds only when
// the bundled content actually changed.
function hashContent(value) {
  const str = JSON.stringify(value);
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return `v${(hash >>> 0).toString(36)}`;
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

  const drills = rawDrillItems().map((item) => {
    const drill = {
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
