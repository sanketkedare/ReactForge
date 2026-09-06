# Phase 5: Performance Engineering Lab & Web Vitals Telemetry

## 🎯 Goal
Build a dedicated **Production Performance Engineering Lab** (`/performance`) showcasing real, un-fabricated measurements of Core Web Vitals (LCP, INP, CLS, FID), React render profiling, 10,000-row virtualization benchmarks, bundle analysis, and network waterfall optimizations.

---

## 📋 Detailed Scope & Tasks

### 1. Live Web Vitals Telemetry (`src/components/studio/WebVitalsHUD.tsx`)
- Capture actual browser PerformanceObserver metrics:
  - **LCP** (Largest Contentful Paint)
  - **INP** (Interaction to Next Paint)
  - **CLS** (Cumulative Layout Shift)
  - **TTFB** (Time to First Byte)
  - **FID / FCP** (First Input Delay / First Contentful Paint)
- Real-time rating badges: Good (🟢), Needs Improvement (🟡), Poor (🔴) based on standard Google Web Vitals thresholds.
- Zero hardcoded mock numbers: explicitly display "Live Client Telemetry".

### 2. 10,000-Row Virtualization Stress Test & Comparative Benchmark
- Side-by-side comparative sandbox:
  - **Naive DOM Approach**: Rendering 10,000 un-virtualized `<tr>` elements (measuring DOM node count, initial render time in ms, scroll frame drop).
  - **Virtualized Windowing (`@tanstack/react-virtual`)**: Rendering only visible rows + overscan buffer (~30 DOM nodes total).
  - Live FPS and Memory allocation comparison HUD.

### 3. React Tree Profiling & Render Optimization Lab
- Interactive visualizer demonstrating:
  - Unnecessary re-render cascades caused by unmemoized object literals/callbacks in parent components.
  - Fixes via component boundary splitting, `React.memo`, `useMemo`, `useCallback`, and context splitting.
  - Live render count flame graph and re-render counter badges.

### 4. Network Waterfall & Deduplication Sandbox
- Demonstrates:
  - Serial waterfall requests vs parallel `Promise.all` requests.
  - In-flight request deduplication and SWR stale-while-revalidate caching.
  - Simulated latency and bandwidth throttling controls.

---

## 🔍 Validation & Criteria for Completion
- [x] `/performance` route provides live Web Vitals telemetry from the actual browser session.
- [x] 10k-row virtualization test visually demonstrates memory and DOM node reductions.
- [x] Profiler visualizer clearly explains the exact mechanism behind re-render cascades and fixes.

**Status**: ✅ Completed
