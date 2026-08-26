# ⚡ ReactForge
> **100 Hands-On React Machine Coding Challenges & Telemetry Laboratory**  
> **Author**: Sanket Kedare  
> **Framework**: Next.js 16.3.2 (App Router) • React 19 • TypeScript 5.6 (`strict: true`)  
> **Default Port**: `3002`

---

## 🌟 Executive Overview

**ReactForge** is a production-grade interactive developer workbench and machine coding interview preparation platform. It contains **100 curated hands-on coding challenges** spanning Junior (SDE-1), Mid-Level (SDE-2), and Senior / System Design tiers with live state engines, real-time telemetry, AI interview coaching, and dynamic source code inspection.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                       REACTFORGE                                       │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│     100 PRACTICE TRACKS       │     AI INTERVIEW COACH        │    DYNAMIC CODE LAB    │
│  • SDE-1 / Junior (40 Tasks)  │  • Progressive Hints          │  • Live File Tree      │
│  • SDE-2 / Mid-Level (35)     │  • Code Review & Grading      │  • Multi-File Tabs     │
│  • Senior / Arch (25 Tasks)   │  • 0-Token Interceptor        │  • Syntax Highlighting │
└───────────────────────────────┴───────────────────────────────┴────────────────────────┘
```

---

## 🛠️ Core Architectural Modules

### 1. **Real-Time Profiler Lab & Optimization Switch** (`/profiler-lab`)
- **600-Node Stress Test Matrix**: Benchmarks React commit durations and cascading re-renders.
- **Split Architecture Switch**: Toggle live between unmemoized anonymous closures and optimized `React.memo` + `useCallback` selector isolation.

### 2. **Event Pipeline & Concurrency Stream Oscilloscope** (`/event-pipeline`)
- **Multi-Lane Event Stream Bus**: Real-time canvas oscilloscope handling burst rates up to **200 pulses/sec**.
- **6 Execution Lanes**: Raw Unthrottled, Debounce (Trailing Edge), Debounce (Leading Edge), Throttle (250ms), RequestAnimationFrame (RAF 60Hz), and React 19 concurrent `useTransition`.

### 3. **100,000-Item Virtual Kanban & Optimistic Engine** (`/virtual-kanban`)
- **DOM Virtualization**: Powered by `@tanstack/react-virtual` maintaining only 15–20 active DOM nodes across 100k in-memory tasks at 60 FPS.
- **Offline Persistence**: IndexedDB integration via `Dexie.js`.
- **Chaos Network Toolbar**: Inject latency (0–2500ms) and network failure rates (0–100%) to test instant optimistic UI updates and automatic rollback.

### 4. **Recursive Infinite Comment Tree & Broadcast Sync** (`/threaded-comments`)
- **Recursive VDOM Tree**: Arbitrary nesting depth with subtree branch memoization.
- **Multi-Tab Real-Time Sync**: Synchronizes comments, upvotes, and typing indicators across open browser tabs in sub-millisecond local IPC time via `BroadcastChannel`.
- **Inline @ Mentions**: Autocomplete popup with keyboard selection.

### 5. **State Management Battleground** (`/state-battleground`)
- **4-Engine Quantitative Shootout**: Compares **React Context**, **Redux Toolkit**, **Zustand**, and **Signals** on an identical 150-node matrix.
- **Re-render Matrix**: Measures full-tree cascades (150x penalty) vs pinpoint selector subscriptions (1x update).

### 6. **TanStack Query v5 Cache & Chaos Inspector** (`/query-inspector`)
- **Live Cache Tree**: Visual inspection of Query Keys, `staleTime` and `gcTime` countdown bars, and observer counts.
- **Chaos Injection**: Simulate HTTP 500 crashes, HTTP 401 token expiry, exponential backoff retries, and offline caching.

---

## 📂 Architecture & Folder Layout

```
React-Tasks/
├── public/                       # Static public assets
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── (studio)/             # Studio modules (Profiler, Event, Kanban, Comments, State, Query)
│   │   ├── (projects)/           # Practice collection (13 Tasks)
│   │   ├── globals.css           # Tailwind directives & design tokens
│   │   ├── layout.tsx            # Server Root Layout + ProfilerProvider
│   │   └── page.tsx              # Studio Hub Homepage
│   ├── components/
│   │   ├── studio/               # Studio widgets & module suites
│   │   │   ├── ui/               # Glassmorphic primitives (Card, Badge, Button, Slider, Toggle)
│   │   │   ├── EventPipeline/    # Canvas oscilloscope & event stream
│   │   │   ├── ProfilerLab/      # 600-node matrix & memoization toggle
│   │   │   ├── QueryInspector/   # TanStack Query cache tree
│   │   │   ├── StateBattleground/# Context vs Zustand vs RTK shootout
│   │   │   ├── ThreadedComments/ # Recursive tree & BroadcastChannel
│   │   │   ├── VirtualKanban/    # 100k virtualizer & Dexie DB
│   │   │   ├── CommandPalette.tsx# ⌘K searchable quick switcher
│   │   │   ├── PerformanceHUD.tsx# Floating telemetry overlay
│   │   │   └── StudioNav.tsx     # Responsive navigation header
│   │   └── [Legacy Components]  # 13 typed subproject component folders
│   ├── context/                  # ProfilerContext (telemetry) & ThemeContext
│   ├── lib/                      # db.ts (Dexie), utils.ts (cn)
│   └── types/                    # studio.ts & index.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚡ Installation & Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sanketkedare/React-Tasks.git
   cd React-Tasks
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3002](http://localhost:3002)** in your browser.

4. **Verify TypeScript Strict Types**
   ```bash
   npx tsc --noEmit
   ```

5. **Build Production Bundle**
   ```bash
   npm run build
   npm start
   ```
