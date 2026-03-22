"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileSearch,
  Layers3,
  Shield,
  Telescope,
  Workflow,
} from "lucide-react";
import { ThemeModeToggle } from "@/components/theme-toggle";
import { DemoModeToggle } from "@/components/demo-mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const NAV_MAIN = [
  {
    title: "Navigation",
    items: [
      { title: "Overview", url: "/dashboard", icon: BarChart3 },
      { title: "Traces", url: "/traces", icon: Telescope, matchPrefix: true },
      { title: "Workflows", url: "/workflows", icon: Workflow, matchPrefix: true },
      { title: "Artifacts", url: "/artifacts", icon: Layers3 },
      { title: "Memory", url: "/memory", icon: BookOpen },
      { title: "Investigations", url: "/investigations", icon: FileSearch },
    ],
  },
];

function isActive(pathname: string, item: { url: string; matchPrefix?: boolean }) {
  if (item.url === "/dashboard") return pathname === "/dashboard";
  if (item.matchPrefix) return pathname.startsWith(item.url);
  return pathname === item.url;
}

export function AppSidebar({
  latestIngest,
  ...props
}: { latestIngest?: string } & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
                <Shield className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">OpenTrust</span>
                <span className="text-xs text-muted-foreground">
                  {latestIngest && latestIngest !== "never"
                    ? `Ingested ${latestIngest}`
                    : "No ingestion"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_MAIN.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive(pathname, item)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2">
          <DemoModeToggle />
          <ThemeModeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
