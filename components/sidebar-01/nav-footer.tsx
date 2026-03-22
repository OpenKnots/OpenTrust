"use client";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DemoModeToggle } from "@/components/demo-mode-toggle";
import { ThemeModeToggle } from "@/components/theme-toggle";

export function NavFooter({ latestIngest }: { latestIngest?: string }) {
  return (
    <SidebarFooter className="p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  latestIngest && latestIngest !== "never"
                    ? "bg-green-500"
                    : "bg-orange-500"
                }`}
              />
              <span>
                {latestIngest && latestIngest !== "never"
                  ? `Ingested ${latestIngest}`
                  : "No ingestion"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DemoModeToggle />
              <ThemeModeToggle />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
