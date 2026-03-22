import { redirect } from "next/navigation";
import { ArrowUpCircle, Database } from "lucide-react";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getSavedInvestigations, type SavedInvestigationRow } from "@/lib/opentrust/investigations";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PromoteButton } from "@/components/promote-button";
import { PiiSafe } from "@/components/pii-safe";

export const dynamic = "force-dynamic";

export default async function PromoteInvestigationPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; create?: string }>;
}) {
  if (await isDemoMode()) {
    return (
      <>
        <PageHeader title="Promote investigation" subtitle="Promotion is not available in demo mode." breadcrumbs={[{ label: "Investigations", href: "/investigations" }, { label: "Demo" }]} />
        <EmptyState message="Switch off demo mode to promote investigations to memory." />
      </>
    );
  }

  const params = (await searchParams) ?? {};
  const investigations = getSavedInvestigations();
  const selected = params.id
    ? investigations.find((item: SavedInvestigationRow) => item.id === params.id) ?? null
    : null;

  if (params.create === "1" && selected) {
    memoryPromote({
      kind: "memoryEntry",
      title: selected.title,
      body: [selected.description ?? "Saved investigation", selected.sql_text].filter(Boolean).join("\n\n"),
      summary: selected.description ?? `Saved investigation ${selected.title}`,
      originRefs: [{ type: "savedInvestigation", id: selected.id }],
      retentionClass: "working",
      tags: ["investigation", "saved-investigation"],
      review: { status: "draft" },
      author: { type: "system", id: "investigation-promote-route" },
      confidence: { score: 0.52, reason: "Promoted from a saved investigation definition." },
      uncertaintySummary:
        "Investigation-based memory should be reviewed to confirm that the saved query still represents durable knowledge.",
    });
    redirect("/memory/review");
  }

  return (
    <>
      <PageHeader
        title="Promote investigation to memory"
        subtitle="Create a draft curated memory entry from a saved investigation."
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Investigations", href: "/investigations" }, { label: "Promote" }]}
      />

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel__header">
          <span className="panel__icon"><Database size={15} /></span>
          <span className="panel__title">How promotion works</span>
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          Promoting a saved investigation creates a <strong style={{ color: "var(--text)" }}>draft memory entry</strong> that
          preserves the query, description, and provenance. The draft goes to the review queue where it can be
          approved, edited, or rejected before becoming durable memory.
        </p>
      </div>

      {investigations.length > 0 ? (
        <div className="list-group">
          {investigations.map((investigation: SavedInvestigationRow) => (
            <div key={investigation.id} className="list-item" style={{ cursor: "default" }}>
              <div className="list-item__content">
                <span className="list-item__title"><PiiSafe>{investigation.title}</PiiSafe></span>
                <span className="list-item__subtitle"><PiiSafe>{investigation.description ?? investigation.sql_text.slice(0, 180)}</PiiSafe></span>
              </div>
              <div className="list-item__meta">
                <PromoteButton
                  href={`/investigations/promote?id=${encodeURIComponent(investigation.id)}&create=1`}
                  itemTitle={investigation.title}
                >
                  <button className="btn btn--primary" type="button">
                    <ArrowUpCircle size={14} />
                    Promote to memory
                  </button>
                </PromoteButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No saved investigations available to promote." />
      )}
    </>
  );
}
