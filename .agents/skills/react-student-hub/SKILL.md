---
name: react-student-hub
description: Guidelines, conventions, architecture, and interview round tracks for the React Machine Coding Hub repository.
---

# React Machine Coding Hub — Knowledge & Architecture Guide

This skill documents all repository conventions, project tiers, port rules, and architectural standards for `React-Tasks`.

---

## 1. Core Mission & Port Rules
* **Frontend Practice Lab**: 19 practical React tasks ranging from core beginner foundations to high-scale performance benchmarks.
* **Port Rule**: Dev server runs strictly on **Port 3002** (`npm run dev` / `next dev --port 3002`).
* **Theme**: Permanent Dark Mode Only (`#07090e`, glowing ambient orbs, amber/gold accents, frosted glassmorphism). Theme toggle removed.
* **Browser Policy**: Do not launch the browser subagent for visual verification on routine turns unless explicitly requested by the user.

---

## 2. The 3 Tracks (19 Tasks)

### 🟢 Round 1: SDE-1 / Junior (8 Tasks • 30–45 min)
* Password Generator, To-Do List CRUD, Tic-Tac-Toe, Interactive Calculator, Star Rating, Image Slider, User Profile, Drag Ball.

### 🟡 Round 2: SDE-2 / Mid-Level (5 Tasks • 45–60 min)
* Async REST API Post Fetcher, Custom useDebounce & useThrottle Hook, Festive Lights Animator, Gift Shuffler (Fisher-Yates), Nested Comment Tree.

### 🟣 Round 3: Senior & System Design (6 Tasks • 60 min)
* 100k Virtualized Kanban, Re-Render Profiler Lab, High-Frequency Event Oscilloscope, Infinite Tree with Multi-Tab Broadcast Sync, State Shootout, TanStack Query v5 Cache.

---

## 3. UI Layout & Sizing Standards
* **Centered Width**: `w-[92%] lg:w-[80%] mx-auto`.
* **Typography**: Times New Roman / Editorial serif for display headlines and card titles with lightweight sans-serif for secondary copy.
