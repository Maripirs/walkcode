import { includeCompletedToggle, languagePicker } from '../lib/ui.js';

// The "Code drills" card expands in place (no separate screen) into two ways to start: random reps
// — with a toggle to include already-completed drills — or the pick/filter list. `drills` carries
// the progress summary { total, solved } so the card can show it.
export function renderHome(state, drills = { total: 0, solved: 0 }) {
  const drillCard = `<div class="mode-card-group ${state.drillsExpanded ? 'expanded' : ''}">
    <button class="mode-card primary" data-toggle-drills aria-expanded="${state.drillsExpanded}">
      <b>Code drills</b>
      <span>Quick reps — fill in code, predict output, find the bug, spot the edge case.${drills.total ? ` <em class="mode-progress">${drills.solved}/${drills.total} done</em>` : ''}</span>
    </button>
    ${state.drillsExpanded ? `<div class="mode-expand">
      <button class="mode-sub" data-drills-random>
        <b>Random reps →</b><span>A shuffled mix of every drill type.</span>
      </button>
      ${includeCompletedToggle(state.includeCompleted)}
      <button class="mode-sub" data-drills-pick>
        <b>Pick or filter →</b><span>Browse drills by type and difficulty, then choose.</span>
      </button>
    </div>` : ''}
  </div>`;

  return `<section class="home">
    <h1>Small drills.<br><em>Stronger code.</em></h1>
    <p>Choose the kind of practice that fits the time you have.</p>
    ${languagePicker(state.language)}
    <div class="mode-grid">
      ${drillCard}
      <button class="mode-card" data-open-library>
        <b>Full walkthroughs</b>
        <span>Pick a problem or let Walkcode choose one, then work through recognition, design, code, complexity, and review.</span>
      </button>
    </div>
  </section>`;
}
