import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Layers3,
  Search,
  Sparkles,
  Telescope,
  Workflow,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { summarizeHealth } from "@/lib/opentrust/health";
import { getOverview } from "@/lib/opentrust/overview";
import { searchInvestigations } from "@/lib/opentrust/search";
import { getImportedSessionTraces } from "@/lib/opentrust/session-traces";
import { PageHeader } from "@/components/ui/page-header";
import { Pill, StatusDot } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const overview = getOverview();
  const params = (await searchParams) ?? {};
  const query = typeof params.q === "string" ? params.q : "";
  const investigationResults = query ? searchInvestigations(query) : [];
  const importedSessionTraces = getImportedSessionTraces(6);
  const latestIngestion = overview.ingestionStates[0]?.last_run_at ?? "never";
  const health = summarizeHealth({
    traces: overview.recentTraces,
    workflows: overview.recentWorkflows,
    ingestionStates: overview.ingestionStates,
  });

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Operator-grade traceability for sessions, workflows, and artifacts."
      />

      <div className="stats-row">
        <div className="stats-row__item">
          <span className="stats-row__label">Sessions</span>
          <span className="stats-row__value">{overview.counts.sessions}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Traces</span>
          <span className="stats-row__value">{overview.counts.traces}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Workflows</span>
          <span className="stats-row__value">{overview.counts.workflows}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Artifacts</span>
          <span className="stats-row__value">{overview.counts.artifacts}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Chunks</span>
          <span className="stats-row__value">{overview.semanticStatus.chunkCount}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Last ingest</span>
          <span className="stats-row__value">{formatRelativeTime(latestIngestion)}</span>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="section">
            <div className="section__header">
              <div className="section__icon">
                <Telescope size={14} />
                <span className="section__title">Recent traces</span>
              </div>
              <Link href="/traces" className="btn btn--ghost" style={{ fontSize: "0.75rem" }}>
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="list-group">
              {overview.recentTraces.length > 0 ? (
                overview.recentTraces.map((trace) => (
                  <Link key={trace.id} href={`/traces/${encodeURIComponent(trace.id)}`} className="list-item">
                    <StatusDot tone={trace.status === "attention" ? "danger" : trace.status === "streaming" ? "accent" : "success"} />
                    <div className="list-item__content">
                      <span className="list-item__title">{trace.title ?? trace.id}</span>
                      <span className="list-item__subtitle">{trace.summary ?? "No summary yet."}</span>
                    </div>
                    <div className="list-item__meta">
                      <Pill label={trace.status} tone={trace.status === "attention" ? "danger" : trace.status === "streaming" ? "info" : "neutral"} />
                      <span>{formatRelativeTime(trace.updated_at)}</span>
                    </div>
                    <ArrowRight size={14} className="list-item__arrow" />
                  </Link>
                ))
              ) : (
                <EmptyState message="No traces imported yet." />
              )}
            </div>
          </div>

          <div className="section">
            <div className="section__header">
              <div className="section__icon">
                <Workflow size={14} />
                <span className="section__title">Workflow ledger</span>
              </div>
            </div>
            <div className="list-group">
              {overview.recentWorkflows.length > 0 ? (
                overview.recentWorkflows.slice(0, 5).map((workflow) => (
                  <Link key={workflow.id} href={`/workflows/${encodeURIComponent(workflow.id)}`} className="list-item">
                    <StatusDot tone={workflow.status === "error" || workflow.status === "attention" ? "danger" : workflow.status === "active" ? "accent" : "neutral"} />
                    <div className="list-item__content">
                      <span className="list-item__title">{workflow.name}</span>
                      <span className="list-item__subtitle">{workflow.summary ?? "No summary."}</span>
                    </div>
                    <div className="list-item__meta">
                      <Pill label={workflow.status} tone={workflow.status === "error" ? "danger" : "neutral"} />
                    </div>
                    <ArrowRight size={14} className="list-item__arrow" />
                  </Link>
                ))
              ) : (
                <EmptyState message="No workflows tracked yet." />
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="section">
            <div className="section__header">
              <div className="section__icon">
                <AlertTriangle size={14} />
                <span className="section__title">Attention</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className={`attention-item attention-item--${health.attentionTraces > 0 ? "danger" : "neutral"}`}>
                <span className="attention-item__count">{health.attentionTraces}</span>
                <div>
                  <div className="attention-item__label">Attention traces</div>
                  <div className="attention-item__sublabel">
                    {health.attentionTraces > 0 ? "Need review" : "All clear"}
                  </div>
                </div>
              </div>
              <div className={`attention-item attention-item--${health.riskyWorkflows > 0 ? "warning" : "neutral"}`}>
                <span className="attention-item__count">{health.riskyWorkflows}</span>
                <div>
                  <div className="attention-item__label">Risky workflows</div>
                  <div className="attention-item__sublabel">
                    {health.riskyWorkflows > 0 ? "Failures or attention states" : "Ledger is calm"}
                  </div>
                </div>
              </div>
              <div className={`attention-item attention-item--${health.stalePipelines > 0 ? "warning" : "neutral"}`}>
                <span className="attention-item__count">{health.stalePipelines}</span>
                <div>
                  <div className="attention-item__label">Stale pipelines</div>
                  <div className="attention-item__sublabel">
                    {health.stalePipelines > 0 ? "May need refresh" : "Pipelines fresh"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section__header">
              <div className="section__icon">
                <Layers3 size={14} />
                <span className="section__title">Recent artifacts</span>
              </div>
            </div>
            <div className="list-group">
              {overview.recentArtifacts.slice(0, 5).map((artifact) => (
                <div key={artifact.id} className="list-item">
                  <div className="list-item__content">
                    <span className="list-item__title">{artifact.title ?? artifact.id}</span>
                    <span className="list-item__subtitle">{artifact.uri}</span>
                  </div>
                  <Pill label={artifact.kind} tone="neutral" />
                </div>
              ))}
            </div>
          </div>

          {overview.capabilityBreakdown.length > 0 && (
            <Panel title="Capabilities" icon={<Sparkles size={14} />}>
              <div className="capability-list">
                {overview.capabilityBreakdown.map((entry) => (
                  <div key={entry.kind} className="capability-row">
                    <span className="capability-row__kind">{entry.kind}</span>
                    <span className="capability-row__count">{entry.count}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* Investigation search */}
      <div className="section" style={{ marginTop: 8 }}>
        <div className="section__header">
          <div className="section__icon">
            <Search size={14} />
            <span className="section__title">Investigation search</span>
          </div>
        </div>
        <form method="GET">
          <div className="search-input-wrap">
            <Search size={14} />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search traces, workflows, artifacts..."
              className="search-input"
            />
            <button type="submit" className="btn btn--primary" style={{ padding: "4px 12px" }}>
              Search
            </button>
          </div>
        </form>
        {query && (
          <div className="search-results">
            {investigationResults.length > 0 ? (
              investigationResults.slice(0, 4).map((result) => (
                <div key={`${result.source_id}:${result.title}`} className="search-result">
                  <div className="search-result__meta">
                    <Pill label={result.mode ?? "fts"} tone={result.mode === "semantic-fallback" ? "info" : "neutral"} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{result.source_id}</span>
                  </div>
                  <div className="search-result__title">{result.title}</div>
                  <div className="search-result__snippet">{renderHighlightedSnippet(result.snippet)}</div>
                </div>
              ))
            ) : (
              <EmptyState message={`No matches for "${query}".`} />
            )}
          </div>
        )}
      </div>
    </>
  );
}

function renderHighlightedSnippet(snippet: string) {
  const parts = snippet.split(/(\[\[mark\]\].*?\[\[\/mark\]\])/g);
  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith("[[mark]]") && part.endsWith("[[/mark]]")) {
      return <mark key={index}>{part.slice(8, -9)}</mark>;
    }
    return <span key={index}>{part}</span>;
  });
}
