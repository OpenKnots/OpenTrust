import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "sqlite-vec"],
  // Standalone output produces a self-contained server.js suitable for
  // the Tauri sidecar.  In development this has no effect on `next dev`.
  output: "standalone",
};

export default nextConfig;
