import { difficultyTag, feedback, languagePicker, shuffle, topBar } from '../lib/ui.js';

const stepLabels = ['1 Recognize', '2 Algorithm', '3 Code fixes', '4 Complexity', '5 Review'];

function conceptOptions(lesson) {
  const choices = lesson.conceptChoices || [lesson.topic, 'Hash map', 'Two pointers', 'Dynamic programming'];
  return { correct: choices[0], choices: shuffle([...new Set(choices)]) };
}

function ensureAlgorithmState(state, lesson) {
  if (state.algorithm.available.length) return;
  const required = lesson.algorithm.map((label, index) => ({ id: `required-${index}`, label, required: true }));
  const distractors = [
    'Sort the input before deciding whether its original order matters.',
    'Store every intermediate result even when it will not be used again.',
  ];
  state.algorithm.available = shuffle([...required, { id: 'extra-0', label: distractors[0], required: false }]);
  state.algorithm.answer = [];
}

function recognitionPanel(lesson) {
  const concept = conceptOptions(lesson);
  const inputOutput = lesson.inputOutput;
  const io = inputOutput
    ? `<section class="problem-explanation"><h3>Input</h3><p>${inputOutput[0]}</p><h3>Output</h3><p>${inputOutput[1]}</p><h3>Example</h3><pre class="code">${inputOutput[2]}</pre></section>`
    : `<section class="problem-explanation"><h3>What you’re solving</h3><p>${lesson.explanation}</p></section>`;
  return `<h2>Recognize the usable structure</h2>
    ${io}
    <h3>What to notice</h3><ul>${lesson.concepts.map((item) => `<li>${item}</li>`).join('')}</ul>
    <details class="hint"><summary>Need a hint?</summary><p>Name the input’s shape first: ordered, contiguous, hierarchical, connected, or repetitive.</p></details>
    <section class="quiz"><b>Concept check</b><p>Which data structure or concept is most important for solving this problem?</p>
      <div class="choice-list">${concept.choices.map((choice) => `<button data-concept-choice="${encodeURIComponent(choice)}">${choice}</button>`).join('')}</div>
      <div data-concept-feedback></div>
    </section>`;
}

function algorithmPanel(state, lesson) {
  ensureAlgorithmState(state, lesson);
  const available = state.algorithm.available.filter((item) => !state.algorithm.answer.includes(item.id));
  const answer = state.algorithm.answer.map((id) => state.algorithm.available.find((item) => item.id === id));
  return `<h2>Build the algorithm</h2>
    <p>Move only the steps you need into your answer. Drag steps in your answer to rearrange them.</p>
    <section class="algorithm-builder">
      <div><b>Available steps</b><div class="step-bank">
        ${available.map((item) => `<button class="algorithm-candidate" data-add-step="${item.id}">${item.label}</button>`).join('') || '<p>Every available step is in your answer.</p>'}
      </div></div>
      <div><b>Your algorithm</b><div class="answer-bank" data-answer-bank>
        ${answer.map((item, index) => `<div class="answer-step" draggable="true" data-answer-step="${item.id}"><span>${index + 1}. ${item.label}</span><button aria-label="Remove step" data-remove-step="${item.id}">×</button></div>`).join('') || '<p class="empty-answer">Add the steps you believe belong in the solution.</p>'}
      </div></div>
    </section>
    <button class="primary" data-check-algorithm>Check my algorithm</button><div data-algorithm-feedback></div>`;
}

function codePanel(state, lesson) {
  if (!lesson.exercises.length) {
    return `<h2>Code fixes</h2><p>This lesson is still a draft. Its completed code exercises will be added before it earns a Built badge.</p><pre class="code">${lesson.code}</pre>`;
  }
  const index = Math.min(state.codeFixIndex, lesson.exercises.length - 1);
  const exercise = lesson.exercises[index];
  const choices = shuffle(exercise.choices);
  const last = index === lesson.exercises.length - 1;
  return `<h2>Code fix ${index + 1} of ${lesson.exercises.length}</h2>
    <p>${exercise.prompt || 'Choose the line that preserves the algorithm’s invariant.'}</p>
    <pre class="code">${exercise.code}</pre>
    <div class="choice-list">${choices.map((choice) => `<button data-code-choice="${encodeURIComponent(choice)}">${choice}</button>`).join('')}</div>
    <div data-code-feedback></div>
    <button class="primary code-continue" data-next-code hidden>${last ? 'Continue to complexity →' : 'Next code fix →'}</button>`;
}

function complexityButtons(attribute, choices) {
  return `<div class="choice-list">${shuffle(choices).map(([id, label]) => `<button ${attribute}="${id}">${label}</button>`).join('')}</div>`;
}

function complexityPanel(state, lesson) {
  const guide = lesson.complexityGuide;
  if (!guide) return `<h2>Analyze the complexity</h2><pre class="code">${lesson.code}</pre><p>${lesson.complexity}</p><details class="hint"><summary>How to verify it</summary><p>Count total input work, then identify extra memory that can grow with the input.</p></details>`;
  const work = `<section class="complexity-step"><b>1. Count the work</b><p>${guide.work}</p>${complexityButtons('data-complexity-work', guide.workChoices)}<div data-complexity-feedback></div></section>`;
  const memory = state.complexityStage >= 1 ? `<section class="complexity-step"><b>2. Count extra memory</b><p>${guide.memory}</p>${complexityButtons('data-complexity-memory', guide.memoryChoices)}<div data-memory-feedback></div></section>` : '';
  const final = state.complexityStage >= 2 ? `<section class="complexity-step"><b>3. State the complexity</b><p>Combine your two observations.</p>${complexityButtons('data-complexity-final', guide.final)}<div data-final-feedback></div></section>` : '';
  return `<h2>Analyze the complexity</h2><p>Use the completed solution to derive the bound.</p><pre class="code">${lesson.code}</pre>${work}${memory}${final}`;
}

function reviewPanel(lesson) {
  return `<h2>Review</h2>
    <section class="problem-explanation"><h3>The key idea</h3><p>${lesson.concepts[0] || lesson.topic}</p>
      <h3>Why it fits</h3><p>${lesson.explanation}</p>
      <h3>Remember</h3><ul>${lesson.fixes.map((item) => `<li>${item}</li>`).join('')}</ul>
      <h3>Complexity</h3><p>${lesson.complexity}</p>
    </section>
    <details class="hint"><summary>Optional solution walkthrough</summary><ol>${lesson.algorithm.map((item) => `<li>${item}</li>`).join('')}</ol><pre class="code">${lesson.code}</pre></details>`;
}

export function renderLesson({ state, card, lesson, difficulty, randomNavigation = null }) {
  const panels = [
    () => recognitionPanel(lesson),
    () => algorithmPanel(state, lesson),
    () => codePanel(state, lesson),
    () => complexityPanel(state, lesson),
    () => reviewPanel(lesson),
  ];
  const panel = panels[state.lessonStep]();
  const previous = randomNavigation
    ? `<button data-previous-problem ${randomNavigation.canGoBack ? '' : 'disabled'}>← Previous random</button>`
    : '<button data-previous-problem>← Previous</button>';
  const next = randomNavigation
    ? '<button class="primary" data-next-problem>Next random problem →</button>'
    : '<button class="primary" data-next-problem>Next problem →</button>';
  return `${topBar({ title: `${cardIndexLabel(card)} of 150`, language: state.language, previous, next })}
    <article class="lesson"><div class="eyebrow">${card.topic.toUpperCase()}${lesson.isBuilt ? ' · ✓ BUILT' : ''}</div>
      <h1>${card.title}${difficultyTag(difficulty)}</h1>
      ${lesson.isBuilt ? '' : '<aside class="wip-banner"><b>Work in progress</b><p>This is a starter outline, not a finished walkthrough. Its explanations and exercises are still being authored.</p></aside>'}
      <div class="stages">${stepLabels.map((label, index) => `<button class="stage ${state.lessonStep === index ? 'active' : ''}" data-lesson-step="${index}">${label}</button>`).join('')}</div>
      <section class="content">${panel}</section>
      ${state.lessonStep === 2 && lesson.exercises.length ? '' : `<div class="bottom"><button data-previous-step ${state.lessonStep === 0 ? 'disabled' : ''}>← Previous step</button><button class="next" data-next-step>${state.lessonStep === 4 ? 'Finish lesson ✓' : 'Next step →'}</button></div>`}
    </article>`;
}

function cardIndexLabel(card) {
  return card.position ? String(card.position) : 'Walkthrough';
}

export function bindLesson(root, { state, lesson, rerender, finishLesson }) {
  root.querySelectorAll('[data-concept-choice]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.conceptChoice);
    const correct = (lesson.conceptChoices || [lesson.topic])[0];
    root.querySelector('[data-concept-feedback]').innerHTML = feedback(
      choice === correct
        ? `✓ Correct. ${correct} is the central tool for this problem.`
        : `${choice} can be useful on other problems, but it does not match this input’s structure.`,
      choice === correct,
    );
  }));

  root.querySelectorAll('[data-add-step]').forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.addStep;
    if (!state.algorithm.answer.includes(id)) state.algorithm.answer.push(id);
    rerender();
  }));
  root.querySelectorAll('[data-remove-step]').forEach((button) => button.addEventListener('click', () => {
    state.algorithm.answer = state.algorithm.answer.filter((id) => id !== button.dataset.removeStep);
    rerender();
  }));
  root.querySelectorAll('[data-answer-step]').forEach((step) => {
    step.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', step.dataset.answerStep));
    step.addEventListener('dragover', (event) => event.preventDefault());
    step.addEventListener('drop', (event) => {
      event.preventDefault();
      const moved = event.dataTransfer.getData('text/plain');
      const target = step.dataset.answerStep;
      if (!moved || moved === target) return;
      const ids = state.algorithm.answer.filter((id) => id !== moved);
      ids.splice(ids.indexOf(target), 0, moved);
      state.algorithm.answer = ids;
      rerender();
    });
  });
  root.querySelector('[data-check-algorithm]')?.addEventListener('click', () => {
    const required = lesson.algorithm.map((_, index) => `required-${index}`);
    const answer = state.algorithm.answer;
    const missing = required.filter((id) => !answer.includes(id)).length;
    const extra = answer.filter((id) => !required.includes(id)).length;
    const wrongOrder = !missing && !extra && answer.some((id, index) => id !== required[index]);
    const message = !missing && !extra && !wrongOrder
      ? '✓ Nice work. Those are the needed steps in a valid order.'
      : [missing && `Missing step${missing > 1 ? 's' : ''}: ${missing}.`, extra && `Extra step${extra > 1 ? 's' : ''}: ${extra}.`, wrongOrder && 'The needed steps are in the wrong order.'].filter(Boolean).join(' ');
    root.querySelector('[data-algorithm-feedback]').innerHTML = feedback(message, !missing && !extra && !wrongOrder);
  });

  const exercise = lesson.exercises[state.codeFixIndex];
  root.querySelectorAll('[data-code-choice]').forEach((button) => button.addEventListener('click', () => {
    const choice = decodeURIComponent(button.dataset.codeChoice);
    const correct = choice === exercise.correct;
    root.querySelector('[data-code-feedback]').innerHTML = feedback(correct
      ? `✓ Correct. ${exercise.why}`
      : `Not quite. ${exercise.wrong?.[choice] || 'That choice does not make this line work for this problem.'}`,
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
    root.querySelector('[data-complexity-feedback]').innerHTML = feedback(good ? guide.workWhy : 'Trace how much total work the loop or traversal can do before choosing again.', good);
    if (good) { state.complexityStage = 1; rerender(); }
  }));
  root.querySelectorAll('[data-complexity-memory]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityMemory === guide.memoryCorrect;
    root.querySelector('[data-memory-feedback]').innerHTML = feedback(good ? guide.memoryWhy : 'Consider only extra storage whose size can grow with the input.', good);
    if (good) { state.complexityStage = 2; rerender(); }
  }));
  root.querySelectorAll('[data-complexity-final]').forEach((button) => button.addEventListener('click', () => {
    const good = button.dataset.complexityFinal === guide.finalCorrect;
    root.querySelector('[data-final-feedback]').innerHTML = feedback(good ? '✓ Correct. You combined work and memory into the final bound.' : 'Not quite. Revisit the work and memory observations, then try again.', good);
  }));

  root.querySelector('[data-previous-step]')?.addEventListener('click', () => { state.lessonStep = Math.max(0, state.lessonStep - 1); rerender(); });
  root.querySelector('[data-next-step]')?.addEventListener('click', () => {
    if (state.lessonStep === 4) finishLesson();
    else { state.lessonStep += 1; rerender(); }
  });
}
