---
name: api-route-builder
description: >-
  Use this skill when creating or modifying any Next.js API route handler under
  src/app/api/. Activates on requests to add a new API endpoint, fix an existing
  route, add validation, connect to MongoDB, or wire a route to the Firebase Admin
  SDK. Provides the exact conventions, error patterns, and auth middleware used in
  this project.
---

# ReactForge — API Route Builder Guide

All API routes live under `src/app/api/` and follow Next.js 16 App Router Route Handler conventions.
Every route is a `route.ts` file exporting named async functions (`GET`, `POST`, `PUT`, `DELETE`).

---

## Existing Route Inventory

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/auth/sync` | Firebase → MongoDB upsert on login |
| `POST` | `/api/auth/complete-registration` | Onboarding data save + welcome email |
| `POST` | `/api/gemini` | Gemini AI proxy with mode switching |
| `GET` | `/api/project-code` | Filesystem code reader (`?slug=`) |
| `POST` | `/api/user/progress` | Task completion + XP + streak update |
| `POST` | `/api/user/bookmarks` | Bookmark toggle |
| `GET` | `/api/user/profile` | User profile fetch (`?uid=`) |

---

## Standard Route Template

Use this exact structure for every new route. Fill in the business logic section only.

```typescript
// src/app/api/<group>/<action>/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
// import { verifyFirebaseToken } from "@/lib/firebaseAdmin"; // uncomment for auth

export async function POST(req: NextRequest) {
  try {
    // 1. [AUTH] Verify caller identity — REQUIRED for any mutation
    // const authHeader = req.headers.get("Authorization") ?? "";
    // const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    // const verifiedUid = await verifyFirebaseToken(token);
    // if (!verifiedUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. [PARSE] Parse and validate request body
    const body = await req.json();
    const { uid, /* ...other fields */ } = body;

    if (!uid) {
      return NextResponse.json({ error: "Missing required field: uid" }, { status: 400 });
    }

    // 3. [DB] Connect to MongoDB
    const db = await connectToDatabase();
    if (!db) {
      // Graceful offline fallback — do NOT return fabricated auth data
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // 4. [LOGIC] Business logic here
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ... mutate user ...
    await user.save();

    // 5. [RESPONSE] Return only what the client needs
    return NextResponse.json({ success: true, /* ...data */ });

  } catch (error: any) {
    console.error("[API Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## MongoDB Connection Rules

- **Always** use `connectToDatabase()` from `src/lib/mongodb.ts` — it handles the global cache.
- **Check for null** — `connectToDatabase()` returns `null` if `MONGODB_URI` is unset or DB is unreachable.
- **Do NOT** return a fabricated `200 OK` success on DB failure for mutation routes. Return `503`.
- The global cache key is `global.mongooseCache`. The connection pool is set to `maxPoolSize: 10`.

```typescript
const db = await connectToDatabase();
if (!db) {
  return NextResponse.json({ error: "Database unavailable. Try again shortly." }, { status: 503 });
}
```

---

## User Model Reference (`src/models/User.ts`)

Key fields on the `IUser` interface:

```typescript
uid: string           // Firebase UID — primary lookup key
email: string         // Unique, lowercase
displayName: string
username?: string      // Unique, sparse, lowercase
role: "user" | "pro" | "admin"
isRegistrationComplete: boolean
experienceLevel?: "fresher" | "junior" | "mid" | "senior" | "architect"
completedTasks: string[]   // Array of task slug strings
bookmarkedTasks: string[]
streak: { current: number; longest: number; lastActiveDate: Date | null }
xp: number
lastLoginAt: Date
```

Common queries:
```typescript
// Lookup by Firebase UID (most common)
const user = await User.findOne({ uid });

// Lookup by email (for cross-auth-provider linking)
const user = await User.findOne({ email: email.toLowerCase().trim() });

// Check username uniqueness (exclude current user)
const taken = await User.findOne({ username: cleanUsername, uid: { $ne: uid } });
```

---

## AI Route — Mode Reference (`src/app/api/gemini/route.ts`)

The `/api/gemini` route accepts these fields in the POST body:

```typescript
{
  prompt: string,
  context?: {
    taskTitle?: string,   // e.g. "Password Generator"
    category?: string,    // e.g. "Forms & State"
    level?: string,       // e.g. "Beginner"
    concepts?: string[],  // e.g. ["useState", "Clipboard API"]
    code?: string,        // Candidate's current code for review
  },
  mode?: "interview" | "review" | "edge_cases" | "hint",
  userApiKey?: string,    // User-supplied Gemini key overrides server key
}
```

**Fix the model list** — replace lines 79–86 with verified identifiers:
```typescript
const geminiModels = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];
```

---

## Project Code Route — Slug Map (`src/app/api/project-code/route.ts`)

When adding a new task component, add its entry to `SLUG_TO_DIR_MAP`:
```typescript
const SLUG_TO_DIR_MAP: Record<string, string> = {
  "todo-list":          "To-Do_List",
  "password-generator": "Password_Genrator",  // note: typo in dir name
  "tic-tac-toe":        "Tic_Tac_Toe",
  // add new: "your-slug": "Your_ComponentDir"
};
```

---

## File-System Code Reader — Path Safety

The `project-code` route reads files from `src/components/`. When adding new slugs,
always validate that the resolved path stays within `componentsRoot`:

```typescript
const resolvedPath = path.resolve(targetDir);
if (!resolvedPath.startsWith(componentsRoot)) {
  return NextResponse.json({ error: "Invalid path" }, { status: 400 });
}
```

---

## Email Route (`src/lib/email.ts`)

`sendWelcomeEmail()` is called non-blocking in `complete-registration`:
```typescript
sendWelcomeEmail({ toEmail, displayName, username, targetRole, experienceLevel, primaryFocus })
  .catch((err) => console.error("Email send failed:", err));
```

It uses Gmail SMTP via Nodemailer. Env vars required: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`.
Do not `await` this call — keep it fire-and-forget.
