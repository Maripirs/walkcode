// Build a whole-line drill's shown code: replace the one line whose trimmed text equals
// `correct` with an indentation-preserving blank (`___`). Throws if the line is absent — the
// drill validator relies on that. Because the blank is derived from the real solution, the
// correct line is never shown elsewhere and the answer can't leak.
export function blankLine(fullCode, correct) {
  const lines = fullCode.split('\n');
  const index = lines.findIndex((line) => line.trim() === correct.trim());
  if (index === -1) throw new Error(`drill blank line not found: ${JSON.stringify(correct)}`);
  const indent = lines[index].slice(0, lines[index].length - lines[index].trimStart().length);
  lines[index] = `${indent}___`;
  return lines.join('\n');
}

// Generic, non-revealing feedback for the wrong choices when a drill doesn't supply its own.
export function genericWrong(choices, correct) {
  return Object.fromEntries(choices
    .filter((choice) => choice !== correct)
    .map((choice) => [choice, 'That line changes behavior the surrounding code relies on here.']));
}
