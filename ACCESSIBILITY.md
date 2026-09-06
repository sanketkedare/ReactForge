# ReactForge Accessibility (A11y) Standards

## 1. Compliance Baseline
ReactForge targets strict **WCAG 2.1 Level AA** compliance across all UI primitives, challenge workbench layouts, and studio sandboxes.

## 2. Keyboard Navigation Requirements
- **Focus Rings**: All interactive controls provide a visible `focus-visible:ring-2 focus-visible:ring-amber-500` ring.
- **Modal Dialogs**: Traps focus with `Tab`/`Shift+Tab` cycles, dismisses on `Escape`, and restores focus to the triggering element upon close.
- **Tabs**: Supports standard keyboard arrow keys (`ArrowRight`, `ArrowLeft`) for active tab selection.
- **Menus & Dropdowns**: Navigable via arrow keys, Enter, and Escape.

## 3. ARIA & Screen Readers
- Dynamic loading and error states announce status via `role="status"` or `role="alert"`.
- Form controls maintain explicit `<label>` associations or `aria-label` / `aria-describedby` attributes.
- Reduced motion preferences (`prefers-reduced-motion: reduce`) disable transition animations globally.
