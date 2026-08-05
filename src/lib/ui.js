import { indentOf, isBlank } from '../data/blank-line.js';

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
    if (!isBlank(line)) return line;
    return `${indentOf(line)}<mark class="code-blank">${comment} Pick the right code to go here</mark>`;
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

export function difficultyTag(difficulty) {
  return `<span class="difficulty ${difficulty.toLowerCase()}">${difficulty}</span>`;
}

// Link that opens the settings panel on its Filters tab (M11). The Filters tab is the single source
// of truth for include-completed / drill types / difficulty, so the home chooser and drill picker
// point here instead of carrying their own inline controls. Bound via [data-open-filters].
export function filtersLink(label = 'Adjust in Filters') {
  return `<button class="filters-link" data-open-filters>${escapeText(label)} →</button>`;
}

export function feedback(message, good) {
  return `<p class="answer-feedback ${good ? 'good' : 'bad'}">${message}</p>`;
}

// Minimal line-art gear (Feather "settings"). `stroke="currentColor"` so it takes the button's
// themed color instead of the multi-color emoji glyph.
const GEAR_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

// Minimal line-art house (Feather "home"), same currentColor treatment as the gear.
const HOME_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

// The settings gear, reused by the top bar and the home screen (which has no top bar). Language
// now lives in the settings panel, so it is no longer in the bar.
export function settingsGear() {
  return `<button class="gear icon-btn" data-settings-toggle aria-label="Settings" title="Settings">${GEAR_SVG}</button>`;
}

// The bare gear glyph (no button) — used as the settings panel's header mark so the header doesn't
// repeat the word "Settings" already shown on the tab below it.
export function gearGlyph() {
  return GEAR_SVG;
}

export function topBar({ title, previous = '', next = '', extras = '', variant = '' }) {
  return `<nav class="topbar ${variant}">
    <button data-home class="icon-btn" aria-label="Home" title="Home">${HOME_SVG}</button>
    <span><b>${title}</b></span>
    ${settingsGear()}
    ${previous}
    ${next}
    ${extras}
  </nav>`;
}
