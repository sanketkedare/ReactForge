"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  GitCommit,
  Layers,
  Sparkles,
  Shield,
  Bot,
  Database,
  Cpu,
  Terminal,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
  Flame,
  Award,
  Lock,
  Mail,
  Server,
  TrendingUp,
  Search,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  Compass,
  Workflow,
  ArrowUpRight,
  Boxes,
  Globe,
  Share2,
  BarChart3,
  Clock,
  ChevronDown,
  Hash,
  Copy,
  FolderGit2,
  Milestone,
  CheckCheck,
  AlertTriangle,
  Lightbulb,
  Radio,
  Sliders,
  Maximize2,
  ArrowLeftRight,
  Activity,
  Play,
  RotateCcw,
  Network,
  RefreshCw,
  GitBranch,
  Quote,
  FileCode,
  Laptop,
  CheckCircle,
} from "lucide-react";
import { SiJavascript, SiReact, SiNextdotjs, SiMongodb, SiFirebase, SiTailwindcss } from "react-icons/si";
import GlobalFooter from "@/components/common/GlobalFooter";

// Scanned Master Git Commits
interface GitCommitItem {
  hash: string;
  date: string;
  author: string;
  subject: string;
  phase: "Genesis" | "ReactForge 2.0" | "Enterprise Security";
  tag?: string;
  category: "Architecture" | "AI" | "Security" | "Auth" | "Curriculum" | "DevOps";
  impact: "Critical" | "Major" | "Standard";
  description: string;
  additions: number;
  deletions: number;
  keyChanges: string[];
}

const MASTER_COMMITS: GitCommitItem[] = [
  {
    hash: "fc29f76",
    date: "Oct 15, 2024",
    author: "Sanket Kedare",
    subject: "Initial repository setup and foundational Next.js architecture",
    phase: "Genesis",
    tag: "v0.1.0",
    category: "Architecture",
    impact: "Major",
    description: "Scaffolded Next.js App Router repository with Tailwind CSS, base configuration, and foundational folder layout for interactive widgets.",
    additions: 420,
    deletions: 0,
    keyChanges: ["Next.js App Router boilerplate", "Tailwind CSS dark mode styling", "Global layout structure"],
  },
  {
    hash: "93d7cd8",
    date: "Oct 15, 2024",
    author: "Sanket Kedare",
    subject: "Integrate Framer Motion for smooth physics & UI animations",
    phase: "Genesis",
    category: "Architecture",
    impact: "Standard",
    description: "Added Framer Motion animation engine across all prototype views to enable spring physics and micro-interactions.",
    additions: 180,
    deletions: 24,
    keyChanges: ["Framer Motion animation wrappers", "Spring scale hover states", "Accordion ease transitions"],
  },
  {
    hash: "7666fae",
    date: "Oct 22, 2024",
    author: "Sanket Kedare",
    subject: "Add foundational challenges: Password Generator & Todo List",
    phase: "Genesis",
    category: "Curriculum",
    impact: "Standard",
    description: "Created first 2 interview problems testing state management, clipboard APIs, and DOM list manipulation.",
    additions: 390,
    deletions: 12,
    keyChanges: ["Password entropy calculation", "Stateful CRUD task list", "Clipboard copy feedback"],
  },
  {
    hash: "c3c0ea5",
    date: "Oct 26, 2024",
    author: "Sanket Kedare",
    subject: "Add Tic-Tac-Toe with win detection & move history time-travel",
    phase: "Genesis",
    category: "Curriculum",
    impact: "Standard",
    description: "Built classic 2-player Tic-Tac-Toe demonstrating array state immutability and step rewind history.",
    additions: 240,
    deletions: 8,
    keyChanges: ["Win condition algorithm", "Time-travel history stack", "Square highlight matrix"],
  },
  {
    hash: "99561c0",
    date: "Oct 28, 2024",
    author: "Sanket Kedare",
    subject: "Enforce atomic component modularity standards",
    phase: "Genesis",
    category: "Architecture",
    impact: "Major",
    description: "Refactored codebase to isolate widget state and decouple presentation components from logic hooks.",
    additions: 310,
    deletions: 195,
    keyChanges: ["Atomic component folder layout", "Isolated sub-hooks", "Shared UI button components"],
  },
  {
    hash: "6e7855c",
    date: "Nov 02, 2024",
    author: "Sanket Kedare",
    subject: "Add Diwali Lights with customizable speed intervals",
    phase: "Genesis",
    category: "Curriculum",
    impact: "Standard",
    description: "Interactive festive lights animation engine utilizing setInterval lifecycles and CSS keyframes.",
    additions: 290,
    deletions: 14,
    keyChanges: ["setInterval timer lifecycle", "CSS Keyframe dynamic transitions", "Color pattern sequencing"],
  },
  {
    hash: "39757f2",
    date: "Nov 03, 2024",
    author: "Sanket Kedare",
    subject: "Implement Theme Context with LocalStorage caching",
    phase: "Genesis",
    category: "Architecture",
    impact: "Standard",
    description: "Created root-level ThemeContext for persistent dark/light palette toggling.",
    additions: 145,
    deletions: 22,
    keyChanges: ["ThemeContext Provider", "LocalStorage cache sync", "Smooth CSS background transitions"],
  },
  {
    hash: "b4e3ff0",
    date: "Nov 10, 2024",
    author: "Sanket Kedare",
    subject: "Add responsive Image Slider with touch swipe & autoplay",
    phase: "Genesis",
    category: "Curriculum",
    impact: "Standard",
    description: "Built responsive carousel supporting touch swipe gestures, auto-advancing timers, and thumbnail previews.",
    additions: 260,
    deletions: 10,
    keyChanges: ["Touch swipe physics", "Hover pause auto-rotation", "Thumbnail indicator strip"],
  },
  {
    hash: "08f3d21",
    date: "Nov 11, 2024",
    author: "Sanket Kedare",
    subject: "SEO Optimization & Google Search Console indexing setup",
    phase: "Genesis",
    category: "DevOps",
    impact: "Standard",
    description: "Generated dynamic sitemap.xml, robots.txt, and submitted domain verification for Google search indexing.",
    additions: 85,
    deletions: 5,
    keyChanges: ["Google Search Console verification", "Sitemap generator script", "Metadata tags"],
  },
  {
    hash: "ff813b2",
    date: "Nov 30, 2024",
    author: "Sanket Kedare",
    subject: "Add Drag the Ball 2D physics sandbox with collision",
    phase: "Genesis",
    tag: "v0.5.0",
    category: "Curriculum",
    impact: "Standard",
    description: "Interactive physics workbench implementing pointer event math, velocity dampening, and boundary clamping.",
    additions: 215,
    deletions: 12,
    keyChanges: ["Pointer coordinates calculation", "Boundary box clamping", "Velocity deceleration"],
  },
  {
    hash: "4607746",
    date: "Aug 26, 2026",
    author: "sanketkedare",
    subject: "✨ Add 100-task curriculum, Gemini 2.0 AI coach & code explorer",
    phase: "ReactForge 2.0",
    tag: "v2.0.0",
    category: "AI",
    impact: "Critical",
    description: "Quantum leap milestone: Scaled platform to 100 categorized tasks across Junior, Mid, and Senior tracks. Embedded Gemini 2.0 Flash AI Interview Coach and Dynamic Code Explorer.",
    additions: 5420,
    deletions: 890,
    keyChanges: [
      "100 machine coding challenges structured for FAANG interviews",
      "SDE-1 (40), SDE-2 (35), Senior System Design (25)",
      "Gemini 2.0 Flash AI Interview Coach with live hints and evaluation",
      "Dynamic Code Inspector extracting source code directly from filesystem",
    ],
  },
  {
    hash: "a436695",
    date: "Aug 26, 2026",
    author: "sanketkedare",
    subject: "✨ Rebrand to ReactForge with Obsidian Dark telemetry design",
    phase: "ReactForge 2.0",
    category: "Architecture",
    impact: "Major",
    description: "Rebranded from React-Tasks to ReactForge — Frontend Developer Practice Lab & System Design Hub with an Obsidian Dark aesthetic.",
    additions: 680,
    deletions: 340,
    keyChanges: ["Custom SVG logo & branding iconography", "Obsidian Dark (#07090e) theme system", "Gold/amber telemetry accents"],
  },
  {
    hash: "80534ec",
    date: "Aug 27, 2026",
    author: "sanketkedare",
    subject: "✨ Production SEO engine, JSON-LD schemas & Error Boundaries",
    phase: "ReactForge 2.0",
    category: "Architecture",
    impact: "Major",
    description: "Implemented enterprise SEO architecture, structured JSON-LD schemas, OpenGraph preview cards, and nested Error Boundaries.",
    additions: 490,
    deletions: 60,
    keyChanges: ["Dynamic metadata generator per task route", "Global error.tsx & not-found.tsx fallback boundaries", "OpenGraph dynamic social cards"],
  },
  {
    hash: "87d65bd",
    date: "Aug 27, 2026",
    author: "sanketkedare",
    subject: "🔧 Automated CI pipeline & SWC production console stripping",
    phase: "ReactForge 2.0",
    category: "DevOps",
    impact: "Standard",
    description: "Configured GitHub Actions CI pipeline on PRs and enabled SWC compiler console log stripping in production bundles.",
    additions: 110,
    deletions: 15,
    keyChanges: ["GitHub Actions build & test workflow", "next.config.ts compiler console removal", "Bundle size audit check"],
  },
  {
    hash: "ccf5a3b",
    date: "Aug 27, 2026",
    author: "sanketkedare",
    subject: "✨ Dual Firebase/MongoDB Auth, developer onboarding & welcome emails",
    phase: "ReactForge 2.0",
    tag: "v2.1.0",
    category: "Auth",
    impact: "Critical",
    description: "Built full user identity layer: Firebase Client Auth synchronized with MongoDB Atlas, 3-step developer onboarding, and Dark Theme Welcome Email SMTP delivery.",
    additions: 1840,
    deletions: 210,
    keyChanges: [
      "Dual auth architecture: Firebase Auth + MongoDB User schema sync",
      "3-step Developer Onboarding Modal (Role, Experience, Focus)",
      "Dark-themed HTML Welcome Email pipeline via Nodemailer SMTP",
      "Persistent XP, streak calculation, and task bookmarking",
    ],
  },
  {
    hash: "de0d0c9",
    date: "Aug 29, 2026",
    author: "sanketkedare",
    subject: "📝 Scaffold 6 custom agent skills & enforce AGENTS.md safety gates",
    phase: "Enterprise Security",
    category: "DevOps",
    impact: "Major",
    description: "Scaffolded 6 custom autonomous agent skills under .agents/skills/, enforced strict build & git gates in AGENTS.md, and compiled Project_Report.md.",
    additions: 1250,
    deletions: 45,
    keyChanges: [
      "6 Agent Skills (task-builder, auth-and-state, ai-integration, api-route-builder, security-audit, performance)",
      "Rule 8 (No unrequested builds) & Rule 9 (No unrequested commits) safety gates",
      "Comprehensive architectural audit",
    ],
  },
  {
    hash: "latest",
    date: "Aug 29, 2026",
    author: "sanketkedare",
    subject: "🛡️ Server-side MongoDB AI rate limiting, email audit & admin command center",
    phase: "Enterprise Security",
    tag: "v2.5.0",
    category: "Security",
    impact: "Critical",
    description: "Enterprise hardening: Anti-tamper 100 msgs/day server-side AI quota in MongoDB, FailedEmail audit collection with 1-click retry, and full-screen modular /admin Command Center.",
    additions: 3120,
    deletions: 480,
    keyChanges: [
      "Server-enforced AI rate limiter (100 msgs/day user, 3/IP guest) replacing client storage",
      "FailedEmail audit schema with error stack trace capture & automated SMTP retry",
      "Multi-route Admin Command Center (/admin, /users, /ai, /curriculum, /emails, /system)",
      "4-Layer Security Gate (verifyAdminRequest, HTTP Security Headers, Route Guards)",
    ],
  },
];

export default function FullWidthCaseStudyPage() {
  const [activeSection, setActiveSection] = useState<string>("executive-summary");
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>("all");
  const [commitSearch, setCommitSearch] = useState<string>("");
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>("latest");
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const sections = useMemo(
    () => [
      { id: "executive-summary", label: "Executive Summary", icon: Award },
      { id: "evolution-eras", label: "3 Evolution Eras", icon: Workflow },
      { id: "system-architecture", label: "Full-Stack Architecture", icon: Cpu },
      { id: "breakthroughs", label: "Key Technical Challenges", icon: Zap },
      { id: "git-commits", label: "Git Commits Audit (42+)", icon: GitCommit },
      { id: "adrs-takeaways", label: "Architectural Decisions", icon: Shield },
    ],
    []
  );

  // Automatically detect and reflect active section as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for sticky navbar
      const sectionElements = sections.map((sec) => ({
        id: sec.id,
        element: document.getElementById(sec.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.element) {
          const top = item.element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger initial position check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const filteredCommits = useMemo(() => {
    return MASTER_COMMITS.filter((c) => {
      const matchesPhase = selectedPhaseFilter === "all" || c.phase === selectedPhaseFilter;
      const matchesSearch =
        c.subject.toLowerCase().includes(commitSearch.toLowerCase()) ||
        c.hash.toLowerCase().includes(commitSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(commitSearch.toLowerCase());
      return matchesPhase && matchesSearch;
    });
  }, [selectedPhaseFilter, commitSearch]);

  const copySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#030508] text-slate-200 selection:bg-amber-500/30 selection:text-amber-200 font-sans antialiased">
      {/* Full-Bleed Ambient Background Grid & Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(245, 158, 11, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(245, 158, 11, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* Persistent Large Watermark Icon in Body Canvas */}
      <div className="fixed bottom-12 right-12 w-[380px] h-[380px] pointer-events-none opacity-[0.035] select-none z-0">
        <Image
          src="/ReactForge_Icon.png"
          alt="ReactForge Ambient Watermark"
          width={400}
          height={400}
          className="w-full h-full object-contain"
        />
      </div>

      {/* ========================================================================= */}
      {/* TOP FULL-WIDTH HERO BANNER */}
      {/* ========================================================================= */}
      <header className="w-full border-b border-slate-800/80 bg-gradient-to-b from-[#090d16] via-[#05070a] to-[#030508] px-4 sm:px-8 lg:px-12 xl:px-16 py-12 lg:py-16 relative overflow-hidden">
        {/* Ambient Glows & Huge ReactForge Hero Icon in Background */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute top-4 right-8 lg:right-24 w-[360px] h-[360px] lg:w-[460px] lg:h-[460px] pointer-events-none opacity-[0.07] select-none">
          <Image
            src="/ReactForge_Icon.png"
            alt="ReactForge Hero Watermark"
            width={500}
            height={500}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_90px_rgba(245,158,11,0.5)]"
          />
        </div>

        <div className="w-full max-w-[1920px] mx-auto space-y-8 relative z-10">
          {/* Breadcrumb & Logo in Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 p-2 flex items-center justify-center shadow-xl shadow-amber-500/10 group-hover:scale-105 transition-all">
                <Image
                  src="/ReactForge_Icon.png"
                  alt="ReactForge Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white tracking-tight">
                    React<span className="text-amber-400">Forge</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                    v2.5
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Frontend Machine Coding Hub</span>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <a
                href="https://reactforge.sanketkedare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/10 group"
                title="Visit Live ReactForge Production Application"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live: reactforge.sanketkedare.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 -translate-y-0.5 transition-transform" />
              </a>

              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL ARCHITECTURE REPORT</span>
              </span>
            </div>
          </div>

          {/* Massive Case Study Headline */}
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.05]">
              Building <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">ReactForge</span>: The 100-Task Machine Coding Platform
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed">
              How a weekend prototype of 10 classic React widgets evolved across 22 months into an enterprise frontend engineering lab with <strong>100 categorized tasks</strong>, real-time <strong>Gemini 2.0 Flash AI coaching</strong>, <strong>anti-tamper MongoDB rate limiting</strong>, and a full-screen <strong>Admin Command Center</strong>.
            </p>
          </div>

          {/* Author, Date & Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 border-t border-slate-800/80 text-xs">
            <div className="p-4 rounded-2xl bg-[#080b11] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">LEAD ARCHITECT</span>
              <a
                href="https://www.sanketkedare.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>Sanket Kedare</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b11] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">TIMEFRAME</span>
              <span className="font-bold text-white block">Oct 2024 → Aug 2026</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b11] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">CURRICULUM</span>
              <span className="font-bold text-amber-400 block">100 Challenges (3 Tracks)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b11] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">AI ENGINE</span>
              <span className="font-bold text-cyan-400 block">Gemini 2.0 Flash (100/day)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b11] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">PERSISTENCE</span>
              <span className="font-bold text-emerald-400 block">MongoDB Atlas + Dexie</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b11] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">TYPE SAFETY</span>
              <span className="font-bold text-purple-400 block">100% Strict TypeScript</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FULL-WIDTH DOCK / STICKY CHAPTER NAVIGATOR */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-40 w-full bg-[#07090e]/95 backdrop-blur-2xl border-b border-slate-800/90 px-4 sm:px-8 lg:px-12 xl:px-16 py-3">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(sec.id);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 75;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                    setActiveSection(sec.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                  <span>{sec.label}</span>
                </a>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-4 text-xs font-mono text-slate-400">
            <a
              href="https://reactforge.sanketkedare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>reactforge.sanketkedare.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/sanketkedare/ReactForge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MAIN FULL-WIDTH HIGH-DENSITY CONTENT CANVAS */}
      {/* ========================================================================= */}
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 space-y-24 max-w-[1920px] mx-auto">
        {/* ========================================================================= */}
        {/* SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT */}
        {/* ========================================================================= */}
        <section id="executive-summary" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Chapter 1</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Executive Summary & The Problem Statement
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 text-sm text-slate-300 leading-relaxed font-light">
              <p className="text-base sm:text-lg text-slate-200 font-normal">
                Frontend interviews at top tier technology organizations have radically shifted away from trivia and generic LeetCode algorithms. Today, candidates are assessed in intensive <strong>45–60 minute live machine coding rounds</strong> where they must architect production-grade UI components, handle asynchronous lifecycles, enforce memory virtualization, and prevent re-render bottlenecks.
              </p>

              <p>
                Most existing learning materials are passive video tutorials with zero interactive evaluation. <strong>ReactForge</strong> was engineered from the ground up as an immersive, dark-mode machine coding laboratory providing <strong>100 practical challenges</strong> spanning Junior SDE-1, Mid SDE-2, and Senior System Design tiers.
              </p>

              <div className="p-6 rounded-3xl bg-[#080b11] border border-amber-500/30 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Quote className="w-4 h-4" />
                  <span>The Core ReactForge Philosophy</span>
                </div>
                <p className="text-xs text-slate-300 italic">
                  &ldquo;Learn React by building, not by watching. Every single challenge must provide interactive state manipulation, strict evaluation criteria, real-time AI architectural feedback, and clean reference source code.&rdquo;
                </p>
              </div>
            </div>

            {/* Side Highlights Card */}
            <div className="p-6 rounded-3xl bg-[#080b11] border border-slate-800 space-y-5 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">KEY PLATFORM HIGHLIGHTS</span>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block">🟢 ROUND 1: SDE-1 (40 TASKS)</span>
                    <span className="text-xs text-white font-medium">State, Props, Forms, Timers, Layouts</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">🟡 ROUND 2: SDE-2 (35 TASKS)</span>
                    <span className="text-xs text-white font-medium">Custom Hooks, Async APIs, DnD, Debounce</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-purple-400 font-mono font-bold block">🟣 ROUND 3: SENIOR (25 TASKS)</span>
                    <span className="text-xs text-white font-medium">10k Virtualization, AST, Concurrency, State Battles</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Total Challenges:</span>
                <span className="text-amber-400 font-black">100 Tasks Complete</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: 3 MAJOR EVOLUTION ERAS */}
        {/* ========================================================================= */}
        <section id="evolution-eras" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Chapter 2</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              The 3 Major Engineering Eras (2024 → 2026)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Era 1 */}
            <div className="p-8 rounded-3xl bg-[#080b11] border border-slate-800/90 space-y-6 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40">
                    ERA 1 (OCT – NOV 2024)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">v0.1 → v0.5</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">The Genesis Prototype</h3>
                  <span className="text-xs text-slate-500 font-mono">Component Practice Sandbox</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Started as an experimental weekend sandbox to practice classic React interview problems (Password Generator, Diwali Lights, Todo List, Calculator). Focused on mastering basic React hooks (`useState`, `useEffect`) and Framer Motion transitions.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>10 foundational widgets with Framer Motion</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>LocalStorage theme & state persistence</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Google Search Console indexing setup</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Architecture:</span>
                <span className="text-emerald-400">Pure Client SPA (10 Tasks)</span>
              </div>
            </div>

            {/* Era 2 */}
            <div className="p-8 rounded-3xl bg-[#080b11] border border-slate-800/90 space-y-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40">
                    ERA 2 (AUGUST 2026)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">v2.0 → v2.1</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">ReactForge 2.0 Quantum Leap</h3>
                  <span className="text-xs text-slate-500 font-mono">100-Task Hub & AI Coach</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete platform re-architecture. Rebranded to <strong>ReactForge</strong>. Expanded curriculum to 100 tasks across 3 career tracks. Introduced Gemini 2.0 AI Interview Coach, Dynamic Code Explorer, and Firebase + MongoDB Auth.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>100-Task Matrix: SDE-1 (40), SDE-2 (35), Senior (25)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Gemini 2.0 Flash AI Interview Coach Drawer</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Developer onboarding modal & welcome emails</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Architecture:</span>
                <span className="text-cyan-400">Full-Stack Hub (100 Tasks)</span>
              </div>
            </div>

            {/* Era 3 */}
            <div className="p-8 rounded-3xl bg-[#080b11] border border-amber-500/40 space-y-6 flex flex-col justify-between shadow-2xl shadow-amber-500/5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/40">
                    ERA 3 (PRESENT)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">v2.5 Enterprise</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Governance & Admin Hub</h3>
                  <span className="text-xs text-slate-500 font-mono">Security & Cluster Ops</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Enterprise-grade platform hardening: Server-side MongoDB AI rate limiting (100 msgs/day), `FailedEmail` failure auditing, and a dedicated multi-page `/admin` Command Center.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Server-enforced AI limits (100 user / 3 guest)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Failed email capture & 1-click SMTP resend</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Full-Screen `/admin` Control Center with live telemetry</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs font-mono text-amber-400 font-bold flex items-center justify-between">
                <span>Architecture:</span>
                <span>Enterprise Governance (100 Tasks)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: SYSTEM ARCHITECTURE & FULL-STACK DATA PIPELINE */}
        {/* ========================================================================= */}
        <section id="system-architecture" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Chapter 3</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Full-Stack Architecture & Data Pipeline
            </h2>
          </div>

          {/* Large Architectural Dataflow Board */}
          <div className="p-8 rounded-3xl bg-[#080b11] border border-slate-800 font-mono text-xs space-y-6 shadow-2xl">
            <div className="flex items-center justify-between text-slate-500 pb-3 border-b border-slate-800/80">
              <span className="font-bold text-slate-300">REQUEST LIFECYCLE & SECURITY TOPOLOGY</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE 0-ERROR PIPELINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">1. Edge Client Tier</span>
                <div className="font-bold text-white text-base">Next.js 16 + React 19</div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Server Components (RSC) for metadata/SEO + Client Island Boundaries with Dexie.js IndexedDB offline cache.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">2. Security Gate</span>
                <div className="font-bold text-white text-base">4-Layer Guard</div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  HTTP Security Headers, Route Guards, and `verifyAdminRequest` validating caller UID/email against MongoDB Atlas.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase block">3. AI Engine</span>
                <div className="font-bold text-white text-base">Gemini 2.0 Flash</div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Multi-model fallback chain with server-side token quota enforcer (100 msgs/day user, 3/IP guest).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">4. Persistence</span>
                <div className="font-bold text-white text-base">MongoDB Atlas Cluster</div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Mongoose 9 schemas: Users, GuestUsage, FailedEmail audit logs, and XP Leaderboard calculations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: KEY TECHNICAL CHALLENGES & BREAKTHROUGHS */}
        {/* ========================================================================= */}
        <section id="breakthroughs" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Chapter 4</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Key Technical Challenges & Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Challenge 1 */}
            <div className="p-6 rounded-3xl bg-[#080b11] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">1. Anti-Tamper AI Rate Limiting</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                <strong>Challenge:</strong> Client-side LocalStorage quotas could be easily cleared by users in DevTools, leading to unlimited LLM token consumption.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-900 pt-2">
                <strong>Solution:</strong> Enforced strict server-side tracking directly in MongoDB inside `/api/gemini` with date-keyed counters (`YYYY-MM-DD`). Rejections return HTTP 429 immediately.
              </p>
            </div>

            {/* Challenge 2 */}
            <div className="p-6 rounded-3xl bg-[#080b11] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">2. Dev Server Prefetch Restraint</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                <strong>Challenge:</strong> Rendering 100 dynamic task links in the curriculum grid caused Next.js to fire 100 parallel prefetch compilations simultaneously, thrashing the Node dev server.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-900 pt-2">
                <strong>Solution:</strong> Configured explicit `prefetch=&#123;false&#125;` on all large link collections, preventing unrequested background fetches until user clicks.
              </p>
            </div>

            {/* Challenge 3 */}
            <div className="p-6 rounded-3xl bg-[#080b11] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">3. Deterministic SSR Hydration</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                <strong>Challenge:</strong> Inline evaluation of `Date.now()` during SSR produced different timestamp strings on server vs browser hydration, triggering React warnings.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-900 pt-2">
                <strong>Solution:</strong> Cleaned all dynamic timestamps out of SSR bodies and applied `suppressHydrationWarning` on component inspector snapshots.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: COMPLETE AUDITED GIT COMMIT LOG */}
        {/* ========================================================================= */}
        <section id="git-commits" className="space-y-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Chapter 5</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Audited Git Commit Log & Release Waves
              </h2>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {["all", "Genesis", "ReactForge 2.0", "Enterprise Security"].map((phase) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhaseFilter(phase)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedPhaseFilter === phase
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {phase === "all" ? "All Commits" : phase}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={commitSearch}
              onChange={(e) => setCommitSearch(e.target.value)}
              placeholder="Search by commit message, hash, or implementation detail..."
              className="w-full pl-11 pr-4 py-3 bg-[#080b11] border border-slate-800 rounded-2xl text-white text-xs focus:border-amber-500 focus:outline-none shadow-inner"
            />
          </div>

          {/* Commit Matrix List */}
          <div className="space-y-3">
            {filteredCommits.map((c) => {
              const isExpanded = expandedCommitSha === c.hash;
              return (
                <div
                  key={c.hash}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? "bg-[#0b0f17] border-amber-500/40 shadow-xl shadow-amber-500/5"
                      : "bg-[#080b11] border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* Row Header */}
                  <div
                    onClick={() => setExpandedCommitSha(isExpanded ? null : c.hash)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copySha(c.hash);
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-mono text-[11px] font-bold flex items-center gap-1 hover:border-amber-500/40 transition-all shrink-0"
                        title="Copy Commit SHA"
                      >
                        <Hash className="w-3 h-3 text-slate-500" />
                        <span>{c.hash}</span>
                        {copiedSha === c.hash && <Check className="w-3 h-3 text-emerald-400" />}
                      </button>

                      <div className="overflow-hidden">
                        <div className="font-bold text-white text-xs truncate hover:text-amber-300 transition-colors">
                          {c.subject}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {c.author} • {c.date} • +{c.additions} / -{c.deletions}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.tag && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hidden sm:inline">
                          {c.tag}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                          c.impact === "Critical"
                            ? "bg-red-500/20 text-red-300 border-red-500/30"
                            : c.impact === "Major"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                      >
                        {c.impact}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Details Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-3 text-xs"
                      >
                        <p className="text-slate-300 leading-relaxed pt-2 font-sans">{c.description}</p>
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                            Key Deliverables & Architectural Milestones:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {c.keyChanges.map((h, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-slate-300 text-xs font-mono"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: ARCHITECTURAL DECISION RECORDS (ADRs) */}
        {/* ========================================================================= */}
        <section id="adrs-takeaways" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Chapter 6</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Architectural Decision Records (ADRs) & Conclusions
            </h2>
          </div>

          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0a0e18] via-[#06080e] to-[#030508] border border-amber-500/30 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span className="font-bold text-sm">ADR-01: Server Quota Enforcement</span>
                </div>
                <p className="text-slate-400">
                  Client storage is fundamentally untrusted. Enforcing quotas on the server with midnight UTC reset timestamps guarantees token budget stability and prevents abuse.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold text-sm">ADR-02: Next.js Prefetch Restraint</span>
                </div>
                <p className="text-slate-400">
                  On data-dense dashboards with 100+ items, disabling automatic link prefetching keeps CPU and network overhead minimal while maintaining instant navigation on click.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold text-sm">ADR-03: Dual Auth Synchronization</span>
                </div>
                <p className="text-slate-400">
                  Pairing client-side Firebase Auth with a backend `/api/auth/sync` route allows frictionless OAuth sign-ins while maintaining complete relational state and role control in MongoDB.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Ready to practice? Solve all 100 machine coding challenges on ReactForge.
              </div>

              <Link
                href="/tasks"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-xl shadow-amber-400/20"
              >
                <span>Launch 100-Task Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
