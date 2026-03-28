import { createHash } from "node:crypto";
import { getLoadablePath } from "sqlite-vec";
import { escapeSqlString, execute, getDb, queryJson, queryOne, runSql } from "@/lib/opentrust/db";
import { recordIngestionState } from "@/lib/opentrust/ingestion-state";

const VECTOR_DIMS = 64;

export interface SemanticChunkRow {
  chunk_id: string;
  source_kind: string;
  source_id: string;
  title: string | null;
  body: string;
  token_estimate: number;
  created_at: string;
}

export interface SemanticStatus {
  chunkCount: number;
  vectorReady: boolean;
  vectorExtensionPath: string | null;
  lastChunkRunAt: string | null;
}

function nowIso() {
  return new Date().toISOString();
}

function hashId(sourceKind: string, sourceId: string, text: string, index: number) {
  return `chunk:${sourceKind}:${createHash("sha1").update(`${sourceId}:${index}:${text}`).digest("hex").slice(0, 16)}`;
}

function splitIntoChunks(text: string, maxChars = 1200) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const chunks: string[] = [];
  for (let i = 0; i < clean.length; i += maxChars) {
    chunks.push(clean.slice(i, i + maxChars));
  }
  return chunks;
}

function normalizeVector(values: number[]) {
  const norm = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0)) || 1;
  return values.map((value) => value / norm);
}

function embedText(text: string, dims = VECTOR_DIMS) {
  const values = Array.from({ length: dims }, () => 0);
  const lowered = text.toLowerCase();
  for (let i = 0; i < lowered.length; i += 1) {
    const code = lowered.charCodeAt(i);
    values[i % dims] += ((code % 37) - 18) / 18;
  }
  return normalizeVector(values);
}

function vectorJson(text: string) {
  return JSON.stringify(embedText(text));
}

function tryLoadSqliteVec() {
  const db = getDb();
  const configuredPath = process.env.OPENTRUST_SQLITE_VEC_PATH ?? getLoadablePath();

  try {
    db.loadExtension(configuredPath);
    runSql(`
      CREATE VIRTUAL TABLE IF NOT EXISTS semantic_vec USING vec0(
        embedding float[${VECTOR_DIMS}]
      );

      CREATE TABLE IF NOT EXISTS semantic_vec_map (
        rowid INTEGER PRIMARY KEY,
        chunk_id TEXT NOT NULL UNIQUE
      );
    `);
    return { ok: true, path: configuredPath };
  } catch {
    return { ok: false, path: configuredPath };
  }
}

/** Create the semantic_chunks and semantic_index_state tables if they do not exist. */
export function ensureSemanticTables() {
  runSql(`
    CREATE TABLE IF NOT EXISTS semantic_chunks (
      chunk_id TEXT PRIMARY KEY,
      source_kind TEXT NOT NULL,
      source_id TEXT NOT NULL,
      title TEXT,
      body TEXT NOT NULL,
      token_estimate INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS semantic_index_state (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      vector_extension_path TEXT,
      last_chunk_run_at TEXT,
      metadata_json TEXT NOT NULL DEFAULT '{}'
    );
  `);
}

/**
 * Rebuild the semantic chunk index from scratch by re-chunking all traces
 * and artifacts. Loads sqlite-vec for vector search when available.
 * @returns The number of chunks inserted.
 */
export function rebuildSemanticChunks() {
  ensureSemanticTables();
  const vec = tryLoadSqliteVec();

  runSql("DELETE FROM semantic_chunks;");
  if (vec.ok) {
    runSql("DELETE FROM semantic_vec_map;");
    runSql("DELETE FROM semantic_vec;");
  }

  const createdAt = nowIso();
  const traceRows = queryJson<{ source_id: string; title: string | null; body: string | null }>(`
    SELECT source_id, title, body
    FROM search_chunks
    WHERE source_kind = 'trace';
  `);

  let inserted = 0;

  const insertChunk = (sourceKind: string, sourceId: string, title: string | null, body: string, metadata: Record<string, unknown>) => {
    const chunkId = hashId(sourceKind, sourceId, body, inserted + 1);
    execute(
      `
        INSERT INTO semantic_chunks (
          chunk_id,
          source_kind,
          source_id,
          title,
          body,
          token_estimate,
          created_at,
          metadata_json
        ) VALUES (
          :chunkId,
          :sourceKind,
          :sourceId,
          :title,
          :body,
          :tokenEstimate,
          :createdAt,
          :metadataJson
        )
      `,
      {
        chunkId,
        sourceKind,
        sourceId,
        title,
        body,
        tokenEstimate: Math.ceil(body.length / 4),
        createdAt,
        metadataJson: JSON.stringify(metadata),
      },
    );

    if (vec.ok) {
      const rowid = inserted + 1;
      runSql(`INSERT INTO semantic_vec(rowid, embedding) VALUES (${rowid}, ${escapeSqlString(vectorJson(`${title ?? sourceId}\n\n${body}`))});`);
      execute(`INSERT INTO semantic_vec_map(rowid, chunk_id) VALUES (:rowid, :chunkId);`, { rowid, chunkId });
    }

    inserted += 1;
  };

  for (const row of traceRows) {
    const chunks = splitIntoChunks(`${row.title ?? row.source_id}\n\n${row.body ?? ""}`);
    chunks.forEach((chunk, index) => insertChunk("trace", row.source_id, row.title, chunk, { chunkIndex: index }));
  }

  const artifactRows = queryJson<{ id: string; title: string | null; uri: string; kind: string }>(`
    SELECT id, title, uri, kind
    FROM artifacts;
  `);

  for (const row of artifactRows) {
    const body = `${row.title ?? row.id}\n\n${row.uri}\n\n${row.kind}`;
    insertChunk("artifact", row.id, row.title, body, { uri: row.uri, kind: row.kind });
  }

  execute(
    `
      INSERT INTO semantic_index_state (id, status, vector_extension_path, last_chunk_run_at, metadata_json)
      VALUES ('primary', :status, :vectorPath, :lastRunAt, :metadataJson)
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status,
        vector_extension_path=excluded.vector_extension_path,
        last_chunk_run_at=excluded.last_chunk_run_at,
        metadata_json=excluded.metadata_json;
    `,
    {
      status: vec.ok ? "vector-ready" : "chunked",
      vectorPath: vec.path ?? null,
      lastRunAt: createdAt,
      metadataJson: JSON.stringify({ chunkCount: inserted, vectorReady: vec.ok }),
    },
  );

  recordIngestionState({
    sourceKey: "opentrust:semantic:chunks",
    sourceKind: "semantic-chunks",
    cursorText: null,
    cursorNumber: inserted,
    lastRunAt: createdAt,
    lastStatus: "ok",
    importedCount: inserted,
    metadata: { vectorReady: vec.ok },
  });

  return inserted;
}

/** Return the current semantic index health: chunk count, vector readiness, and last run time. */
export function getSemanticStatus(): SemanticStatus {
  ensureSemanticTables();

  const counts = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM semantic_chunks;") ?? { count: 0 };
  const state = queryOne<{ status: string; vector_extension_path: string | null; last_chunk_run_at: string | null; metadata_json: string }>(`
    SELECT status, vector_extension_path, last_chunk_run_at, metadata_json
    FROM semantic_index_state
    WHERE id = 'primary'
    LIMIT 1;
  `);

  const metadata = state?.metadata_json ? (JSON.parse(state.metadata_json) as { vectorReady?: boolean }) : {};

  return {
    chunkCount: counts.count,
    vectorReady: Boolean(metadata.vectorReady),
    vectorExtensionPath: state?.vector_extension_path ?? null,
    lastChunkRunAt: state?.last_chunk_run_at ?? null,
  };
}

/**
 * Search semantic chunks using vector similarity when available,
 * falling back to a LIKE query on chunk body/title.
 */
export function searchSemanticFallback(query: string) {
  ensureSemanticTables();
  const state = getSemanticStatus();

  if (state.vectorReady) {
    return queryJson<{ source_id: string; source_kind: string; title: string | null; body: string }>(
      `
        SELECT semantic_chunks.source_id, semantic_chunks.source_kind, semantic_chunks.title, semantic_chunks.body
        FROM semantic_vec
        JOIN semantic_vec_map ON semantic_vec_map.rowid = semantic_vec.rowid
        JOIN semantic_chunks ON semantic_chunks.chunk_id = semantic_vec_map.chunk_id
        WHERE semantic_vec.embedding MATCH :embedding
        ORDER BY distance
        LIMIT 8;
      `,
      { embedding: vectorJson(query) },
    );
  }

  const q = `%${query.toLowerCase()}%`;
  return queryJson<{ source_id: string; source_kind: string; title: string | null; body: string }>(`
    SELECT source_id, source_kind, title, body
    FROM semantic_chunks
    WHERE lower(body) LIKE :query OR lower(COALESCE(title, '')) LIKE :query
    LIMIT 8;
  `, { query: q });
}
