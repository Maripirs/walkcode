import { cards, cardsById, difficultyFor, drillItems, initContent, isBuilt, lessonFor, orderedCards } from './data/model.js';
import { appState, DEFAULT_UI_SCALE, DIFFICULTIES, DRILL_TYPES, drillSolvedCount, freshCoach, getProgress, isDrillSolved, markDrillSolved, progressLabel, resetLesson, resetProgress, setFilters, setLanguage, setProgress, setReducedMotion, setReviewMode, setTheme, setUiScale, THEMES, toggleFilterValue } from './lib/state.js';
import { gearGlyph, shuffle } from './lib/ui.js';
import { fetchAlgorithmFeedback, fetchReview, loadContent, loadFeatures, postReview } from './lib/content-loader.js';
import { historyAction, routeKey, routeSnapshot } from './lib/navigation.js';
import { renderReview, bindReview, draftKey } from './views/review.js';
import { renderDrill, bindDrillAnswer, TYPE_LABELS } from './views/drill.js';
import { renderDrillPicker } from './views/drill-picker.js';
import { renderHome } from './views/home.js';
import { renderLibrary } from './views/library.js';
import { renderLesson, bindLesson } from './views/lesson.js';

const root = document.querySelector('#app');
// Populated once content loads (see bootstrap at the bottom of the file).
let builtCards = [];

function currentCard() {
  return cardsById.get(appState.currentCardId);
}

function openWalkthrough(card) {
  resetLesson(card.id);
  appState.screen = 'lesson';
  render();
}

function beginWalkthrough(card) {
  appState.walkthroughMode = 'browse';
  appState.randomWalkthroughHistory = [];
  appState.randomWalkthroughIndex = -1;
  openWalkthrough(card);
}

// Random walkthroughs draw from built problems within the selected difficulties (M11), skipping
// ones already completed unless the shared "include completed" filter is on. Each narrowing falls
// back to the wider pool if it would otherwise leave nothing to pick.
function eligibleBuiltCards() {
  const byDifficulty = builtCards.filter((card) => appState.filters.difficulties.includes(card.difficulty));
  const pool = byDifficulty.length ? byDifficulty : builtCards;
  if (appState.filters.includeCompleted) return pool;
  const unsolved = pool.filter((card) => getProgress(card.id) !== 'Solved');
  return unsolved.length ? unsolved : pool;
}

function randomBuiltCard(excludeId = '') {
  const pool = eligibleBuiltCards();
  const choices = pool.filter((card) => card.id !== excludeId);
  const from = choices.length ? choices : pool;
  return from[Math.floor(Math.random() * from.length)];
}

function startRandomWalkthrough() {
  const card = randomBuiltCard();
  if (!card) return;
  appState.walkthroughMode = 'random';
  appState.randomWalkthroughHistory = [card.id];
  appState.randomWalkthroughIndex = 0;
  openWalkthrough(card);
}

function drillSummary() {
  const items = drillItems();
  return { total: items.length, solved: drillSolvedCount(items.map((drill) => drill.id)) };
}

// Walkthrough progress: how many of the built (reachable) problems the learner has completed.
function walkthroughSummary() {
  return { total: builtCards.length, solved: builtCards.filter((card) => getProgress(card.id) === 'Solved').length };
}

// Drills matching the current filters (drill types + difficulties) — the single source of truth in
// the settings panel's Filters tab. A drill passes only if its type AND difficulty are both selected.
function filteredDrills() {
  const { types, difficulties } = appState.filters;
  return drillItems().filter((drill) => types.includes(drill.exercise?.type || 'fill-blank')
    && difficulties.includes(drill.difficulty));
}

function startDrillQueue(queue) {
  appState.drillQueue = queue;
  appState.drillIndex = 0;
  appState.drillRedo = false;
  appState.screen = 'drill';
  render();
}

// Random reps: shuffle the filtered drills, skipping completed ones unless the shared
// include-completed filter says otherwise (falling back to all if that would leave nothing).
function startDrills() {
  let pool = filteredDrills();
  if (!appState.filters.includeCompleted) {
    const unsolved = pool.filter((drill) => !isDrillSolved(drill.id));
    pool = unsolved.length ? unsolved : pool;
  }
  startDrillQueue(shuffle(pool));
}

// Pick one from the filter screen: start with that drill, then the rest of the filtered set.
function startPickedDrill(id) {
  const set = filteredDrills();
  const picked = set.find((drill) => drill.id === id) || drillItems().find((drill) => drill.id === id);
  if (!picked) return;
  startDrillQueue([picked, ...shuffle(set.filter((drill) => drill.id !== id))]);
}

// The global UI scale is applied with `zoom` on <main> via a CSS variable, so it scales the whole
// interface (text, padding, code blocks) together. Kept off the re-rendered #app subtree so it
// survives view changes without being reset.
function applyScale() {
  document.documentElement.style.setProperty('--ui-scale', String(appState.uiScale));
}

// Apply the colour theme by stamping `data-theme` on <html>. For 'auto' we remove the attribute
// so the `@media (prefers-color-scheme)` rules in styles.css drive it (and follow OS changes live,
// no JS needed); 'light'/'dark' force it regardless of the OS.
function applyTheme() {
  const root = document.documentElement;
  if (appState.theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', appState.theme);
}

// Explicit reduced-motion override → `data-reduced-motion` on <html>, which styles.css uses to
// disable the expand/transition animations (on top of the OS prefers-reduced-motion support).
function applyReducedMotion() {
  const root = document.documentElement;
  if (appState.reducedMotion) root.setAttribute('data-reduced-motion', '');
  else root.removeAttribute('data-reduced-motion');
}
// Keep anything JS-derived in sync if the OS flips while on 'auto' (the visuals already update via
// the CSS media query alone; this listener is a belt-and-braces no-op for theming). Guarded and
// wrapped so a browser without MediaQueryList.addEventListener (older iOS Safari uses addListener)
// can never throw here at module-eval time and stall the whole app.
try {
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  const onSchemeChange = () => { if (appState.theme === 'auto') applyTheme(); };
  if (mq && mq.addEventListener) mq.addEventListener('change', onSchemeChange);
  else if (mq && mq.addListener) mq.addListener(onSchemeChange);
} catch { /* matchMedia unavailable — CSS drives Auto on its own */ }

// The settings panel lives OUTSIDE <main> (appended to <body>), so it is not itself zoomed — the
// control that changes the size shouldn't shrink with it. It's a plain overlay updated in place.
let settingsEl = null;
function renderSettings() {
  if (!settingsEl) { settingsEl = document.createElement('div'); settingsEl.id = 'settings-overlay'; document.body.appendChild(settingsEl); }
  if (!appState.settingsOpen) { settingsEl.innerHTML = ''; return; }
  const tab = appState.settingsTab === 'filters' ? 'filters' : 'settings';
  const pct = Math.round(appState.uiScale * 100);
  const { types, difficulties, includeCompleted } = appState.filters;

  const settingsBody = `
    <span class="settings-label">Code language</span>
    <div class="lang-segment">
      <button data-set-language="JavaScript" class="${appState.language === 'JavaScript' ? 'active' : ''}">JavaScript</button>
      <button data-set-language="Python" class="${appState.language === 'Python' ? 'active' : ''}">Python</button>
    </div>
    <span class="settings-label">Theme</span>
    <div class="lang-segment theme-segment">
      ${THEMES.map((t) => `<button data-set-theme="${t}" class="${appState.theme === t ? 'active' : ''}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
    </div>
    <span class="settings-label">Text size</span>
    <div class="size-stepper">
      <button data-scale="-1" aria-label="Smaller">−</button>
      <span class="size-readout">${pct}%</span>
      <button data-scale="1" aria-label="Larger">+</button>
    </div>
    <button class="size-reset" data-scale-reset>Reset to default</button>
    <span class="settings-label">Motion</span>
    <label class="switch-row"><span>Reduce motion</span>
      <input type="checkbox" data-toggle-reduced-motion ${appState.reducedMotion ? 'checked' : ''}></label>
    <span class="settings-label">Progress</span>
    <button class="reset-progress" data-reset-progress>Reset all progress…</button>${appState.review.token || appState.reviewMode ? `
    <span class="settings-label">Reviewer</span>
    <label class="switch-row"><span>Review mode <small class="switch-note">only awaiting-review problems</small></span>
      <input type="checkbox" data-toggle-review-mode ${appState.reviewMode ? 'checked' : ''}></label>` : ''}`;

  const filtersBody = `
    <span class="settings-label">Random</span>
    <label class="switch-row"><span>Include ones I’ve already completed</span>
      <input type="checkbox" data-toggle-include ${includeCompleted ? 'checked' : ''}></label>
    <span class="settings-label">Drill types</span>
    <div class="chips">
      ${DRILL_TYPES.map((t) => `<button class="chip ${types.includes(t) ? 'on' : ''}" data-toggle-type="${t}" aria-pressed="${types.includes(t)}">${TYPE_LABELS[t]}</button>`).join('')}
    </div>
    <span class="settings-label">Difficulty</span>
    <div class="seg-multi">
      ${DIFFICULTIES.map((d) => `<button class="seg ${difficulties.includes(d) ? 'on' : ''}" data-toggle-difficulty="${d}" aria-pressed="${difficulties.includes(d)}">${d}</button>`).join('')}
    </div>`;

  settingsEl.innerHTML = `
    <div class="settings-backdrop" data-settings-close></div>
    <div class="settings-panel" role="dialog" aria-label="Settings">
      <div class="settings-row"><span class="settings-icon" aria-hidden="true">${gearGlyph()}</span><button class="settings-x" data-settings-close aria-label="Close">×</button></div>
      <div class="settings-tabs" role="tablist">
        <button class="settings-tab ${tab === 'settings' ? 'active' : ''}" data-settings-tab="settings" role="tab" aria-selected="${tab === 'settings'}">Settings</button>
        <button class="settings-tab ${tab === 'filters' ? 'active' : ''}" data-settings-tab="filters" role="tab" aria-selected="${tab === 'filters'}">Filters</button>
      </div>
      ${tab === 'filters' ? filtersBody : settingsBody}
    </div>`;

  const refresh = () => { applyScale(); renderSettings(); };
  settingsEl.querySelectorAll('[data-settings-close]').forEach((b) => b.addEventListener('click', () => { appState.settingsOpen = false; renderSettings(); }));
  settingsEl.querySelectorAll('[data-settings-tab]').forEach((b) => b.addEventListener('click', () => { appState.settingsTab = b.dataset.settingsTab; renderSettings(); }));
  // Language change re-renders the whole view (content is language-specific); render() rebuilds this panel too.
  settingsEl.querySelectorAll('[data-set-language]').forEach((b) => b.addEventListener('click', () => { setLanguage(b.dataset.setLanguage); render(); }));
  settingsEl.querySelectorAll('[data-set-theme]').forEach((b) => b.addEventListener('click', () => { setTheme(b.dataset.setTheme); applyTheme(); renderSettings(); }));
  settingsEl.querySelectorAll('[data-scale]').forEach((b) => b.addEventListener('click', () => { setUiScale(appState.uiScale + Number(b.dataset.scale) * 0.05); refresh(); }));
  settingsEl.querySelector('[data-scale-reset]')?.addEventListener('click', () => { setUiScale(DEFAULT_UI_SCALE); refresh(); });
  settingsEl.querySelector('[data-toggle-reduced-motion]')?.addEventListener('change', (e) => { setReducedMotion(e.target.checked); applyReducedMotion(); });
  settingsEl.querySelector('[data-toggle-review-mode]')?.addEventListener('change', (e) => { setReviewMode(e.target.checked); render(); });
  settingsEl.querySelector('[data-reset-progress]')?.addEventListener('click', () => {
    if (!window.confirm('Reset all progress? This clears every solved problem and drill on this device. Your language, theme, text size, and filters are kept.')) return;
    resetProgress();
    render(); // reflect the cleared tallies/states everywhere
  });
  // Filter controls — the single source of truth. render() updates both the panel and the screen
  // behind it (e.g. the drill picker's live list).
  settingsEl.querySelector('[data-toggle-include]')?.addEventListener('change', (e) => { setFilters({ includeCompleted: e.target.checked }); render(); });
  settingsEl.querySelectorAll('[data-toggle-type]').forEach((b) => b.addEventListener('click', () => { toggleFilterValue('types', b.dataset.toggleType); render(); }));
  settingsEl.querySelectorAll('[data-toggle-difficulty]').forEach((b) => b.addEventListener('click', () => { toggleFilterValue('difficulties', b.dataset.toggleDifficulty); render(); }));
}

function render() {
  applyScale();
  applyTheme();
  applyReducedMotion();
  renderSettings();
  if (appState.screen === 'home') {
    root.innerHTML = renderHome(appState, { drills: drillSummary(), walkthroughs: walkthroughSummary() });
    appState.animateCard = null; // one-shot: consumed by this render so re-renders don't replay it
  }
  if (appState.screen === 'drill-picker') root.innerHTML = renderDrillPicker({ state: appState, drills: drillItems(), isDrillSolved });
  if (appState.screen === 'library') root.innerHTML = renderLibrary({
    state: appState,
    // All ordered cards; the library shows only certified (isBuilt) problems, plus — in owner
    // review mode — the content-complete but not-yet-certified ones.
    problems: orderedCards(),
    progressLabel,
  });
  if (appState.screen === 'drill') renderDrillScreen();
  if (appState.screen === 'lesson') renderLessonScreen();
  if (appState.screen === 'review') renderReviewScreen();
  bindSharedControls();
  syncHistory();
}

// ---- /review (owner approve-reject screen) ----
function renderReviewScreen() {
  root.innerHTML = renderReview({ state: appState });
  bindReview(root, {
    state: appState,
    loadReview,
    previewProblem: (id, stepIndex = 0) => {
      const card = cardsById.get(id);
      if (!card) return;
      beginWalkthrough(card);
      appState.lessonStep = stepIndex;
      render();
    },
  });
  // Fetch on first entry (once a token is present).
  const review = appState.review;
  if (review.token && !review.loaded && !review.loading) loadReview();
}

async function loadReview() {
  const review = appState.review;
  review.loading = true;
  review.error = '';
  render();
  const { ok, status, data } = await fetchReview(review.token);
  review.loading = false;
  if (ok) {
    review.problems = data.problems || [];
    review.loaded = true;
    localStorage.setItem('walkcode-review-token', review.token);
  } else if (status === 401) {
    review.error = 'That token was not accepted. Check your review link and try again.';
    review.loaded = false;
    review.token = '';
    localStorage.removeItem('walkcode-review-token');
  } else if (status === 503 || data.disabled) {
    review.error = 'Review is not configured on the server yet.';
    review.loaded = false;
  } else {
    review.error = data.error || 'Could not load review data.';
  }
  render();
}

async function saveReviewDecision(title, step, status, feedback) {
  const review = appState.review;
  if (review.saving) return;
  review.saving = `${title}::${step}`;
  render();
  const result = await postReview(review.token, title, step, status, feedback);
  review.saving = '';
  if (result.ok) {
    delete review.drafts[draftKey(title, step)];
    await loadReview();
  } else {
    review.error = result.data?.error || 'Could not save your decision.';
    render();
  }
}

// Approve every not-yet-approved stage of a problem in one go (offered on the Review stage when
// nothing was rejected), preserving any feedback already typed for each stage.
async function approveAllReview(title) {
  const review = appState.review;
  const problem = review.problems.find((item) => item.title === title);
  if (!problem || review.saving) return;
  if (problem.steps.some((s) => s.status === 'rejected')) return; // don't bulk-approve a blocked problem
  review.saving = `${title}::all`;
  render();
  let failed = false;
  for (const s of problem.steps) {
    if (s.status === 'approved') continue;
    const feedback = review.drafts[draftKey(title, s.step)] ?? s.feedback ?? '';
    const result = await postReview(review.token, title, s.step, 'approved', feedback);
    if (!result.ok) { failed = true; break; }
  }
  review.saving = '';
  if (failed) review.error = 'Could not approve every stage — some may not have saved.';
  else for (const s of problem.steps) delete review.drafts[draftKey(title, s.step)];
  await loadReview();
}

// ---- Browser history / back-button integration ----
// Keeps window.history in step with appState so Back/Forward move between screens and visited
// problems as a user expects, instead of leaving the site.
let currentRouteKey = null;

function syncHistory() {
  const nextKey = routeKey(appState);
  const action = historyAction(currentRouteKey, nextKey);
  const snapshot = routeSnapshot(appState);
  if (action === 'push') window.history.pushState(snapshot, '');
  else window.history.replaceState(snapshot, '');
  currentRouteKey = nextKey;
}

// Restore a view from a history entry (Back/Forward). Transient per-lesson interaction (coach,
// algorithm builder, code/complexity progress) resets; the drill queue is rebuilt if needed.
function applyRouteSnapshot(snapshot) {
  appState.screen = snapshot.screen || 'home';
  appState.currentCardId = snapshot.currentCardId ?? null;
  appState.lessonStep = snapshot.lessonStep || 0;
  appState.walkthroughMode = snapshot.walkthroughMode || 'browse';
  appState.walkthroughPickerOpen = Boolean(snapshot.walkthroughPickerOpen);
  appState.drillsExpanded = Boolean(snapshot.drillsExpanded);
  appState.walkthroughExpanded = Boolean(snapshot.walkthroughExpanded);
  // Filters persist in localStorage (loaded at startup), so appState.filters is already current;
  // adopt the snapshot's copy only if present, keeping Back/Forward consistent.
  if (snapshot.filters) appState.filters = snapshot.filters;
  appState.randomWalkthroughHistory = snapshot.randomWalkthroughHistory || [];
  appState.randomWalkthroughIndex = snapshot.randomWalkthroughIndex ?? -1;
  if (appState.screen === 'lesson') {
    appState.codeFixIndex = 0;
    appState.complexityStage = 0;
    appState.algorithm = { available: [], answer: [] };
    appState.algorithmCoach = freshCoach();
    appState.stepBuilderFallback = false;
  }
  if (appState.screen === 'drill' && !appState.drillQueue.length) {
    appState.drillQueue = shuffle(filteredDrills());
    appState.drillIndex = 0;
  }
}

window.addEventListener('popstate', (event) => {
  applyRouteSnapshot(event.state || { screen: 'home' });
  // Adopt this entry's key so syncHistory() updates it in place instead of pushing a new one.
  currentRouteKey = routeKey(appState);
  render();
});

function renderDrillScreen() {
  if (!appState.drillQueue.length) {
    root.innerHTML = '<section class="home"><h1>No drills in this filter yet.</h1><p>Choose another difficulty to keep practicing.</p><button data-home>Home</button></section>';
    return;
  }
  if (appState.drillIndex >= appState.drillQueue.length) {
    appState.drillQueue = shuffle(appState.drillQueue);
    appState.drillIndex = 0;
  }
  const drill = appState.drillQueue[appState.drillIndex];
  const card = cards.find((item) => item.title === drill.title) || { id: `drill:${drill.title}`, title: drill.title, topic: drill.topic || 'Code drill' };
  const lesson = lessonFor(card, appState.language);
  // Drill exercises arrive with both language variants already resolved (see assemble.js).
  const exercise = appState.language === 'Python' ? drill.pythonExercise : drill.exercise;
  const queueDone = appState.drillQueue.reduce((n, item) => n + (isDrillSolved(item.id) ? 1 : 0), 0);
  const alreadyDone = isDrillSolved(drill.id) && !appState.drillRedo;
  root.innerHTML = renderDrill({ state: appState, drill, lesson, exercise, solved: isDrillSolved(drill.id), redo: appState.drillRedo, queueDone });
  if (alreadyDone) {
    // Interstitial for a completed drill: let the learner choose to redo it (reveal) or move on.
    root.querySelector('[data-redo-drill]')?.addEventListener('click', () => { appState.drillRedo = true; render(); });
  } else {
    bindDrillAnswer(root, exercise, advanceDrill, () => markDrillSolved(drill.id));
  }
  // Skip advances past the current drill (works on both the drill and the "already done" prompt).
  root.querySelectorAll('[data-skip-drill]').forEach((b) => b.addEventListener('click', advanceDrill));
}

// Move to the next drill in the queue (wraps + reshuffles at the end via renderDrillScreen), and
// clear the redo gate so a completed drill we land on shows its prompt again.
function advanceDrill() {
  appState.drillIndex += 1;
  appState.drillRedo = false;
  render();
}

function renderLessonScreen() {
  const card = currentCard();
  if (!card) { appState.screen = 'library'; render(); return; }
  if (getProgress(card.id) === 'Unseen') setProgress(card.id, 'Seen');
  const lesson = lessonFor(card, appState.language);
  root.innerHTML = renderLesson({
    state: appState,
    card,
    lesson,
    difficulty: difficultyFor(card.title),
    randomNavigation: appState.walkthroughMode === 'random'
      ? { canGoBack: appState.randomWalkthroughIndex > 0 }
      : null,
  });
  bindLesson(root, {
    state: appState,
    card,
    lesson,
    rerender: render,
    saveReviewStage: (step, status, feedback) => saveReviewDecision(card.title, step, status, feedback),
    approveAllStages: () => approveAllReview(card.title),
    finishLesson: () => { setProgress(card.id, 'Solved'); appState.screen = 'library'; render(); },
    requestFeedback: () => submitAlgorithmCoach(lesson),
    resetCoach: () => { appState.algorithmCoach = freshCoach(); render(); },
    useStepBuilder: () => { appState.stepBuilderFallback = true; render(); },
    useCoach: () => { appState.stepBuilderFallback = false; appState.algorithmCoach.error = ''; appState.algorithmCoach.unavailable = false; render(); },
    finishCoach: () => {
      const coach = appState.algorithmCoach;
      coach.done = true;
      coach.summary = 'You assembled the algorithm — review your steps above.';
      render();
    },
  });
  root.querySelectorAll('[data-lesson-step]').forEach((button) => button.addEventListener('click', () => {
    appState.lessonStep = Number(button.dataset.lessonStep);
    render();
  }));
  root.querySelector('[data-previous-problem]').addEventListener('click', () => navigateProblem(-1));
  root.querySelector('[data-next-problem]').addEventListener('click', () => navigateProblem(1));
}

// M9: one turn of the guided coach. Sends the learner's proposed step (plus the growing
// solution and problem reference) to the server proxy; on accept, appends the returned step and
// advances the question; on revise, keeps the question and shows a non-spoiling nudge.
async function submitAlgorithmCoach(lesson) {
  const coach = appState.algorithmCoach;
  if (coach.loading || coach.done) return;
  const learnerInput = (coach.input || '').trim();
  if (learnerInput.length < 2) { coach.error = 'Type your idea first.'; coach.feedback = ''; render(); return; }
  coach.loading = true;
  coach.error = '';
  render();
  const { ok, status, data } = await fetchAlgorithmFeedback({
    title: lesson.title,
    brief: lesson.brief || lesson.explanation || '',
    concepts: lesson.concepts || [],
    algorithm: lesson.algorithm || [],
    code: lesson.code || '',
    acceptedSteps: coach.steps,
    currentPrompt: coach.prompt,
    learnerInput,
  });
  coach.loading = false;
  if (ok) {
    coach.decision = data.decision;
    coach.error = '';
    coach.unavailable = false;
    if (data.decision === 'accept') {
      if (data.acceptedStep) coach.steps = [...coach.steps, data.acceptedStep];
      coach.input = '';
      coach.feedback = data.feedback || '';
      if (data.done) { coach.done = true; coach.summary = data.summary || ''; }
      else if (data.nextPrompt) coach.prompt = data.nextPrompt;
    } else {
      // Revise: keep the SAME question; show the coach's nudge as a hint (a statement, per the
      // prompt) so it guides without replacing the question. Keep the learner's text to refine.
      coach.feedback = String(data.feedback || '').trim() || 'Not quite — try a different piece.';
    }
  } else if (status === 503 || data.disabled) {
    // No key configured → the feature turns off and the drag-and-drop builder renders directly.
    appState.features = { ...appState.features, algorithmFeedback: false };
    coach.error = '';
    coach.unavailable = false;
  } else {
    // Transient (rate limit / upstream / offline): keep the coach but offer the builder fallback.
    coach.error = data.error || 'The coach is unavailable right now.';
    coach.unavailable = true;
  }
  render();
}

function navigateProblem(direction) {
  if (appState.walkthroughMode === 'random') {
    navigateRandomWalkthrough(direction);
    return;
  }
  const index = cards.findIndex((card) => card.id === appState.currentCardId);
  openWalkthrough(cards[(index + direction + cards.length) % cards.length]);
}

function navigateRandomWalkthrough(direction) {
  const { randomWalkthroughHistory: history, randomWalkthroughIndex: index } = appState;
  if (direction < 0 && index > 0) {
    appState.randomWalkthroughIndex -= 1;
    openWalkthrough(cardsById.get(history[appState.randomWalkthroughIndex]));
    return;
  }
  if (direction < 0) return;
  if (index < history.length - 1) {
    appState.randomWalkthroughIndex += 1;
    openWalkthrough(cardsById.get(history[appState.randomWalkthroughIndex]));
    return;
  }
  const card = randomBuiltCard(appState.currentCardId);
  if (!card) return;
  appState.randomWalkthroughHistory = [...history, card.id];
  appState.randomWalkthroughIndex += 1;
  openWalkthrough(card);
}

// Apply a mode-card expand/collapse. Because the app re-renders by replacing innerHTML (which has
// no exit animation), a panel that's going from open → closed is first animated out in place, then
// the state is applied and the view re-rendered (the newly-opened panel gets its mount animation).
// At most one panel closes per toggle. Falls back to an immediate apply if there's nothing to
// close, the user prefers reduced motion, or the animation never fires.
function toggleModeCard(next) {
  const apply = () => {
    appState.drillsExpanded = Boolean(next.drillsExpanded);
    appState.walkthroughExpanded = Boolean(next.walkthroughExpanded);
    // Mark the card that just opened (if any) so only a fresh open plays the expand animation.
    appState.animateCard = next.drillsExpanded ? 'drills' : (next.walkthroughExpanded ? 'walkthroughs' : null);
    render();
  };
  let closingKey = null;
  if (appState.drillsExpanded && !next.drillsExpanded) closingKey = 'drills';
  else if (appState.walkthroughExpanded && !next.walkthroughExpanded) closingKey = 'walkthroughs';
  const panel = closingKey ? root.querySelector(`.mode-card-group[data-card="${closingKey}"] .mode-expand`) : null;
  const reduceMotion = appState.reducedMotion
    || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!panel || reduceMotion) { apply(); return; }
  let done = false;
  const finish = () => { if (done) return; done = true; apply(); };
  panel.classList.add('collapsing');
  panel.addEventListener('animationend', finish, { once: true });
  setTimeout(finish, 260); // safety net if animationend doesn't arrive
}

function bindSharedControls() {
  root.querySelectorAll('[data-home]').forEach((button) => button.addEventListener('click', () => {
    appState.screen = 'home';
    appState.walkthroughPickerOpen = false;
    render();
  }));
  root.querySelectorAll('[data-settings-toggle]').forEach((button) => button.addEventListener('click', () => {
    appState.settingsOpen = !appState.settingsOpen;
    renderSettings();
  }));
  // Home mode cards expand in place; opening one collapses the other.
  root.querySelectorAll('[data-toggle-drills]').forEach((button) => button.addEventListener('click', () => {
    toggleModeCard({ drillsExpanded: !appState.drillsExpanded, walkthroughExpanded: false });
  }));
  root.querySelectorAll('[data-toggle-walkthroughs]').forEach((button) => button.addEventListener('click', () => {
    toggleModeCard({ walkthroughExpanded: !appState.walkthroughExpanded, drillsExpanded: false });
  }));
  root.querySelectorAll('[data-drills-random]').forEach((button) => button.addEventListener('click', () => startDrills()));
  root.querySelectorAll('[data-drills-pick]').forEach((button) => button.addEventListener('click', () => {
    appState.screen = 'drill-picker';
    render();
  }));
  // "Adjust in Filters" links (home chooser + drill picker) open the settings panel on its Filters
  // tab — the single place those controls now live.
  root.querySelectorAll('[data-open-filters]').forEach((button) => button.addEventListener('click', () => {
    appState.settingsOpen = true;
    appState.settingsTab = 'filters';
    renderSettings();
  }));
  root.querySelectorAll('[data-drill-sort]').forEach((select) => select.addEventListener('change', () => { appState.drillSort = select.value; render(); }));
  root.querySelectorAll('[data-shuffle-filtered]').forEach((button) => button.addEventListener('click', () => startDrillQueue(shuffle(filteredDrills()))));
  root.querySelectorAll('[data-drill-id]').forEach((button) => button.addEventListener('click', () => startPickedDrill(button.dataset.drillId)));
  root.querySelectorAll('[data-open-library]').forEach((button) => button.addEventListener('click', () => {
    appState.screen = 'library';
    appState.walkthroughPickerOpen = false;
    render();
  }));
  root.querySelectorAll('[data-browse-walkthrough]').forEach((button) => button.addEventListener('click', () => {
    appState.walkthroughPickerOpen = true;
    render();
  }));
  root.querySelectorAll('[data-random-walkthrough]').forEach((button) => button.addEventListener('click', () => {
    startRandomWalkthrough();
  }));
  root.querySelectorAll('[data-card-id]').forEach((button) => button.addEventListener('click', () => beginWalkthrough(cardsById.get(button.dataset.cardId))));
}

// Owner review toggle: ?review (or ?review=1) turns it on and persists; ?review=0 turns it off.
const reviewParam = new URLSearchParams(window.location.search).get('review');
if (reviewParam !== null) {
  const on = reviewParam !== '0' && reviewParam !== 'false';
  if (on) localStorage.setItem('walkcode-review', '1'); else localStorage.removeItem('walkcode-review');
  appState.reviewMode = on;
}

// /review — the owner approve-reject screen. The token rides in the URL fragment (#<token>),
// which the browser never sends to the server; read it, persist it, then scrub it from the URL.
if (window.location.pathname === '/review') {
  appState.screen = 'review';
  const tokenFromHash = window.location.hash.slice(1);
  if (tokenFromHash) {
    appState.review.token = tokenFromHash;
    localStorage.setItem('walkcode-review-token', tokenFromHash);
    try { window.history.replaceState(null, '', '/review'); } catch { /* history unavailable */ }
  }
}

applyScale(); // scale even the loading screen so there's no first-paint size jump
applyTheme(); // theme the loading screen too, so there's no first-paint colour flash
applyReducedMotion();
root.innerHTML = '<section class="home"><h1>Loading…</h1></section>';
loadContent().then((bundle) => {
  initContent(bundle);
  builtCards = cards.filter((card) => isBuilt(card.title));
  // Restore the view from the browser's history entry so a page refresh keeps the learner on the
  // same screen/problem (and step) instead of resetting to home. A missing card falls back to the
  // library via renderLessonScreen.
  const saved = window.history.state;
  if (window.location.pathname !== '/review' && saved && ['home', 'library', 'drill', 'drill-picker', 'lesson', 'review'].includes(saved.screen)) {
    applyRouteSnapshot(saved);
    currentRouteKey = routeKey(appState);
  }
  render();
  // Best-effort capability probe — resolves after first paint, then re-renders so optional
  // server features (e.g. AI feedback) appear without ever blocking initial load.
  loadFeatures().then((features) => { appState.features = features; render(); });
  // If a review token is already loaded (owner), fetch the review list up front so the inline
  // per-stage Approve/Reject shows while browsing ANY complete problem — not only from /review.
  if (appState.review.token && !appState.review.loaded) loadReview();
}).catch((error) => {
  console.error('Walkcode failed to load content', error);
  root.innerHTML = '<section class="home"><h1>Could not load Walkcode.</h1><p>Please refresh to try again.</p></section>';
});
