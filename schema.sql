-- Schema for the published Krillion answers dataset.
-- Works with SQLite and Cloudflare D1.

CREATE TABLE IF NOT EXISTS prompts (
  id        TEXT PRIMARY KEY,
  mode      TEXT NOT NULL,
  game_id   TEXT NOT NULL,
  round     INTEGER NOT NULL,
  text      TEXT NOT NULL,
  category  TEXT
);

CREATE TABLE IF NOT EXISTS answers (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt_id TEXT NOT NULL,
  answer    TEXT NOT NULL,
  tier      TEXT NOT NULL,
  score     INTEGER NOT NULL,
  UNIQUE (prompt_id, answer)
);

CREATE INDEX IF NOT EXISTS idx_prompts_mode_game ON prompts (mode, game_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts (category);
CREATE INDEX IF NOT EXISTS idx_answers_prompt ON answers (prompt_id);
CREATE INDEX IF NOT EXISTS idx_answers_score ON answers (score);
