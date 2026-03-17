PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- System of record: append-only evidence first.
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  channel TEXT,
  agent_id TEXT,
  label TEXT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS traces (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  parent_trace_id TEXT REFERENCES traces(id) ON DELETE SET NULL,
  workflow_run_id TEXT REFERENCES workflow_runs(id) ON DELETE SET NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'idle',
  summary TEXT,
  started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  trace_id TEXT NOT NULL REFERENCES traces(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  sequence_no INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  text_preview TEXT,
  UNIQUE(trace_id, sequence_no)
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  workflow_key TEXT,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  ended_at TEXT,
  summary TEXT,
  source_kind TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS workflow_steps (
  id TEXT PRIMARY KEY,
  workflow_run_id TEXT NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  parent_step_id TEXT REFERENCES workflow_steps(id) ON DELETE SET NULL,
  step_key TEXT NOT NULL,
  label TEXT,
  status TEXT NOT NULL,
  owner_session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  started_at TEXT,
  updated_at TEXT,
  ended_at TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS capabilities (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('skill', 'plugin', 'soul', 'bundle')),
  name TEXT NOT NULL,
  version TEXT,
  source_uri TEXT,
  trust_level TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(kind, name, version)
);

CREATE TABLE IF NOT EXISTS trace_capabilities (
  trace_id TEXT NOT NULL REFERENCES traces(id) ON DELETE CASCADE,
  capability_id TEXT NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  role TEXT,
  created_at TEXT NOT NULL,
  PRIMARY KEY (trace_id, capability_id, role)
);

CREATE TABLE IF NOT EXISTS tool_calls (
  id TEXT PRIMARY KEY,
  trace_id TEXT NOT NULL REFERENCES traces(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  arguments_json TEXT NOT NULL DEFAULT '{}',
  result_json TEXT,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  error_text TEXT
);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  uri TEXT NOT NULL,
  title TEXT,
  checksum TEXT,
  created_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS run_artifacts (
  run_id TEXT NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  artifact_id TEXT NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  PRIMARY KEY (run_id, artifact_id, relation)
);

CREATE TABLE IF NOT EXISTS trace_edges (
  id TEXT PRIMARY KEY,
  from_kind TEXT NOT NULL,
  from_id TEXT NOT NULL,
  edge_type TEXT NOT NULL,
  to_kind TEXT NOT NULL,
  to_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS ingestion_state (
  source_key TEXT PRIMARY KEY,
  source_kind TEXT NOT NULL,
  cursor_text TEXT,
  cursor_number INTEGER,
  last_run_at TEXT,
  last_status TEXT,
  imported_count INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS saved_investigations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sql_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE VIRTUAL TABLE IF NOT EXISTS search_chunks USING fts5(
  source_kind,
  source_id,
  title,
  body,
  tokenize='unicode61 remove_diacritics 2'
);

-- sqlite-vec blueprint. Enable after loading the extension in runtime:
--   SELECT load_extension('sqlite-vec');
--   CREATE VIRTUAL TABLE embedding_chunks_vec USING vec0(
--     chunk_id TEXT PRIMARY KEY,
--     source_kind TEXT,
--     source_id TEXT,
--     embedding FLOAT[1536]
--   );

CREATE INDEX IF NOT EXISTS idx_traces_session_id ON traces(session_id);
CREATE INDEX IF NOT EXISTS idx_events_trace_id_sequence ON events(trace_id, sequence_no);
CREATE INDEX IF NOT EXISTS idx_events_session_id_created_at ON events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_run_id ON workflow_steps(workflow_run_id);
CREATE INDEX IF NOT EXISTS idx_tool_calls_trace_id ON tool_calls(trace_id);
CREATE INDEX IF NOT EXISTS idx_trace_edges_from ON trace_edges(from_kind, from_id);
CREATE INDEX IF NOT EXISTS idx_trace_edges_to ON trace_edges(to_kind, to_id);
