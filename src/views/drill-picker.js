import { difficultyTag, escapeText, topBar } from '../lib/ui.js';
import { TYPE_LABELS } from './drill.js';

const TYPE_OPTIONS = ['All', 'fill-blank', 'predict', 'debug', 'edge-case'];
const DIFFICULTY_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'];

function typeOf(drill) {
  return drill.exercise?.type || 'fill-blank';
}

function drillRow(drill, done) {
  return `<button class="problem drill-row" data-drill-id="${escapeText(drill.id)}">
    <span class="drill-row-title">${escapeText(drill.title)}</span>
    <span class="drill-row-type">${escapeText(TYPE_LABELS[typeOf(drill)])}</span>
    ${difficultyTag(drill.difficulty)}<span class="pill">${done ? 'Done' : '—'}</span>
  </button>`;
}

function select(name, options, selected, labelFor) {
  return `<select data-${name}>${options.map((value) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${escapeText(labelFor(value))}</option>`).join('')}</select>`;
}

// The pick-a-drill screen (reached from the home card's "Pick or filter"). A filterable list where
// each row shows the drill's type and difficulty and whether it's done; tapping one starts there,
// or "Shuffle these" runs the whole filtered set.
export function renderDrillPicker({ state, drills, isDrillSolved }) {
  const { difficulty, type } = state.drillFilter;
  const filtered = drills.filter((drill) => (difficulty === 'All' || drill.difficulty === difficulty)
    && (type === 'All' || typeOf(drill) === type));
  const doneCount = filtered.reduce((count, drill) => count + (isDrillSolved(drill.id) ? 1 : 0), 0);

  const rows = filtered.length
    ? `<div class="problem-list">${filtered.map((drill) => drillRow(drill, isDrillSolved(drill.id))).join('')}</div>`
    : '<p class="brief">No drills match this filter — widen it to see more.</p>';

  return `${topBar({ title: 'Code drills', language: state.language })}
    <section>
      <h1 class="mode-heading">Pick a drill</h1>
      <div class="drill-filters">
        <label>Type ${select('filter-type', TYPE_OPTIONS, type, (v) => (v === 'All' ? 'All types' : TYPE_LABELS[v]))}</label>
        <label>Difficulty ${select('filter-difficulty', DIFFICULTY_OPTIONS, difficulty, (v) => v)}</label>
        ${filtered.length ? '<button class="filter-shuffle" data-shuffle-filtered>Shuffle these →</button>' : ''}
      </div>
      <p class="brief">${filtered.length} drill${filtered.length === 1 ? '' : 's'}${doneCount ? ` · ${doneCount} done` : ''} — tap one to start there.</p>
      ${rows}
    </section>`;
}
