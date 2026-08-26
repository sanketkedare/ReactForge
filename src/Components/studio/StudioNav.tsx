"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Github, BookOpen, Layers, Sparkles } from "lucide-react";
import CommandPalette from "./CommandPalette";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

export const StudioNav: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <span className="text-xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 select-none">
                🪄
              </span>
              <span className="text-lg font-normal tracking-tight text-amber-50 group-hover:text-amber-300 transition-colors">
                React Lab
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
          <nav className="hidden md:flex items-center gap-6 font-sans text-xs text-slate-300 font-medium">
            <Link
              href="/"
              className="py-1 px-3 rounded-full hover:text-white hover:bg-slate-800/40 transition-colors"
            >
              Home Overview
            </Link>

            <Link
              href="/#learning-flow"
              className="py-1 px-3 rounded-full hover:text-white hover:bg-slate-800/40 transition-colors"
            >
              Roadmap
            </Link>

            <Link
              href="/#ai-coach"
              className="py-1 px-3 rounded-full hover:text-amber-300 hover:bg-slate-800/40 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI Coach</span>
            </Link>

            <Link
              href="/tasks"
              className={`py-1 px-3.5 rounded-full transition-all flex items-center gap-1.5 ${
                pathname === "/tasks" || pathname === "/projects"
                  ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                  : "text-amber-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 100 Tasks</span>
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

            <Link
              href="https://github.com/sanketkedare/React-Tasks"
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
              <span className="text-xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 select-none">
                🪄
              </span>
              <span className="text-lg font-normal tracking-tight text-amber-50 group-hover:text-amber-300 transition-colors">
                React Lab
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
          <nav className="hidden md:flex items-center justify-center gap-6 font-sans text-xs text-slate-300 font-medium">
            <Link
              href="/#hero"
              onClick={(e) => scrollToSection(e, "hero")}
              className="py-1 px-3 rounded-full hover:text-white hover:bg-slate-800/40 transition-all hover:scale-105"
            >
              Overview
            </Link>

            <Link
              href="/#learning-flow"
              onClick={(e) => scrollToSection(e, "learning-flow")}
              className="py-1 px-3 rounded-full hover:text-white hover:bg-slate-800/40 transition-all hover:scale-105"
            >
              Roadmap
            </Link>

            <Link
              href="/#ai-coach"
              onClick={(e) => scrollToSection(e, "ai-coach")}
              className="py-1 px-3 rounded-full hover:text-amber-300 hover:bg-slate-800/40 transition-all hover:scale-105 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI Coach</span>
            </Link>

            <Link
              href="/tasks"
              className="py-1 px-3.5 rounded-full transition-all hover:scale-105 flex items-center gap-1.5 text-amber-300 hover:text-white hover:bg-slate-800/60"
            >
              <span>All Tasks</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono border bg-slate-800 text-amber-300 border-slate-700">
                {LEARNING_PROJECTS.length}
              </span>
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

            <Link
              href="https://github.com/sanketkedare/React-Tasks"
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
