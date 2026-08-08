// Pure helpers for browser-history / back-button navigation. No DOM or browser globals here so
// Node can unit-test them; app.js wires these to window.history and the popstate event.

// A history-entry identity: one per screen, and one per problem on the lesson screen — so Back
// walks between visited problems (and screens), while stepping within a lesson does not add
// entries (it updates the current one in place; see historyAction).
export function routeKey(state) {
  if (state.screen === 'lesson') return `lesson:${state.currentCardId}`;
  if (state.screen === 'collection') return `collection:${state.currentCollectionId}`;
  return state.screen; // 'home' | 'library' | 'drill' | 'drill-picker'
}

// Minimal serialisable snapshot stored in history.state so a view can be restored on Back/Forward.
export function routeSnapshot(state) {
  return {
    screen: state.screen,
    currentCardId: state.currentCardId,
    lessonStep: state.lessonStep,
    walkthroughMode: state.walkthroughMode,
    walkthroughPickerOpen: state.walkthroughPickerOpen,
    drillsExpanded: state.drillsExpanded,
    walkthroughExpanded: state.walkthroughExpanded,
    collectionsExpanded: state.collectionsExpanded,
    currentCollectionId: state.currentCollectionId,
    filters: state.filters,
    randomWalkthroughHistory: state.randomWalkthroughHistory,
    randomWalkthroughIndex: state.randomWalkthroughIndex,
  };
}

// How to reflect the current route into history: the first sync replaces the initial entry, a
// changed route pushes a new entry, and an unchanged route updates the current entry in place.
export function historyAction(prevKey, nextKey) {
  if (prevKey === null || prevKey === undefined) return 'init';
  return prevKey === nextKey ? 'replace' : 'push';
}
