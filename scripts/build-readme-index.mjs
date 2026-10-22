#!/usr/bin/env node
/**
 * Regenerate the "Daily index" table inside README.md from the meta.json file
 * of each folder under data/daily/.
 *
 *   node scripts/build-readme-index.mjs
 *
 * Safe to run without database access. Runs automatically at the end of the
 * export by importing this module.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAILY = join(ROOT, 'data', 'daily');
const README = join(ROOT, 'README.md');
const START = '<!-- daily-index:start -->';
const END = '<!-- daily-index:end -->';

const num = (value) => Number(value).toLocaleString('en-US');

export function buildDailyIndex() {
  if (!existsSync(DAILY)) return '';

  const entries = [];
  for (const name of readdirSync(DAILY)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(name)) continue;
    const metaPath = join(DAILY, name, 'meta.json');
    if (!existsSync(metaPath)) continue;
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    entries.push({ date: name, rounds: meta.rounds, answers: meta.answers });
  }
  entries.sort((a, b) => b.date.localeCompare(a.date));

  const totalAnswers = entries.reduce((sum, item) => sum + item.answers, 0);
  const lines = [
    `${entries.length} dates · ${num(totalAnswers)} answers. Newest first.`,
    '',
    '| Date | Prompts | Answers |',
    '|---|---:|---:|',
    ...entries.map(
      (item) => `| [${item.date}](data/daily/${item.date}/) | ${item.rounds} | ${num(item.answers)} |`,
    ),
  ];
  return lines.join('\n');
}

export function updateReadme() {
  if (!existsSync(README)) return;
  const index = buildDailyIndex();
  const source = readFileSync(README, 'utf8');
  const start = source.indexOf(START);
  const end = source.indexOf(END);
  if (start === -1 || end === -1 || end < start) return;
  const next =
    source.slice(0, start + START.length) +
    '\n' +
    index +
    '\n' +
    source.slice(end);
  writeFileSync(README, next);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  updateReadme();
  console.log('README daily index updated.');
}
