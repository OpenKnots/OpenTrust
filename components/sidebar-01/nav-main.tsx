"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCirclePlusFilled, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { QuickNoteDialog } from "@/components/quick-note-dialog";
import type { NavItem } from "./types";

function isActive(pathname: string, item: NavItem) {
  if (item.url === "/dashboard") return pathname === "/dashboard";
  if (item.matchPrefix) return pathname.startsWith(item.url);
  return pathname === item.url;
}

export function NavMain({
  items,
  onSearchClick,
}: {
  items: NavItem[];
  onSearchClick?: () => void;
}) {
  const pathname = usePathname();
  const [noteOpen, setNoteOpen] = React.useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="New Ingestion"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setNoteOpen(true)}
            >
              <IconCirclePlusFilled />
              <span>New Ingestion</span>
            </SidebarMenuButton>
            <QuickNoteDialog open={noteOpen} onOpenChange={setNoteOpen} />
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={onSearchClick}
            >
              <IconSearch />
              <span className="sr-only">Search</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                render={<Link href={item.url} />}
                isActive={isActive(pathname, item)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
