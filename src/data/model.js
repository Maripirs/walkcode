// Thin selector over a loaded content bundle. Historically this file assembled content
// directly from the src/data/** modules; in M5 that assembly moved to assemble.js and the
// content is loaded at runtime (from /api/content, with an offline fallback) via
// initContent(). The public interface below is unchanged, so the views/app.js keep consuming
// `cards`, `lessonFor`, `drillItems`, etc. exactly as before.

import { DIFFICULTY_RANK } from './difficulty.js';

let bundle = { version: '', cards: [], lessons: {}, drills: [] };

// Live bindings: reassigned by initContent() and observed by importers (app.js).
export let cards = [];
export let cardsById = new Map();
let cardsByTitle = new Map();

export function initContent(next) {
  bundle = next || bundle;
  cards = bundle.cards || [];
  cardsById = new Map(cards.map((card) => [card.id, card]));
  cardsByTitle = new Map(cards.map((card) => [card.title, card]));
}

export function contentVersion() {
  return bundle.version;
}

export function difficultyFor(title) {
  return cardsByTitle.get(title)?.difficulty || 'Medium';
}

export function isBuilt(title) {
  return cardsByTitle.get(title)?.isBuilt || false;
}

// Content-complete (all authored fields present) but not necessarily certified/shown — used by
// the owner's review mode to surface problems that are ready for review.
export function isComplete(title) {
  return cardsByTitle.get(title)?.isComplete || false;
}

export function lessonFor(card, language) {
  const byLanguage = bundle.lessons[card.id];
  const lesson = byLanguage?.[language] || byLanguage?.JavaScript;
  if (lesson) return lesson;
  // Defensive fallback: the bundle precomputes a lesson for every card and every drill's
  // synthetic card, so this should not be reached in practice.
  return {
    title: card.title,
    topic: card.topic,
    isBuilt: false,
    brief: `Solve ${card.title}.`,
    explanation: `Solve ${card.title}.`,
    concepts: [],
    algorithm: [],
    fixes: [],
    complexity: '',
    code: '',
    inputOutput: null,
    conceptChoices: null,
    intuition: null,
    exercises: [],
    complexityGuide: null,
    drillContext: null,
    isComplete: false,
  };
}

export function groupedCards() {
  return cards.reduce((groups, card) => {
    (groups[card.topic] ||= []).push(card);
    return groups;
  }, {});
}

// Library browse order: a single flat list from easier to harder. We deliberately do NOT group
// by topic — the category names the very pattern the Recognize step asks the learner to spot.
// Ties (same difficulty) keep the curriculum/roadmap order via `position`.

export function orderedCards() {
  return [...cards].sort((a, b) =>
    (DIFFICULTY_RANK[a.difficulty] ?? 1) - (DIFFICULTY_RANK[b.difficulty] ?? 1)
    || (a.position ?? 0) - (b.position ?? 0));
}

export function drillItems() {
  return bundle.drills;
}
