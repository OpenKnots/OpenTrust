import { notFound, redirect } from "next/navigation";
import { getWorkflowDetail } from "@/lib/opentrust/workflow-details";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function PromoteWorkflowPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ create?: string }>;
}) {
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
          { label: workflow.name, href: `/workflows/${encodeURIComponent(workflow.id)}` },
          { label: "Promote" },
        ]}
      />

      <div className="section">
        <div className="section__header">
          <span className="section__title">Ready to promote</span>
          <span className="section__description">This creates a draft memory entry with this workflow as its origin reference.</span>
        </div>
        <div className="artifact-card">
          <div className="artifact-card__title">{workflow.name}</div>
          <div className="list-item__subtitle">{workflow.summary ?? `${workflow.status} workflow run`}</div>
          <div style={{ marginTop: 16 }}>
            <a className="btn btn--primary" href={`?create=1`}>Create draft memory entry</a>
          </div>
        </div>
      </div>
    </>
  );
}
