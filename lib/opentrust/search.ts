import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";
import { listMemoryEntries } from "@/lib/opentrust/memory-entries";
import { searchSemanticFallback } from "@/lib/opentrust/semantic";

export interface InvestigationResult {
  source_id: string;
  title: string;
  snippet: string;
  mode?: "fts" | "semantic-fallback" | "memory-entry";
  sourceType?: "evidence" | "memory";
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

  const normalized = q.toLowerCase();
  const memoryResults = listMemoryEntries({ limit: 50 })
    .filter((entry) => {
      const haystack = [entry.title, entry.body, entry.summary ?? "", ...entry.tags.map((tag) => tag.tag)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .map((entry) => ({
      source_id: entry.id,
      title: entry.title,
      snippet: entry.summary ?? entry.body.slice(0, 280),
      mode: "memory-entry" as const,
      sourceType: "memory" as const,
    }));

  const ftsQuery = fts5Escape(q);
  const ftsResults = queryJson<InvestigationResult>(
    `
      SELECT
        source_id,
        COALESCE(title, source_id) AS title,
        snippet(search_chunks, 3, '[[mark]]', '[[/mark]]', ' … ', 24) AS snippet,
        'fts' AS mode,
        'evidence' AS sourceType
      FROM search_chunks
      WHERE search_chunks MATCH :query
      LIMIT 12;
    `,
    { query: ftsQuery },
  );

  if (ftsResults.length > 0 || memoryResults.length > 0) {
    return [...memoryResults.slice(0, 4), ...ftsResults].slice(0, 12);
  }

  return searchSemanticFallback(q).map((row) => ({
    source_id: row.source_id,
    title: row.title ?? row.source_id,
    snippet: row.body.slice(0, 280),
    mode: "semantic-fallback",
    sourceType: "evidence",
  }));
}
