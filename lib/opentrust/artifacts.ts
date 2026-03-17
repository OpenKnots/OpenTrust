import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";

export interface ArtifactRow {
  id: string;
  kind: string;
  uri: string;
  title: string | null;
  created_at: string;
}

export function getRecentArtifacts(limit = 12): ArtifactRow[] {
  ensureBootstrapped();
  return queryJson<ArtifactRow>(`
    SELECT id, kind, uri, title, created_at
    FROM artifacts
    ORDER BY created_at DESC
    LIMIT :limit;
  `, { limit });
}

export function getArtifactsForTrace(traceId: string): ArtifactRow[] {
  ensureBootstrapped();
  return queryJson<ArtifactRow>(`
    SELECT artifacts.id, artifacts.kind, artifacts.uri, artifacts.title, artifacts.created_at
    FROM trace_edges
    JOIN artifacts ON artifacts.id = trace_edges.to_id
    WHERE trace_edges.from_kind = 'trace'
      AND trace_edges.from_id = :traceId
      AND trace_edges.to_kind = 'artifact'
    ORDER BY artifacts.created_at DESC;
  `, { traceId });
}
