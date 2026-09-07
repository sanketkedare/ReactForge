"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { LEARNING_PROJECTS, LearningProject } from "@/data/learningProjects";
import CodeViewerSection from "@/components/common/CodeViewerSection";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Sparkles,
  Code2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Activity,
  Sliders,
  Bookmark,
  Send,
  Award,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  FileText,
  Clock,
  Layers,
  CheckSquare,
  Zap,
  BookOpen,
  ChevronRight,
  Eye,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { getTaskStarterCode } from "@/lib/taskStarterCode";
import { runFunctionalEvaluation, EvaluationResult } from "@/lib/taskEvaluator";
import { LiveCodeRunner } from "@/components/studio/LiveCodeRunner";

interface DynamicTaskClientProps {
  slug: string;
  initialProject?: LearningProject;
  initialPrevProject?: LearningProject | null;
  initialNextProject?: LearningProject | null;
  children?: React.ReactNode;
}

export const DynamicTaskClient: React.FC<DynamicTaskClientProps> = ({
  slug,
  initialProject,
  initialPrevProject,
  initialNextProject,
  children,
}) => {
  const projectIndex = useMemo(() => {
    if (initialProject) return -1;
    return LEARNING_PROJECTS.findIndex(
      (p) => p.id === slug || p.path === `/${slug}`
    );
  }, [slug, initialProject]);

  const project: LearningProject | undefined =
    initialProject || (projectIndex >= 0 ? LEARNING_PROJECTS[projectIndex] : undefined);

  const prevProject =
    initialPrevProject !== undefined
      ? initialPrevProject
      : projectIndex > 0
      ? LEARNING_PROJECTS[projectIndex - 1]
      : null;

  const nextProject =
    initialNextProject !== undefined
      ? initialNextProject
      : projectIndex >= 0 && projectIndex < LEARNING_PROJECTS.length - 1
      ? LEARNING_PROJECTS[projectIndex + 1]
      : null;

  const { user, openAuthModal, toggleTaskComplete, toggleTaskBookmark, isTaskCompleted, isTaskBookmarked } = useAuth();
  const isSolved = project ? isTaskCompleted(project.id) : false;
  const isBookmarked = project ? isTaskBookmarked(project.id) : false;

  const xpValue = project?.level === "expert" ? 50 : project?.level === "intermediate" ? 25 : 10;

  // Main View: "demo" (Interactive Live Demo Model) | "studio" (Candidate IDE Workbench)
  const [mainView, setMainView] = useState<"demo" | "studio">("demo");

  // Left Panel Tabs: "spec" | "concepts" | "tests"
  const [leftTab, setLeftTab] = useState<"spec" | "concepts" | "tests">("spec");

  // Bottom Output Dock Tabs: "preview" | "tests" | "ai" | "reference"
  const [outputTab, setOutputTab] = useState<"preview" | "tests" | "ai" | "reference">("preview");

  // Live Preview Target Toggle: "candidate" (Live Running Code) vs "reference" (Target Reference Output)
  const [previewTarget, setPreviewTarget] = useState<"candidate" | "reference">("candidate");

  // Fallback Interactive Sandbox State (when children not provided)
  const [interactiveCount, setInteractiveCount] = useState<number>(0);
  const [sampleText, setSampleText] = useState<string>("React 19 Practice Workbench");
  const [toggleActive, setToggleActive] = useState<boolean>(true);
  const [sliderVal, setSliderVal] = useState<number>(50);

  // Custom Code Solution & AI Evaluation States
  const [userCode, setUserCode] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [functionalEvaluation, setFunctionalEvaluation] = useState<EvaluationResult | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [contractTests, setContractTests] = useState<{ id: number; name: string; passed: boolean }[]>([]);

  // Reference code is STRICTLY locked unless the user is logged in AND has solved the task
  const isSolutionUnlocked = Boolean(user && isSolved);

  // Auto-initialize starter code and tests on project change
  useEffect(() => {
    if (project) {
      try {
        const savedCode = localStorage.getItem(`reactforge_code_${project.id}`);
        setUserCode(savedCode || getTaskStarterCode(project));
      } catch {
        setUserCode(getTaskStarterCode(project));
      }

      // Clear any legacy client unlock keys
      try {
        localStorage.removeItem(`reactforge_unlocked_${project.id}`);
      } catch {}

      setFunctionalEvaluation(null);
      setAiEvaluation(null);
      setEvaluationError(null);

      setContractTests([
        { id: 1, name: "Initial state initializes without hydration mismatches", passed: true },
        { id: 2, name: "Event handlers update state immutably without race conditions", passed: true },
        { id: 3, name: "Clean teardown and timer unmount lifecycle verification", passed: true },
        { id: 4, name: "Accessibility roles (ARIA) and keyboard navigation check", passed: true },
      ]);
    }
  }, [project, isSolved]);

  // Auto-claim pending solve when a guest logs in
  useEffect(() => {
    if (user && project && !isSolved) {
      try {
        const pending = localStorage.getItem("reactforge_pending_solve");
        if (pending) {
          const parsed = JSON.parse(pending);
          if (parsed.taskId === project.id) {
            toggleTaskComplete(project.id, xpValue);
            localStorage.removeItem("reactforge_pending_solve");
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ["#10b981", "#f59e0b", "#6366f1"],
            });
          }
        }
      } catch {}
    }
  }, [user, project, isSolved, xpValue, toggleTaskComplete]);

  const handleToggleBookmark = async () => {
    if (!project) return;
    if (!user) {
      openAuthModal("login");
      return;
    }
    await toggleTaskBookmark(project.id);
  };

  const handleResetProgress = async () => {
    if (!project || !user) return;
    if (isSolved) {
      await toggleTaskComplete(project.id, xpValue);
    }
  };

  const handleResetStarterCode = () => {
    if (!project) return;
    const starter = getTaskStarterCode(project);
    setUserCode(starter);
    try {
      localStorage.setItem(`reactforge_code_${project.id}`, starter);
    } catch {}
  };

  const handleCopyCandidateCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handle Tab key indentation inside the Code Editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = userCode.substring(0, start) + "  " + userCode.substring(end);
      setUserCode(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleEvaluateSolution = async () => {
    if (!project || !userCode.trim()) return;
    setIsEvaluating(true);
    setEvaluationError(null);
    setOutputTab("tests"); // Immediately switch to test results tab

    // Save code to local storage
    try {
      localStorage.setItem(`reactforge_code_${project.id}`, userCode);
    } catch {}

    // Step 1: Run Deterministic Functional Test Assertions
    const funcResult = runFunctionalEvaluation(userCode, project);
    setFunctionalEvaluation(funcResult);

    // Step 2: Submit to AI Evaluation API
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: project.id,
          taskTitle: project.title,
          category: project.category,
          level: project.level,
          code: userCode,
          uid: user?.uid,
          functionalPercentage: funcResult.percentage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiEvaluation(data.evaluation);
        const bothPassed = Boolean(data.evaluation?.passed && funcResult.passed);
        if (bothPassed) {
          if (user) {
            if (!isSolved) {
              await toggleTaskComplete(project.id, xpValue);
            }
          } else {
            // Save pending solve for guest to automatically claim upon sign in
            try {
              localStorage.setItem(
                "reactforge_pending_solve",
                JSON.stringify({ taskId: project.id, xp: xpValue })
              );
            } catch {}
          }
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#10b981", "#f59e0b", "#6366f1", "#ec4899"],
          });
        }
      } else {
        setEvaluationError(data.error || "Evaluation failed. Please try again.");
      }
    } catch (err: any) {
      setEvaluationError(err.message || "Failed to reach evaluation service.");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-3xl shadow-xl">
          🔍
        </div>
        <h1 className="text-2xl font-bold text-white">Task Not Found</h1>
        <p className="text-xs text-slate-400 max-w-md">
          The requested challenge <code className="text-amber-300 font-mono">/{slug}</code> does not exist in the curriculum.
        </p>
        <Link
          href="/tasks"
          className="px-6 py-2.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-lg hover:bg-amber-300 transition-colors"
        >
          Return to All Tasks
        </Link>
      </div>
    );
  }

  const levelBadge = {
    beginner: { label: "🟢 SDE-1 Junior", style: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" },
    intermediate: { label: "🟡 SDE-2 Mid-Level", style: "text-amber-400 border-amber-500/30 bg-amber-950/40" },
    expert: { label: "🟣 Senior System Design", style: "text-purple-400 border-purple-500/30 bg-purple-950/40" },
  }[project.level] || { label: project.level, style: "text-slate-400 border-slate-700 bg-slate-800" };

  const lineCount = userCode.split("\n").length;

  return (
    <div className="w-full space-y-5 pb-24">
      {/* ============================================================
          TOP TOOLBAR: Title, Level, Category, Solved Status & Nav
      ============================================================ */}
      <div className="p-3 sm:px-6 sm:py-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        {/* Left: Back & Title */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">All Tasks</span>
          </Link>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{project.title}</span>
          </h1>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${levelBadge.style}`}>
            {levelBadge.label}
          </span>
        </div>

        {/* Center: Mode Switcher (Interactive Demo Model vs Code Studio) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMainView("demo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mainView === "demo"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Demo Model</span>
          </button>

          <button
            onClick={() => setMainView("studio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mainView === "studio"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Candidate Code Studio</span>
          </button>
        </div>

        {/* Right: Actions, Solved Status & Task Switcher */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isBookmarked
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark this Challenge"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-cyan-400 text-cyan-400" : ""}`} />
            <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>

          {/* Official Verification Status Badge */}
          {isSolved ? (
            <div className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Solved (+{xpValue} XP)</span>
              <button
                onClick={handleResetProgress}
                title="Reset status to re-practice this challenge"
                className="p-1 hover:bg-emerald-500/20 text-emerald-300 rounded-md transition-colors cursor-pointer text-[10px] ml-0.5"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono shadow-sm"
              title="Submit your solution via the editor to verify tests and earn XP"
            >
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>+{xpValue} XP</span>
            </div>
          )}

          {/* Prev / Next Task Switcher */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            {prevProject ? (
              <Link
                href={prevProject.path}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Previous: ${prevProject.title}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            ) : null}

            {nextProject ? (
              <Link
                href={nextProject.path}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Next: ${nextProject.title}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* ============================================================
          VIEW 1: HERO INTERACTIVE DEMO MODEL
      ============================================================ */}
      {mainView === "demo" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Hero Interactive Component Frame */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-[#07090e] shadow-2xl overflow-hidden p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Live Interactive Demo Model</span>
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">{project.title}</h2>
                <p className="text-xs text-slate-400 font-light max-w-xl">
                  {project.whatYouWillBuild || project.description}
                </p>
              </div>

              <button
                onClick={() => setMainView("studio")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Code2 className="w-4 h-4" />
                <span>Open Candidate Code Studio →</span>
              </button>
            </div>

            {/* Render Target Application / Component */}
            <div className="py-8 flex items-center justify-center">
              {children ? (
                <div className="w-full max-w-4xl">{children}</div>
              ) : (
                <div className="w-full max-w-md p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 shadow-xl">
                  <div className="text-4xl font-mono font-bold text-amber-400">{interactiveCount}</div>
                  <p className="text-xs text-slate-400">{sampleText}</p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setInteractiveCount((c) => c - 1)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
                    >
                      - Decrement
                    </button>
                    <button
                      onClick={() => setInteractiveCount((c) => c + 1)}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                    >
                      + Increment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Problem Overview & Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceptance Criteria</span>
              </span>
              <div className="space-y-2.5">
                {project.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-light">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target APIs & Concepts</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Ready to code this yourself? Switch to the <strong>Candidate Code Studio</strong> to write your implementation in React 19 and run automated test evaluations!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 2: CANDIDATE CODE STUDIO WORKBENCH
      ============================================================ */}
      {mainView === "studio" && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-fadeIn">
        {/* ============================================================
            LEFT PANEL: Problem Specification & Learning Hub (5 cols)
        ============================================================ */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col min-h-[750px]">
            {/* Left Tabs Bar */}
            <div className="p-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 text-xs">
                {[
                  { id: "spec", label: "Challenge Spec", icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: "concepts", label: "Learning Concepts", icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: "tests", label: "Test Specs", icon: <Activity className="w-3.5 h-3.5" /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLeftTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all text-xs cursor-pointer ${
                      leftTab === t.id
                        ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              <span className="text-[10px] font-mono text-slate-500 pr-2 hidden sm:inline">
                Spec Hub
              </span>
            </div>

            {/* Left Content Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[720px] text-xs">
              {/* TAB 1: CHALLENGE SPEC */}
              {leftTab === "spec" && (
                <div className="space-y-5">
                  {/* Problem Brief */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <TargetIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Task Objective</span>
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {project.title}
                    </h2>
                    <p className="text-slate-300 font-light leading-relaxed text-xs">
                      {project.whatYouWillBuild || project.description}
                    </p>
                  </div>

                  {/* Skills / Tech Stack Tags */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Target APIs & Mental Models
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 text-[11px] font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Acceptance Criteria */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Acceptance Criteria</span>
                    </span>

                    <div className="space-y-2">
                      {project.keyTakeaways.map((takeaway, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-light">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Tip */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Interview Tip:</strong> Write clean, immutable state updates and handle edge cases (empty states, rapid clicks) before hitting submit.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: LEARNING CONCEPTS */}
              {leftTab === "concepts" && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Architecture & Theory</span>
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Core Engineering Mental Models
                    </h3>
                    <p className="text-slate-400 font-light leading-relaxed">
                      What top engineering teams (Meta, Uber, Stripe) evaluate during this round.
                    </p>
                  </div>

                  {/* Concept Cards */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-amber-300 font-mono">1. State Normalization & React 19</span>
                      <p className="text-slate-300 leading-relaxed font-light">
                        Avoid storing derived state. Compute values dynamically with pure functions and memoize only when calculations involve heavy data transforms.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-300 font-mono">2. DOM Cleanup & Lifecycle Teardown</span>
                      <p className="text-slate-300 leading-relaxed font-light">
                        Always return cleanup functions in <code className="text-amber-300 font-mono">useEffect</code> for intervals, event listeners, and timers to prevent memory leaks.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-300 font-mono">3. Accessibility (WCAG 2.1)</span>
                      <p className="text-slate-300 leading-relaxed font-light">
                        Ensure all interactive triggers have explicit <code className="text-amber-300 font-mono">aria-labels</code>, keyboard focus states, and semantic HTML markup.
                      </p>
                    </div>
                  </div>

                  {/* Complexity Benchmark */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Complexity Targets
                    </span>
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Time Complexity</span>
                        <strong className="text-amber-300">O(1) / O(n)</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Space Complexity</span>
                        <strong className="text-emerald-300">O(1) Memory</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TEST MATRIX */}
              {leftTab === "tests" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Deterministic Test Contract</span>
                    </span>
                    <h3 className="text-base font-bold text-white">Automated Regression Specs</h3>
                    <p className="text-slate-400 font-light">
                      These contracts are verified every time you click Run Tests & Submit.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {contractTests.map((test) => (
                      <div
                        key={test.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-slate-300 font-medium">{test.name}</span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 uppercase">
                          Contract Spec
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT PANEL: Interactive Candidate Workbench (7 cols)
        ============================================================ */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. CODE EDITOR (Solution.tsx) */}
          <div className="rounded-3xl border border-slate-800 bg-[#07090e] shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Top Toolbar */}
            <div className="p-3 sm:px-5 sm:py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-amber-300">Solution.tsx</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px]">{lineCount} lines</span>
                <span className="text-[10px] text-emerald-400/80 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md hidden sm:inline">
                  TypeScript / React 19
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetStarterCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] border border-slate-800 transition-colors cursor-pointer"
                  title="Reset to starter boilerplate"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleCopyCandidateCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] border border-slate-800 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Monaco-style Code Input with Gutter Line Numbers */}
            <div className="flex bg-[#05070b] font-mono text-xs sm:text-[13px] min-h-[320px] max-h-[420px] overflow-hidden">
              {/* Line Numbers Gutter */}
              <div
                className="select-none py-4 px-3 bg-[#030508] border-r border-slate-800/80 text-slate-600 text-right font-mono text-xs leading-[22px] min-w-[45px] overflow-hidden"
                aria-hidden="true"
              >
                {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Textarea with Tab Key Indentation */}
              <div className="flex-1 p-4 overflow-y-auto">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="// Implement your React 19 component here..."
                  spellCheck={false}
                  className="w-full h-full min-h-[300px] bg-transparent text-amber-100 placeholder-slate-600 outline-none resize-none leading-[22px] selection:bg-amber-500/30 selection:text-white font-mono text-xs sm:text-[13px]"
                />
              </div>
            </div>

            {/* Editor Action Dock: Run Tests & Submit */}
            <div className="p-3 sm:px-5 sm:py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                {!user ? (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Guest Mode: Pass tests to claim +{xpValue} XP on sign in
                  </span>
                ) : isSolved ? (
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Passed & Verified (+{xpValue} XP Earned)
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-300/90 font-mono flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Submit to evaluate & earn +{xpValue} XP
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setOutputTab("preview")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    outputTab === "preview"
                      ? "bg-slate-800 text-white border-slate-700"
                      : "bg-slate-900 text-slate-400 hover:text-white border-slate-800"
                  }`}
                  title="View your component live preview"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={handleEvaluateSolution}
                  disabled={isEvaluating}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Solution...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Run Tests & Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. UNIFIED OUTPUT DOCK: Live Preview / Test Results / AI Review / Reference */}
          <div className="rounded-3xl border border-slate-800 bg-[#07090e] shadow-2xl overflow-hidden">
            {/* Output Dock Navigation Tabs */}
            <div className="p-2 sm:px-4 sm:py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {[
                  { id: "preview", label: "Live Preview", icon: <Code2 className="w-3.5 h-3.5" /> },
                  {
                    id: "tests",
                    label: functionalEvaluation
                      ? `Tests (${functionalEvaluation.passedTests}/${functionalEvaluation.totalTests})`
                      : "Test Suite",
                    icon: <Activity className="w-3.5 h-3.5" />,
                    badge: functionalEvaluation ? (
                      functionalEvaluation.passed ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-1" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-rose-400 inline-block ml-1" />
                      )
                    ) : null,
                  },
                  {
                    id: "ai",
                    label: aiEvaluation ? `AI Review (${aiEvaluation.score}/10)` : "AI Review",
                    icon: <Sparkles className="w-3.5 h-3.5" />,
                  },
                  {
                    id: "reference",
                    label: "Reference Code",
                    icon: isSolutionUnlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    ),
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setOutputTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      outputTab === t.id
                        ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                    {t.badge}
                  </button>
                ))}
              </div>

              {/* Sub-controls when in Preview Mode */}
              {outputTab === "preview" && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setPreviewTarget("candidate")}
                    className={`px-2.5 py-0.5 rounded-lg font-medium transition-all ${
                      previewTarget === "candidate"
                        ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Your Code
                  </button>
                  <button
                    onClick={() => setPreviewTarget("reference")}
                    className={`px-2.5 py-0.5 rounded-lg font-medium transition-all ${
                      previewTarget === "reference"
                        ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Target Demo
                  </button>
                </div>
              )}
            </div>

            {/* Output Tab Body */}
            <div className="p-6 bg-gradient-to-b from-[#07090e] to-slate-950/70 min-h-[300px]">
              {/* TAB 1: LIVE PREVIEW */}
              {outputTab === "preview" && (
                <div className="w-full flex items-center justify-center">
                  {previewTarget === "candidate" ? (
                    <div className="w-full">
                      <LiveCodeRunner code={userCode} taskTitle={project.title} />
                    </div>
                  ) : (
                    <div className="w-full flex justify-center py-2">
                      {children ? (
                        children
                      ) : (
                        <div className="text-xs text-slate-400">Target reference preview loaded.</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TEST SUITE RESULTS */}
              {outputTab === "tests" && (
                <div className="space-y-4">
                  {isEvaluating && (
                    <div className="p-10 text-center space-y-3">
                      <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-slate-300 font-mono">
                        Executing automated functional assertions & regression test suite...
                      </p>
                    </div>
                  )}

                  {evaluationError && (
                    <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{evaluationError}</span>
                    </div>
                  )}

                  {!isEvaluating && !functionalEvaluation && (
                    <div className="text-center py-10 space-y-3">
                      <Activity className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        No evaluation run yet. Write your code in <code className="text-amber-300 font-mono">Solution.tsx</code> and click <strong>Run Tests & Submit</strong> to verify your solution.
                      </p>
                    </div>
                  )}

                  {functionalEvaluation && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white text-sm">Automated Test Results</span>
                        </div>
                        <span className={`font-mono font-bold px-3 py-1 rounded-full text-xs border ${
                          functionalEvaluation.passed
                            ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                            : "bg-rose-950 border-rose-800 text-rose-300"
                        }`}>
                          {functionalEvaluation.passedTests} / {functionalEvaluation.totalTests} Passed ({functionalEvaluation.percentage}%)
                        </span>
                      </div>

                      <div className="space-y-2">
                        {functionalEvaluation.tests.map((t) => (
                          <div
                            key={t.id}
                            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                              t.passed
                                ? "bg-emerald-950/20 border-emerald-900/40"
                                : "bg-rose-950/20 border-rose-900/40"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {t.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                              <span className={t.passed ? "text-slate-200" : "text-slate-300 font-medium"}>
                                {t.name}
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                t.passed
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                                  : "bg-rose-950 text-rose-300 border border-rose-800/80"
                              }`}
                            >
                              {t.passed ? "PASSED" : "FAILED"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {functionalEvaluation.passed && (
                        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3">
                          <span className="font-bold">🎉 All functional tests passed! Check the AI Review tab for architectural feedback.</span>
                          <button
                            onClick={() => setOutputTab("ai")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors cursor-pointer"
                          >
                            View AI Review →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AI CODE REVIEW */}
              {outputTab === "ai" && (
                <div className="space-y-4">
                  {isEvaluating && (
                    <div className="p-10 text-center space-y-3">
                      <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-slate-300 font-mono">
                        Requesting Principal Engineer code review from Gemini AI...
                      </p>
                    </div>
                  )}

                  {!isEvaluating && !aiEvaluation && (
                    <div className="text-center py-10 space-y-3">
                      <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Submit your code to receive automated algorithmic complexity analysis, clean code evaluation, and senior architectural recommendations.
                      </p>
                    </div>
                  )}

                  {aiEvaluation && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="font-bold text-white text-sm">Principal Engineer AI Evaluation</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400">Score:</span>
                          <strong className="text-amber-400 font-bold text-base">{aiEvaluation.score}/10</strong>
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed font-light">{aiEvaluation.feedback}</p>

                      {/* Complexity Analysis */}
                      {aiEvaluation.complexity && (
                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                            <span className="text-slate-500 text-[10px] block">Time Complexity:</span>
                            <span className="text-amber-300 font-bold">{aiEvaluation.complexity.timeComplexity}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                            <span className="text-slate-500 text-[10px] block">Space Complexity:</span>
                            <span className="text-emerald-300 font-bold">{aiEvaluation.complexity.spaceComplexity}</span>
                          </div>
                        </div>
                      )}

                      {/* Strengths & Improvements */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {aiEvaluation.strengths?.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                            <span className="font-bold text-emerald-400 text-[10px] uppercase font-mono block">Key Strengths</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                              {aiEvaluation.strengths.map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiEvaluation.improvements?.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                            <span className="font-bold text-amber-400 text-[10px] uppercase font-mono block">Areas to Improve</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                              {aiEvaluation.improvements.map((imp: string, i: number) => (
                                <li key={i}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Guest Claim XP Banner */}
                      {!user && aiEvaluation.passed && (
                        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                          <div>
                            <span className="font-bold block text-emerald-300">🎉 Solution Verified (+{xpValue} XP)!</span>
                            <span className="text-[11px] opacity-90 text-emerald-200">Sign in to permanently save your progress and unlock the reference architecture.</span>
                          </div>
                          <button
                            onClick={() => openAuthModal("login")}
                            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                          >
                            Log In & Claim XP
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PRODUCTION REFERENCE ARCHITECTURE (STRICTLY GATED) */}
              {outputTab === "reference" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className={`w-4 h-4 ${isSolutionUnlocked ? "text-emerald-400" : "text-amber-400"}`} />
                      <h3 className="font-bold text-white text-sm">Official Production Architecture</h3>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${isSolutionUnlocked ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
                      {isSolutionUnlocked ? "Unlocked" : "Gated"}
                    </span>
                  </div>

                  {!user ? (
                    <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                      <Lock className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                      <h4 className="text-sm font-bold text-white">Reference Code is Gated</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Reference code is protected to ensure authentic interview practice. Pass the test suite and sign in to unlock the production implementation.
                      </p>
                      <button
                        onClick={() => openAuthModal("login")}
                        className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Sign In to Unlock
                      </button>
                    </div>
                  ) : !isSolved ? (
                    <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                      <Lock className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                      <h4 className="text-sm font-bold text-white">Solve Challenge to Unlock</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        You are signed in as <strong className="text-slate-200">{user.email || user.displayName || "Candidate"}</strong>. Complete your code in <code className="text-amber-300 font-mono">Solution.tsx</code> and click <strong>Run Tests & Submit</strong> to pass verification and reveal this production solution.
                      </p>
                    </div>
                  ) : (
                    <CodeViewerSection
                      slug={project.id}
                      title={project.title}
                      category={project.category}
                      skills={project.skills}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default DynamicTaskClient;

