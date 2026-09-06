# ADR-001 — Next.js 16 App Router & Server/Client Boundary Architecture

## Status
Accepted

## Context
ReactForge serves 100+ interactive challenges, complex system design sandboxes, and AI-assisted coaching. We needed an architecture that delivers fast initial page loads, optimal SEO for public challenges, zero-JS layout shells where appropriate, and clear encapsulation of heavy interactive client sandboxes.

## Decision
Adopt Next.js 16 (App Router) with strict separation:
- **Server Components**: Static metadata generation (`generateStaticParams`, `generateMetadata`), layout shells, and static markdown/curriculum data.
- **Client Components (`"use client"`)**: Interactive sandboxes, dynamic task workbench (`DynamicTaskClient`), AI chat drawers, and browser profiling tools.
- **Dynamic Catch-all Routes (`[slug]`)**: Centralized single-point rendering of curriculum tasks avoiding 100+ redundant route boilerplate files.

## Alternatives Considered
1. *Vite + React Single Page Application*: Fast client dev server, but lacks built-in OpenGraph metadata generation and SEO indexing for 100+ individual challenge pages.
2. *Next.js Pages Router*: Legacy architecture with monolithic `_app.tsx` and harder nested layout compositions.

## Trade-offs & Consequences
- **Gain**: Superior SEO, automatic static page generation for all 100 tasks, instant layout transitions.
- **Cost**: Need to explicitly maintain `"use client"` boundaries and avoid passing non-serializable props across boundaries.
