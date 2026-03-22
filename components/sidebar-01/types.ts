import type { ElementType } from "react";

export interface NavItem {
  title: string;
  url: string;
  icon?: ElementType;
  matchPrefix?: boolean;
}

export interface DocumentItem {
  name: string;
  url: string;
  icon: ElementType;
}

export interface SecondaryNavItem {
  title: string;
  url: string;
  icon: ElementType;
}

export interface UserData {
  name: string;
  avatar: string;
}
