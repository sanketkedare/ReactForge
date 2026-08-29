---
name: task-builder
description: >-
  Use this skill when creating a new machine coding challenge task for the
  ReactForge curriculum. Activates when adding a task route, wiring a component
  to the task registry, creating a page under src/app/(projects)/, adding a task
  to LEARNING_PROJECTS in src/data/learningProjects.ts, or scaffolding a new
  component directory under src/components/. Covers the complete end-to-end
  pipeline from data registration to live workbench.
---

# ReactForge — Task Builder Guide

Every task in ReactForge flows through a strict 4-step pipeline. Follow all steps
in order — missing any step will break the task page, navigation, or AI coaching.

---

## Task Pipeline Overview

```
Step 1: Register in learningProjects.ts    → task appears in curriculum
Step 2: Create route page under (projects) → task gets its own URL + SEO
Step 3: Create component directory         → workbench has interactive demo
Step 4: Wire slug in project-code API      → code viewer shows source
```

---

## Step 1 — Register in `src/data/learningProjects.ts`

Add a new `LearningProject` object to the correct track section of the
`LEARNING_PROJECTS` array. This is the single source of truth for all task metadata.

```typescript
{
  id: "your-slug",                 // kebab-case, must match route folder name
  title: "Your Task Title",
  icon: "🎯",                       // single emoji
  description: "One sentence describing what this task builds.",
  level: "beginner",               // "beginner" | "intermediate" | "expert"
  levelLabel: "🟢 Beginner",       // 🟢 Beginner | 🟡 Intermediate | 🟣 Expert
  levelColor: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40",
  // intermediate: "border-amber-500/40 text-amber-400 bg-amber-950/40"
  // expert:       "border-purple-500/40 text-purple-400 bg-purple-950/40"
  category: "Forms & State",       // e.g., "CRUD & Storage", "Async & APIs", "Animation"
  path: "/your-slug",              // must start with "/"
  skills: ["useState", "useEffect", "Your Concept"],
  estimatedMinutes: 25,
  whatYouWillBuild: "A short description of the final artifact.",
  keyTakeaways: [
    "First learning outcome",
    "Second learning outcome",
    "Third learning outcome",
  ],
},
```

Track placement:
- `// =========== 🟢 TRACK 1: SDE-1 / JUNIOR (40 BEGINNER TASKS) ===========`  → beginner
- `// =========== 🟡 TRACK 2: SDE-2 / MID-LEVEL (35 TASKS) ===========`        → intermediate
- `// =========== 🟣 TRACK 3: SENIOR / SYSTEM DESIGN (25 TASKS) ===========`   → expert

---

## Step 2 — Create Route Page `src/app/(projects)/your-slug/page.tsx`

For tasks that use the **Dynamic Task Client** (most tasks), just create the directory
and an empty placeholder — `generateStaticParams()` in `[slug]/page.tsx` handles
all registered task slugs automatically via `LEARNING_PROJECTS.map(p => ({ slug: p.id }))`.

For tasks with **custom page-level logic** (rare), create a dedicated page:

```tsx
// src/app/(projects)/your-slug/page.tsx
import type { Metadata } from "next";
import YourComponent from "@/components/YourComponent/YourComponent";

export const metadata: Metadata = {
  title: "Your Task Title — SDE-1 React Machine Coding Challenge",
  description: "What this task teaches.",
};

export default function YourSlugPage() {
  return <YourComponent />;
}
```

> ⚠️ Only create an explicit page if the dynamic `[slug]/page.tsx` route cannot
> handle the task. The `DynamicTaskClient` handles 90%+ of tasks automatically.

---

## Step 3 — Create Component Directory `src/components/YourComponent/`

### Recommended File Structure

```
src/components/YourComponent/
├── YourComponent.tsx      # Main component — always "use client"
├── useYourComponent.ts    # Custom hook (all stateful logic extracted here)
└── types.ts               # TypeScript interfaces and type definitions
```

### Main Component Template

```tsx
// src/components/YourComponent/YourComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ProjectHeader } from "@/components/common/ProjectHeader";

export default function YourComponent() {
  // State lives in useYourComponent hook — don't put logic directly here
  const [value, setValue] = useState(0);

  return (
    <div className="w-[92%] lg:w-[80%] mx-auto py-8 space-y-6">
      <ProjectHeader
        title="Your Task Title"
        description="One sentence description."
        level="beginner"
        category="Forms & State"
        skills={["useState", "useEffect"]}
        estimatedMinutes={25}
      />

      {/* ── Interactive Workbench ── */}
      <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
        {/* Task UI goes here */}
      </div>
    </div>
  );
}
```

### Custom Hook Template

```typescript
// src/components/YourComponent/useYourComponent.ts
import { useState, useCallback, useEffect } from "react";

export function useYourComponent() {
  const [state, setState] = useState({ /* initial */ });

  const handleAction = useCallback(() => {
    setState(prev => ({ ...prev }));
  }, []);

  // Cleanup side effects
  useEffect(() => {
    return () => {
      // teardown
    };
  }, []);

  return { state, handleAction };
}
```

---

## Step 4 — Wire Slug in `src/app/api/project-code/route.ts`

Add your slug to `SLUG_TO_DIR_MAP` so the code viewer can serve the source:

```typescript
const SLUG_TO_DIR_MAP: Record<string, string> = {
  // ... existing entries ...
  "your-slug": "YourComponent",  // key = URL slug, value = directory name
};
```

> If your task uses the dynamic SSG page (Step 2 skipped), the API falls back to
> reading `src/app/(projects)/your-slug/page.tsx` automatically — no map entry needed.

---

## ProjectHeader Props Reference

`ProjectHeader` is required on all task pages. It renders the interview dossier.

```typescript
interface ProjectHeaderProps {
  title: string;               // Must match LearningProject.title exactly for auto-lookup
  description: string;
  level: "beginner" | "intermediate" | "expert";
  category: string;
  concepts?: string[];         // shown in dossier if skills is empty
  estimatedMinutes?: number;   // auto-fetched from learningProjects if omitted
  skills?: string[];           // auto-fetched if omitted
  whatYouWillBuild?: string;   // auto-fetched if omitted
  keyTakeaways?: string[];     // auto-fetched if omitted
}
```

> If `title` exactly matches a `LearningProject.title`, all optional fields are
> auto-populated from `learningProjects.ts` via reverse lookup in `ProjectHeader.tsx:47`.

---

## AI Interview Drawer — Wiring

The `AIInterviewDrawer` is rendered globally by `DynamicTaskClient` and is
already wired to the task context. For custom page implementations, add it manually:

```tsx
import { AIInterviewDrawer } from "@/components/ai/AIInterviewDrawer";

// Inside your page component (at root level, renders via Portal):
<AIInterviewDrawer
  taskTitle="Your Task Title"
  category="Forms & State"
  level="Beginner"
  concepts={["useState", "useEffect"]}
  codeSnippet={candidateCode}   // optional: pass user's current code for review
/>
```

---

## Design System Checklist for New Tasks

- [ ] Background: `bg-slate-900/60` or `bg-slate-950/80` — never `bg-white`
- [ ] Border: `border-slate-800/80` or `border-amber-500/30` for accent
- [ ] Primary accent: `amber-400` / `amber-500` (buttons, highlights, icons)
- [ ] Text: `text-slate-100` (primary), `text-slate-400` (muted), `text-amber-400` (accent)
- [ ] Rounded: `rounded-2xl` or `rounded-3xl` for cards — never `rounded`
- [ ] Width: `w-[92%] lg:w-[80%] mx-auto` for page container
- [ ] Glassmorphism: `backdrop-blur-sm` or `backdrop-blur-md` on dark card surfaces
- [ ] Animations: use `framer-motion` `motion.div` — avoid raw CSS transitions for interactive elements

---

## Naming Conventions

> ⚠️ Existing typos in component directory names must be maintained for backward compatibility.
> New components must use correct spelling.

| Type | Convention | Example |
|---|---|---|
| Task slug (`id`, `path`, route folder) | kebab-case | `star-rating` |
| Component directory | PascalCase | `StarRating` |
| Component file | `ComponentName.tsx` | `StarRating.tsx` |
| Custom hook file | `useComponentName.ts` | `useStarRating.ts` |
| Types file | `types.ts` | — |

Do NOT name component directories with underscores or mixed separators (e.g., avoid `Star_Rating` — existing ones are legacy).
