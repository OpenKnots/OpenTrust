"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const chartData = [
  { date: "2024-04-01", traces: 12, workflows: 4 },
  { date: "2024-04-02", traces: 8, workflows: 3 },
  { date: "2024-04-03", traces: 15, workflows: 6 },
  { date: "2024-04-04", traces: 22, workflows: 8 },
  { date: "2024-04-05", traces: 18, workflows: 5 },
  { date: "2024-04-06", traces: 9, workflows: 2 },
  { date: "2024-04-07", traces: 14, workflows: 7 },
  { date: "2024-04-08", traces: 25, workflows: 10 },
  { date: "2024-04-09", traces: 6, workflows: 1 },
  { date: "2024-04-10", traces: 19, workflows: 8 },
  { date: "2024-04-11", traces: 30, workflows: 12 },
  { date: "2024-04-12", traces: 21, workflows: 9 },
  { date: "2024-04-13", traces: 28, workflows: 11 },
  { date: "2024-04-14", traces: 11, workflows: 3 },
  { date: "2024-04-15", traces: 10, workflows: 4 },
  { date: "2024-04-16", traces: 13, workflows: 5 },
  { date: "2024-04-17", traces: 35, workflows: 14 },
  { date: "2024-04-18", traces: 29, workflows: 11 },
  { date: "2024-04-19", traces: 20, workflows: 7 },
  { date: "2024-04-20", traces: 7, workflows: 2 },
  { date: "2024-04-21", traces: 11, workflows: 4 },
  { date: "2024-04-22", traces: 16, workflows: 6 },
  { date: "2024-04-23", traces: 13, workflows: 5 },
  { date: "2024-04-24", traces: 32, workflows: 13 },
  { date: "2024-04-25", traces: 17, workflows: 6 },
  { date: "2024-04-26", traces: 5, workflows: 1 },
  { date: "2024-04-27", traces: 31, workflows: 12 },
  { date: "2024-04-28", traces: 10, workflows: 3 },
  { date: "2024-04-29", traces: 24, workflows: 9 },
  { date: "2024-04-30", traces: 36, workflows: 15 },
  { date: "2024-05-01", traces: 14, workflows: 5 },
  { date: "2024-05-02", traces: 23, workflows: 8 },
  { date: "2024-05-03", traces: 19, workflows: 7 },
  { date: "2024-05-04", traces: 33, workflows: 14 },
  { date: "2024-05-05", traces: 40, workflows: 16 },
  { date: "2024-05-06", traces: 42, workflows: 18 },
  { date: "2024-05-07", traces: 31, workflows: 12 },
  { date: "2024-05-08", traces: 12, workflows: 4 },
  { date: "2024-05-09", traces: 18, workflows: 7 },
  { date: "2024-05-10", traces: 24, workflows: 9 },
  { date: "2024-05-11", traces: 27, workflows: 10 },
  { date: "2024-05-12", traces: 16, workflows: 5 },
  { date: "2024-05-13", traces: 15, workflows: 6 },
  { date: "2024-05-14", traces: 37, workflows: 15 },
  { date: "2024-05-15", traces: 39, workflows: 16 },
  { date: "2024-05-16", traces: 26, workflows: 10 },
  { date: "2024-05-17", traces: 41, workflows: 17 },
  { date: "2024-05-18", traces: 25, workflows: 9 },
  { date: "2024-05-19", traces: 18, workflows: 6 },
  { date: "2024-05-20", traces: 14, workflows: 5 },
  { date: "2024-05-21", traces: 6, workflows: 2 },
  { date: "2024-05-22", traces: 7, workflows: 3 },
  { date: "2024-05-23", traces: 20, workflows: 8 },
  { date: "2024-05-24", traces: 23, workflows: 9 },
  { date: "2024-05-25", traces: 16, workflows: 6 },
  { date: "2024-05-26", traces: 17, workflows: 7 },
  { date: "2024-05-27", traces: 34, workflows: 14 },
  { date: "2024-05-28", traces: 18, workflows: 7 },
  { date: "2024-05-29", traces: 6, workflows: 2 },
  { date: "2024-05-30", traces: 28, workflows: 11 },
  { date: "2024-05-31", traces: 14, workflows: 5 },
  { date: "2024-06-01", traces: 15, workflows: 6 },
  { date: "2024-06-02", traces: 38, workflows: 16 },
  { date: "2024-06-03", traces: 8, workflows: 3 },
  { date: "2024-06-04", traces: 36, workflows: 15 },
  { date: "2024-06-05", traces: 7, workflows: 2 },
  { date: "2024-06-06", traces: 23, workflows: 9 },
  { date: "2024-06-07", traces: 26, workflows: 10 },
  { date: "2024-06-08", traces: 31, workflows: 12 },
  { date: "2024-06-09", traces: 36, workflows: 14 },
  { date: "2024-06-10", traces: 12, workflows: 4 },
  { date: "2024-06-11", traces: 7, workflows: 3 },
  { date: "2024-06-12", traces: 40, workflows: 17 },
  { date: "2024-06-13", traces: 6, workflows: 2 },
  { date: "2024-06-14", traces: 34, workflows: 13 },
  { date: "2024-06-15", traces: 25, workflows: 10 },
  { date: "2024-06-16", traces: 30, workflows: 12 },
  { date: "2024-06-17", traces: 39, workflows: 16 },
  { date: "2024-06-18", traces: 8, workflows: 3 },
  { date: "2024-06-19", traces: 27, workflows: 11 },
  { date: "2024-06-20", traces: 33, workflows: 13 },
  { date: "2024-06-21", traces: 13, workflows: 5 },
  { date: "2024-06-22", traces: 25, workflows: 10 },
  { date: "2024-06-23", traces: 39, workflows: 16 },
  { date: "2024-06-24", traces: 10, workflows: 4 },
  { date: "2024-06-25", traces: 11, workflows: 5 },
  { date: "2024-06-26", traces: 35, workflows: 14 },
  { date: "2024-06-27", traces: 37, workflows: 15 },
  { date: "2024-06-28", traces: 12, workflows: 4 },
  { date: "2024-06-29", traces: 8, workflows: 3 },
  { date: "2024-06-30", traces: 36, workflows: 15 },
];

const chartConfig = {
  activity: {
    label: "Activity",
  },
  traces: {
    label: "Traces",
    color: "var(--brand)",
  },
  workflows: {
    label: "Workflows",
    color: "color-mix(in srgb, var(--brand) 55%, #ff9800)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Trace &amp; Workflow Activity</CardTitle>
        <CardAction>
          <CardDescription>
            Total for the last 3 months
          </CardDescription>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTraces" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-traces)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-traces)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillWorkflows" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-workflows)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-workflows)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="workflows"
              type="natural"
              fill="url(#fillWorkflows)"
              stroke="var(--color-workflows)"
              stackId="a"
            />
            <Area
              dataKey="traces"
              type="natural"
              fill="url(#fillTraces)"
              stroke="var(--color-traces)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
