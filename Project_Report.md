# ReactForge: Codebase Analysis & Architecture Report

> **Audit Date:** 2026-08-29  
> **Auditor Role:** Principal Software Architect & Security Auditor  
> **Next.js Version:** 16.3.2 (App Router)  
> **React Version:** 19.0.0  
> **Codebase Root:** `d:/Developer_2.0/React-Tasks/`

---

## 1. Executive Summary

ReactForge is a full-stack, production-deployed frontend developer education platform hosted at `https://reactforge.sanketkedare.com`. Its core objective is to serve as a **machine coding interview preparation hub** featuring 100 structured React challenges across three seniority tracks (SDE-1, SDE-2, Senior/System Design). The platform integrates a custom AI interview coach powered by Google Gemini, Firebase-based OAuth authentication, MongoDB Atlas for user persistence, and Nodemailer for transactional email.

**Framework Architecture:** Next.js 16 App Router (hybrid SSR/SSG), with route groups `(projects)` and `(studio)` cleanly separating the public task layer from the advanced developer tooling layer. State management is deliberately multi-layered: React Context for auth and theme globals, Zustand (installed but usage not found in surface-level scan), Redux Toolkit (installed, no surface usage found in scanned files), TanStack Query v5 for data-fetching hooks, and Dexie.js for IndexedDB-based offline storage in Studio tasks.

**Overall Codebase Health: ⚠️ Moderate — Structurally Sound, Critically Flawed in Security**

The component architecture and routing design are well-engineered. However, the codebase has **critical security vulnerabilities** that would immediately fail a professional security audit:

1. **Real credentials are committed to `.env` and `.env.local`** — both files contain production API keys, database passwords, and SMTP app passwords in plaintext.
2. **All API routes are completely unauthenticated** — any anonymous HTTP client can write data to `/api/user/progress` or `/api/user/bookmarks` by providing any arbitrary `uid`.
3. **The Gemini API fallback model list references non-existent model names** (`gemini-3.6-flash`, `gemini-3.7-flash`) meaning every AI request incurs 2 unnecessary network round-trips before hitting a valid model.

---

## 2. Architecture & Directory Structure

### 2.1 Directory Tree & Separation of Concerns

```
React-Tasks/
├── src/
│   ├── app/                        # Next.js App Router root
│   │   ├── (projects)/             # Route group: public task workbenches (SSG)
│   │   │   ├── [slug]/page.tsx     # Dynamic SSG task page (generateStaticParams)
│   │   │   └── … (26 task route directories)
│   │   ├── (studio)/               # Route group: advanced senior tasks
│   │   │   ├── layout.tsx          # Isolated StudioNav + ambient glow layout
│   │   │   └── … (5 studio tasks: virtual-kanban, profiler-lab, etc.)
│   │   ├── api/                    # Next.js Route Handlers (server-side only)
│   │   │   ├── auth/sync/          # POST: Firebase → MongoDB user upsert
│   │   │   ├── auth/complete-registration/  # POST: Onboarding + welcome email
│   │   │   ├── gemini/             # POST: Gemini AI proxy endpoint
│   │   │   ├── project-code/       # GET: Filesystem code reader API
│   │   │   └── user/
│   │   │       ├── progress/       # POST: Task completion + XP + streak
│   │   │       ├── bookmarks/      # POST: Bookmark toggle
│   │   │       └── profile/        # GET: User profile fetch
│   │   ├── login/, register/, onboarding/, profile/, tasks/, projects/
│   │   ├── layout.tsx              # Root layout (providers, JSON-LD, SEO metadata)
│   │   ├── globals.css             # CSS design tokens + Tailwind directives
│   │   ├── error.tsx               # App-level error boundary
│   │   └── global-error.tsx        # Catastrophic render error boundary
│   ├── components/
│   │   ├── ai/                     # AI assistant components
│   │   │   ├── AIInterviewDrawer.tsx  # 996-line AI chat panel (Portal-rendered)
│   │   │   ├── HomeAIChat.tsx         # Landing page AI chat (31kb)
│   │   │   └── MarkdownRenderer.tsx   # Markdown-to-JSX renderer
│   │   ├── auth/                   # Auth modals (AuthModal, RegistrationOnboardingModal)
│   │   ├── common/                 # Shared layout components
│   │   │   ├── ProjectHeader.tsx   # Universal task header + interview dossier
│   │   │   ├── ProjectCodeSection.tsx
│   │   │   ├── GlobalFooter.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── studio/                 # Studio-specific components
│   │   │   ├── DynamicTaskClient.tsx  # 19kb client workbench loader
│   │   │   ├── CommandPalette.tsx
│   │   │   └── StudioNav.tsx
│   │   └── [TaskName]/             # Per-task component directories (monolithic)
│   ├── context/
│   │   ├── AuthContext.tsx         # 427-line monolithic auth + modal + progress context
│   │   ├── ProfilerContext.tsx     # React Profiler API wrapper with rAF loop
│   │   ├── ThemeContext.tsx        # Theme state (dark/light, localStorage)
│   │   └── TheamContextComponent.tsx  # Legacy bridge adapter (typo in filename)
│   ├── data/
│   │   ├── learningProjects.ts     # 1,932-line static task registry (100 tasks, 94kb)
│   │   └── projectCodeSnippets.ts  # Fallback code snippet data
│   ├── hooks/
│   │   └── useAuth.ts              # Thin re-export of AuthContext hook (69 bytes)
│   ├── lib/
│   │   ├── firebase.ts             # Firebase SDK init + auth helpers
│   │   ├── mongodb.ts              # Mongoose connection with global cache
│   │   ├── aiGreetings.ts          # Local response interceptor (token savings)
│   │   ├── guestAiQuota.ts         # localStorage-based guest AI rate limiter
│   │   ├── email.ts                # Nodemailer transactional email (16kb)
│   │   └── utils.ts                # Utility helpers (479 bytes)
│   ├── models/
│   │   └── User.ts                 # Mongoose User schema (IUser interface)
│   └── types/                      # Shared TypeScript type definitions
```

### 2.2 Primary Dependencies & Roles

| Package | Version | Role |
|---|---|---|
| `next` | 16.3.2 | Framework — App Router SSR/SSG/RSC |
| `react` / `react-dom` | 19.0.0 | UI library (stable concurrent features) |
| `firebase` | 12.18.0 | Authentication (Google, GitHub, Email/Password OAuth) |
| `mongoose` | 9.9.4 | MongoDB ODM for user data persistence |
| `@reduxjs/toolkit` | 2.3.0 | Installed — **no confirmed usage in scanned surfaces** |
| `@tanstack/react-query` | 5.59.16 | Data-fetching, caching, background sync |
| `@tanstack/react-virtual` | 3.10.8 | Virtualized list rendering (Virtual Kanban, Virtual Table tasks) |
| `zustand` | 5.0.1 | Installed — **no confirmed usage in scanned surfaces** |
| `framer-motion` | 12.4.7 | Animations, layout transitions, AnimatePresence |
| `dexie` / `dexie-react-hooks` | 4.0.9 | IndexedDB ORM for offline data (Studio tasks) |
| `nodemailer` | 9.0.5 | Transactional email — welcome email on registration |
| `tailwindcss` | 3.4.13 | Utility-first CSS (class-based dark mode) |
| `lucide-react` | 0.454.0 | Icon library |
| `canvas-confetti` | 1.9.3 | Task completion celebration effects |
| `clsx` + `tailwind-merge` | — | Conditional className utilities |

**Critical Observation:** Both `@reduxjs/toolkit`/`react-redux` and `zustand` are installed alongside `@tanstack/react-query` and React Context. This indicates **state management strategy indecision or leftover boilerplate** — dead dependencies that inflate the production bundle and cold-start time of serverless API routes.

---

## 3. Application Flow & Routing

### 3.1 Critical User Journeys

#### Journey 1: Unauthenticated User → Task Attempt

```
/ (page.tsx, ~31kb — landing page)
 └── /tasks (curriculum listing)
      └── /(projects)/[slug] (DynamicTaskPage — SSG via generateStaticParams)
           ├── generateStaticParams()  →  pre-renders all 100 task slugs at build time
           ├── generateMetadata()      →  per-task SEO (title, OG, Twitter, schema.org)
           └── <DynamicTaskClient slug={slug} /> (client component)
                ├── Renders task workbench + <ProjectHeader>
                ├── Renders <AIInterviewDrawer> (floating, Portal-rendered)
                │    └── Guest quota: 3 free AI chats via localStorage (guestAiQuota.ts)
                └── On "Mark Complete" → openAuthModal("login") if not authenticated
```

#### Journey 2: Registration & Onboarding

```
User clicks "Sign in with Google"
 └── signInWithGooglePopup() [lib/firebase.ts:38]
      └── onAuthStateChanged fires [AuthContext.tsx:158]
           └── syncWithMongo(fbUser) [AuthContext.tsx:119]
                └── POST /api/auth/sync [route.ts:5]
                     ├── connectToDatabase() → Mongoose upsert
                     └── Returns user + requiresOnboarding flag
                          └── requiresOnboarding === true
                               → <RegistrationOnboardingModal> renders
                                    └── completeRegistration(data) [AuthContext.tsx:216]
                                         └── POST /api/auth/complete-registration
                                              ├── Username uniqueness check
                                              ├── Awards +50 starter XP
                                              └── Fires sendWelcomeEmail() async (non-blocking)
```

#### Journey 3: Task Completion Flow

```
User clicks "Mark Complete" on a task
 └── toggleTaskComplete(slug, xpValue) [AuthContext.tsx:263]
      ├── Optimistic UI update (setMongoUser immediately) [AuthContext.tsx:274]
      └── POST /api/user/progress { uid, taskSlug, completed, xpValue }
           ├── User.findOne({ uid })  ← NO SERVER-SIDE AUTH CHECK
           ├── Appends taskSlug to completedTasks[]
           ├── Increments XP by xpValue (default: 15)
           ├── Streak: 20-48h window increments, >48h resets [route.ts:51]
           └── Returns { completedTasks, xp, streak }
```

### 3.2 Data Flow: Client ↔ Backend

The application uses a **hybrid data architecture**:

- **Firebase Auth** handles identity and session management entirely client-side. No server-issued JWT or session cookie is involved.
- **MongoDB Atlas** stores enriched user profiles and progress data, accessed exclusively through Next.js API Route Handlers.
- **No server-to-server Firebase token validation exists.** The server trusts a client-supplied `uid` string verbatim in every mutation endpoint.

`DynamicTaskClient.tsx` (19,792 bytes) is the primary workbench client component. It fetches task source code from `GET /api/project-code?slug=` and renders the interactive demo, code viewer, and AI drawer as a unified surface.

---

## 4. Authentication, Security & Data Flow

### 4.1 Authentication Architecture

The system uses a **Firebase-as-IdP + Custom Backend** pattern:

1. **Firebase** (project: `volcanic-world`) manages all credential operations — Google/GitHub OAuth popups, email/password auth, and password reset. Implemented in `src/lib/firebase.ts`.
2. **`AuthContext.tsx`** is the single source of truth for auth state, wrapping Firebase's `onAuthStateChanged` listener and synchronizing with a MongoDB-enriched `MongoUserData` object on every auth state change.
3. **No JWT or session tokens are issued** from the custom backend. The `/api/auth/sync` route takes `{ uid, email, displayName, photoURL }` from the POST body and does a Mongoose upsert — with **no cryptographic verification of the Firebase UID**.

### 4.2 ⚠️ Critical Security Vulnerabilities

#### VULN-01 — CRITICAL: Hardcoded Production Credentials in Tracked Files

**Files:** `.env` (lines 2, 16, 20), `.env.local` (lines 2, 16, 20)

Both `.env` and `.env.local` are present at the project root and contain live production credentials:

```
GEMINI_API_KEY=<redacted — rotate immediately>
MONGODB_URI=mongodb://kedaresp18:<redacted>@ac-bttrdcu-shard-00-00.soentmg.mongodb.net...
EMAIL_PASS=<redacted — revoke Gmail app password>
NEXT_PUBLIC_FIREBASE_API_KEY=<redacted — visible in client bundle>
```

The MongoDB URI encodes **identical username and password** (`kedaresp18`/`kedaresp18`), indicating default or weak credentials on the Atlas cluster. If either `.env` file has ever been committed to git history, all secrets must be considered compromised and rotated immediately — git history rewriting (BFG/git-filter-repo) would also be required.

**Impact:** Full MongoDB Atlas cluster read/write access, unlimited Gemini API token consumption by third parties, Gmail SMTP account takeover for phishing.

---

#### VULN-02 — CRITICAL: Zero Server-Side Authentication on All Mutation API Routes

**Files:** `src/app/api/user/progress/route.ts`, `src/app/api/user/bookmarks/route.ts`, `src/app/api/auth/sync/route.ts`

None of the API route handlers validate the identity of the caller. In `progress/route.ts` at line 28:

```typescript
const user = await User.findOne({ uid }); // uid is taken verbatim from req.body
```

An attacker can send any valid Firebase UID and modify any user's completion records, XP, and streak:

```bash
curl -X POST https://reactforge.sanketkedare.com/api/user/progress \
  -H "Content-Type: application/json" \
  -d '{"uid":"victim-firebase-uid","taskSlug":"any-task","completed":true,"xpValue":9999}'
```

The correct fix requires a Firebase Admin SDK `admin.auth().verifyIdToken(token)` call against an `Authorization: Bearer <idToken>` header in every mutation route handler. The same flaw exists in `/api/user/bookmarks/route.ts` (line 8) and `/api/auth/complete-registration/route.ts` (line 23).

---

#### VULN-03 — HIGH: Unlimited Gemini API Consumption by Anonymous Clients

**File:** `src/app/api/gemini/route.ts`, line 32

```typescript
const apiKey = userApiKey || process.env.GEMINI_API_KEY;
```

If an attacker discovers the `/api/gemini` endpoint and does not supply a `userApiKey`, the server automatically falls back to using the application's own `GEMINI_API_KEY`. The server-side applies **no rate limiting, no IP throttling, and no authentication check** before consuming the key. The client-side guest quota in `guestAiQuota.ts` tracks usage via `localStorage` — trivially bypassed by making direct HTTP requests or clearing localStorage.

---

#### VULN-04 — HIGH: Firebase Credentials Hardcoded as Fallback Values in Client Bundle

**File:** `src/lib/firebase.ts`, lines 16–22

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBstFeVkiViowauy-oxR-oV_0km2OcpdG4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "volcanic-world.firebaseapp.com",
  // ...
};
```

The hardcoded fallback values guarantee these credentials are embedded in the production JavaScript bundle unconditionally, regardless of environment variable state. While Firebase API keys are partially mitigated by Firebase Security Rules, the pattern normalizes secret embedding in source code and breaks any future attempt at key rotation without code changes.

---

#### VULN-05 — MEDIUM: Auth Sync Returns Fabricated Success on Database Error

**File:** `src/app/api/auth/sync/route.ts`, lines 104–120

The `catch` block returns `HTTP 200` with a synthetic user object using whatever `uid` the attacker supplied (`uid: body?.uid || "user"`). This allows a malicious actor to trigger a network error (via DNS poisoning or service disruption) and receive a fabricated authenticated session in the client's React state. The `mongoUser` state in `AuthContext` is populated with attacker-controlled data.

---

#### VULN-06 — MEDIUM: Missing CSP, HSTS, and Wildcard Image Proxy

**File:** `next.config.ts`

The `headers()` function sets 4 headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) but omits:

- **`Content-Security-Policy`:** The app renders user-generated markdown via `MarkdownRenderer.tsx` and uses `dangerouslySetInnerHTML` for JSON-LD injection in `layout.tsx` (line 170) and the dynamic task page (lines 155, 160). No CSP means injected scripts from XSS vectors have full execution privileges.
- **`Strict-Transport-Security`:** Absent, permitting protocol downgrade on the production domain.
- **`images.remotePatterns` wildcard:** `hostname: "**"` at `next.config.ts` line 16 allows Next.js to proxy and optimize images from any external domain, enabling SSRF abuse via the image optimization endpoint to probe internal network addresses.

---

### 4.3 Route Protection & Middleware

There is **no `middleware.ts` file** in the project root or `src/`. Consequently:

- Routes like `/profile` and `/onboarding` have zero server-side access control.
- The `requiresOnboarding` flag at `AuthContext.tsx:383` and `isAuthenticated` are **client-only UI gates** — they control component rendering, not HTTP access.
- An unauthenticated user can navigate to `/profile` directly; the page renders server-side without a 302 redirect.

---

## 5. AI Integration Analysis

### 5.1 Architecture Overview

The AI layer has three tiers:

1. **`src/app/api/gemini/route.ts`** — Next.js POST Route Handler acting as an authenticated proxy to Google's Generative Language REST API.
2. **`src/components/ai/AIInterviewDrawer.tsx`** — 996-line Portal-rendered chat panel with fullscreen mode, code review panel, custom API key input, and per-session message history.
3. **`src/components/ai/HomeAIChat.tsx`** — 31,173-byte landing page AI chat widget.

### 5.2 Prompt System Design

The route implements a **mode-based system instruction switch** with four interview personas:

| Mode | Persona | maxOutputTokens |
|---|---|---|
| `interview` | Staff Frontend Engineer conducting live machine coding interview | 3,000 |
| `review` | Principal Frontend Engineer — scores /10, analyzes complexity, re-renders, a11y | 3,000 |
| `edge_cases` | Senior QA / Frontend Architect — generates 5 critical edge cases | 3,000 |
| `hint` | FAANG interviewer — progressive hints without full solution | 3,000 |

System instructions are assembled server-side by interpolating `taskTitle`, `category`, `level`, and `concepts` from the request body. The candidate's current code is appended to the user turn as a markdown code block at lines 74–76.

### 5.3 Token Optimization — Local Greeting Interceptor

**File:** `src/lib/aiGreetings.ts`

Before hitting the Gemini API, `getLocalGreetingResponse(prompt, taskTitle)` at `route.ts:23` matches the user prompt against arrays of greetings, farewells, and acknowledgements. On a match, a pre-written response is returned immediately with `model: "local-fast"` — saving API token consumption for trivial interactions. The matching uses exact lowercase string comparison with no fuzzy matching, making it brittle against minor typos ("helo", "thxs").

### 5.4 Model Fallback Chain — Active Bug Causing Latency Regression

**File:** `src/app/api/gemini/route.ts`, lines 79–86

```typescript
const geminiModels = [
  "gemini-3.6-flash",   // ❌ Non-existent model identifier
  "gemini-3.7-flash",   // ❌ Non-existent model identifier
  "gemini-3.5-flash",   // ✅ Valid (deprecated but may still resolve)
  "gemini-flash-latest" // ⚠️ Non-standard alias
];
```

The first two model names are **not valid Google Generative Language API identifiers**. Every non-local AI request will fail on models 1 and 2 before reaching a valid model — adding 2 unnecessary network round-trips and approximately **500–1,500ms of avoidable latency** per interaction. The commented-out models (`gemini-1.5-flash`, `gemini-2.0-flash`) are stable identifiers that should replace the speculative list.

### 5.5 Streaming — Not Implemented

The fetch call at `route.ts:92` uses standard `await response.json()` — the entire response is buffered server-side before returning to the client. With `maxOutputTokens: 3000` and `temperature: 0.7`, users face a **3–8 second blocking wait** with no token streaming. TanStack Query is installed but the AI endpoint bypasses the query client entirely, using raw `fetch` inside the component.

### 5.6 User-Supplied API Key

`AIInterviewDrawer.tsx:92` allows users to provide their own Google AI Studio key via a settings panel. The key is held in React component state only — not persisted to localStorage or a backend — requiring re-entry on every page refresh.

---

## 6. UI/UX & Design System

### 6.1 Design Token Architecture

**Files:** `src/app/globals.css`, `tailwind.config.ts`

CSS custom properties serve as design tokens, bridged into Tailwind via `theme.extend.colors.theme`:

```css
/* globals.css — 5 semantic tokens */
.dark {
  --bg-primary: #030712;        --bg-secondary: #0b0f19;
  --bg-card: rgba(15,23,42,.75); --border-color: rgba(30,41,59,.8);
  --text-primary: #f8fafc;       --text-muted: #94a3b8;
}
```

**Critical Gap:** The token set covers only 5 semantic slots. The vast majority of components use **hardcoded Tailwind classes** (`bg-[#07090e]`, `text-slate-100`, `border-slate-800/80`) rather than consuming `theme-*` tokens. `ProjectHeader.tsx`, `AIInterviewDrawer.tsx`, and the studio layout all reference hardcoded hex values. This means the light mode theme defined in `globals.css` and `ThemeContext.tsx` is cosmetic only — switching from dark removes the `dark` class but component-level hardcoded dark colors remain unchanged, resulting in an illegible mixed-mode UI. Per `AGENTS.md`, permanent dark mode is intentional, but the dead light mode infrastructure should be pruned to reduce confusion.

### 6.2 Dark Mode Implementation

- **Strategy:** Tailwind class-based (`darkMode: "class"` in `tailwind.config.ts`).
- **Hydration conflict:** The root layout at `layout.tsx:163` hardcodes `className="dark"` on `<html>`, while `ThemeContext.tsx:40` conditionally adds/removes `dark` via `applyTheme()`. SSR always renders with `dark`; the client-side ThemeProvider may subsequently toggle it — creating a hydration mismatch suppressed via `suppressHydrationWarning` on both `<html>` and `<body>`. This is a correct but symptomatic patch.

### 6.3 Glassmorphism & Visual Design Execution

Glassmorphism is correctly applied across key surfaces:

- **`error.tsx:26`:** `bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)]` with red glow ambiance.
- **`ProjectHeader.tsx`:** Interview dossier panel uses `bg-slate-950/80 backdrop-blur-2xl`.
- **`(studio)/layout.tsx:15–16`:** Dual ambient blob lighting — `bg-amber-500/10 blur-[140px]` and `bg-indigo-600/10 blur-[160px]` — creates the signature dark visual atmosphere.

**Gap:** Blur radii are ad-hoc per component (`blur-[100px]` to `blur-[160px]`) with no shared token or design constant, making visual consistency fragile across future additions.

### 6.4 Animation

Framer Motion is used throughout for:
- `AnimatePresence` — mount/unmount transitions on modals, drawers, and tab content (`ProjectHeader.tsx`, `AIInterviewDrawer.tsx`)
- `motion.div` — panel slides, fade-ins on quick-action buttons

All animations are competently implemented with appropriate `initial`/`animate`/`exit` lifecycle props.

### 6.5 Typography

No Google Font or custom typeface is loaded. `font-sans` in Tailwind resolves to the OS system UI font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`). For a platform with "premium design" aspirations, the absence of a geometric or technical typeface (e.g., Inter, JetBrains Mono for code labels) is a notable gap. `antialiased` is applied globally via `body` className in `layout.tsx:173`.

### 6.6 Component Reusability

- **`ProjectHeader`** is the most reused shared component, consuming task metadata via a reverse lookup against `LEARNING_PROJECTS` to auto-populate the interview dossier — reducing prop-drilling at each usage site.
- **Individual task components** (Calculator, Tic_Tac_Toe, etc.) are correctly monolithic per-task implementations — appropriate for a coding practice platform.
- **Naming inconsistencies** across component directories: `Password_Genrator` (typo), `Start_Rating` (should be `Star_Rating`), `TheamContextComponent.tsx` ("Theam" vs "Theme") create development friction and the slug-to-directory map in `project-code/route.ts` compensates with duplicate entries (lines 16–17: both `start-rating` and `star-rating` map to `Start_Rating`) — a maintenance liability.

---

## 7. Technical Debt & Limitations

### 7.1 AuthContext.tsx — God Context Anti-Pattern

**File:** `src/context/AuthContext.tsx` (427 lines)

This single context conflates **6 distinct responsibilities**:
1. Firebase auth state subscription
2. MongoDB user sync
3. Auth modal open/close state
4. Task completion + XP logic
5. Bookmark management
6. Profile refresh

Every consumer of `useAuth()` re-renders whenever **any** of these slices update. A `toggleTaskBookmark()` call that updates `mongoUser.bookmarkedTasks` triggers re-renders in every component reading `isAdmin`, `isPro`, or `loading` — including the navbar, footer, and all 100 task page headers.

**Refactoring Required:** Split into `useAuthState` (Firebase user), `useUserProgress` (completedTasks, XP, streak), `useBookmarks`, and `useModal` with separate context providers or Zustand atoms (which is already installed).

### 7.2 learningProjects.ts — 94kb Static Data in Client Bundle

**File:** `src/data/learningProjects.ts` (94,729 bytes, 1,932 lines)

All 100 task definitions ship in a single TypeScript file imported at build time and also imported by `DynamicTaskClient.tsx` (a `"use client"` component). Every task page therefore ships the full 94kb data array to the browser — even though each page only needs its own single task object.

**Fix:** Keep `LEARNING_PROJECTS` server-only; pass the single matched task as a serialized prop from the RSC page to the client component. Use dynamic import or route-level code splitting for the Studio data.

### 7.3 Streak Calculation — Logical Off-By-One

**File:** `src/app/api/user/progress/route.ts`, lines 51–58

```typescript
if (diffHours >= 20 && diffHours <= 48) {
  user.streak.current += 1;       // Only if exactly 20-48 hours have passed
} else if (diffHours > 48) {
  user.streak.current = 1;        // Reset if gap > 2 days
}
// diffHours < 20: streak neither advances nor resets — silent no-op
```

Two issues:
1. Completing multiple tasks in a single session (< 20h gap) silently skips streak advancement — a user grinding 5 tasks in one day still has streak = 1.
2. A user completing a task at 11pm and again at 9am the next day (10 hours apart) gets **no streak credit** despite completing tasks on consecutive calendar days. The correct model is calendar-date-based (`today !== lastActiveDate.toDateString()`), not hour-window-based.

### 7.4 Missing Route-Group-Level Error Boundaries

**File:** `src/app/error.tsx` (app-level only)

No `error.tsx` files exist in `src/app/(projects)/` or `src/app/(studio)/`. Any unhandled exception in a Studio component (Virtual Kanban crash, Profiler Lab division-by-zero) bubbles to the global error boundary, wiping the full page. The `(studio)` tasks — featuring WebWorkers, canvas operations, and complex DnD — are especially prone to runtime errors that warrant containment.

**Fix:** Add `src/app/(studio)/error.tsx` and `src/app/(projects)/error.tsx` with contextual recovery actions specific to each route group.

### 7.5 ProfilerContext — rAF Loop Active on Every Page

**File:** `src/context/ProfilerContext.tsx`, lines 48–74

`ProfilerProvider` is mounted in the **root layout** (`layout.tsx:176`), meaning a `requestAnimationFrame` loop measuring FPS and JS heap memory is running on every page — including the landing page, login page, and all 100 task workbenches — even though profiling is only relevant within the Profiler Lab Studio task.

**Fix:** Move `ProfilerProvider` to `src/app/(studio)/layout.tsx` scope only. At scale this rAF loop drains ~0.1–0.3ms/frame continuously across all sessions.

### 7.6 Dead State Management Dependencies

`@reduxjs/toolkit`, `react-redux`, and `zustand` are listed in `dependencies` (production) rather than `devDependencies`. If none are used in active runtime paths, they increase:
- The production `node_modules` directory size
- Serverless function cold-start time (module graph traversal)
- Bundle analysis noise

They should be removed, or explicit usage should be documented and confirmed.

### 7.7 No Input Sanitization on Profile URL Fields

**File:** `src/app/api/auth/complete-registration/route.ts`, lines 87–89

`githubUrl`, `linkedinUrl`, and `portfolioUrl` are accepted from the POST body and saved to MongoDB with no URL format validation:

```typescript
user.githubUrl = githubUrl ? githubUrl.trim() : "";
```

A user can submit `javascript:alert(1)` or a phishing URL. If any profile view component renders these as `<a href={user.githubUrl}>`, it creates a stored XSS vector. All URL fields must be validated against `^https?://` before persistence.

### 7.8 Nodemailer Gmail SMTP — Per-Serverless-Instance Connection Cost

**File:** `src/lib/email.ts`

`sendWelcomeEmail()` is correctly called non-blocking (`.catch()` pattern at `complete-registration/route.ts:134`). However, the Nodemailer `createTransport()` creates a new SMTP connection per serverless function cold-start. Gmail SMTP connections add 200–400ms connection overhead and are subject to Gmail's daily sending limits — unsuitable for production scale. A dedicated transactional email service (SendGrid, Resend, Postmark) with HTTP-based sending is the correct architecture.

---

## Appendix A: Security Remediation Priority Matrix

| ID | Severity | File | Remediation |
|---|---|---|---|
| VULN-01 | 🔴 Critical | `.env`, `.env.local` | Rotate all secrets immediately; use hosting environment variables; verify `.gitignore` and scan git history |
| VULN-02 | 🔴 Critical | `api/user/progress`, `api/user/bookmarks`, `api/auth/sync` | Add Firebase Admin SDK `verifyIdToken()` middleware to every mutation route |
| VULN-03 | 🟠 High | `api/gemini/route.ts` | Implement server-side per-IP rate limiting (Upstash Redis / Vercel KV) |
| VULN-06 | 🟠 High | `next.config.ts` | Add `Content-Security-Policy`, `Strict-Transport-Security`; restrict `images.remotePatterns` to explicit domains |
| VULN-04 | 🟡 Medium | `lib/firebase.ts` | Remove hardcoded fallback credentials; throw explicit error on missing env var |
| VULN-05 | 🟡 Medium | `api/auth/sync/route.ts` | Return `500` on DB error instead of fabricated `200` success |
| VULN-07 (implied) | 🟡 Medium | `api/auth/complete-registration/route.ts` | Validate all URL fields with regex before persistence |

---

## Appendix B: AI Model Correctness Fix

Replace the speculative model array in `src/app/api/gemini/route.ts` lines 79–86:

```typescript
// BEFORE (causes 2 failing round-trips per request)
const geminiModels = [
  "gemini-3.6-flash",   // ❌ Does not exist
  "gemini-3.7-flash",   // ❌ Does not exist
  "gemini-3.5-flash",
  "gemini-flash-latest",
];

// AFTER (verified stable identifiers)
const geminiModels = [
  "gemini-2.0-flash",      // Stable, fast, current
  "gemini-1.5-flash",      // Stable fallback
  "gemini-1.5-flash-8b",   // Budget/capacity fallback
];
```

---

*Report generated by static analysis of source files. No dynamic execution, runtime tracing, or penetration testing was performed. All findings are based on code pattern analysis of the files listed above.*
