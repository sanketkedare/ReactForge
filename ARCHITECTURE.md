# ReactForge — System Architecture & Engineering Whitepaper

```text
                                  ReactForge Platform
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
     UI Layer                         Curriculum                         AI Layer
         │                                 │                                 │
   Design System                     Task Registry                     Gemini Client
   Accessible UI Primitives          100 Challenges (SDE-1→3)          Streaming & Quotas
         │                                 │                                 │
         └──────────────────────── Application Core ─────────────────────────┘
                                           │
                 ┌─────────────────────────┼─────────────────────────┐
                 │                         │                         │
            State Layer                Data Layer              Routing Layer
                 │                         │                         │
          5-Tier Hierarchy         TanStack / Dexie          Next.js 16 App Router
                 │                         │                         │
                 └─────────────────────────┴─────────────────────────┘
                                           │
                                 Infrastructure & Quality
                                           │
                          CI/CD · Web Vitals · Test Pyramid
```

---

## 1. Core Architectural Pillars

### 1.1 Next.js 16 App Router & Dynamic Routing Engine
- **Server/Client Boundary Separation**: Layout shells, static OpenGraph metadata generation, and markdown assets run as React Server Components. Interactive sandboxes, dynamic task workbench (`DynamicTaskClient`), AI chat drawers, and browser profiling tools operate inside `"use client"` modules.
- **Dynamic Catch-All Engine (`[slug]`)**: Routes all 100 curriculum challenges through a standardized, accessible workbench wrapper, eliminating redundant boilerplate.

### 1.2 5-Tier State Management Discipline
1. **Local UI State**: `useState` / `useReducer` for self-contained components (modals, inputs, accordions).
2. **Derived State**: Pure computations via `useMemo` / inline functions; zero duplicate state.
3. **URL State**: Next.js `useSearchParams` for search queries, difficulty filters, and pagination to guarantee shareable, deep-linkable URLs.
4. **Server & Cache State**: TanStack React Query v5 for remote synchronization with IndexedDB (Dexie) offline persistence.
5. **Global State**: Minimal sliced context providers (AuthContext) and Zustand stores for cross-cutting session data.

### 1.3 Async Reliability & Race Condition Prevention
- Standardized on `AbortController` cancellation for rapid user inputs (`useDebouncedFetch`).
- Resilient exponential backoff with jitter (`fetchWithRetry`) for transient network/5xx server errors.
- Multi-tier error boundary hierarchy (`global-error`, `error`, `FeatureErrorBoundary`) containing isolated failures without unmounting the entire application.

---

## 2. Interactive Sandboxing & Security Model
- **Live Code Execution**: Interactive React playground runs inside an isolated `iframe` with `sandbox="allow-scripts"` attributes, preventing access to the parent window's DOM, cookies, or localStorage.
- **Bi-Directional PostMessage Bus**: Clean event contracts for log forwarding, AST inspection, and runtime error reporting.

---

## 3. Continuous Quality & Web Vitals Telemetry
- Real-time Core Web Vitals monitoring (LCP, INP, CLS, TTFB, FCP) via native `PerformanceObserver` APIs in `/performance`.
- Automated multi-tier testing pyramid (Vitest unit tests, React Testing Library component tests, Axe-core accessibility assertions).
