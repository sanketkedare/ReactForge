# ADR-002 — State Management Discipline & Anti-Monolith Strategy

## Status
Accepted

## Context
In complex React applications, developers often default to placing all application state in a single global store (e.g. monolithic Redux or heavy React Context), causing severe re-render cascades across unaffected components.

## Decision
Enforce a 5-Tier State Hierarchy:
1. **Local UI State (`useState`, `useReducer`)**: Modals, dropdown toggles, input values, and temporary UI selections.
2. **Derived State (Pure computation / `useMemo`)**: Filtered task lists, sorted arrays, and calculated totals (never duplicated in state).
3. **URL State (`useSearchParams`, Next.js router)**: Search queries, category filters, difficulty toggles, and page numbers for shareable, deep-linkable URLs.
4. **Server State (TanStack Query / SWR / IndexedDB)**: Remote API data, async caching, optimistic updates, and background refetching.
5. **Cross-Cutting Global State (Zustand / Sliced Context)**: User authentication session, theme settings, and active user achievements.

## Alternatives Considered
- *Single God Context / Monolithic Store*: Rejected due to full-tree invalidation on minor state changes.

## Trade-offs & Consequences
- **Gain**: Predictable data flow, minimal re-renders, instant shareability via URLs.
- **Cost**: Requires developers to categorize state deliberately rather than throwing everything into context.
