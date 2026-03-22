import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { formatRelativeTime } from "@/lib/opentrust/format";
import {
  getInvestigationTemplates,
  getSavedInvestigations,
  previewInvestigationSql,
  type InvestigationTemplate,
  type SavedInvestigationRow,
} from "@/lib/opentrust/investigations";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default function InvestigationsPage() {
  ensureBootstrapped();
  const investigations = getSavedInvestigations();
  const templates = getInvestigationTemplates();

  return (
    <>
      <PageHeader
        title="Investigations"
        subtitle="Reusable SQL presets for common operator questions. Saved investigations are durable; starter investigations are examples, not seeded records."
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Investigations" },
        ]}
      />

      <div className="section">
        <div className="section__header">
          <span className="section__title">Saved investigations</span>
          <span className="section__description">{investigations.length} saved item{investigations.length !== 1 ? "s" : ""}</span>
        </div>

        {investigations.length > 0 ? (
          <div className="stack-list">
            {investigations.map((investigation) => renderInvestigationCard(investigation, "saved"))}
          </div>
        ) : (
          <EmptyState message="No saved investigations yet." />
        )}
      </div>

      <div className="section">
        <div className="section__header">
          <span className="section__title">Starter investigations</span>
          <span className="section__description">{templates.length} reusable example{templates.length !== 1 ? "s" : ""} shown without writing seeded records into the database</span>
        </div>

        <div className="stack-list">
          {templates.map((template) => renderInvestigationCard(template, "starter"))}
        </div>
      </div>
    </>
  );
}

function renderInvestigationCard(
  investigation: SavedInvestigationRow | InvestigationTemplate,
  mode: "saved" | "starter",
) {
  const previewRows = previewInvestigationSql(investigation.sql_text, 5);
  const columns = Object.keys(previewRows[0] ?? {});

  return (
    <details key={investigation.id} className="expandable">
      <summary>
        <span className="summary-row">
          <Pill label={mode} tone={mode === "saved" ? "accent" : "neutral"} />
          <span className="summary-row__title">{investigation.title}</span>
          <span className="summary-row__meta">
            {"updated_at" in investigation ? formatRelativeTime(investigation.updated_at) : "not persisted"}
          </span>
        </span>
      </summary>
      <div className="expandable__content">
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: 16 }}>
          {investigation.description ?? "No description."}
        </p>

        <div style={{ marginBottom: 16 }}>
          <div className="subsection-title">Preview</div>
          {previewRows.length > 0 ? (
            <DataTable columns={columns} rows={previewRows} />
          ) : (
            <EmptyState message="No rows returned." />
          )}
        </div>

        <details className="expandable">
          <summary>SQL</summary>
          <div className="expandable__content">
            <pre>{investigation.sql_text}</pre>
          </div>
        </details>
      </div>
    </details>
  );
}
