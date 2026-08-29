---
name: security-audit
description: >-
  Use this skill when performing a security review of ReactForge API routes,
  authentication flows, or environment variable handling. Activates when the user
  asks to harden an API route, add authentication, fix credential exposure,
  implement rate limiting, or audit any file under src/app/api/. Also triggers
  when reviewing .env files or any changes to src/lib/firebase.ts or src/lib/mongodb.ts.
---

# ReactForge Security Audit & Hardening Guide

This skill documents every confirmed vulnerability in the codebase and provides
exact, copy-paste-ready remediation patterns for each.

---

## Critical Vulnerability Map

| ID | File | Line | Issue |
|---|---|---|---|
| VULN-01 | `.env`, `.env.local` | 2, 16, 20 | Live credentials committed to filesystem |
| VULN-02 | `api/user/progress/route.ts` | 28 | No auth — `uid` taken verbatim from body |
| VULN-02 | `api/user/bookmarks/route.ts` | 8 | Same pattern — no auth |
| VULN-02 | `api/auth/sync/route.ts` | 9 | Same pattern — no auth |
| VULN-03 | `api/gemini/route.ts` | 32 | Server API key used for unauthenticated callers |
| VULN-04 | `lib/firebase.ts` | 16–22 | Hardcoded creds as `||` fallbacks in client bundle |
| VULN-05 | `api/auth/sync/route.ts` | 104–120 | `catch` block returns `200` with fabricated user |
| VULN-06 | `next.config.ts` | 13–18 | No CSP, no HSTS, wildcard image proxy (`hostname: "**"`) |
| VULN-07 | `api/auth/complete-registration/route.ts` | 87–89 | No URL validation on githubUrl/linkedinUrl/portfolioUrl |

---

## Fix Pattern 1 — Authenticate Every Mutation Route (VULN-02)

Install Firebase Admin SDK first (server-only):
```bash
npm install firebase-admin
```

Create `src/lib/firebaseAdmin.ts`:
```typescript
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function verifyFirebaseToken(token: string): Promise<string | null> {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}
```

Apply to every mutation route (template for `api/user/progress/route.ts`):
```typescript
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  // 1. Extract and verify Bearer token
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const verifiedUid = await verifyFirebaseToken(token);

  if (!verifiedUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { uid, taskSlug, completed, xpValue = 15 } = body;

  // 2. Ensure the token UID matches the requested UID
  if (verifiedUid !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ... rest of handler
}
```

Client-side: Always send the Firebase ID token in requests:
```typescript
// In AuthContext.tsx — update fetch calls
const idToken = await user.getIdToken();
const res = await fetch("/api/user/progress", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${idToken}`,
  },
  body: JSON.stringify({ uid: user.uid, taskSlug, completed, xpValue }),
});
```

---

## Fix Pattern 2 — Remove Hardcoded Fallbacks (VULN-04)

In `src/lib/firebase.ts`, replace `||` fallbacks with explicit error throwing:
```typescript
function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

const firebaseConfig = {
  apiKey:            requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain:        requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId:         requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket:     requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId:             requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

---

## Fix Pattern 3 — Add CSP and HSTS (VULN-06)

In `next.config.ts`, extend the `headers()` array:
```typescript
{
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains; preload",
},
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",   // narrow further once JSON-LD is refactored
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.mongodb.net",
    "font-src 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
},
```

Also restrict image proxy in `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "lh3.googleusercontent.com" },  // Google avatars
    { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatars
    { protocol: "https", hostname: "reactforge.sanketkedare.com" },
  ],
},
```

---

## Fix Pattern 4 — URL Field Validation (VULN-07)

Add to `src/app/api/auth/complete-registration/route.ts` before saving:
```typescript
function isValidHttpsUrl(url: string | undefined): boolean {
  if (!url) return true; // empty is okay
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

if (!isValidHttpsUrl(githubUrl) || !isValidHttpsUrl(linkedinUrl) || !isValidHttpsUrl(portfolioUrl)) {
  return NextResponse.json({ error: "Profile URLs must start with https://" }, { status: 400 });
}
```

---

## Fix Pattern 5 — Server-Side AI Rate Limiting (VULN-03)

If using Vercel, use the built-in KV store (Upstash Redis):
```typescript
// api/gemini/route.ts — add before API key resolution
import { kv } from "@vercel/kv";

const ip = req.headers.get("x-forwarded-for") ?? "unknown";
const rateLimitKey = `ai_rate:${ip}`;
const current = await kv.incr(rateLimitKey);
if (current === 1) await kv.expire(rateLimitKey, 3600); // 1 hour window
if (current > 20) {
  return NextResponse.json({ error: "Rate limit exceeded. Please sign in for unlimited access." }, { status: 429 });
}
```

---

## Credential Rotation Checklist (VULN-01)

- [ ] **MongoDB Atlas**: Change password for user `kedaresp18` in Atlas → Database Access
- [ ] **Gemini API Key**: Revoke `<your-key>` in Google AI Studio → API Keys
- [ ] **Gmail App Password**: Revoke in Google Account → Security → App Passwords
- [ ] **Verify `.gitignore`**: Ensure `.env` and `.env.local` are listed
- [ ] **Scan git history**: `git log --all --full-history -- .env` to check if ever committed
- [ ] **If committed**: Use `git-filter-repo` or BFG Repo Cleaner to purge history
- [ ] **Set secrets in Vercel**: Use Vercel Project → Settings → Environment Variables
