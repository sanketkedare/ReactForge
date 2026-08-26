<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# React Machine Coding Hub — Project Rules & Guidelines

1. **Core Purpose**: Frontend Developer Practice Lab & Machine Coding Interview Round Preparation. 100 practical hands-on React tasks.
2. **Port Restriction**: This project runs ONLY on port 3002 (`next dev --port 3002` / `next start --port 3002`).
3. **Theme**: Permanent Dark Mode Only (`#07090e`, amber/gold accents, glassmorphism). No theme toggle.
4. **Browser Subagent Policy**: Do NOT open the browser subagent for visual verification on routine turns unless explicitly requested by the user. Rely on terminal validation (`npx tsc --noEmit`, `npm run build`) and file checks.
5. **Interview Round Tracks (100 Tasks Total)**:
   - 🟢 **Round 1: SDE-1 / Junior (40 Tasks, 15–30m)**: Password Gen, Todo List, Tic-Tac-Toe, Calculator, Star Rating, Image Slider, User Profile, Drag Ball, OTP 6-Digit Box, Modal Dialog, Accordion, Stopwatch/Timer, React Quiz App, Counter with Step, Color Contrast, Tabs, Tooltip, Digital Clock, Heart Burst, Word Counter, BMI Calculator, Currency Converter, Rock Paper Scissors, Memory Game, Theme Context, Sidebar, Toast Notifications, Clipboard Vault, Password Strength, Cart Counter, Progress Bar, Chip Tags, Mobile Drawer, Expense Tracker, Quote Generator, Color Generator, Flip Card, Sticky Notes, Poll Widget, Input Masking.
   - 🟡 **Round 2: SDE-2 / Mid-Level (35 Tasks, 30–45m)**: Fetch Posts REST API, Custom useDebounce/useThrottle, Diwali Lights, Gift Shuffler, Nested Comment Section, Autocomplete Typeahead, Infinite Scroll, Multi-Step Form, Drag & Drop File Uploader, Kanban DnD, Audio Player, Video Player, Paginated Table, useLocalStorage, useClickOutside, useMediaQuery, useFetch, useIntersectionObserver, Dynamic Breadcrumbs, Canvas Starfield, Markdown Previewer, Tree File Explorer, Transfer List, Image Cropper, Date Range Picker, Swipe Carousel, Virtualized Combobox, Weather Dashboard, GitHub Search, Crypto Ticker, Dynamic Form Builder, Half-Star Rating, Multi-Select Dropdown, Milestones Timeline, QR Generator.
   - 🟣 **Round 3: Senior / System Design (25 Tasks, 50–60m)**: 100k Virtual Kanban, Profiler Lab, Event Pipeline, Multi-Tab Sync, State Battleground, Query Inspector, Undo/Redo (`useHistory`), Virtual Windowed Table (10k Rows), Virtual 2D Masonry, Web Worker Computation, Concurrency Playground, Optimistic Rollback Engine, Infinite Canvas, Whiteboard Canvas, Resizable Split Pane, WYSIWYG Editor, Code Editor AST, Command Palette Engine, Mini Spreadsheet Formula, Offline Sync Queue, Audio Equalizer FFT, Module Federation, Design System Playground, Real-Time WebSocket Chat, Web Vitals Live Monitor.
6. **Task Headers**:
   - Use `<ProjectHeader>` on all project pages.
7. **Layout**:
   - Centered container width (`w-[92%] lg:w-[80%] mx-auto`).
