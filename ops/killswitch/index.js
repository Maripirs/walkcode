// Walkcode billing kill-switch (M8).
//
// A Gen2 Cloud Function subscribed (via Eventarc) to the Pub/Sub topic that the
// Cloud Billing budget publishes to. When ACTUAL spend on the project reaches the
// budget cap it DISABLES billing on the whole project — a true hard "$0 can never be
// exceeded" guarantee. The tradeoff, by design: the DB VM and the Cloud Run site go
// offline when this fires. Re-enabling is a manual, deliberate step (see docs/RUNBOOK.md).
//
// It ignores forecast-only and sub-100% threshold notifications — it only pulls the
// plug when real cost has met or passed the budget amount.

const functions = require('@google-cloud/functions-framework');
const { GoogleAuth } = require('google-auth-library');

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
const PROJECT_NAME = `projects/${PROJECT_ID}`;

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-billing'],
});

functions.cloudEvent('killSwitch', async (cloudEvent) => {
  const msg = cloudEvent?.data?.message;
  if (!msg?.data) {
    console.log('No Pub/Sub message payload; nothing to do.');
    return;
  }

  let budget;
  try {
    budget = JSON.parse(Buffer.from(msg.data, 'base64').toString('utf8'));
  } catch (err) {
    console.error('Could not parse budget notification JSON:', err);
    return;
  }

  const cost = Number(budget.costAmount);
  const cap = Number(budget.budgetAmount);
  console.log(`Budget "${budget.budgetDisplayName}": cost=${cost} cap=${cap} ${budget.currencyCode || ''}`.trim());

  // Only act on real spend reaching the cap. Warning thresholds (50/90%) and
  // forecast alerts fall through here as no-ops — they still email billing admins.
  if (!(cost >= cap) || !Number.isFinite(cost) || !Number.isFinite(cap)) {
    console.log('Under cap (or a forecast/warning alert) — no action.');
    return;
  }

  const client = await auth.getClient();
  const base = 'https://cloudbilling.googleapis.com/v1';

  // Is billing currently enabled? (Avoid a redundant write / log if already off.)
  const info = await client.request({ url: `${base}/${PROJECT_NAME}/billingInfo` });
  if (info.data.billingEnabled === false) {
    console.log('Billing already disabled — nothing to do.');
    return;
  }

  // Disable billing by clearing the billing account association.
  await client.request({
    url: `${base}/${PROJECT_NAME}/billingInfo`,
    method: 'PUT',
    data: { billingAccountName: '' },
  });

  console.error(`KILL SWITCH FIRED: billing DISABLED on ${PROJECT_NAME} (cost ${cost} >= cap ${cap}).`);
});
