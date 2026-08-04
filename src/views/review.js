import { difficultyTag, escapeText, topBar } from '../lib/ui.js';

const STEP_BADGE = {
  approved: '<span class="rev-badge live">✓ approved</span>',
  rejected: '<span class="rev-badge rejected">✕ rejected</span>',
  pending: '<span class="rev-badge pending">• pending</span>',
};

// Draft feedback is keyed per (title, step) so edits in one stage never bleed into another.
export function draftKey(title, step) {
  return `${title}::${step}`;
}

function problemBadge(problem) {
  const blocked = problem.steps.some((s) => s.status === 'rejected');
  if (problem.approvedCount === problem.steps.length) return '<span class="rev-badge live">✓ all approved — live</span>';
  if (blocked) return `<span class="rev-badge rejected">blocked · ${problem.approvedCount}/${problem.steps.length}</span>`;
  return `<span class="rev-badge pending">${problem.approvedCount}/${problem.steps.length} approved</span>`;
}

function stepRow(problem, step, index, draft) {
  const feedback = draft !== undefined ? draft : step.feedback;
  return `<div class="review-step" data-review-step="${escapeText(step.step)}">
    <div class="review-step-head">
      <span class="review-step-name">${index + 1}. ${escapeText(step.label)}</span>
      ${STEP_BADGE[step.status] || STEP_BADGE.pending}
      <button class="review-preview" data-review-preview="${escapeText(problem.id)}" data-review-step-index="${index}">▶ preview</button>
    </div>
    <textarea class="review-feedback" data-review-feedback rows="2" placeholder="Feedback for this stage — what to fix, or why it's good…">${escapeText(feedback || '')}</textarea>
    <div class="review-actions">
      <button class="review-approve" data-review-action="approved">Approve</button>
      <button class="review-reject" data-review-action="rejected">Reject</button>
      <button class="review-reset" data-review-action="pending">Reset</button>
    </div>
  </div>`;
}

function problemCard(problem, drafts) {
  const steps = problem.steps
    .map((step, index) => stepRow(problem, step, index, drafts[draftKey(problem.title, step.step)]))
    .join('');
  return `<article class="review-card" data-review-item="${escapeText(problem.title)}">
    <div class="review-head"><b>${escapeText(problem.title)}</b>${difficultyTag(problem.difficulty)}${problemBadge(problem)}</div>
    <div class="review-steps">${steps}</div>
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
    body = `${errorBanner}<p class="brief">${review.problems.length} build${review.problems.length > 1 ? 's' : ''} pending. Review each stage — leave feedback and <b>Approve</b> or <b>Reject</b>. A problem publishes live only once <b>all five stages</b> are approved.</p>
      <div class="review-list">${review.problems.map((problem) => problemCard(problem, review.drafts)).join('')}</div>`;
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
  root.querySelectorAll('[data-review-step]').forEach((row) => {
    const card = row.closest('[data-review-item]');
    if (!card) return;
    const title = card.dataset.reviewItem;
    const step = row.dataset.reviewStep;
    const textarea = row.querySelector('[data-review-feedback]');
    textarea?.addEventListener('input', () => {
      state.review.drafts[draftKey(title, step)] = textarea.value;
    });
    row.querySelectorAll('[data-review-action]').forEach((button) => button.addEventListener('click', () => {
      saveDecision?.(title, step, button.dataset.reviewAction, textarea?.value || '');
    }));
  });
  root.querySelectorAll('[data-review-preview]').forEach((button) => button.addEventListener('click', () => {
    previewProblem?.(button.dataset.reviewPreview, Number(button.dataset.reviewStepIndex) || 0);
  }));
}
