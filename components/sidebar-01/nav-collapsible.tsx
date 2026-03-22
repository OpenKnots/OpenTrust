"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { MemoryToolItem } from "@/components/sidebar-01/types";

interface NavCollapsibleProps {
  memoryTools: MemoryToolItem[];
}

function isActive(pathname: string, item: MemoryToolItem) {
  return pathname === item.url;
}

export function NavCollapsible({ memoryTools }: NavCollapsibleProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-0">
      {memoryTools && memoryTools.length > 0 && (
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              className="text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              render={<CollapsibleTrigger />}
            >
              Memory Tools
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {memoryTools.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          render={<Link href={item.url} />}
                          isActive={isActive(pathname, item)}
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      )}
    </div>
  );
}
