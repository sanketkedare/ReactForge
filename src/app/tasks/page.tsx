"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  ArrowUpRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from "lucide-react";
import StudioNav from "@/components/studio/StudioNav";
import AIInterviewDrawer from "@/components/ai/AIInterviewDrawer";
import { LEARNING_PROJECTS, StudentLevel, LearningProject } from "@/data/learningProjects";

const BEGINNER_COUNT = LEARNING_PROJECTS.filter((p) => p.level === "beginner").length;
const INTERMEDIATE_COUNT = LEARNING_PROJECTS.filter((p) => p.level === "intermediate").length;
const ADVANCED_COUNT = LEARNING_PROJECTS.filter((p) => p.level === "expert").length;
const TOTAL_COUNT = LEARNING_PROJECTS.length;

export default function DedicatedTasksPage() {
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"default" | "time-asc" | "time-desc" | "name">("default");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    LEARNING_PROJECTS.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set).sort()];
  }, []);

  // Filter and sort
  const filteredProjects = useMemo(() => {
    let result = LEARNING_PROJECTS.filter((item) => {
      const matchesLevel = selectedLevel === "all" || item.level === selectedLevel;
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.skills.some((s) => s.toLowerCase().includes(q));

      return matchesLevel && matchesCategory && matchesQuery;
    });

    if (sortBy === "time-asc") {
      result.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    } else if (sortBy === "time-desc") {
      result.sort((a, b) => b.estimatedMinutes - a.estimatedMinutes);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedLevel, selectedCategory, searchQuery, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevel, selectedCategory, searchQuery, sortBy, pageSize]);

  // Pagination Calculations
  const totalItems = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    // Smooth scroll to top of directory
    const el = document.getElementById("tasks-header");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Generate page numbers with ellipsis windowing
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div
      className="min-h-screen w-full bg-[#07090e] text-slate-200 flex flex-col selection:bg-amber-400 selection:text-slate-950 transition-colors duration-300 relative overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
    >
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[170px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px]" />
      </div>

      <StudioNav />

      <main className="flex-1 w-[92%] lg:w-[80%] mx-auto pt-24 pb-20 flex flex-col relative z-10 space-y-10">
        {/* Page Header */}
        <div id="tasks-header" className="text-center space-y-4 max-w-3xl mx-auto pt-6 scroll-mt-28">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-600/30 bg-amber-950/40 text-amber-200 text-xs font-sans font-medium shadow-sm backdrop-blur-md">
            <span>✨</span>
            <span>Comprehensive Directory • {TOTAL_COUNT} Practical Tasks</span>
            <span>✨</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-amber-50 tracking-tight leading-tight">
            All {TOTAL_COUNT} React Practice Tasks
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed">
            Search, filter by difficulty, or jump across pages to practice real-world frontend machine coding solutions.
          </p>
        </div>

        {/* Search & Filter Control Hub */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-6 font-sans">
          {/* Top Row: Search and Sort */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, hook, category, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-full pl-11 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Items per page */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs flex-wrap">
              {/* Items Per Page Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                <span className="text-[11px] text-slate-500 font-mono">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold outline-none cursor-pointer text-xs"
                >
                  <option value={12} className="bg-slate-900">12</option>
                  <option value={24} className="bg-slate-900">24</option>
                  <option value={48} className="bg-slate-900">48</option>
                  <option value={100} className="bg-slate-900">All (100)</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
                >
                  <option value="default" className="bg-slate-900">Default Order</option>
                  <option value="time-asc" className="bg-slate-900">Fastest (~min)</option>
                  <option value="time-desc" className="bg-slate-900">Longest (~min)</option>
                  <option value="name" className="bg-slate-900">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Level Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedLevel("all")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedLevel === "all"
                    ? "bg-amber-400 text-slate-950 font-semibold shadow-sm"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                All ({TOTAL_COUNT})
              </button>

              <button
                onClick={() => setSelectedLevel("beginner")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedLevel === "beginner"
                    ? "bg-emerald-600 text-white font-semibold shadow-sm"
                    : "bg-slate-950 border border-slate-800 text-emerald-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                🌱 Beginner ({BEGINNER_COUNT})
              </button>

              <button
                onClick={() => setSelectedLevel("intermediate")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedLevel === "intermediate"
                    ? "bg-amber-600 text-white font-semibold shadow-sm"
                    : "bg-slate-950 border border-slate-800 text-amber-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                ⚡ Intermediate ({INTERMEDIATE_COUNT})
              </button>

              <button
                onClick={() => setSelectedLevel("expert")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedLevel === "expert"
                    ? "bg-purple-600 text-white font-semibold shadow-sm"
                    : "bg-slate-950 border border-slate-800 text-purple-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                🚀 Advanced ({ADVANCED_COUNT})
              </button>
            </div>

            {/* Range Counter */}
            {totalItems > 0 && (
              <span className="text-slate-400 font-mono text-[11px]">
                Showing <strong className="text-amber-300">{startIndex + 1}–{endIndex}</strong> of <strong className="text-white">{totalItems}</strong> tasks
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {totalItems === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4 font-sans">
            <div className="text-3xl">🔍</div>
            <h3 className="text-xl font-bold text-white">No tasks match your filter</h3>
            <p className="text-xs text-slate-400 font-light">Try resetting the search query or difficulty level.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("all");
                setSelectedCategory("all");
              }}
              className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <motion.div
              layout
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskCard project={project} index={startIndex + idx + 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls Toolbar */}
            {totalPages > 1 && (
              <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
                {/* Page Info */}
                <div className="text-slate-400 font-mono text-[11px]">
                  Page <strong className="text-amber-300 font-bold">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                </div>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* First Button */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Prev Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {pageNumbers.map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${idx}`} className="px-2 py-1 text-slate-600 font-mono text-xs select-none">
                          •••
                        </span>
                      );
                    }
                    const isCurrent = p === currentPage;
                    return (
                      <button
                        key={p}
                        onClick={() => goToPage(Number(p))}
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-105"
                            : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Button */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Jump */}
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <span>Jump:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => goToPage(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-amber-300 font-bold outline-none cursor-pointer"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num} className="bg-slate-900">
                        Page {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-slate-800/80 py-10 px-6 text-center text-xs font-sans text-slate-500">
        <div className="w-[92%] lg:w-[80%] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif italic text-sm text-slate-300">
            &ldquo;Code is poetry written for machines to execute and humans to understand.&rdquo;
          </p>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>React Practice Lab</span>
            <span>•</span>
            <span>{TOTAL_COUNT} Projects</span>
            <span>•</span>
            <span>Port 3002</span>
          </div>
        </div>
      </footer>

      {/* Global AI Interview Assistant */}
      <AIInterviewDrawer
        taskTitle="100 Tasks Directory"
        category="Curriculum Hub"
        level="All Levels"
        concepts={["Frontend Machine Coding", "React 19", "System Design"]}
      />
    </div>
  );
}

const TaskCard: React.FC<{
  project: LearningProject;
  index: number;
}> = ({ project }) => {
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
