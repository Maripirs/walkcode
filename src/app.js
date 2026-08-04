import { cards, cardsById, difficultyFor, drillItems, initContent, isBuilt, lessonFor, orderedCards } from './data/model.js';
import { appState, drillSolvedCount, freshCoach, getProgress, isDrillSolved, markDrillSolved, progressLabel, resetLesson, setLanguage, setProgress } from './lib/state.js';
import { shuffle } from './lib/ui.js';
import { fetchAlgorithmFeedback, fetchReview, loadContent, loadFeatures, postReview } from './lib/content-loader.js';
import { historyAction, routeKey, routeSnapshot } from './lib/navigation.js';
import { renderReview, bindReview, draftKey } from './views/review.js';
import { renderDrill, bindDrillAnswer } from './views/drill.js';
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

// Random walkthroughs draw from built problems, skipping ones already completed unless the shared
// "include completed" toggle is on (falling back to all if every problem is done).
function eligibleBuiltCards() {
  if (appState.includeCompleted) return builtCards;
  const unsolved = builtCards.filter((card) => getProgress(card.id) !== 'Solved');
  return unsolved.length ? unsolved : builtCards;
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

// Drills matching the pick/filter screen's current type + difficulty selection.
function filteredDrills() {
  const { difficulty, type } = appState.drillFilter;
  return drillItems().filter((drill) => (difficulty === 'All' || drill.difficulty === difficulty)
    && (type === 'All' || (drill.exercise?.type || 'fill-blank') === type));
}

function startDrillQueue(queue) {
  appState.drillQueue = queue;
  appState.drillIndex = 0;
  appState.screen = 'drill';
  render();
}

// Random reps: shuffle the (difficulty-filtered) drills, skipping completed ones unless the shared
// toggle says otherwise (falling back to all if that would leave nothing).
function startDrills(difficulty = appState.drillDifficulty) {
  appState.drillDifficulty = difficulty;
  let pool = drillItems().filter((item) => difficulty === 'All' || item.difficulty === difficulty);
  if (!appState.includeCompleted) {
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

function render() {
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
  if (snapshot.drillDifficulty) appState.drillDifficulty = snapshot.drillDifficulty;
  appState.drillsExpanded = Boolean(snapshot.drillsExpanded);
  appState.walkthroughExpanded = Boolean(snapshot.walkthroughExpanded);
  appState.includeCompleted = Boolean(snapshot.includeCompleted);
  if (snapshot.drillFilter) appState.drillFilter = snapshot.drillFilter;
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
    appState.drillQueue = shuffle(drillItems().filter((item) => appState.drillDifficulty === 'All' || item.difficulty === appState.drillDifficulty));
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
  root.innerHTML = renderDrill({ state: appState, drill, lesson, exercise, solved: isDrillSolved(drill.id) });
  bindDrillAnswer(
    root,
    exercise,
    () => { appState.drillIndex += 1; render(); },
    () => markDrillSolved(drill.id),
  );
  root.querySelector('[data-drill-difficulty]').addEventListener('change', (event) => startDrills(event.target.value));
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
    finishLesson: () => { setProgress(card.id, 'Solved'); render(); },
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
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  root.querySelectorAll('[data-language]').forEach((select) => select.addEventListener('change', () => {
    setLanguage(select.value);
    render();
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
  // Shared random toggle (drills + walkthroughs). Persists on the state; re-render to reflect it.
  root.querySelectorAll('[data-include-completed]').forEach((box) => box.addEventListener('change', () => {
    appState.includeCompleted = box.checked;
    render();
  }));
  // Pick/filter screen controls.
  root.querySelectorAll('[data-filter-type]').forEach((select) => select.addEventListener('change', () => {
    appState.drillFilter = { ...appState.drillFilter, type: select.value };
    render();
  }));
  root.querySelectorAll('[data-filter-difficulty]').forEach((select) => select.addEventListener('change', () => {
    appState.drillFilter = { ...appState.drillFilter, difficulty: select.value };
    render();
  }));
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
}).catch((error) => {
  console.error('Walkcode failed to load content', error);
  root.innerHTML = '<section class="home"><h1>Could not load Walkcode.</h1><p>Please refresh to try again.</p></section>';
});
