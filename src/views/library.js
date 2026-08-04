import { difficultyTag, escapeText, includeCompletedToggle, topBar } from '../lib/ui.js';

const DIFFICULTY_BANDS = ['Easy', 'Medium', 'Hard'];

function problemRow(card, progressLabel) {
  return `<button class="problem" data-card-id="${card.id}">
    ${escapeText(card.title)}${difficultyTag(card.difficulty)}<span class="pill">${progressLabel(card.id)}</span>
  </button>`;
}

// Browse list: one flat progression from easier to harder, split into three difficulty bands.
// We intentionally do NOT group by topic — the category names the pattern the Understand step
// asks the learner to discover. Only certified (isBuilt) problems appear; in owner review mode a
// "Pending review" section adds content-complete but not-yet-certified problems so they can be run.
function browseList(state, problems, progressLabel) {
  const built = problems.filter((card) => card.isBuilt);
  const bands = DIFFICULTY_BANDS
    .map((level) => [level, built.filter((card) => card.difficulty === level)])
    .filter(([, cards]) => cards.length);
  const bandsHtml = `<div class="problem-list">${bands.map(([level, cards]) => `
    <div class="band">
      <div class="band-head">${level}<small>${cards.length}</small></div>
      ${cards.map((card) => problemRow(card, progressLabel)).join('')}
    </div>`).join('')}</div>`;

  let reviewHtml = '';
  if (state.reviewMode) {
    const pending = problems.filter((card) => card.isComplete && !card.isBuilt);
    reviewHtml = `<div class="review-section">
      <div class="band-head review">Pending review<small>${pending.length}</small></div>
      ${pending.length
        ? `<div class="problem-list">${pending.map((card) => problemRow(card, progressLabel)).join('')}</div>`
        : '<p class="brief">Nothing awaiting review — every complete problem is certified.</p>'}
    </div>`;
  }

  const brief = `Every problem is a complete five-step walkthrough, ordered from easier to harder.${state.reviewMode ? ' <b>Review mode is on</b> — pending problems appear below.' : ''}`;
  return `<p class="brief">${brief}</p>${bandsHtml}${reviewHtml}`;
}

export function renderLibrary({ state, problems, progressLabel }) {
  const list = state.walkthroughPickerOpen
    ? browseList(state, problems, progressLabel)
    : '<p class="brief">Choose one of the two options above to begin.</p>';

  return `${topBar({ title: 'Full walkthroughs', language: state.language })}
    <section>
      <h1 class="mode-heading">How do you want to start?</h1>
      <div class="walkthrough-start">
        <button class="walkthrough-option ${state.walkthroughPickerOpen ? 'selected' : ''}" data-browse-walkthrough>
          <b>Choose a problem</b><span>Browse every problem, easier to harder.</span>
        </button>
        <button class="walkthrough-option" data-random-walkthrough>
          <b>Random walkthrough</b><span>Start a finished five-step problem chosen for you.</span>
        </button>
      </div>
      ${includeCompletedToggle(state.includeCompleted)}
      ${list}
    </section>`;
}
