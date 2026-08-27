"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Flame,
  Zap,
  CheckCircle2,
  Bookmark,
  Shield,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit3,
  Github,
  Linkedin,
  Trophy,
  Code2,
  Clock,
  Layers,
  Save,
  Check,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import StudioNav from "@/components/studio/StudioNav";
import GlobalFooter from "@/components/common/GlobalFooter";
import { LEARNING_PROJECTS, LearningProject } from "@/data/learningProjects";

export default function ProfilePage() {
  const {
    user,
    mongoUser,
    loading,
    isAuthenticated,
    openAuthModal,
    refreshProfile,
    toggleTaskBookmark,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"completed" | "bookmarked">("completed");
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(mongoUser?.bio || "");
  const [editRole, setEditRole] = useState(mongoUser?.targetRole || "Frontend Engineer");
  const [editGithub, setEditGithub] = useState(mongoUser?.githubUrl || "");
  const [editLinkedin, setEditLinkedin] = useState(mongoUser?.linkedinUrl || "");
  const [saving, setSaving] = useState(false);

  // Challenge computations
  const completedSlugs = mongoUser?.completedTasks || [];
  const bookmarkedSlugs = mongoUser?.bookmarkedTasks || [];

  const completedProjects = LEARNING_PROJECTS.filter((p) =>
    completedSlugs.includes(p.id)
  );
  const bookmarkedProjects = LEARNING_PROJECTS.filter((p) =>
    bookmarkedSlugs.includes(p.id)
  );

  const juniorSolved = completedProjects.filter((p) => p.level === "beginner").length;
  const midSolved = completedProjects.filter((p) => p.level === "intermediate").length;
  const seniorSolved = completedProjects.filter((p) => p.level === "expert").length;

  const totalSolved = completedProjects.length;
  const totalPercent = Math.round((totalSolved / 100) * 100);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          bio: editBio,
          targetRole: editRole,
          githubUrl: editGithub,
          linkedinUrl: editLinkedin,
        }),
      });
      await refreshProfile();
      setIsEditing(false);
    } catch (e) {
      console.error("Save profile error:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between">
        <StudioNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <GlobalFooter />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
        <StudioNav />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#0d1117] border border-amber-500/20 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Developer Profile</h1>
            <p className="text-xs text-slate-400 mb-6">
              Sign in to view your solved challenges, streak stats, bookmarks, and developer milestones.
            </p>
            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Sign In with Google / Email
            </button>
          </div>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  const displayName =
    mongoUser?.displayName || user.displayName || user.email?.split("@")[0] || "Developer";
  const xp = mongoUser?.xp || 0;
  const streak = mongoUser?.streak?.current || 1;
  const role = mongoUser?.role || "user";

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
      <StudioNav />

      <main className="flex-1 max-w-6xl w-[92%] lg:w-[85%] mx-auto py-10 space-y-8">
        {/* Profile Hero Card */}
        <section className="relative overflow-hidden bg-[#0d1117] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User Details */}
            <div className="flex items-center gap-5">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg shadow-amber-500/10"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-3xl flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-500/10">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {displayName}
                  </h1>
                  {mongoUser?.username && (
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      @{mongoUser.username}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {role === "admin" ? "Admin Architect" : "Frontend Engineer"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2.5 flex-wrap mt-2 text-xs">
                  <span className="text-amber-400 font-bold">{mongoUser?.targetRole || "Frontend Engineer"}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-medium capitalize">{mongoUser?.experienceLevel || "Junior"} Tier</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400 font-light">{mongoUser?.primaryFocus || "Machine Coding"}</span>
                </div>

                {/* Social Badges */}
                <div className="flex items-center gap-3 mt-3">
                  {mongoUser?.githubUrl && (
                    <a
                      href={mongoUser.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {mongoUser?.linkedinUrl && (
                    <a
                      href={mongoUser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {mongoUser?.portfolioUrl && (
                    <a
                      href={mongoUser.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setEditBio(mongoUser?.bio || "");
                  setEditRole(mongoUser?.targetRole || "Frontend Engineer");
                  setEditGithub(mongoUser?.githubUrl || "");
                  setEditLinkedin(mongoUser?.linkedinUrl || "");
                  setIsEditing(!isEditing);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-all shadow-sm flex-1 md:flex-initial"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
              </button>
            </div>
          </div>

          {/* Bio Preview */}
          {!isEditing && mongoUser?.bio && (
            <p className="mt-4 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {mongoUser.bio}
            </p>
          )}

          {/* Inline Edit Form */}
          <AnimatePresence>
            {isEditing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveProfile}
                className="mt-6 pt-6 border-t border-slate-800 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Role</label>
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      placeholder="https://github.com/yourhandle"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell us about your machine coding journey..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalSolved} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
              <div className="text-xs text-slate-400 font-medium">Challenges Solved</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{xp} <span className="text-xs text-slate-500 font-normal">XP</span></div>
              <div className="text-xs text-slate-400 font-medium">Developer Score</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{streak} <span className="text-xs text-slate-500 font-normal">Days</span></div>
              <div className="text-xs text-slate-400 font-medium">Active Streak</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{bookmarkedProjects.length}</div>
              <div className="text-xs text-slate-400 font-medium">Bookmarked Tasks</div>
            </div>
          </div>
        </section>

        {/* 3-Track Curriculum Progress Breakdown */}
        <section className="bg-[#0d1117] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Curriculum Mastery Breakdown</h2>
              <p className="text-xs text-slate-400">Progress across all 3 Machine Coding Interview Tiers</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-amber-400">{totalPercent}%</span>
              <span className="text-xs text-slate-500 block">Overall Mastery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Junior Track */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Track 1: SDE-1 / Junior
                </span>
                <span className="text-xs font-mono text-slate-400">{juniorSolved} / 40</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${(juniorSolved / 40) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">DOM manipulators, state hooks, interactive games & forms.</p>
            </div>

            {/* Mid-Level Track */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Track 2: SDE-2 / Mid-Level
                </span>
                <span className="text-xs font-mono text-slate-400">{midSolved} / 35</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${(midSolved / 35) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">Custom hooks, virtualization, REST caching, DnD, and typeahead.</p>
            </div>

            {/* Senior Track */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Track 3: Senior / Architect
                </span>
                <span className="text-xs font-mono text-slate-400">{seniorSolved} / 25</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${(seniorSolved / 25) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">100k virtual tables, React profiler, Web Workers, AST parsers.</p>
            </div>
          </div>
        </section>

        {/* Tabbed Challenges Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "completed"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white bg-slate-900/60"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Solved Tasks ({completedProjects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("bookmarked")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "bookmarked"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white bg-slate-900/60"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmarks ({bookmarkedProjects.length})</span>
              </button>
            </div>

            <Link
              href="/tasks"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Explore All 100</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tab Content */}
          {activeTab === "completed" && (
            <div>
              {completedProjects.length === 0 ? (
                <div className="text-center py-16 bg-[#0d1117] border border-slate-800 rounded-3xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">No solved challenges yet</h3>
                  <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">
                    Dive into the 100 machine coding challenges and click &quot;Mark as Solved&quot; to build your portfolio.
                  </p>
                  <Link
                    href="/tasks"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20"
                  >
                    <span>Browse 100 Challenges</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/${p.id}`}
                      className="group p-5 rounded-2xl bg-[#0d1117] hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              p.level === "beginner"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : p.level === "intermediate"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}
                          >
                            {p.level}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Solved</span>
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                        <span>Challenge #{p.id}</span>
                        <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                          Launch <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookmarked" && (
            <div>
              {bookmarkedProjects.length === 0 ? (
                <div className="text-center py-16 bg-[#0d1117] border border-slate-800 rounded-3xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">No bookmarked tasks yet</h3>
                  <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">
                    Click the bookmark icon on any challenge page to save it for interview practice.
                  </p>
                  <Link
                    href="/tasks"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20"
                  >
                    <span>Browse Challenges</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="group p-5 rounded-2xl bg-[#0d1117] hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-sm relative"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              p.level === "beginner"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : p.level === "intermediate"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}
                          >
                            {p.level}
                          </span>
                          <button
                            onClick={() => toggleTaskBookmark(p.id)}
                            className="text-amber-400 hover:text-amber-300 p-1"
                            title="Remove Bookmark"
                          >
                            <Bookmark className="w-4 h-4 fill-amber-400" />
                          </button>
                        </div>
                        <Link href={`/${p.id}`}>
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                            {p.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                        <span>Challenge #{p.id}</span>
                        <Link
                          href={`/${p.id}`}
                          className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold"
                        >
                          Launch <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
