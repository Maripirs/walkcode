import { difficultyTag, escapeText, topBar } from '../lib/ui.js';
import { DIFFICULTIES as DIFFICULTY_BANDS } from '../lib/state.js';

// A colored progress pill, matching the library's (green ✓ Done, amber In progress, muted else).
function progressPill(label) {
  if (label === 'Done') return '<span class="pill pill-done">✓ Done</span>';
  if (label === 'In progress') return '<span class="pill pill-progress">In progress</span>';
  return `<span class="pill">${escapeText(label)}</span>`;
}

function problemRow(card, n, progressLabel) {
  return `<button class="problem" data-collection-card-id="${card.id}">
    <span class="collection-num">${n}</span>${escapeText(card.title)}${difficultyTag(card.difficulty)}${progressPill(progressLabel(card.id))}
  </button>`;
}

// One interview track: an intro, a Start/Continue action that jumps to the first unfinished
// problem, and the ordered problem list split into difficulty bands (easier→harder). `cards` is the
// track's built cards already sorted by difficulty (see model.cardsForTitles); tapping a row opens
// that walkthrough in "collection" mode so the lesson footer steps through the track in order.
export function renderCollection({ state, collection, cards, progressLabel }) {
  const total = cards.length;
  const solved = cards.filter((card) => progressLabel(card.id) === 'Done').length;
  const nextCard = cards.find((card) => progressLabel(card.id) !== 'Done');
  const startLabel = solved === 0 ? 'Start track' : (nextCard ? 'Continue' : 'Review from the top');

  // 1-based position across the whole track, so the numbering is continuous through the bands.
  const numberOf = new Map(cards.map((card, i) => [card.id, i + 1]));
  const bands = DIFFICULTY_BANDS
    .map((level) => [level, cards.filter((card) => card.difficulty === level)])
    .filter(([, group]) => group.length);
  const list = bands.length
    ? `<div class="problem-list">${bands.map(([level, group]) => `
      <div class="band">
        <div class="band-head">${level}<small>${group.length}</small></div>
        ${group.map((card) => problemRow(card, numberOf.get(card.id), progressLabel)).join('')}
      </div>`).join('')}</div>`
    : '<p class="brief">This track is empty right now.</p>';

  const startButton = total
    ? `<button class="mode-sub collection-start" data-collection-start="${escapeText(collection.id)}">
        <b>${startLabel} →</b><span>${nextCard ? escapeText(nextCard.title) : 'Every problem here is done — run it again.'}</span>
      </button>`
    : '';

  return `${topBar({ title: escapeText(collection.name), language: state.language })}
    <section>
      <h1 class="mode-heading">${escapeText(collection.name)}</h1>
      <p class="brief">${escapeText(collection.description)}</p>
      <p class="brief collection-meta">${total} problems · ${solved}/${total} done</p>
      ${startButton}
      ${list}
    </section>`;
}
