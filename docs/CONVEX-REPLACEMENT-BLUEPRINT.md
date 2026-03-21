# OpenTrust → Convex-native Replacement Blueprint

## Executive summary

If the goal is a **complete replacement** built around Convex's full suite of tools and templates, then OpenTrust should be treated as:
- a **product prototype**
- a **UX reference**
- a **feature-priority map**

It should **not** be treated as the long-term technical base.

The replacement should be designed as a **Convex-native data operations and observability product** with:
- realtime state
- typed backend functions
- saved investigations
- anomaly surfacing
- drill-down detail views
- operator-first dashboard UX

---

## Product framing

### Working product thesis
Build a **database operations cockpit** for modern data systems with:
- a dashboard-first operator experience
- saved investigations
- anomaly detection and surfacing
- drill-downs into queries, jobs, collections/tables, and artifacts
- local and remote data source support over time

### Best positioning
This product should not try to be:
- a generic SQL GUI clone
- phpMyAdmin with prettier glassmorphism

It should be:
- **investigation-first**
- **operations-aware**
- **developer-operator friendly**
- **trust / observability oriented**

---

## What to keep from OpenTrust

### Keep the product ideas
- dashboard-first information architecture
- anomaly/attention panels
- artifact explorer concept
- saved investigations concept
- trace/workflow drill-down patterns
- status strip pattern
- bento grid layout
- local-first language where helpful
- evidence/provenance framing

### Keep the interaction patterns
- summary → drill-down
- operator quick actions
- compact status pills
- relative-time labels
- search + investigations side by side

### Keep the design direction
- dark glassmorphic UI
- minimalist cards
- cockpit-like command center composition
- low-noise, high-signal layout hierarchy

---

## What to discard from OpenTrust as foundation

### Do not keep as core architecture
- SQLite-first system-of-record as the primary product substrate
- ingestion-first internal architecture as the main app model
- current trace/workflow schema as the canonical backend design
- OpenTrust-specific entity naming where it does not fit the new product

### Why
Those choices were right for a local OpenClaw traceability tool.
They are not the cleanest foundation for a Convex-native replacement.

---

## Convex-native target architecture

## Frontend
- Next.js app router
- React + TypeScript
- same dashboard-first UI style refined from OpenTrust
- client components only where interaction requires it
- server/client split aligned to Convex usage patterns

## Backend
- Convex as primary backend runtime
- Convex schema for app entities
- Convex queries for read models
- Convex mutations for operator actions
- Convex actions where external integrations are needed
- Convex scheduler for jobs / refresh / anomaly recomputation
- Convex file storage when artifact or export storage is needed

## Auth and environments
- use Convex’s recommended auth model
- support role-based views later (operator/admin/read-only)
- keep environment separation explicit:
  - local dev
  - preview/staging
  - production

---

## Suggested core domain model

## Top-level entities
- `workspaces`
- `projects`
- `dataSources`
- `deployments`
- `collections` or `tables`
- `queries`
- `queryRuns`
- `functions`
- `jobs`
- `artifacts`
- `investigations`
- `alerts`
- `activityEvents`

## Recommended mental model

### `workspaces`
Boundary for an operator or team.

### `projects`
Logical grouping within a workspace.

### `dataSources`
Represents a system being operated against.
Examples:
- Convex deployment
- local SQLite DB
- Postgres connection
- future remote providers

### `deployments`
Environment-specific instances of a data source.
Examples:
- local
- staging
- prod

### `collections` / `tables`
Schema-visible data containers.

### `queries`
Saved investigation/query definitions.

### `queryRuns`
Execution history for those investigations.

### `functions`
Application/backend callable logic relevant to the source.
For Convex this could map naturally to Convex functions.

### `jobs`
Scheduled/async tasks, imports, maintenance jobs, backfills, watchers.

### `artifacts`
Exports, reports, snapshots, generated outputs, linked resources.

### `investigations`
Operator-friendly containers for saved queries, notes, findings, and maybe links to alerts/artifacts.

### `alerts`
Anomalies, failures, drift, staleness, suspicious trends.

### `activityEvents`
Unified feed for latest activity.
This replaces some of OpenTrust’s trace-specific framing with a broader product event model.

---

## Mapping OpenTrust concepts to the new product

| OpenTrust concept | Convex-native replacement concept |
|---|---|
| traces | activity events / investigations / incidents |
| workflows | jobs / runs |
| artifacts | artifacts |
| saved investigations | investigations + queries |
| ingestion state | sync jobs / source health |
| semantic chunks | query/index/search support layer |
| capabilities | providers / integrations / tools |

---

## Information architecture

## Primary routes
- `/` → dashboard
- `/sources` → data sources
- `/sources/[id]` → source detail
- `/queries` → investigations + saved queries
- `/queries/[id]` → query detail + run history
- `/jobs` → background jobs / task status
- `/artifacts` → artifact explorer
- `/alerts` → anomalies / needs attention
- `/activity` → recent event feed

## Dashboard blocks
Top-level dashboard should include:
- source health
- active alerts
- query activity
- latest job runs
- artifact/export activity
- saved investigations preview
- recent activity pulse

This keeps the best OpenTrust dashboard instincts while shifting the model toward data operations.

---

## Provider strategy

## Phase 1 provider strategy
Start with:
1. **Convex** (primary)
2. **SQLite** (secondary local provider)

Why:
- Convex aligns to the strategic direction
- SQLite preserves a local/offline story and internal testing value

## Phase 2 providers
Later add:
- Postgres
- Neon / Supabase if desired
- maybe Redis or other operational stores if the product direction justifies it

---

## Roadmap

## Phase A — Replacement spec
- lock product thesis
- define entities and route map
- define Convex schema
- define which OpenTrust UX patterns survive

## Phase B — New Convex-native scaffold
- create new repo/app
- install Convex and Next stack
- define schema
- build source/deployment model
- add auth and environment strategy

## Phase C — Dashboard core
- dashboard homepage
- source health cards
- alerts panel
- recent activity
- quick actions

## Phase D — Queries and investigations
- saved investigations
- run/read-only query flow
- result preview tables
- query history

## Phase E — Jobs and artifacts
- job runs
- status tracking
- artifact explorer
- exports / reports

## Phase F — Advanced product layer
- anomaly heuristics
- semantic search / indexing if needed
- richer provider integrations
- sharing / collaboration / saved views

---

## Recommended implementation rules

- keep UI **dashboard-first**
- keep naming product-native; avoid importing OpenTrust-specific vocabulary where it no longer fits
- preserve **progressive disclosure**
- bias toward **operator speed** over explanatory prose
- keep read-only and write-capable actions visibly distinct
- add strong empty states and source health messaging early

---

## Recommendation

### Strong recommendation
If replacement is the plan, start a **new Convex-native repo** and do not continue evolving OpenTrust as if it were the future foundation.

### Best use of OpenTrust now
Use it as:
- product prototype
- design reference
- feature prioritization input
- language and layout source

### Do not do
- force Convex into OpenTrust’s current backend architecture
- keep stretching the SQLite-first traceability model into a different product category

That would add avoidable architectural drag.

---

## Immediate next step
Create the new product spec/repo around this blueprint, then implement:
1. dashboard shell
2. source model
3. Convex schema and functions
4. saved investigations
5. alerts + activity
