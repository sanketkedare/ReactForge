# ADR-004 — Accessible Design System & Centralized Design Tokens

## Status
Accepted

## Context
Individual challenge pages and studio sandboxes had minor inconsistent button radiuses, arbitrary colors, and differing focus rings. We needed a cohesive, accessible design system standard across the entire platform.

## Decision
1. Centralize Obsidian Dark Mode design tokens (Background: `#07090e`, Elevated: `#0c1019`, Accent: `#f59e0b`).
2. Build custom WCAG 2.1 AA compliant primitives (`src/components/ui/`) featuring explicit focus-visible rings, keyboard trapping, ARIA roles, and screen-reader status announcements.
3. Enforce `prefers-reduced-motion` across all transition tokens.

## Trade-offs & Consequences
- **Gain**: Consistent high-polish UI, complete accessibility compliance, zero heavy external UI bundle bloat.
- **Cost**: Component primitives must be carefully tested for edge cases and keyboard traps.
