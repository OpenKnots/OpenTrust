import Link from "next/link";
import { DatabaseZap, FileStack, Layers3, Route, SearchCode, ShieldCheck, Sparkles, Telescope, Workflow } from "lucide-react";
import { capabilityCards, manualSections, queryExamples, traceCards } from "@/lib/mock-data";
import { getOverview } from "@/lib/opentrust/overview";
import { searchInvestigations } from "@/lib/opentrust/search";
import { getImportedSessionTraces } from "@/lib/opentrust/session-traces";

export const dynamic = "force-dynamic";

const sectionIcons = {
  briefing: Sparkles,
  traces: Route,
  capabilities: Layers3,
  queries: SearchCode,
  storage: DatabaseZap,
} as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const overview = getOverview();
  const params = (await searchParams) ?? {};
  const query = typeof params.q === "string" ? params.q : "";
  const investigationResults = query ? searchInvestigations(query) : [];
  const importedSessionTraces = getImportedSessionTraces();

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
          <div className="grid grid--two">
            {overview.ingestionStates.map((state) => (
              <article key={state.source_key} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{state.last_status ?? "idle"}</span>
                  <span className="muted">{state.source_kind}</span>
                </div>
                <h3>{state.source_key}</h3>
                <p>Imported {state.imported_count} records on the last run.</p>
                <details>
                  <summary>Cursor + run details</summary>
                  <p>Last run: {state.last_run_at ?? "never"}</p>
                  <p>Cursor text: {state.cursor_text ?? "—"}</p>
                  <p>Cursor number: {state.cursor_number ?? "—"}</p>
                </details>
              </article>
            ))}
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
                <h3><Link href={`/traces/${encodeURIComponent(trace.id)}`}>{trace.title ?? trace.id}</Link></h3>
                <p>{trace.summary ?? "No summary yet."}</p>
                <details>
                  <summary>Trace metadata</summary>
                  <p>Updated: {trace.updated_at}</p>
                  <p>Trace ID: {trace.id}</p>
                </details>
              </article>
            ))}
          </div>
          <div className="stack">
            <SectionHeader
              icon={<Route size={18} />}
              title="Imported OpenClaw sessions"
              summary="Recent real session traces imported from local OpenClaw JSONL transcripts, keeping the operator flow grounded in actual runtime evidence."
            />
            {importedSessionTraces.length > 0 ? (
              <div className="grid grid--two">
                {importedSessionTraces.map((trace) => (
                  <article key={trace.id} className="card card--soft">
                    <div className="meta-row">
                      <span className="pill pill--outline">{trace.status}</span>
                      <span className="muted">{trace.session_label ?? trace.id}</span>
                    </div>
                    <h3><Link href={`/traces/${encodeURIComponent(trace.id)}`}>{trace.title ?? trace.id}</Link></h3>
                    <p>{trace.summary ?? "No summary yet."}</p>
                    <details>
                      <summary>Imported trace details</summary>
                      <p>Updated: {trace.updated_at}</p>
                      <p>Trace ID: {trace.id}</p>
                    </details>
                  </article>
                ))}
              </div>
            ) : (
              <div className="search-empty">No imported OpenClaw session traces yet. Run <code>pnpm run ingest:openclaw</code> to refresh the local evidence store.</div>
            )}
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
          <div className="card card--soft">
            <form method="GET" className="search-form">
              <label className="search-form__label" htmlFor="investigation-query">
                Search real imported traces
              </label>
              <div className="search-form__row">
                <input
                  id="investigation-query"
                  name="q"
                  defaultValue={query}
                  placeholder="gateway auth, claw-knots, cron, plugin failure…"
                  className="search-form__input"
                />
                <button type="submit" className="search-form__button">
                  Search
                </button>
              </div>
            </form>

            {query ? (
              investigationResults.length > 0 ? (
                <div className="search-results">
                  {investigationResults.map((result) => (
                    <article key={`${result.source_id}:${result.title}`} className="search-result">
                      <div className="meta-row">
                        <span className="pill pill--outline">match</span>
                        <span className="muted">{result.source_id}</span>
                      </div>
                      <h3>{result.title}</h3>
                      <p>{renderHighlightedSnippet(result.snippet)}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="search-empty">No matches yet for “{query}”. Try a repo, workflow, plugin, session topic, or agent name.</div>
              )
            ) : (
              <div className="search-empty">Start with a simple query like <strong>gateway</strong>, <strong>cron</strong>, <strong>claw-knots</strong>, or <strong>plugin failure</strong>.</div>
            )}
          </div>
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
                  <span className="muted">{workflow.source_kind ?? "workflow"}</span>
                </div>
                <h3>{workflow.name}</h3>
                <p>{workflow.summary ?? "No summary yet."}</p>
                <details>
                  <summary>Workflow identity</summary>
                  <p>Source: {workflow.source_kind ?? "unknown"}</p>
                  <p>Workflow ID: {workflow.id}</p>
                </details>
              </article>
            ))}
          </div>
          <div className="card card--soft">
            <div className="meta-row">
              <span className="pill">cron visibility</span>
              <span className="muted">operator clarity</span>
            </div>
            <h3>Cron and workflow runs are now distinguished explicitly.</h3>
            <p>
              Imported workflow cards now show whether they came from cron ingestion, seed data, or future runtime sources,
              making the field manual view much clearer during incident review and routine operations.
            </p>
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

function renderHighlightedSnippet(snippet: string) {
  const parts = snippet.split(/(\[\[mark\]\].*?\[\[\/mark\]\])/g);
  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith("[[mark]]") && part.endsWith("[[/mark]]")) {
      return <mark key={index}>{part.slice(8, -9)}</mark>;
    }
    return <span key={index}>{part}</span>;
  });
}
