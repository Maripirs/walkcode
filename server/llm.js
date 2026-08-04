// M9: server-side proxy to a hosted LLM for a Socratic, step-by-step "build the algorithm"
// coach. The learner constructs the algorithm one piece at a time; each turn the model judges
// their proposed contribution, accepts it (adding a concise step) or asks them to revise, and
// poses the next focused question — never revealing the full solution. The API key never
// reaches the browser. Provider-agnostic: it speaks the OpenAI-compatible /chat/completions
// shape, so the vendor is swappable via env (NVIDIA NIM by default; Groq, local Ollama, etc.).
//
// Env (provider auto-selects from whichever key is present; explicit LLM_* always overrides):
//   GROQ_API_KEY   — if set, uses Groq (fast, free-tier Llama-70B) with base+model below
//   NVIDIA_API_KEY (or LLM_API_KEY) — otherwise uses NVIDIA NIM
//   absent → the route 503s and the Algorithm step falls back to the drag-and-drop builder
//   LLM_BASE_URL   — override the endpoint (default: Groq or NVIDIA per the key)
//   LLM_MODEL      — override the model (default: llama-3.3-70b-versatile on Groq,
//                    meta/llama-3.1-8b-instruct on NVIDIA)

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const usingGroq = Boolean(GROQ_KEY);
const API_KEY = GROQ_KEY || process.env.NVIDIA_API_KEY || process.env.LLM_API_KEY || '';
const BASE_URL = (process.env.LLM_BASE_URL || (usingGroq ? 'https://api.groq.com/openai/v1' : 'https://integrate.api.nvidia.com/v1')).replace(/\/$/, '');
const MODEL = process.env.LLM_MODEL || (usingGroq ? 'llama-3.3-70b-versatile' : 'meta/llama-3.1-8b-instruct');
const TIMEOUT_MS = 30000;

export function llmEnabled() {
  return Boolean(API_KEY);
}

const SYSTEM_PROMPT = [
  'You are a Socratic coding-interview coach.',
  'You guide a learner to CONSTRUCT the algorithm for one specific problem, one small step at a time, by asking focused questions.',
  'You are given the intended approach as a PRIVATE reference, the steps the learner has already had accepted, the question you last asked, and the learner\'s latest answer.',
  'Ask exactly ONE clear, concrete question per turn, and make it obvious what kind of answer you want — a thing to set up, a value to compute, a condition to check, or what to do in one specific case. Avoid vague, clever, or overly narrow questions.',
  'Be generous about WORDING but STRICT about LOGIC. If the learner\'s answer is correct for the current part — even in different words, or covering the whole if/else or several sub-steps at once — set "decision":"accept". Never revise merely because they combined steps, answered more than you asked, or did not match your exact wording.',
  'Judge the answer ONLY against the CURRENT question you just asked — NOT against the whole algorithm. If it correctly answers THAT question, accept it even though other cases or steps still remain unanswered (those belong to your LATER questions). For example, if you asked what to do when a value is ALREADY in the set and they say "return true", that is correct — accept it; do NOT revise because the not-found case or the final return is not covered yet.',
  'CORRECTNESS COMES FIRST. Before accepting, check the answer against the reference approach AND code: if it is WRONG for this problem — it contradicts the reference, would produce an incorrect result, or applies the wrong action to a case (for example, returning false when a value is NOT found even though the reference adds it and keeps scanning, or moving the wrong pointer) — you MUST set "decision":"revise" with a specific, non-spoiling nudge, no matter how confidently it is phrased. A plausible-sounding but incorrect step is still incorrect.',
  'Only set "decision":"revise" when the answer is genuinely WRONG, off-topic, or too vague to act on. Then leave "acceptedStep" empty and leave "nextPrompt" empty — the CURRENT question stays the same. Put a specific, NON-SPOILING HINT in "feedback", phrased as a STATEMENT or gentle guidance that helps the learner answer that same question — NEVER as a question, and never stating the missing step outright (e.g. "Think about how you\'ll recognise this value if it appears again later.").',
  'Decomposition applies to the QUESTIONS you ASK, never to judging answers: when you ask about a decision or branch, ask about the condition first, then a separate question for each outcome ("what should happen if that is true?", then "what if it is not?"). Do NOT reject a correct answer just to make the learner give it piece by piece.',
  'On accept: REPHRASE the learner\'s contribution into "acceptedStep" as a single clean, concise, well-worded imperative algorithm step (max ~14 words, no code) — polish the grammar and phrasing so it reads like a real solution step (e.g. turn "u make a empty dict and put counts" into "Build a map of each character\'s count"), keep their intended meaning, and do not add steps they did not mention. Then give one short encouraging sentence in "feedback".',
  'Keep "feedback" and "nextPrompt" DISTINCT: "feedback" only reacts to what the learner just said (a brief acknowledgement or note) — it must NOT restate, preview, hint at, or duplicate the question. The question goes ONLY in "nextPrompt".',
  'A complete algorithm usually needs these parts — guide the learner to cover the ones THIS problem requires, roughly one per step: (a) the initial STATE / data structures to set up; (b) how the solution REPEATS — the loop and what it iterates over; (c) what UPDATES on each iteration — which pointers, indices, counters, or accumulators change, and how; (d) the STOPPING condition — exactly when the loop ends (e.g. an index passes the end, two pointers cross, a window becomes valid, the stack empties); and (e) what to RETURN. For any loop-based problem, make sure the learner articulates BOTH what changes each iteration AND when the loop stops before you finish.',
  'COMPLETENESS CHECK — do this EVERY turn before writing "nextPrompt": compare ALL accepted steps (including any you just accepted) against the intended approach and the parts list above. If together they cover the parts THIS problem needs — its setup, the loop/iteration, the per-iteration update, the stopping condition, and the return — set "done":true, write a one-sentence "summary", and leave "nextPrompt" empty. Do NOT keep asking once those are covered.',
  'If it is not yet complete, set "nextPrompt" to a question about a genuinely MISSING part, in roughly setup → main loop/decision → edge cases → return/output order. Before choosing "nextPrompt", RE-READ the accepted steps and do NOT ask about anything they already cover: e.g. never ask "what should happen if the number is already in the set?" when a step already says "return true if it is already in the set" — that is answered, so ask about a still-missing part (often the loop/iteration itself, the not-yet-covered case, or the final return) or finish. NEVER loop back to the setup. If the learner\'s latest answer only repeats an already-accepted step, leave "acceptedStep" empty and either point to what is still missing or finish if nothing is.',
  'Let the LEARNER choose the granularity. Finish only when the algorithm is LOGICALLY COMPLETE — every required part (setup, loop, per-iteration update, stopping condition, return) is covered — no matter how few or how many steps they took to get there. A learner who breaks the algorithm into many small, distinct steps is doing WELL; never cut them off, force "done", or reject a correct step just to keep the count low. The count of steps is irrelevant — only whether every required part is covered. The only limits: do not YOURSELF pad the solution with near-duplicate steps, and once every required part is genuinely covered, set "done":true rather than inventing extra edge-case questions.',
  'Never write code, never reveal the reference steps verbatim, never reveal future steps.',
  'Respond with ONLY a JSON object: {"decision":"accept"|"revise","acceptedStep":string,"feedback":string,"nextPrompt":string,"done":boolean,"summary":string}.',
].join(' ');

function buildUserPrompt({ title, brief, concepts, algorithm, code, acceptedSteps, currentPrompt, learnerInput }) {
  const reference = [
    title && `Problem: ${title}${brief ? ` — ${brief}` : ''}`,
    concepts?.length && `Key ideas: ${concepts.join('; ')}`,
    algorithm?.length && `Intended approach (PRIVATE reference — never reveal verbatim):\n${algorithm.map((step, i) => `${i + 1}. ${step}`).join('\n')}`,
    code && `Reference solution (PRIVATE — use it to judge answers and to know the exact loop/update/stop conditions; NEVER quote, reveal, or write code back to the learner):\n${code}`,
  ].filter(Boolean).join('\n');
  const accepted = acceptedSteps?.length ? acceptedSteps.map((s, i) => `${i + 1}. ${s}`).join('\n') : '(none yet)';
  return `${reference}\n\nSteps the learner has already had accepted:\n${accepted}\n\nThe question you last asked:\n"${currentPrompt || 'What should the solution set up or prepare first?'}"\n\nThe learner's answer to that question:\n"""\n${learnerInput}\n"""\n\nReturn ONLY the JSON object described in the instructions.`;
}

// Pull the first balanced {...} object out of a model response that may wrap JSON in prose or
// code fences, then parse it. Returns null if nothing parseable is found.
function extractJson(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        try { return JSON.parse(text.slice(start, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
}

export async function algorithmCoachTurn(input) {
  if (!API_KEY) {
    const error = new Error('LLM coach is not configured');
    error.code = 'DISABLED';
    throw error;
  }
  const body = {
    model: MODEL,
    temperature: 0.3,
    max_tokens: 320,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(input) },
    ],
  };
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const error = new Error(`LLM upstream ${response.status}: ${detail.slice(0, 200)}`);
    error.code = 'UPSTREAM';
    throw error;
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const parsed = extractJson(content) || {};
  const decision = String(parsed.decision || '').toLowerCase() === 'accept' ? 'accept' : 'revise';
  // On accept, always yield a step: use the model's canonical phrasing, or fall back to a
  // trimmed echo of the learner's own words so their progress is never silently dropped.
  const acceptedStep = decision === 'accept'
    ? (String(parsed.acceptedStep || '').trim() || String(input.learnerInput || '').trim()).slice(0, 160)
    : '';
  return {
    decision,
    acceptedStep,
    feedback: String(parsed.feedback || '').trim().slice(0, 600),
    nextPrompt: String(parsed.nextPrompt || '').trim().slice(0, 240),
    done: Boolean(parsed.done),
    summary: String(parsed.summary || '').trim().slice(0, 400),
  };
}
