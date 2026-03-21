import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import {
  getMemoryEntry,
  listMemoryEntries,
  promoteToMemory,
} from "@/lib/opentrust/memory-entries";
import type {
  MemoryHealthRequest,
  MemoryHealthResponse,
  MemoryInspectRequest,
  MemoryPromoteRequest,
  MemoryPromoteResponse,
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

export function memoryHealth(request: MemoryHealthRequest): MemoryHealthResponse {
  const ingestionStates = getIngestionStates();
  const stalePipelines = ingestionStates.filter((state) => {
    if (!state.last_run_at) return true;
    return Date.now() - new Date(state.last_run_at).getTime() > 1000 * 60 * 60 * 8;
  });

  const signals = stalePipelines.map((state) => ({
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

  return {
    scope: request.scope,
    generatedAt: new Date().toISOString(),
    status: stalePipelines.length > 0 ? "attention" : "healthy",
    signals,
    stats: {
      lastIngestAt: ingestionStates[0]?.last_run_at ?? null,
      stalePipelines: stalePipelines.length,
      failedPipelines: ingestionStates.filter((state) => state.last_status === "error").length,
      retrievalCoverage: null,
    },
  };
}
