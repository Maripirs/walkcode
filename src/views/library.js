import { difficultyTag, languagePicker, topBar } from '../lib/ui.js';

export function renderLibrary({ state, grouped, getProgress, difficultyFor, isBuilt }) {
  const picker = state.walkthroughPickerOpen
    ? `<p class="brief">Built lessons have a complete five-step experience.</p>
       <div class="groups">${Object.entries(grouped).map(([topic, cards]) => `
         <details class="group">
           <summary>${topic}<small>${cards.length} problems</small></summary>
           ${cards.map((card) => `<button class="problem" data-card-id="${card.id}">
             ${card.title}${difficultyTag(difficultyFor(card.title))}${isBuilt(card.title) ? '<span class="authored">✓ Built</span>' : '<span class="wip-tag">Work in progress</span>'}<span class="pill">${getProgress(card.id)}</span>
           </button>`).join('')}
         </details>`).join('')}
       </div>`
    : '<p class="brief">Choose one of the two options above to begin.</p>';

  return `${topBar({ title: 'Full walkthroughs', language: state.language })}
    <section>
      <h1 class="mode-heading">How do you want to start?</h1>
      <div class="walkthrough-start">
        <button class="walkthrough-option ${state.walkthroughPickerOpen ? 'selected' : ''}" data-browse-walkthrough>
          <b>Choose a problem</b><span>Browse all problems by category.</span>
        </button>
        <button class="walkthrough-option" data-random-walkthrough>
          <b>Random walkthrough</b><span>Start a finished five-step problem chosen for you.</span>
        </button>
      </div>
      ${picker}
    </section>`;
}
