import { DIFFICULTIES } from '../data/difficulty.js';

const STATE_KEY = 'walkcode-states';
const LANGUAGE_KEY = 'walkcode-language';
const DRILL_KEY = 'walkcode-drills';
const UI_SCALE_KEY = 'walkcode-ui-scale';
const THEME_KEY = 'walkcode-theme';
const FILTERS_KEY = 'walkcode-filters';
const REDUCED_MOTION_KEY = 'walkcode-reduced-motion';

// Explicit reduced-motion override (M11), on top of the OS `prefers-reduced-motion`. Persisted
// device-local; applied as `data-reduced-motion` on <html> (see app.js applyReducedMotion).
function loadReducedMotion() {
  return localStorage.getItem(REDUCED_MOTION_KEY) === '1';
}

// Content filters (M11) — the single source of truth for what random/pick/browse show, edited only
// in the settings panel's Filters tab and persisted device-local. `types`/`difficulties` are the
// SELECTED values (a drill passes when its type AND difficulty are both selected); an empty set
// therefore matches nothing. Default: everything selected. `includeCompleted` governs whether random
// drills AND random walkthroughs reuse already-completed items.
// Drill types (single source): the ordered meta drives the id list, the labels, and the sort rank.
const DRILL_TYPE_META = [
  { id: 'fill-blank', label: 'Fill the blank' },
  { id: 'predict', label: 'Predict the output' },
  { id: 'debug', label: 'Find the bug' },
  { id: 'edge-case', label: 'Spot the edge case' },
];
export const DRILL_TYPES = DRILL_TYPE_META.map((t) => t.id);
export const TYPE_LABELS = Object.fromEntries(DRILL_TYPE_META.map((t) => [t.id, t.label]));
export const TYPE_RANK = Object.fromEntries(DRILL_TYPE_META.map((t, i) => [t.id, i]));
// Difficulty vocabulary is the pure data module's single source; re-export for state/view use.
export { DIFFICULTIES };
function loadFilters() {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(FILTERS_KEY)) || {}; } catch { stored = {}; }
  // Keep only known values, preserving the allowed order; missing key ⇒ all selected (default).
  const clean = (values, allowed) => (Array.isArray(values) ? allowed.filter((v) => values.includes(v)) : [...allowed]);
  return {
    types: clean(stored.types, DRILL_TYPES),
    difficulties: clean(stored.difficulties, DIFFICULTIES),
    includeCompleted: Boolean(stored.includeCompleted),
  };
}

// Colour theme (device-local). 'auto' follows the OS via `prefers-color-scheme`; 'light'/'dark'
// force it. Applied as `data-theme` on <html> (see app.js applyTheme). Default: auto.
export const THEMES = ['light', 'dark', 'auto'];
export const DEFAULT_THEME = 'auto';
function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return THEMES.includes(stored) ? stored : DEFAULT_THEME;
}

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
  // Global UI scale, colour theme, + the settings panel (whether open, and which tab).
  uiScale: loadUiScale(),
  theme: loadTheme(),
  reducedMotion: loadReducedMotion(),
  settingsOpen: false,
  settingsTab: 'settings', // 'settings' | 'filters'
  screen: 'home',
  currentCardId: null,
  lessonStep: 0,
  walkthroughPickerOpen: false,
  walkthroughMode: 'browse',
  randomWalkthroughHistory: [],
  randomWalkthroughIndex: -1,
  drillQueue: [],
  drillIndex: 0,
  // Sort order for the drill-picker browse list: 'default' | 'name' | 'difficulty' | 'type'.
  drillSort: 'default',
  // When the current random drill is already solved, we gate it behind an "Already done — do it
  // again?" prompt; this flips true once the learner chooses to redo it, and resets on advance.
  drillRedo: false,
  // Home mode cards expand in place into their start options (Random vs Pick), one at a time.
  drillsExpanded: false,
  walkthroughExpanded: false,
  collectionsExpanded: false,
  // Which interview track (collection id) is being viewed / walked through, if any.
  currentCollectionId: null,
  // One-shot: which card ('drills'|'walkthroughs'|null) just opened, so only a fresh open plays the
  // expand animation — re-renders while open (e.g. toggling the checkbox) must not replay it.
  animateCard: null,
  // The single source of truth for content filters (drill types, difficulties, and whether random
  // reuses completed items). Owned by the settings panel's Filters tab; see loadFilters/setFilters.
  filters: loadFilters(),
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

// Set the colour theme (device-local). Applied by app.js applyTheme().
export function setTheme(theme) {
  const value = THEMES.includes(theme) ? theme : DEFAULT_THEME;
  appState.theme = value;
  localStorage.setItem(THEME_KEY, value);
  return value;
}

// Set the reduced-motion override (device-local). Applied by app.js applyReducedMotion().
export function setReducedMotion(on) {
  appState.reducedMotion = Boolean(on);
  localStorage.setItem(REDUCED_MOTION_KEY, appState.reducedMotion ? '1' : '0');
  return appState.reducedMotion;
}

// Owner review mode (device-local). Reveals a triage view of problems still awaiting review and
// hides fully-reviewed ones; the Settings toggle that drives this is shown only when a review token
// is loaded. Persisted as `walkcode-review` (same key the `?review` URL param uses).
export function setReviewMode(on) {
  appState.reviewMode = Boolean(on);
  if (appState.reviewMode) localStorage.setItem('walkcode-review', '1');
  else localStorage.removeItem('walkcode-review');
  return appState.reviewMode;
}

// Clear device-local learning progress — per-problem states AND solved drills — behind a confirm in
// the UI. Deliberately keeps preferences (language, theme, text size, filters, reduced-motion).
export function resetProgress() {
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(DRILL_KEY);
}

// Merge a patch into the content filters (device-local) and persist. Returns the new filters.
export function setFilters(patch) {
  appState.filters = { ...appState.filters, ...patch };
  localStorage.setItem(FILTERS_KEY, JSON.stringify(appState.filters));
  return appState.filters;
}

// Toggle one value in a list-valued filter ('types' or 'difficulties').
export function toggleFilterValue(key, value) {
  const current = appState.filters[key] || [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return setFilters({ [key]: next });
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
