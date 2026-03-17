import { DatabaseZap, FileStack, Layers3, Route, SearchCode, ShieldCheck, Sparkles, Telescope, Workflow } from "lucide-react";
import { capabilityCards, manualSections, queryExamples, traceCards } from "@/lib/mock-data";
import { getOverview } from "@/lib/opentrust/overview";

export const dynamic = "force-dynamic";

const sectionIcons = {
  briefing: Sparkles,
  traces: Route,
  capabilities: Layers3,
  queries: SearchCode,
  storage: DatabaseZap,
} as const;

export default function HomePage() {
  const overview = getOverview();

  return (
    <main className="shell">
      <aside className="rail">
        <div className="rail__brand">
          <div className="rail__eyebrow">FIELD MANUAL</div>
          <h1>OpenTrust</h1>
          <p>
            Local-first intelligence and traceability for OpenClaw sessions, workflows, skills, plugins, souls,
            and bundles.
          </p>
        </div>

        <nav className="rail__nav" aria-label="Manual sections">
          {manualSections.map((section) => {
            const Icon = sectionIcons[section.id as keyof typeof sectionIcons];
            return (
              <a key={section.id} href={`#${section.id}`} className="rail__link">
                <span className="rail__icon">{Icon ? <Icon size={16} /> : null}</span>
                <span>
                  <strong>{section.title}</strong>
                  <small>{section.summary}</small>
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="content">
        <section id="briefing" className="hero card">
          <div className="hero__badge">OpenKnots / OpenClaw / local-first</div>
          <h2>Braintrust for OpenClaw — but grounded in real SQL, local vectors, and explainable lineage.</h2>
          <p className="hero__lede">
            OpenTrust is designed as a beginner-friendly field manual first, then progressively discloses traces,
            SQL, raw events, and provenance as the operator needs more depth.
          </p>
          <div className="hero__grid">
            <Metric label="Primary store" value="SQLite + sqlite-vec" />
            <Metric label="Search model" value="hybrid: FTS5 + vectors" />
            <Metric label="Trace scope" value="sessions · workflows · capabilities" />
            <Metric label="UX mode" value="minimalist · progressive disclosure" />
          </div>
        </section>

        <section className="stack">
          <SectionHeader
            icon={<DatabaseZap size={18} />}
            title="Local runtime status"
            summary="Phase 2 now boots a real local SQLite store, migrates schema, seeds first traces, and syncs visible capabilities from the current OpenClaw environment."
          />
          <div className="grid grid--three">
            <Metric label="Sessions indexed" value={String(overview.counts.sessions)} />
            <Metric label="Traces available" value={String(overview.counts.traces)} />
            <Metric label="Capabilities synced" value={String(overview.counts.capabilities)} />
            <Metric label="Workflows tracked" value={String(overview.counts.workflows)} />
            <Metric label="Artifacts tracked" value={String(overview.counts.artifacts)} />
            <Metric label="Database file" value={overview.localDatabasePath} />
          </div>
        </section>

        <section id="traces" className="stack">
          <SectionHeader
            icon={<Telescope size={18} />}
            title="Trace Atlas"
            summary="Every answer should be traceable back through messages, tool calls, workflow steps, capabilities, and artifacts."
          />
          <div className="grid grid--three">
            {traceCards.map((card) => (
              <article key={card.title} className="card card--soft">
                <div className="pill">{card.badge}</div>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                <ul>
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="grid grid--two">
            {overview.recentTraces.map((trace) => (
              <article key={trace.id} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{trace.status}</span>
                  <span className="muted">{trace.session_label ?? trace.id}</span>
                </div>
                <h3>{trace.title ?? trace.id}</h3>
                <p>{trace.summary ?? "No summary yet."}</p>
                <details>
                  <summary>Trace metadata</summary>
                  <p>Updated: {trace.updated_at}</p>
                  <p>Trace ID: {trace.id}</p>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section id="capabilities" className="stack">
          <SectionHeader
            icon={<Workflow size={18} />}
            title="Capability Registry"
            summary="OpenTrust treats skills, plugins, souls, and bundles as first-class traceable capabilities instead of anonymous metadata blobs."
          />
          <div className="grid grid--two">
            {capabilityCards.map((card) => (
              <article key={card.name} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{card.kind}</span>
                  <span className="muted">traceable capability</span>
                </div>
                <h3>{card.name}</h3>
                <p>{card.summary}</p>
                <details>
                  <summary>Why this matters</summary>
                  <p>{card.evidence}</p>
                </details>
              </article>
            ))}
          </div>
          <div className="grid grid--two">
            {overview.capabilityBreakdown.map((entry) => (
              <article key={entry.kind} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{entry.kind}</span>
                  <span className="muted">live registry count</span>
                </div>
                <h3>{entry.count}</h3>
                <p>Capabilities of type {entry.kind} are currently indexed into the local registry.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="queries" className="stack">
          <SectionHeader
            icon={<FileStack size={18} />}
            title="Investigation Studio"
            summary="Power users get real SQL. Beginners get saved investigations, friendly summaries, and expandable evidence panes."
          />
          <div className="grid grid--two">
            {queryExamples.map((query) => (
              <article key={query.title} className="card card--soft">
                <h3>{query.title}</h3>
                <pre>{query.sql}</pre>
              </article>
            ))}
          </div>
        </section>

        <section id="storage" className="stack">
          <SectionHeader
            icon={<ShieldCheck size={18} />}
            title="Storage & Trust Blueprint"
            summary="Local-first by default. Append-only evidence. Derived views for speed. Progressive disclosure for calm operator UX."
          />
          <div className="grid grid--three">
            <BlueprintCard
              icon={<DatabaseZap size={18} />}
              title="Storage engine"
              body="SQLite is the system of record. sqlite-vec handles semantic retrieval. FTS5 handles exact and lexical search. JSON columns preserve raw OpenClaw event shape."
            />
            <BlueprintCard
              icon={<Route size={18} />}
              title="Trace model"
              body="Events remain append-only. Traces and workflow summaries are derived, queryable projections. Everything points back to evidence rows and stable IDs."
            />
            <BlueprintCard
              icon={<Layers3 size={18} />}
              title="UI stance"
              body="Beginner-friendly first screen. Advanced panes unfold with details, lineage, SQL, and payload views only when the operator asks for more."
            />
          </div>
          <div className="grid grid--two">
            {overview.recentWorkflows.map((workflow) => (
              <article key={workflow.id} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{workflow.status}</span>
                  <span className="muted">workflow run</span>
                </div>
                <h3>{workflow.name}</h3>
                <p>{workflow.summary ?? "No summary yet."}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({ icon, title, summary }: { icon: React.ReactNode; title: string; summary: string }) {
  return (
    <header className="section-header">
      <div className="section-header__title">
        <span className="section-header__icon">{icon}</span>
        <h2>{title}</h2>
      </div>
      <p>{summary}</p>
    </header>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BlueprintCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <article className="card card--soft">
      <div className="section-header__title">
        <span className="section-header__icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <p>{body}</p>
    </article>
  );
}
