"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  ArrowRight,
  ArrowDown,
  Clock,
  ArrowUpRight,
  Zap,
  Sparkles,
  Trophy,
  BookOpen,
} from "lucide-react";
import { SiJavascript, SiReact } from "react-icons/si";
import StudioNav from "@/components/studio/StudioNav";
import AIInterviewDrawer from "@/components/ai/AIInterviewDrawer";
import HomeAIChat from "@/components/ai/HomeAIChat";
import GlobalFooter from "@/components/common/GlobalFooter";
import { LEARNING_PROJECTS, StudentLevel, LearningProject } from "@/data/learningProjects";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Counts
const BEGINNER_COUNT = LEARNING_PROJECTS.filter((p) => p.level === "beginner").length;
const INTERMEDIATE_COUNT = LEARNING_PROJECTS.filter((p) => p.level === "intermediate").length;
const ADVANCED_COUNT = LEARNING_PROJECTS.filter((p) => p.level === "expert").length;
const TOTAL_COUNT = LEARNING_PROJECTS.length;

// Harmonized 5-Step Learning Roadmap
const LEARNING_PATH = [
  {
    step: "1",
    phase: "Prerequisite",
    title: "JS Foundations",
    desc: "Variables, Arrays, Functions & DOM",
    icon: <SiJavascript className="w-7 h-7 text-[#F7DF1E]" />,
    isCurrent: false,
    badge: "Prerequisite",
    ringColor: "border-amber-400/40 shadow-amber-500/10",
    badgeColor: "bg-slate-900 text-slate-400 border-slate-700",
  },
  {
    step: "2",
    phase: "Prerequisite",
    title: "ES6+ Syntax",
    desc: "Arrow functions, .map(), Destructuring",
    icon: (
      <div className="relative">
        <SiJavascript className="w-7 h-7 text-[#F7DF1E]" />
        <Zap className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 fill-amber-400" />
      </div>
    ),
    isCurrent: false,
    badge: "Prerequisite",
    ringColor: "border-amber-400/40 shadow-amber-500/10",
    badgeColor: "bg-slate-900 text-slate-400 border-slate-700",
  },
  {
    step: "3",
    phase: "Inside Lab",
    title: "Stage 1: State & UI",
    desc: `${BEGINNER_COUNT} Tasks: Password Gen, Todo, OTP, Modal`,
    icon: <SiReact className="w-7 h-7 text-emerald-400 animate-[spin_12s_linear_infinite]" />,
    isCurrent: true,
    badge: `🟢 Start Here (${BEGINNER_COUNT} Tasks)`,
    ringColor: "border-emerald-400 shadow-emerald-500/30 ring-4 ring-emerald-500/20",
    badgeColor: "bg-emerald-500 text-slate-950 border-emerald-400 font-bold",
  },
  {
    step: "4",
    phase: "Inside Lab",
    title: "Stage 2: APIs & Hooks",
    desc: `${INTERMEDIATE_COUNT} Tasks: Autocomplete, Infinite Scroll, Multi-Step`,
    icon: (
      <div className="relative">
        <SiReact className="w-7 h-7 text-amber-400 animate-[spin_6s_linear_infinite]" />
        <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" />
      </div>
    ),
    isCurrent: false,
    badge: `🟡 Next (${INTERMEDIATE_COUNT} Tasks)`,
    ringColor: "border-amber-500/50 shadow-amber-500/20",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
  },
  {
    step: "5",
    phase: "Inside Lab",
    title: "Stage 3: Architecture",
    desc: `${ADVANCED_COUNT} Tasks: Undo/Redo, Virtual Table, Kanban`,
    icon: <Trophy className="w-7 h-7 text-purple-400" />,
    isCurrent: false,
    badge: `🟣 Mastery (${ADVANCED_COUNT} Tasks)`,
    ringColor: "border-purple-500/50 shadow-purple-500/20",
    badgeColor: "bg-purple-950 text-purple-300 border-purple-800",
  },
];

export default function CleanStudentHomePage() {
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects = useMemo(() => {
    return LEARNING_PROJECTS.filter((item) => {
      const matchesLevel =
        selectedLevel === "all" || item.level === selectedLevel;

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.skills.some((s) => s.toLowerCase().includes(q));

      return matchesLevel && matchesQuery;
    });
  }, [selectedLevel, searchQuery]);

  return (
    <div
      className="min-h-screen w-full bg-[#07090e] text-slate-200 flex flex-col selection:bg-amber-400 selection:text-slate-950 transition-colors duration-300 relative overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
    >
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[170px]" />
      </div>

      <StudioNav />

      <main className="flex-1 w-[92%] lg:w-[80%] mx-auto pt-16 pb-16 flex flex-col relative z-10">
        {/* =========================================================================
            HERO SECTION: Full Viewport Height with Precision Architectural Grid Lines
           ========================================================================= */}
        <section id="hero" className="scroll-mt-28 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center text-center space-y-8 py-12 relative border-b border-slate-800/60 overflow-hidden">
          {/* Architectural Background Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_48%,#000_50%,transparent_100%)]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(245, 158, 11, 0.09) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(245, 158, 11, 0.09) 1px, transparent 1px)
                `,
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          {/* Corner Intersection Crosshairs */}
          <div className="absolute top-6 left-6 font-mono text-xs text-amber-500/30 select-none hidden sm:block">+</div>
          <div className="absolute top-6 right-6 font-mono text-xs text-amber-500/30 select-none hidden sm:block">+</div>
          <div className="absolute bottom-6 left-6 font-mono text-xs text-amber-500/30 select-none hidden sm:block">+</div>
          <div className="absolute bottom-6 right-6 font-mono text-xs text-amber-500/30 select-none hidden sm:block">+</div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-8 max-w-4xl relative z-10"
          >
            {/* Top Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 text-amber-200 text-xs font-sans font-medium shadow-[0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-md"
            >
              <Image
                src="/ReactForge_Icon.png"
                alt="ReactForge"
                width={20}
                height={20}
                className="w-5 h-5 object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              />
              <span className="font-bold text-white">
                React<span className="text-amber-400">Forge</span>
              </span>
              <span className="text-amber-500/80">•</span>
              <span>{TOTAL_COUNT} Machine Coding Challenges</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal text-amber-50 tracking-tight leading-[1.12]">
                Learn React by{" "}
                <span className="italic underline decoration-amber-500/80 underline-offset-[10px]">
                  building
                </span>
                , not by watching.
              </h1>
              <p className="text-base sm:text-xl text-slate-300 font-sans font-light leading-relaxed max-w-2xl mx-auto pt-2">
                Sharpen your skills with hands-on practice. Solve {TOTAL_COUNT} practical React coding tasks with interactive state, real evaluation criteria, and clean source code.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 pt-2 font-sans"
            >
              <Link href="/password-generator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm shadow-xl shadow-amber-400/20 transition-all"
                >
                  <span>🚀 Start Task #1 (Password Generator)</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <Link href="/case-study">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-7 py-4 rounded-full border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50 text-purple-200 text-sm font-semibold transition-all shadow-lg shadow-purple-500/10 backdrop-blur-sm group"
                >
                  <BookOpen className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>Project Case Study 📄</span>
                </motion.button>
              </Link>

              <button
                onClick={() => {
                  const el = document.getElementById("learning-flow");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 96;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="flex items-center gap-2 px-7 py-4 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-all shadow-sm backdrop-blur-sm cursor-pointer"
              >
                <span>View Flowchart ↓</span>
              </button>
            </motion.div>

            {/* Quick Stats Banner with Framing Lines */}
            <motion.div
              variants={itemVariants}
              className="pt-6 w-full max-w-3xl grid grid-cols-3 gap-4 border-t border-b border-slate-800/70 py-6 font-sans relative"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-100">{TOTAL_COUNT}</div>
                <div className="text-xs text-slate-500 font-light mt-0.5">Interactive Projects</div>
              </div>
              <div className="text-center border-x border-slate-800/70">
                <div className="text-2xl sm:text-3xl font-bold text-amber-100">3 Tiers</div>
                <div className="text-xs text-slate-500 font-light mt-0.5">Beginner to Advanced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-100">100%</div>
                <div className="text-xs text-slate-500 font-light mt-0.5">Pure React & TypeScript</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Scroll Indicator Prompt */}
          <div className="pt-4 relative z-10">
            <button
              onClick={() => {
                const el = document.getElementById("learning-flow");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 96;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="text-xs font-sans text-slate-400 hover:text-amber-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Scroll to explore roadmap</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-amber-400" />
            </button>
          </div>
        </section>

        {/* Content Appearing After Scrolling */}
        <div className="space-y-32 pt-20">
          {/* =========================================================================
              SECTION 1: THE LEARNING ROADMAP (Connected Stepper Circuit Pipeline)
             ========================================================================= */}
          <motion.section
            id="learning-flow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-28 w-full space-y-12 pt-6"
          >
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-400">
                ✦ Section 1: Milestone Circuit ✦
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal text-amber-50">
                From JavaScript to Machine Coding Mastery
              </h2>
              <p className="text-xs font-sans text-slate-400 font-light max-w-lg mx-auto">
                Follow this connected progression path: bring your JavaScript foundations and master the 3 in-lab stages across {TOTAL_COUNT} tasks.
              </p>
            </div>

            {/* Stepper Pipeline Architecture */}
            <div className="relative font-sans">
              {/* Connecting Ambient Line (Desktop) */}
              <div className="hidden lg:block absolute top-9 left-[8%] right-[8%] h-1 bg-gradient-to-r from-amber-500/20 via-emerald-400/60 to-purple-500/30 rounded-full z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
                {LEARNING_PATH.map((item) => (
                  <motion.div
                    key={item.step}
                    whileHover={{ y: -8 }}
                    className="flex flex-col items-center text-center space-y-4 group"
                  >
                    {/* Floating Orb Badge */}
                    <div
                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 bg-[#0c1017] flex items-center justify-center relative transition-all duration-300 group-hover:scale-110 ${item.ringColor}`}
                    >
                      {item.icon}

                      {/* Step Number Tag */}
                      <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300 flex items-center justify-center shadow">
                        0{item.step}
                      </span>
                    </div>

                    {/* Pill Status Badge */}
                    <span
                      className={`text-[10px] font-semibold px-3 py-1 rounded-full border shadow-sm ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>

                    {/* Step Description Content */}
                    <div className="space-y-1 px-2">
                      <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
                        {item.phase}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Sub-Indicator */}
                    {item.isCurrent ? (
                      <span className="text-[11px] font-semibold text-emerald-400 pt-1 flex items-center gap-1">
                        <span>Active Stage</span>
                        <span>↓</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600 pt-1 font-mono">
                        {item.step === "1" || item.step === "2" ? "Prerequisite" : "Next Milestone"}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* =========================================================================
              SECTION 2: THE EDUCATIONAL BLUEPRINT (Asymmetrical Architectural Slates)
             ========================================================================= */}
          <motion.section
            id="curriculum"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-28 w-full space-y-10"
          >
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-400">
                ✦ Section 2: Expectations & Prerequisites ✦
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal text-amber-50">
                Everything You Need to Know
              </h2>
              <p className="text-xs font-sans text-slate-400 font-light">
                Transparent requirements and real skills you will build across the {TOTAL_COUNT} tasks.
              </p>
            </div>

            {/* Asymmetrical Curved Slates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Slate 1: Purpose */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                className="p-8 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900/70 to-slate-950/90 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-amber-400/60 transition-all shadow-lg"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-700/50 flex items-center justify-center text-2xl shadow-inner">
                    🎯
                  </div>
                  <h3 className="text-2xl font-normal text-white">
                    The Purpose
                  </h3>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed font-light">
                    To complement concept learning with active coding practice. By solving tasks independently, you develop real muscle memory for handling state, props, and UI events.
                  </p>
                </div>
                <div className="pt-4 border-t border-amber-500/20 text-xs font-sans text-amber-400 font-medium flex items-center justify-between">
                  <span>→ Hands-on practice</span>
                  <span className="font-mono text-[10px]">01</span>
                </div>
              </motion.div>

              {/* Slate 2: Prerequisites */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                className="p-8 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950/90 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-emerald-400/60 transition-all shadow-lg"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-2xl shadow-inner">
                    🌱
                  </div>
                  <h3 className="text-2xl font-normal text-white">
                    Prerequisites
                  </h3>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed font-light">
                    You only need basic <strong>JavaScript ES6</strong> (arrow functions, <code className="bg-slate-800 px-1 py-0.5 rounded text-[11px]">.map()</code>, destructuring) and basic HTML/CSS. You start immediately with Stage 1 tasks!
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-500/20 text-xs font-sans text-emerald-400 font-medium flex items-center justify-between">
                  <span>→ Beginner friendly</span>
                  <span className="font-mono text-[10px]">02</span>
                </div>
              </motion.div>

              {/* Slate 3: Outcomes */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                className="p-8 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900/70 to-slate-950/90 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-purple-400/60 transition-all shadow-lg"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-purple-950/60 border border-purple-700/50 flex items-center justify-center text-2xl shadow-inner">
                    🏆
                  </div>
                  <h3 className="text-2xl font-normal text-white">
                    What You Master
                  </h3>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed font-light">
                    Master immutable state updates, custom hooks (<code className="bg-slate-800 px-1 py-0.5 rounded text-[11px]">useDebounce</code>), async REST calls, virtual lists, and production-ready component patterns.
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-500/20 text-xs font-sans text-purple-400 font-medium flex items-center justify-between">
                  <span>→ Real interview readiness</span>
                  <span className="font-mono text-[10px]">03</span>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* =========================================================================
              SECTION 3: EMBEDDED AI INTERVIEW COACH & PROBLEM SOLVER
             ========================================================================= */}
          <section id="ai-coach" className="scroll-mt-28 w-full space-y-6 pt-4">
            <div className="border-b border-slate-800/80 pb-4">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-400">
                ✦ Section 3: Intelligent Assistant ✦
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal text-amber-50 mt-1">
                AI Interview Coach & Live Advisor
              </h2>
              <p className="text-xs font-sans text-slate-400 mt-1">
                Ask architectural questions, get customized study roadmaps, or practice answering frontend interview curveballs.
              </p>
            </div>

            <HomeAIChat />
          </section>

          {/* =========================================================================
              SECTION 4: FEATURED PRACTICE TASKS PREVIEW
             ========================================================================= */}
          <section id="tasks-directory" className="scroll-mt-28 w-full space-y-8 pt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-400">
                  ✦ Section 4: Featured Curriculum ✦
                </span>
                <h2 className="text-3xl sm:text-4xl font-normal text-amber-50 mt-1">
                  Featured Machine Coding Tasks
                </h2>
                <p className="text-xs font-sans text-slate-400 mt-1">
                  A curated preview of essential interview benchmarks across all 3 tracks.
                </p>
              </div>

              {/* Link to Dedicated Tasks Directory */}
              <Link href="/tasks">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold font-sans shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                >
                  <span>View All {TOTAL_COUNT} Tasks</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* Featured Cards Grid (Showing first 8 curated tasks) */}
            <motion.div
              layout
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {LEARNING_PROJECTS.slice(0, 8).map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CleanProjectCard project={project} number={idx + 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Big Centered "Explore All 100 Projects" Banner CTA */}
            <div className="pt-6 text-center font-sans">
              <Link href="/tasks">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl hover:border-amber-400/70 transition-all group cursor-pointer"
                >
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚀</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        Explore Full Directory ({TOTAL_COUNT} Tasks)
                      </h3>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                        100 Projects
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-light max-w-xl">
                      Browse all {TOTAL_COUNT} tasks with live category filters, difficulty sorting, estimated completion times, and automated test runners.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 group-hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all flex-shrink-0">
                    <span>Open All Tasks Directory</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Professional Studio Global Footer */}
      <GlobalFooter />

      {/* Global AI Interview Assistant on Home Page */}
      <AIInterviewDrawer
        taskTitle="React Machine Coding Lab"
        category="Full 100-Task Curriculum"
        level="All Levels"
        concepts={["React 19", "Frontend Architecture", "Machine Coding Interview Prep"]}
      />
    </div>
  );
}

const CleanProjectCard: React.FC<{
  project: LearningProject;
  number: number;
}> = ({ project, number }) => {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="h-full p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 hover:border-amber-500/40 hover:shadow-xl transition-all flex flex-col justify-between group backdrop-blur-sm"
    >
      <div className="space-y-4">
        {/* Icon & Level */}
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
            {project.icon}
          </div>
          <span className="text-[10px] font-sans font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {project.levelLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-normal text-white group-hover:text-amber-300 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs font-sans text-slate-400 leading-relaxed line-clamp-2 font-light">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 pt-1 font-sans">
          {project.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-400 text-[10px] border border-slate-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action */}
      <div className="pt-5 border-t border-slate-800/80 mt-5 flex items-center justify-between font-sans">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          ~{project.estimatedMinutes}m
        </span>

        <Link href={project.path}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <span>Solve</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};
