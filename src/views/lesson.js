import { difficultyTag, escapeCode, escapeText, feedback, highlightBlank, richText, shuffle, topBar } from '../lib/ui.js';
import { sourceLink } from '../lib/problem-source.js';
import { indentOf, isBlank } from '../data/blank-line.js';
import { REVIEW_STEP_LABELS } from '../data/review-stages.js';
import { draftKey, reviewStatus } from './review.js';

const STAGE_BADGE = {
  approved: '<span class="rev-badge live">✓ approved</span>',
  rejected: '<span class="rev-badge rejected">✕ rejected</span>',
  pending: '<span class="rev-badge pending">• pending</span>',
};

// Technical tab labels (the interview vocabulary a learner should internalize) paired with a
// friendly, plain-language header shown above each step's content.
const stepTabs = REVIEW_STEP_LABELS; // single source: src/data/review-stages.js
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

// The algorithm's accepted-order structure. Leaves are step indices; a `seq` node's children must
// appear in order, an `any` node's children may be in any order — and a child can itself be a `seq`
// block that must stay together. A plain flat sequence (no authored groups) defaults to strict order.
function algorithmTreeFor(lesson) {
  return lesson.algorithmTree || { seq: lesson.algorithm.map((_, i) => i) };
}
function treeLeaves(node) {
  return typeof node === 'number' ? [node] : (node.seq || node.any).flatMap(treeLeaves);
}
// The valid ordering closest to the learner's current arrangement: `seq` keeps authored order, `any`
// adopts the learner's order (children sorted by their earliest position). A learner arrangement is
// correct exactly when it equals this; comparing position-by-position also drives the hint highlight.
function intendedOrder(node, posOf) {
  if (typeof node === 'number') return [node];
  const children = node.seq || node.any;
  const ordered = node.any
    ? [...children].sort((a, b) => Math.min(...treeLeaves(a).map(posOf)) - Math.min(...treeLeaves(b).map(posOf)))
    : children;
  return ordered.flatMap((child) => intendedOrder(child, posOf));
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
// then the concept check. The check is a *recognition* exercise, so it comes BEFORE the cues
// that would name the answer: the intuition and "what to notice" are revealed as the
// explanation only once the learner has committed to an answer (see the concept-choice handler).
function recognitionPanel(lesson) {
  const concept = conceptOptions(lesson);
  const statement = lesson.explanation || lesson.brief;
  // An optional fuller statement (authored for the subtler problems) follows the one-line
  // summary; split blank-line-separated blocks into paragraphs.
  const description = lesson.description
    ? lesson.description.split('\n\n').map((para) => `<p>${richText(para)}</p>`).join('')
    : '';
  const statementBlock = statement
    ? `<section class="problem-explanation"><h3>What you’re solving</h3><p>${richText(statement)}</p>${description}</section>`
    : '';
  // Additional worked examples (edge cases and other inputs) tuck into the Example area as a small
  // collapsible link, so they add reasoning material without crowding the step. They don't name the
  // pattern, so they can sit before the concept check.
  const moreExamples = (lesson.examples && lesson.examples.length)
    ? `<details class="more-examples"><summary>+${lesson.examples.length} more example${lesson.examples.length > 1 ? 's' : ''}</summary>${lesson.examples.map((ex) => `<div class="example"><pre class="code">Input: ${escapeCode(ex.input)}\nOutput: ${escapeCode(ex.output)}</pre>${ex.note ? `<p class="example-note">${richText(ex.note)}</p>` : ''}</div>`).join('')}</details>`
    : '';
  const io = lesson.inputOutput
    ? `<section class="problem-explanation"><h3>Input</h3><p>${richText(lesson.inputOutput[0])}</p><h3>Output</h3><p>${richText(lesson.inputOutput[1])}</p><h3>Example</h3><pre class="code">${escapeCode(lesson.inputOutput[2])}</pre>${moreExamples}</section>`
    : '';
  const intuition = lesson.intuition
    ? `<aside class="intuition"><b>Intuition</b><p>${richText(lesson.intuition)}</p></aside>`
    : '';
  const notice = (lesson.concepts && lesson.concepts.length)
    ? `<h3>What to notice</h3><ul>${lesson.concepts.map((item) => `<li>${richText(item)}</li>`).join('')}</ul>`
    : '';
  // Hidden until the concept check is answered, so these don't give the pattern away.
  const reveal = (intuition || notice)
    ? `<div class="recognition-reveal" data-recognition-reveal hidden>${intuition}${notice}</div>`
    : '';
  return `${statementBlock}
    ${io}
    <section class="quiz"><b>Approach check</b>
      <div class="quiz-body"><p>Which general approach best fits this problem?</p>
        <div class="choice-list">${concept.choices.map((choice) => `<button data-concept-choice="${encodeURIComponent(choice)}">${escapeText(choice)}</button>`).join('')}</div>
      </div>
      <div data-concept-feedback aria-live="polite"></div>
    </section>
    ${reveal}`;
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
        ${answer.map((item, index) => `<div class="answer-step" data-answer-step="${item.id}"><span class="drag-handle" aria-hidden="true">⠿</span><span class="answer-step-label">${escapeText(item.label)}</span></div>`).join('') || '<p class="empty-answer">No steps to order for this problem.</p>'}
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

// All exercises in a lesson are the SAME full solution with one different line blanked. Combine
// them: reconstruct the solution and blank every one of those lines at once, numbered top-to-bottom,
// so the Code step shows the whole solution with N blanks and asks one question per blank — instead
// of stepping through one blank at a time. Returns null if the exercises don't cleanly share one
// solution (then codePanel falls back to a stacked per-exercise view). Also used by bindLesson to
// map a blank number back to its exercise.
export function codeBlanks(lesson) {
  const exercises = lesson.exercises || [];
  if (!exercises.length) return null;
  const first = exercises[0];
  const fullLines = first.code.split('\n').map((line) => {
    if (!isBlank(line)) return line;
    return indentOf(line) + first.correct;
  });
  const seen = new Set();
  const blanks = [];
  for (const ex of exercises) {
    const idx = fullLines.findIndex((line) => line.trim() === String(ex.correct).trim());
    if (idx < 0 || seen.has(idx)) return null; // couldn't place it uniquely — bail to the fallback
    seen.add(idx);
    blanks.push({ ex, idx });
  }
  blanks.sort((a, b) => a.idx - b.idx).forEach((b, i) => { b.n = i + 1; });
  return { fullLines, blanks };
}

function codeQuestion(n, exercise, label) {
  return `<section class="code-question" data-code-question="${n}">
    <p class="step-sub">${label}</p>
    <div class="code-question-body">
      <p>${escapeText(exercise.prompt || 'Choose the line that belongs in this blank.')}</p>
      <div class="choice-list">${shuffle(exercise.choices).map((choice) => `<button data-code-choice="${encodeURIComponent(choice)}" data-code-blank="${n}">${escapeCode(choice)}</button>`).join('')}</div>
    </div>
    <div data-code-feedback="${n}" aria-live="polite"></div>
  </section>`;
}

function codePanel(state, lesson) {
  if (!lesson.exercises.length) {
    return `<p>This lesson is still a draft. Its completed code exercises will be added before it earns a Built badge.</p><pre class="code">${escapeCode(lesson.code)}</pre>`;
  }
  const built = codeBlanks(lesson);
  if (!built) {
    // Fallback: the exercises don't share one reconstructable solution, so stack each on its own.
    return lesson.exercises.map((ex, i) => codeQuestion(i + 1, ex, `Fix ${i + 1} of ${lesson.exercises.length}`)
      .replace('<section class="code-question">', `<section class="code-question"><pre class="code">${highlightBlank(ex.code, state.language)}</pre>`)).join('');
  }
  const comment = state.language === 'Python' ? '#' : '//';
  const codeHtml = built.fullLines.map((line, idx) => {
    const blank = built.blanks.find((b) => b.idx === idx);
    if (!blank) return escapeCode(line);
    return `${escapeCode(indentOf(line))}<mark class="code-blank" data-blank-mark="${blank.n}">${comment} Blank ${blank.n} — pick below</mark>`;
  }).join('\n');
  const many = built.blanks.length > 1;
  return `<p>The solution below has ${built.blanks.length} blank${many ? 's' : ''}. Answer ${many ? 'each question' : 'the question'} to fill ${many ? 'them' : 'it'} in.</p>
    <pre class="code">${codeHtml}</pre>
    ${built.blanks.map((b) => codeQuestion(b.n, b.ex, `Blank ${b.n}`)).join('')}`;
}

function complexityButtons(attribute, choices) {
  return `<div class="choice-list">${shuffle(choices).map(([id, label]) => `<button ${attribute}="${id}">${escapeText(label)}</button>`).join('')}</div>`;
}

function complexityPanel(state, lesson) {
  const guide = lesson.complexityGuide;
  if (!guide) return `<pre class="code">${escapeCode(lesson.code)}</pre><p>${richText(lesson.complexity)}</p>`;
  // All three stages are rendered up front; the later two start hidden and are revealed in place as
  // each is answered (no full re-render), so answering never reshuffles choices or drops feedback.
  // The question body (prompt + choices) collapses once answered correctly; the heading + feedback
  // stay so the learner sees a growing summary.
  const box = (key, hidden, heading, prompt, attr, choices, fb) => `<section class="complexity-step" data-complexity-box="${key}"${hidden ? ' hidden' : ''}><b>${heading}</b><div class="complexity-body"><p>${richText(prompt)}</p>${complexityButtons(attr, choices)}</div><div ${fb} aria-live="polite"></div></section>`;
  const work = box('work', false, '1. Count the work', guide.work, 'data-complexity-work', guide.workChoices, 'data-complexity-feedback');
  const memory = box('memory', state.complexityStage < 1, '2. Count extra memory', guide.memory, 'data-complexity-memory', guide.memoryChoices, 'data-memory-feedback');
  const final = box('final', state.complexityStage < 2, '3. State the complexity', 'Combine your two observations.', 'data-complexity-final', guide.final, 'data-final-feedback');
  return `<p>Use the completed solution to derive the bound.</p><pre class="code">${escapeCode(lesson.code)}</pre>${work}${memory}${final}`;
}

function reviewPanel(lesson) {
  return `<section class="problem-explanation review-summary"><h3>The key idea</h3><p>${richText(lesson.concepts?.[0] || lesson.topic)}</p>
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
  const { total, blocked, approvedCount, allApproved, hasNewVersion } = reviewStatus(problem);
  const newVersionNote = hasNewVersion ? ' · 🔄 revised since your last review — take another look' : '';
  const summary = (allApproved
    ? '✓ All five stages approved — this problem is live.'
    : `${approvedCount}/${total} stages approved${blocked ? ' · blocked by a rejected stage' : ''}`) + newVersionNote;
  // On the final (Review) stage, if you walked the whole thing without rejecting anything, offer a
  // one-tap approve-all instead of approving each remaining stage individually.
  const approveAll = (step === total - 1 && !blocked && problem.approvedCount < total)
    ? `<button class="review-approve-all" data-review-approve-all>Approve the whole problem — all ${total} stages ✓</button>`
    : '';
  return `<section class="lesson-review" data-review-stage="${escapeText(stage.step)}">
    <div class="lesson-review-head"><b>Review this stage · ${escapeText(stepTabs[step])}</b>${STAGE_BADGE[stage.status] || STAGE_BADGE.pending}</div>
    <textarea class="review-feedback" data-review-feedback rows="2" placeholder="Feedback for this stage — what to fix, or why it’s good…">${escapeText(value || '')}</textarea>
    <div class="review-actions">
      <button class="review-approve" data-review-action="approved">Approve stage</button>
      <button class="review-reject" data-review-action="rejected">Reject</button>
      <button class="review-reset" data-review-action="pending">Reset</button>
    </div>
    ${approveAll}
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
      // Clear any "out of place" highlight the moment a step is grabbed — it's stale once you move.
      steps.forEach((el) => el.classList.remove('step-right', 'step-wrong'));
      const feedbackSlot = root.querySelector('[data-algorithm-feedback]');
      if (feedbackSlot) feedbackSlot.innerHTML = '';
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

export function bindLesson(root, { state, card, lesson, rerender, finishLesson, requestFeedback, resetCoach, finishCoach, useStepBuilder, useCoach, saveReviewStage, approveAllStages }) {
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
    stagePanel.querySelector('[data-review-approve-all]')?.addEventListener('click', () => approveAllStages?.());
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
    const right = choice === correct;
    root.querySelector('[data-concept-feedback]').innerHTML = feedback(
      right
        ? `✓ Correct. ${escapeText(correct)} is the right approach here.`
        : `Not the best approach here — ${escapeText(choice)} is reasonable in general, but for this problem it either misses cases or is slower.`,
      right,
    );
    if (right) {
      // Collapse the question and reveal the intuition + "what to notice" as the explanation.
      button.closest('.quiz')?.classList.add('solved');
      root.querySelector('[data-recognition-reveal]')?.removeAttribute('hidden');
    }
  }));

  enableStepSorting(root, state, rerender);
  // Mark each step green if it's in its correct slot, amber if it's out of place — offered as an
  // opt-in hint after a wrong check so it nudges without giving the order away outright.
  // Correctness + hint both come from the nearest valid ordering (intendedOrder): a step is "in
  // place" when its index matches the intended index at that position — so any valid arrangement of
  // an interchangeable group (or a whole ordered block moved as a unit) reads as correct.
  const tree = algorithmTreeFor(lesson);
  const idIndex = (id) => Number(id.slice('required-'.length));
  const intendedFor = (orderIds) => intendedOrder(tree, (index) => orderIds.indexOf(`required-${index}`));
  const highlightMisplaced = () => {
    const els = [...root.querySelectorAll('[data-answer-bank] .answer-step')];
    const orderIds = els.map((el) => el.dataset.answerStep);
    const intended = intendedFor(orderIds);
    els.forEach((el, index) => {
      const correctHere = idIndex(orderIds[index]) === intended[index];
      el.classList.toggle('step-right', correctHere);
      el.classList.toggle('step-wrong', !correctHere);
    });
  };
  root.querySelector('[data-check-algorithm]')?.addEventListener('click', () => {
    const orderIds = state.algorithm.answer;
    const intended = intendedFor(orderIds);
    const rightOrder = orderIds.length === intended.length && orderIds.every((id, index) => idIndex(id) === intended[index]);
    root.querySelector('[data-algorithm-feedback]').innerHTML = rightOrder
      ? feedback('✓ Correct — that’s the right order.', true)
      : `<div class="answer-feedback bad">Not quite — some steps are out of order. <button class="algorithm-highlight" data-highlight-wrong>Highlight what’s out of place</button></div>`;
    root.querySelector('[data-highlight-wrong]')?.addEventListener('click', highlightMisplaced);
  });

  // Each blank is an independent question, answered in place (no more one-at-a-time "next fix").
  const codeBuilt = codeBlanks(lesson);
  root.querySelectorAll('[data-code-choice]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.codeChoice);
    const n = Number(button.dataset.codeBlank);
    const exercise = codeBuilt ? codeBuilt.blanks.find((b) => b.n === n)?.ex : lesson.exercises[n - 1];
    if (!exercise) return;
    const correct = choice === exercise.correct;
    root.querySelector(`[data-code-feedback="${n}"]`).innerHTML = feedback(correct
      ? `✓ Correct. ${escapeText(exercise.why)}`
      : `Not quite. ${escapeText(exercise.wrong?.[choice] || 'That choice does not make this line work for this problem.')}`,
    correct);
    if (correct) {
      // Fill the blank in the code preview with the answer (kept highlighted green), and collapse
      // this question so the learner sees the growing, correct solution.
      const mark = root.querySelector(`[data-blank-mark="${n}"]`);
      if (mark) { mark.textContent = exercise.correct; mark.className = 'code-filled'; }
      root.querySelector(`[data-code-question="${n}"]`)?.classList.add('solved');
    }
  }));

  const guide = lesson.complexityGuide;
  // Reveal the next stage in place (no re-render) so answering doesn't reshuffle earlier choices or
  // wipe their feedback; lock a stage's buttons once it's answered correctly.
  const revealStage = (key) => { const el = root.querySelector(`[data-complexity-box="${key}"]`); if (el) el.hidden = false; };
  const collapseStage = (key) => { const el = root.querySelector(`[data-complexity-box="${key}"]`); if (el) el.classList.add('solved'); };
  root.querySelectorAll('[data-complexity-work]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityWork === guide.workCorrect;
    root.querySelector('[data-complexity-feedback]').innerHTML = feedback(good ? escapeText(guide.workWhy) : 'Trace how much total work the loop or traversal can do before choosing again.', good);
    if (good) { state.complexityStage = Math.max(state.complexityStage, 1); collapseStage('work'); revealStage('memory'); }
  }));
  root.querySelectorAll('[data-complexity-memory]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityMemory === guide.memoryCorrect;
    root.querySelector('[data-memory-feedback]').innerHTML = feedback(good ? escapeText(guide.memoryWhy) : 'Consider only extra storage whose size can grow with the input.', good);
    if (good) { state.complexityStage = Math.max(state.complexityStage, 2); collapseStage('memory'); revealStage('final'); }
  }));
  root.querySelectorAll('[data-complexity-final]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityFinal === guide.finalCorrect;
    root.querySelector('[data-final-feedback]').innerHTML = feedback(good ? '✓ Correct. You combined work and memory into the final bound.' : 'Not quite. Revisit the work and memory observations, then try again.', good);
    if (good) collapseStage('final');
  }));

  root.querySelector('[data-previous-step]')?.addEventListener('click', () => { state.lessonStep = Math.max(0, state.lessonStep - 1); rerender(); });
  root.querySelector('[data-next-step]')?.addEventListener('click', () => {
    if (state.lessonStep === stepTabs.length - 1) finishLesson();
    else { state.lessonStep += 1; rerender(); }
  });
}
