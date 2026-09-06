# ADR-005 — Multi-Tier Testing Pyramid & Automated A11y Verification

## Status
Accepted

## Context
A senior-level platform requires comprehensive regression testing across utilities, complex custom hooks, interactive UI components, user flows, and accessibility.

## Decision
Establish a structured testing pyramid:
1. **Unit Testing (Vitest)**: Testing pure utilities, data transformers, custom state machines (`useHistory`, `useLocalStorage`, `useDebounce`).
2. **Component Testing (React Testing Library)**: Testing user interaction events, focus management, and keyboard accessibility on all core UI primitives.
3. **Accessibility Audits (Axe-Core)**: Automated WCAG 2.1 AA rule verification on all component renders.
4. **End-to-End Testing (Playwright)**: Verifying critical user journeys (browsing curriculum, filtering tasks, running sandboxes).

## Trade-offs & Consequences
- **Gain**: Fast feedback loop in CI, zero regression on core algorithms, verified accessibility.
- **Cost**: Requires maintaining mock environments for browser-specific APIs (IndexedDB, ResizeObserver).
