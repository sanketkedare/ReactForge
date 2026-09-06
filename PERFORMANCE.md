# ReactForge Performance Budgets & Optimization Standards

## 1. Core Web Vitals Thresholds
All production routes in ReactForge target Google Web Vitals "Good" thresholds:
- **Largest Contentful Paint (LCP)**: $\le 2.5\text{s}$
- **Interaction to Next Paint (INP)**: $\le 200\text{ms}$
- **Cumulative Layout Shift (CLS)**: $\le 0.1$
- **Time to First Byte (TTFB)**: $\le 800\text{ms}$

## 2. Virtualization Thresholds
- Any dynamic list or table rendering $> 100$ items must implement DOM windowing via `@tanstack/react-virtual`.
- Overscan buffers are configured between 3 to 5 items to guarantee smooth 60 FPS scrolling while keeping DOM node count under 200 elements.

## 3. Render Cascade Prevention
- Complex object literals and event handlers passed to child components must be memoized with `useMemo` and `useCallback` where profiling demonstrates re-render overhead.
- Context providers are sliced into independent primitives to avoid invalidating unrelated tree branches.
