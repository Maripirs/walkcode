import { difficultyTag, escapeCode, escapeText, feedback, highlightBlank, richText, shuffle, topBar } from '../lib/ui.js';
import { sourceLink } from '../lib/problem-source.js';

// Full solutions shown in drills stay short so the whole thing fits on screen with one line
// blanked out. This is a content guideline (enforced by review), not a runtime gate.
export const MAX_DRILL_CONTEXT_LINES = 36;

function difficultyPicker(selected) {
  return `<label class="difficulty-picker">Difficulty <select data-drill-difficulty>
    ${['All', 'Easy', 'Medium', 'Hard'].map((level) => `<option value="${level}" ${selected === level ? 'selected' : ''}>${level}</option>`).join('')}
  </select></label>`;
}

function problemDetails(lesson, drill) {
  const details = lesson.inputOutput?.length
    ? lesson.inputOutput
    : [
      lesson.explanation || drill.problemDescription || drill.context,
      drill.context || lesson.drillContext,
    ].filter(Boolean);
  return `<details class="drill-details">
    <summary>Read more about the problem</summary>
    <div class="drill-details-body">
      <ul>${details.map((detail) => `<li>${richText(detail)}</li>`).join('')}</ul>
    </div>
  </details>`;
}

function solutionDetails(lesson) {
  const concepts = lesson.concepts?.length
    ? `<p><b>Useful ideas:</b> ${lesson.concepts.map(escapeCode).join(', ')}.</p>`
    : '';
  const steps = lesson.algorithm?.length
    ? `<ol>${lesson.algorithm.map((step) => `<li>${richText(step)}</li>`).join('')}</ol>`
    : '';
  const complexity = lesson.complexity
    ? `<p><b>Complexity:</b> ${richText(lesson.complexity)}</p>`
    : '';
  return `<details class="drill-details drill-solution-details">
    <summary>Read about the solution</summary>
    <div class="drill-details-body">
      ${concepts}${steps}${complexity}
    </div>
  </details>`;
}

// One choice button. The full line of code (or a value) is the label (escaped so it renders
// literally) and the data attribute carries it verbatim for the answer check.
function choiceButton(choice) {
  return `<button class="drill-choice" data-drill-choice="${encodeURIComponent(choice)}">${escapeCode(choice)}</button>`;
}

// A drill is one of several types (M10). Every type is still "read the code, pick a choice, get
// feedback"; they differ in what the code shows and what the choices mean:
//   fill-blank — the solution with one line blanked; choices are candidate lines. (default)
//   predict    — a complete function + a call; choices are candidate return values.
// `type` is absent on legacy drills, so it defaults to fill-blank and they render unchanged.
const TYPE_LABELS = {
  'fill-blank': 'Fill the blank',
  predict: 'Predict the output',
  debug: 'Find the bug',
};

// Debug drill (M10): a two-step card — spot the buggy line, then pick its replacement. Step 2
// stays hidden until step 1 is answered correctly (revealed in bindDebug). Both steps carry their
// own choice list + feedback slot, so this replaces the generic single choice-list for this type.
function debugBlock(exercise) {
  const lineButton = (choice, attr) => `<button class="drill-choice" data-${attr}="${encodeURIComponent(choice)}">${escapeCode(choice)}</button>`;
  return `<p class="drill-prompt">${escapeText(exercise.prompt)}</p>
    <section class="drill-code-context"><pre class="code drill-context-code" tabindex="0">${escapeCode(exercise.code)}</pre></section>
    <div class="debug-step" data-debug-step1>
      <p class="drill-choose-hint">Step 1 — which line is the bug?</p>
      <div class="choice-list">${shuffle(exercise.lineChoices).map((c) => lineButton(c, 'debug-line')).join('')}</div>
      <div data-debug-line-feedback aria-live="polite"></div>
    </div>
    <div class="debug-step" data-debug-step2 hidden>
      <p class="drill-choose-hint">Step 2 — pick the correct replacement.</p>
      <div class="choice-list">${shuffle(exercise.fixChoices).map((c) => lineButton(c, 'debug-fix')).join('')}</div>
      <div data-debug-fix-feedback aria-live="polite"></div>
    </div>`;
}

// The prompt + code + per-type hint, which is the only part of the card that varies by type.
function drillBody(exercise, language) {
  const type = exercise.type || 'fill-blank';
  const prompt = `<p class="drill-prompt">${escapeText(exercise.prompt)}</p>`;
  if (type === 'predict') {
    const call = exercise.input
      ? `<div class="drill-input"><b>Call</b><pre class="code">${escapeCode(exercise.input)}</pre></div>`
      : '';
    return `${prompt}
      <section class="drill-code-context"><pre class="code drill-context-code" tabindex="0">${escapeCode(exercise.code)}</pre></section>
      ${call}
      <p class="drill-choose-hint">Choose the value it returns.</p>`;
  }
  return `${prompt}
    <section class="drill-code-context"><pre class="code drill-context-code" tabindex="0">${highlightBlank(exercise.code, language)}</pre></section>
    <p class="drill-choose-hint">Choose the line that belongs in the blank.</p>`;
}

export function renderDrill({ state, drill, lesson, exercise }) {
  const type = exercise.type || 'fill-blank';
  const typeLabel = TYPE_LABELS[type];
  const interactive = type === 'debug'
    ? debugBlock(exercise)
    : `${drillBody(exercise, state.language)}
    <div class="choice-list">${shuffle(exercise.choices).map(choiceButton).join('')}</div>
    <div data-drill-feedback aria-live="polite"></div>`;
  return `${topBar({
    title: `Random code drill · ${state.drillIndex + 1}/${state.drillQueue.length}`,
    language: state.language,
    variant: 'drill-topbar',
    extras: difficultyPicker(state.drillDifficulty),
  })}
  <article class="drill-card">
    <div class="eyebrow">${escapeText((drill.topic || lesson.topic).toUpperCase())} · <span class="drill-type">${escapeText(typeLabel)}</span></div>
    <h1>${escapeText(drill.title)}${difficultyTag(drill.difficulty)}</h1>
    <section class="drill-context"><b>The problem</b>
      <p>${richText(lesson.explanation || drill.problemDescription || drill.context)}</p>
    </section>
    ${problemDetails(lesson, drill)}
    ${interactive}
    ${solutionDetails(lesson)}
    <div data-drill-next></div>
    ${sourceLink(drill.title)}
  </article>`;
}

// Two-step debug drill: pick the buggy line (step 1), then its fix (step 2). Step 2 unlocks only
// after step 1 is right; "Next" appears only after the fix is right. Wrong picks give feedback and
// let the learner retry.
function bindDebug(root, exercise, onNext) {
  const step1 = root.querySelector('[data-debug-step1]');
  const step2 = root.querySelector('[data-debug-step2]');
  const lineFeedback = root.querySelector('[data-debug-line-feedback]');
  const fixFeedback = root.querySelector('[data-debug-fix-feedback]');
  const nextSlot = root.querySelector('[data-drill-next]');
  const solutionDetailsElement = root.querySelector('.drill-solution-details');

  root.querySelectorAll('[data-debug-line]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.debugLine);
    const correct = choice === exercise.buggyLine;
    lineFeedback.innerHTML = feedback(
      correct
        ? `✓ That’s the bug. ${escapeText(exercise.whyLine)}`
        : `Not quite. ${escapeText(exercise.wrongLine?.[choice] || 'That line is correct as written.')}`,
      correct,
    );
    if (correct) {
      step1.querySelectorAll('[data-debug-line]').forEach((other) => { other.disabled = true; });
      step2.hidden = false;
      step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));

  root.querySelectorAll('[data-debug-fix]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.debugFix);
    const correct = choice === exercise.fix;
    fixFeedback.innerHTML = feedback(
      correct
        ? `✓ Fixed. ${escapeText(exercise.whyFix)}`
        : `Not quite. ${escapeText(exercise.wrongFix?.[choice] || 'That replacement doesn’t fix the bug.')}`,
      correct,
    );
    nextSlot.innerHTML = '';
    if (correct) {
      step2.querySelectorAll('[data-debug-fix]').forEach((other) => { other.disabled = true; });
      solutionDetailsElement.open = true;
      nextSlot.innerHTML = '<button class="drill-next" data-next-drill>Next random drill →</button>';
      nextSlot.querySelector('[data-next-drill]').addEventListener('click', onNext);
    }
  }));
}

export function bindDrillAnswer(root, exercise, onNext) {
  if ((exercise.type || 'fill-blank') === 'debug') { bindDebug(root, exercise, onNext); return; }
  const feedbackSlot = root.querySelector('[data-drill-feedback]');
  const nextSlot = root.querySelector('[data-drill-next]');
  const solutionDetailsElement = root.querySelector('.drill-solution-details');
  root.querySelectorAll('[data-drill-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = decodeURIComponent(button.dataset.drillChoice);
      const correct = choice === exercise.correct;
      feedbackSlot.innerHTML = feedback(
        correct
          ? `✓ Correct. ${escapeText(exercise.why)}`
          : `Not quite. ${escapeText(exercise.wrong?.[choice] || 'That is not the right answer for this problem.')}`,
        correct,
      );
      nextSlot.innerHTML = '';
      if (correct) {
        solutionDetailsElement.open = true;
        nextSlot.innerHTML = '<button class="drill-next" data-next-drill>Next random drill →</button>';
        nextSlot.querySelector('[data-next-drill]').addEventListener('click', onNext);
      }
      feedbackSlot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
