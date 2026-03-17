import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpenText,
  Bot,
  DatabaseZap,
  FileSearch,
  Layers3,
  Orbit,
  Route,
  SearchCode,
  ShieldCheck,
  Sparkles,
  Telescope,
  Workflow,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { summarizeHealth } from "@/lib/opentrust/health";
import { getOverview } from "@/lib/opentrust/overview";
import { searchInvestigations } from "@/lib/opentrust/search";
import { getImportedSessionTraces } from "@/lib/opentrust/session-traces";

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
  const attentionCount = health.attentionTraces;

  return (
    <main className="dashboard-shell">
      <div className="dashboard-bg" />
      <div className="dashboard-container">
        <section className="status-strip card">
          <StatusStripItem label="runtime" value="local-first / real data" tone="accent" />
          <StatusStripItem label="latest ingest" value={latestIngestion} tone="neutral" />
          <StatusStripItem label="semantic" value={overview.semanticStatus.vectorReady ? "vector-ready" : "chunk-ready"} tone="success" />
          <StatusStripItem label="attention" value={String(attentionCount)} tone={attentionCount > 0 ? "danger" : "success"} />
        </section>

        <header className="dash-header card">
          <div className="dash-header__main">
            <div className="hero__badge">OpenTrust / real-data-only / local-first</div>
            <div className="dash-header__title-row">
              <div>
                <h1>OpenTrust</h1>
                <p>
                  Operator-grade traceability for OpenClaw sessions, workflows, artifacts, and capability lineage —
                  now with real local evidence, semantic indexing, and drill-down routes.
                </p>
              </div>
              <div className="dash-badges">
                <StatusPill label={overview.semanticStatus.vectorReady ? "vector-ready" : "chunk-ready"} tone="accent" />
                <StatusPill label="real-data-only" tone="neutral" />
                <StatusPill label={`attention ${attentionCount}`} tone={attentionCount > 0 ? "danger" : "success"} />
              </div>
            </div>
          </div>

          <div className="dash-actions">
            <ActionLink href="/investigations" icon={<SearchCode size={16} />} label="Saved investigations" />
            <ActionLink href="/artifacts" icon={<Layers3 size={16} />} label="Artifact explorer" />
            {overview.recentWorkflows[0] ? (
              <ActionLink
                href={`/workflows/${encodeURIComponent(overview.recentWorkflows[0].id)}`}
                icon={<Workflow size={16} />}
                label="Latest workflow"
              />
            ) : null}
          </div>
        </header>

        <section className="hero-band card">
          <div className="hero-band__copy">
            <div className="section-kicker">One-glance status</div>
            <h2>Claw-dash energy, but for evidence and trust.</h2>
            <p>
              The homepage now acts like a live command center: health, ingestion freshness, recent traces,
              workflows, artifacts, and investigations without the heavy docs-rail feel.
            </p>
            <div className="hero-band__cta-row">
              <ActionLink href="/investigations" icon={<SearchCode size={16} />} label="Open investigations" />
              <ActionLink href="/artifacts" icon={<Layers3 size={16} />} label="Browse artifacts" />
            </div>
          </div>
          <div className="hero-band__stats">
            <MetricCard icon={<DatabaseZap size={18} />} label="Sessions indexed" value={String(overview.counts.sessions)} tone="accent" />
            <MetricCard icon={<Route size={18} />} label="Traces available" value={String(overview.counts.traces)} tone="neutral" />
            <MetricCard icon={<Workflow size={18} />} label="Workflows tracked" value={String(overview.counts.workflows)} tone="neutral" />
            <MetricCard icon={<Layers3 size={18} />} label="Artifacts tracked" value={String(overview.counts.artifacts)} tone="neutral" />
            <MetricCard icon={<Sparkles size={18} />} label="Semantic chunks" value={String(overview.semanticStatus.chunkCount)} tone="accent" />
            <MetricCard icon={<ShieldCheck size={18} />} label="Last ingest" value={formatRelativeTime(latestIngestion)} tone="neutral" compact />
          </div>
        </section>

        <section className="bento-grid">
          <DashboardPanel
            className="panel-span-7"
            icon={<Activity size={18} />}
            title="Runtime and ingestion health"
            summary="Freshness, cursor position, and pipeline status for the local evidence model."
          >
            <div className="mini-grid mini-grid--two">
              {overview.ingestionStates.map((state) => (
                <article key={state.source_key} className="mini-card">
                  <div className="meta-row">
                    <StatusPill label={state.last_status ?? "idle"} tone={state.last_status === "ok" ? "success" : "danger"} />
                    <span className="muted">{state.source_kind}</span>
                  </div>
                  <h3>{state.source_key}</h3>
                  <p>Imported {state.imported_count} records on the last run.</p>
                  <div className="key-value-list">
                    <div><span>Run</span><strong>{state.last_run_at ?? "never"}</strong></div>
                    <div><span>Cursor</span><strong>{state.cursor_text ?? String(state.cursor_number ?? "—")}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-5"
            icon={<AlertTriangle size={18} />}
            title="Needs attention"
            summary="Fast anomaly surfacing across traces, workflows, and ingestion freshness."
          >
            <div className="attention-grid">
              <div className="attention-card attention-card--danger">
                <span>attention traces</span>
                <strong>{health.attentionTraces}</strong>
                <small>{health.attentionTraces > 0 ? "Recent traces need review." : "No urgent trace flags."}</small>
              </div>
              <div className="attention-card attention-card--warning">
                <span>risky workflows</span>
                <strong>{health.riskyWorkflows}</strong>
                <small>{health.riskyWorkflows > 0 ? "Workflow ledger has failures or attention states." : "Workflow ledger looks calm."}</small>
              </div>
              <div className="attention-card attention-card--neutral">
                <span>stale pipelines</span>
                <strong>{health.stalePipelines}</strong>
                <small>{health.stalePipelines > 0 ? "One or more pipelines may need a refresh." : "Pipelines are fresh."}</small>
              </div>
              <div className="attention-card attention-card--accent">
                <span>latest activity</span>
                <strong>{health.latestActivityLabel}</strong>
                <small>Most recent ingestion or trace activity.</small>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-5"
            icon={<Orbit size={18} />}
            title="Quick actions"
            summary="Jump straight to the most useful operator flows."
          >
            <div className="quick-actions-grid">
              <QuickAction title="Artifacts" subtitle="Browse indexed docs, repos, and URLs" href="/artifacts" icon={<Layers3 size={18} />} />
              <QuickAction title="Investigations" subtitle="Use saved SQL investigations" href="/investigations" icon={<FileSearch size={18} />} />
              <QuickAction title="Semantic index" subtitle={`${overview.semanticStatus.vectorReady ? "Vector-ready" : "Chunk-ready"} / ${overview.semanticStatus.chunkCount} chunks`} href="/?q=gateway" icon={<Bot size={18} />} />
              <QuickAction title="System docs" subtitle="Architecture, ingestion, and phase map" href="/investigations" icon={<BookOpenText size={18} />} />
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-6"
            icon={<Telescope size={18} />}
            title="Recent traces"
            summary="High-signal recent traces with direct drill-down into evidence."
          >
            <div className="list-stack">
              {overview.recentTraces.map((trace) => (
                <Link key={trace.id} href={`/traces/${encodeURIComponent(trace.id)}`} className="entity-row">
                  <div className="entity-row__meta">
                    <StatusPill label={trace.status} tone={trace.status === "attention" ? "danger" : trace.status === "streaming" ? "accent" : "neutral"} />
                    <span className="muted">{formatRelativeTime(trace.updated_at)}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{trace.title ?? trace.id}</strong>
                    <p>{trace.summary ?? "No summary yet."}</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-6"
            icon={<Workflow size={18} />}
            title="Workflow ledger"
            summary="Recent workflow runs, clearly labeled by source."
          >
            <div className="list-stack">
              {overview.recentWorkflows.map((workflow) => (
                <Link key={workflow.id} href={`/workflows/${encodeURIComponent(workflow.id)}`} className="entity-row">
                  <div className="entity-row__meta">
                    <StatusPill label={workflow.status} tone={workflow.status === "error" || workflow.status === "attention" ? "danger" : workflow.status === "active" ? "accent" : "neutral"} />
                    <span className="muted">{workflow.source_kind ?? "workflow"} · {workflow.summary ? "active context" : "no summary"}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{workflow.name}</strong>
                    <p>{workflow.summary ?? "No summary yet."}</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-4"
            icon={<Route size={18} />}
            title="Recent activity pulse"
            summary="A compact feed of what changed most recently across imported traces."
          >
            <div className="list-stack">
              {importedSessionTraces.slice(0, 5).map((trace) => (
                <Link key={trace.id} href={`/traces/${encodeURIComponent(trace.id)}`} className="entity-row">
                  <div className="entity-row__meta">
                    <StatusPill label={trace.status} tone={trace.status === "attention" ? "danger" : trace.status === "streaming" ? "accent" : "neutral"} />
                    <span className="muted">{formatRelativeTime(trace.updated_at)}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{trace.title ?? trace.id}</strong>
                    <p>{trace.summary ?? "No summary yet."}</p>
                  </div>
                </Link>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-4"
            icon={<Layers3 size={18} />}
            title="Artifact stream"
            summary="Most recently referenced artifacts across traces and workflows."
          >
            <div className="list-stack">
              {overview.recentArtifacts.slice(0, 6).map((artifact) => (
                <div key={artifact.id} className="entity-row entity-row--static">
                  <div className="entity-row__meta">
                    <StatusPill label={artifact.kind} tone="neutral" />
                  </div>
                  <div className="entity-row__content">
                    <strong>{artifact.title ?? artifact.id}</strong>
                    <p>{artifact.uri}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-4"
            icon={<Sparkles size={18} />}
            title="Capability registry"
            summary="Live counts for the capability types OpenTrust is tracking."
          >
            <div className="capability-list">
              {overview.capabilityBreakdown.map((entry) => (
                <div key={entry.kind} className="capability-list__item">
                  <span>{entry.kind}</span>
                  <strong>{entry.count}</strong>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            className="panel-span-12"
            icon={<SearchCode size={18} />}
            title="Investigation studio"
            summary="Search imported traces now, then jump into deeper investigations."
          >
            <form method="GET" className="search-form search-form--tight search-form--command">
              <div className="search-form__row search-form__row--command">
                <div className="command-input-wrap">
                  <span className="command-prefix">/investigate</span>
                  <input
                    id="investigation-query"
                    name="q"
                    defaultValue={query}
                    placeholder="gateway auth, cron, plugin failure…"
                    className="search-form__input search-form__input--command"
                  />
                </div>
                <button type="submit" className="search-form__button search-form__button--command">
                  Search
                </button>
              </div>
            </form>
            {query ? (
              investigationResults.length > 0 ? (
                <div className="search-results search-results--tight">
                  {investigationResults.slice(0, 4).map((result) => (
                    <article key={`${result.source_id}:${result.title}`} className="search-result">
                      <div className="meta-row">
                        <StatusPill label={result.mode ?? "fts"} tone={result.mode === "semantic-fallback" ? "accent" : "neutral"} />
                        <span className="muted">{result.source_id}</span>
                      </div>
                      <h3>{result.title}</h3>
                      <p>{renderHighlightedSnippet(result.snippet)}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="search-empty">No matches for “{query}”. Try a repo, cron name, or agent/tool topic.</div>
              )
            ) : (
              <div className="search-empty">Start with a quick operator query, then jump into saved investigations.</div>
            )}
          </DashboardPanel>
        </section>

        <section className="dash-footer-note card">
          <div className="meta-row">
            <StatusPill label="dashboard mode" tone="accent" />
            <span className="muted">claw-dash inspired layout</span>
          </div>
          <h3>OpenTrust now behaves more like a cockpit than a docs surface.</h3>
          <p>
            The left rail is gone from the homepage, the top header is sticky and operational, and the core evidence
            surfaces are arranged as quick-glance bento panels instead of long stacked documentation blocks.
          </p>
        </section>
      </div>
    </main>
  );
}

function DashboardPanel({
  title,
  summary,
  icon,
  className,
  children,
}: {
  title: string;
  summary: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`dash-panel card ${className ?? ""}`.trim()}>
      <header className="dash-panel__header">
        <div className="section-header__title">
          <span className="section-header__icon">{icon}</span>
          <div>
            <h2>{title}</h2>
            <p>{summary}</p>
          </div>
        </div>
      </header>
      {children}
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
  compact = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "accent" | "neutral";
  compact?: boolean;
}) {
  return (
    <div className={`metric metric--${tone} ${compact ? "metric--compact" : ""}`.trim()}>
      <div className="metric__icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QuickAction({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="quick-action">
      <span className="quick-action__icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <ArrowRight size={16} />
    </Link>
  );
}

function ActionLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="action-link">
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return <span className={`pill pill--${tone}`}>{label}</span>;
}

function StatusStripItem({ label, value, tone }: { label: string; value: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return (
    <div className="status-strip__item">
      <span>{label}</span>
      <div className="status-strip__value">
        <StatusPill label={value} tone={tone} />
      </div>
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
