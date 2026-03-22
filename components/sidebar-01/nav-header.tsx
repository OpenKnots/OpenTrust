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
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <Image
                src="https://openclaw.ai/favicon.svg"
                alt="OpenTrust"
                width={24}
                height={24}
                className="size-6"
              />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">OpenTrust</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
