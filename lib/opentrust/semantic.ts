import { createHash } from "node:crypto";
import { execute, getDb, queryJson, queryOne, runSql } from "@/lib/opentrust/db";
import { recordIngestionState } from "@/lib/opentrust/ingestion-state";

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

export function rebuildSemanticChunks() {
  ensureSemanticTables();

  runSql("DELETE FROM semantic_chunks;");

  const createdAt = nowIso();
  const traceRows = queryJson<{ source_id: string; title: string | null; body: string | null }>(`
    SELECT source_id, title, body
    FROM search_chunks
    WHERE source_kind = 'trace';
  `);

  let inserted = 0;

  for (const row of traceRows) {
    const chunks = splitIntoChunks(`${row.title ?? row.source_id}\n\n${row.body ?? ""}`);
    chunks.forEach((chunk, index) => {
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
            'trace',
            :sourceId,
            :title,
            :body,
            :tokenEstimate,
            :createdAt,
            :metadataJson
          )
        `,
        {
          chunkId: hashId("trace", row.source_id, chunk, index),
          sourceId: row.source_id,
          title: row.title,
          body: chunk,
          tokenEstimate: Math.ceil(chunk.length / 4),
          createdAt,
          metadataJson: JSON.stringify({ chunkIndex: index }),
        },
      );
      inserted += 1;
    });
  }

  const artifactRows = queryJson<{ id: string; title: string | null; uri: string; kind: string }>(`
    SELECT id, title, uri, kind
    FROM artifacts;
  `);

  for (const row of artifactRows) {
    const body = `${row.title ?? row.id}\n\n${row.uri}\n\n${row.kind}`;
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
          'artifact',
          :sourceId,
          :title,
          :body,
          :tokenEstimate,
          :createdAt,
          :metadataJson
        )
      `,
      {
        chunkId: hashId("artifact", row.id, body, 0),
        sourceId: row.id,
        title: row.title,
        body,
        tokenEstimate: Math.ceil(body.length / 4),
        createdAt,
        metadataJson: JSON.stringify({ uri: row.uri, kind: row.kind }),
      },
    );
    inserted += 1;
  }

  execute(
    `
      INSERT INTO semantic_index_state (id, status, vector_extension_path, last_chunk_run_at, metadata_json)
      VALUES ('primary', 'chunked', :vectorPath, :lastRunAt, :metadataJson)
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status,
        vector_extension_path=excluded.vector_extension_path,
        last_chunk_run_at=excluded.last_chunk_run_at,
        metadata_json=excluded.metadata_json;
    `,
    {
      vectorPath: process.env.OPENTRUST_SQLITE_VEC_PATH ?? null,
      lastRunAt: createdAt,
      metadataJson: JSON.stringify({ chunkCount: inserted, vectorReady: false }),
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
    metadata: { vectorReady: false },
  });

  return inserted;
}

export function getSemanticStatus(): SemanticStatus {
  ensureSemanticTables();

  const counts = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM semantic_chunks;") ?? { count: 0 };
  const state = queryOne<{ status: string; vector_extension_path: string | null; last_chunk_run_at: string | null; metadata_json: string }>(`
    SELECT status, vector_extension_path, last_chunk_run_at, metadata_json
    FROM semantic_index_state
    WHERE id = 'primary'
    LIMIT 1;
  `);

  const metadata = state?.metadata_json ? JSON.parse(state.metadata_json) as { vectorReady?: boolean } : {};

  return {
    chunkCount: counts.count,
    vectorReady: Boolean(metadata.vectorReady),
    vectorExtensionPath: state?.vector_extension_path ?? null,
    lastChunkRunAt: state?.last_chunk_run_at ?? null,
  };
}

export function searchSemanticFallback(query: string) {
  ensureSemanticTables();
  const q = `%${query.toLowerCase()}%`;
  return queryJson<{ source_id: string; source_kind: string; title: string | null; body: string }>(`
    SELECT source_id, source_kind, title, body
    FROM semantic_chunks
    WHERE lower(body) LIKE :query OR lower(COALESCE(title, '')) LIKE :query
    LIMIT 8;
  `, { query: q });
}
