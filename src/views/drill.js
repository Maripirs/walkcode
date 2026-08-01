import { difficultyTag, feedback, shuffle, topBar } from '../lib/ui.js';
import { sourceLink } from '../lib/problem-source.js';

// The context reveal is deliberately not a solution reveal. Keep the line the
// learner is being asked about blank while leaving enough surrounding code to
// understand where it fits.
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
  const targetLineIndex = lines.findIndex((line) => normalizeCode(line).includes(
    normalizeCode(`${beforeBlank}${exercise.correct}${afterBlank}`),
  ));

  // A reveal earns its place only when the whole completed preview is a real
  // segment of a meaningfully larger solution—not merely a related line.
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
    extras: `${difficultyPicker(state.drillDifficulty)}<button class="primary" data-next-drill>Next random drill →</button>`,
  })}
  <article class="drill-card">
    <div class="eyebrow">${(drill.topic || lesson.topic).toUpperCase()}</div>
    <h1>${drill.title}${difficultyTag(drill.difficulty)}</h1>
    <section class="drill-context"><b>What these names mean</b>
      <p>${drill.context || lesson.drillContext || lesson.explanation}</p>
    </section>
    <p class="drill-prompt">${exercise.prompt}</p>
    <pre class="code">${highlightBlank(exercise.code)}</pre>
    ${codeContext ? `<details class="drill-full-code"><summary>Reveal full solution (blank preserved)</summary>
      <p>See the complete solution around this line. Your blank stays highlighted; matching answer text elsewhere is hidden too.</p>
      <pre class="code">${codeContext}</pre>
    </details>` : ''}
    <div class="choice-list">${choices.map((choice) => `<button class="drill-choice" data-drill-choice="${encodeURIComponent(choice)}">${choice}</button>`).join('')}</div>
    <div data-drill-feedback></div>
    ${sourceLink(drill.title)}
  </article>`;
}

export function bindDrillAnswer(root, exercise) {
  root.querySelectorAll('[data-drill-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = decodeURIComponent(button.dataset.drillChoice);
      const correct = choice === exercise.correct;
      root.querySelector('[data-drill-feedback]').innerHTML = feedback(
        correct
          ? `✓ Correct. ${exercise.why}`
          : `Not quite. ${exercise.wrong?.[choice] || 'That option is useful elsewhere, but it does not make this line work.'}`,
        correct,
      );
    });
  });
}
