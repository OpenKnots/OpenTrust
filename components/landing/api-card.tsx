"use client";

import { CheckCircle2 } from "lucide-react";
import { CodeBlock, type CodeHighlight } from "@/components/code-block";
import { DemoSection } from "@/components/ui/demo-section";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";

const MOLTY_ICON = "https://openclaw.ai/favicon.svg";

export function ApiCard({
  method,
  methodTone,
  name,
  desc,
  code,
  language,
  highlights,
  variant,
}: {
  method: string;
  methodTone: "post" | "get";
  name: string;
  desc: string;
  code: string;
  language: "json" | "typescript" | "bash";
  highlights: CodeHighlight[];
  variant: "search" | "inspect" | "promote" | "health";
}) {
  const demoResults = {
    search: {
      results: [
        { id: "mem_queue_regression", title: "Queue backlog regression", confidence: 0.94, source: "trace" },
        { id: "trace_deploy_123", title: "Deployment timing shift", confidence: 0.88, source: "trace" },
      ],
      mode: "hybrid",
      count: 2,
    },
    inspect: {
      type: "memoryEntry",
      title: "Queue backlog regression",
      body: "Consumer timing shifted after deployment and delayed downstream checks.",
      origins: [{ type: "trace", id: "trace_queue_abc" }],
      lineage: { parent: "trace_deploy_parent", children: 3 },
    },
    promote: {
      status: "success",
      memoryId: "mem_queue_regression_new",
      retentionClass: "longTerm",
      reviewStatus: "draft",
    },
    health: {
      status: "healthy",
      signals: [
        { kind: "ingestion_freshness", status: "fresh", hours: 1 },
        { kind: "semantic_coverage", status: "healthy", percentage: 94 },
      ],
      stalePipelines: 0,
    },
  };

  async function handleRun() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return demoResults[variant];
  }

  function renderResult(result: any) {
    if (!result) return null;

    if (variant === "search") {
      return (
        <GlassCard variant="inset">
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: 12 }}>
            <StatusBadge label={`${result.count} results`} status="healthy" /> · Mode: {result.mode}
          </div>
          {result.results.map((item: any) => (
            <div key={item.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Confidence: {(item.confidence * 100).toFixed(0)}% · Source: {item.source} · ID: {item.id}
              </div>
            </div>
          ))}
        </GlassCard>
      );
    }

    if (variant === "inspect") {
      return (
        <GlassCard variant="inset">
          <div style={{ marginBottom: 12 }}>
            <StatusBadge label={result.type} status="active" />
          </div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>{result.title}</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: 12 }}>{result.body}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Origins: {result.origins.length} · Lineage: {result.lineage.children} children
          </div>
        </GlassCard>
      );
    }

    if (variant === "promote") {
      return (
        <GlassCard variant="inset">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
            <span style={{ fontWeight: 500, color: "var(--success)" }}>Memory entry created</span>
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6 }}>
            <div>Memory ID: <code>{result.memoryId}</code></div>
            <div>Retention: <StatusBadge label={result.retentionClass} tone="success" /></div>
            <div>Review: <StatusBadge label={result.reviewStatus} tone="warning" /></div>
          </div>
        </GlassCard>
      );
    }

    if (variant === "health") {
      return (
        <GlassCard variant="inset">
          <div style={{ marginBottom: 12 }}>
            <StatusBadge label={result.status} status="healthy" pulse />
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 8 }}>
            {result.signals.map((signal: any) => (
              <div key={signal.kind} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{signal.kind}</span>
                <StatusBadge label={signal.status} status="healthy" />
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Stale pipelines: {result.stalePipelines}
            </div>
          </div>
        </GlassCard>
      );
    }

    return null;
  }

  return (
    <DemoSection
      title={name}
      description={desc}
      icon={<img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--api" />}
      onRun={handleRun}
      renderResult={renderResult}
      runLabel="Run Demo"
      className={`landing-api-card landing-api-card--${variant}`}
    >
      <div className="landing-api-card__header">
        <span className={`landing-api-card__method landing-api-card__method--${methodTone}`}>{method}</span>
        <span className="landing-api-card__name">{name}</span>
      </div>
      <div className="landing-api-card__body">
        <CodeBlock language={language} showLineNumbers={false} code={code} highlights={highlights} />
      </div>
    </DemoSection>
  );
}
