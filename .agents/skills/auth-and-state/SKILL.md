---
name: auth-and-state
description: >-
  Use this skill when working with authentication, user state, task progress, bookmarks,
  XP, streaks, or the auth modal system. Activates when modifying AuthContext.tsx,
  useAuth hook, login/register flows, onboarding, Firebase auth methods, or MongoDB
  user sync. Also use when adding new context providers or splitting the god context.
---

# ReactForge — Auth & State Management Guide

---

## Auth Architecture at a Glance

```
Firebase Auth (client-side identity)
       │
       ▼  onAuthStateChanged
AuthContext.tsx  ←──── single source of truth (React Context)
       │
       ├── user: FirebaseUser | null         (from Firebase)
       ├── mongoUser: MongoUserData | null   (enriched from MongoDB)
       ├── loading: boolean
       ├── Modal state (isAuthModalOpen, authModalMode)
       └── Methods: login*, register*, logout, toggleTaskComplete, toggleTaskBookmark
                         │
                         ▼
               API Routes (POST body contains uid)
               /api/auth/sync
               /api/auth/complete-registration
               /api/user/progress
               /api/user/bookmarks
               /api/user/profile
```

---

## How to Consume Auth State

**Always import from `@/hooks/useAuth`**, not directly from `@/context/AuthContext`:
```typescript
import { useAuth } from "@/hooks/useAuth";

const {
  user,              // FirebaseUser | null
  mongoUser,         // MongoUserData | null — enriched profile
  loading,           // true during initial Firebase state resolution
  isAuthenticated,   // Boolean shorthand for !!user
  isPro,             // mongoUser.role === "pro" || "admin"
  isAdmin,           // mongoUser.role === "admin"
  requiresOnboarding, // user exists but isRegistrationComplete === false
} = useAuth();
```

---

## MongoUserData Interface

```typescript
interface MongoUserData {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  photoURL?: string;
  role: "user" | "pro" | "admin";
  isRegistrationComplete: boolean;
  experienceLevel?: "fresher" | "junior" | "mid" | "senior" | "architect";
  primaryFocus?: string;
  targetRole?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  completedTasks: string[];      // array of task slug strings
  bookmarkedTasks: string[];
  streak: { current: number; longest: number; lastActiveDate: string | null };
  xp: number;
}
```

---

## Auth Methods Reference

### Login / Register
```typescript
const { loginWithGoogle, loginWithGithub, loginWithEmailPassword, registerWithEmailPassword } = useAuth();

// All return { success: boolean, error?: string }
await loginWithGoogle();
await loginWithGithub();
await loginWithEmailPassword(email, password);
await registerWithEmailPassword(email, password, displayName);
```

### Auth Modal (global, no props needed)
```typescript
const { openAuthModal, closeAuthModal, isAuthModalOpen, authModalMode } = useAuth();

// Trigger from anywhere in the component tree
openAuthModal("login");    // or "register" | "forgot"
closeAuthModal();
```

### Task Completion & Bookmarks
```typescript
const { toggleTaskComplete, toggleTaskBookmark, isTaskCompleted, isTaskBookmarked } = useAuth();

// toggleTaskComplete returns the NEW completion state (true = now complete)
// xpValue defaults to 15 if not provided
const isNowComplete = await toggleTaskComplete(slug, 20);

// toggleTaskBookmark returns the NEW bookmark state
const isNowBookmarked = await toggleTaskBookmark(slug);

// Sync checks (no async)
const completed = isTaskCompleted(slug);
const bookmarked = isTaskBookmarked(slug);
```

---

## Firebase Auth Methods (`src/lib/firebase.ts`)

All functions return `{ user, error }` or `{ success, error }` — never throw:

```typescript
import { signInWithGooglePopup, signInWithGithubPopup, loginWithEmail,
         registerWithEmail, logoutUser, sendPasswordReset } from "@/lib/firebase";

// signInWithGooglePopup()    → { user: FirebaseUser, error: null } | { user: null, error: string }
// loginWithEmail(email, pass) → same shape
// registerWithEmail(email, pass, displayName) → same shape
// logoutUser()               → { success: boolean, error: string | null }
// sendPasswordReset(email)   → { success: boolean, error: string | null }
```

---

## Theme System

Two overlapping theme systems exist — understand the hierarchy before touching:

1. **`ThemeContext.tsx`** — canonical source (`dark` | `light`, stored in `localStorage("theme_mode")`).
   - `useTheme()` → `{ theme, toggleTheme, setTheme, isDark }`
   - `applyTheme(mode)` adds/removes the `dark` class on `document.documentElement`.

2. **`TheamContextComponent.tsx`** — legacy bridge adapter (typo in filename intentional, do not rename without full refactor).
   - Wraps `ThemeProvider` and re-exports via the old `TheamContext` shape.
   - `useContext(TheamContext)` → `{ theme: Theme, changeTheme: () => void }` where `Theme` is `{ name, background, text }`.

> ⚠️ **Rule:** New components should use `useTheme()` from `@/context/ThemeContext`. Only legacy components use `TheamContext`.
> ⚠️ **Dark mode is permanent** per `AGENTS.md`. The `<html>` tag always has `className="dark"`. Do not build or surface light mode UI.

---

## Context Provider Tree (Root Layout)

```tsx
// src/app/layout.tsx
<AuthProvider>                    // ← Auth state, modal, progress, bookmarks
  <TheamContextComponent>         // ← Theme (legacy bridge)
    <ProfilerProvider>            // ← rAF FPS loop (should be in studio layout only)
      {children}
      <AuthModal />               // ← Global auth modal (no portal needed)
      <RegistrationOnboardingModal /> // ← Fires when requiresOnboarding === true
    </ProfilerProvider>
  </TheamContextComponent>
</AuthProvider>
```

---

## Optimistic Updates Pattern

Both `toggleTaskComplete` and `toggleTaskBookmark` use **optimistic updates**:
1. `setMongoUser(...)` is called immediately for instant UI feedback.
2. The API call happens async.
3. On API success, the server response reconciles the state.
4. On API failure, the optimistic state is **not rolled back** — the error is logged only.

> ⚠️ **Technical Debt:** Missing rollback on failure. When adding new optimistic mutations, implement rollback:
```typescript
const previousState = mongoUser;
setMongoUser(optimisticState);
try {
  await fetch(...);
} catch {
  setMongoUser(previousState); // rollback
}
```

---

## Streak Logic Reference (`src/app/api/user/progress/route.ts`)

Current (buggy) logic — hour-window based:
```typescript
const diffHours = (now - lastActive) / (1000 * 60 * 60);
if (diffHours >= 20 && diffHours <= 48) streak.current++;
else if (diffHours > 48) streak.current = 1;
// < 20 hours: no-op (bug: same-day multi-task doesn't advance streak)
```

Correct calendar-date-based implementation:
```typescript
const todayStr = now.toDateString();
const lastStr = lastActive?.toDateString();
if (lastStr !== todayStr) {
  const diffDays = Math.floor((now.getTime() - (lastActive?.getTime() ?? 0)) / 86400000);
  if (diffDays === 1) streak.current++;
  else if (diffDays > 1) streak.current = 1;
  // same day: no-op but don't reset
}
```

---

## Registration Flow

1. User signs up (any provider) → Firebase creates identity.
2. `onAuthStateChanged` fires → `syncWithMongo(fbUser)` → `POST /api/auth/sync`.
3. API creates MongoDB user with `isRegistrationComplete: false`.
4. `requiresOnboarding` becomes `true` → `<RegistrationOnboardingModal>` renders.
5. User fills onboarding form → `completeRegistration(data)` → `POST /api/auth/complete-registration`.
6. API sets `isRegistrationComplete: true`, awards 50 XP, fires welcome email async.
7. Modal closes, `mongoUser` is updated in context.
