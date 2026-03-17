import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";

export interface InvestigationResult {
  source_id: string;
  title: string;
  snippet: string;
}

export function searchInvestigations(query: string): InvestigationResult[] {
  ensureBootstrapped();

  const q = query.trim();
  if (!q) return [];

  return queryJson<InvestigationResult>(`
    SELECT
      source_id,
      COALESCE(title, source_id) AS title,
      snippet(search_chunks, 3, '[[mark]]', '[[/mark]]', ' … ', 24) AS snippet
    FROM search_chunks
    WHERE search_chunks MATCH :query
    LIMIT 12;
  `, { query: q });
}
