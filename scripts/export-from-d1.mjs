#!/usr/bin/env node
/**
 * Export the Krillion answers dataset from a Cloudflare D1 database.
 *
 *   node scripts/export-from-d1.mjs                # published fields only
 *   node scripts/export-from-d1.mjs --with-quips   # also include quip text
 *
 * Requires wrangler auth (`npx wrangler login`) and access to the D1 database.
 * Override the database name with KRILLION_D1_NAME.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const DB = process.env.KRILLION_D1_NAME || 'krillion-answers';
const WITH_QUIPS = process.argv.includes('--with-quips');
const PAGE = 20000;

const TIER_LABEL = {
  krillion: 'One in a Krillion',
  deepcut: 'Deep Cut',
  rare: 'Rare',
  schooler: 'Schooler',
  tooclever: 'Too Clever',
  plankton: 'Plankton',
};

function queryOnce(sql) {
  const out = execFileSync(
    'npx',
    ['wrangler', 'd1', 'execute', DB, '--remote', '--json', '--command', sql],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 512, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const lines = out.split('\n');
  const start = lines.findIndex((line) => line.trim() === '[');
  if (start === -1) throw new Error(`Could not parse D1 output:\n${out.slice(0, 500)}`);
  return JSON.parse(lines.slice(start).join('\n'))[0].results;
}

function query(sql, attempts = 6) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return queryOnce(sql);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const wait = attempt * 2000;
        process.stderr.write(`  retry ${attempt}/${attempts - 1} after ${wait}ms\n`);
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
      }
    }
  }
  throw lastError;
}

function slug(text) {
  const base = String(text || '')
    .toLowerCase()
    .replace(/^name\s+(an?|the)\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return base || 'prompt';
}

const csvCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

console.log(`Exporting from D1 database "${DB}"${WITH_QUIPS ? ' (with quips)' : ''}...`);

const prompts = query(
  'SELECT id, mode, game_id, round, text, category FROM prompts ORDER BY mode, game_id, round',
);
const range = query('SELECT MIN(id) AS min, MAX(id) AS max, COUNT(*) AS n FROM answers')[0];

const answers = [];
for (let lo = 1; lo <= range.max; lo += PAGE) {
  const hi = lo + PAGE - 1;
  const rows = query(
    `SELECT id, prompt_id, answer, tier, score${WITH_QUIPS ? ', quip' : ''}
     FROM answers WHERE id BETWEEN ${lo} AND ${hi} ORDER BY id`,
  );
  answers.push(...rows);
  process.stdout.write(`  answers ${Math.min(answers.length, range.n)}/${range.n}\r`);
}
process.stdout.write('\n');

const byId = new Map(prompts.map((p) => [p.id, p]));
const rows = [];
for (const answer of answers) {
  const prompt = byId.get(answer.prompt_id);
  if (!prompt) continue;
  const row = {
    mode: prompt.mode,
    game_id: prompt.game_id,
    round: prompt.round,
    prompt: prompt.text,
    category: prompt.category ?? null,
    answer: answer.answer,
    tier: answer.tier,
    score: answer.score,
  };
  if (WITH_QUIPS) row.quip = answer.quip ?? null;
  rows.push(row);
}

const rank = { krillion: 0, deepcut: 1, rare: 2, schooler: 3, tooclever: 4, plankton: 5 };
rows.sort(
  (a, b) =>
    a.mode.localeCompare(b.mode) ||
    a.game_id.localeCompare(b.game_id) ||
    a.round - b.round ||
    (rank[a.tier] ?? 9) - (rank[b.tier] ?? 9) ||
    a.answer.localeCompare(b.answer),
);

rmSync(DATA, { recursive: true, force: true });
mkdirSync(join(DATA, 'daily'), { recursive: true });

// 1. Machine-readable flat files.
const jsonl = rows.map((row) => JSON.stringify(row)).join('\n') + '\n';
const jsonlGz = gzipSync(Buffer.from(jsonl), { level: 9 });
writeFileSync(join(DATA, 'krillion-answers.jsonl.gz'), jsonlGz);

const columns = ['mode', 'game_id', 'round', 'prompt', 'category', 'answer', 'tier', 'score'];
if (WITH_QUIPS) columns.push('quip');
const csv = [columns.join(',')]
  .concat(rows.map((row) => columns.map((key) => csvCell(row[key])).join(',')))
  .join('\n') + '\n';
const csvGz = gzipSync(Buffer.from(csv), { level: 9 });
writeFileSync(join(DATA, 'krillion-answers.csv.gz'), csvGz);

writeFileSync(
  join(DATA, 'prompts.csv'),
  ['mode,game_id,round,category,prompt']
    .concat(prompts.map((p) => [p.mode, p.game_id, p.round, p.category ?? '', p.text].map(csvCell).join(',')))
    .join('\n') + '\n',
);

// 2. Human-readable tree: one folder per game/date, one file per prompt.
const groups = new Map();
for (const prompt of prompts) {
  const key = `${prompt.mode}/${prompt.game_id}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(prompt);
}

const files = [];
const generatedAt = new Date().toISOString();
let fileCount = 0;

for (const [key, group] of groups) {
  const [mode, gameId] = key.split('/');
  const dir = mode === 'daily'
    ? join(DATA, 'daily', gameId)
    : join(DATA, 'games', mode, gameId);
  mkdirSync(dir, { recursive: true });

  const used = new Set();
  const perPrompt = [];

  for (const prompt of group.sort((a, b) => a.round - b.round)) {
    const promptRows = rows.filter(
      (row) => row.mode === prompt.mode && row.game_id === prompt.game_id && row.round === prompt.round,
    );
    let name = `${String(prompt.round).padStart(2, '0')}-${slug(prompt.text)}`;
    let candidate = name;
    let suffix = 2;
    while (used.has(candidate)) candidate = `${name}-${suffix++}`;
    used.add(candidate);
    name = candidate;

    const body = [
      prompt.text,
      `Category: ${prompt.category ?? 'unknown'}`,
      `Answers: ${promptRows.length}`,
      '',
      ...promptRows.map(
        (row) => `${row.answer} — ${TIER_LABEL[row.tier] ?? row.tier} (${row.score})`,
      ),
      '',
    ].join('\n');
    writeFileSync(join(dir, `${name}.txt`), body);

    // Folder variant: one directory per prompt, original text inside prompt.txt.
    const promptDir = join(dir, name);
    mkdirSync(promptDir, { recursive: true });
    writeFileSync(join(promptDir, 'prompt.txt'), `${prompt.text}\n`);
    writeFileSync(
      join(promptDir, 'answers.txt'),
      promptRows
        .map((row) => `${row.answer} — ${TIER_LABEL[row.tier] ?? row.tier} (${row.score})`)
        .join('\n') + '\n',
    );
    const tiers = {};
    for (const row of promptRows) tiers[row.tier] = (tiers[row.tier] || 0) + 1;
    writeFileSync(
      join(promptDir, 'meta.json'),
      JSON.stringify(
        {
          prompt: prompt.text,
          category: prompt.category ?? null,
          round: prompt.round,
          answers: promptRows.length,
          tiers,
        },
        null,
        2,
      ) + '\n',
    );

    fileCount += 4;
    perPrompt.push({ round: prompt.round, file: `${name}.txt`, folder: name, prompt: prompt.text, answers: promptRows.length });
  }

  const categories = {};
  for (const item of perPrompt) {
    const cat = group.find((p) => p.round === item.round)?.category ?? null;
    if (cat) categories[cat] = (categories[cat] || 0) + 1;
  }

  const meta = {
    mode,
    game_id: gameId,
    rounds: perPrompt.length,
    answers: perPrompt.reduce((sum, item) => sum + item.answers, 0),
    categories,
    prompts: perPrompt,
    generated_at: generatedAt,
  };
  writeFileSync(join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  fileCount += 1;
}

// 3. Manifest.
const manifest = {
  schema_version: 1,
  generated_at: generatedAt,
  source: 'Krillion public reveal data',
  includes_quips: WITH_QUIPS,
  totals: {
    prompts: prompts.length,
    answers: rows.length,
    games: groups.size,
    files: fileCount,
  },
  files: {
    jsonl_gz: { bytes: jsonlGz.length, sha256: sha256(jsonlGz) },
    csv_gz: { bytes: csvGz.length, sha256: sha256(csvGz) },
  },
};
writeFileSync(join(DATA, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(
  `Done. ${prompts.length} prompts, ${rows.length} answers, ${groups.size} games, ${fileCount} tree files.`,
);
console.log(`  data/krillion-answers.jsonl.gz  ${(jsonlGz.length / 1048576).toFixed(1)} MB`);
console.log(`  data/krillion-answers.csv.gz    ${(csvGz.length / 1048576).toFixed(1)} MB`);

const { updateReadme } = await import('./build-readme-index.mjs');
updateReadme();
console.log('  README daily index updated');
