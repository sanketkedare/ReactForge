# Phase 6: Architecture Showcase & Production Incident Simulator

## 🎯 Goal
Create the interactive **Production Incident Simulator** (`/incidents`) with 8 real-world production incident postmortems, the interactive **Architecture Decision Records (ADR) Explorer**, and the in-depth **"Why This Architecture?"** engineering comparison breakdowns on advanced tasks.

---

## 📋 Detailed Scope & Tasks

### 1. Production Incident Simulator (`/incidents`)
Build an interactive educational incident sandbox featuring 8 realistic production postmortems with live simulation toggles, symptoms, root cause analysis, fix implementation, and regression prevention:

| Incident ID | Incident Name | Root Cause & Failure Scenario | Fix & Prevention Strategy |
| :--- | :--- | :--- | :--- |
| **INC-001** | Search Race Condition | Fast subsequent query returns before slow first query, overwriting newer state | AbortController cancellation + request version tagging |
| **INC-002** | Timer / Subscription Memory Leak | `setInterval` / event listener created without cleanup in `useEffect` | Strict `useEffect` cleanup return function |
| **INC-003** | Unnecessary Render Cascade | Unstable object references in context provider triggering full-tree invalidation | Primitive slicing & selector-based subscriptions |
| **INC-004** | Large DOM List Jank | 5,000 un-virtualized DOM items freezing the main thread during scrolling | Viewport windowing via `@tanstack/react-virtual` |
| **INC-005** | Modal Focus Trap Leak | Focus shifts outside modal on Tab or focus is lost when modal unmounts | Focus trapping + previous focus element restoration |
| **INC-006** | Stale Cache Overwrite | Stale cached response overwriting user's optimistic update | Optimistic rollback engine & cache invalidation keys |
| **INC-007** | Layout Shift (CLS Spike) | Images/video loading without aspect-ratio or explicit dimensions | CSS `aspect-ratio` and dimension placeholders |
| **INC-008** | Unhandled 500 Network Crash | Async throw inside click handler crashes entire React fiber tree | Contextual feature error boundaries & safe error state |

### 2. Interactive Architecture Decision Record (ADR) Explorer
- Visual ADR browser at `/architecture` or within the Studio:
  - ADR-001 through ADR-006 with searchable tags, status (Accepted, Superseded), trade-off callouts, and code references.
  - Interactive decision graph showing relationships between Next.js, state management, caching, and virtualization.

### 3. "Why This Architecture?" Sections on Advanced Tasks
- Expand task workbench with senior-level architectural breakdowns:
  - Problem statement & scale requirements.
  - Naive beginner approach vs Production architected approach.
  - Concrete trade-offs (CPU vs Memory vs Code Complexity).

---

## 🔍 Validation & Criteria for Completion
- [x] `/incidents` route provides interactive toggle to switch between "Broken / Buggy" and "Fixed / Hardened" implementations for all 8 incidents.
- [x] ADR Explorer is fully accessible and searchable with clear trade-off callouts.
- [x] Advanced task pages include comprehensive "Why This Architecture?" breakdowns.

**Status**: ✅ Completed
