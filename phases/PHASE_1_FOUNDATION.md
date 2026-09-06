# Phase 1: Foundation & Core Design System

## 🎯 Goal
Establish a cohesive internal Design System, centralized design tokens, strict TypeScript standards, accessible UI primitives, standardized error/loading/empty states, and the initial Architecture Decision Record (ADR) framework.

---

## 📋 Detailed Scope & Tasks

### 1. Centralized Design Tokens
- Define CSS custom properties and Tailwind extensions for:
  - **Colors**: Obsidian palette (`#07090e`, `#0d111a`, `#151b28`), Amber/Gold accents (`#f59e0b`, `#fbbf24`), Semantic colors (success, error, warning, info).
  - **Spacing Scale**: 4px baseline (`space-1` through `space-16`).
  - **Typography**: Responsive scale with clean letter-spacing and line-heights.
  - **Borders & Radii**: Consistent rounded corners (`radius-sm`, `radius-md`, `radius-lg`, `radius-xl`).
  - **Motion Tokens**: Transition curves and durations with `prefers-reduced-motion` compliance.

### 2. Core Accessible UI Primitives (`src/components/ui/`)
Build self-contained, typed, WCAG-compliant primitives accounting for all interactive states (`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`):
- `Button` & `IconButton` (variants: primary, secondary, ghost, danger, outline; with spinner support)
- `Input` & `Textarea` (with error messages, helper text, accessible labels)
- `Select` & `Dropdown` (keyboard navigable: arrow keys, Enter, Escape)
- `Checkbox`, `RadioGroup`, `Switch` (with accessible touch targets)
- `Badge` (status tags, difficulty indicators)
- `Tooltip` (accessible popup with ARIA descriptions)
- `Card` (surface elevation, header/content/footer slots)
- `Modal` / `Dialog` (focus trap, backdrop click, Escape key, focus restoration)
- `Drawer` (slide-out panel with focus trap)
- `Tabs` (tablist / tab / tabpanel with left/right keyboard arrow navigation)
- `Accordion` (expand/collapse with ARIA `aria-expanded` and keyboard navigation)
- `Toast` (live region announcements, auto-dismiss, progress indicator)
- `Skeleton` & `Spinner` (progressive loading placeholders)
- `EmptyState` & `ErrorState` (contextual icons, descriptions, and retry action buttons)
- `DataTable` (accessible headers, pagination, sort indicators)
- `CodeBlock` & `CopyButton` (syntax highlighting with copy feedback)

### 3. TypeScript Standards & Global Type Definitions
- Audit and standardize `src/types/`:
  - `task.ts` (strict task metadata, difficulty, track, skills, requirements)
  - `api.ts` (typed standard API response envelope: `{ success: boolean, data?: T, error?: ApiError }`)
  - Eliminate `any` types across data definitions and components.

### 4. Architecture Decision Records (ADRs)
Create the baseline ADR repository under `docs/architecture/`:
- `ADR-001-nextjs-app-router.md`: Next.js 16 App Router & Server/Client boundaries.
- `ADR-002-state-management-discipline.md`: Local vs Derived vs URL vs Server vs Global state.
- `ADR-003-data-fetching-and-caching.md`: Fetch policy, TanStack Query vs SWR vs native React Server Components.
- `ADR-004-design-system-and-tokens.md`: Custom accessible primitives vs heavy third-party component libraries.
- `ADR-005-testing-strategy.md`: Vitest, React Testing Library, Axe-core, and Playwright pyramid.
- `ADR-006-performance-budget-and-virtualization.md`: Rendering thresholds, overscan, and memory boundaries.

---

## 🔍 Validation & Criteria for Completion
- [x] All UI primitives in `src/components/ui/` support full keyboard navigation and focus-visible rings.
- [x] Design tokens documented and centralized.
- [x] ADR-001 through ADR-006 written and reviewed.
- [x] Zero TypeScript errors with strict type checking.

**Status**: ✅ Completed
