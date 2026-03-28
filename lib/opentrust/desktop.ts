/**
 * Desktop environment detection and Tauri IPC helpers.
 *
 * These are safe to import from both server and client code — they guard
 * against `window` / `__TAURI_INTERNALS__` not existing.
 */

/** Returns true when running inside the Tauri webview shell. */
export function isDesktop(): boolean {
  if (typeof window === "undefined") {
    // Server-side: check the env flag set by the sidecar launcher
    return process.env.OPENTRUST_DESKTOP === "1";
  }
  // Client-side: Tauri injects this global
  return "__TAURI_INTERNALS__" in window;
}

/** Returns true when running as a normal browser-served web app. */
export function isWeb(): boolean {
  return !isDesktop();
}
