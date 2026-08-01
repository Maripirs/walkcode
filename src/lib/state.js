const STATE_KEY = 'walkcode-states';
const LANGUAGE_KEY = 'walkcode-language';

export const appState = {
  language: localStorage.getItem(LANGUAGE_KEY) === 'Python' ? 'Python' : 'JavaScript',
  screen: 'home',
  currentCardId: null,
  lessonStep: 0,
  walkthroughPickerOpen: false,
  walkthroughMode: 'browse',
  randomWalkthroughHistory: [],
  randomWalkthroughIndex: -1,
  drillDifficulty: 'All',
  drillQueue: [],
  drillIndex: 0,
  codeFixIndex: 0,
  complexityStage: 0,
  algorithm: { available: [], answer: [] },
};

export function getProgress(cardId) {
  return JSON.parse(localStorage.getItem(STATE_KEY) || '{}')[cardId] || 'Unseen';
}

export function setProgress(cardId, value) {
  const progress = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
  progress[cardId] = value;
  localStorage.setItem(STATE_KEY, JSON.stringify(progress));
}

export function setLanguage(language) {
  appState.language = language;
  localStorage.setItem(LANGUAGE_KEY, language);
}

export function resetLesson(cardId) {
  appState.currentCardId = cardId;
  appState.lessonStep = 0;
  appState.codeFixIndex = 0;
  appState.complexityStage = 0;
  appState.algorithm = { available: [], answer: [] };
  if (getProgress(cardId) === 'Unseen') setProgress(cardId, 'Seen');
}
