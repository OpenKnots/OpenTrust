import { redirect } from "next/navigation";
import { getRecentArtifacts } from "@/lib/opentrust/artifacts";
import { isDemoMode } from "@/lib/opentrust/demo";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PromoteButton } from "@/components/promote-button";

export const dynamic = "force-dynamic";

export default async function PromoteArtifactPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; create?: string }>;
}) {
  if (await isDemoMode()) {
    return (
      <>
        <PageHeader title="Promote artifact" subtitle="Promotion is not available in demo mode." breadcrumbs={[{ label: "Artifacts", href: "/artifacts" }, { label: "Demo" }]} />
        <EmptyState message="Switch off demo mode to promote artifacts to memory." />
      </>
    );
  }

  const params = (await searchParams) ?? {};
  const artifacts = getRecentArtifacts(100);
  const selected = params.id ? artifacts.find((artifact) => artifact.id === params.id) : null;

  if (params.create === "1" && selected) {
    memoryPromote({
      kind: "memoryEntry",
      title: selected.title ?? selected.id,
      body: `${selected.kind} artifact\n\n${selected.uri}`,
      summary: selected.title ?? selected.uri,
      originRefs: [{ type: "artifact", id: selected.id }],
      retentionClass: "working",
      tags: ["artifact", selected.kind],
      review: { status: "draft" },
      author: { type: "system", id: "artifact-promote-route" },
      confidence: { score: 0.55, reason: "Promoted directly from the artifact explorer." },
      uncertaintySummary: "Artifact-backed memory should be reviewed for long-term value and interpretation.",
    });
    redirect("/memory/review");
  }

  return (
    <>
      <PageHeader
        title="Promote artifact to memory"
        subtitle="Select a recent artifact and create a draft curated memory entry from it."
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Artifacts", href: "/artifacts" }, { label: "Promote" }]}
      />

      {artifacts.length > 0 ? (
        <div className="list-group">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="list-item" style={{ cursor: "default" }}>
              <div className="list-item__content">
                <span className="list-item__title">{artifact.title ?? artifact.id}</span>
                <span className="list-item__subtitle">{artifact.kind} · {artifact.uri}</span>
              </div>
              <div className="list-item__meta">
                <PromoteButton
                  href={`/artifacts/promote?id=${encodeURIComponent(artifact.id)}&create=1`}
                  itemTitle={artifact.title ?? artifact.id}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No artifacts available to promote." />
      )}
    </>
  );
}
