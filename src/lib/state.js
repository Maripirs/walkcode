const STATE_KEY = 'walkcode-states';
const LANGUAGE_KEY = 'walkcode-language';

// The Socratic AI coach's opening question, and a fresh coach session (M9). `steps` is the
// growing solution the learner builds; `prompt` is the current question; `input` survives the
// Algorithm step's re-renders.
export const COACH_OPENING = 'What should the solution set up or prepare first?';
export function freshCoach() {
  return { prompt: COACH_OPENING, steps: [], input: '', feedback: '', decision: '', done: false, summary: '', loading: false, error: '', unavailable: false };
}

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
  // Guided AI coach session for the Algorithm step (M9).
  algorithmCoach: freshCoach(),
  // When true, the Algorithm step uses the deterministic drag-and-drop builder even if the AI
  // coach is available (learner chose it, or the coach was unavailable). Reset per lesson.
  stepBuilderFallback: false,
  // Whether the collapsible problem reminder is expanded (persists across steps/problems).
  reminderOpen: false,
  // Server-advertised capabilities (from /api/health). Empty until probed / when offline.
  features: {},
  // Owner review mode (set from ?review or localStorage): reveals content-complete but not-yet-
  // certified problems in the library so they can be run and reviewed before being published.
  reviewMode: localStorage.getItem('walkcode-review') === '1',
  // The /review approve-reject screen (token-gated).
  review: {
    token: localStorage.getItem('walkcode-review-token') || '',
    problems: [],
    loading: false,
    error: '',
    loaded: false,
    saving: '',
    drafts: {}, // title -> in-progress feedback text
  },
};

export function getProgress(cardId) {
  return JSON.parse(localStorage.getItem(STATE_KEY) || '{}')[cardId] || 'Unseen';
}

// Learner-facing wording for the stored states. Storage keeps the legacy Unseen/Seen/Solved
// values (so existing localStorage stays valid); the UI shows these clearer labels instead.
const PROGRESS_LABELS = { Unseen: 'Not started', Seen: 'In progress', Solved: 'Done' };

export function progressLabel(cardId) {
  return PROGRESS_LABELS[getProgress(cardId)] || 'Not started';
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
  appState.algorithmCoach = freshCoach();
  appState.stepBuilderFallback = false;
  if (getProgress(cardId) === 'Unseen') setProgress(cardId, 'Seen');
}
