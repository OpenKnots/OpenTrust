import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson, escapeSqlString } from "@/lib/opentrust/db";
import { importRecentOpenClawSessions } from "@/lib/opentrust/import-openclaw";

export interface InvestigationResult {
  source_id: string;
  title: string;
  snippet: string;
}

export function searchInvestigations(query: string): InvestigationResult[] {
  ensureBootstrapped();
  importRecentOpenClawSessions();

  const q = query.trim();
  if (!q) return [];

  return queryJson<InvestigationResult>(`
    SELECT
      source_id,
      COALESCE(title, source_id) AS title,
      snippet(search_chunks, 3, '‹mark›', '‹/mark›', ' … ', 24) AS snippet
    FROM search_chunks
    WHERE search_chunks MATCH ${escapeSqlString(q)}
    LIMIT 12;
  `);
}
