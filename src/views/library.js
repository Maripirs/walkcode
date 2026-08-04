import { difficultyTag, escapeText, topBar } from '../lib/ui.js';

const DIFFICULTY_BANDS = ['Easy', 'Medium', 'Hard'];

// Compact, right-floated review status for a library row (fuller wording lives on the /review
// screen). `· live` marks a problem that's already published; a rejected stage shows "blocked".
function reviewStatusPill(problem) {
  const total = problem.steps.length;
  const blocked = problem.steps.some((s) => s.status === 'rejected');
  if (blocked) return '<span class="pill pill-warn">blocked</span>';
  if (problem.approvedCount === total) return '<span class="pill pill-live">✓ reviewed</span>';
  return `<span class="pill ${problem.isLive ? 'pill-live' : ''}">${problem.approvedCount}/${total}${problem.isLive ? ' · live' : ''}</span>`;
}

// A colored progress pill: green ✓ Done, amber In progress, muted Not started.
function progressPill(label) {
  if (label === 'Done') return '<span class="pill pill-done">✓ Done</span>';
  if (label === 'In progress') return '<span class="pill pill-progress">In progress</span>';
  return `<span class="pill">${escapeText(label)}</span>`;
}

// A row shows the learner's progress by default; for the owner-reviewer (a review token is loaded)
// it shows that problem's review status instead, so the library doubles as a review overview.
function problemRow(card, progressLabel, reviewProblem) {
  const status = reviewProblem ? reviewStatusPill(reviewProblem) : progressPill(progressLabel(card.id));
  return `<button class="problem" data-card-id="${card.id}">
    ${escapeText(card.title)}${difficultyTag(card.difficulty)}${status}
  </button>`;
}

// Browse list: one flat progression from easier to harder, split into three difficulty bands.
// We intentionally do NOT group by topic — the category names the pattern the Understand step
// asks the learner to discover. Only certified (isBuilt) problems appear; a "Pending review"
// section adds content-complete but not-yet-certified problems when either ?review preview is on
// or the owner has a review token loaded, so they can be run and reviewed.
function browseList(state, problems, progressLabel) {
  const reviewMap = new Map((state.review?.problems || []).map((p) => [p.title, p]));
  const isReviewer = Boolean(state.review?.token) && reviewMap.size > 0;
  const showPending = state.reviewMode || isReviewer;
  const row = (card) => problemRow(card, progressLabel, isReviewer ? reviewMap.get(card.title) : null);

  const built = problems.filter((card) => card.isBuilt);
  const bands = DIFFICULTY_BANDS
    .map((level) => [level, built.filter((card) => card.difficulty === level)])
    .filter(([, cards]) => cards.length);
  const bandsHtml = `<div class="problem-list">${bands.map(([level, cards]) => `
    <div class="band">
      <div class="band-head">${level}<small>${cards.length}</small></div>
      ${cards.map(row).join('')}
    </div>`).join('')}</div>`;

  let reviewHtml = '';
  if (showPending) {
    const pending = problems.filter((card) => card.isComplete && !card.isBuilt);
    reviewHtml = `<div class="review-section">
      <div class="band-head review">Pending review<small>${pending.length}</small></div>
      ${pending.length
        ? `<div class="problem-list">${pending.map(row).join('')}</div>`
        : '<p class="brief">Nothing awaiting review — every complete problem is certified.</p>'}
    </div>`;
  }

  const brief = isReviewer
    ? '<b>Reviewing as owner.</b> Each row shows its review status — open a problem to walk its five stages and Approve/Reject each. “Live · not yet reviewed” problems are already published (via the code allowlist); rejecting a stage takes one back down.'
    : `Every problem is a complete five-step walkthrough, ordered from easier to harder.${state.reviewMode ? ' <b>Review mode is on</b> — pending problems appear below.' : ''}`;
  return `<p class="brief">${brief}</p>${bandsHtml}${reviewHtml}`;
}

// The library is now purely the browse list — the choose-vs-random decision moved to the home
// card's in-place dropdown, so reaching here already means "pick a problem".
export function renderLibrary({ state, problems, progressLabel }) {
  return `${topBar({ title: 'Full walkthroughs', language: state.language })}
    <section>
      <h1 class="mode-heading">Choose a problem</h1>
      ${browseList(state, problems, progressLabel)}
    </section>`;
}
