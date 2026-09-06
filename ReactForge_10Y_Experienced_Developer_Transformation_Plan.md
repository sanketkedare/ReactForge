# ReactForge — Senior/10-Year Frontend Engineering Transformation Plan

## Mission

Transform **ReactForge** from a polished React task/curriculum showcase into a production-grade frontend engineering platform that communicates the judgment, architecture, reliability, performance discipline, accessibility standards, testing culture, and product thinking expected from a highly experienced frontend engineer.

The goal is **not** to add complexity for appearance.

The goal is to make the project demonstrate:

> “This developer knows how to make good engineering decisions under real-world constraints.”

The final product should feel like a platform designed and maintained by an experienced frontend architect—not merely a collection of React exercises.

---

# 1. Current Product Context

ReactForge currently provides:

- 100 frontend/React tasks
- Beginner / Intermediate / Advanced progression
- Search and task filtering
- Task metadata
- React/TypeScript exercises
- Hooks and browser API exercises
- Accessibility-oriented tasks
- Animation and interaction challenges
- Architecture-oriented challenges
- AI Interview Coach
- Curriculum/roadmap
- Case-study/portfolio positioning
- Next.js + React-based architecture
- Dark “Obsidian” visual identity

Do **not** destroy the existing product identity or replace working functionality unnecessarily.

This is an evolution, not a rewrite for the sake of rewriting.

---

# 2. Core Transformation

Current mental model:

```text
ReactForge
    ↓
Collection of React projects
```

Target mental model:

```text
ReactForge
    ↓
Frontend Engineering Laboratory
    ├── Curriculum
    ├── Machine Coding
    ├── Architecture
    ├── Performance
    ├── Accessibility
    ├── Reliability
    ├── Testing
    ├── Production Engineering
    ├── Engineering Decisions
    ├── Incident Simulations
    ├── AI Interview Coach
    └── Portfolio / Case Studies
```

Every advanced task should demonstrate not only:

> “Can I build this?”

but also:

> “Can I build this correctly, efficiently, accessibly, testably, and maintainably?”

---

# 3. Engineering Principles

Use these principles throughout the transformation.

## 3.1 Prefer simplicity

Do not introduce libraries or abstractions without a clear reason.

Every major dependency should answer:

- What problem does it solve?
- Why is it needed?
- What alternatives were considered?
- What trade-offs does it introduce?

Avoid technology-for-technology's-sake.

---

## 3.2 Make decisions visible

Important architectural decisions should be documented.

Create an Architecture Decision Record (ADR) system.

Example:

```text
docs/
  architecture/
    ADR-001-nextjs.md
    ADR-002-state-management.md
    ADR-003-data-fetching.md
    ADR-004-design-system.md
    ADR-005-testing-strategy.md
    ADR-006-performance.md
```

Each ADR should contain:

```text
# ADR-XXX — Decision Title

## Context

What problem existed?

## Decision

What was selected?

## Alternatives Considered

What other options were evaluated?

## Why

Why was the selected approach preferred?

## Trade-offs

What did we gain?
What did we give up?

## Consequences

How does this affect future development?
```

---

# 4. Create a Real Design System

ReactForge should have a coherent internal design system rather than individually styled pages.

Create reusable primitives.

## Core components

At minimum:

- Button
- IconButton
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Tooltip
- Card
- Dialog / Modal
- Drawer
- Dropdown
- Tabs
- Accordion
- Toast
- Alert
- Skeleton
- Spinner
- EmptyState
- ErrorState
- Pagination
- CommandMenu
- DataTable
- CodeBlock
- CopyButton
- Progress
- Breadcrumb
- Avatar
- Navigation
- Sidebar
- Header

---

# 5. Design Tokens

Centralize:

## Color

```text
background
surface
surface-elevated
border
text-primary
text-secondary
text-muted
accent
success
warning
error
info
```

## Spacing

Use a consistent scale.

Example:

```text
space-1
space-2
space-3
space-4
space-6
space-8
space-12
space-16
```

## Typography

Define:

```text
font-family
font-size
font-weight
line-height
letter-spacing
```

## Radius

```text
radius-sm
radius-md
radius-lg
radius-xl
```

## Motion

Define:

```text
duration-fast
duration-normal
duration-slow
ease-standard
ease-emphasized
```

Do not scatter arbitrary values throughout the application.

---

# 6. Component States

Every reusable interactive component should account for:

```text
default
hover
focus
active
disabled
loading
error
success
empty
selected
```

Keyboard interaction must be considered wherever applicable.

---

# 7. Accessibility as a First-Class Requirement

Accessibility should not be a single task.

It should be a platform-wide engineering standard.

Implement and verify:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Correct labels
- Correct ARIA usage
- Focus trapping where required
- Focus restoration
- Escape handling
- Screen-reader-friendly status messages
- Reduced-motion support
- Sufficient color contrast
- Accessible error messaging
- Accessible loading states
- Accessible tables
- Accessible dialogs
- Accessible menus
- Accessible forms

Use automated accessibility testing where practical.

A page should not be considered complete merely because it visually works.

---

# 8. Error Architecture

Create a real error-handling strategy.

Architecture:

```text
Application
│
├── Global Error Boundary
│
├── Route Error Boundary
│
├── Feature Error Boundary
│
└── API Error Layer
      ├── 400
      ├── 401
      ├── 403
      ├── 404
      ├── 409
      ├── 429
      ├── 500
      ├── timeout
      ├── network failure
      └── cancellation
```

Every major failure state should provide:

- Clear explanation
- Recovery action
- Retry where appropriate
- Safe fallback UI
- No raw stack traces in production

---

# 9. Loading States

Avoid blank screens during asynchronous operations.

Implement appropriate:

- Skeletons
- Inline loading
- Button loading
- Route loading
- Data loading
- Progressive loading

Do not use a global spinner when a local skeleton would provide a better experience.

---

# 10. Network and Async Reliability

Demonstrate production-grade handling of asynchronous operations.

Handle:

- Request cancellation
- Race conditions
- Duplicate requests
- Stale responses
- Timeouts
- Retries
- Backoff
- Request deduplication where appropriate
- Optimistic updates where appropriate
- Loading state ownership
- Error state ownership

Example incident:

```text
Search:
react
   ↓
react hooks
```

If the first request returns after the second request, it must not overwrite the newer result.

Use appropriate cancellation/request identity strategies.

Document the decision.

---

# 11. Data Fetching Architecture

Document how data fetching works.

For every major remote-data feature specify:

- Source
- Cache policy
- Loading strategy
- Error strategy
- Retry strategy
- Cancellation strategy
- Revalidation strategy
- Pagination strategy
- Empty state

Do not introduce a data-fetching library unless the complexity justifies it.

---

# 12. State Management Discipline

Separate:

### Local UI state

Examples:

- Modal open/close
- Input values
- Accordion expansion
- Temporary selection

### Derived state

Do not duplicate state that can be calculated.

### Server state

Remote API data should have an appropriate lifecycle.

### URL state

Search/filter/pagination that should be shareable should be represented in the URL where appropriate.

### Global application state

Only place genuinely cross-cutting state here.

Document why state belongs where it does.

---

# 13. URL-Driven Task Directory

Upgrade the task directory so the following are URL-addressable:

```text
/tasks?difficulty=advanced
/tasks?search=useRef
/tasks?category=performance
/tasks?page=3
```

Ideally support combinations:

```text
/tasks?
  difficulty=advanced
  &category=performance
  &search=virtual
  &page=2
```

Benefits:

- Shareable URLs
- Browser navigation
- Deep linking
- Better UX
- Better SEO/discoverability

---

# 14. Task Detail Pages

Every significant task should have a consistent engineering structure.

Recommended layout:

```text
Task Header
│
├── Problem
├── Requirements
├── Difficulty
├── Estimated Time
├── Skills
├── Hooks
├── Browser APIs
│
├── Live Demo
│
├── Implementation
│
├── Architecture
│
├── State Model
│
├── Edge Cases
│
├── Accessibility
│
├── Performance
│
├── Testing
│
├── Trade-offs
│
└── Engineering Notes
```

---

# 15. “Why This Architecture?” Section

This should become one of the defining features of ReactForge.

For serious tasks, show:

## Problem

What makes this feature non-trivial?

## Naive Approach

What would a beginner implementation do?

## Problems With Naive Approach

What breaks at scale?

## Production Approach

What did ReactForge implement?

## Why?

Explain the reasoning.

## Trade-offs

Explain what complexity was introduced.

This creates a strong senior-engineering signal.

---

# 16. Before / After Engineering Comparisons

For performance-sensitive tasks, show measurable results.

Example:

```text
Virtual Table

Naive
10,000 DOM rows
Slow initial rendering
Poor scrolling

Optimized
Viewport virtualization
Overscan buffer
Stable row rendering
```

Where possible include real measured metrics.

Never fabricate metrics.

---

# 17. Performance Engineering Lab

Create a dedicated category:

# Production Performance

Add challenges such as:

## 17.1 10,000-row table

Demonstrate:

- Virtualization
- Stable keys
- Memoization where justified
- Pagination comparison

## 17.2 Slow React tree

Demonstrate:

- Render profiling
- Identifying unnecessary renders
- Component boundary optimization

## 17.3 Bundle optimization

Show:

```text
Before
X MB

After
Y KB
```

Only use actual build measurements.

## 17.4 Image optimization

Demonstrate:

- Responsive images
- Lazy loading
- Modern formats
- Dimensions to prevent layout shifts

## 17.5 Network optimization

Demonstrate:

- Waterfall analysis
- Parallel requests
- Prefetching where useful
- Caching
- Request deduplication

---

# 18. Web Vitals

Measure real:

- LCP
- CLS
- INP
- FCP
- TTFB

Create a performance page only if measurements are real.

Example:

```text
ReactForge Performance

LCP     1.4s
INP     110ms
CLS     0.02
```

Do not hardcode invented values.

If production telemetry is unavailable, clearly label measurements as local/Lighthouse measurements.

---

# 19. Testing Strategy

Create a serious testing pyramid.

```text
             E2E
          /       \
      Integration
       /          \
    Component     Component
       \          /
          Unit
```

Use appropriate tools already present in the project where possible.

Recommended coverage:

## Unit

- Utilities
- Validators
- Reducers
- Pure functions
- Algorithms

## Component

- Button
- Modal
- OTP
- Accordion
- Forms
- Data table

## Integration

- Search
- Filtering
- Task completion
- API states
- Authentication-like flows if applicable

## E2E

Critical user journeys.

Examples:

```text
Open ReactForge
→ Browse curriculum
→ Filter advanced tasks
→ Open task
→ Interact with demo
→ Complete expected interaction
```

---

# 20. CI/CD

Create a production-quality pipeline.

Recommended sequence:

```text
Pull Request
     ↓
Install
     ↓
Lint
     ↓
Typecheck
     ↓
Unit Tests
     ↓
Component Tests
     ↓
E2E Tests
     ↓
Accessibility Checks
     ↓
Production Build
     ↓
Performance Checks
     ↓
Deploy
```

The exact tools may vary based on the current repository.

Do not add duplicate tooling if an existing setup already solves the problem.

---

# 21. TypeScript Strictness

Audit the codebase.

Target:

- Strict TypeScript
- No unnecessary `any`
- Typed API boundaries
- Typed component props
- Typed hooks
- Discriminated unions where useful
- Runtime validation at untrusted boundaries

Do not abuse advanced TypeScript purely to look sophisticated.

Readable types are preferable.

---

# 22. Security

Add a lightweight security audit.

Review:

- XSS risks
- dangerouslySetInnerHTML usage
- User-generated content
- URL handling
- API keys
- Environment variables
- Client-side secrets
- Dependency vulnerabilities
- iframe/sandbox behavior
- Code execution features
- AI prompt boundaries
- Rate limiting where relevant

IMPORTANT:

Never expose server-side secrets in the browser.

Never place API keys directly in client-side source.

---

# 23. AI Interview Coach Hardening

The AI feature should be treated as a production feature.

Implement:

- Loading state
- Error state
- Timeout handling
- Retry
- Empty state
- Conversation state
- Input validation
- Rate-limit handling
- Safe error messages
- Clear separation of client/server responsibilities
- Secret protection
- Prompt/version management where applicable

If streaming is used, handle:

- Partial responses
- Cancellation
- Connection failure
- Reconnection/retry where appropriate
- Cleanup

---

# 24. Production Incident Simulator

Create a new ReactForge section:

# Engineering Incidents

This is a major differentiator.

Each incident should contain:

```text
Incident
↓
Symptoms
↓
Impact
↓
Root Cause
↓
Investigation
↓
Fix
↓
Regression Test
↓
Lessons Learned
```

Recommended incidents:

### Incident 001
Search race condition.

### Incident 002
Timer memory leak.

### Incident 003
Unnecessary React re-renders.

### Incident 004
Large list performance regression.

### Incident 005
Modal focus regression.

### Incident 006
Stale API data overwriting newer state.

### Incident 007
Layout shift caused by late-loading media.

### Incident 008
Failed API request causing broken UI.

These can be simulated educational incidents if clearly labeled as such.

---

# 25. Engineering Dashboard

Create an internal/public-safe engineering dashboard.

Show only real data.

Potential metrics:

```text
Build Status
Tests
Coverage
Bundle Size
LCP
INP
CLS
Error Rate
Task Count
Component Count
```

If production telemetry isn't available, show repository/build metrics instead.

---

# 26. Source and Architecture Explorer

For selected advanced tasks, provide:

- View source
- View architecture
- View tests
- View performance notes
- View ADR

Example:

```text
Virtual Table

[Live Demo]
[Source]
[Architecture]
[Tests]
[Performance]
[ADR]
```

This allows recruiters/interviewers to inspect engineering depth quickly.

---

# 27. Create One “Flagship” Engineering Project

Do not create 50 more simple projects.

Create one genuinely complex flagship feature:

# ReactForge Playground

Concept:

```text
┌──────────────────────────────────────────────────┐
│ ReactForge Playground                            │
├───────────────────────┬──────────────────────────┤
│                       │                          │
│ Code Editor           │ Live Preview             │
│                       │                          │
│ JSX / TSX             │ Rendered Component       │
│ CSS                   │                          │
│                       │                          │
├───────────────────────┴──────────────────────────┤
│ Console | Tests | A11y | Performance | Network  │
└──────────────────────────────────────────────────┘
```

Potential capabilities:

- Code editing
- Live preview
- Compile/transpile pipeline
- Runtime isolation
- Error boundary
- Console output
- Test execution where safe
- Accessibility inspection
- Performance inspection

SECURITY IS CRITICAL.

Do not execute arbitrary user code in the main application context.

Use appropriate sandboxing/isolation architecture.

Document the threat model and trade-offs.

---

# 28. Advanced Architecture Curriculum

Expand advanced tasks around real production problems.

Examples:

## State

- Undo/Redo
- State machines
- Complex form state
- Derived state optimization

## Data

- Infinite scrolling
- Request deduplication
- Optimistic updates
- Pagination
- Cache invalidation
- Offline-first behavior

## Performance

- Virtualization
- Memoization analysis
- Code splitting
- Prefetching
- Web Workers

## UX

- Command palette
- Keyboard navigation
- Drag/drop
- Accessible dialogs
- Complex forms

## Architecture

- Feature-based modules
- Dependency boundaries
- Shared component architecture
- Error boundaries
- Plugin architecture

---

# 29. Responsive Engineering

Audit all major pages at:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Do not simply shrink desktop layouts.

Check:

- Navigation
- Sidebar
- Cards
- Tables
- Code blocks
- Modals
- Dialogs
- Task playground
- Filters
- Search
- Pagination
- AI coach
- Footer

Particular attention:

- horizontal overflow
- touch targets
- text wrapping
- sticky elements
- modal viewport behavior
- keyboard behavior
- reduced available width

---

# 30. Micro-interactions

Animations should communicate state rather than decorate the interface.

Use motion for:

- Page transitions
- Modal entrance/exit
- Accordion expansion
- Toast appearance
- Loading transitions
- Button feedback
- Task completion

Respect:

```text
prefers-reduced-motion
```

Avoid excessive animation.

---

# 31. Empty States

Every collection should have a thoughtful empty state.

Examples:

```text
No tasks found.

Try:
- removing a filter
- changing difficulty
- using a broader search term
```

The AI assistant should also have an empty state.

---

# 32. Edge Cases

Explicitly test:

- Empty search
- Very long search
- No results
- Duplicate input
- Rapid clicking
- Double submit
- Network offline
- Slow network
- API failure
- Browser back/forward
- Refresh on filtered URL
- Deep link to task
- Invalid task ID
- Mobile viewport
- Keyboard-only navigation
- Screen reader navigation
- Reduced motion
- Clipboard unavailable
- Local storage unavailable
- Large datasets

---

# 33. SEO and Metadata

For public curriculum/task pages:

Implement:

- Page title
- Description
- Canonical URL
- Open Graph metadata
- Twitter/X metadata if desired
- Structured data where appropriate
- Semantic headings
- Clean URLs
- Sitemap
- Robots configuration

Task pages should have meaningful metadata.

---

# 34. Documentation

Create:

```text
README.md
ARCHITECTURE.md
CONTRIBUTING.md
SECURITY.md
PERFORMANCE.md
ACCESSIBILITY.md
TESTING.md
DECISIONS.md
```

README should quickly explain:

- What ReactForge is
- Why it exists
- Architecture
- Tech stack
- How to run it
- Testing
- Deployment
- Design system
- Performance
- Accessibility

---

# 35. Portfolio Case Study

The case study should not read like marketing copy only.

It should contain:

## Problem

Why ReactForge was needed.

## Goals

What the project intended to solve.

## Constraints

Technical/product limitations.

## Architecture

High-level architecture diagram.

## Key Decisions

Links to ADRs.

## Challenges

The hardest engineering problems.

## Performance

Measured improvements.

## Accessibility

Testing and standards.

## Testing

Actual test strategy and results.

## Failures

Things that went wrong.

## Lessons

What changed after learning from those failures.

This is what separates a portfolio project from an engineering case study.

---

# 36. Architecture Diagram

Create a visual architecture diagram.

Suggested:

```text
                         ReactForge
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       UI Layer          Curriculum         AI Layer
          │                  │                  │
     Design System      Task Registry       AI API
          │                  │                  │
          └────────────── Application ──────────┘
                             │
                  ┌──────────┼──────────┐
                  │          │          │
               State      Data/API   Routing
                  │          │          │
                  └──────────┼──────────┘
                             │
                       Infrastructure
                             │
                 CI / Monitoring / Deploy
```

The actual diagram must reflect the implemented architecture.

Do not create a fictional architecture diagram.

---

# 37. Code Organization

Prefer a structure based on product/features rather than a giant generic folder.

Example:

```text
src/
  app/
  components/
    ui/
  features/
    tasks/
    curriculum/
    interview-coach/
    playground/
    performance/
    incidents/
  lib/
  hooks/
  services/
  types/
  config/
```

Adjust to the current Next.js architecture.

Do not move files merely to satisfy this example.

---

# 38. Avoid Overengineering

This transformation must NOT become:

```text
100 libraries
50 abstractions
20 providers
15 state managers
10 API clients
```

Experienced engineering is often about deleting unnecessary complexity.

Before adding anything ask:

1. Is there a real problem?
2. Can the existing architecture solve it?
3. Does the abstraction improve maintainability?
4. Does it reduce duplication?
5. Does it improve reliability/performance?
6. Is the complexity justified?

---

# 39. Code Review Standard

Review every major feature for:

### Correctness

Does it work?

### Maintainability

Can another engineer understand it?

### Performance

Does it scale reasonably?

### Accessibility

Can different users operate it?

### Reliability

What happens when things fail?

### Security

What happens with hostile/untrusted input?

### Testability

Can the behavior be tested?

### Architecture

Is the abstraction boundary appropriate?

### UX

Does it feel good to use?

---

# 40. Senior-Level PR Checklist

Before considering the transformation complete:

```text
[ ] Feature works
[ ] Types are correct
[ ] No unnecessary any
[ ] Loading state exists
[ ] Error state exists
[ ] Empty state exists
[ ] Keyboard behavior verified
[ ] Accessibility reviewed
[ ] Responsive behavior verified
[ ] Performance considered
[ ] Race conditions considered
[ ] Cleanup implemented
[ ] Tests added
[ ] E2E flow added where appropriate
[ ] Documentation added
[ ] ADR added for significant decisions
[ ] No secrets exposed
[ ] No unnecessary dependencies
[ ] Production build succeeds
```

---

# 41. Definition of Done

ReactForge should not be considered “10-year-engineer level” because it has many features.

It should reach the following standard:

## Product

- Clear purpose
- Strong information architecture
- Consistent UX
- Strong discoverability

## Engineering

- Modular architecture
- Clear boundaries
- Type safety
- Error handling
- Async reliability
- Testing
- CI/CD

## Quality

- Accessibility
- Responsive behavior
- Performance measurement
- Security review
- Observability where appropriate

## Documentation

- ADRs
- Architecture documentation
- Case studies
- Incident reports
- Trade-offs
- Performance notes

## Portfolio

A recruiter should be able to understand the project within 60 seconds.

An engineer should be able to spend 30 minutes exploring and discover increasingly deeper engineering decisions.

---

# 42. Priority Order

Do NOT implement everything randomly.

Execute in phases.

## Phase 1 — Foundation

1. Audit current repository
2. Remove obvious technical debt
3. Establish TypeScript standards
4. Establish design tokens
5. Establish reusable UI components
6. Establish error/loading/empty states
7. Establish architecture documentation

## Phase 2 — Reliability

8. Async error handling
9. Request cancellation
10. Race-condition protection
11. Error boundaries
12. Retry/timeout behavior
13. Edge-case handling

## Phase 3 — Testing

14. Unit tests
15. Component tests
16. Integration tests
17. E2E tests
18. Accessibility tests

## Phase 4 — CI/CD

19. Lint
20. Typecheck
21. Tests
22. Build
23. E2E
24. Accessibility
25. Deployment pipeline

## Phase 5 — Performance

26. Baseline performance
27. Identify bottlenecks
28. Optimize
29. Measure again
30. Document before/after

## Phase 6 — Architecture Showcase

31. ADR system
32. Architecture pages
33. Engineering decision UI
34. Source/test/performance tabs
35. Incident simulations

## Phase 7 — Flagship Feature

36. ReactForge Playground
37. Security model
38. Isolation/sandbox strategy
39. Performance instrumentation
40. Documentation

## Phase 8 — Portfolio Polish

41. Case study
42. Architecture diagram
43. Technical overview
44. Production metrics
45. Final UX audit

---

# 43. What NOT To Do

Do not:

- Rewrite the entire application without evidence
- Add libraries just to increase the tech stack
- Add fake metrics
- Claim fake production traffic
- Claim fake test coverage
- Claim fake incidents
- Claim fake performance improvements
- Add meaningless animations
- Add 100 more trivial projects
- Introduce Redux/etc. without need
- Hardcode “senior” language into the UI
- Create architecture diagrams that don't match reality
- Expose API keys
- Execute arbitrary code unsafely
- Sacrifice UX for technical complexity

The product must earn its senior-level impression through implementation.

---

# 44. Final Portfolio Positioning

The final ReactForge story should become:

> **ReactForge is a frontend engineering laboratory built around 100 progressively difficult machine-coding challenges. It demonstrates not only implementation ability, but production engineering practices including architecture, accessibility, performance optimization, testing, reliability, and engineering decision-making.**

The key transformation:

```text
BEFORE

“I built 100 React projects.”

AFTER

“I built a platform that explores how frontend systems
should be designed, implemented, tested, optimized,
debugged, and maintained in production.”
```

That second statement is the target.

---

# 45. Final Instruction to Antigravity

Act as a **Principal/Senior Frontend Architect and Staff-level Code Reviewer** while implementing this transformation.

Before changing architecture:

1. Inspect the existing repository.
2. Understand the current architecture.
3. Identify what is already good.
4. Identify actual weaknesses.
5. Avoid unnecessary rewrites.
6. Preserve working functionality.
7. Make incremental, reviewable changes.
8. Verify every major change.

For every significant architectural decision, document:

```text
Problem
Decision
Alternatives
Reasoning
Trade-offs
Consequences
```

For every significant performance optimization:

```text
Baseline
Problem
Change
Measured Result
Trade-off
```

For every reliability fix:

```text
Failure Scenario
Root Cause
Fix
Regression Test
```

For every major UI component:

```text
States
Keyboard Behavior
Accessibility
Responsive Behavior
Loading
Error
Empty
```

At the end, produce a final engineering report containing:

- Architecture changes
- Design-system changes
- Testing strategy
- CI/CD pipeline
- Accessibility improvements
- Performance measurements
- Security findings
- Reliability improvements
- Major trade-offs
- Remaining technical debt
- Recommended future work

## Most important principle

Do not try to make ReactForge **look** like a 10-year developer built it.

Make the engineering decisions good enough that an experienced engineer naturally concludes:

> “Whoever built this understands production frontend engineering.”

That is the actual objective.
