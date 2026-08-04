import { difficultyTag, escapeText, topBar } from '../lib/ui.js';

// Draft feedback is keyed per (title, step) so edits in one stage never bleed into another. Used
// by the inline review panel in the lesson view (where the actual per-stage reviewing happens).
export function draftKey(title, step) {
  return `${title}::${step}`;
}

// A problem publishes only once all five stages are approved; a rejected stage blocks it. Some
// problems are already live via the `certifiedTitles` code allowlist without having been reviewed —
// `isLive` marks those so they read as "live · not yet reviewed" rather than plain pending.
export function reviewBadge(problem) {
  const total = problem.steps.length;
  const blocked = problem.steps.some((s) => s.status === 'rejected');
  if (blocked) return `<span class="rev-badge rejected">blocked · ${problem.approvedCount}/${total}</span>`;
  if (problem.approvedCount === total) return '<span class="rev-badge live">✓ all approved — live</span>';
  if (problem.isLive) return `<span class="rev-badge live">live · not yet reviewed (${problem.approvedCount}/${total})</span>`;
  return `<span class="rev-badge pending">${problem.approvedCount}/${total} approved</span>`;
}

function problemCard(problem) {
  return `<article class="review-card" data-review-item="${escapeText(problem.title)}">
    <div class="review-head"><b>${escapeText(problem.title)}</b>${difficultyTag(problem.difficulty)}${reviewBadge(problem)}</div>
    <button class="review-preview" data-review-preview="${escapeText(problem.id)}">▶ Review it step by step</button>
  </article>`;
}

function tokenForm(message) {
  return `<section class="review-auth">
    <p class="brief">${message ? escapeText(message) : 'Enter your review token to load pending builds.'}</p>
    <input type="password" data-review-token-input placeholder="Review token" autocomplete="off" spellcheck="false" />
    <button class="primary" data-review-token-submit>Load reviews</button>
  </section>`;
}

export function renderReview({ state }) {
  const review = state.review;
  const errorBanner = review.error && review.loaded ? `<p class="answer-feedback bad">${escapeText(review.error)}</p>` : '';
  let body;
  if (!review.token || (review.error && !review.loaded)) {
    body = tokenForm(review.error);
  } else if (review.loading && !review.loaded) {
    body = '<p class="brief">Loading pending builds…</p>';
  } else if (!review.problems.length) {
    body = `${errorBanner}<p class="brief">Nothing pending — every complete problem is certified.</p>`;
  } else {
    body = `${errorBanner}<p class="brief">${review.problems.length} complete problem${review.problems.length > 1 ? 's' : ''} to review. Ones marked <b>live · not yet reviewed</b> are already published via the code allowlist but haven’t been walked through — reviewing them is how you actually vet them (rejecting a stage takes a live problem back down). Open one to walk through it: <b>each stage has its own feedback box and Approve/Reject</b>, and a problem is approved-live once <b>all five stages</b> are approved.</p>
      <div class="review-list">${review.problems.map((problem) => problemCard(problem)).join('')}</div>`;
  }
  return `${topBar({ title: 'Review builds', language: state.language })}
    <section class="review-screen"><h1 class="mode-heading">Review pending builds</h1>${body}</section>`;
}

export function bindReview(root, { state, loadReview, previewProblem }) {
  root.querySelector('[data-review-token-submit]')?.addEventListener('click', () => {
    const token = (root.querySelector('[data-review-token-input]')?.value || '').trim();
    if (!token) return;
    state.review.token = token;
    state.review.error = '';
    loadReview?.();
  });
  root.querySelectorAll('[data-review-preview]').forEach((button) => button.addEventListener('click', () => {
    previewProblem?.(button.dataset.reviewPreview, 0);
  }));
}
