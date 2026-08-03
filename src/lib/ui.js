// Escape code so it renders literally inside HTML (drills show real source lines that can
// contain <, >, &, ").
export function escapeCode(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Escape prose before interpolating it into markup. Content is authored, but since M5 the DB
// is a supported authoring path (a row can be written directly), so user-facing text now
// crosses a trust boundary and must be escaped like any untrusted string.
export function escapeText(value) {
  return escapeCode(value).replaceAll("'", '&#39;');
}

// Escaped prose that keeps authored line breaks (used for multi-line explanations/examples).
export function richText(value) {
  return escapeText(value).replaceAll('\n', '<br>');
}

// Render a code block with the blanked line shown as a placeholder comment (in the code's own
// comment style), so it's clear an entire line goes there, not just a token.
export function highlightBlank(code, language) {
  const comment = language === 'Python' ? '#' : '//';
  return escapeCode(code).split('\n').map((line) => {
    if (line.trim() !== '___') return line;
    const indent = line.slice(0, line.length - line.trimStart().length);
    return `${indent}<mark class="code-blank">${comment} Pick the right code to go here</mark>`;
  }).join('\n');
}

export function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function languagePicker(language) {
  return `<label class="language-picker">Code language <select data-language>
    <option value="JavaScript" ${language === 'JavaScript' ? 'selected' : ''}>JavaScript</option>
    <option value="Python" ${language === 'Python' ? 'selected' : ''}>Python</option>
  </select></label>`;
}

export function difficultyTag(difficulty) {
  return `<span class="difficulty ${difficulty.toLowerCase()}">${difficulty}</span>`;
}

export function feedback(message, good) {
  return `<p class="answer-feedback ${good ? 'good' : 'bad'}">${message}</p>`;
}

export function topBar({ title, language, previous = '', next = '', extras = '', variant = '' }) {
  return `<nav class="topbar ${variant}">
    <button data-home>Home</button>
    <span><b>${title}</b></span>
    ${languagePicker(language)}
    ${previous}
    ${next}
    ${extras}
  </nav>`;
}
