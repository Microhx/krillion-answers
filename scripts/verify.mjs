#!/usr/bin/env node
/**
 * Sanity-check the generated dataset against data/manifest.json.
 */
import { readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');

const manifestPath = join(DATA, 'manifest.json');
if (!existsSync(manifestPath)) {
  console.error('data/manifest.json not found. Run `npm run export` first.');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

let failed = false;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${actual}${ok ? '' : ` (expected ${expected})`}`);
};

for (const [key, expected] of Object.entries(manifest.files)) {
  const file = key === 'jsonl_gz' ? 'krillion-answers.jsonl.gz' : 'krillion-answers.csv.gz';
  const buffer = readFileSync(join(DATA, file));
  check(`${file} bytes`, buffer.length, expected.bytes);
  check(
    `${file} sha256`,
    createHash('sha256').update(buffer).digest('hex'),
    expected.sha256,
  );
}

const jsonl = gunzipSync(readFileSync(join(DATA, 'krillion-answers.jsonl.gz'))).toString('utf8');
const lines = jsonl.split('\n').filter(Boolean);
check('answer rows', lines.length, manifest.totals.answers);

const sample = JSON.parse(lines[0]);
check('row has prompt', typeof sample.prompt === 'string' && sample.prompt.length > 0, true);
check('row has answer', typeof sample.answer === 'string' && sample.answer.length > 0, true);
if (!manifest.includes_quips) check('no quip field', 'quip' in sample, false);

const promptsCsv = readFileSync(join(DATA, 'prompts.csv'), 'utf8').trim().split('\n').length - 1;
check('prompt rows', promptsCsv, manifest.totals.prompts);

process.exit(failed ? 1 : 0);
