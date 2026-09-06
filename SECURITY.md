# ReactForge Security Policy & Threat Model

## 1. Client-Side Sandboxing & Isolation
- **Code Playground Execution**: Dynamic user code entered in `/playground` is executed strictly inside an isolated `iframe` with `sandbox="allow-scripts"`.
- **Prohibited Privileges**: The sandbox explicitly denies `allow-same-origin`, preventing script execution from accessing cookies, authentication tokens, or parent window storage.

## 2. API Key & Secret Management
- **Zero Client-Side Secret Exposure**: All third-party secrets (Gemini AI keys, database credentials) reside exclusively in server-side environment variables and Next.js Route Handlers.
- **Client Tokens**: Firebase Auth tokens are transmitted via secure HTTPS headers and validated on every administrative or mutative request.

## 3. Input Validation & XSS Defense
- User inputs in search fields, comments, and task filters are sanitized before DOM rendering.
- Markdown rendering in AI drawers strictly strips raw `<script>` tags and untrusted HTML embeds.
