import { difficultyTag, escapeText, topBar } from '../lib/ui.js';

// Draft feedback is keyed per (title, step) so edits in one stage never bleed into another. Used
// by the inline review panel in the lesson view (where the actual per-stage reviewing happens).
export function draftKey(title, step) {
  return `${title}::${step}`;
}

// Single derivation of a problem's review state, so the three places that render review status
// (this screen's badge, the library pill, the lesson stage panel) don't each recompute
// `total`/`blocked`. A problem publishes only once all stages are approved; a rejected stage blocks
// it. `isLive` marks problems already live via the `certifiedTitles` allowlist without a review.
export function reviewStatus(problem) {
  const total = problem.steps.length;
  return {
    total,
    blocked: problem.steps.some((s) => s.status === 'rejected'),
    approvedCount: problem.approvedCount,
    allApproved: problem.approvedCount === total,
    hasNewVersion: Boolean(problem.hasNewVersion),
    isLive: Boolean(problem.isLive),
  };
}

export function reviewBadge(problem) {
  const { total, blocked, approvedCount, allApproved, hasNewVersion, isLive } = reviewStatus(problem);
  // Flag a problem whose content was revised after your last decision — most useful on a blocked
  // problem you fixed, so you know to re-review rather than assume it is still the version you saw.
  const newVersion = hasNewVersion ? '<span class="rev-badge newversion">🔄 new version — re-review</span>' : '';
  if (blocked) return `<span class="rev-badge rejected">blocked · ${approvedCount}/${total}</span>${newVersion}`;
  if (allApproved) return `<span class="rev-badge live">✓ all approved — live</span>${newVersion}`;
  if (isLive) return `<span class="rev-badge live">live · not yet reviewed (${approvedCount}/${total})</span>${newVersion}`;
  return `<span class="rev-badge pending">${approvedCount}/${total} approved</span>${newVersion}`;
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
  } else {
    // Only surface builds that still need action — a fully-approved problem is live, so it drops off
    // this list (it stays reachable, with its review pill, in the review-mode library).
    const pending = review.problems.filter((problem) => !problem.isLive);
    if (!pending.length) {
      body = `${errorBanner}<p class="brief">Nothing to review — every complete build is live.</p>`;
    } else {
      body = `${errorBanner}<p class="brief">${pending.length} build${pending.length === 1 ? '' : 's'} to review. Open one to walk through it: <b>each stage has its own feedback box and Approve/Reject</b>, and a problem goes live once <b>all five stages</b> are approved. A blocked build stays here until its rejected stage is re-decided.</p>
        <div class="review-list">${pending.map((problem) => problemCard(problem)).join('')}</div>`;
    }
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
