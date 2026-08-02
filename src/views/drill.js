import { difficultyTag, feedback, shuffle, topBar } from '../lib/ui.js';
import { sourceLink } from '../lib/problem-source.js';

export const MAX_DRILL_CONTEXT_LINES = 36;

// Keep the complete short solution visible without revealing the answer: the
// line the learner is working on stays blank while its surrounding code shows
// exactly where it fits.
function escapeCode(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function highlightBlank(code) {
  return escapeCode(code).replaceAll('___', '<mark class="code-blank">___</mark>');
}

function normalizeCode(code) {
  return code.replace(/\s+/g, '');
}

function escapeForPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function flexibleCodePattern(code) {
  return code.split(/(\s+)/).map((part) => (
    /^\s+$/.test(part) ? '\\s*' : escapeForPattern(part)
  )).join('');
}

function maskAnswerElsewhere(line, answer) {
  const answerPattern = new RegExp(
    `(^|[^A-Za-z0-9_$])${flexibleCodePattern(answer)}(?=$|[^A-Za-z0-9_$])`,
    'g',
  );
  const marker = '__WALKCODE_MASKED_ANSWER__';
  const masked = line.replace(answerPattern, (_, prefix) => `${prefix}${marker}`);
  return escapeCode(masked).replaceAll(marker, '<mark class="code-masked-answer">answer hidden</mark>');
}

export function redactedCodeContext(fullCode, exercise) {
  if (!fullCode || !exercise.correct) return null;

  const blankLine = exercise.code.split('\n').find((line) => line.includes('___'));
  if (!blankLine) return null;

  const [beforeBlank, afterBlank] = blankLine.split('___');
  const lines = fullCode.split('\n');
  if (lines.length > MAX_DRILL_CONTEXT_LINES) return null;
  const targetLineIndex = lines.findIndex((line) => normalizeCode(line).includes(
    normalizeCode(`${beforeBlank}${exercise.correct}${afterBlank}`),
  ));

  // Only use a real, meaningfully larger solution rather than merely a
  // related line.
  if (
    targetLineIndex < 0
    || normalizeCode(fullCode).length - normalizeCode(blankLine).length < 32
  ) return null;

  const focusPattern = new RegExp(
    `(${flexibleCodePattern(beforeBlank)})${flexibleCodePattern(exercise.correct)}(${flexibleCodePattern(afterBlank)})`,
  );
  const focusedLine = lines[targetLineIndex].replace(focusPattern, '$1___$2');
  if (focusedLine === lines[targetLineIndex]) return null;

  return lines.map((line, index) => (
    index === targetLineIndex
      ? highlightBlank(focusedLine)
      // The same value can occur elsewhere in a real solution. Keep its
      // context without quietly revealing the answer before a choice is made.
      : maskAnswerElsewhere(line, exercise.correct)
  )).join('\n');
}

function difficultyPicker(selected) {
  return `<label class="difficulty-picker">Difficulty <select data-drill-difficulty>
    ${['All', 'Easy', 'Medium', 'Hard'].map((level) => `<option value="${level}" ${selected === level ? 'selected' : ''}>${level}</option>`).join('')}
  </select></label>`;
}

function richText(value) {
  return escapeCode(value).replaceAll('\n', '<br>');
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

export function renderDrill({ state, drill, lesson, exercise }) {
  const choices = shuffle(exercise.choices);
  const codeContext = [
    drill.fullCode?.[state.language],
    lesson.code,
    lesson.complexityGuide?.code,
  ].map((source) => redactedCodeContext(source, exercise)).find(Boolean);
  return `${topBar({
    title: `Random code drill · ${state.drillIndex + 1}/${state.drillQueue.length}`,
    language: state.language,
    variant: 'drill-topbar',
    extras: difficultyPicker(state.drillDifficulty),
  })}
  <article class="drill-card">
    <div class="eyebrow">${(drill.topic || lesson.topic).toUpperCase()}</div>
    <h1>${drill.title}${difficultyTag(drill.difficulty)}</h1>
    <section class="drill-context"><b>The problem</b>
      <p>${lesson.explanation || drill.problemDescription || drill.context}</p>
    </section>
    ${problemDetails(lesson, drill)}
    <p class="drill-prompt">${exercise.prompt}</p>
    <section class="drill-code-context">
      <pre class="code drill-context-code" tabindex="0">${codeContext || highlightBlank(exercise.code)}</pre>
    </section>
    <div class="choice-list">${choices.map((choice) => `<button class="drill-choice" data-drill-choice="${encodeURIComponent(choice)}">${choice}</button>`).join('')}</div>
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
          ? `✓ Correct. ${exercise.why}`
          : `Not quite. ${exercise.wrong?.[choice] || 'That option is useful elsewhere, but it does not make this line work.'}`,
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
