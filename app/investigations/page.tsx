import Link from "next/link";
import { ArrowLeft, SearchCode, Sparkles } from "lucide-react";
import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { getSavedInvestigations, previewSavedInvestigation } from "@/lib/opentrust/investigations";

export const dynamic = "force-dynamic";

export default function InvestigationsPage() {
  ensureBootstrapped();
  const investigations = getSavedInvestigations();

  return (
    <main className="dashboard-shell">
      <div className="dashboard-bg" />
      <div className="dashboard-container">
        <section className="status-strip card">
          <StatusStripItem label="saved" value={String(investigations.length)} tone="accent" />
          <StatusStripItem label="mode" value="sql presets" tone="neutral" />
          <StatusStripItem label="scope" value="local-first" tone="success" />
          <StatusStripItem label="surface" value="operator" tone="neutral" />
        </section>

        <section className="detail-hero card">
          <div className="hero__badge">Saved investigations / operator library</div>
          <div className="detail-hero__top">
            <div>
              <h1>Reusable SQL investigations for common operator questions.</h1>
              <p>
                Local-first investigation presets for incident review, workflow debugging, and evidence-driven tracing across sessions, workflows, and artifacts.
              </p>
            </div>
            <div className="detail-actions">
              <Link href="/" className="action-link"><ArrowLeft size={16} /><span>Back to dashboard</span></Link>
              <Link href="/?q=gateway" className="action-link"><Sparkles size={16} /><span>Quick search</span></Link>
            </div>
          </div>
        </section>

        <section className="dash-panel card">
          <header className="dash-panel__header">
            <div className="section-header__title">
              <span className="section-header__icon"><SearchCode size={18} /></span>
              <div>
                <h2>Investigation presets</h2>
                <p>Reusable SQL designed for the most common operational questions.</p>
              </div>
            </div>
          </header>
          <div className="list-stack">
            {investigations.map((investigation) => {
              const previewRows = previewSavedInvestigation(investigation.sql_text, 5);
              const columns = Object.keys(previewRows[0] ?? {});
              return (
                <article key={investigation.id} className="entity-row entity-row--block">
                  <div className="entity-row__meta">
                    <StatusPill label="saved" tone="accent" />
                    <span className="muted">updated {formatRelativeTime(investigation.updated_at)}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{investigation.title}</strong>
                    <p>{investigation.description ?? "No description."}</p>
                  </div>
                  <details>
                    <summary>Preview results</summary>
                    {previewRows.length > 0 ? (
                      <div className="preview-table-wrap">
                        <table className="preview-table">
                          <thead>
                            <tr>
                              {columns.map((column) => <th key={column}>{column}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {previewRows.map((row, index) => (
                              <tr key={index}>
                                {columns.map((column) => <td key={column}>{String(row[column] ?? "")}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="search-empty">No rows returned by this investigation preview.</div>
                    )}
                  </details>
                  <details>
                    <summary>SQL</summary>
                    <pre>{investigation.sql_text}</pre>
                  </details>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return <span className={`pill pill--${tone}`}>{label}</span>;
}

function StatusStripItem({ label, value, tone }: { label: string; value: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return (
    <div className="status-strip__item">
      <span>{label}</span>
      <div className="status-strip__value"><StatusPill label={value} tone={tone} /></div>
    </div>
  );
}
