"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconDotsVertical,
  IconInfoCircle,
  IconMoon,
  IconPlayerPlay,
  IconPlayerStop,
  IconSun,
  IconSunMoon,
} from "@tabler/icons-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const DEMO_COOKIE = "opentrust.demo-mode";
const THEME_KEY = "opentrust.theme-mode";
type ThemeMode = "system" | "light" | "dark";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.dataset.themeMode = resolved;
  root.style.colorScheme = resolved;
}

export function NavUser({
  user,
  latestIngest,
}: {
  user: { name: string; avatar: string };
  latestIngest?: string;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [demoActive, setDemoActive] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    setDemoActive(getCookie(DEMO_COOKIE) === "true");
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (stored && ["system", "light", "dark"].includes(stored)) {
      setTheme(stored);
      applyTheme(resolveTheme(stored));
    }
  }, []);

  useEffect(() => {
    applyTheme(resolveTheme(theme));
    localStorage.setItem(THEME_KEY, theme);

    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme(resolveTheme("system"));
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  function toggleDemo() {
    const next = !demoActive;
    setDemoActive(next);
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${DEMO_COOKIE}=${next}; path=/; expires=${expires}; SameSite=Lax`;
    router.refresh();
  }

  function cycleTheme() {
    const order: ThemeMode[] = ["system", "light", "dark"];
    setTheme((prev) => order[(order.indexOf(prev) + 1) % order.length]);
  }

  const hasIngestion = latestIngest && latestIngest !== "never";
  const themeIcon =
    theme === "light" ? <IconSun className="size-4" /> :
    theme === "dark" ? <IconMoon className="size-4" /> :
    <IconSunMoon className="size-4" />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          />}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">OT</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {hasIngestion ? `Ingested ${latestIngest}` : "No ingestion"}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">OT</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        hasIngestion ? "bg-green-500" : "bg-orange-500"
                      }`}
                    />
                    {hasIngestion ? `Ingested ${latestIngest}` : "No ingestion"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={toggleDemo}>
                {demoActive ? (
                  <IconPlayerStop className="text-muted-foreground" />
                ) : (
                  <IconPlayerPlay className="text-muted-foreground" />
                )}
                {demoActive ? "Disable Demo Mode" : "Enable Demo Mode"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={cycleTheme}>
                {themeIcon}
                Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconInfoCircle className="text-muted-foreground" />
              About OpenTrust
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
