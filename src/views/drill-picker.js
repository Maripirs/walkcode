import { difficultyTag, escapeText, filtersLink, topBar } from '../lib/ui.js';
import { TYPE_LABELS } from './drill.js';
import { DRILL_TYPES, DIFFICULTIES } from '../lib/state.js';

function typeOf(drill) {
  return drill.exercise?.type || 'fill-blank';
}

const DIFFICULTY_RANK = { Easy: 0, Medium: 1, Hard: 2 };
const TYPE_RANK = { 'fill-blank': 0, predict: 1, debug: 2, 'edge-case': 3 };
const SORT_OPTIONS = [
  ['default', 'Featured order'],
  ['name', 'Name (A–Z)'],
  ['difficulty', 'Difficulty'],
  ['type', 'Type'],
];

// Sort the (already filtered) drills. 'default' keeps the natural featured order; the others break
// ties by title then original position so same-title drills stay adjacent and in their 1-of-N order.
function sortDrills(list, sort) {
  const byName = (a, b) => a.d.title.localeCompare(b.d.title) || a.i - b.i;
  const comparators = {
    name: byName,
    difficulty: (a, b) => (DIFFICULTY_RANK[a.d.difficulty] - DIFFICULTY_RANK[b.d.difficulty]) || byName(a, b),
    type: (a, b) => (TYPE_RANK[typeOf(a.d)] - TYPE_RANK[typeOf(b.d)]) || byName(a, b),
  };
  const cmp = comparators[sort];
  if (!cmp) return list;
  return list.map((d, i) => ({ d, i })).sort(cmp).map((x) => x.d);
}

// Some problems have several drills that share a title (and often type + difficulty), so their rows
// look identical — you can't tell them apart or which is done. Number the ones that collide, e.g.
// "Contains Duplicate (1 of 2)". Computed over the FULL drill list so a drill keeps the same number
// no matter how the list is filtered. Titles with a single drill get nothing.
function drillLabels(allDrills) {
  const totals = {};
  allDrills.forEach((d) => { totals[d.title] = (totals[d.title] || 0) + 1; });
  const seen = {};
  const labels = {};
  allDrills.forEach((d) => {
    if (totals[d.title] > 1) {
      seen[d.title] = (seen[d.title] || 0) + 1;
      labels[d.id] = `${d.title} (${seen[d.title]} of ${totals[d.title]})`;
    }
  });
  return labels; // id -> disambiguated title (only for colliding titles)
}

function drillRow(drill, done, label) {
  return `<button class="problem drill-row" data-drill-id="${escapeText(drill.id)}">
    <span class="drill-row-title">${escapeText(label || drill.title)}</span>
    <span class="drill-row-type">${escapeText(TYPE_LABELS[typeOf(drill)])}</span>
    ${difficultyTag(drill.difficulty)}${done ? '<span class="pill pill-done">✓ Done</span>' : ''}
  </button>`;
}

// A short readout of the active filters, since the controls themselves now live in the Filters tab.
function filterSummary(kind, selected, all, labelFor) {
  if (!selected.length) return `${kind}: none`;
  if (selected.length === all.length) return `${kind}: all`;
  return `${kind}: ${all.filter((v) => selected.includes(v)).map(labelFor).join(', ')}`;
}

// The pick-a-drill screen (reached from the home card's "Pick or filter"). A filterable list where
// each row shows the drill's type and difficulty and whether it's done; tapping one starts there,
// or "Shuffle these" runs the whole filtered set. The filters are edited in the settings panel's
// Filters tab (the single source of truth) — this screen reads them and links there.
export function renderDrillPicker({ state, drills, isDrillSolved }) {
  const { types, difficulties } = state.filters;
  const sort = state.drillSort || 'default';
  const labels = drillLabels(drills);
  const filtered = sortDrills(drills.filter((drill) => types.includes(typeOf(drill)) && difficulties.includes(drill.difficulty)), sort);
  const doneCount = filtered.reduce((count, drill) => count + (isDrillSolved(drill.id) ? 1 : 0), 0);

  const rows = filtered.length
    ? `<div class="problem-list">${filtered.map((drill) => drillRow(drill, isDrillSolved(drill.id), labels[drill.id])).join('')}</div>`
    : '<p class="brief">No drills match your filters — widen them in Filters to see more.</p>';

  return `${topBar({ title: 'Code drills', language: state.language })}
    <section>
      <h1 class="mode-heading">Pick a drill</h1>
      <div class="picker-filters">
        <p class="picker-filter-summary">${escapeText(filterSummary('Types', types, DRILL_TYPES, (v) => TYPE_LABELS[v]))} · ${escapeText(filterSummary('Difficulty', difficulties, DIFFICULTIES, (v) => v))}</p>
        <div class="picker-filter-actions">
          ${filtersLink()}
          <label class="picker-sort">Sort <select data-drill-sort>${SORT_OPTIONS.map(([value, text]) => `<option value="${value}" ${sort === value ? 'selected' : ''}>${escapeText(text)}</option>`).join('')}</select></label>
          ${filtered.length ? '<button class="filter-shuffle" data-shuffle-filtered>Shuffle these →</button>' : ''}
        </div>
      </div>
      <p class="brief">${filtered.length} drill${filtered.length === 1 ? '' : 's'}${doneCount ? ` · ${doneCount} done` : ''} — tap one to start there.</p>
      ${rows}
    </section>`;
}
