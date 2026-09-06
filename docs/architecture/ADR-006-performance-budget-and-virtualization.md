# ADR-006 — Performance Budgets, Live Web Vitals & Virtualization Thresholds

## Status
Accepted

## Context
Rendering large datasets (e.g. 10,000 table rows or event streams) severely degrades main-thread frame rates and bloats memory consumption.

## Decision
1. **Virtualization Standard**: Any list exceeding 100 dynamic items MUST utilize DOM windowing (`@tanstack/react-virtual`) with configurable overscan buffers (3–5 items).
2. **Web Vitals Monitoring**: Measure real-time client Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) using native `PerformanceObserver` APIs.
3. **Render Optimization**: Use component boundary splitting to prevent state updates in child controls from triggering re-renders in heavy parent trees.

## Trade-offs & Consequences
- **Gain**: Stable 60 FPS scrolling even with 100,000 data entries, minimal DOM node footprint.
- **Cost**: Virtualized lists require fixed or dynamic row height measurement wrappers.
