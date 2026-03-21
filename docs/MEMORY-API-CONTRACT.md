# OpenClaw Memory API Contract

## Purpose

This document defines the first formal contract for how OpenClaw should interact with the OpenTrust memory layer.

It covers:
- retrieval contracts
- writeback / promotion contracts
- health contracts
- provenance and confidence metadata
- core interface expectations for future OpenClaw integration

This is an API **standard** document first.
Implementation transport can vary later:
- local library calls
- internal HTTP endpoints
- CLI bindings
- tool interfaces
- future RPC or service wrappers

## Design goals

The memory API must be:
- reliable
- evidence-backed
- provenance-aware
- explainable
- safe for agents to consume
- useful for operators to inspect
- evolvable without breaking meaning

## Contract families

### 1. Retrieval
Find relevant prior evidence, memory, traces, artifacts, or derived insights.

### 2. Writeback / promotion
Promote or record new curated memory entries with provenance and review metadata.

### 3. Health
Expose freshness, degradation, indexing status, and trust-relevant operational signals.

### 4. Inspection
Allow operators and tools to inspect references, lineage, and raw evidence around a result.

---

# 1. Retrieval contract

## Retrieval request

```json
{
  "query": "string",
  "scope": {
    "sources": ["sessions", "workflows", "artifacts", "memoryEntries", "insights"],
    "sessionIds": ["optional"],
    "workflowIds": ["optional"],
    "artifactKinds": ["optional"],
    "timeRange": {
      "from": "optional-iso8601",
      "to": "optional-iso8601"
    },
    "tags": ["optional"],
    "retentionClasses": ["optional"]
  },
  "mode": "auto|lexical|semantic|hybrid|sql",
  "limit": 10,
  "includeRelated": true,
  "includeRaw": false,
  "minConfidence": 0.0
}
```

## Retrieval response

```json
{
  "query": "string",
  "modeUsed": "hybrid",
  "generatedAt": "iso8601",
  "results": [
    {
      "id": "mem_123",
      "sourceType": "memoryEntry",
      "sourceRef": {
        "table": "memory_entries",
        "id": "mem_123"
      },
      "title": "Queue backlog regression after deploy",
      "snippet": "Observed queue depth increased after deployment and follow-up evidence tied the shift to consumer timing.",
      "summary": "Short evidence-backed summary",
      "provenance": {
        "originRefs": [
          { "type": "trace", "id": "trace_abc" },
          { "type": "artifact", "id": "artifact_xyz" }
        ],
        "observedAt": "iso8601",
        "ingestedAt": "iso8601",
        "derived": true,
        "authorType": "user|agent|system",
        "authorId": "optional"
      },
      "confidence": {
        "score": 0.84,
        "band": "high",
        "reason": "Matched semantically and lexically across multiple supporting artifacts."
      },
      "freshness": {
        "status": "fresh|aging|stale|unknown",
        "lastUpdatedAt": "iso8601"
      },
      "whyMatched": {
        "matchedTerms": ["queue", "deploy"],
        "rankingSignals": ["semantic", "lexical", "lineage_boost", "recency"],
        "explanation": "Surfaced because it shares deployment-related evidence with the current investigation and has supporting artifacts."
      },
      "uncertainty": {
        "status": "low|medium|high|unknown",
        "summary": "Open follow-up remains, so causal certainty is not complete."
      },
      "relatedRefs": [
        { "type": "workflowRun", "id": "wf_456" },
        { "type": "artifact", "id": "artifact_xyz" }
      ],
      "rawAvailable": true
    }
  ],
  "stats": {
    "searchedSources": 4,
    "candidateCount": 128,
    "returnedCount": 10
  }
}
```

## Retrieval result requirements

Every result should eventually support:
- stable `id`
- explicit `sourceType`
- reproducible `sourceRef`
- human-usable `snippet` or summary
- provenance block
- confidence block
- freshness block
- `whyMatched` explanation
- related references
- inspectable raw evidence path

## Retrieval source types

Expected initial source types:
- `trace`
- `event`
- `workflowRun`
- `workflowStep`
- `artifact`
- `savedInvestigation`
- `memoryEntry`
- `insight`

---

# 2. Writeback / promotion contract

## Purpose

Writeback is how transient evidence becomes durable curated memory.

This should be explicit and reviewable.
The system should not silently turn every derived summary into long-term memory.

## Promotion request

```json
{
  "kind": "memoryEntry",
  "title": "string",
  "body": "string",
  "summary": "optional-string",
  "originRefs": [
    { "type": "trace", "id": "trace_abc" },
    { "type": "artifact", "id": "artifact_xyz" }
  ],
  "retentionClass": "ephemeral|working|longTerm|pinned",
  "tags": ["optional"],
  "confidence": {
    "score": 0.78,
    "reason": "Evidence supported by multiple sources"
  },
  "review": {
    "status": "draft|reviewed|approved",
    "reviewerId": "optional",
    "notes": "optional"
  },
  "author": {
    "type": "user|agent|system",
    "id": "optional"
  }
}
```

## Promotion response

```json
{
  "ok": true,
  "entry": {
    "id": "mem_123",
    "kind": "memoryEntry",
    "retentionClass": "longTerm",
    "createdAt": "iso8601",
    "updatedAt": "iso8601"
  }
}
```

## Writeback rules

### Required
- origin references
- author metadata
- timestamps
- retention class
- review state
- durable stable ID

### Strongly recommended
- confidence metadata
- uncertainty notes when applicable
- tags
- linkage to related traces/workflows/artifacts

### Never omit
- provenance
- author/source origin
- whether content is observed, derived, or curated

---

# 3. Health contract

## Health request

Health should be queriable at multiple scopes:
- global memory layer
- specific source
- specific ingestion pipeline
- semantic indexing subsystem
- retrieval subsystem

```json
{
  "scope": "global|ingestion|retrieval|indexing|source",
  "sourceId": "optional"
}
```

## Health response

```json
{
  "scope": "global",
  "generatedAt": "iso8601",
  "status": "healthy|attention|degraded",
  "signals": [
    {
      "kind": "ingestion_freshness",
      "status": "attention",
      "summary": "Cron ingestion has not run in 9 hours.",
      "metric": {
        "name": "hours_since_ingest",
        "value": 9
      },
      "sourceRef": {
        "type": "ingestionPipeline",
        "id": "cron"
      }
    }
  ],
  "stats": {
    "lastIngestAt": "iso8601",
    "lastIndexAt": "iso8601",
    "stalePipelines": 1,
    "failedPipelines": 0,
    "retrievalCoverage": 0.82
  }
}
```

## Required health signal types

- `ingestion_freshness`
- `index_freshness`
- `pipeline_failure`
- `retrieval_degradation`
- `source_staleness`
- `coverage_gap`
- `schema_drift` (when detectable)

---

# 4. Inspection contract

## Purpose

Agents can consume retrieval results.
Operators need to inspect them.
Inspection contracts expose the surrounding evidence graph.

## Inspection request

```json
{
  "ref": {
    "type": "memoryEntry",
    "id": "mem_123"
  },
  "includeLineage": true,
  "includeRaw": true,
  "includeRelated": true
}
```

## Inspection response

```json
{
  "ref": {
    "type": "memoryEntry",
    "id": "mem_123"
  },
  "entity": {
    "title": "Queue backlog regression after deploy",
    "body": "..."
  },
  "lineage": [
    { "type": "trace", "id": "trace_abc" },
    { "type": "artifact", "id": "artifact_xyz" }
  ],
  "related": [
    { "type": "workflowRun", "id": "wf_456" }
  ],
  "raw": {
    "available": true,
    "format": "json",
    "ref": "trace_abc:event_17"
  }
}
```

---

# 5. Confidence and uncertainty standard

## Confidence bands

Suggested standard:
- `very_low`
- `low`
- `medium`
- `high`
- `very_high`

## Uncertainty status

Suggested standard:
- `low`
- `medium`
- `high`
- `unknown`

## Rule

Confidence should reflect:
- retrieval quality
- evidence breadth
- provenance strength
- recency/freshness

It should **not** imply metaphysical truth.
It is a memory/retrieval confidence score, not a guarantee.

---

# 6. Minimal v1 interface set

The first formal OpenClaw memory interface should expose at least:

- `memory.search(request)`
- `memory.inspect(ref)`
- `memory.health(request)`
- `memory.promote(request)`

Optional next:
- `memory.listInsights(request)`
- `memory.listSignals(request)`
- `memory.updateEntry(request)`
- `memory.exportBundle(request)`

---

# 7. Scope guardrails

This contract is for:
- OpenClaw memory infrastructure
- explainable retrieval
- safe writeback
- operator trust

It is not for:
- generic note-taking APIs
- arbitrary vector DB vendor abstractions
- vague “AI memory” claims without provenance

## Decision

OpenTrust should implement toward this contract.
This contract is the clearest path to making OpenTrust a real OpenClaw memory standard rather than just a local evidence browser.
