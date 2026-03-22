import type { ElementType } from "react";

export interface NavItem {
  id: string;
  title: string;
  icon: ElementType;
  url: string;
  matchPrefix?: boolean;
}

export interface MemoryToolItem {
  id: string;
  title: string;
  url: string;
  icon: ElementType;
}

export interface SidebarData {
  navMain: NavItem[];
  navCollapsible: {
    memoryTools: MemoryToolItem[];
  };
}
