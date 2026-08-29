---
name: stylish-commit-message
description: >-
  Triggers whenever the user requests a git commit message, commit title, or commit
  summary for the ReactForge project. Generates stylish, single-line conventional
  commit messages with a lead emoji, conventional type, ReactForge-specific scope,
  imperative description, and a trailing emoji. Overrides the global commit skill
  with project-aware scopes and examples from this codebase.
---

# 🔥 ReactForge — Stylish Git Commit Generator

Every commit message is a **single line**, max **80 characters**, always in the format:

```
<lead-emoji> <type>(<scope>): <imperative description> <trailing-emoji>
```

---

## 📐 Format Rules

1. **One line only** — no body, no footer, no multi-line.
2. **Imperative present tense** — `add`, `fix`, `remove`, `wire`, `split`, `harden`, `scaffold`. Never `added`, `fixed`, `updated`.
3. **Lead emoji** opens the message. **Trailing emoji** closes it. Both are mandatory.
4. **Scope** is a ReactForge-specific token from the table below — always lowercase, always parenthesized.
5. **72–80 character max** — count and trim if needed.

---

## 🗂️ ReactForge Scope Reference

| Scope | Covers |
|---|---|
| `auth` | `AuthContext.tsx`, Firebase helpers, login/register modals, onboarding |
| `ai` | `AIInterviewDrawer`, `HomeAIChat`, `/api/gemini`, `aiGreetings.ts`, `guestAiQuota.ts` |
| `api` | Any file under `src/app/api/` |
| `db` | `mongodb.ts`, `User.ts` model, any Mongoose query |
| `tasks` | `learningProjects.ts`, task registry, curriculum data |
| `studio` | Files under `src/app/(studio)/`, Studio components, Profiler Lab, Virtual Kanban |
| `ui` | Any component in `src/components/common/`, design tokens, `globals.css` |
| `theme` | `ThemeContext.tsx`, `TheamContextComponent.tsx`, dark mode |
| `profiler` | `ProfilerContext.tsx`, FPS loop, rAF metrics |
| `email` | `email.ts`, Nodemailer, welcome email templates |
| `security` | `.env`, auth middleware, rate limiting, CSP headers, `next.config.ts` |
| `perf` | Bundle size, code splitting, re-render optimization, Zustand refactor |
| `skills` | `.agents/skills/` files, SKILL.md updates |
| `seo` | `layout.tsx` metadata, `sitemap.ts`, `robots.ts`, JSON-LD schema |
| `dx` | `eslint.config.js`, `tsconfig.json`, `package.json`, dev tooling |

---

## 🎨 Type → Emoji Mapping

| Type | Lead | Trailing | When to Use |
|---|---|---|---|
| `feat` | ✨ | 🚀 | New task, new API endpoint, new AI mode, new component |
| `fix` | 🐛 | 🩹 | Bug fix, broken streak logic, model name typo, broken route |
| `security` | 🔒 | 🛡️ | Auth hardening, token verification, CSP, credential rotation |
| `perf` | ⚡ | 📦 | Bundle split, rAF scope move, lazy loading, Zustand migration |
| `refactor` | ♻️ | 🔁 | Context split, component decomposition, dead code removal |
| `style` | 🎨 | 💄 | Glassmorphism, Tailwind tweaks, responsive layout, animations |
| `docs` | 📝 | 📋 | `Project_Report.md`, `AGENTS.md`, README, SKILL.md updates |
| `chore` | 🔧 | ⚙️ | `package.json` deps, `.gitignore`, config files, scripts |
| `test` | 🧪 | ✅ | Unit tests, type checks, `npx tsc --noEmit` passing |
| `remove` | 🗑️ | ❌ | Delete dead code, unused deps, deprecated components |
| `hotfix` | 🚑 | 🔥 | Critical prod fix — broken AI, auth failure, DB crash |
| `wip` | 🚧 | 🏗️ | Work in progress — incomplete feature commit |

---

## 💡 ReactForge-Specific Examples

```
✨ feat(tasks): add Star Rating machine coding challenge to SDE-1 track 🚀
🐛 fix(ai): replace non-existent gemini-3.6-flash with gemini-2.0-flash models 🩹
🔒 security(api): add Firebase Admin verifyIdToken middleware to progress route 🛡️
⚡ perf(profiler): move ProfilerProvider to studio layout scope only 📦
♻️ refactor(auth): split AuthContext god context into useAuthState and useModal ♻️
📝 docs(skills): add security-audit and api-route-builder skills to .agents 📋
🗑️ remove(dx): uninstall unused @reduxjs/toolkit and react-redux packages ❌
🎨 style(ui): add ambient glow blobs to studio layout with amber and indigo orbs 💄
🔧 chore(db): switch MongoDB connection to direct seedlist format to bypass SRV DNS 🔧
🚑 hotfix(auth): fix fabricated 200 OK response in auth sync catch block 🔥
✨ feat(ai): implement streaming response in /api/gemini using ReadableStream 🚀
⚡ perf(tasks): pass single project prop from RSC to DynamicTaskClient to avoid 94kb bundle 📦
🔒 security(security): add Content-Security-Policy and HSTS headers to next.config.ts 🛡️
♻️ refactor(theme): remove dead light-mode infrastructure and prune ThemeContext toggle 🔁
✨ feat(api): wire /api/user/profile GET endpoint to MongoDB user lookup by uid 🚀
📝 docs(report): generate deep-dive Project_Report.md with security and arch analysis 📋
🔧 chore(skills): scaffold five agent skills for auth, ai, api, perf, and security 📋
```

---

## ⚡ Quick Decision Tree

```
What changed?
├── New task in learningProjects.ts or new route?  →  ✨ feat(tasks)
├── AI route, drawer, or greeting logic?           →  ✨ feat(ai) / 🐛 fix(ai)
├── Auth modal, Firebase, MongoDB sync?            →  ✨ feat(auth) / 🐛 fix(auth)
├── API route under src/app/api/?                  →  ✨ feat(api) / 🐛 fix(api)
├── Credentials, headers, token verification?      →  🔒 security(security)
├── Tailwind, globals.css, animations?             →  🎨 style(ui)
├── Context split, component decomposition?        →  ♻️ refactor(auth|ai|perf)
├── Remove unused dep or dead code?               →  🗑️ remove(dx)
├── Bundle size, lazy loading, rAF fix?            →  ⚡ perf(perf|profiler|tasks)
├── SKILL.md, AGENTS.md, README, report?          →  📝 docs(skills|seo)
└── package.json, tsconfig, eslint?               →  🔧 chore(dx)
```
