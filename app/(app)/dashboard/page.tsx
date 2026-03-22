import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoOverview, getDemoHealthSummary } from "@/lib/opentrust/demo-data";
import { summarizeHealth } from "@/lib/opentrust/health";
import { getOverview } from "@/lib/opentrust/overview";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";

export const dynamic = "force-dynamic";

function buildTableData(overview: ReturnType<typeof getOverview>) {
  let id = 1;
  const rows: {
    id: number;
    header: string;
    type: string;
    status: string;
    target: string;
    limit: string;
    reviewer: string;
  }[] = [];

  for (const trace of overview.recentTraces) {
    rows.push({
      id: id++,
      header: trace.title ?? trace.id,
      type: "Trace",
      status: trace.status === "completed" ? "Done" : "In Process",
      target: trace.session_label ?? "-",
      limit: "-",
      reviewer: "Assign reviewer",
    });
  }

  for (const wf of overview.recentWorkflows) {
    rows.push({
      id: id++,
      header: wf.name,
      type: "Workflow",
      status: wf.status === "completed" || wf.status === "done" ? "Done" : "In Process",
      target: wf.source_kind ?? "-",
      limit: "-",
      reviewer: "Assign reviewer",
    });
  }

  for (const artifact of overview.recentArtifacts.slice(0, 5)) {
    rows.push({
      id: id++,
      header: artifact.title ?? artifact.id,
      type: "Artifact",
      status: "Done",
      target: artifact.kind ?? "-",
      limit: "-",
      reviewer: "Assign reviewer",
    });
  }

  return rows;
}

export default async function DashboardPage() {
  const demo = await isDemoMode();
  const overview = demo ? getDemoOverview() : getOverview();
  const health = demo
    ? getDemoHealthSummary()
    : summarizeHealth({
        traces: overview.recentTraces,
        workflows: overview.recentWorkflows,
        ingestionStates: overview.ingestionStates,
      });

  const tableData = buildTableData(overview);

  return (
    <>
      <SectionCards
        sessions={overview.counts.sessions}
        traces={overview.counts.traces}
        workflows={overview.counts.workflows}
        memoryEntries={overview.counts.memoryEntries}
        attentionTraces={health.attentionTraces}
        riskyWorkflows={health.riskyWorkflows}
      />
      <div className="px-4 lg:px-0">
        <ChartAreaInteractive />
      </div>
      <DataTable data={tableData} />
    </>
  );
}
