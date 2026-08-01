import { curriculum } from './curriculum.js';
import { easyWalkthroughTitles, hardWalkthroughTitles } from './difficulty.js';
import { codeExercises, drillContext, drillDifficultyByTitle, extraCodeDrills } from './drills.js';
import { pythonExercises, pythonSolutions } from './languages.js';
import { briefs, complexityLessons, conceptChoices, fallback, featured, problemExplanations, profiles } from './lesson-records.js';

const featuredTopics = {
  'Two Sum': 'Arrays & Hashing',
  'Two Sum II': 'Two Pointers',
  'Longest Substring Without Repeating Characters': 'Sliding Window',
  'Binary Search': 'Binary Search',
  'Valid Parentheses': 'Stack',
  'Number of Islands': 'Graphs',
};

const builtTitles = new Set([
  'Contains Duplicate',
  'Two Sum II',
  'Longest Substring Without Repeating Characters',
  'Valid Parentheses',
  'Binary Search',
  'Reverse Linked List',
  'Invert Binary Tree',
  'Number of Islands',
]);

export const cards = [
  ...Object.entries(curriculum).flatMap(([topic, titles]) => titles.map((title) => ({
    id: `${topic}:${title}`,
    topic,
    title,
  }))),
  ...Object.keys(featured)
    .filter((title) => !Object.values(curriculum).flat().includes(title))
    .map((title) => ({ id: `featured:${title}`, topic: featuredTopics[title] || 'Arrays & Hashing', title })),
].map((card, index) => ({ ...card, position: index + 1 }));

export const cardsById = new Map(cards.map((card) => [card.id, card]));

export function difficultyFor(title) {
  if (drillDifficultyByTitle[title]) return drillDifficultyByTitle[title];
  if (hardWalkthroughTitles.includes(title)) return 'Hard';
  return easyWalkthroughTitles.includes(title) ? 'Easy' : 'Medium';
}

export function isBuilt(title) {
  return builtTitles.has(title);
}

export function lessonFor(card, language) {
  const authored = featured[card.title];
  const profile = profiles[card.topic] || fallback;
  const base = authored || {
    brief: problemExplanations[card.title] || `Solve ${card.title}.`,
    ...profile,
    code: language === 'Python'
      ? `# ${card.title}\ndef solve(input):\n    # preserve the key invariant\n    return result`
      : `// ${card.title}\nfunction solve(input) {\n  // preserve the key invariant\n  return result;\n}`,
  };
  return {
    ...base,
    title: card.title,
    topic: card.topic,
    explanation: problemExplanations[card.title] || base.brief,
    code: language === 'Python' && pythonSolutions[card.title]
      ? pythonSolutions[card.title]
      : base.code,
    inputOutput: briefs[card.title] || null,
    conceptChoices: conceptChoices[card.title] || null,
    exercises: (codeExercises[card.title] || []).map((exercise, index) => localizedExercise(card.title, index, exercise, language)),
    complexityGuide: complexityLessons[card.title] || null,
    drillContext: drillContext[card.title],
    isBuilt: isBuilt(card.title),
  };
}

export function localizedExercise(title, index, exercise, language) {
  if (language !== 'Python') return exercise;
  return { ...exercise, ...(pythonExercises[`${title}:${index}`] || {}) };
}

export function groupedCards() {
  return cards.reduce((groups, card) => {
    (groups[card.topic] ||= []).push(card);
    return groups;
  }, {});
}

export function drillItems() {
  const lessonDrills = Object.entries(codeExercises).flatMap(([title, exercises]) => exercises.map((exercise, index) => ({
    title,
    exercise,
    index,
    difficulty: difficultyFor(title),
  })));
  return [...lessonDrills, ...extraCodeDrills];
}
