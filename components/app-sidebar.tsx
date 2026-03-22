"use client";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import {
  BarChart3,
  BookOpen,
  FileSearch,
  Layers3,
  Rocket,
  Telescope,
  Workflow,
  Zap,
} from "lucide-react";
import { NavCollapsible } from "@/components/sidebar-01/nav-collapsible";
import { NavFooter } from "@/components/sidebar-01/nav-footer";
import { NavHeader } from "@/components/sidebar-01/nav-header";
import { NavMain } from "@/components/sidebar-01/nav-main";
import type { SidebarData } from "@/components/sidebar-01/types";

const data: SidebarData = {
  navMain: [
    {
      id: "overview",
      title: "Overview",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      id: "traces",
      title: "Traces",
      url: "/traces",
      icon: Telescope,
      matchPrefix: true,
    },
    {
      id: "workflows",
      title: "Workflows",
      url: "/workflows",
      icon: Workflow,
      matchPrefix: true,
    },
    {
      id: "artifacts",
      title: "Artifacts",
      url: "/artifacts",
      icon: Layers3,
    },
    {
      id: "onboarding",
      title: "Onboarding",
      url: "/onboarding",
      icon: Rocket,
    },
  ],
  navCollapsible: {
    memoryTools: [
      {
        id: "memory",
        title: "Memory",
        url: "/memory",
        icon: BookOpen,
      },
      {
        id: "investigations",
        title: "Investigations",
        url: "/investigations",
        icon: FileSearch,
      },
      {
        id: "api",
        title: "API",
        url: "/api-playground",
        icon: Zap,
      },
    ],
  },
};

export function AppSidebar({
  latestIngest,
  ...props
}: { latestIngest?: string } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <NavHeader data={data} />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCollapsible memoryTools={data.navCollapsible.memoryTools} />
      </SidebarContent>
      <NavFooter latestIngest={latestIngest} />
      <SidebarRail />
    </Sidebar>
  );
}
