import { execute, queryJson, queryOne } from "@/lib/opentrust/db";

export interface IngestionStateRow {
  source_key: string;
  source_kind: string;
  cursor_text: string | null;
  cursor_number: number | null;
  last_run_at: string | null;
  last_status: string | null;
  imported_count: number;
  metadata_json: string;
}

export function recordIngestionState(input: {
  sourceKey: string;
  sourceKind: string;
  cursorText?: string | null;
  cursorNumber?: number | null;
  lastRunAt: string;
  lastStatus: string;
  importedCount: number;
  metadata?: unknown;
}) {
  execute(
    `
      INSERT INTO ingestion_state (
        source_key,
        source_kind,
        cursor_text,
        cursor_number,
        last_run_at,
        last_status,
        imported_count,
        metadata_json
      ) VALUES (
        :sourceKey,
        :sourceKind,
        :cursorText,
        :cursorNumber,
        :lastRunAt,
        :lastStatus,
        :importedCount,
        :metadataJson
      )
      ON CONFLICT(source_key) DO UPDATE SET
        source_kind=excluded.source_kind,
        cursor_text=excluded.cursor_text,
        cursor_number=excluded.cursor_number,
        last_run_at=excluded.last_run_at,
        last_status=excluded.last_status,
        imported_count=excluded.imported_count,
        metadata_json=excluded.metadata_json;
    `,
    {
      sourceKey: input.sourceKey,
      sourceKind: input.sourceKind,
      cursorText: input.cursorText ?? null,
      cursorNumber: input.cursorNumber ?? null,
      lastRunAt: input.lastRunAt,
      lastStatus: input.lastStatus,
      importedCount: input.importedCount,
      metadataJson: JSON.stringify(input.metadata ?? {}),
    },
  );
}

export function getIngestionStates(limit = 12): IngestionStateRow[] {
  return queryJson<IngestionStateRow>(
    `
      SELECT source_key, source_kind, cursor_text, cursor_number, last_run_at, last_status, imported_count, metadata_json
      FROM ingestion_state
      ORDER BY COALESCE(last_run_at, '') DESC
      LIMIT :limit;
    `,
    { limit },
  );
}

export function getIngestionState(sourceKey: string): IngestionStateRow | null {
  return queryOne<IngestionStateRow>(
    `
      SELECT source_key, source_kind, cursor_text, cursor_number, last_run_at, last_status, imported_count, metadata_json
      FROM ingestion_state
      WHERE source_key = :sourceKey
      LIMIT 1;
    `,
    { sourceKey },
  );
}
