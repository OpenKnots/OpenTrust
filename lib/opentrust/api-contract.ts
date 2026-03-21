import type {
  MemoryHealthRequest,
  MemoryHealthScope,
  MemoryInspectRequest,
  MemoryPromoteRequest,
  MemoryRetentionClass,
  MemoryReviewStatus,
  MemorySearchRequest,
  MemorySourceType,
} from "@/lib/types";

const MEMORY_SOURCE_TYPES: MemorySourceType[] = [
  "trace",
  "event",
  "workflowRun",
  "workflowStep",
  "artifact",
  "savedInvestigation",
  "memoryEntry",
  "insight",
];

const MEMORY_REVIEW_STATUSES: MemoryReviewStatus[] = ["draft", "reviewed", "approved", "rejected"];
const MEMORY_RETENTION_CLASSES: MemoryRetentionClass[] = ["ephemeral", "working", "longTerm", "pinned"];
const MEMORY_HEALTH_SCOPES: MemoryHealthScope[] = ["global", "ingestion", "retrieval", "indexing", "source"];
const INTERNAL_ERROR_MESSAGE = "Unexpected server error";

export class ApiValidationError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, options?: { status?: number; code?: string; details?: Record<string, unknown> }) {
    super(message);
    this.name = "ApiValidationError";
    this.status = options?.status ?? 400;
    this.code = options?.code ?? "invalid_request";
    this.details = options?.details;
  }
}

export function ok<T>(data: T) {
  return { ok: true as const, data };
}

export function fail(error: unknown) {
  if (error instanceof ApiValidationError) {
    return {
      ok: false as const,
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      },
      status: error.status,
    };
  }

  console.error("Unhandled API error", error);

  return {
    ok: false as const,
    error: {
      code: "internal_error",
      message: INTERNAL_ERROR_MESSAGE,
      details: null,
    },
    status: 500,
  };
}

export async function readJson(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new ApiValidationError("Expected application/json request body", {
      status: 415,
      code: "unsupported_media_type",
    });
  }

  try {
    return await request.json();
  } catch {
    throw new ApiValidationError("Malformed JSON body", {
      status: 400,
      code: "invalid_json",
    });
  }
}

function asString(value: unknown, field: string, { required = false }: { required?: boolean } = {}) {
  if (value == null || value === "") {
    if (required) throw new ApiValidationError(`Missing ${field}`, { details: { field } });
    return undefined;
  }
  if (typeof value !== "string") {
    throw new ApiValidationError(`Expected ${field} to be a string`, { details: { field } });
  }
  return value;
}

function asNumber(value: unknown, field: string) {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new ApiValidationError(`Expected ${field} to be a finite number`, { details: { field } });
  }
  return n;
}

function asEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
  { required = false }: { required?: boolean } = {},
) {
  if (value == null || value === "") {
    if (required) throw new ApiValidationError(`Missing ${field}`, { details: { field } });
    return undefined;
  }
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ApiValidationError(`Invalid ${field}`, { details: { field, allowed } });
  }
  return value as T;
}

export function parseSearchRequest(input: unknown): MemorySearchRequest {
  const body = (input ?? {}) as Record<string, unknown>;
  const query = asString(body.query, "query", { required: true })!;
  const limit = asNumber(body.limit, "limit");
  if (limit != null && (limit < 1 || limit > 100)) {
    throw new ApiValidationError("limit must be between 1 and 100", { details: { field: "limit" } });
  }

  const scopeInput = (body.scope ?? {}) as Record<string, unknown>;
  const retentionClasses = Array.isArray(scopeInput.retentionClasses)
    ? scopeInput.retentionClasses.map((value) =>
        asEnum(value, MEMORY_RETENTION_CLASSES, "scope.retentionClasses[]", { required: true })!,
      )
    : undefined;

  return {
    query,
    limit,
    mode: asEnum(body.mode, ["auto", "lexical", "semantic", "hybrid", "sql"] as const, "mode"),
    includeRelated: typeof body.includeRelated === "boolean" ? body.includeRelated : undefined,
    includeRaw: typeof body.includeRaw === "boolean" ? body.includeRaw : undefined,
    minConfidence: asNumber(body.minConfidence, "minConfidence"),
    scope: {
      retentionClasses,
    },
  };
}

export function parseInspectRequest(input: unknown): MemoryInspectRequest {
  const body = (input ?? {}) as Record<string, unknown>;
  const ref = (body.ref ?? {}) as Record<string, unknown>;

  return {
    ref: {
      type: asEnum(ref.type, MEMORY_SOURCE_TYPES, "ref.type", { required: true })!,
      id: asString(ref.id, "ref.id", { required: true })!,
    },
    includeLineage: typeof body.includeLineage === "boolean" ? body.includeLineage : undefined,
    includeRaw: typeof body.includeRaw === "boolean" ? body.includeRaw : undefined,
    includeRelated: typeof body.includeRelated === "boolean" ? body.includeRelated : undefined,
  };
}

export function parseHealthRequest(input: unknown): MemoryHealthRequest {
  const body = (input ?? {}) as Record<string, unknown>;
  return {
    scope: asEnum(body.scope, MEMORY_HEALTH_SCOPES, "scope", { required: true })!,
    sourceId: asString(body.sourceId, "sourceId"),
  };
}

export function parsePromoteRequest(input: unknown): MemoryPromoteRequest {
  const body = (input ?? {}) as Record<string, unknown>;
  const originRefs = body.originRefs;
  if (!Array.isArray(originRefs) || originRefs.length === 0) {
    throw new ApiValidationError("originRefs must be a non-empty array", { details: { field: "originRefs" } });
  }

  const author = (body.author ?? {}) as Record<string, unknown>;
  const review = (body.review ?? {}) as Record<string, unknown>;
  const confidence = (body.confidence ?? {}) as Record<string, unknown>;

  return {
    kind: "memoryEntry",
    title: asString(body.title, "title", { required: true })!,
    body: asString(body.body, "body", { required: true })!,
    summary: asString(body.summary, "summary"),
    retentionClass: asEnum(body.retentionClass, MEMORY_RETENTION_CLASSES, "retentionClass", { required: true })!,
    tags: Array.isArray(body.tags)
      ? body.tags.map((tag) => asString(tag, "tags[]", { required: true })!)
      : undefined,
    confidence: body.confidence && typeof body.confidence === "object"
      ? {
          score: asNumber(confidence.score, "confidence.score"),
          reason: asString(confidence.reason, "confidence.reason"),
        }
      : undefined,
    uncertaintySummary: asString(body.uncertaintySummary, "uncertaintySummary"),
    review: body.review && typeof body.review === "object"
      ? {
          status: asEnum(review.status, MEMORY_REVIEW_STATUSES, "review.status", { required: true })!,
          reviewerId: asString(review.reviewerId, "review.reviewerId"),
          notes: asString(review.notes, "review.notes"),
        }
      : undefined,
    author: {
      type: asEnum(author.type, ["user", "agent", "system"] as const, "author.type", { required: true })!,
      id: asString(author.id, "author.id"),
    },
    originRefs: originRefs.map((item, index) => {
      const ref = item as Record<string, unknown>;
      return {
        type: asEnum(ref.type, MEMORY_SOURCE_TYPES, `originRefs[${index}].type`, { required: true })!,
        id: asString(ref.id, `originRefs[${index}].id`, { required: true })!,
      };
    }),
  };
}

export function parseSearchQuery(url: URL): MemorySearchRequest {
  return parseSearchRequest({
    query: url.searchParams.get("q"),
    limit: url.searchParams.get("limit"),
    scope: {
      retentionClasses: url.searchParams.get("retention") ? [url.searchParams.get("retention")] : undefined,
    },
  });
}

export function parseInspectQuery(url: URL): MemoryInspectRequest {
  return parseInspectRequest({
    ref: {
      id: url.searchParams.get("id"),
      type: url.searchParams.get("type") ?? "memoryEntry",
    },
    includeLineage: true,
    includeRelated: true,
    includeRaw: true,
  });
}

export function parseHealthQuery(url: URL): MemoryHealthRequest {
  return parseHealthRequest({
    scope: url.searchParams.get("scope") ?? "global",
    sourceId: url.searchParams.get("sourceId") ?? undefined,
  });
}

export function filterSearchResultsByReview<T extends { whyMatched: { rankingSignals: string[] } }>(
  results: T[],
  review?: string,
) {
  if (!review) return results;
  const allowed = asEnum(review, MEMORY_REVIEW_STATUSES, "review");
  if (!allowed) return results;
  return results.filter((result) => result.whyMatched.rankingSignals.includes(`review_${allowed}`));
}
