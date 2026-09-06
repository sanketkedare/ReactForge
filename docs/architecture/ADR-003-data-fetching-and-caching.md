# ADR-003 — Data Fetching, Async Cancellation & Cache Invalidation

## Status
Accepted

## Context
Async operations in search typeaheads, paginated lists, and AI streaming often suffer from race conditions (out-of-order response overwrites), memory leaks on unmounted views, and redundant duplicate network calls.

## Decision
1. Standardize on `AbortController` cancellation for all text-search inputs and route transitions.
2. Implement custom retry logic with exponential backoff and jitter for network/5xx failures.
3. Use TanStack React Query v5 for remote cache synchronization and offline data fallback with IndexedDB (Dexie).

## Trade-offs & Consequences
- **Gain**: Zero stale data overwriting newer state, resilient network degradation handling.
- **Cost**: Requires pass-through of `AbortSignal` to internal `fetch` handlers.
