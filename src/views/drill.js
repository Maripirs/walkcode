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

// One choice button. The full line of code is the label (escaped so it renders literally) and
// the data attribute carries it verbatim for the answer check.
function choiceButton(choice) {
  return `<button class="drill-choice" data-drill-choice="${encodeURIComponent(choice)}">${escapeCode(choice)}</button>`;
}

export function renderDrill({ state, drill, lesson, exercise }) {
  const choices = shuffle(exercise.choices);
  return `${topBar({
    title: `Random code drill · ${state.drillIndex + 1}/${state.drillQueue.length}`,
    language: state.language,
    variant: 'drill-topbar',
    extras: difficultyPicker(state.drillDifficulty),
  })}
  <article class="drill-card">
    <div class="eyebrow">${escapeText((drill.topic || lesson.topic).toUpperCase())}</div>
    <h1>${escapeText(drill.title)}${difficultyTag(drill.difficulty)}</h1>
    <section class="drill-context"><b>The problem</b>
      <p>${richText(lesson.explanation || drill.problemDescription || drill.context)}</p>
    </section>
    ${problemDetails(lesson, drill)}
    <p class="drill-prompt">${escapeText(exercise.prompt)}</p>
    <section class="drill-code-context">
      <pre class="code drill-context-code" tabindex="0">${highlightBlank(exercise.code, state.language)}</pre>
    </section>
    <p class="drill-choose-hint">Choose the line that belongs in the blank.</p>
    <div class="choice-list">${choices.map(choiceButton).join('')}</div>
    <div data-drill-feedback aria-live="polite"></div>
    ${solutionDetails(lesson)}
    <div data-drill-next></div>
    ${sourceLink(drill.title)}
  </article>`;
}

export function bindDrillAnswer(root, exercise, onNext) {
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
          : `Not quite. ${escapeText(exercise.wrong?.[choice] || 'That line does not preserve what this step needs.')}`,
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
