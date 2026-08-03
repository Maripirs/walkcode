import { difficultyTag, escapeText, topBar } from '../lib/ui.js';

const STATUS_BADGE = {
  approved: '<span class="rev-badge live">✓ Approved — live</span>',
  rejected: '<span class="rev-badge rejected">✕ Rejected</span>',
  pending: '<span class="rev-badge pending">Pending</span>',
};

function tokenForm(message) {
  return `<section class="review-auth">
    <p class="brief">${message ? escapeText(message) : 'Enter your review token to load pending builds.'}</p>
    <input type="password" data-review-token-input placeholder="Review token" autocomplete="off" spellcheck="false" />
    <button class="primary" data-review-token-submit>Load reviews</button>
  </section>`;
}

function problemCard(problem, draft) {
  const feedback = draft !== undefined ? draft : problem.feedback;
  return `<article class="review-card" data-review-item="${escapeText(problem.title)}">
    <div class="review-head"><b>${escapeText(problem.title)}</b>${difficultyTag(problem.difficulty)}${STATUS_BADGE[problem.status] || STATUS_BADGE.pending}</div>
    <button class="review-preview" data-review-preview="${escapeText(problem.id)}">▶ Preview &amp; run it</button>
    <textarea class="review-feedback" data-review-feedback="${escapeText(problem.title)}" rows="2" placeholder="Feedback — what to fix, or why it's good…">${escapeText(feedback || '')}</textarea>
    <div class="review-actions">
      <button class="review-approve" data-review-action="approved">Approve → publish</button>
      <button class="review-reject" data-review-action="rejected">Reject</button>
      <button class="review-reset" data-review-action="pending">Reset</button>
    </div>
  </article>`;
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
    body = `${errorBanner}<p class="brief">${review.problems.length} build${review.problems.length > 1 ? 's' : ''} pending. Preview each, leave feedback, then <b>Approve</b> (publishes live in ~a minute) or <b>Reject</b>.</p>
      <div class="review-list">${review.problems.map((problem) => problemCard(problem, review.drafts[problem.title])).join('')}</div>`;
  }
  return `${topBar({ title: 'Review builds', language: state.language })}
    <section class="review-screen"><h1 class="mode-heading">Review pending builds</h1>${body}</section>`;
}

export function bindReview(root, { state, loadReview, previewProblem, saveDecision }) {
  root.querySelector('[data-review-token-submit]')?.addEventListener('click', () => {
    const token = (root.querySelector('[data-review-token-input]')?.value || '').trim();
    if (!token) return;
    state.review.token = token;
    state.review.error = '';
    loadReview?.();
  });
  root.querySelectorAll('[data-review-feedback]').forEach((textarea) => textarea.addEventListener('input', () => {
    state.review.drafts[textarea.dataset.reviewFeedback] = textarea.value;
  }));
  root.querySelectorAll('[data-review-preview]').forEach((button) => button.addEventListener('click', () => previewProblem?.(button.dataset.reviewPreview)));
  root.querySelectorAll('[data-review-action]').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('[data-review-item]');
    if (!card) return;
    const title = card.dataset.reviewItem;
    const feedback = card.querySelector('[data-review-feedback]')?.value || '';
    saveDecision?.(title, button.dataset.reviewAction, feedback);
  }));
}
