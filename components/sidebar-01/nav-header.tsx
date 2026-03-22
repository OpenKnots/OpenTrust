"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" render={<Link href="/" />}>
            <div className="brand-ring flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#b71c1c]">
              <Image
                src="https://openclaw.ai/favicon.svg"
                alt="OpenTrust"
                width={20}
                height={20}
                className="size-5 brightness-0 invert"
              />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold tracking-tight">OpenTrust</span>
              <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
                by OpenClaw
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
