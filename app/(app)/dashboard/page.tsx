import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Database,
  HeartPulse,
  Layers3,
  Search,
  Sparkles,
  Telescope,
  Workflow,
} from "lucide-react";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoOverview, getDemoHealthSummary, getDemoSearchResults } from "@/lib/opentrust/demo-data";
import { formatRelativeTime, truncatePath } from "@/lib/opentrust/format";
import { summarizeHealth } from "@/lib/opentrust/health";
import { getOverview } from "@/lib/opentrust/overview";
import { searchInvestigations } from "@/lib/opentrust/search";
import { PageHeader } from "@/components/ui/page-header";
import { Pill, StatusDot } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPanel,
} from "@/components/animate-ui/components/base/preview-card";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const demo = await isDemoMode();
  const overview = demo ? getDemoOverview() : getOverview();
  const params = (await searchParams) ?? {};
  const query = typeof params.q === "string" ? params.q : "";
  const investigationResults = demo
    ? (query ? getDemoSearchResults() : [])
    : (query ? searchInvestigations(query) : []);
  const latestIngestion = overview.ingestionStates[0]?.last_run_at ?? "never";
  const health = demo
    ? getDemoHealthSummary()
    : summarizeHealth({
        traces: overview.recentTraces,
        workflows: overview.recentWorkflows,
        ingestionStates: overview.ingestionStates,
      });

  return (
    <div className="overview-page">
      <PageHeader
        title="Overview"
        subtitle="Operator-grade traceability for sessions, workflows, and artifacts."
      />

      <BentoGrid columns={4} gap="md" style={{ marginBottom: 24 }}>
        <BentoCard variant="hero" colSpan={2} hoverable={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <HeartPulse size={20} style={{ color: "var(--accent)" }} />
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text)" }}>System Health</h2>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <StatusBadge
                label={health.attentionTraces === 0 && health.riskyWorkflows === 0 ? "Healthy" : "Attention"}
                status={health.attentionTraces === 0 && health.riskyWorkflows === 0 ? "healthy" : "attention"}
                pulse={health.attentionTraces > 0 || health.riskyWorkflows > 0}
                size="md"
              />
              <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                {health.attentionTraces === 0 && health.riskyWorkflows === 0
                  ? "All systems operating normally"
                  : `${health.attentionTraces + health.riskyWorkflows} items need attention`}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
              Last ingestion: {formatRelativeTime(latestIngestion)}
            </div>
          </div>
        </BentoCard>

        <MetricCard
          label="Sessions"
          value={overview.counts.sessions}
          icon={<Database size={16} />}
          tone="neutral"
        />
        <MetricCard
          label="Memory Entries"
          value={overview.counts.memoryEntries}
          icon={<Sparkles size={16} />}
          tone="accent"
        />

        <MetricCard
          label="Traces"
          value={overview.counts.traces}
          icon={<Telescope size={16} />}
          tone="info"
          subtitle={`${health.attentionTraces} need attention`}
        />
        <MetricCard
          label="Workflows"
          value={overview.counts.workflows}
          icon={<Workflow size={16} />}
          tone={health.riskyWorkflows > 0 ? "warning" : "neutral"}
          subtitle={health.riskyWorkflows > 0 ? `${health.riskyWorkflows} at risk` : "All stable"}
        />
        <MetricCard
          label="Artifacts"
          value={overview.counts.artifacts}
          icon={<Layers3 size={16} />}
          tone="neutral"
        />
        <MetricCard
          label="Semantic Chunks"
          value={overview.semanticStatus.chunkCount}
          icon={<Search size={16} />}
          tone="success"
        />
      </BentoGrid>

      <BentoGrid columns={3} gap="md">
        <BentoCard
          variant="feature"
          colSpan={2}
          title="Recent Traces"
          icon={<Telescope size={16} />}
          footer={
            <Link href="/traces" className="btn btn--ghost btn--sm">
              View all <ChevronRight size={12} />
            </Link>
          }
        >
          <div className="list-group">
            {overview.recentTraces.length > 0 ? (
              overview.recentTraces.slice(0, 5).map((trace) => (
                <PreviewCard key={trace.id}>
                  <PreviewCardTrigger
                    render={
                      <Link href={`/traces/${encodeURIComponent(trace.id)}`} className="list-item">
                        <StatusDot tone={trace.status === "attention" ? "danger" : trace.status === "streaming" ? "accent" : "success"} />
                        <div className="list-item__content">
                          <span className="list-item__title">{trace.title ?? trace.id}</span>
                          <span className="list-item__subtitle">{trace.summary ?? "No summary yet."}</span>
                        </div>
                        <div className="list-item__meta">
                          <StatusBadge label={trace.status} status={trace.status === "attention" ? "degraded" : trace.status === "streaming" ? "active" : "healthy"} />
                          <span>{formatRelativeTime(trace.updated_at)}</span>
                        </div>
                        <ArrowRight size={14} className="list-item__arrow" />
                      </Link>
                    }
                  />
                  <PreviewCardPanel side="right" sideOffset={12} align="start">
                    <div className="preview-card__title">{trace.title ?? trace.id}</div>
                    <div className="preview-card__text">{trace.summary ?? "No summary available."}</div>
                    <div className="preview-card__meta">
                      <StatusBadge label={trace.status} status={trace.status === "attention" ? "degraded" : trace.status === "streaming" ? "active" : "healthy"} />
                      <span>{formatRelativeTime(trace.updated_at)}</span>
                    </div>
                  </PreviewCardPanel>
                </PreviewCard>
              ))
            ) : (
              <EmptyState message="No traces imported yet." />
            )}
          </div>
        </BentoCard>

        <BentoCard
          variant="default"
          title="Attention"
          icon={<AlertTriangle size={16} />}
          description="Items requiring operator review"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
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
        </BentoCard>

        <BentoCard
          variant="default"
          title="Recent Memory"
          icon={<Sparkles size={16} />}
          footer={
            <Link href="/memory" className="btn btn--ghost btn--sm">
              Open memory <ChevronRight size={12} />
            </Link>
          }
        >
          <div className="list-group">
            {overview.recentMemoryEntries.length > 0 ? (
              overview.recentMemoryEntries.slice(0, 4).map((entry) => (
                <PreviewCard key={entry.id}>
                  <PreviewCardTrigger
                    render={
                      <div className="list-item" style={{ cursor: "default" }}>
                        <div className="list-item__content">
                          <span className="list-item__title">{entry.title}</span>
                          <span className="list-item__subtitle">{entry.summary ?? entry.body.slice(0, 100)}</span>
                        </div>
                        <div className="list-item__meta">
                          <StatusBadge
                            label={entry.review_status}
                            status={entry.review_status === "approved" ? "healthy" : entry.review_status === "reviewed" ? "active" : "attention"}
                          />
                        </div>
                      </div>
                    }
                  />
                  <PreviewCardPanel side="left" sideOffset={12} align="start">
                    <div className="preview-card__title">{entry.title}</div>
                    <div className="preview-card__text">{entry.summary ?? entry.body.slice(0, 200)}</div>
                    <div className="preview-card__meta">
                      <StatusBadge
                        label={entry.review_status}
                        status={entry.review_status === "approved" ? "healthy" : entry.review_status === "reviewed" ? "active" : "attention"}
                      />
                    </div>
                  </PreviewCardPanel>
                </PreviewCard>
              ))
            ) : (
              <EmptyState message="No curated memory yet." />
            )}
          </div>
        </BentoCard>

        <BentoCard
          variant="feature"
          colSpan={2}
          title="Recent Workflows"
          icon={<Workflow size={16} />}
        >
          <div className="list-group">
            {overview.recentWorkflows.length > 0 ? (
              overview.recentWorkflows.slice(0, 5).map((workflow) => (
                <PreviewCard key={workflow.id}>
                  <PreviewCardTrigger
                    render={
                      <Link href={`/workflows/${encodeURIComponent(workflow.id)}`} className="list-item">
                        <StatusDot tone={workflow.status === "error" || workflow.status === "attention" ? "danger" : workflow.status === "active" ? "accent" : "neutral"} />
                        <div className="list-item__content">
                          <span className="list-item__title">{workflow.name}</span>
                          <span className="list-item__subtitle">{workflow.summary ?? "No summary."}</span>
                        </div>
                        <div className="list-item__meta">
                          <StatusBadge
                            label={workflow.status}
                            status={workflow.status === "error" || workflow.status === "attention" ? "degraded" : workflow.status === "active" ? "active" : "healthy"}
                          />
                        </div>
                        <ArrowRight size={14} className="list-item__arrow" />
                      </Link>
                    }
                  />
                  <PreviewCardPanel side="right" sideOffset={12} align="start">
                    <div className="preview-card__title">{workflow.name}</div>
                    <div className="preview-card__text">{workflow.summary ?? "No summary available."}</div>
                    <div className="preview-card__meta">
                      <StatusBadge
                        label={workflow.status}
                        status={workflow.status === "error" || workflow.status === "attention" ? "degraded" : workflow.status === "active" ? "active" : "healthy"}
                      />
                    </div>
                  </PreviewCardPanel>
                </PreviewCard>
              ))
            ) : (
              <EmptyState message="No workflows tracked yet." />
            )}
          </div>
        </BentoCard>
      </BentoGrid>

      <InvestigationSearchSection
        className="section overview-search"
        query={query}
        results={investigationResults}
      />
    </div>
  );
}

function InvestigationSearchSection({
  className,
  query,
  results,
}: {
  className: string;
  query: string;
  results: Array<{
    source_id: string;
    title: string;
    snippet: string;
    mode?: string | null;
    sourceType?: string | null;
  }>;
}) {
  return (
    <div className={className}>
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
          <button type="submit" className="btn btn--primary btn--sm">
            Search
          </button>
        </div>
      </form>
      {query && (
        <div className="search-results">
          {results.length > 0 ? (
            results.slice(0, 4).map((result) => (
              <div key={`${result.source_id}:${result.title}`} className="search-result">
                <div className="search-result__meta">
                  <Pill label={result.mode ?? "fts"} tone={result.mode === "semantic-fallback" ? "info" : result.mode === "memory-entry" ? "accent" : "neutral"} />
                  {result.sourceType ? <Pill label={result.sourceType} tone={result.sourceType === "memory" ? "accent" : "neutral"} /> : null}
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
