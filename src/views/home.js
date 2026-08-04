import { includeCompletedToggle, languagePicker } from '../lib/ui.js';

// Both mode cards expand in place (no separate screen) into their two ways to start: a random one
// — with the shared "include already completed" toggle — or the browse/pick path. `drills` carries
// the drill progress summary { total, solved } so that card can show it.
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

  const walkthroughCard = `<div class="mode-card-group ${state.walkthroughExpanded ? 'expanded' : ''}">
    <button class="mode-card" data-toggle-walkthroughs aria-expanded="${state.walkthroughExpanded}">
      <b>Full walkthroughs</b>
      <span>Understand a problem, then work recognition → design → code → complexity → review.</span>
    </button>
    ${state.walkthroughExpanded ? `<div class="mode-expand">
      <button class="mode-sub" data-random-walkthrough>
        <b>Random walkthrough →</b><span>A finished five-step problem chosen for you.</span>
      </button>
      ${includeCompletedToggle(state.includeCompleted)}
      <button class="mode-sub" data-open-library>
        <b>Pick a problem →</b><span>Browse every problem, easier to harder.</span>
      </button>
    </div>` : ''}
  </div>`;

  return `<section class="home">
    <h1>Small drills.<br><em>Stronger code.</em></h1>
    <p>Choose the kind of practice that fits the time you have.</p>
    ${languagePicker(state.language)}
    <div class="mode-grid">
      ${drillCard}
      ${walkthroughCard}
    </div>
  </section>`;
}
