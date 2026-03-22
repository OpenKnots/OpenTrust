# OpenTrust UI/UX Comprehensive Revamp Plan

Status: Active  
Owner: Val + Nova  
Scope: Full app UI/UX overhaul — landing, dashboard, operator surfaces, component system  
Design reference: ClawDash glassmorphic polish + OpenTrust warm brand identity

---

## North star

OpenTrust should feel like **the most trustworthy, inspectable, and cinematic memory layer product in AI agent infrastructure**.

Every surface should answer:
- what evidence exists?
- what can I inspect?
- what is the system's health?
- what should I trust — and why?

---

## Current state

### What exists
- 6 main app routes: Overview, Traces, Workflows, Artifacts, Memory, Investigations
- Detail pages for: traces, workflows, memory entries
- Promote flows for: traces → memory, investigations → memory, artifacts → memory, workflows → memory
- Landing page with cinematic hero, semantic code highlights, Molty branding, API showcase, plugin demo
- Sidebar with collapse, mobile bottom tabs, theme/demo toggles
- CardGrid with grid/row toggle
- PreviewCard hover popouts
- Code block with semantic highlight system
- BorderGlow glass surface component
- Demo mode with synthetic data
- Command palette
- Dark/light theme support

### What's working well
- evidence-first architecture
- strong runtime layer
- good data model depth
- cinematic landing page energy
- semantic highlight system

### What needs the revamp
- dashboard overview is functional but not premium
- trace/workflow/artifact/memory pages are lists, not operator-grade surfaces
- no interactive demos on the landing page
- no bento grid layouts
- component system is CSS-only (no shadcn/ui primitives)
- motion system is landing-only, not app-wide
- surfaces lack the ClawDash-level glass/depth/elevation treatment
- empty/loading/error states are minimal
- no run buttons or interactive API demos on the landing page

---

## Revamp phases

### Phase 1 — Component foundation
**Goal:** Introduce shadcn/ui as the component primitive layer and establish a worldclass design token system.

#### Deliverables
- [ ] Install and configure shadcn/ui (Tailwind CSS v4 compatible)
- [ ] Create base primitives: Button, Badge, Card, Dialog, Tooltip, Tabs, Select, Input, Textarea, Separator, ScrollArea
- [ ] Migrate existing `.btn`, `.pill`, `.panel`, `.artifact-card` to shadcn/ui-backed components
- [ ] Establish glassmorphic card variant with ClawDash-style depth/glow
- [ ] Create `<GlassCard>` component: border-glow + glass surface + hover elevation
- [ ] Create `<MetricCard>` component: big number + label + optional trend indicator
- [ ] Create `<StatusBadge>` component: dot + label + semantic color
- [ ] Add Framer Motion / `motion` library integration for app-wide transitions

#### Non-goals
- Do not redesign page layouts yet — just swap primitives

---

### Phase 2 — Bento grid system
**Goal:** Introduce worldclass bento grid layouts for dashboard and detail pages.

#### Deliverables
- [ ] Create `<BentoGrid>` component with configurable column spans and gap rhythm
- [ ] Create `<BentoCard>` variant: glass surface, optional header/footer, hover glow, content slot
- [ ] Redesign **Overview** page as a bento grid:
  - Large hero card: system health summary with status dot + trust signal
  - Medium cards: recent traces, recent workflows, recent memory
  - Small cards: session count, artifact count, chunk count, ingestion freshness
  - Attention card: stale pipelines / failed ingestion / review debt
- [ ] Redesign **Traces** page with bento session grouping
- [ ] Redesign **Memory** page with bento cards per retention class
- [ ] Redesign **Artifacts** page with bento grouped by kind
- [ ] Ensure bento grid is responsive: 1-col mobile, 2-col tablet, 3-4 col desktop

#### Visual standard
- Cards should feel like glass instrument panels
- Hover lifts with subtle glow and shadow
- Borders are restrained (1px, low opacity)
- Inner content uses consistent type hierarchy
- Each card has a clear "what this answers" purpose

---

### Phase 3 — Interactive landing demos
**Goal:** Make the landing page interactive — visitors can click buttons and see real system behavior.

#### Deliverables
- [ ] Add **Run** buttons to the Memory API code demos
  - Click → simulated response appears below the code block
  - Response uses the same semantic highlight + glass card treatment
- [ ] Add interactive trace explorer mini-demo
  - Clickable trace card → expands inline to show tool calls, artifacts, lineage
- [ ] Add interactive workflow step demo
  - Visual step timeline with click-to-inspect behavior
- [ ] Add interactive memory promote demo
  - Click promote → shows draft → shows review queue animation
- [ ] Add interactive health check demo
  - Click → health signals animate in with status dots and freshness indicators
- [ ] Wrap all demos in `<DemoSection>` component with:
  - glass surface
  - "Try it" CTA
  - simulated response area
  - reset button

#### Design standard
- Demos should feel like real product previews, not toy widgets
- Use the same component system as the actual app
- Responses should appear with motion (rise + fade)
- Keep demo data realistic and evidence-flavored

---

### Phase 4 — Operator surface polish
**Goal:** Make every app page feel worldclass.

#### Deliverables
- [ ] **Overview**: bento grid with glass metric cards, attention signals, and quick-action buttons
- [ ] **Trace detail**: richer tool-call timeline with expandable evidence cards, lineage visualization, promote action
- [ ] **Workflow detail**: step timeline with status indicators, artifact references, duration metrics
- [ ] **Memory detail**: posture card, body display, provenance graph, review controls with shadcn/ui form primitives
- [ ] **Memory review**: structured review cards with approve/reject/defer actions and inline notes
- [ ] **Investigations**: runnable SQL with inline results table, investigation promote flow
- [ ] **Artifacts**: grouped bento view with kind badges, provenance links, and promote action
- [ ] **Memory health**: dedicated health dashboard with ingestion freshness indicators, pipeline status, coverage metrics

#### Per-page standard
- Every page should have:
  - clear page header with breadcrumbs
  - glass-surfaced content cards
  - semantic status badges
  - empty/loading/error states that feel intentional
  - at least one actionable CTA
  - hover preview cards where useful

---

### Phase 5 — Motion and micro-interaction system
**Goal:** Make the app feel alive and responsive without being distracting.

#### Deliverables
- [ ] Page-level entrance animations (staggered card rise)
- [ ] Card hover elevation + glow transitions
- [ ] Sidebar collapse/expand animation
- [ ] Command palette open/close spring animation
- [ ] Toast/notification entrance + exit
- [ ] Filter chip selection feedback
- [ ] Promote action success animation
- [ ] Review action confirmation animation
- [ ] Loading skeleton with subtle shimmer
- [ ] Empty state illustration + gentle motion

#### Motion rules
- All animations < 300ms unless choreographed reveal
- Use `cubic-bezier(0.22, 1, 0.36, 1)` as the default easing
- Respect `prefers-reduced-motion`
- Motion should communicate state change, not decoration

---

### Phase 6 — Landing page interactive showcase
**Goal:** The landing page becomes the best demo of the product.

#### Deliverables
- [ ] Each API card becomes a live demo with Run button
- [ ] Trace/workflow/artifact/memory sections link to interactive previews
- [ ] Add a "Try the dashboard" CTA that opens demo mode directly
- [ ] Add social proof section if relevant (OpenClaw community, GitHub activity)
- [ ] Add a "How it works" animated flow diagram
- [ ] Mobile-optimize all interactive demos

---

## Component inventory (new)

| Component | Source | Purpose |
|-----------|--------|---------|
| `Button` | shadcn/ui | All CTAs, actions, form controls |
| `Badge` | shadcn/ui | Status, kind, retention labels |
| `Card` | shadcn/ui + custom | Glass surface cards |
| `Dialog` | shadcn/ui | Modals, confirm actions |
| `Tooltip` | shadcn/ui | Hover context |
| `Tabs` | shadcn/ui | Page sections, view toggles |
| `Select` | shadcn/ui | Filters, retention class |
| `Input` / `Textarea` | shadcn/ui | Review notes, search |
| `ScrollArea` | shadcn/ui | Long lists, code blocks |
| `Separator` | shadcn/ui | Section dividers |
| `GlassCard` | custom | Glassmorphic bento card |
| `BentoGrid` | custom | Responsive grid layout |
| `BentoCard` | custom | Grid-aware glass card |
| `MetricCard` | custom | Big number + label |
| `StatusBadge` | custom | Dot + label + color |
| `DemoSection` | custom | Interactive landing demo wrapper |
| `PreviewCard` | existing | Hover popout preview |
| `BorderGlow` | existing | Glass surface glow effect |
| `CodeBlock` | existing | Semantic highlight code display |

---

## Design tokens (target)

Keep the existing OpenTrust warm palette:
- `--accent: #E53935` (OpenTrust red-orange)
- `--bg: #000000` / `--surface: #0B0B0F`
- `--text: #FFFFFF` / `--text-secondary: #a0a0a0`
- Glass surfaces: `rgba(255,255,255,0.04)` to `rgba(255,255,255,0.06)` with blur
- Border: `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.12)` on hover
- Elevation: `box-shadow` with depth layers, not flat borders
- Corner radius: `8px` base, `12-16px` for cards, `20-24px` for hero surfaces

---

## Technical approach

### shadcn/ui integration
- Use the `next` CLI installer: `npx shadcn@latest init`
- Configure for Tailwind CSS v4
- Use `cn()` utility from shadcn/ui for class merging
- Keep existing CSS custom properties as the design token layer
- shadcn components get OpenTrust-specific variants via Tailwind classes

### Bento grid
- CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(X, 1fr))`
- Named grid areas for hero layouts
- `col-span-2` / `row-span-2` for feature cards
- Responsive breakpoints at 640px, 900px, 1200px

### Motion
- Use `motion` (already installed) for component-level animations
- Use CSS `@keyframes` for ambient effects (glow, pulse, shimmer)
- Use `AnimatePresence` for mount/unmount transitions

---

## Execution order

1. **Phase 1** — Component foundation (shadcn/ui + glass primitives)
2. **Phase 2** — Bento grid system
3. **Phase 3** — Interactive landing demos
4. **Phase 4** — Operator surface polish
5. **Phase 5** — Motion and micro-interaction system
6. **Phase 6** — Landing page interactive showcase

Phases 1–2 unlock everything else.
Phase 3 and 4 can run in parallel once primitives exist.
Phase 5 layers on top.
Phase 6 is the capstone.

---

## Decision rule

If a proposed UI change does not clearly improve one of:
- evidence inspectability
- operator trust
- visual hierarchy
- interaction clarity
- premium feel

…it should wait.

---

## Success criteria

The revamp is complete when:
- every app page uses glass-surfaced bento cards
- the landing page has interactive demos with run buttons
- component primitives come from shadcn/ui
- motion feels alive but not distracting
- the product looks and feels like it belongs next to ClawDash
- a visitor can understand what OpenTrust does within 8 seconds of landing
- an operator can answer "what needs attention?" within 3 seconds of opening the dashboard
