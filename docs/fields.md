# Field reference

## Modes

| `mode` | Meaning | `game_id` format |
|---|---|---|
| `daily` | The shared Daily Dive | `YYYY-MM-DD` |
| `unlimited` | Unlimited practice game | game number |
| `movies` | Movies pack | game number |
| `sports` | Sports pack | game number |
| `geography` | Geography pack | game number |

`mode` answers **where a prompt came from**. It is not the same thing as
`category`.

## Categories

`category` answers **what a prompt is about**. The current set:

- `Country / Geography / Places`
- `Animals & Nature`
- `Food & Drink`
- `People & Entertainment`
- `Sports & Games`
- `Brands / Companies / Apps`
- `Science, Space & Tech`
- `Words, Language & Numbers`
- `Body, Health & Medicine`
- `Objects, Tools & Materials`
- `Work, Money & Society`
- `Other / Abstract`

Categories are assigned heuristically, so a few edge cases will be off. They are
a convenience, not an official classification.

## Tiers and scores

`tier` is a stable machine key; `score` is the point value. Both are fixed per
answer.

| `tier` | Points |
|---|---|
| `krillion` | 100 |
| `deepcut` | 85 |
| `rare` | 60 |
| `schooler` | 30 |
| `tooclever` | 15 |
| `plankton` | 10 |

A full seven-round game is worth at most 700 points.

## Normalisation notes

- Answers are stored exactly as published. Casing and accents are preserved.
- Duplicate answers within a prompt are not expected; the source enforces
  uniqueness per prompt.
- `round` is the 1-based position of the prompt inside its game.
- `game_id` values sort lexicographically for `daily` (ISO dates).
