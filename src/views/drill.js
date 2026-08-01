import { difficultyTag, feedback, shuffle, topBar } from '../lib/ui.js';

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

function answerAppearsIn(line, answer) {
  return new RegExp(
    `(^|[^A-Za-z0-9_$])${flexibleCodePattern(answer)}(?=$|[^A-Za-z0-9_$])`,
  ).test(line);
}

export function redactedCodeContext(fullCode, exercise) {
  if (!fullCode || !exercise.correct) return null;

  const blankLine = exercise.code.split('\n').find((line) => line.includes('___'));
  if (!blankLine) return null;

  const [beforeBlank, afterBlank] = blankLine.split('___');
  const completedSnippet = normalizeCode(exercise.code.replace('___', exercise.correct));
  const lines = fullCode.split('\n');
  const compactFullCode = normalizeCode(fullCode);
  const targetLineIndex = lines.findIndex((line) => normalizeCode(line).includes(
    normalizeCode(`${beforeBlank}${exercise.correct}${afterBlank}`),
  ));

  // A reveal earns its place only when the whole completed preview is a real
  // segment of a meaningfully larger solution—not merely a related line.
  if (
    targetLineIndex < 0
    || !compactFullCode.includes(completedSnippet)
    || compactFullCode.length - completedSnippet.length < 32
    || lines.some((line, index) => index !== targetLineIndex && answerAppearsIn(line, exercise.correct))
  ) return null;

  const focusPattern = new RegExp(
    `(${flexibleCodePattern(beforeBlank)})${flexibleCodePattern(exercise.correct)}(${flexibleCodePattern(afterBlank)})`,
  );
  const focusedLine = lines[targetLineIndex].replace(focusPattern, '$1___$2');
  if (focusedLine === lines[targetLineIndex]) return null;

  return lines.map((line, index) => (
    index === targetLineIndex
      ? highlightBlank(focusedLine)
      // Eligibility already ruled out a context that would leak the answer,
      // so every surrounding line can remain exactly as authored.
      : escapeCode(line)
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
    ${codeContext ? `<details class="drill-full-code"><summary>Reveal full code context</summary>
      <p>See the surrounding method. The exact line you are solving is highlighted and stays blank.</p>
      <pre class="code">${codeContext}</pre>
    </details>` : ''}
    <div class="choice-list">${choices.map((choice) => `<button class="drill-choice" data-drill-choice="${encodeURIComponent(choice)}">${choice}</button>`).join('')}</div>
    <div data-drill-feedback></div>
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
