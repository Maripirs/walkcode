const STATE_KEY = 'walkcode-states';
const LANGUAGE_KEY = 'walkcode-language';
const DRILL_KEY = 'walkcode-drills';
const UI_SCALE_KEY = 'walkcode-ui-scale';

// Global UI scale (applied via `zoom` on <main>). Mobile-first default is a touch compact; the
// settings panel lets the learner tune it. Clamped to a sane range so the app never breaks.
export const DEFAULT_UI_SCALE = 0.85;
const MIN_UI_SCALE = 0.7;
const MAX_UI_SCALE = 1.3;
function clampScale(scale) {
  return Math.min(MAX_UI_SCALE, Math.max(MIN_UI_SCALE, Math.round(scale * 100) / 100));
}
function loadUiScale() {
  const stored = parseFloat(localStorage.getItem(UI_SCALE_KEY));
  return Number.isFinite(stored) ? clampScale(stored) : DEFAULT_UI_SCALE;
}

// The Socratic AI coach's opening question, and a fresh coach session (M9). `steps` is the
// growing solution the learner builds; `prompt` is the current question; `input` survives the
// Algorithm step's re-renders.
export const COACH_OPENING = 'What should the solution set up or prepare first?';
export function freshCoach() {
  return { prompt: COACH_OPENING, steps: [], input: '', feedback: '', decision: '', done: false, summary: '', loading: false, error: '', unavailable: false };
}

export const appState = {
  language: localStorage.getItem(LANGUAGE_KEY) === 'JavaScript' ? 'JavaScript' : 'Python',
  // Global UI scale + whether the settings panel is open.
  uiScale: loadUiScale(),
  settingsOpen: false,
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
  // Home mode cards expand in place into their start options (Random vs Pick), one at a time.
  drillsExpanded: false,
  walkthroughExpanded: false,
  // One-shot: which card ('drills'|'walkthroughs'|null) just opened, so only a fresh open plays the
  // expand animation — re-renders while open (e.g. toggling the checkbox) must not replay it.
  animateCard: null,
  // Shared "random" setting: include items already completed (default: skip them). Applies to both
  // random drills and random walkthroughs.
  includeCompleted: false,
  // Pick/filter screen selection.
  drillFilter: { difficulty: 'All', type: 'All' },
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

// Device-local drill progress (M10): a map of solved drill id -> 1 in localStorage, separate from
// the per-problem `walkcode-states`. Drills are identified by their stable `id` (see assemble.js).
function solvedDrills() {
  return JSON.parse(localStorage.getItem(DRILL_KEY) || '{}');
}

export function isDrillSolved(id) {
  return Boolean(id && solvedDrills()[id]);
}

export function markDrillSolved(id) {
  if (!id) return;
  const map = solvedDrills();
  if (map[id]) return;
  map[id] = 1;
  localStorage.setItem(DRILL_KEY, JSON.stringify(map));
}

export function drillSolvedCount(ids) {
  const map = solvedDrills();
  return ids.reduce((count, id) => count + (map[id] ? 1 : 0), 0);
}

export function setLanguage(language) {
  appState.language = language;
  localStorage.setItem(LANGUAGE_KEY, language);
}

// Set the global UI scale (device-local), clamped to the safe range. Returns the applied value.
export function setUiScale(scale) {
  const clamped = clampScale(scale);
  appState.uiScale = clamped;
  localStorage.setItem(UI_SCALE_KEY, String(clamped));
  return clamped;
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
