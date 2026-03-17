import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";
import { searchSemanticFallback } from "@/lib/opentrust/semantic";

export interface InvestigationResult {
  source_id: string;
  title: string;
  snippet: string;
  mode?: "fts" | "semantic-fallback";
}

function fts5Escape(raw: string): string {
  const tokens = raw.match(/\S+/g);
  if (!tokens) return '""';
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"`).join(" ");
}

export function searchInvestigations(query: string): InvestigationResult[] {
  ensureBootstrapped();

  const q = query.trim();
  if (!q) return [];

  const ftsQuery = fts5Escape(q);

  const ftsResults = queryJson<InvestigationResult>(`
    SELECT
      source_id,
      COALESCE(title, source_id) AS title,
      snippet(search_chunks, 3, '[[mark]]', '[[/mark]]', ' … ', 24) AS snippet,
      'fts' AS mode
    FROM search_chunks
    WHERE search_chunks MATCH :query
    LIMIT 12;
  `, { query: ftsQuery });

  if (ftsResults.length > 0) {
    return ftsResults;
  }

  return searchSemanticFallback(q).map((row) => ({
    source_id: row.source_id,
    title: row.title ?? row.source_id,
    snippet: row.body.slice(0, 280),
    mode: "semantic-fallback",
  }));
}
