import {
  IconBinaryTree2,
  IconBolt,
  IconDatabaseSearch,
  IconFileSearch,
  IconRadar2,
  IconSparkles,
  IconWaveSine,
} from "@tabler/icons-react";
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
import { RunnableSqlBlock } from "@/components/runnable-sql";
import { GlassCard } from "@/components/ui/glass-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PiiSafe } from "@/components/pii-safe";
import { MarkdownPreview } from "@/components/markdown-preview";

export const dynamic = "force-dynamic";

export default function InvestigationsPage() {
  ensureBootstrapped();
  const investigations = getSavedInvestigations();
  const templates = getInvestigationTemplates();
  const totalQueries = investigations.length + templates.length;

  return (
    <>
      <PageHeader
        title="Investigations"
        subtitle="A sleek operator workspace for reusable SQL probes, quick signal checks, and evidence-driven debugging across the OpenTrust memory layer."
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Investigations" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)]">
        <GlassCard
          variant="hero"
          glow
          header={
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Pill label="wireless operator mode" tone="info" />
                  <Pill label="live SQL previews" tone="accent" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Investigation flows for rapid trust analysis
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Scan saved probes, launch starter investigations, preview result sets instantly, and inspect
                  the exact SQL behind each question without leaving the dashboard rhythm.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-right shadow-sm backdrop-blur">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Available probes</div>
                <div className="mt-1 text-3xl font-semibold text-foreground">{totalQueries}</div>
              </div>
            </div>
          }
        >
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Saved investigations"
              value={investigations.length}
              subtitle="Durable operator queries"
              tone="accent"
              icon={<IconDatabaseSearch className="size-4" />}
            />
            <MetricCard
              label="Starter investigations"
              value={templates.length}
              subtitle="Reusable example probes"
              tone="info"
              icon={<IconSparkles className="size-4" />}
            />
            <MetricCard
              label="Preview mode"
              value="Live"
              subtitle="Read-only SQL sampling"
              tone="success"
              icon={<IconWaveSine className="size-4" />}
            />
          </div>
        </GlassCard>

        <GlassCard
          variant="raised"
          header={
            <div className="flex items-center gap-2">
              <IconRadar2 className="size-4 text-primary" />
              <div>
                <div className="font-medium text-foreground">Operator guidance</div>
                <div className="text-sm text-muted-foreground">How to use the page like an investigations console, not a raw SQL dump.</div>
              </div>
            </div>
          }
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-white/10 bg-background/50 p-3">
              Start with saved investigations for recurring operational questions.
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/50 p-3">
              Use starter investigations when you want fast inspiration without seeded database records.
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/50 p-3">
              Expand any card to inspect the preview table, then drill into the SQL when you need the full logic.
            </div>
          </div>
        </GlassCard>
      </div>

      <section className="mt-6 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <IconBolt className="size-4" />
              Saved investigations
            </div>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Your durable operator probes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Queries you keep around because they answer recurring questions about failures, drift, and memory health.
            </p>
          </div>
          <Pill label={`${investigations.length} saved`} tone="accent" />
        </div>

        {investigations.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {investigations.map((investigation) => (
              <InvestigationCard key={investigation.id} investigation={investigation} mode="saved" />
            ))}
          </div>
        ) : (
          <GlassCard variant="inset">
            <EmptyState message="No saved investigations yet." />
          </GlassCard>
        )}
      </section>

      <section className="mt-8 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <IconBinaryTree2 className="size-4" />
              Starter investigations
            </div>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Launch points for exploration</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Example investigations shown as starter patterns so operators can move quickly without polluting saved state.
            </p>
          </div>
          <Pill label={`${templates.length} starters`} tone="neutral" />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {templates.map((template) => (
            <InvestigationCard key={template.id} investigation={template} mode="starter" />
          ))}
        </div>
      </section>
    </>
  );
}

function InvestigationCard({
  investigation,
  mode,
}: {
  investigation: SavedInvestigationRow | InvestigationTemplate;
  mode: "saved" | "starter";
}) {
  const previewRows = previewInvestigationSql(investigation.sql_text, 5);
  const columns = Object.keys(previewRows[0] ?? {});
  const metaText = "updated_at" in investigation ? formatRelativeTime(investigation.updated_at) : "not persisted";

  return (
    <GlassCard
      variant={mode === "saved" ? "raised" : "default"}
      glow={mode === "saved"}
      header={
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill label={mode === "saved" ? "saved" : "starter"} tone={mode === "saved" ? "accent" : "neutral"} />
              <span className="text-xs text-muted-foreground">{metaText}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground"><PiiSafe>{investigation.title}</PiiSafe></h3>
            <div className="mt-1 text-sm leading-6 text-muted-foreground">
              <MarkdownPreview content={investigation.description ?? "No description."} />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-right backdrop-blur">
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Preview rows</div>
            <div className="text-lg font-semibold text-foreground">{previewRows.length}</div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-background/45 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <IconFileSearch className="size-4 text-primary" />
            Result preview
          </div>
          {previewRows.length > 0 ? (
            <DataTable columns={columns} rows={previewRows} />
          ) : (
            <EmptyState message="No rows returned." />
          )}
        </div>

        <details className="expandable">
          <summary>Inspect SQL</summary>
          <div className="expandable__content">
            <RunnableSqlBlock sql={investigation.sql_text} />
          </div>
        </details>
      </div>
    </GlassCard>
  );
}
