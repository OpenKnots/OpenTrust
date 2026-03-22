export type CapabilityKind = "skill" | "plugin" | "soul" | "bundle";

export type MemoryEntryKind =
  | "fact"
  | "summary"
  | "decision"
  | "preference"
  | "timeline"
  | "insight"
  | "note";

export type MemoryRetentionClass = "ephemeral" | "working" | "longTerm" | "pinned";

export type MemoryReviewStatus = "draft" | "reviewed" | "approved" | "rejected";

export type MemorySourceType =
  | "trace"
  | "event"
  | "workflowRun"
  | "workflowStep"
  | "artifact"
  | "savedInvestigation"
  | "memoryEntry"
  | "insight";

export type MemoryAuthorType = "user" | "agent" | "system";

export type MemoryHealthScope = "global" | "ingestion" | "retrieval" | "indexing" | "source";

export interface ManualSection {
  id: string;
  title: string;
  summary: string;
}

export interface TraceCardData {
  title: string;
  badge: string;
  summary: string;
  bullets: string[];
}

export interface CapabilityCardData {
  name: string;
  kind: CapabilityKind;
  summary: string;
  evidence: string;
}

export interface QueryExample {
  title: string;
  sql: string;
}

export interface MemoryEntryOrigin {
  memory_entry_id: string;
  origin_type: MemorySourceType;
  origin_id: string;
  relationship: "derived_from" | "supports" | "contradicts" | "supersedes";
}

export interface MemoryEntryTag {
  memory_entry_id: string;
  tag: string;
}

export interface MemoryEntry {
  id: string;
  kind: MemoryEntryKind;
  title: string;
  body: string;
  summary: string | null;
  retention_class: MemoryRetentionClass;
  review_status: MemoryReviewStatus;
  review_notes: string | null;
  confidence_score: number | null;
  confidence_reason: string | null;
  uncertainty_summary: string | null;
  author_type: MemoryAuthorType;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface MemoryPromoteRequest {
  kind: "memoryEntry";
  title: string;
  body: string;
  summary?: string;
  originRefs: Array<{ type: MemorySourceType; id: string }>;
  retentionClass: MemoryRetentionClass;
  tags?: string[];
  confidence?: {
    score?: number;
    reason?: string;
  };
  uncertaintySummary?: string;
  review?: {
    status: MemoryReviewStatus;
    reviewerId?: string;
    notes?: string;
  };
  author: {
    type: MemoryAuthorType;
    id?: string;
  };
}

export interface MemoryPromoteResponse {
  ok: true;
  entry: {
    id: string;
    kind: "memoryEntry";
    retentionClass: MemoryRetentionClass;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MemoryInspectRequest {
  ref: {
    type: MemorySourceType;
    id: string;
  };
  includeLineage?: boolean;
  includeRaw?: boolean;
  includeRelated?: boolean;
}

export interface MemorySearchRequest {
  query: string;
  scope?: {
    sources?: Array<"sessions" | "workflows" | "artifacts" | "memoryEntries" | "insights">;
    sessionIds?: string[];
    workflowIds?: string[];
    artifactKinds?: string[];
    timeRange?: { from?: string; to?: string };
    tags?: string[];
    retentionClasses?: MemoryRetentionClass[];
  };
  mode?: "auto" | "lexical" | "semantic" | "hybrid" | "sql";
  limit?: number;
  includeRelated?: boolean;
  includeRaw?: boolean;
  minConfidence?: number;
}

export interface MemorySearchResult {
  id: string;
  sourceType: MemorySourceType;
  sourceRef: {
    table: string;
    id: string;
  };
  title: string;
  snippet: string;
  summary: string | null;
  provenance: {
    originRefs: Array<{ type: MemorySourceType; id: string }>;
    observedAt?: string;
    ingestedAt?: string;
    derived: boolean;
    authorType?: MemoryAuthorType;
    authorId?: string;
  };
  confidence: {
    score: number | null;
    band: "very_low" | "low" | "medium" | "high" | "very_high" | "unknown";
    reason?: string | null;
  };
  freshness: {
    status: "fresh" | "aging" | "stale" | "unknown";
    lastUpdatedAt?: string;
  };
  whyMatched: {
    matchedTerms?: string[];
    rankingSignals: string[];
    explanation: string;
  };
  uncertainty: {
    status: "low" | "medium" | "high" | "unknown";
    summary?: string | null;
  };
  relatedRefs: Array<{ type: MemorySourceType; id: string }>;
  rawAvailable: boolean;
}

export interface MemorySearchResponse {
  query: string;
  modeUsed: "lexical" | "semantic" | "hybrid" | "sql";
  generatedAt: string;
  results: MemorySearchResult[];
  stats: {
    searchedSources: number;
    candidateCount: number;
    returnedCount: number;
  };
}

export interface MemoryHealthRequest {
  scope: MemoryHealthScope;
  sourceId?: string;
}

export interface MemoryHealthResponse {
  scope: MemoryHealthScope;
  generatedAt: string;
  status: "healthy" | "attention" | "degraded";
  signals: Array<{
    kind: string;
    status: "healthy" | "attention" | "degraded";
    summary: string;
    metric?: { name: string; value: number };
    sourceRef?: { type: string; id: string };
  }>;
  stats: Record<string, string | number | null>;
}
