---
name: performance-and-refactoring
description: >-
  Use this skill when diagnosing performance issues, refactoring tightly coupled code,
  fixing unnecessary re-renders, splitting god components/contexts, optimizing bundle
  size, or improving the Studio Profiler Lab. Activates on requests to optimize
  AuthContext.tsx, move ProfilerContext to studio scope, fix the learningProjects.ts
  bundle impact, improve the AIInterviewDrawer, or apply virtualization patterns.
---

# ReactForge — Performance & Refactoring Guide

This skill documents the top performance bottlenecks and provides concrete refactoring
patterns specific to this codebase. All issues reference exact file paths and line numbers.

---

## Top Priority Performance Issues

| Priority | Issue | File | Impact |
|---|---|---|---|
| P0 | rAF loop running on all 100+ pages | `ProfilerContext.tsx:48–74` | ~0.2ms wasted per frame everywhere |
| P1 | 94kb `learningProjects.ts` in every client bundle | `DynamicTaskClient.tsx` (imports it) | Large JS parse cost on every task page |
| P2 | `AuthContext` causes cascading re-renders | `AuthContext.tsx` (427 lines, 6 concerns) | Every auth state change re-renders all consumers |
| P3 | AI responses not streamed | `api/gemini/route.ts:92` | 3–8s blocking wait with no feedback |
| P4 | `AIInterviewDrawer` is a 996-line god component | `AIInterviewDrawer.tsx` | Untestable, hard to profile, large initial parse |

---

## Fix P0 — Move ProfilerProvider to Studio Scope

**Current (wrong):** `ProfilerProvider` wraps every page globally in root layout.
**Impact:** `requestAnimationFrame` loop calculating FPS runs on landing page, login, all 100 task pages.

```tsx
// REMOVE from src/app/layout.tsx:
<ProfilerProvider>
  {children}
</ProfilerProvider>

// ADD to src/app/(studio)/layout.tsx:
import ProfilerProvider from "@/context/ProfilerContext";

export default function StudioLayout({ children }) {
  return (
    <div className="min-h-screen ...">
      <ProfilerProvider>   {/* ← only runs within studio routes */}
        <StudioNav />
        <main>{children}</main>
        <GlobalFooter />
      </ProfilerProvider>
    </div>
  );
}
```

**Verification:** After moving, navigate to `/` and confirm no `requestAnimationFrame` callbacks
from `ProfilerContext` appear in the browser DevTools Performance tab.

---

## Fix P1 — Keep LEARNING_PROJECTS Server-Only

**Current (problem):** `DynamicTaskClient.tsx` is a `"use client"` component that imports
from `learningProjects.ts`, shipping 94kb to the browser on every task page load.

**Solution:** Pass only the single matched task object as a prop from the RSC page.

```tsx
// src/app/(projects)/[slug]/page.tsx  (Server Component — already RSC)
import { LEARNING_PROJECTS, LearningProject } from "@/data/learningProjects";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

export default async function DynamicTaskPage({ params }) {
  const { slug } = await params;
  const project = LEARNING_PROJECTS.find(p => p.id === slug);
  if (!project) notFound();

  // Serialize and pass ONLY the matched task — not the full array
  return <DynamicTaskClient slug={slug} project={project} />;
}

// src/components/studio/DynamicTaskClient.tsx
// Remove the top-level import of LEARNING_PROJECTS
// Add project to props:
interface DynamicTaskClientProps {
  slug: string;
  project: LearningProject;  // ← received from server, not re-imported
}
```

**Verification:** Run `npm run build` and check the `.next/analyze/` output
(or use `ANALYZE=true npm run build` with `@next/bundle-analyzer`) to confirm
`learningProjects.ts` no longer appears in client-side chunks.

---

## Fix P2 — Split AuthContext God Context

`AuthContext.tsx` (427 lines) has 6 responsibilities causing all consumers to
re-render on any state change. Split into focused slices:

### Proposed Split Architecture

```
AuthProvider          (Firebase user, loading)
  └── AuthModalProvider    (isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal)
  └── UserProgressProvider (completedTasks, xp, streak, toggleTaskComplete)
  └── BookmarksProvider    (bookmarkedTasks, toggleTaskBookmark)
```

### Phase 1 — Extract Modal State (Lowest Risk)

```typescript
// src/context/AuthModalContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthModalContextType {
  isOpen: boolean;
  mode: "login" | "register" | "forgot";
  open: (mode?: "login" | "register" | "forgot") => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  isOpen: false, mode: "login", open: () => {}, close: () => {},
});

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  return (
    <AuthModalContext.Provider value={{
      isOpen, mode,
      open: (m = "login") => { setMode(m); setIsOpen(true); },
      close: () => setIsOpen(false),
    }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
```

Then remove the modal state from `AuthContext.tsx` and replace all `openAuthModal`/`closeAuthModal`
calls with `useAuthModal().open` / `useAuthModal().close`.

### Phase 2 — Move Progress to Zustand (Zero Re-Render Risk)

```typescript
// src/store/progressStore.ts
import { create } from "zustand";

interface ProgressStore {
  completedTasks: string[];
  bookmarkedTasks: string[];
  xp: number;
  streak: { current: number; longest: number; lastActiveDate: string | null };
  setProgress: (data: Partial<ProgressStore>) => void;
  toggleComplete: (slug: string) => void;
  toggleBookmark: (slug: string) => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  completedTasks: [],
  bookmarkedTasks: [],
  xp: 0,
  streak: { current: 0, longest: 0, lastActiveDate: null },
  setProgress: (data) => set(data),
  toggleComplete: (slug) => set(prev => ({
    completedTasks: prev.completedTasks.includes(slug)
      ? prev.completedTasks.filter(s => s !== slug)
      : [...prev.completedTasks, slug],
  })),
  toggleBookmark: (slug) => set(prev => ({
    bookmarkedTasks: prev.bookmarkedTasks.includes(slug)
      ? prev.bookmarkedTasks.filter(s => s !== slug)
      : [...prev.bookmarkedTasks, slug],
  })),
}));
```

---

## Fix P4 — Split AIInterviewDrawer (996 Lines)

Break the god component into focused sub-components:

```
AIInterviewDrawer.tsx (orchestrator, <200 lines)
  ├── AIDrawerTrigger.tsx     (floating button, open/close state)
  ├── AIMessageList.tsx       (message history, auto-scroll)
  ├── AIInputBar.tsx          (text input, send button, file attach)
  ├── AICodeReviewPanel.tsx   (code paste textarea + review button)
  └── AISettingsPanel.tsx     (custom API key input, quota display)
```

---

## Streak Fix — Calendar-Date Based Logic

In `src/app/api/user/progress/route.ts`, replace lines 41–60:

```typescript
// REMOVE current hour-window logic:
const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
if (diffHours >= 20 && diffHours <= 48) { streak.current++; }
else if (diffHours > 48) { streak.current = 1; }

// REPLACE with calendar-date logic:
const todayStr = now.toDateString();
const lastStr = lastActive ? new Date(lastActive).toDateString() : null;

if (lastStr === todayStr) {
  // Same day — streak already counted, do nothing
} else if (lastStr) {
  const diffDays = Math.round((now.getTime() - new Date(lastActive!).getTime()) / 86400000);
  if (diffDays === 1) {
    user.streak.current += 1;
    if (user.streak.current > user.streak.longest) user.streak.longest = user.streak.current;
  } else {
    user.streak.current = 1; // gap > 1 day — reset
  }
} else {
  // First ever task completion
  user.streak.current = 1;
  user.streak.longest = 1;
}
user.streak.lastActiveDate = now;
```

---

## Error Boundary Gaps — Add Route-Group Boundaries

**Missing:** No `error.tsx` in `(projects)/` or `(studio)/`.

Create `src/app/(studio)/error.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function StudioError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error("Studio Error:", error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 px-4">
      <div className="text-4xl">⚡</div>
      <h2 className="text-xl font-bold text-white">Studio Component Crashed</h2>
      <p className="text-sm text-slate-400 max-w-md">{error.message}</p>
      <div className="flex gap-3">
        <button onClick={reset} className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
          Retry Component
        </button>
        <Link href="/tasks" className="px-4 py-2 rounded-full border border-slate-700 text-slate-300 text-xs">
          Back to Curriculum
        </Link>
      </div>
    </div>
  );
}
```

Create identical `src/app/(projects)/error.tsx` with messaging appropriate to task pages.

---

## Dead Dependency Audit

Run to confirm which installed packages are actually imported:

```bash
# Check if redux is used anywhere
npx grep-cli "from 'react-redux'" src/ --recursive
npx grep-cli "from '@reduxjs/toolkit'" src/ --recursive

# Check if zustand is used
npx grep-cli "from 'zustand'" src/ --recursive
```

If zero results: remove from `package.json` and run `npm install`.

```bash
npm uninstall @reduxjs/toolkit react-redux zustand
# OR keep zustand since auth-context refactoring plan uses it (see above)
npm uninstall @reduxjs/toolkit react-redux
```

---

## Bundle Analysis Setup

Add to `package.json` and `next.config.ts` for on-demand bundle analysis:

```bash
npm install --save-dev @next/bundle-analyzer
```

```typescript
// next.config.ts
import bundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });
export default withBundleAnalyzer(nextConfig);
```

```bash
ANALYZE=true npm run build
```
