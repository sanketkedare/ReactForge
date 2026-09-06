# Phase 7: Flagship Feature — ReactForge Interactive Code Sandbox

## 🎯 Goal
Architect and build the **ReactForge Interactive Code Sandbox / Playground** (`/playground`) — a secure, sandboxed, browser-based React live code runner featuring real-time compilation, isolated iframe execution, live console HUD, accessibility inspector, and performance telemetry.

---

## 📋 Detailed Scope & Tasks

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ReactForge Interactive Playground                                              │
├──────────────────────────────────────┬──────────────────────────────────────────┤
│ 📝 Code Editor (Monaco / Custom TSX) │ 🖥️ Live Sandboxed Preview (iframe)       │
│                                      │                                          │
│ import React, { useState } from ...  │ [ Rendered Live React Component ]        │
│ export default function App() {      │                                          │
│   return <button>Click</button>      │                                          │
│ }                                    │                                          │
├──────────────────────────────────────┴──────────────────────────────────────────┤
│ 📊 HUD Tabs: 🟢 Console Output │ ♿ A11y Audit │ ⚡ Render Profile │ 📦 AST Tree  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Secure Sandboxed Execution Model
- Execute user-entered code inside a strict, isolated `iframe` with `sandbox="allow-scripts"` (restricting parent DOM access, cookie theft, and localStorage tampering).
- PostMessage communication protocol between main app and sandboxed iframe for bi-directional state, console messages, and error trapping.

### 2. Client-Side JSX/TSX Compilation Pipeline
- Lightweight in-browser transpilation pipeline transforming React 19 JSX/TSX into executable JavaScript.
- Syntax error trapping with highlighted line numbers and recovery suggestions without crashing the editor.

### 3. Integrated Developer HUD Tabs
- **Console HUD**: Intercepts `console.log`, `console.warn`, `console.error` inside the sandbox and renders them in a formatted log console.
- **Accessibility (A11y) Inspector**: Scans the rendered DOM inside the sandbox for missing `alt`, empty labels, missing ARIA tags, and color contrast.
- **Render & State Inspector**: Tracks re-render counts and hooks state for the active component.
- **Pre-loaded Challenge Templates**: Quick-load starter boilerplates (Counter, Todo, Custom Hook, Virtual List).

---

## 🔍 Validation & Criteria for Completion
- [x] User can write and edit React 19 code in real time with live preview rendering.
- [x] Sandboxed iframe prevents any security escapes or parent window DOM mutations.
- [x] Syntax errors and runtime errors are cleanly captured in the Console HUD with line numbers.
- [x] Live accessibility checker warns of missing labels or bad contrast inside the preview.

**Status**: ✅ Completed
