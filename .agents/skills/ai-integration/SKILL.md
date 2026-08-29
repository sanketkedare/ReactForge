---
name: ai-integration
description: >-
  Use this skill when working on the AI coaching system in ReactForge. Activates
  when modifying src/app/api/gemini/route.ts, src/components/ai/AIInterviewDrawer.tsx,
  src/components/ai/HomeAIChat.tsx, src/lib/aiGreetings.ts, or src/lib/guestAiQuota.ts.
  Also use when adding new AI modes, fixing the model fallback chain, implementing
  streaming responses, or changing the guest quota system.
---

# ReactForge — AI Integration Guide

The AI coaching system has three layers: the **proxy route** (server), the **chat UI**
(client), and **local interceptors** (edge optimization). Understanding all three
is required before modifying any AI-related file.

---

## System Architecture

```
User types a message
        │
        ▼
[AIInterviewDrawer.tsx / HomeAIChat.tsx]  (client)
        │
        ├── 1. Check getLocalGreetingResponse(prompt) → lib/aiGreetings.ts
        │      If matched: return pre-written response (0 API tokens consumed)
        │
        ├── 2. Check isGuestAiLimitReached() → lib/guestAiQuota.ts
        │      If guest and limit hit: show auth prompt
        │
        ▼
POST /api/gemini  (server Route Handler)
        │
        ├── 3. getLocalGreetingResponse() server-side check (redundant safety)
        │
        ├── 4. Resolve API key: userApiKey || process.env.GEMINI_API_KEY
        │
        ├── 5. Build systemInstruction from mode switch
        │
        └── 6. Try each model in geminiModels[] waterfall
                 └── Return first successful candidateText
```

---

## Gemini API Route — Key Details

**File:** `src/app/api/gemini/route.ts`

### Request Body Schema
```typescript
{
  prompt: string,
  context?: {
    taskTitle?: string,    // default: "React Component"
    category?: string,     // default: "Frontend Architecture"
    level?: string,        // default: "Intermediate"
    concepts?: string[],   // default: []
    code?: string,         // candidate's current code — triggers code review
  },
  mode?: "interview" | "review" | "edge_cases" | "hint",  // default: "interview"
  userApiKey?: string,   // if provided, overrides GEMINI_API_KEY
}
```

### Response Body Schema
```typescript
// Success
{ success: true, model: string, response: string }

// Local greeting (no API call)
{ success: true, model: "local-fast", response: string }

// Error
{ error: string }  // HTTP 400 or 500
```

### Mode System Instruction Map

| Mode | Temperature | Focus |
|---|---|---|
| `interview` | 0.7 | Live machine coding interview coaching |
| `review` | 0.7 | Code review: complexity, re-renders, memory leaks, a11y, /10 score |
| `edge_cases` | 0.7 | 5 critical edge cases and test assertions |
| `hint` | 0.7 | Progressive hints without full solution |

### ✅ Correct Model Fallback List (replace current broken list)

```typescript
// CURRENT (broken — gemini-3.6/3.7 don't exist):
const geminiModels = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.5-flash", "gemini-flash-latest"];

// CORRECT:
const geminiModels = [
  "gemini-2.0-flash",       // primary — fast, current, stable
  "gemini-1.5-flash",       // fallback
  "gemini-1.5-flash-8b",    // budget fallback
];
```

### Generative Config
```typescript
generationConfig: {
  temperature: 0.7,
  maxOutputTokens: 3000,
}
```

---

## Adding a New AI Mode

1. Add the mode string to the request body type in the component and route.
2. Add a `case "your_mode":` to the `switch (mode)` block in `route.ts`:
```typescript
case "your_mode":
  systemInstruction = `You are a [role] for "${taskTitle}" ([level]).
[Precise behavioral instruction. Be concise — these tokens count against output budget.]`;
  break;
```
3. Add a quick-action button in `AIInterviewDrawer.tsx` (look for the `quickActions` array or equivalent).
4. Test with real prompts in dev (`npm run dev --port 3002`) before deploying.

---

## Implementing Streaming (Current Gap)

The current route buffers the full response. To add streaming:

```typescript
// In api/gemini/route.ts — replace the fetch + response.json() pattern:
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  // ... (auth, validation, greeting check as before) ...

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const stream = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: userContentText }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 3000 },
  });

  // Return a streaming response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

Client-side streaming consumption in `AIInterviewDrawer.tsx`:
```typescript
const response = await fetch("/api/gemini", { method: "POST", body: JSON.stringify(body) });
const reader = response.body!.getReader();
const decoder = new TextDecoder();
let accumulated = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  accumulated += decoder.decode(value, { stream: true });
  // Update message state with accumulated so far:
  setMessages(prev => prev.map(m => m.id === currentMsgId ? { ...m, text: accumulated } : m));
}
```

---

## Local Greeting Interceptor (`src/lib/aiGreetings.ts`)

Called both client-side (in component) and server-side (in route handler) to avoid API calls.

```typescript
getLocalGreetingResponse(prompt: string, contextTitle?: string): string | null
```

Returns a pre-written response string if `prompt` matches any of:
- Greetings: `hi`, `hello`, `hey`, `heya`, `good morning`, etc.
- Identity: `who are you`, `what can you do`, `help`
- Thanks: `thanks`, `thank you`, `got it`, `ok`, `cool`
- Farewell: `bye`, `goodbye`, `see ya`

Returns `null` for all other prompts (triggers real API call).

**Improving matching** (current limitation: exact-match only):
```typescript
// Add fuzzy matching for common typos:
const normalized = prompt.trim().toLowerCase()
  .replace(/[!?.,]/g, "")
  .replace(/\bthxs?\b/, "thanks")
  .replace(/\bhelo\b/, "hello");
```

---

## Guest AI Quota (`src/lib/guestAiQuota.ts`)

| Constant | Value | Purpose |
|---|---|---|
| `GUEST_AI_STORAGE_KEY` | `"reactforge_guest_ai_usage_count"` | localStorage key |
| `GUEST_AI_MAX_LIMIT` | `3` | Max free AI uses for unauthenticated users |

```typescript
import {
  getGuestAiUsageCount,   // (): number
  incrementGuestAiUsage,  // (): number — increments and dispatches "guest-ai-quota-change" event
  isGuestAiLimitReached,  // (): boolean
  getGuestAiRemaining,    // (): number
  GUEST_AI_MAX_LIMIT,
} from "@/lib/guestAiQuota";
```

Listen for quota changes anywhere in the UI:
```typescript
useEffect(() => {
  const handler = (e: CustomEvent) => setGuestRemaining(e.detail.count);
  window.addEventListener("guest-ai-quota-change", handler as EventListener);
  return () => window.removeEventListener("guest-ai-quota-change", handler as EventListener);
}, []);
```

> ⚠️ This is client-side only. The server at `/api/gemini` does NOT enforce this limit.
> Adding server-side enforcement requires IP-based rate limiting (see security-audit skill).

---

## AIInterviewDrawer — Key Component Facts

**File:** `src/components/ai/AIInterviewDrawer.tsx` (996 lines, single component — god component)

- Rendered via `createPortal` to `document.body` — always at the root DOM level.
- Floats fixed at `bottom-6 right-6`.
- Hidden when `html[data-ai-fullscreen="true"]` (set on full-screen mode toggle).
- Props:
  ```typescript
  interface AIInterviewDrawerProps {
    taskTitle?: string;     // default: "React Machine Coding Task"
    category?: string;      // default: "Frontend"
    level?: string;         // default: "Intermediate"
    concepts?: string[];    // default: []
    codeSnippet?: string;   // pre-fills the code review panel
  }
  ```
- Message history is **in-memory only** (component state) — not persisted to DB or localStorage.
- User-supplied API key: stored in `useState<string>("")` — resets on page reload.

---

## MarkdownRenderer (`src/components/ai/MarkdownRenderer.tsx`)

Used inside both AI components to render Gemini's markdown responses.

```tsx
import MarkdownRenderer from "@/components/ai/MarkdownRenderer";

<MarkdownRenderer content={message.text} />
```

> ⚠️ No Content Security Policy is configured. Any injected HTML in AI responses
> that bypasses markdown parsing would execute in the page context. See security-audit skill.
