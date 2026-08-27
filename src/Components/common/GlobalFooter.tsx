"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowUp,
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

export const GlobalFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalCount = LEARNING_PROJECTS.length || 100;
  const juniorCount = LEARNING_PROJECTS.filter((p) => p.level === "beginner").length || 40;
  const midCount = LEARNING_PROJECTS.filter((p) => p.level === "intermediate").length || 35;
  const seniorCount = LEARNING_PROJECTS.filter((p) => p.level === "expert").length || 25;

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#07090e] relative z-20 font-sans transition-colors">
      {/* Top Ambient Glow Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      {/* Main Grid Container */}
      <div className="w-[92%] lg:w-[80%] mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800/70">
          {/* Column 1: Brand & Architect Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/40 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Image
                  src="/ReactForge_Icon.png"
                  alt="ReactForge Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white tracking-tight">
                    React<span className="text-amber-400">Forge</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                    v2.0 Studio
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Frontend Machine Coding Lab & System Design Hub
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A comprehensive curriculum of <strong>{totalCount} hands-on tasks</strong> designed to master real-world frontend engineering, React 19 architecture patterns, DOM reconciliation algorithms, and FAANG machine coding interview rounds.
            </p>

            {/* Creator Portfolio Showcase Badge */}
            <div className="pt-2">
              <a
                href="https://www.sanketkedare.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-md hover:shadow-cyan-500/10"
                title="Visit Sanket Kedare's Official Portfolio"
              >
                {/* Clean Logo without background */}
                <div className="flex items-center justify-center select-none shrink-0 pl-1">
                  <span className="font-black text-sm md:text-base tracking-tighter">
                    <span className="text-cyan-400 opacity-90 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all">&lt;</span>
                    <span className="text-white mx-0.5 font-black">SK</span>
                    <span className="text-purple-400 opacity-90 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all">/&gt;</span>
                  </span>
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors">
                      Architected & Built By
                    </span>
                    <ExternalLink className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                    Sanket Kedare
                  </span>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/sanketkedare/React-Tasks"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all shadow-sm"
                aria-label="GitHub Repository"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/sanket-kedare-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-all shadow-sm"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.sanketkedare.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-purple-300 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                title="Sanket Kedare Website"
              >
                <span>sanketkedare.com</span>
                <ExternalLink className="w-3 h-3 text-purple-400" />
              </a>
            </div>
          </div>

          {/* Column 2: Interview Curriculum Tracks (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Interview Tracks</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/tasks"
                  className="flex items-center justify-between group text-slate-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                    <span>Round 1: Junior SDE-1</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 group-hover:text-emerald-400">
                    {juniorCount} Tasks
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="flex items-center justify-between group text-slate-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                    <span>Round 2: Mid SDE-2</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 group-hover:text-amber-400">
                    {midCount} Tasks
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="flex items-center justify-between group text-slate-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-125 transition-transform" />
                    <span>Round 3: Senior / Architect</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 group-hover:text-purple-400">
                    {seniorCount} Tasks
                  </span>
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800/60">
                <Link
                  href="/tasks"
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Browse Full 100 Tasks Directory →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Architecture & AI (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Platform Specs</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 font-mono text-[10px] block">RUNTIME</span>
                <span className="font-bold text-slate-200 block">Next.js 16.3.2</span>
                <span className="text-[10px] text-slate-500 block">Turbopack Engine</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 font-mono text-[10px] block">FRAMEWORK</span>
                <span className="font-bold text-slate-200 block">React 19 Core</span>
                <span className="text-[10px] text-slate-500 block">Hooks & Compiler</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 font-mono text-[10px] block">AI ASSISTANT</span>
                <span className="font-bold text-amber-300 block">Gemini 2.5 Flash</span>
                <span className="text-[10px] text-slate-500 block">Code Reviewer</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 font-mono text-[10px] block">THEME & PORT</span>
                <span className="font-bold text-slate-200 block">Obsidian Dark</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold block">Port :3002</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left justify-center sm:justify-start">
            <span className="text-slate-400 font-medium">
              © {new Date().getFullYear()} ReactForge.
            </span>
            <span className="text-slate-400 font-medium">
              Crafted & Architected by{" "}
              <a
                href="https://www.sanketkedare.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 font-bold hover:text-cyan-400 transition-colors underline decoration-slate-700 hover:decoration-cyan-400"
              >
                Sanket Kedare
              </a>
              .
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-serif italic text-xs text-slate-400 hidden md:inline">
              &ldquo;Code is poetry written for machines to execute and humans to understand.&rdquo;
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm active:scale-95"
              title="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
