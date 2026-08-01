import { languagePicker } from '../lib/ui.js';

export function renderHome(state) {
  return `<section class="home">
    <h1>Small drills.<br><em>Stronger code.</em></h1>
    <p>Choose the kind of practice that fits the time you have.</p>
    ${languagePicker(state.language)}
    <div class="mode-grid">
      <button class="mode-card primary" data-start-drills>
        <b>Code drills</b>
        <span>Randomized fill-in-the-code and code-fix reps, with just enough context to make the decision.</span>
      </button>
      <button class="mode-card" data-open-library>
        <b>Full walkthroughs</b>
        <span>Pick a problem or let Walkcode choose one, then work through recognition, design, code, complexity, and review.</span>
      </button>
    </div>
  </section>`;
}
