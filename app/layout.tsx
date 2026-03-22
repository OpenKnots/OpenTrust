import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenTrust",
  description: "Local-first OpenClaw traceability, workflows, skills, plugins, and investigations.",
};

const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("opentrust.theme-mode")||"system";if(m==="system"){m=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var d=document.documentElement;d.dataset.themeMode=m;d.style.colorScheme=m}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
