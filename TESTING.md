# ReactForge Testing Strategy & Test Pyramid

## 1. Testing Pyramid Structure
```text
               ▲
              / \
             /   \      E2E (Playwright) — Core User Flows
            /─────\
           /       \    Integration (RTL) — Search, Filtering, State
          /─────────\
         /           \  Component (RTL) — UI Primitives & Interactive Widgets
        /─────────────\
       /               \ Unit (Vitest) — Pure Utilities, Reducers & Custom Hooks
      └─────────────────┘
```

## 2. Running Test Suites
- **Unit & Component Tests**: `npm test`
- **TypeScript Verification**: `npx tsc --noEmit`
- **Lint Verification**: `npm run lint`

## 3. Test Coverage Standards
- Custom hooks (`useDebounce`, `useHistory`, `useLocalStorage`) require 100% path coverage.
- All core UI primitives in `src/components/ui/` must have associated component tests validating keyboard interactions and ARIA accessibility attributes.
