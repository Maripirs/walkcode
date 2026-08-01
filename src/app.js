import { cards, cardsById, difficultyFor, drillItems, groupedCards, isBuilt, lessonFor, localizedExercise } from './data/model.js';
import { appState, getProgress, resetLesson, setLanguage, setProgress } from './lib/state.js';
import { shuffle } from './lib/ui.js';
import { renderDrill, bindDrillAnswer } from './views/drill.js';
import { renderHome } from './views/home.js';
import { renderLibrary } from './views/library.js';
import { renderLesson, bindLesson } from './views/lesson.js';

const root = document.querySelector('#app');
const builtCards = cards.filter((card) => isBuilt(card.title));

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

function randomBuiltCard(excludeId = '') {
  const choices = builtCards.filter((card) => card.id !== excludeId);
  const pool = choices.length ? choices : builtCards;
  return pool[Math.floor(Math.random() * pool.length)];
}

function startRandomWalkthrough() {
  const card = randomBuiltCard();
  if (!card) return;
  appState.walkthroughMode = 'random';
  appState.randomWalkthroughHistory = [card.id];
  appState.randomWalkthroughIndex = 0;
  openWalkthrough(card);
}

function startDrills(difficulty = appState.drillDifficulty) {
  appState.drillDifficulty = difficulty;
  appState.drillQueue = shuffle(drillItems().filter((item) => difficulty === 'All' || item.difficulty === difficulty));
  appState.drillIndex = 0;
  appState.screen = 'drill';
  render();
}

function render() {
  if (appState.screen === 'home') root.innerHTML = renderHome(appState);
  if (appState.screen === 'library') root.innerHTML = renderLibrary({
    state: appState,
    grouped: groupedCards(),
    getProgress,
    difficultyFor,
    isBuilt,
  });
  if (appState.screen === 'drill') renderDrillScreen();
  if (appState.screen === 'lesson') renderLessonScreen();
  bindSharedControls();
}

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
  const exercise = drill.pythonExercise && appState.language === 'Python'
    ? drill.pythonExercise
    : localizedExercise(drill.title, drill.index, drill.exercise, appState.language);
  root.innerHTML = renderDrill({ state: appState, drill, lesson, exercise });
  bindDrillAnswer(root, exercise);
  root.querySelector('[data-next-drill]').addEventListener('click', () => { appState.drillIndex += 1; render(); });
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
    lesson,
    rerender: render,
    finishLesson: () => { setProgress(card.id, 'Solved'); render(); },
  });
  root.querySelectorAll('[data-lesson-step]').forEach((button) => button.addEventListener('click', () => {
    appState.lessonStep = Number(button.dataset.lessonStep);
    render();
  }));
  root.querySelector('[data-previous-problem]').addEventListener('click', () => navigateProblem(-1));
  root.querySelector('[data-next-problem]').addEventListener('click', () => navigateProblem(1));
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
  root.querySelectorAll('[data-start-drills]').forEach((button) => button.addEventListener('click', () => startDrills()));
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

render();
