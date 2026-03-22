import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import {
  getArchiveStats,
  getMemoryEntry,
  listMemoryEntries,
  listMemoryEntryVersions,
  promoteToMemory,
} from "@/lib/opentrust/memory-entries";
import { getMemoryConfig } from "@/lib/opentrust/memory-config";
import type { MemoryEntryVersion } from "@/lib/opentrust/memory-entries";
import type {
  MemoryHealthRequest,
  MemoryHealthResponse,
  MemoryInspectRequest,
  MemoryPromoteRequest,
  MemoryPromoteResponse,
  MemoryRetentionClass,
  MemorySearchRequest,
  MemorySearchResponse,
  MemorySearchResult,
} from "@/lib/types";

function confidenceBand(score: number | null | undefined): MemorySearchResult["confidence"]["band"] {
  if (score == null) return "unknown";
  if (score >= 0.9) return "very_high";
  if (score >= 0.75) return "high";
  if (score >= 0.5) return "medium";
  if (score >= 0.25) return "low";
  return "very_low";
}

function freshnessStatus(updatedAt?: string): MemorySearchResult["freshness"]["status"] {
  if (!updatedAt) return "unknown";
  const ageMs = Date.now() - new Date(updatedAt).getTime();
  if (ageMs < 1000 * 60 * 60 * 24 * 7) return "fresh";
  if (ageMs < 1000 * 60 * 60 * 24 * 30) return "aging";
  return "stale";
}

export function memoryPromote(request: MemoryPromoteRequest): MemoryPromoteResponse {
  return promoteToMemory(request);
}

export function memoryInspect(request: MemoryInspectRequest) {
  if (request.ref.type !== "memoryEntry") {
    return {
      ref: request.ref,
      entity: null,
      lineage: [],
      related: [],
      raw: { available: false },
    };
  }

  const entry = getMemoryEntry(request.ref.id);
  if (!entry) {
    return {
      ref: request.ref,
      entity: null,
      lineage: [],
      related: [],
      raw: { available: false },
    };
  }

  return {
    ref: request.ref,
    entity: {
      title: entry.title,
      body: entry.body,
      summary: entry.summary,
      reviewStatus: entry.review_status,
      retentionClass: entry.retention_class,
    },
    lineage: request.includeLineage === false ? [] : entry.origins.map((origin) => ({ type: origin.origin_type, id: origin.origin_id })),
    related: request.includeRelated === false ? [] : entry.origins.map((origin) => ({ type: origin.origin_type, id: origin.origin_id })),
    raw: {
      available: request.includeRaw !== false,
      format: request.includeRaw === false ? undefined : "memory-entry",
      ref: request.includeRaw === false ? undefined : entry.id,
    },
  };
}

export function memorySearch(request: MemorySearchRequest): MemorySearchResponse {
  const query = request.query.trim();
  const allEntries = listMemoryEntries({ limit: Math.max(request.limit ?? 10, 50) });

  const filtered = query
    ? allEntries.filter((entry) => {
        const haystack = [entry.title, entry.body, entry.summary ?? "", ...entry.tags.map((tag) => tag.tag)].join(" ").toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : allEntries;

  const retained = request.scope?.retentionClasses?.length
    ? filtered.filter((entry) => request.scope?.retentionClasses?.includes(entry.retention_class))
    : filtered;

  const minConfidence = request.minConfidence ?? 0;

  const results: MemorySearchResult[] = retained
    .filter((entry) => (entry.confidence_score ?? 0) >= minConfidence)
    .slice(0, request.limit ?? 10)
    .map((entry) => ({
      id: entry.id,
      sourceType: "memoryEntry",
      sourceRef: {
        table: "memory_entries",
        id: entry.id,
      },
      title: entry.title,
      snippet: entry.summary ?? entry.body.slice(0, 240),
      summary: entry.summary,
      provenance: {
        originRefs: entry.origins.map((origin) => ({ type: origin.origin_type, id: origin.origin_id })),
        ingestedAt: entry.created_at,
        derived: true,
        authorType: entry.author_type,
        authorId: entry.author_id ?? undefined,
      },
      confidence: {
        score: entry.confidence_score,
        band: confidenceBand(entry.confidence_score),
        reason: entry.confidence_reason,
      },
      freshness: {
        status: freshnessStatus(entry.updated_at),
        lastUpdatedAt: entry.updated_at,
      },
      whyMatched: {
        matchedTerms: query ? query.split(/\s+/).filter(Boolean) : [],
        rankingSignals: ["lexical", `retention_${entry.retention_class}`, `review_${entry.review_status}`],
        explanation: query
          ? "Matched against curated memory content and ranked with retention and review signals."
          : "Returned from curated memory inventory.",
      },
      uncertainty: {
        status: entry.uncertainty_summary ? "medium" : "unknown",
        summary: entry.uncertainty_summary,
      },
      relatedRefs: entry.origins.map((origin) => ({ type: origin.origin_type, id: origin.origin_id })),
      rawAvailable: true,
    }));

  return {
    query,
    modeUsed: "lexical",
    generatedAt: new Date().toISOString(),
    results,
    stats: {
      searchedSources: 1,
      candidateCount: retained.length,
      returnedCount: results.length,
    },
  };
}

// ---------------------------------------------------------------------------
// Working Memory Snapshot
// ---------------------------------------------------------------------------

export interface WorkingSnapshot {
  generatedAt: string;
  tokenEstimate: number;
  sections: Array<{
    retentionClass: MemoryRetentionClass;
    entries: Array<{
      id: string;
      title: string;
      snippet: string;
      kind: string;
      confidence: number | null;
    }>;
  }>;
  markdown: string;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Build a concise working-memory snapshot for agent consumption. Prioritises
 * pinned > longTerm > working entries that have been approved/reviewed, and
 * stays within the configured token budget.
 */
export function memoryWorkingSnapshot(): WorkingSnapshot {
  const config = getMemoryConfig().workingSnapshot;
  const now = new Date().toISOString();

  const priorityOrder: MemoryRetentionClass[] = config.includeRetentionClasses;
  const sections: WorkingSnapshot["sections"] = [];
  let totalTokens = 0;
  const markdownParts: string[] = ["# Working Memory Snapshot", ""];

  for (const retentionClass of priorityOrder) {
    if (totalTokens >= config.maxTokens) break;

    const entries = listMemoryEntries({
      retentionClass,
      reviewStatus: undefined,
      limit: 100,
    }).filter(
      (e) =>
        config.requireReviewStatus.includes(e.review_status as "approved" | "reviewed") &&
        !e.archived_at,
    );

    if (entries.length === 0) continue;

    const sectionEntries: WorkingSnapshot["sections"][number]["entries"] = [];
    markdownParts.push(`## ${retentionClass}`, "");

    for (const entry of entries) {
      const snippet = entry.summary ?? entry.body.slice(0, 200);
      const entryTokens = estimateTokens(`- ${entry.title}: ${snippet}`);

      if (totalTokens + entryTokens > config.maxTokens) break;

      sectionEntries.push({
        id: entry.id,
        title: entry.title,
        snippet,
        kind: entry.kind,
        confidence: entry.confidence_score,
      });
      markdownParts.push(`- **${entry.title}**: ${snippet}`);
      totalTokens += entryTokens;
    }

    if (sectionEntries.length > 0) {
      sections.push({ retentionClass, entries: sectionEntries });
      markdownParts.push("");
    }
  }

  return {
    generatedAt: now,
    tokenEstimate: totalTokens,
    sections,
    markdown: markdownParts.join("\n"),
  };
}

export function memoryHealth(request: MemoryHealthRequest): MemoryHealthResponse {
  const ingestionStates = getIngestionStates();
  const stalePipelines = ingestionStates.filter((state) => {
    if (!state.last_run_at) return true;
    return Date.now() - new Date(state.last_run_at).getTime() > 1000 * 60 * 60 * 8;
  });

  const signals: MemoryHealthResponse["signals"] = stalePipelines.map((state) => ({
    kind: "ingestion_freshness",
    status: "attention" as const,
    summary: `${state.source_key} has not refreshed recently.`,
    metric: {
      name: "hours_since_ingest",
      value: state.last_run_at ? Math.floor((Date.now() - new Date(state.last_run_at).getTime()) / (1000 * 60 * 60)) : -1,
    },
    sourceRef: {
      type: "ingestionPipeline",
      id: state.source_key,
    },
  }));

  const archiveStats = getArchiveStats();
  const config = getMemoryConfig();
  if (archiveStats.archivedCount > config.archive.maxArchivedEntries) {
    signals.push({
      kind: "archive_overflow",
      status: "attention",
      summary: `Archive holds ${archiveStats.archivedCount} entries, exceeding the ${config.archive.maxArchivedEntries} limit.`,
      metric: { name: "archived_count", value: archiveStats.archivedCount },
    });
  }

  const overallStatus = signals.some((s) => s.status === "degraded")
    ? "degraded"
    : signals.length > 0
      ? "attention"
      : "healthy";

  return {
    scope: request.scope,
    generatedAt: new Date().toISOString(),
    status: overallStatus,
    signals,
    stats: {
      lastIngestAt: ingestionStates[0]?.last_run_at ?? null,
      stalePipelines: stalePipelines.length,
      failedPipelines: ingestionStates.filter((state) => state.last_status === "error").length,
      retrievalCoverage: null,
      activeMemoryEntries: archiveStats.activeCount,
      archivedMemoryEntries: archiveStats.archivedCount,
    },
  };
}

// ---------------------------------------------------------------------------
// Export Bundles
// ---------------------------------------------------------------------------

export interface ExportBundleRequest {
  includeArchived?: boolean;
  includeRejected?: boolean;
  includeVersionHistory?: boolean;
  retentionClasses?: MemoryRetentionClass[];
  format?: "json" | "markdown";
}

export interface ExportBundleEntry {
  id: string;
  kind: string;
  title: string;
  body: string;
  summary: string | null;
  retentionClass: string;
  reviewStatus: string;
  reviewNotes: string | null;
  confidence: { score: number | null; reason: string | null };
  uncertainty: string | null;
  author: { type: string; id: string | null };
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  archivedAt: string | null;
  origins: Array<{ type: string; id: string; relationship: string }>;
  tags: string[];
  versions?: MemoryEntryVersion[];
}

export interface ExportBundle {
  exportedAt: string;
  entryCount: number;
  format: "json" | "markdown";
  config: ReturnType<typeof getMemoryConfig>;
  entries: ExportBundleEntry[];
  markdown?: string;
}

/**
 * Export memory entries with full provenance, review history, and
 * version tracking. Suitable for compliance audits and backup.
 */
export function memoryExportBundle(request: ExportBundleRequest = {}): ExportBundle {
  const format = request.format ?? "json";
  const includeArchived = request.includeArchived ?? false;
  const includeRejected = request.includeRejected ?? false;
  const includeVersionHistory = request.includeVersionHistory ?? true;

  const allEntries = listMemoryEntries({ limit: 10_000 });

  const filtered = allEntries.filter((entry) => {
    if (!includeArchived && entry.archived_at) return false;
    if (!includeRejected && entry.review_status === "rejected") return false;
    if (request.retentionClasses?.length && !request.retentionClasses.includes(entry.retention_class)) return false;
    return true;
  });

  const bundleEntries: ExportBundleEntry[] = filtered.map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    title: entry.title,
    body: entry.body,
    summary: entry.summary,
    retentionClass: entry.retention_class,
    reviewStatus: entry.review_status,
    reviewNotes: entry.review_notes,
    confidence: {
      score: entry.confidence_score,
      reason: entry.confidence_reason,
    },
    uncertainty: entry.uncertainty_summary,
    author: { type: entry.author_type, id: entry.author_id },
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    reviewedAt: entry.reviewed_at,
    reviewedBy: entry.reviewed_by,
    archivedAt: entry.archived_at,
    origins: entry.origins.map((o) => ({
      type: o.origin_type,
      id: o.origin_id,
      relationship: o.relationship,
    })),
    tags: entry.tags.map((t) => t.tag),
    versions: includeVersionHistory ? listMemoryEntryVersions(entry.id) : undefined,
  }));

  const now = new Date().toISOString();
  const config = getMemoryConfig();

  const bundle: ExportBundle = {
    exportedAt: now,
    entryCount: bundleEntries.length,
    format,
    config,
    entries: bundleEntries,
  };

  if (format === "markdown") {
    bundle.markdown = renderBundleMarkdown(bundle);
  }

  return bundle;
}

function renderBundleMarkdown(bundle: ExportBundle): string {
  const lines: string[] = [
    "# OpenTrust Memory Export",
    "",
    `Exported at: ${bundle.exportedAt}`,
    `Entries: ${bundle.entryCount}`,
    "",
    "---",
    "",
  ];

  for (const entry of bundle.entries) {
    lines.push(`## ${entry.title}`);
    lines.push("");
    lines.push(`- **ID:** ${entry.id}`);
    lines.push(`- **Kind:** ${entry.kind}`);
    lines.push(`- **Retention:** ${entry.retentionClass}`);
    lines.push(`- **Review:** ${entry.reviewStatus}`);
    if (entry.confidence.score != null) {
      lines.push(`- **Confidence:** ${entry.confidence.score} — ${entry.confidence.reason ?? "no reason"}`);
    }
    if (entry.archivedAt) {
      lines.push(`- **Archived:** ${entry.archivedAt}`);
    }
    lines.push(`- **Author:** ${entry.author.type}${entry.author.id ? ` (${entry.author.id})` : ""}`);
    lines.push(`- **Created:** ${entry.createdAt}`);
    lines.push(`- **Updated:** ${entry.updatedAt}`);

    if (entry.origins.length > 0) {
      lines.push("");
      lines.push("### Origins");
      for (const o of entry.origins) {
        lines.push(`- ${o.relationship}: ${o.type}/${o.id}`);
      }
    }

    if (entry.tags.length > 0) {
      lines.push("");
      lines.push(`**Tags:** ${entry.tags.join(", ")}`);
    }

    lines.push("");
    lines.push("### Content");
    lines.push("");
    lines.push(entry.body);

    if (entry.versions?.length) {
      lines.push("");
      lines.push("### Version History");
      lines.push("");
      for (const v of entry.versions) {
        lines.push(`- v${v.version} (${v.changed_at}) by ${v.changed_by_type}${v.changed_by_id ? ` (${v.changed_by_id})` : ""}${v.change_reason ? ` — ${v.change_reason}` : ""}`);
      }
    }

    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}
