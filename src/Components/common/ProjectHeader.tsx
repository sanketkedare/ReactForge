"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Code2,
  Package,
  Trophy,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  MessageSquare,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentLevel, LEARNING_PROJECTS } from "@/data/learningProjects";

interface ProjectHeaderProps {
  title: string;
  description: string;
  level: StudentLevel;
  category: string;
  concepts?: string[];
  estimatedMinutes?: number;
  skills?: string[];
  whatYouWillBuild?: string;
  keyTakeaways?: string[];
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  description,
  level,
  category,
  concepts = [],
  estimatedMinutes,
  skills = [],
  whatYouWillBuild,
  keyTakeaways = [],
}) => {
  const matchedProject = LEARNING_PROJECTS.find(
    (p) => p.title.toLowerCase() === title.toLowerCase() || p.description === description
  );

  const displayTime = estimatedMinutes || matchedProject?.estimatedMinutes || 25;
  const displayBuild = whatYouWillBuild || matchedProject?.whatYouWillBuild || description;
  const displayTakeaways = keyTakeaways.length > 0 ? keyTakeaways : matchedProject?.keyTakeaways || concepts;
  const displaySkills = skills.length > 0 ? skills : matchedProject?.skills || ["useState", "React 19", "TypeScript"];
  const displaySlug = matchedProject?.id || matchedProject?.path?.replace(/^\//, "") || title.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const [activeDossierTab, setActiveDossierTab] = useState<
    "problem" | "communication" | "approach" | "methods" | "libraries" | "complexity" | "expectations"
  >("problem");

  // Keep Dossier collapsed by default so the interactive workbench is visible above the fold
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  const levelBadge = {
    beginner: {
      label: "🟢 SDE-1",
      fullLabel: "🟢 SDE-1 / Junior (15–30m)",
      style: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
    },
    intermediate: {
      label: "🟡 SDE-2",
      fullLabel: "🟡 SDE-2 / Mid-Level (30–45m)",
      style: "bg-amber-950/80 text-amber-300 border-amber-800/80",
    },
    expert: {
      label: "🟣 Senior",
      fullLabel: "🟣 Senior / System Design (50–60m)",
      style: "bg-purple-950/80 text-purple-300 border-purple-800/80",
    },
  }[level];

  // Specific dynamic questions based on project title/category
  const communicationQuestions = [
    `Clarify exact input boundaries, character limits, and empty state fallbacks for ${title}.`,
    `Ask if persistent state (localStorage / IndexedDB) is expected or if in-memory React state is sufficient.`,
    `Confirm if debouncing, throttling, or rate-limiting is required for user interactions.`,
    `Clarify accessibility expectations (Keyboard navigation, ARIA roles, screen reader announcements).`,
    `Check if third-party helper libraries are permitted or if a pure zero-dependency solution is required.`,
  ];

  const interviewExpectations = [
    { title: "State Architecture", desc: "Clean state normalization without redundant derived state." },
    { title: "Immutable Updates", desc: "Pure state transitions using immutable array/object spreads." },
    { title: "Edge Case Coverage", desc: "Handling zero items, network errors, long text, and boundary extremes." },
    { title: "Clean Modular Code", desc: "Breaking UI into readable sub-components and extracting reusable custom hooks." },
    { title: "Accessible UX", desc: "Proper focus management, keyboard accessibility (Enter/Esc/Arrows), and ARIA attributes." },
  ];

  return (
    <div className="w-full mb-6 font-sans space-y-3">
      {/* Compact Studio Header Card */}
      <div className="w-full p-4 sm:p-5 rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/95 via-[#0a0e17] to-slate-950 shadow-xl backdrop-blur-xl space-y-3">
        {/* Row 1: Back Button, Title, Badges & Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 px-3 py-1.5 rounded-xl border border-amber-800/60 transition-all hover:scale-105 shadow-sm"
              title="Return to 100 Tasks Directory"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tasks</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>

            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${levelBadge.style}`}>
              {levelBadge.label}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>~{displayTime}m</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{category}</span>
            </span>
          </div>

          {/* Action Buttons: Dossier */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            <button
              onClick={() => setIsDossierOpen(!isDossierOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-sm cursor-pointer ${
                isDossierOpen
                  ? "bg-amber-400 text-slate-950 border-amber-300"
                  : "bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-slate-800 hover:border-amber-500/60"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDossierOpen ? "text-slate-950" : "text-amber-400"}`} />
              <span>{isDossierOpen ? "Hide Guide" : "📖 Interview Dossier"}</span>
              {isDossierOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Short Description & Skills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
          <p className="text-slate-300 font-light line-clamp-1 flex-1">
            {displayBuild}
          </p>

          <div className="flex flex-wrap gap-1.5 flex-shrink-0">
            {displaySkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 text-[10px] font-mono border border-slate-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Interview Dossier */}
      <AnimatePresence>
        {isDossierOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/95 shadow-2xl p-4 sm:p-6 space-y-4 backdrop-blur-xl">
              {/* Dossier Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-xs">
                {[
                  { id: "problem", label: "1. Problem Statement", icon: <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> },
                  { id: "communication", label: "2. Interviewer Clarifications", icon: <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: "approach", label: "3. Step-by-Step Architecture", icon: <Zap className="w-3.5 h-3.5 text-indigo-400" /> },
                  { id: "methods", label: "4. JS & React APIs Used", icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" /> },
                  { id: "libraries", label: "5. Zero-Dependency Guide", icon: <Package className="w-3.5 h-3.5 text-emerald-400" /> },
                  { id: "complexity", label: "6. Time & Pace Budget", icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: "expectations", label: "7. Evaluation Rubric", icon: <Trophy className="w-3.5 h-3.5 text-purple-400" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDossierTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer text-xs ${
                      activeDossierTab === tab.id
                        ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                        : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Dossier Content Area */}
              <div className="text-xs text-slate-200">
                {activeDossierTab === "problem" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>🎯 Problem Statement & Functional Requirements</span>
                    </h3>
                    <p className="text-slate-300 leading-relaxed font-light">
                      {description}
                    </p>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        Acceptance Criteria:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-xs">
                        {displayTakeaways.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeDossierTab === "communication" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Communication Before Coding (Questions to Ask the Interviewer)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {communicationQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                          <span className="text-amber-400 font-mono font-bold text-xs">Q{idx + 1}.</span>
                          <span className="text-slate-300 text-xs">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDossierTab === "approach" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-400" />
                      <span>Step-by-Step Architecture Mental Model</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] font-bold text-indigo-300 font-mono">PHASE 1: STATE MODEL</span>
                        <p className="text-slate-300 text-xs font-light leading-relaxed">
                          Define minimal normalized state. Avoid derived state duplication.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] font-bold text-amber-300 font-mono">PHASE 2: CORE HANDLERS</span>
                        <p className="text-slate-300 text-xs font-light leading-relaxed">
                          Implement pure immutable state update handlers with error boundary checks.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-300 font-mono">PHASE 3: POLISH & A11Y</span>
                        <p className="text-slate-300 text-xs font-light leading-relaxed">
                          Add keyboard shortcuts, focus traps, ARIA attributes, and edge-case fallbacks.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDossierTab === "methods" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      <span>Core JavaScript & React APIs Used</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {displaySkills.map((s, idx) => (
                        <div key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                          <code className="text-amber-300 font-mono font-bold text-xs">{s}</code>
                          <span className="text-slate-400 text-[11px]">Production Standard</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDossierTab === "libraries" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span>Zero-Dependency Vanilla Implementation Guide</span>
                    </h3>
                    <p className="text-slate-300 text-xs font-light leading-relaxed">
                      In high-bar interviews (Meta, Google, Uber), you are evaluated on building without third-party libraries (e.g. implementing custom debouncing, virtual scrolling, or drag-and-drop from scratch using native Web APIs).
                    </p>
                  </div>
                )}

                {activeDossierTab === "complexity" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Time Budget & Complexity Requirements</span>
                    </h3>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-6 text-xs">
                      <div>
                        <span className="text-slate-400">Target Time:</span>{" "}
                        <strong className="text-amber-300 font-mono">{displayTime} minutes</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Time Complexity:</span>{" "}
                        <strong className="text-emerald-300 font-mono">O(1) / O(n)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Space Complexity:</span>{" "}
                        <strong className="text-indigo-300 font-mono">O(n) State</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeDossierTab === "expectations" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span>What the Interviewer Expects (Evaluation Rubric)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {interviewExpectations.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                          <span className="text-amber-300 font-semibold text-xs">{item.title}</span>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectHeader;
