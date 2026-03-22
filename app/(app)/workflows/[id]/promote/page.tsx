import { notFound, redirect } from "next/navigation";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getWorkflowDetail } from "@/lib/opentrust/workflow-details";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PromoteButton } from "@/components/promote-button";
import { PiiSafe } from "@/components/pii-safe";

export const dynamic = "force-dynamic";

export default async function PromoteWorkflowPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ create?: string }>;
}) {
  if (await isDemoMode()) {
    return (
      <>
        <PageHeader title="Promote workflow" subtitle="Promotion is not available in demo mode." breadcrumbs={[{ label: "Workflows", href: "/workflows" }, { label: "Demo" }]} />
        <EmptyState message="Switch off demo mode to promote workflows to memory." />
      </>
    );
  }

  const { id } = await params;
  const workflow = getWorkflowDetail(decodeURIComponent(id));
  const query = (await searchParams) ?? {};

  if (!workflow) notFound();

  if (query.create === "1") {
    memoryPromote({
      kind: "memoryEntry",
      title: workflow.name,
      body: [workflow.summary ?? `${workflow.status} workflow run`, ...workflow.steps.slice(0, 5).map((step) => `${step.status}: ${step.label}`)].join("\n\n"),
      summary: workflow.summary ?? `${workflow.status} workflow run`,
      originRefs: [{ type: "workflowRun", id: workflow.id }],
      retentionClass: "working",
      tags: ["workflow", workflow.status, workflow.source_kind ?? "workflow"],
      review: { status: "draft" },
      author: { type: "system", id: "workflow-promote-route" },
      confidence: { score: 0.58, reason: "Promoted directly from workflow detail." },
      uncertaintySummary: "Workflow-backed memory should be reviewed for broader significance and causality." ,
    });
    redirect("/memory/review");
  }

  return (
    <>
      <PageHeader
        title="Promote workflow to memory"
        subtitle="Create a draft curated memory entry from this workflow run."
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Workflows", href: "/dashboard" },
          { label: <PiiSafe>{workflow.name}</PiiSafe>, href: `/workflows/${encodeURIComponent(workflow.id)}` },
          { label: "Promote" },
        ]}
      />

      <div className="section">
        <div className="section__header">
          <span className="section__title">Ready to promote</span>
          <span className="section__description">This creates a draft memory entry with this workflow as its origin reference.</span>
        </div>
        <div className="artifact-card">
          <div className="artifact-card__title"><PiiSafe>{workflow.name}</PiiSafe></div>
          <div className="list-item__subtitle"><PiiSafe>{workflow.summary ?? `${workflow.status} workflow run`}</PiiSafe></div>
          <div style={{ marginTop: 16 }}>
            <PromoteButton
              href="?create=1"
              itemTitle={workflow.name}
              label="Create draft memory entry"
            />
          </div>
        </div>
      </div>
    </>
  );
}
