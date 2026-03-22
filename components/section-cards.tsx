import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  sessions: number;
  traces: number;
  workflows: number;
  memoryEntries: number;
  attentionTraces: number;
  riskyWorkflows: number;
}

export function SectionCards({
  sessions,
  traces,
  workflows,
  memoryEntries,
  attentionTraces,
  riskyWorkflows,
}: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:shadow-xs grid auto-rows-min gap-4 px-4 sm:grid-cols-2 lg:px-0 xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sessions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {sessions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Imported sessions <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total tracked sessions from ingestion
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Traces</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {traces.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={attentionTraces > 0 ? "destructive" : "outline"}>
              {attentionTraces > 0 ? (
                <><IconTrendingDown />{attentionTraces} attention</>
              ) : (
                <><IconTrendingUp />Healthy</>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {attentionTraces > 0
              ? `${attentionTraces} traces need review`
              : "All traces healthy"}
            {attentionTraces > 0 ? (
              <IconTrendingDown className="size-4" />
            ) : (
              <IconTrendingUp className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {attentionTraces > 0 ? "Attention traces require action" : "No issues detected"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Workflows</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {workflows.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={riskyWorkflows > 0 ? "destructive" : "outline"}>
              {riskyWorkflows > 0 ? (
                <><IconTrendingDown />{riskyWorkflows} at risk</>
              ) : (
                <><IconTrendingUp />Stable</>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {riskyWorkflows > 0
              ? `${riskyWorkflows} workflows at risk`
              : "All workflows stable"}
            {riskyWorkflows > 0 ? (
              <IconTrendingDown className="size-4" />
            ) : (
              <IconTrendingUp className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Workflow execution status
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Memory Entries</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {memoryEntries.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Curated
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Curated knowledge base <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Promoted from traces and reviews
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
