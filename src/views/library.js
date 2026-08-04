import { difficultyTag, escapeText, filtersLink, topBar } from '../lib/ui.js';

const DIFFICULTY_BANDS = ['Easy', 'Medium', 'Hard'];

// Compact, right-floated review status for a library row (fuller wording lives on the /review
// screen). `· live` marks a problem that's already published; a rejected stage shows "blocked".
function reviewStatusPill(problem) {
  const total = problem.steps.length;
  const blocked = problem.steps.some((s) => s.status === 'rejected');
  // A revision landed after the last decision — nudge a re-review (esp. a blocked problem you fixed).
  const newVersion = problem.hasNewVersion ? '<span class="pill pill-newversion">🔄 new</span>' : '';
  if (blocked) return `<span class="pill pill-warn">blocked</span>${newVersion}`;
  if (problem.approvedCount === total) return `<span class="pill pill-live">✓ reviewed</span>${newVersion}`;
  return `<span class="pill ${problem.isLive ? 'pill-live' : ''}">${problem.approvedCount}/${total}${problem.isLive ? ' · live' : ''}</span>${newVersion}`;
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
  const reviewMode = Boolean(state.reviewMode);
  const row = (card) => problemRow(card, progressLabel, isReviewer ? reviewMap.get(card.title) : null);

  // The Filters tab's difficulties also narrow the walkthrough library (M11). A strict subset shows
  // a summary + a link to widen it; selecting none shows an empty-state.
  const selectedDifficulties = state.filters?.difficulties || DIFFICULTY_BANDS;
  const difficultyFilterActive = selectedDifficulties.length < DIFFICULTY_BANDS.length;
  const filterNote = difficultyFilterActive
    ? `<p class="picker-filter-summary">Difficulty: ${DIFFICULTY_BANDS.filter((l) => selectedDifficulties.includes(l)).join(', ') || 'none'} · ${filtersLink('Adjust')}</p>`
    : '';

  // Review mode (the reviewer-only Settings toggle): a triage view of ONLY problems still awaiting
  // review — content-complete but not yet certified. Fully reviewed (certified/Built) problems are
  // deliberately hidden so the owner can focus on what's left.
  if (reviewMode) {
    const pending = problems.filter((card) => card.isComplete && !card.isBuilt && selectedDifficulties.includes(card.difficulty));
    const list = pending.length
      ? `<div class="problem-list">${pending.map(row).join('')}</div>`
      : '<p class="brief">Nothing awaiting review — every complete problem is certified.</p>';
    return `<p class="brief"><b>Review mode is on.</b> Showing only problems awaiting review; fully reviewed problems are hidden (turn it off in Settings).</p>${filterNote}${list}`;
  }

  // Normal browse: only certified (Built) problems, one easier→harder progression in difficulty bands.
  const built = problems.filter((card) => card.isBuilt && selectedDifficulties.includes(card.difficulty));
  const bands = DIFFICULTY_BANDS
    .filter((level) => selectedDifficulties.includes(level))
    .map((level) => [level, built.filter((card) => card.difficulty === level)])
    .filter(([, cards]) => cards.length);
  const bandsHtml = bands.length
    ? `<div class="problem-list">${bands.map(([level, cards]) => `
    <div class="band">
      <div class="band-head">${level}<small>${cards.length}</small></div>
      ${cards.map(row).join('')}
    </div>`).join('')}</div>`
    : '<p class="brief">No problems match your difficulty filter — widen it in Filters to see more.</p>';

  const brief = isReviewer
    ? '<b>Reviewing as owner.</b> Each row shows its review status. Turn on <b>Review mode</b> in Settings to focus on problems still awaiting review.'
    : 'Every problem is a complete five-step walkthrough, ordered from easier to harder.';
  return `<p class="brief">${brief}</p>${filterNote}${bandsHtml}`;
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
