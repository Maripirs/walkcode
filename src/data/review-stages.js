// The five walkthrough stages, in order — the single source shared by the server (review records in
// db.js) and the client (the lesson stepper tabs in views/lesson.js). A problem publishes only when
// all five are approved; a rejected stage blocks it. Pure, so both Node and the browser can import it.
export const REVIEW_STEP_LABELS = ['Understand', 'Algorithm', 'Code', 'Complexity', 'Review'];
export const REVIEW_STEPS = REVIEW_STEP_LABELS.map((label) => label.toLowerCase());
