"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Github,
  BookOpen,
  Layers,
  Sparkles,
  Zap,
  AlertTriangle,
  Code2,
} from "lucide-react";
import CommandPalette from "./CommandPalette";
import { LEARNING_PROJECTS } from "@/data/learningProjects";
import UserMenu from "@/components/auth/UserMenu";

export const StudioNav: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isAIFullScreen, setIsAIFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    const handleAIFullscreen = (e: Event) => {
      const customEvent = e as CustomEvent<{ isFullScreen: boolean }>;
      setIsAIFullScreen(!!customEvent.detail?.isFullScreen);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("ai-fullscreen-change", handleAIFullscreen);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("ai-fullscreen-change", handleAIFullscreen);
    };
  }, []);

  // When AI FullScreen is active, hide the entire navbar completely
  if (isAIFullScreen) {
    return null;
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -96;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // FULL-WIDTH STICKY NAVBAR FOR INDIVIDUAL PROJECT PAGES & TASKS DIRECTORY
  if (!isHomePage) {
    return (
      <>
        <header
          className="sticky top-0 z-50 w-full border-b border-slate-800/90 bg-[#07090e]/95 backdrop-blur-xl px-6 lg:px-12 h-16 flex items-center justify-between transition-colors shadow-2xl"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          {/* Left: Brand Logo & Back to Hub */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/ReactForge_Icon.png"
                  alt="ReactForge"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  priority
                />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-sans">
                React<span className="text-amber-400">Forge</span>
              </span>
            </Link>

            <span className="text-slate-700 hidden sm:inline">/</span>

            <Link
              href="/tasks"
              className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium px-3 py-1 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60 transition-colors shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{LEARNING_PROJECTS.length} Tasks Hub</span>
            </Link>
          </div>

          {/* Center: Quick Links */}
          <nav className="hidden lg:flex items-center gap-2 font-sans text-xs font-medium">
            <Link
              href="/"
              className={`py-1.5 px-3 rounded-full transition-colors ${
                pathname === "/"
                  ? "text-amber-400 bg-slate-800/80 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              Overview
            </Link>

            <Link
              href="/tasks"
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                pathname === "/tasks" || pathname === "/projects"
                  ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>100 Tasks</span>
            </Link>

            <Link
              href="/performance"
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                pathname === "/performance"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Performance</span>
            </Link>

            <Link
              href="/incidents"
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                pathname === "/incidents"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Incidents</span>
            </Link>

            <Link
              href="/playground"
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                pathname === "/playground"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold"
                  : "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Playground</span>
            </Link>

            <Link
              href="/case-study"
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                pathname === "/case-study"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
                  : "text-purple-300 hover:text-purple-200 hover:bg-purple-950/40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Case Study</span>
            </Link>
          </nav>

          {/* Right: Search & GitHub */}
          <div className="flex items-center gap-3 font-sans">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition-all shadow-sm cursor-pointer"
              title="Search all 100 projects (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Search Tasks</span>
              <kbd className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-slate-800 font-mono text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            <UserMenu />

            <Link
              href="https://github.com/sanketkedare/ReactForge"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </header>

        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
        />
      </>
    );
  }

  // FLOATING CAPSULE NAVBAR FOR HOME LANDING PAGE
  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 w-full pointer-events-none px-4 transition-all duration-300">
        <header
          className={`relative pointer-events-auto w-[92%] lg:w-[80%] mx-auto rounded-full transition-all duration-500 flex items-center justify-between px-6 backdrop-blur-xl ${
            isScrolled
              ? "h-14 bg-[#07090e]/95 border border-slate-800/90 shadow-2xl shadow-black/60"
              : "h-14 bg-[#07090e]/85 border border-amber-500/30 shadow-[0_0_35px_-10px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/15"
          }`}
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          {/* Left: Brand Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/ReactForge_Icon.png"
                  alt="ReactForge"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  priority
                />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-sans">
                React<span className="text-amber-400">Forge</span>
              </span>
            </Link>

            <Link
              href="/tasks"
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-sm ml-2 hover:bg-amber-900/60 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{LEARNING_PROJECTS.length} Tasks</span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 font-sans text-xs text-slate-300 font-medium">
            <Link
              href="/#learning-flow"
              onClick={(e) => scrollToSection(e, "learning-flow")}
              className="py-1 px-2.5 rounded-full hover:text-white hover:bg-slate-800/40 transition-all hover:scale-105"
            >
              Roadmap
            </Link>

            <Link
              href="/performance"
              className="py-1 px-2.5 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all hover:scale-105 flex items-center gap-1 font-semibold"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Performance</span>
            </Link>

            <Link
              href="/incidents"
              className="py-1 px-2.5 rounded-full text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all hover:scale-105 flex items-center gap-1 font-semibold"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Incidents</span>
            </Link>

            <Link
              href="/playground"
              className="py-1 px-2.5 rounded-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-all hover:scale-105 flex items-center gap-1 font-semibold"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Playground</span>
            </Link>

            <Link
              href="/tasks"
              className="py-1 px-3 rounded-full transition-all hover:scale-105 flex items-center gap-1.5 text-amber-300 hover:text-white hover:bg-slate-800/60"
            >
              <span>100 Tasks</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono border bg-slate-800 text-amber-300 border-slate-700">
                {LEARNING_PROJECTS.length}
              </span>
            </Link>

            <Link
              href="/#ai-coach"
              onClick={(e) => scrollToSection(e, "ai-coach")}
              className="py-1 px-2.5 rounded-full hover:text-amber-300 hover:bg-slate-800/40 transition-all hover:scale-105 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI Coach</span>
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-3 font-sans">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition-all shadow-sm group cursor-pointer"
              title="Search projects (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-[11px]">Search</span>
              <kbd className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-slate-800 font-mono text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            <UserMenu />

            <Link
              href="https://github.com/sanketkedare/ReactForge"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </header>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
};

export default StudioNav;
