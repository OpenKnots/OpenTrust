import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenTrust",
  description: "Local-first OpenClaw traceability, workflows, skills, plugins, and investigations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
