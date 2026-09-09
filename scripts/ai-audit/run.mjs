#!/usr/bin/env node
// Audits every AI tool on the site by calling the deployed edge functions with
// ground-truthed fixtures, then scores each response on how much of the known
// document content it actually recovered.
//
//   node scripts/ai-audit/run.mjs            # everything
//   node scripts/ai-audit/run.mjs dedicated  # only the 19 dedicated functions
//   node scripts/ai-audit/run.mjs generic    # only the 40 ai-document-tool slugs
//
// Requires VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dedicatedSpecs, genericSpecs } from './specs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });

for (const line of readFileSync(join(here, '../../.env'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const BASE = `${process.env.VITE_SUPABASE_URL}/functions/v1`;
const KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!BASE.startsWith('http') || !KEY) throw new Error('Supabase URL/key missing from .env');

const CONCURRENCY = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callFunction(fn, body, { json = false, attempt = 1 } = {}) {
  let resp;
  try {
    resp = await fetch(`${BASE}/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(body),
    });
  } catch (e) {
    if (attempt <= 3) { await sleep(2000 * attempt); return callFunction(fn, body, { json, attempt: attempt + 1 }); }
    return { ok: false, error: `network: ${e.message}`, text: '' };
  }

  if (!resp.ok) {
    const errText = await resp.text();
    if ((resp.status === 429 || resp.status >= 500) && attempt <= 4) {
      await sleep(4000 * attempt);
      return callFunction(fn, body, { json, attempt: attempt + 1 });
    }
    return { ok: false, error: `HTTP ${resp.status}: ${errText.slice(0, 300)}`, text: '' };
  }

  if (json) return { ok: true, text: await resp.text() };

  // Server-sent events, same parsing the browser client performs.
  const raw = await resp.text();
  let acc = '';
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('data: ')) continue;
    const payload = t.slice(6).trim();
    if (payload === '[DONE]') break;
    try {
      const parsed = JSON.parse(payload);
      const delta = parsed.choices?.[0]?.delta?.content;
      if (delta) acc += delta;
    } catch { /* partial frame */ }
  }
  return { ok: true, text: acc, rawLength: raw.length };
}

// Numbers with 2+ digits that appear in the output but nowhere in the input are
// claims the model could not have read anywhere: fabrications.
function inventedNumbers(output, inputText) {
  const grab = (s) => new Set((s.replace(/[,\s]/g, '').match(/\d{2,}/g) || []));
  const inInput = grab(inputText);
  const out = [...grab(output)];
  const invented = out.filter((n) => !inInput.has(n));
  return { invented: invented.length, total: out.length, samples: invented.slice(0, 12) };
}

function gradeTruth(output, truth) {
  const hits = [];
  const misses = [];
  for (const [label, re] of truth) (re.test(output) ? hits : misses).push(label);
  return { recall: truth.length ? hits.length / truth.length : 0, hits, misses };
}

function grade(spec, result, inputText) {
  if (!result.ok) {
    return { score: 0, hardFail: result.error, truth: { recall: 0, hits: [], misses: [] }, structure: { score: 0, detail: 'no response' }, halluc: { invented: 0, total: 0, samples: [] } };
  }
  const text = result.text || '';
  if (text.trim().length === 0) {
    return { score: 0, hardFail: 'empty completion', truth: { recall: 0, hits: [], misses: [] }, structure: { score: 0, detail: 'empty' }, halluc: { invented: 0, total: 0, samples: [] } };
  }
  const truth = gradeTruth(text, spec.truth);
  const structure = spec.structure(text);
  const halluc = inventedNumbers(text, inputText);
  const score = Math.round(100 * (0.7 * truth.recall + 0.3 * Math.min(1, structure.score)));
  return { score, truth, structure, halluc, chars: text.length };
}

async function runPool(items, worker) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}

const which = process.argv[2] || 'all';
const rows = [];

if (which === 'all' || which === 'dedicated') {
  console.log(`\n=== Dedicated AI functions (${dedicatedSpecs.length}) — real document text is sent ===\n`);
  await runPool(dedicatedSpecs, async (spec) => {
    const inputText = JSON.stringify(spec.body);
    const res = await callFunction(spec.fn, spec.body, { json: !!spec.json });
    const g = grade(spec, res, inputText);
    writeFileSync(join(outDir, `dedicated__${spec.id}.md`), res.text || `NO OUTPUT\n${res.error || ''}`);
    rows.push({ group: 'dedicated', id: spec.id, label: spec.label, mode: 'production', ...g });
    console.log(
      `${String(g.score).padStart(3)}  ${spec.label.padEnd(30)} ` +
      `truth ${g.truth.hits.length}/${spec.truth.length}  ${g.structure.detail}` +
      (g.hardFail ? `  !! ${g.hardFail}` : '')
    );
  });
}

if (which === 'all' || which === 'generic') {
  console.log(`\n=== ai-document-tool slugs (${genericSpecs.length}) — PRODUCTION payload (what the site sends today) ===\n`);
  await runPool(genericSpecs, async (spec) => {
    const inputText = JSON.stringify(spec.frontendBody);
    const res = await callFunction(spec.fn, spec.frontendBody);
    const g = grade(spec, res, inputText);
    writeFileSync(join(outDir, `generic_production__${spec.id}.md`), res.text || `NO OUTPUT\n${res.error || ''}`);
    rows.push({ group: 'generic-production', id: spec.id, label: spec.label, mode: 'production', ...g });
    console.log(
      `${String(g.score).padStart(3)}  ${spec.label.padEnd(32)} ` +
      `truth ${g.truth.hits.length}/${spec.truth.length}  invented numbers ${g.halluc.invented}/${g.halluc.total}  ${g.chars || 0} chars`
    );
  });

  console.log(`\n=== ai-document-tool slugs — CONTROL payload (same call, document text included) ===\n`);
  await runPool(genericSpecs, async (spec) => {
    const inputText = JSON.stringify(spec.controlBody);
    const res = await callFunction(spec.fn, spec.controlBody);
    const g = grade(spec, res, inputText);
    writeFileSync(join(outDir, `generic_control__${spec.id}.md`), res.text || `NO OUTPUT\n${res.error || ''}`);
    rows.push({ group: 'generic-control', id: spec.id, label: spec.label, mode: 'control', ...g });
    console.log(
      `${String(g.score).padStart(3)}  ${spec.label.padEnd(32)} ` +
      `truth ${g.truth.hits.length}/${spec.truth.length}  invented numbers ${g.halluc.invented}/${g.halluc.total}`
    );
  });
}

writeFileSync(join(outDir, 'results.json'), JSON.stringify(rows, null, 2));

const ranked = rows.filter((r) => r.group !== 'generic-control').sort((a, b) => a.score - b.score);
console.log('\n\n================ WORST OUTPUT FIRST ================\n');
console.log('score  tool                              truth recall  invented numbers');
for (const r of ranked) {
  console.log(
    `${String(r.score).padStart(5)}  ${r.label.padEnd(33)} ` +
    `${String(r.truth.hits.length).padStart(2)}/${String(r.truth.hits.length + r.truth.misses.length).padEnd(2)}         ` +
    `${r.halluc.invented}` + (r.hardFail ? `   !! ${r.hardFail}` : '')
  );
}

const prod = rows.filter((r) => r.group === 'generic-production');
const ctrl = rows.filter((r) => r.group === 'generic-control');
const avg = (a) => (a.length ? Math.round(a.reduce((s, x) => s + x.score, 0) / a.length) : 0);
if (prod.length) {
  console.log(`\nai-document-tool average score — production payload: ${avg(prod)} / 100`);
  console.log(`ai-document-tool average score — control payload:    ${avg(ctrl)} / 100`);
  const totalInventedProd = prod.reduce((s, x) => s + x.halluc.invented, 0);
  const totalInventedCtrl = ctrl.reduce((s, x) => s + x.halluc.invented, 0);
  console.log(`fabricated numeric claims — production: ${totalInventedProd}, control: ${totalInventedCtrl}`);
}
console.log(`\nRaw model output for every tool saved under scripts/ai-audit/out/`);
