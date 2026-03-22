"use client";

import { Search } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { SidebarData } from "@/components/sidebar-01/types";

interface NavHeaderProps {
  data: SidebarData;
}

export function NavHeader({ data }: NavHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigation = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  src="https://openclaw.ai/favicon.svg"
                  alt="Molty"
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
        <div
          className="flex items-center justify-between px-2 pb-0 pt-3 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center flex-1 gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-normal">
              Search
            </span>
          </div>
          <div className="flex items-center justify-center px-2 py-1 border border-border rounded-md">
            <kbd className="text-muted-foreground inline-flex font-[inherit] text-xs font-medium">
              <span className="opacity-70">⌘K</span>
            </kbd>
          </div>
        </div>
      </SidebarHeader>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search OpenTrust..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {data.navMain.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => handleNavigation(item.url)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Memory Tools">
            {data.navCollapsible.memoryTools.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => handleNavigation(item.url)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
