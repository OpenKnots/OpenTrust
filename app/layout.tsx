import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { RegisterSW } from "@/components/register-sw";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const siteUrl = process.env.OPENTRUST_APP_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OpenTrust",
  description: "Review, trace, and trust every piece of agent memory. Local-first. Open source.",
  manifest: "/manifest.json",
  openGraph: {
    title: "OpenTrust — Memory, made visible.",
    description: "Review, trace, and trust every piece of agent memory. Local-first. Open source.",
    siteName: "OpenTrust",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenTrust — Memory, made visible.",
    description: "Review, trace, and trust every piece of agent memory. Local-first. Open source.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OpenTrust",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
