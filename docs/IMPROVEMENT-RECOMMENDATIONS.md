# OpenTrust — Improvement Checklist

Codebase audit conducted 2026-03-27. Covers architecture, code quality,
security, testing, and operational readiness.

---

## Strengths to Preserve

Before improving, note what's already working well:

- [x] Timing-safe auth, CSRF protection, rate limiting, audit logging
- [x] Strict TypeScript with minimal `any` usage
- [x] Idempotent upserts, foreign keys, cascading deletes, FTS5 indexes
- [x] 24 documentation files covering architecture through plugin packaging
- [x] Clean module boundaries (DB, ingestion, search, memory, auth, UI)
- [x] Operational scripts (setup, update, harden, review, doctor, reset)
- [x] Local-first SQLite with WAL mode, no external service dependencies

---

## Phase 1 — Data Integrity & Crash Safety

_Goal: prevent data corruption and UI crashes. Small effort, high impact._

### Database Transactions

- [x] Wrap `import-openclaw.ts` ingestion loop in a `better-sqlite3` transaction
- [x] Wrap `import-cron.ts` workflow ingestion in a transaction
- [x] Wrap memory entry creation (entry + origins + tags) in a transaction
- [x] Wrap artifact extraction writes in a transaction
- [x] Audit all multi-statement write paths for missing transaction boundaries

### React Error Boundaries

- [x] Add root-level error boundary in the app layout
- [x] Add `error.tsx` for `(app)/dashboard`
- [x] Add `error.tsx` for `(app)/memory`
- [x] Add `error.tsx` for `(app)/traces`
- [x] Add `error.tsx` for `(app)/investigations`
- [x] Add `error.tsx` for `(app)/workflows`
- [x] Add `error.tsx` for `(app)/artifacts`
- [x] Add global `not-found.tsx` for 404 handling
- [ ] Add graceful fallbacks for API fetch failures in client components

---

## Phase 2 — API Consistency & CI

_Goal: standardize the API surface and add an automated quality gate._

### Standardize API Error Responses

- [x] Define shared `ApiError` type with `code`, `message`, optional `retryAfter`/`details`
- [x] Create `apiError(code, message, status)` helper function
- [x] Migrate `/api/auth/login` to use shared error helper
- [x] Migrate `/api/auth/logout` to use shared error helper
- [x] Migrate `/api/memory/*` routes to use shared error helper
- [ ] Document error codes in `docs/MEMORY-API-CONTRACT.md`

### CI/CD Pipeline

- [x] Create `.github/workflows/ci.yml` with checkout, pnpm install, lint, test, secretlint
- [ ] Verify pipeline passes on current `main` branch
- [ ] Enable branch protection requiring CI to pass before merge

---

## Phase 3 — Test Coverage (Core)

_Goal: build a safety net for the most critical code paths._

### Database & Ingestion Tests

- [x] Add test for `db.ts` initialization (WAL mode, foreign keys, tables created)
- [ ] Add test for `import-openclaw.ts` — valid session ingestion
- [ ] Add test for `import-openclaw.ts` — malformed JSONL handling
- [ ] Add test for `import-openclaw.ts` — duplicate/idempotent ingestion
- [ ] Add test for `import-openclaw.ts` — partial session recovery
- [ ] Add test for `import-cron.ts` — workflow run ingestion
- [ ] Add test for `import-cron.ts` — duplicate run handling
- [x] Add test for `ingestion-state.ts` — cursor tracking

### Memory & Search Tests

- [x] Add test for `memory-entries.ts` — create, read, update, delete
- [x] Add test for `memory-entries.ts` — filtering by tags, retention class
- [x] Add test for `search.ts` — FTS5 search with valid queries
- [x] Add test for `search.ts` — empty/whitespace query handling
- [ ] Add test for `search.ts` — memory → FTS → semantic fallback chain
- [ ] Add test for `semantic.ts` — vector indexing and retrieval

### Auth Tests

- [ ] Add test for `auth.ts` — session creation and verification
- [ ] Add test for `auth.ts` — timing-safe credential comparison
- [x] Add test for `auth.ts` — rate limiting behavior
- [ ] Add test for login API route — successful login
- [ ] Add test for login API route — invalid credentials
- [ ] Add test for login API route — rate limit enforcement
- [ ] Add test for logout API route

### Additional Tests Added

- [x] Add test for `sql-runner.ts` — read-only SQL validation
- [x] Add test for `api-contract.ts` — ok/fail envelope, ApiValidationError
- [x] Add test for `artifact-extract.ts` — URL, repo, doc extraction

---

## Phase 4 — Runtime Safety & Observability

_Goal: catch schema drift at runtime and make the system diagnosable._

### Runtime Validation of Database Results

- [ ] Define Zod schemas for core DB row types (sessions, traces, events)
- [ ] Define Zod schemas for memory entry rows
- [ ] Define Zod schemas for search result rows
- [ ] Add Zod `.parse()` validation to ingestion query results
- [ ] Add Zod `.parse()` validation to search query results
- [ ] Add Zod `.parse()` validation to memory CRUD query results
- [ ] Log validation failures with context (query, row shape) before throwing

### Structured Logging

- [x] Create `lib/opentrust/logger.ts` with levels: debug, info, warn, error
- [x] Add context fields: module name, operation, duration, session/trace ID
- [x] Output structured JSON for machine parsing
- [x] Replace `console.log` calls in `db.ts`
- [x] Replace `console.log` calls in `import-openclaw.ts`
- [x] Replace `console.log` calls in `import-cron.ts`
- [x] Replace `console.log` calls in `bootstrap.ts`
- [x] Replace `console.log` calls in `auth.ts`
- [x] Replace `console.log`/`console.error` calls in remaining modules
- [ ] Add request-level correlation IDs in API routes

---

## Phase 5 — Performance & Scalability

_Goal: ensure the system performs well as data volume grows._

### Batch SQL Operations

- [ ] Refactor ingestion loops to use multi-row `INSERT` where record count is known
- [ ] Benchmark session import before/after on a representative large session
- [ ] Profile SQLite query times on datasets with 1k+ sessions

### Search Scalability

- [x] Move memory entry filtering from in-memory `.includes()` to SQL LIKE
- [x] Reserve in-memory filtering only for fuzzy/semantic matching
- [ ] Add FTS5 index for memory entries if not already present
- [ ] Add pagination to search results (currently hardcoded `LIMIT 12`)
- [ ] Test search performance with 500+ memory entries

---

## Phase 6 — Test Coverage (Full) & DX

_Goal: complete test coverage and improve developer experience._

### Component & API Tests

- [ ] Set up Vitest + React Testing Library for component tests
- [ ] Add tests for memory management page
- [ ] Add tests for investigations page
- [ ] Add tests for traces detail page
- [ ] Add tests for dashboard page
- [ ] Achieve test file parity: every `lib/opentrust/` module has a test file

### JSDoc Documentation

- [x] Add JSDoc to all exported functions in `db.ts`
- [x] Add JSDoc to all exported functions in `search.ts`
- [x] Add JSDoc to all exported functions in `memory-entries.ts`
- [x] Add JSDoc to all exported functions in `auth.ts`
- [x] Add JSDoc to all exported functions in `import-openclaw.ts`
- [x] Add JSDoc to all exported functions in `import-cron.ts`
- [x] Add JSDoc to all exported functions in remaining `lib/opentrust/` modules

---

## Phase 7 — Polish

_Goal: refine the edges. Low urgency, ongoing._

### UI Polish

- [ ] Add skeleton screens for traces page during data loading
- [ ] Add skeleton screens for workflows page during data loading
- [ ] Add skeleton screens for memory page during data loading
- [ ] Wire `EmptyState` component into all list views with zero results

### Type Safety Cleanup

- [x] Audit `as never` casts — all 3 are in `db.ts` bridging `Record<string, unknown>` to `better-sqlite3`'s `BindingOrRecord`. Intentionally kept to avoid leaking the driver type into every caller.
- [ ] Audit for any remaining `as` casts that could be eliminated

### In-Memory Caching

- [ ] Add TTL cache for capabilities list (frequently read, rarely changes)
- [ ] Add TTL cache for ingestion state cursors
- [ ] Use simple `Map` with expiry timestamps — no external dependencies
