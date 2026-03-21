# Convex-native Replacement — Product Spec

## Working status
Draft product spec for a new Convex-native replacement inspired by OpenTrust's UX and operator model.

---

## 1. Product name

**Working codename:** OpenTrust Next

This is a placeholder.
Do not treat it as final branding.

---

## 2. Product thesis

Build a **database operations cockpit** for modern app backends.

The product should help developers and operators:
- inspect data systems quickly
- understand what changed and why
- run saved investigations
- surface anomalies and failing jobs
- move fluidly between dashboard, source detail, query detail, jobs, and artifacts

This is **not** meant to be a generic legacy admin tool clone.
It should feel:
- modern
- real-time
- dashboard-first
- operator-friendly
- minimal but powerful

---

## 3. Primary audience

### Core audience
- developers
- DevRel engineers
- technical operators
- startup engineers
- internal platform teams

### Likely usage modes
- investigating production issues
- inspecting backend activity
- reviewing scheduled jobs
- running saved queries
- validating schema/data expectations
- generating operational visibility for demos/support/debugging

---

## 4. MVP product definition

## MVP promise
A user can connect to a backend source, land on a dashboard, inspect health/activity, run saved investigations, review jobs, and browse related artifacts without needing raw infrastructure spelunking.

## MVP includes
- dashboard homepage
- source/deployment model
- saved investigations
- query result previews
- jobs view
- artifact explorer
- alert/anomaly surfacing
- recent activity feed
- Convex as the primary backend/provider

## MVP excludes
- full multi-provider support on day one
- collaborative editing/sharing
- fine-grained RBAC beyond simple operator roles
- giant graph visualizations
- massive ETL/data warehouse functionality

---

## 5. Core user stories

### Dashboard
- As an operator, I want to see source health and recent activity immediately.
- As an operator, I want to know if anything needs attention without clicking around.

### Investigations
- As an operator, I want reusable investigations for common problems.
- As an operator, I want preview results quickly without context switching.

### Jobs
- As an operator, I want to review recent jobs, failures, and status transitions.

### Artifacts
- As an operator, I want to inspect exports, links, logs, or other generated outputs in one place.

### Source detail
- As an operator, I want to understand a deployment/source’s state, recent activity, and relevant investigations.

---

## 6. Product pillars

### A. Dashboard-first
The homepage is the command center.

### B. Investigation-first
Saved investigations are first-class, not an afterthought.

### C. Real-time operational clarity
The product should feel alive and current, not stale or static.

### D. Progressive disclosure
Show summaries first, then details, then raw records.

### E. Minimalist power
Keep it visually calm while exposing powerful flows.

---

## 7. Information architecture

## Primary routes
- `/` — dashboard
- `/sources` — data sources / deployments
- `/sources/[id]` — source detail
- `/investigations` — saved investigations
- `/investigations/[id]` — investigation detail
- `/jobs` — job runs and status
- `/jobs/[id]` — job detail
- `/artifacts` — artifact explorer
- `/alerts` — anomalies / attention items
- `/activity` — recent activity feed

## Dashboard modules
- source health summary
- latest activity pulse
- attention panel
- recent jobs
- saved investigations preview
- artifact preview
- quick actions

---

## 8. Domain model

## Top-level entities
- `workspaces`
- `projects`
- `dataSources`
- `deployments`
- `collections` or `tables`
- `queries`
- `queryRuns`
- `jobs`
- `jobRuns`
- `artifacts`
- `investigations`
- `alerts`
- `activityEvents`

## Notes on interpretation

### dataSources
Represents the system being operated against.
Examples:
- Convex deployment
- SQLite DB
- future Postgres source

### deployments
Environment-level instances of a source.
Examples:
- dev
- staging
- prod

### investigations
Operator-friendly containers for reusable questions and workflows.
Can reference one or more saved queries.

### activityEvents
A unified operational feed for what happened recently.

### alerts
The anomaly/attention layer surfaced across the UI.

---

## 9. Convex-native architecture

## Frontend
- Next.js app router
- React + TypeScript
- dashboard-first UI
- strong client responsiveness
- selective client components for interactivity

## Backend
- Convex schema
- Convex queries
- Convex mutations
- Convex actions for external/provider calls
- Convex scheduled jobs where needed
- Convex storage for stored artifacts/exports where relevant

## Provider posture
### Phase 1
- Convex primary provider

### Phase 2
- SQLite secondary/local provider

### Phase 3
- optional Postgres and others if the product direction still justifies it

---

## 10. What to preserve from OpenTrust

Preserve:
- dashboard composition
- anomaly surfacing
- saved investigations concept
- artifact explorer concept
- status strips
- bento panel hierarchy
- operator-first copy/flow
- progressive disclosure patterns

Do **not** preserve as backend foundation:
- SQLite-first OpenTrust data model
- trace/workflow schema as canonical product schema
- ingestion-centric architecture as the primary app model

---

## 11. MVP screens

### Dashboard
Must answer immediately:
- is anything broken?
- what changed recently?
- what source/deployment is unhealthy?
- what should I click next?

### Investigations
Must support:
- list saved investigations
- preview result sets
- inspect underlying query text
- eventually run/copy/export

### Jobs
Must support:
- recent job runs
- failures
- filters by status/environment
- detail drill-down

### Artifacts
Must support:
- list artifacts
- filter by type
- sort by freshness
- jump back to related sources/jobs/investigations later

### Source detail
Must support:
- deployment/source summary
- recent jobs
- alerts
- linked investigations
- linked artifacts

---

## 12. Success criteria for MVP

The MVP is successful if a user can:
1. connect/use a Convex-backed project
2. land on a useful dashboard
3. identify attention items quickly
4. open a saved investigation and preview results
5. inspect a job run and related artifact
6. navigate without confusion

---

## 13. UX requirements

- dark glassmorphic UI
- minimalist, high-signal layout
- clear hierarchy
- strong empty states
- relative timestamps by default
- readable tables and result previews
- responsive layout for smaller screens
- dashboard should feel fast and ambient, not verbose

---

## 14. Build phases

## Phase 1 — product scaffold
- repo/app creation
- Convex setup
- route shell
- dashboard shell
- design system tokens/components

## Phase 2 — source and deployment model
- data source schema
- deployment schema
- source/deployment detail pages
- source health cards

## Phase 3 — investigations
- saved investigations schema
- list page
- detail page
- preview execution

## Phase 4 — jobs and alerts
- jobs/jobRuns schema
- alerts schema
- job list/detail
- dashboard attention panel wired to real data

## Phase 5 — artifacts and activity
- artifact schema
- artifact explorer
- activity feed
- quick linking between modules

## Phase 6 — secondary provider support
- SQLite provider support
- provider abstraction hardening

---

## 15. Immediate next step

Create a new Convex-native repo and implement:
1. app shell
2. dashboard shell
3. source/deployment schema
4. saved investigations MVP

That is the smallest coherent slice that proves the replacement direction.
