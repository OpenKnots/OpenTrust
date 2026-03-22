"use client";

import { useState, useMemo, useCallback } from "react";
import { CodeBlock } from "@/components/code-block";
import { JsonEditor } from "@/components/json-editor";
import type {
  MemorySearchRequest,
  MemorySearchResponse,
  MemoryInspectRequest,
  MemoryPromoteRequest,
  MemoryPromoteResponse,
  MemoryHealthRequest,
  MemoryHealthResponse,
} from "@/lib/types";

const MOLTY_ICON = "https://openclaw.ai/favicon.svg";

type EndpointId = "memory_search" | "memory_inspect" | "memory_promote" | "memory_health";

interface Endpoint {
  id: EndpointId;
  method: "POST" | "GET";
  name: string;
  description: string;
  examplePayload: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: "memory_search",
    method: "POST",
    name: "memory_search",
    description: "Search memory with scope, mode, and confidence filters",
    examplePayload: JSON.stringify(
      {
        query: "deployment regression",
        mode: "hybrid",
        limit: 5,
        minConfidence: 0.5,
      } satisfies MemorySearchRequest,
      null,
      2
    ),
  },
  {
    id: "memory_inspect",
    method: "POST",
    name: "memory_inspect",
    description: "Inspect a memory entry with lineage and raw evidence",
    examplePayload: JSON.stringify(
      {
        ref: { type: "memoryEntry", id: "mem_example" },
        includeLineage: true,
        includeRaw: true,
      } satisfies MemoryInspectRequest,
      null,
      2
    ),
  },
  {
    id: "memory_promote",
    method: "POST",
    name: "memory_promote",
    description: "Promote evidence to curated memory with retention class",
    examplePayload: JSON.stringify(
      {
        kind: "memoryEntry",
        title: "Queue processing delay",
        body: "Consumer lag increased after deploy.",
        originRefs: [{ type: "trace", id: "trace_abc" }],
        retentionClass: "working",
        review: { status: "draft" },
        author: { type: "agent" },
      } satisfies MemoryPromoteRequest,
      null,
      2
    ),
  },
  {
    id: "memory_health",
    method: "GET",
    name: "memory_health",
    description: "Get health status and freshness signals",
    examplePayload: JSON.stringify(
      {
        scope: "global",
      } satisfies MemoryHealthRequest,
      null,
      2
    ),
  },
];

function generateMockSearchResponse(): MemorySearchResponse {
  return {
    query: "deployment regression",
    modeUsed: "hybrid",
    generatedAt: new Date().toISOString(),
    results: [
      {
        id: "result_1",
        sourceType: "trace",
        sourceRef: { table: "traces", id: "trace_deploy_001" },
        title: "Deployment regression detected in queue consumer",
        snippet: "Consumer lag increased from 2ms to 140ms after deploy 3.2.1...",
        summary: "Performance degradation in queue processing after recent deployment",
        provenance: {
          originRefs: [{ type: "trace", id: "trace_deploy_001" }],
          observedAt: new Date(Date.now() - 3600000).toISOString(),
          ingestedAt: new Date(Date.now() - 1800000).toISOString(),
          derived: false,
          authorType: "system",
        },
        confidence: {
          score: 0.89,
          band: "high",
          reason: "Direct trace evidence with timing metrics",
        },
        freshness: {
          status: "fresh",
          lastUpdatedAt: new Date(Date.now() - 1800000).toISOString(),
        },
        whyMatched: {
          matchedTerms: ["deployment", "regression", "queue"],
          rankingSignals: ["lexical_match", "semantic_similarity", "recency"],
          explanation: "Matched on deployment and regression terms with strong semantic alignment",
        },
        uncertainty: {
          status: "low",
          summary: "High confidence match with direct trace evidence",
        },
        relatedRefs: [{ type: "trace", id: "trace_deploy_002" }],
        rawAvailable: true,
      },
    ],
    stats: {
      searchedSources: 3,
      candidateCount: 42,
      returnedCount: 1,
    },
  };
}

function generateMockInspectResponse() {
  return {
    ok: true,
    entry: {
      id: "mem_example",
      kind: "fact",
      title: "Example memory entry",
      body: "This is a mock memory entry for demonstration purposes.",
      summary: "Mock entry demonstrating memory inspection",
      retention_class: "working",
      review_status: "approved",
      review_notes: null,
      confidence_score: 0.92,
      confidence_reason: "Backed by multiple trace sources",
      uncertainty_summary: null,
      author_type: "agent",
      author_id: "agent_001",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 43200000).toISOString(),
      reviewed_at: new Date(Date.now() - 21600000).toISOString(),
      reviewed_by: "operator_001",
    },
    lineage: [
      {
        memory_entry_id: "mem_example",
        origin_type: "trace",
        origin_id: "trace_abc",
        relationship: "derived_from",
      },
    ],
    raw: {
      trace_abc: {
        id: "trace_abc",
        title: "Original trace event",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    },
  };
}

function generateMockPromoteResponse(): MemoryPromoteResponse {
  return {
    ok: true,
    entry: {
      id: `mem_${Math.random().toString(36).slice(2, 9)}`,
      kind: "memoryEntry",
      retentionClass: "working",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

function generateMockHealthResponse(): MemoryHealthResponse {
  return {
    scope: "global",
    generatedAt: new Date().toISOString(),
    status: "healthy",
    signals: [
      {
        kind: "ingestion_freshness",
        status: "healthy",
        summary: "All pipelines ingesting within acceptable thresholds",
        metric: { name: "hours_since_last_ingest", value: 0.5 },
      },
      {
        kind: "index_coverage",
        status: "healthy",
        summary: "Semantic index coverage at 94%",
        metric: { name: "coverage_percentage", value: 94 },
      },
      {
        kind: "storage_health",
        status: "healthy",
        summary: "Storage utilization within normal range",
        metric: { name: "storage_gb_used", value: 2.1 },
      },
    ],
    stats: {
      stalePipelines: 0,
      totalMemoryEntries: 38291,
      totalTraces: 891204,
      semanticIndexSize: 38291,
    },
  };
}

export default function ApiPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointId>("memory_search");
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].examplePayload);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const currentEndpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === selectedEndpoint) || ENDPOINTS[0],
    [selectedEndpoint]
  );

  const handleExport = useCallback(() => {
    if (!response) return;
    const blob = new Blob([response], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedEndpoint}-response.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [response, selectedEndpoint]);

  const handleEndpointChange = (endpointId: EndpointId) => {
    const endpoint = ENDPOINTS.find((e) => e.id === endpointId);
    if (endpoint) {
      setSelectedEndpoint(endpointId);
      setRequestBody(endpoint.examplePayload);
      setResponse(null);
      setResponseTime(null);
      setStatusCode(null);
    }
  };

  const handleRun = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));

    try {
      // Validate JSON
      JSON.parse(requestBody);

      // Generate mock response based on endpoint
      let mockResponse: unknown;
      switch (selectedEndpoint) {
        case "memory_search":
          mockResponse = generateMockSearchResponse();
          break;
        case "memory_inspect":
          mockResponse = generateMockInspectResponse();
          break;
        case "memory_promote":
          mockResponse = generateMockPromoteResponse();
          break;
        case "memory_health":
          mockResponse = generateMockHealthResponse();
          break;
      }

      const endTime = Date.now();
      setResponse(JSON.stringify(mockResponse, null, 2));
      setResponseTime(endTime - startTime);
      setStatusCode(200);
    } catch (err) {
      const endTime = Date.now();
      setResponse(
        JSON.stringify(
          {
            error: "Invalid JSON in request body",
            message: err instanceof Error ? err.message : "Unknown error",
          },
          null,
          2
        )
      );
      setResponseTime(endTime - startTime);
      setStatusCode(400);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="api-playground">
      <div className="api-playground__header">
        <div className="api-playground__header-top">
          <img src={MOLTY_ICON} alt="Molty" className="api-playground__molty" />
          <h1 className="api-playground__title">API Playground</h1>
        </div>
        <p className="api-playground__subtitle">
          Explore the Memory API with live requests against your local OpenTrust instance.
        </p>
      </div>

      <div className="api-playground__main">
        <div className="api-playground__panel api-playground__panel--request">
          <div className="api-playground__panel-header">
            <h2 className="api-playground__panel-title">Request</h2>
          </div>

          <div className="api-playground__endpoints">
            {ENDPOINTS.map((endpoint) => (
              <button
                key={endpoint.id}
                className={`api-playground__endpoint${selectedEndpoint === endpoint.id ? " api-playground__endpoint--active" : ""}`}
                onClick={() => handleEndpointChange(endpoint.id)}
                type="button"
              >
                <div className="api-playground__endpoint-header">
                  <span
                    className={`api-playground__method api-playground__method--${endpoint.method.toLowerCase()}`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="api-playground__endpoint-name">{endpoint.name}</span>
                </div>
                <p className="api-playground__endpoint-desc">{endpoint.description}</p>
              </button>
            ))}
          </div>

          <div className="api-playground__editor">
            <div className="api-playground__editor-header">
              <span className="api-playground__editor-label">Request Body</span>
              {requestBody !== currentEndpoint.examplePayload && (
                <button
                  type="button"
                  className="api-playground__reset-btn"
                  onClick={() => setRequestBody(currentEndpoint.examplePayload)}
                >
                  Reset
                </button>
              )}
            </div>
            <JsonEditor
              value={requestBody}
              onChange={setRequestBody}
              minHeight={180}
            />
          </div>

          <button
            className="api-playground__run-btn"
            onClick={handleRun}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "Running..." : "Run"}
          </button>
        </div>

        <div className="api-playground__panel api-playground__panel--response">
          <div className="api-playground__panel-header">
            <h2 className="api-playground__panel-title">Response</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {responseTime !== null && statusCode !== null && (
                <div className="api-playground__response-meta">
                  <span
                    className={`api-playground__status api-playground__status--${statusCode === 200 ? "success" : "error"}`}
                  >
                    {statusCode}
                  </span>
                  <span className="api-playground__response-time">{responseTime}ms</span>
                  <span className="api-playground__content-type">application/json</span>
                </div>
              )}
              {response !== null && (
                <button
                  type="button"
                  className="api-playground__export-btn"
                  onClick={handleExport}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a.75.75 0 0 1 .75.75v6.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.75A.75.75 0 0 1 8 1ZM2.75 11a.75.75 0 0 1 .75.75v1.5h9v-1.5a.75.75 0 0 1 1.5 0v1.5A1.5 1.5 0 0 1 12.5 14.75h-9A1.5 1.5 0 0 1 2 13.25v-1.5a.75.75 0 0 1 .75-.75Z"/>
                  </svg>
                  Export
                </button>
              )}
            </div>
          </div>

          <div className="api-playground__response-content">
            {response === null ? (
              <div className="api-playground__empty-state">
                <p className="api-playground__empty-text">
                  Select an endpoint and click Run to see the response
                </p>
              </div>
            ) : (
              <div
                className={`api-playground__response-wrapper${isLoading ? " api-playground__response-wrapper--loading" : ""}`}
              >
                <CodeBlock code={response} language="json" showLineNumbers={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
