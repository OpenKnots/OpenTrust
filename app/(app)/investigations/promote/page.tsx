import { redirect } from "next/navigation";
import { listSavedInvestigations } from "@/lib/opentrust/search";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function PromoteInvestigationPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; create?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const investigations = listSavedInvestigations();
  const selected = params.id ? investigations.find((item) => item.id === params.id) : null;

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
      uncertaintySummary: "Investigation-based memory should be reviewed to confirm that the saved query still represents durable knowledge.",
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

      {investigations.length > 0 ? (
        <div className="list-group">
          {investigations.map((investigation) => (
            <div key={investigation.id} className="list-item" style={{ cursor: "default" }}>
              <div className="list-item__content">
                <span className="list-item__title">{investigation.title}</span>
                <span className="list-item__subtitle">{investigation.description ?? investigation.sql_text.slice(0, 180)}</span>
              </div>
              <div className="list-item__meta">
                <a className="btn btn--primary" href={`/investigations/promote?id=${encodeURIComponent(investigation.id)}&create=1`}>
                  Promote
                </a>
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
