# OpenTrust Desktop Application Plan

## Purpose

This document defines how OpenTrust should be packaged and distributed as a **native desktop application** using [Tauri v2](https://v2.tauri.app/).

OpenTrust is currently a Next.js web app served from localhost. Wrapping it in Tauri turns it into a distributable, installable desktop application with native capabilities — without rewriting the frontend.

---

## Why Tauri

| Concern | Tauri answer |
|---------|--------------|
| Bundle size | ~5–10 MB (uses OS webview, not bundled Chromium) |
| Language | Rust backend, existing web frontend unchanged |
| SQLite | Native Rust SQLite access via `tauri-plugin-sql` or direct `rusqlite` |
| File system | First-class FS access through Tauri's security-scoped APIs |
| Auto-update | Built-in updater plugin |
| Cross-platform | macOS, Windows, Linux from one codebase |
| Security | Capability-scoped IPC, no full Node access in renderer |

Tauri v2 is the target. v1 APIs should not be used.

---

## Architecture

### Layers

```
┌─────────────────────────────────┐
│       Tauri native shell        │  ← Rust: window, tray, IPC, updater
├─────────────────────────────────┤
│     Next.js static export       │  ← Existing frontend, exported as static HTML/JS/CSS
├─────────────────────────────────┤
│    Tauri IPC bridge layer       │  ← Commands exposed from Rust, invoked from JS
├─────────────────────────────────┤
│     Core memory runtime         │  ← Rust-native or sidecar Node process for SQLite
└─────────────────────────────────┘
```

### Key decision: runtime strategy

Two viable approaches for hosting the memory runtime:

#### Option A — Sidecar Node process
- Keep the existing Node/better-sqlite3 runtime as-is
- Tauri launches it as a sidecar process
- Frontend communicates via localhost HTTP (existing API routes)
- Least migration risk; fastest path to a working desktop build

#### Option B — Rust-native runtime
- Rewrite the SQLite access layer in Rust using `rusqlite`
- Expose memory operations as Tauri IPC commands
- Frontend calls `invoke()` instead of `fetch()`
- Better performance, smaller bundle, no Node dependency
- Higher migration cost

### Recommendation

Start with **Option A** (sidecar) to ship a working desktop app quickly.
Evaluate **Option B** as a follow-up optimization if Node sidecar proves limiting.

---

## Feature plan

### Tier 1 — Minimal viable desktop app

These are required for the first distributable build.

- [ ] Tauri v2 project scaffold (`src-tauri/`)
- [ ] Next.js static export configuration (`output: 'export'`)
- [ ] Tauri window configuration (title, size, resizable, decorations)
- [ ] Sidecar or embedded server for the memory runtime
- [ ] SQLite database path resolution for desktop context (`$APPDATA` / `~/Library/Application Support`)
- [ ] Basic macOS `.dmg` build
- [ ] Basic Windows `.msi` / `.exe` build
- [ ] Basic Linux `.AppImage` / `.deb` build

### Tier 2 — Native integrations

These leverage desktop capabilities that a browser can't provide.

- [ ] System tray icon with status indicator (healthy / degraded / stale)
- [ ] Tray menu: open dashboard, run ingestion, check health, quit
- [ ] Native file dialog for SQLite database selection / backup export
- [ ] OS notifications for ingestion completion, health alerts, review reminders
- [ ] Global keyboard shortcut to open OpenTrust (configurable)
- [ ] Deep link support (`opentrust://` protocol)

### Tier 3 — Distribution and lifecycle

These make the desktop app production-grade.

- [ ] Auto-update via `tauri-plugin-updater` (check on launch, optional background check)
- [ ] Code signing for macOS (Developer ID) and Windows (Authenticode)
- [ ] macOS notarization
- [ ] Crash reporting and diagnostics
- [ ] First-run onboarding flow (database setup, OpenClaw path detection)
- [ ] Graceful migration from browser-based localhost usage to desktop app
- [ ] CI pipeline for cross-platform builds (GitHub Actions)

### Tier 4 — Advanced native features

These are stretch goals that further differentiate the desktop experience.

- [ ] Background ingestion service (runs even when window is closed, via tray)
- [ ] Scheduled ingestion (hourly/daily cron-like via Tauri)
- [ ] Native menu bar with keyboard shortcuts
- [ ] Multi-window support (detach trace detail, investigation, or health views)
- [ ] Spotlight / Alfred integration on macOS
- [ ] Touch Bar support on applicable MacBooks

---

## Migration considerations

### Static export compatibility

Next.js `output: 'export'` requires:
- No server-side rendering at request time (no `getServerSideProps`, no server actions)
- No API routes in the static export (they run in the sidecar or Tauri IPC instead)
- Dynamic routes must use `generateStaticParams` or client-side routing
- Image optimization must use a static-compatible loader

Current OpenTrust uses API routes for auth and memory operations. These need to be:
- Moved to the sidecar Node server, or
- Replaced with Tauri IPC commands

### Auth model

Desktop app auth can be simplified:
- Single-user local app typically doesn't need login
- Optional PIN/biometric lock for sensitive evidence
- Auth mode should auto-detect desktop vs. served context

### Database path

Desktop builds should use platform-standard paths:
- macOS: `~/Library/Application Support/OpenTrust/opentrust.db`
- Windows: `%APPDATA%\OpenTrust\opentrust.db`
- Linux: `~/.local/share/opentrust/opentrust.db`

Tauri provides `app_data_dir()` for this. The existing `storage/` convention should map cleanly.

---

## Project structure changes

```
opentrust/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   │   └── default.json
│   ├── icons/
│   │   ├── icon.icns
│   │   ├── icon.ico
│   │   └── icon.png
│   └── src/
│       ├── main.rs
│       ├── lib.rs
│       └── commands/          ← IPC commands (if using Option B)
├── app/                       ← existing Next.js app (unchanged)
├── lib/                       ← existing runtime (unchanged)
├── ...
```

### New package.json scripts

| Command | Description |
|---------|-------------|
| `pnpm tauri dev` | Start Tauri dev mode (hot-reload frontend + native shell) |
| `pnpm tauri build` | Produce distributable desktop builds |
| `pnpm tauri icon` | Generate platform icons from source image |

---

## Prerequisite relationship

This plan **is** the concrete expansion of the "Tauri" prerequisite referenced throughout:
- `docs/PHASES.md`
- `docs/EXECUTION-PIPELINE.md`
- `docs/POST-PREREQUISITE-PR-BACKLOG.md`

Desktop packaging is no longer just a vague upstream dependency.
It is a defined deliverable with its own phased plan.

### Sequencing

Desktop application work can begin in parallel with persistence and reliable run completion work, since:
- The Tauri scaffold and static export setup are independent of runtime reliability
- Sidecar-based builds preserve the existing runtime unchanged
- Native integrations (tray, notifications) layer on top without blocking core work

However, **Tier 3 distribution features** (auto-update, code signing, CI) should wait until the core memory layer is stable enough to ship to users.

---

## Success criteria

The desktop application plan is complete when:
- OpenTrust can be installed and launched as a native app on macOS, Windows, and Linux
- The memory layer works identically to the current localhost experience
- Users don't need to run terminal commands to start the app
- Ingestion and indexing can be triggered from the app UI or system tray
- Updates can be delivered without manual reinstallation
- The desktop app feels native, not like a browser tab with a frame
