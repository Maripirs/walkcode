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
