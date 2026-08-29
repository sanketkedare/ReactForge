---
name: case-study-updater
description: >-
  Pre-commit gate that automatically audits and updates the ReactForge Case Study
  (src/app/case-study/page.tsx) before any git commit or push is executed. Scans
  recent git commits, identifies unrecorded commits or session work, updates the
  MASTER_COMMITS matrix, release milestones, and architecture metrics, and validates
  with npx tsc --noEmit before committing.
---

# 📋 ReactForge — Case Study Pre-Commit Audit & Updater

This skill defines the mandatory workflow to execute **BEFORE committing or pushing changes** to git when instructed by the user.

---

## 🎯 Purpose & Workflow Triggers

Activates whenever the user issues any git write directive:
- *"commit changes"*, *"commit and push"*, *"push to repo"*, *"save to git"*, *"make a commit"*

Before running `git commit` or `git push`, you MUST ensure the official Case Study at [`src/app/case-study/page.tsx`](file:///d:/Developer_2.0/React-Tasks/src/app/case-study/page.tsx) is completely synchronized with the latest codebase history.

---

## 🛠️ Step-by-Step Execution Protocol

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CASE STUDY PRE-COMMIT WORKFLOW                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Scan Git History & Untracked Commits:                                    │
│    • Run: git log -n 10 --pretty=format:"%h | %ad | %s" --date=short       │
│    • Compare recent commit SHAs with MASTER_COMMITS in case-study/page.tsx  │
│                                                                             │
│ 2. Scan Working Tree & Staged Changes:                                      │
│    • Run: git status -s and git diff --stat                                 │
│    • Inventory all modified schemas, API routes, components, and fixes     │
│                                                                             │
│ 3. Update src/app/case-study/page.tsx:                                      │
│    • Add missing historical commits or current release wave to              │
│      MASTER_COMMITS array                                                   │
│    • Populate: hash, date, author, subject, phase, category, impact,        │
│      description, additions, deletions, keyChanges                          │
│    • Synchronize RELEASE_VERSIONS, metrics, and architecture diagrams       │
│                                                                             │
│ 4. Type Safety Verification:                                                │
│    • Run: npx tsc --noEmit                                                  │
│    • Ensure 0 errors across entire workspace                                │
│                                                                             │
│ 5. Stage & Commit (Per Rule 9 Explicit Request Only):                       │
│    • Stage updated case study alongside other files                         │
│    • Generate single-line stylish commit message per stylish-commit-message │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 `MASTER_COMMITS` Entry Schema Reference

When appending or updating an entry in `src/app/case-study/page.tsx`:

```typescript
{
  hash: "latest" | "<commit-sha>",
  date: "Aug 29, 2026", // Current formatted date
  author: "sanketkedare",
  subject: "🛡️ Server-side MongoDB AI rate limiting, email audit & admin command center",
  phase: "Enterprise Security", // "Genesis" | "ReactForge 2.0" | "Enterprise Security"
  tag: "v2.5.0", // Optional semantic version tag
  category: "Security", // "Architecture" | "AI" | "Security" | "Auth" | "Curriculum" | "DevOps"
  impact: "Critical", // "Critical" | "Major" | "Standard"
  description: "Exhaustive explanation of why this change was architected and what problem it solves.",
  additions: 3120,
  deletions: 480,
  keyChanges: [
    "Key deliverable 1",
    "Key deliverable 2",
    "Key deliverable 3",
  ],
}
```

---

## 🔒 Safety Gates & Rules

1. **Rule 9 (Git Gate)**: NEVER run `git commit` or `git push` autonomously unless the user explicitly commands a commit in that turn.
2. **Rule 8 (Build Gate)**: NEVER run `npm run build` or `next build` during this process. Use `npx tsc --noEmit` exclusively for validation.
3. **Live Link Integrity**: Ensure `reactforge.sanketkedare.com` and `sanketkedare/ReactForge` links remain valid across all headers and footers.
