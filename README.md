# Krillion Answers Dataset

A structured, machine-readable dataset of **prompts and accepted answers** from
the daily trivia game *Krillion*, built from publicly available reveal data.

> **Not official.** This project is not affiliated with, endorsed by, or
> operated by the publisher of Krillion. Play the real game at
> [krillion.io](https://krillion.io). Read [DATA-NOTICE.md](./DATA-NOTICE.md)
> before redistributing.

## What is inside

| Thing | Count |
|---|---|
| Prompts | see `data/manifest.json` |
| Accepted answers | see `data/manifest.json` |
| Games / dates | see `data/manifest.json` |

Each answer row carries the prompt it belongs to, its rarity tier, its point
value, the game mode and the prompt's topic category. The publisher's authored
"quip" text is **excluded** from the published dataset.

## Files

```
data/
├── krillion-answers.jsonl.gz   one JSON object per line (recommended)
├── krillion-answers.csv.gz     same rows as CSV
├── prompts.csv                 one row per prompt
├── manifest.json               counts, byte sizes, sha256
├── daily/
│   └── YYYY-MM-DD/
│       ├── meta.json
│       ├── 01-<slug>.txt         one file per prompt
│       ├── 01-<slug>/            and one folder per prompt
│       │   ├── prompt.txt        exact prompt text
│       │   ├── answers.txt       one answer per line
│       │   └── meta.json         category, round, tier counts
│       └── ...
└── games/
    ├── unlimited/<game>/
    ├── movies/<game>/
    ├── sports/<game>/
    └── geography/<game>/
```

### Row fields

| Field | Type | Notes |
|---|---|---|
| `mode` | string | `daily`, `unlimited`, `movies`, `sports`, `geography` |
| `game_id` | string | `YYYY-MM-DD` for daily, otherwise the game number |
| `round` | number | 1–7 |
| `prompt` | string | the question text |
| `category` | string\|null | topic, e.g. `Animals & Nature` |
| `answer` | string | an accepted answer |
| `tier` | string | `krillion`, `deepcut`, `rare`, `schooler`, `tooclever`, `plankton` |
| `score` | number | 100, 85, 60, 30, 15 or 10 |

### Tier scale

| `tier` | Label | Points |
|---|---|---|
| `krillion` | One in a Krillion | 100 |
| `deepcut` | Deep Cut | 85 |
| `rare` | Rare | 60 |
| `schooler` | Schooler | 30 |
| `tooclever` | Too Clever | 15 |
| `plankton` | Plankton | 10 |

## Daily index

Every Daily Dive, newest first. Each link opens that date's folder on GitHub,
where every prompt has both a `.txt` file and a folder of its own.

<!-- daily-index:start -->
112 dates · 832,576 answers. Newest first.

| Date | Prompts | Answers |
|---|---:|---:|
| [2026-11-04](data/daily/2026-11-04/) | 7 | 30,015 |
| [2026-11-03](data/daily/2026-11-03/) | 7 | 102,243 |
| [2026-11-02](data/daily/2026-11-02/) | 7 | 122,994 |
| [2026-11-01](data/daily/2026-11-01/) | 7 | 28,742 |
| [2026-10-31](data/daily/2026-10-31/) | 7 | 7,966 |
| [2026-10-30](data/daily/2026-10-30/) | 7 | 31,361 |
| [2026-10-29](data/daily/2026-10-29/) | 7 | 16,727 |
| [2026-10-28](data/daily/2026-10-28/) | 7 | 4,312 |
| [2026-10-27](data/daily/2026-10-27/) | 7 | 4,134 |
| [2026-10-26](data/daily/2026-10-26/) | 7 | 12,583 |
| [2026-10-25](data/daily/2026-10-25/) | 7 | 13,606 |
| [2026-10-24](data/daily/2026-10-24/) | 7 | 32,301 |
| [2026-10-23](data/daily/2026-10-23/) | 7 | 11,136 |
| [2026-10-22](data/daily/2026-10-22/) | 7 | 14,820 |
| [2026-10-21](data/daily/2026-10-21/) | 7 | 3,758 |
| [2026-10-20](data/daily/2026-10-20/) | 7 | 16,733 |
| [2026-10-19](data/daily/2026-10-19/) | 7 | 7,692 |
| [2026-10-18](data/daily/2026-10-18/) | 7 | 25,156 |
| [2026-10-17](data/daily/2026-10-17/) | 7 | 4,108 |
| [2026-10-16](data/daily/2026-10-16/) | 7 | 3,297 |
| [2026-10-15](data/daily/2026-10-15/) | 7 | 3,601 |
| [2026-10-14](data/daily/2026-10-14/) | 7 | 8,598 |
| [2026-10-13](data/daily/2026-10-13/) | 7 | 8,419 |
| [2026-10-12](data/daily/2026-10-12/) | 7 | 16,745 |
| [2026-10-11](data/daily/2026-10-11/) | 7 | 4,840 |
| [2026-10-10](data/daily/2026-10-10/) | 7 | 28,217 |
| [2026-10-09](data/daily/2026-10-09/) | 7 | 27,830 |
| [2026-10-08](data/daily/2026-10-08/) | 7 | 3,977 |
| [2026-10-07](data/daily/2026-10-07/) | 7 | 12,956 |
| [2026-10-06](data/daily/2026-10-06/) | 7 | 1,836 |
| [2026-10-05](data/daily/2026-10-05/) | 7 | 18,394 |
| [2026-10-04](data/daily/2026-10-04/) | 7 | 7,052 |
| [2026-10-03](data/daily/2026-10-03/) | 7 | 5,275 |
| [2026-10-02](data/daily/2026-10-02/) | 7 | 3,456 |
| [2026-10-01](data/daily/2026-10-01/) | 7 | 52,099 |
| [2026-09-30](data/daily/2026-09-30/) | 7 | 3,746 |
| [2026-09-29](data/daily/2026-09-29/) | 7 | 4,040 |
| [2026-09-28](data/daily/2026-09-28/) | 7 | 4,865 |
| [2026-09-27](data/daily/2026-09-27/) | 7 | 2,616 |
| [2026-09-26](data/daily/2026-09-26/) | 7 | 4,710 |
| [2026-09-25](data/daily/2026-09-25/) | 7 | 4,098 |
| [2026-09-24](data/daily/2026-09-24/) | 7 | 11,274 |
| [2026-09-23](data/daily/2026-09-23/) | 7 | 7,681 |
| [2026-09-22](data/daily/2026-09-22/) | 7 | 3,036 |
| [2026-09-21](data/daily/2026-09-21/) | 7 | 1,606 |
| [2026-09-20](data/daily/2026-09-20/) | 7 | 1,594 |
| [2026-09-19](data/daily/2026-09-19/) | 7 | 2,194 |
| [2026-09-18](data/daily/2026-09-18/) | 7 | 1,105 |
| [2026-09-17](data/daily/2026-09-17/) | 7 | 4,091 |
| [2026-09-16](data/daily/2026-09-16/) | 7 | 850 |
| [2026-09-15](data/daily/2026-09-15/) | 7 | 790 |
| [2026-09-14](data/daily/2026-09-14/) | 7 | 1,618 |
| [2026-09-13](data/daily/2026-09-13/) | 7 | 2,278 |
| [2026-09-12](data/daily/2026-09-12/) | 7 | 3,364 |
| [2026-09-11](data/daily/2026-09-11/) | 7 | 2,352 |
| [2026-09-10](data/daily/2026-09-10/) | 7 | 3,473 |
| [2026-09-09](data/daily/2026-09-09/) | 7 | 4,772 |
| [2026-09-08](data/daily/2026-09-08/) | 7 | 3,655 |
| [2026-09-07](data/daily/2026-09-07/) | 7 | 5,599 |
| [2026-09-06](data/daily/2026-09-06/) | 7 | 3,793 |
| [2026-09-05](data/daily/2026-09-05/) | 7 | 1,829 |
| [2026-09-04](data/daily/2026-09-04/) | 7 | 2,003 |
| [2026-09-03](data/daily/2026-09-03/) | 7 | 1,923 |
| [2026-09-02](data/daily/2026-09-02/) | 7 | 3,348 |
| [2026-09-01](data/daily/2026-09-01/) | 7 | 6,291 |
| [2026-08-31](data/daily/2026-08-31/) | 7 | 1,047 |
| [2026-08-30](data/daily/2026-08-30/) | 7 | 1,916 |
| [2026-08-29](data/daily/2026-08-29/) | 7 | 1,767 |
| [2026-08-28](data/daily/2026-08-28/) | 7 | 1,477 |
| [2026-08-27](data/daily/2026-08-27/) | 7 | 1,295 |
| [2026-08-26](data/daily/2026-08-26/) | 7 | 1,366 |
| [2026-08-25](data/daily/2026-08-25/) | 7 | 2,172 |
| [2026-08-24](data/daily/2026-08-24/) | 7 | 624 |
| [2026-08-23](data/daily/2026-08-23/) | 7 | 1,490 |
| [2026-08-22](data/daily/2026-08-22/) | 7 | 866 |
| [2026-08-21](data/daily/2026-08-21/) | 7 | 684 |
| [2026-08-20](data/daily/2026-08-20/) | 7 | 595 |
| [2026-08-19](data/daily/2026-08-19/) | 7 | 304 |
| [2026-08-18](data/daily/2026-08-18/) | 7 | 644 |
| [2026-08-17](data/daily/2026-08-17/) | 7 | 415 |
| [2026-08-16](data/daily/2026-08-16/) | 7 | 473 |
| [2026-08-15](data/daily/2026-08-15/) | 7 | 489 |
| [2026-08-14](data/daily/2026-08-14/) | 7 | 532 |
| [2026-08-13](data/daily/2026-08-13/) | 7 | 816 |
| [2026-08-12](data/daily/2026-08-12/) | 7 | 563 |
| [2026-08-11](data/daily/2026-08-11/) | 7 | 614 |
| [2026-08-10](data/daily/2026-08-10/) | 7 | 256 |
| [2026-08-09](data/daily/2026-08-09/) | 7 | 336 |
| [2026-08-08](data/daily/2026-08-08/) | 7 | 594 |
| [2026-08-07](data/daily/2026-08-07/) | 7 | 379 |
| [2026-08-06](data/daily/2026-08-06/) | 7 | 456 |
| [2026-08-05](data/daily/2026-08-05/) | 7 | 295 |
| [2026-08-04](data/daily/2026-08-04/) | 7 | 320 |
| [2026-08-03](data/daily/2026-08-03/) | 7 | 394 |
| [2026-08-02](data/daily/2026-08-02/) | 7 | 496 |
| [2026-08-01](data/daily/2026-08-01/) | 7 | 389 |
| [2026-07-31](data/daily/2026-07-31/) | 7 | 499 |
| [2026-07-30](data/daily/2026-07-30/) | 6 | 320 |
| [2026-07-29](data/daily/2026-07-29/) | 7 | 400 |
| [2026-07-28](data/daily/2026-07-28/) | 7 | 582 |
| [2026-07-27](data/daily/2026-07-27/) | 7 | 349 |
| [2026-07-26](data/daily/2026-07-26/) | 7 | 400 |
| [2026-07-25](data/daily/2026-07-25/) | 7 | 431 |
| [2026-07-24](data/daily/2026-07-24/) | 7 | 430 |
| [2026-07-23](data/daily/2026-07-23/) | 7 | 363 |
| [2026-07-22](data/daily/2026-07-22/) | 7 | 429 |
| [2026-07-21](data/daily/2026-07-21/) | 7 | 544 |
| [2026-07-20](data/daily/2026-07-20/) | 7 | 475 |
| [2026-07-19](data/daily/2026-07-19/) | 7 | 366 |
| [2026-07-18](data/daily/2026-07-18/) | 7 | 461 |
| [2026-07-17](data/daily/2026-07-17/) | 7 | 523 |
| [2026-07-16](data/daily/2026-07-16/) | 7 | 367 |
<!-- daily-index:end -->

## Quick start

### Node / JavaScript

```js
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createGunzip } from 'node:zlib';

const stream = createReadStream('data/krillion-answers.jsonl.gz')
  .pipe(createGunzip())
  .pipe(createInterface({ input: undefined, crlfDelay: Infinity }));

for await (const line of stream) {
  if (!line) continue;
  const row = JSON.parse(line);
  // ...
}
```

### Python

```python
import gzip, json

with gzip.open("data/krillion-answers.jsonl.gz", "rt", encoding="utf-8") as fh:
    for line in fh:
        row = json.loads(line)
```

### Pandas

```python
import pandas as pd

df = pd.read_csv("data/krillion-answers.csv.gz")
df.groupby("category")["answer"].nunique().sort_values(ascending=False)
```

### SQLite

```bash
sqlite3 krillion.db < schema.sql
# then load data/prompts.csv and the answers from the CSV as needed
```

### jq

```bash
gunzip -c data/krillion-answers.jsonl.gz | jq -r 'select(.score==100) | .prompt' | sort -u
```

### Browse by date

```bash
ls data/daily/2026-10-21/
cat data/daily/2026-10-21/02-current-nba-player.txt
```

Each prompt file starts with the full prompt text, then its category and answer
count, then one answer per line:

```
<full prompt>
Category: <category>
Answers: <n>

<answer> — <Tier Label> (<points>)
```

## Regenerating

Maintainers with access to the source D1 database:

```bash
npm install
npx wrangler login
npm run export          # published fields
npm run export:quips    # include quip text (do not publish without checking rights)
npm run verify
```

If your network requires a proxy, set `HTTPS_PROXY` before running. Set
`KRILLION_D1_NAME` to use a different database name.

## Caveats

- Answers are a snapshot. The live game may accept spellings that are missing
  here, and may reject entries that appear here.
- Prompt wording is reproduced as-is, including odd punctuation.
- Coverage of non-daily modes is limited to what the publisher made public.
- Categories are assigned heuristically and may be imperfect.

## License

Code and tooling: MIT (see [LICENSE](./LICENSE)).
Game content: see [DATA-NOTICE.md](./DATA-NOTICE.md).
