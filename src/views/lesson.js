import { difficultyTag, escapeCode, escapeText, feedback, highlightBlank, richText, shuffle, topBar } from '../lib/ui.js';
import { sourceLink } from '../lib/problem-source.js';
import { draftKey } from './review.js';

const STAGE_BADGE = {
  approved: '<span class="rev-badge live">✓ approved</span>',
  rejected: '<span class="rev-badge rejected">✕ rejected</span>',
  pending: '<span class="rev-badge pending">• pending</span>',
};

// Technical tab labels (the interview vocabulary a learner should internalize) paired with a
// friendly, plain-language header shown above each step's content.
const stepTabs = ['Understand', 'Algorithm', 'Code', 'Complexity', 'Review'];
const stepHeaders = [
  'Understand the problem, then spot the pattern',
  'Plan the algorithm step by step',
  'Fix the code',
  'Work out the time & space complexity',
  'Review what makes this solution work',
];

function conceptOptions(lesson) {
  const choices = lesson.conceptChoices || [lesson.topic, 'Hash map', 'Two pointers', 'Dynamic programming'];
  return { correct: choices[0], choices: shuffle([...new Set(choices)]) };
}

function ensureAlgorithmState(state, lesson) {
  if (state.algorithm.available.length) return;
  // All the real steps, shuffled, placed straight into the answer — the task is pure ordering
  // (no separate "available" bank, no distractors to select). `available` is kept only as the
  // id→label lookup the renderer and reorder logic use.
  const steps = lesson.algorithm.map((label, index) => ({ id: `required-${index}`, label }));
  state.algorithm.available = steps;
  state.algorithm.answer = shuffle(steps.map((step) => step.id));
}

// Recognize: lead with the full plain-language problem statement, then Input/Output/Example,
// then the problem-specific intuition, then "what to notice", then a concept check.
function recognitionPanel(lesson) {
  const concept = conceptOptions(lesson);
  const statement = lesson.explanation || lesson.brief;
  const statementBlock = statement
    ? `<section class="problem-explanation"><h3>What you’re solving</h3><p>${richText(statement)}</p></section>`
    : '';
  const io = lesson.inputOutput
    ? `<section class="problem-explanation"><h3>Input</h3><p>${richText(lesson.inputOutput[0])}</p><h3>Output</h3><p>${richText(lesson.inputOutput[1])}</p><h3>Example</h3><pre class="code">${escapeCode(lesson.inputOutput[2])}</pre></section>`
    : '';
  const intuition = lesson.intuition
    ? `<aside class="intuition"><b>Intuition</b><p>${richText(lesson.intuition)}</p></aside>`
    : '';
  return `${statementBlock}
    ${io}
    ${intuition}
    <h3>What to notice</h3><ul>${(lesson.concepts || []).map((item) => `<li>${richText(item)}</li>`).join('')}</ul>
    <section class="quiz"><b>Concept check</b><p>Which data structure or idea is most important for solving this problem?</p>
      <div class="choice-list">${concept.choices.map((choice) => `<button data-concept-choice="${encodeURIComponent(choice)}">${escapeText(choice)}</button>`).join('')}</div>
      <div data-concept-feedback aria-live="polite"></div>
    </section>`;
}

// Guided AI coach (M9): the learner constructs the algorithm one step at a time. The coach
// asks a question, judges their answer, appends an accepted step to the growing solution, and
// asks the next — never revealing the full answer. Shown only when the server advertises the
// feature; otherwise the step is the deterministic drag-and-drop builder below.
function coachPanel(state) {
  const c = state.algorithmCoach;
  const stepsHtml = c.steps.length
    ? `<ol class="coach-list">${c.steps.map((step) => `<li>${escapeText(step)}</li>`).join('')}</ol>`
    : '<p class="coach-empty">Nothing yet — describe the first piece below.</p>';
  const note = c.feedback
    ? `<div class="coach-note ${c.decision === 'accept' ? 'accept' : 'revise'}">${richText(c.feedback)}</div>`
    : (c.error ? `<div class="coach-note revise">${escapeText(c.error)}</div>` : '');
  if (c.done) {
    return `<section class="ai-coach">
      <p class="ai-coach-label">You built the algorithm step by step — no answer key needed.</p>
      <div class="coach-steps"><b>Your algorithm</b>${stepsHtml}</div>
      <div class="coach-note accept">✓ ${richText(c.summary || 'That covers the core of the algorithm.')}</div>
      <button class="ai-ask" data-coach-restart>Build it again</button>
    </section>`;
  }
  return `<section class="ai-coach">
    <p class="ai-coach-label">Build the algorithm one piece at a time with your coach. It guides you and never reveals the full answer.</p>
    <div class="coach-steps"><b>Your algorithm so far</b>${stepsHtml}</div>
    ${note}
    <p class="coach-prompt">${escapeText(c.prompt)}</p>
    <textarea data-coach-input rows="3" maxlength="600" placeholder="Describe this piece in your own words… (Enter to submit)">${escapeText(c.input || '')}</textarea>
    <button class="ai-ask" data-coach-submit ${c.loading ? 'disabled' : ''}>${c.loading ? 'Thinking…' : 'Suggest this step'}</button>
    ${c.steps.length ? '<button class="coach-finish" data-coach-finish>I’ve got the full algorithm →</button>' : ''}
    <button class="coach-toggle" data-use-builder>${c.unavailable ? 'Switch to the step builder →' : 'Prefer to arrange ready-made steps?'}</button>
  </section>`;
}

// Deterministic drag-and-drop builder — the offline / no-key baseline for the Algorithm step, and
// the fallback the learner can switch to when the AI coach is unavailable.
function dragDropPanel(state, lesson) {
  ensureAlgorithmState(state, lesson);
  const answer = state.algorithm.answer.map((id) => state.algorithm.available.find((item) => item.id === id));
  // Offer a way back to the coach only when it's actually available (a key is configured).
  const backToCoach = state.features?.algorithmFeedback
    ? '<button class="coach-toggle" data-use-coach>↻ Build it with the AI coach instead</button>'
    : '';
  return `${backToCoach}<p>These are the steps of the solution, shuffled. Drag the ⠿ handle to put them in the right order, then check.</p>
    <section class="algorithm-builder">
      <div class="answer-bank" data-answer-bank>
        ${answer.map((item, index) => `<div class="answer-step" data-answer-step="${item.id}"><span class="drag-handle" aria-hidden="true">⠿</span><span class="answer-step-label">${index + 1}. ${escapeText(item.label)}</span></div>`).join('') || '<p class="empty-answer">No steps to order for this problem.</p>'}
      </div>
    </section>
    <button class="primary" data-check-algorithm>Check the order</button><div data-algorithm-feedback aria-live="polite"></div>`;
}

function algorithmPanel(state, lesson) {
  const useCoach = state.features?.algorithmFeedback && !state.stepBuilderFallback;
  return useCoach ? coachPanel(state) : dragDropPanel(state, lesson);
}

// A collapsible one-line problem reminder shown on every stage, so the learner can refer back to
// what they're solving without leaving the step. The full statement lives on the Recognize step;
// its open/closed state persists across steps and problems (appState.reminderOpen).
function problemReminder(state, lesson) {
  const text = lesson.brief || lesson.explanation;
  if (!text) return '';
  return `<details class="problem-reminder" data-problem-reminder ${state.reminderOpen ? 'open' : ''}>
    <summary>Problem</summary>
    <p>${richText(text)}</p>
  </details>`;
}

function codePanel(state, lesson) {
  if (!lesson.exercises.length) {
    return `<p>This lesson is still a draft. Its completed code exercises will be added before it earns a Built badge.</p><pre class="code">${escapeCode(lesson.code)}</pre>`;
  }
  const index = Math.min(state.codeFixIndex, lesson.exercises.length - 1);
  const exercise = lesson.exercises[index];
  const choices = shuffle(exercise.choices);
  const last = index === lesson.exercises.length - 1;
  return `<p class="step-sub">Fix ${index + 1} of ${lesson.exercises.length}</p>
    <p>${escapeText(exercise.prompt || 'Choose the line that preserves the algorithm’s invariant.')}</p>
    <pre class="code">${highlightBlank(exercise.code, state.language)}</pre>
    <p class="drill-choose-hint">Choose the line that belongs in the blank.</p>
    <div class="choice-list">${choices.map((choice) => `<button data-code-choice="${encodeURIComponent(choice)}">${escapeCode(choice)}</button>`).join('')}</div>
    <div data-code-feedback aria-live="polite"></div>
    <button class="primary code-continue" data-next-code hidden>${last ? 'Continue to complexity →' : 'Next code fix →'}</button>`;
}

function complexityButtons(attribute, choices) {
  return `<div class="choice-list">${shuffle(choices).map(([id, label]) => `<button ${attribute}="${id}">${escapeText(label)}</button>`).join('')}</div>`;
}

function complexityPanel(state, lesson) {
  const guide = lesson.complexityGuide;
  if (!guide) return `<pre class="code">${escapeCode(lesson.code)}</pre><p>${richText(lesson.complexity)}</p>`;
  const work = `<section class="complexity-step"><b>1. Count the work</b><p>${richText(guide.work)}</p>${complexityButtons('data-complexity-work', guide.workChoices)}<div data-complexity-feedback aria-live="polite"></div></section>`;
  const memory = state.complexityStage >= 1 ? `<section class="complexity-step"><b>2. Count extra memory</b><p>${richText(guide.memory)}</p>${complexityButtons('data-complexity-memory', guide.memoryChoices)}<div data-memory-feedback aria-live="polite"></div></section>` : '';
  const final = state.complexityStage >= 2 ? `<section class="complexity-step"><b>3. State the complexity</b><p>Combine your two observations.</p>${complexityButtons('data-complexity-final', guide.final)}<div data-final-feedback aria-live="polite"></div></section>` : '';
  return `<p>Use the completed solution to derive the bound.</p><pre class="code">${escapeCode(lesson.code)}</pre>${work}${memory}${final}`;
}

function reviewPanel(lesson) {
  return `<section class="problem-explanation"><h3>The key idea</h3><p>${richText(lesson.concepts?.[0] || lesson.topic)}</p>
      <h3>Why it fits</h3><p>${richText(lesson.explanation || lesson.brief)}</p>
      <h3>Remember</h3><ul>${(lesson.fixes || []).map((item) => `<li>${richText(item)}</li>`).join('')}</ul>
      <h3>Complexity</h3><p>${richText(lesson.complexity)}</p>
    </section>
    <details class="hint"><summary>Optional solution walkthrough</summary><ol>${(lesson.algorithm || []).map((item) => `<li>${richText(item)}</li>`).join('')}</ol><pre class="code">${escapeCode(lesson.code)}</pre></details>`;
}

// The problem currently being reviewed (owner walked in from /review), or null for a normal
// learner. Present only when a review token loaded this pending problem's per-stage decisions.
function reviewingProblem(state, card) {
  if (!state.review?.token || !state.review.problems?.length) return null;
  return state.review.problems.find((problem) => problem.title === card.title) || null;
}

// Inline review controls for the stage the owner is currently on — feedback + Approve/Reject right
// where they experience it. A problem publishes only once all five stages are approved.
function reviewStagePanel(state, card, step) {
  const problem = reviewingProblem(state, card);
  const stage = problem?.steps[step];
  if (!stage) return '';
  const draft = state.review.drafts[draftKey(card.title, stage.step)];
  const value = draft !== undefined ? draft : stage.feedback;
  const total = problem.steps.length;
  const blocked = problem.steps.some((s) => s.status === 'rejected');
  const summary = problem.approvedCount === total
    ? '✓ All five stages approved — this problem is live.'
    : `${problem.approvedCount}/${total} stages approved${blocked ? ' · blocked by a rejected stage' : ''}`;
  return `<section class="lesson-review" data-review-stage="${escapeText(stage.step)}">
    <div class="lesson-review-head"><b>Review this stage · ${escapeText(stepTabs[step])}</b>${STAGE_BADGE[stage.status] || STAGE_BADGE.pending}</div>
    <textarea class="review-feedback" data-review-feedback rows="2" placeholder="Feedback for this stage — what to fix, or why it’s good…">${escapeText(value || '')}</textarea>
    <div class="review-actions">
      <button class="review-approve" data-review-action="approved">Approve stage</button>
      <button class="review-reject" data-review-action="rejected">Reject</button>
      <button class="review-reset" data-review-action="pending">Reset</button>
    </div>
    <p class="lesson-review-summary">${escapeText(summary)}</p>
  </section>`;
}

// A tappable progress rail: it shows where you are, marks completed steps, and doubles as the
// jump control — the single "move through the steps" axis.
function progressRail(step) {
  const steps = stepTabs.map((label, index) => {
    const state = index === step ? 'active' : index < step ? 'done' : 'upcoming';
    const marker = index < step ? '✓' : String(index + 1);
    return `<button class="rail-step ${state}" data-lesson-step="${index}" aria-current="${index === step ? 'step' : 'false'}">
      <span class="rail-dot">${marker}</span><span class="rail-name">${label}</span>
    </button>`;
  }).join('');
  return `<nav class="steprail" aria-label="Lesson steps">${steps}</nav>
    <p class="rail-status">Step ${step + 1} of ${stepTabs.length} · ${stepTabs[step]}</p>`;
}

// "Go to another problem" — the second, clearly separated navigation axis, demoted to a footer.
function problemFooter(randomNavigation) {
  if (randomNavigation) {
    return `<div class="lesson-footer"><span class="lesson-footer-label">Practice another problem</span>
      <div class="lesson-footer-actions">
        <button data-previous-problem ${randomNavigation.canGoBack ? '' : 'disabled'}>← Previous</button>
        <button class="primary" data-next-problem>Next random →</button>
      </div></div>`;
  }
  return `<div class="lesson-footer"><span class="lesson-footer-label">Go to another problem</span>
    <div class="lesson-footer-actions">
      <button data-previous-problem>← Previous</button>
      <button data-next-problem>Next →</button>
    </div></div>`;
}

export function renderLesson({ state, card, lesson, difficulty, randomNavigation = null }) {
  const panels = [
    () => recognitionPanel(lesson),
    () => algorithmPanel(state, lesson),
    () => codePanel(state, lesson),
    () => complexityPanel(state, lesson),
    () => reviewPanel(lesson),
  ];
  const step = state.lessonStep;
  const panel = panels[step]();
  const lastStep = step === stepTabs.length - 1;
  // The topic names the very pattern the Recognize concept check asks the learner to identify,
  // so keep it hidden on step 0 and only reveal it once they're past that check.
  const eyebrow = step === 0 ? '' : `<div class="eyebrow">${escapeText(card.topic.toUpperCase())}</div>`;
  return `${topBar({ title: escapeText(card.title), language: state.language })}
    <article class="lesson">${eyebrow}
      <h1>${escapeText(card.title)}${difficultyTag(difficulty)}</h1>
      ${lesson.isComplete ? '' : '<aside class="wip-banner"><b>Work in progress</b><p>This is a starter outline, not a finished walkthrough. Its explanations and exercises are still being authored.</p></aside>'}
      ${lesson.isComplete && !lesson.isBuilt ? '<aside class="review-banner"><b>Pending review</b><p>This problem is complete but not yet certified — you\'re previewing it. Certify it to publish.</p></aside>' : ''}
      ${progressRail(step)}
      ${step === 0 ? '' : problemReminder(state, lesson)}
      <section class="content"><h2 class="step-title">${escapeText(stepHeaders[step])}</h2>${panel}</section>
      ${reviewStagePanel(state, card, step)}
      <div class="bottom"><button data-previous-step ${step === 0 ? 'disabled' : ''}>← Previous step</button><button class="next" data-next-step>${lastStep ? 'Finish lesson ✓' : 'Next step →'}</button></div>
      ${problemFooter(randomNavigation)}
      ${sourceLink(card.title)}
    </article>`;
}

// Pointer-based reordering for the answer steps. Works with mouse AND touch (native HTML5 drag
// does not work on touch), lifts the held step, and slides the other steps to open a gap where it
// will land. State is committed once, on release.
function enableStepSorting(root, state, rerender) {
  const bank = root.querySelector('[data-answer-bank]');
  if (!bank) return;
  bank.querySelectorAll('.drag-handle').forEach((handle) => {
    handle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const dragEl = handle.closest('.answer-step');
      const steps = Array.from(bank.querySelectorAll('.answer-step'));
      const startIndex = steps.indexOf(dragEl);
      if (startIndex < 0) return;
      const unit = dragEl.getBoundingClientRect().height + 8; // item height + grid gap
      const startY = event.clientY;
      let targetIndex = startIndex;
      dragEl.classList.add('dragging');
      bank.classList.add('is-dragging');
      try { dragEl.setPointerCapture(event.pointerId); } catch { /* capture unsupported */ }

      const onMove = (moveEvent) => {
        const dy = moveEvent.clientY - startY;
        dragEl.style.transform = `translateY(${dy}px)`;
        const next = Math.max(0, Math.min(steps.length - 1, startIndex + Math.round(dy / unit)));
        if (next === targetIndex) return;
        targetIndex = next;
        // Shift the other steps to open a gap at the target slot; CSS transitions make them slide.
        steps.forEach((el, index) => {
          if (el === dragEl) return;
          let shift = 0;
          if (targetIndex > startIndex && index > startIndex && index <= targetIndex) shift = -unit;
          else if (targetIndex < startIndex && index >= targetIndex && index < startIndex) shift = unit;
          el.style.transform = shift ? `translateY(${shift}px)` : '';
        });
      };
      const onUp = () => {
        dragEl.removeEventListener('pointermove', onMove);
        dragEl.removeEventListener('pointerup', onUp);
        dragEl.removeEventListener('pointercancel', onUp);
        if (targetIndex !== startIndex) {
          const ids = [...state.algorithm.answer];
          const [moved] = ids.splice(startIndex, 1);
          ids.splice(targetIndex, 0, moved);
          state.algorithm.answer = ids;
        }
        rerender(); // fresh render clears the drag transforms and reflects the new order
      };
      dragEl.addEventListener('pointermove', onMove);
      dragEl.addEventListener('pointerup', onUp);
      dragEl.addEventListener('pointercancel', onUp);
    });
  });
}

export function bindLesson(root, { state, card, lesson, rerender, finishLesson, requestFeedback, resetCoach, finishCoach, useStepBuilder, useCoach, saveReviewStage }) {
  // Inline per-stage review (owner walked in from /review): keep typed feedback in state so a
  // re-render doesn't drop it, and record the approve/reject decision for this exact stage.
  const stagePanel = root.querySelector('[data-review-stage]');
  if (stagePanel && card) {
    const stepKey = stagePanel.dataset.reviewStage;
    const textarea = stagePanel.querySelector('[data-review-feedback]');
    textarea?.addEventListener('input', () => { state.review.drafts[draftKey(card.title, stepKey)] = textarea.value; });
    stagePanel.querySelectorAll('[data-review-action]').forEach((button) => button.addEventListener('click', () => {
      saveReviewStage?.(stepKey, button.dataset.reviewAction, textarea?.value || '');
    }));
  }

  // Guided AI coach (M9): keep the typed step in state so it survives the Algorithm step's
  // re-renders; submit a turn / restart via the coordinator (which owns the network call and
  // state transitions).
  const coachInput = root.querySelector('[data-coach-input]');
  coachInput?.addEventListener('input', () => { state.algorithmCoach.input = coachInput.value; });
  // Enter submits the step; Shift+Enter inserts a newline.
  coachInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      state.algorithmCoach.input = coachInput.value;
      requestFeedback?.();
    }
  });
  root.querySelector('[data-coach-submit]')?.addEventListener('click', () => {
    if (coachInput) state.algorithmCoach.input = coachInput.value;
    requestFeedback?.();
  });
  root.querySelector('[data-coach-restart]')?.addEventListener('click', () => resetCoach?.());
  root.querySelector('[data-coach-finish]')?.addEventListener('click', () => finishCoach?.());
  root.querySelector('[data-use-builder]')?.addEventListener('click', () => useStepBuilder?.());
  root.querySelector('[data-use-coach]')?.addEventListener('click', () => useCoach?.());
  // Persist the problem reminder's open/closed state so re-renders don't collapse it.
  root.querySelector('[data-problem-reminder]')?.addEventListener('toggle', (event) => { state.reminderOpen = event.target.open; });

  root.querySelectorAll('[data-concept-choice]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.conceptChoice);
    const correct = (lesson.conceptChoices || [lesson.topic])[0];
    root.querySelector('[data-concept-feedback]').innerHTML = feedback(
      choice === correct
        ? `✓ Correct. ${escapeText(correct)} is the central tool for this problem.`
        : `${escapeText(choice)} can be useful on other problems, but it does not match this input’s structure.`,
      choice === correct,
    );
  }));

  enableStepSorting(root, state, rerender);
  root.querySelector('[data-check-algorithm]')?.addEventListener('click', () => {
    const correct = lesson.algorithm.map((_, index) => `required-${index}`);
    const answer = state.algorithm.answer;
    const rightOrder = answer.length === correct.length && answer.every((id, index) => id === correct[index]);
    root.querySelector('[data-algorithm-feedback]').innerHTML = feedback(
      rightOrder ? '✓ Correct — that’s the right order.' : 'Not quite — these steps are out of order. Rearrange them and check again.',
      rightOrder,
    );
  });

  const exercise = lesson.exercises[state.codeFixIndex];
  root.querySelectorAll('[data-code-choice]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.codeChoice);
    const correct = choice === exercise.correct;
    root.querySelector('[data-code-feedback]').innerHTML = feedback(correct
      ? `✓ Correct. ${escapeText(exercise.why)}`
      : `Not quite. ${escapeText(exercise.wrong?.[choice] || 'That choice does not make this line work for this problem.')}`,
    correct);
    if (correct) root.querySelector('[data-next-code]').hidden = false;
  }));
  root.querySelector('[data-next-code]')?.addEventListener('click', () => {
    if (state.codeFixIndex < lesson.exercises.length - 1) state.codeFixIndex += 1;
    else state.lessonStep = 3;
    rerender();
  });

  const guide = lesson.complexityGuide;
  root.querySelectorAll('[data-complexity-work]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityWork === guide.workCorrect;
    root.querySelector('[data-complexity-feedback]').innerHTML = feedback(good ? escapeText(guide.workWhy) : 'Trace how much total work the loop or traversal can do before choosing again.', good);
    if (good) { state.complexityStage = 1; rerender(); }
  }));
  root.querySelectorAll('[data-complexity-memory]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityMemory === guide.memoryCorrect;
    root.querySelector('[data-memory-feedback]').innerHTML = feedback(good ? escapeText(guide.memoryWhy) : 'Consider only extra storage whose size can grow with the input.', good);
    if (good) { state.complexityStage = 2; rerender(); }
  }));
  root.querySelectorAll('[data-complexity-final]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityFinal === guide.finalCorrect;
    root.querySelector('[data-final-feedback]').innerHTML = feedback(good ? '✓ Correct. You combined work and memory into the final bound.' : 'Not quite. Revisit the work and memory observations, then try again.', good);
  }));

  root.querySelector('[data-previous-step]')?.addEventListener('click', () => { state.lessonStep = Math.max(0, state.lessonStep - 1); rerender(); });
  root.querySelector('[data-next-step]')?.addEventListener('click', () => {
    if (state.lessonStep === stepTabs.length - 1) finishLesson();
    else { state.lessonStep += 1; rerender(); }
  });
}
