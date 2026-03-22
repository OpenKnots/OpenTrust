"use client";

import * as React from "react";
import {
  IconChartBar,
  IconBook,
  IconCalendarMonth,
  IconFileSearch,
  IconApi,
  IconHelp,
  IconSearch,
  IconSettings,
  IconLayersLinked,
  IconRocket,
  IconTelescope,
  IconTopologyStar3,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/sidebar-01/nav-documents";
import { NavHeader } from "@/components/sidebar-01/nav-header";
import { NavMain } from "@/components/sidebar-01/nav-main";
import { NavSecondary } from "@/components/sidebar-01/nav-secondary";
import { NavUser } from "@/components/sidebar-01/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navMainItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: IconChartBar,
  },
  {
    title: "Traces",
    url: "/traces",
    icon: IconTelescope,
    matchPrefix: true,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: IconTopologyStar3,
    matchPrefix: true,
  },
  {
    title: "Artifacts",
    url: "/artifacts",
    icon: IconLayersLinked,
  },
  {
    title: "Onboarding",
    url: "/onboarding",
    icon: IconRocket,
  },
];

const memoryToolItems = [
  {
    name: "Memory",
    url: "/memory",
    icon: IconBook,
  },
  {
    name: "Calendar",
    url: "/calendar",
    icon: IconCalendarMonth,
  },
  {
    name: "Investigations",
    url: "/investigations",
    icon: IconFileSearch,
  },
  {
    name: "API",
    url: "/api-playground",
    icon: IconApi,
  },
];

const navSecondaryItems = [
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
  {
    title: "Get Help",
    url: "#",
    icon: IconHelp,
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch,
  },
];

const user = {
  name: "Operator",
  avatar: "https://openclaw.ai/favicon.svg",
};

export function AppSidebar({
  latestIngest,
  authLabel,
  ...props
}: { latestIngest?: string; authLabel?: string } & React.ComponentProps<typeof Sidebar>) {
  const handleSearchClick = React.useCallback(() => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }, []);

  const secondaryWithSearch = navSecondaryItems.map((item) =>
    item.title === "Search" ? { ...item, onClick: handleSearchClick } : item
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <NavHeader />
      <SidebarContent>
        <NavMain items={navMainItems} onSearchClick={handleSearchClick} />
        <NavDocuments items={memoryToolItems} />
        <NavSecondary items={secondaryWithSearch} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} latestIngest={latestIngest} authLabel={authLabel} />
      </SidebarFooter>
    </Sidebar>
  );
}
