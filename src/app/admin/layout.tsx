"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Users,
  Bot,
  Layers,
  Mail,
  Activity,
  Server,
  Lock,
  LogOut,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AdminProvider, useAdmin } from "@/context/AdminContext";

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, mongoUser, loading: authLoading, isAdmin, logout } = useAuth();
  const {
    stats,
    systemInfo,
    loading,
    feedbackMsg,
    setFeedbackMsg,
    fetchAdminData,
    selectedUser,
    setSelectedUser,
    executeAdminAction,
  } = useAdmin();

  // Auth Loading
  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-[#05070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono tracking-wider">Authenticating Admin Architect...</span>
        </div>
      </div>
    );
  }

  // Access Denied Screen
  if (!isAdmin) {
    return (
      <div className="h-screen w-screen bg-[#05070a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0d1117] border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Access Restricted</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This Control Center is strictly reserved for <strong>ReactForge Admin Architects</strong>. Your current account ({user?.email || "Guest"}) does not have elevated privileges.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to ReactForge Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Overview & KPIs", icon: Activity, count: null },
    { href: "/admin/users", label: "Developers & XP", icon: Users, count: stats?.totalUsers },
    { href: "/admin/ai", label: "AI Telemetry", icon: Bot, count: stats?.totalAiMessagesToday },
    { href: "/admin/curriculum", label: "100 Tasks Matrix", icon: Layers, count: stats?.totalTasksCompleted },
    { href: "/admin/emails", label: "Email Audit", icon: Mail, count: stats?.failedEmailsCount, alert: (stats?.failedEmailsCount || 0) > 0 },
    { href: "/admin/system", label: "System & Health", icon: Server, count: null },
  ];

  return (
    <div className="h-screen max-h-screen w-screen max-w-[100vw] bg-[#05070a] text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">
      {/* Top Full-Width Glass Header */}
      <header className="shrink-0 w-full bg-[#07090e]/95 backdrop-blur-2xl border-b border-slate-800/80 px-4 lg:px-8 py-3 z-40">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5 shadow-sm"
              title="Return to Hub"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">ReactForge Hub</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-red-500/20 via-slate-900 to-slate-950 border border-red-500/40 p-2 flex items-center justify-center shadow-lg shadow-red-500/10">
                <ShieldAlert className="w-full h-full text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-white tracking-tight">
                    React<span className="text-amber-400">Forge</span> Command Center
                  </h1>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono font-bold uppercase tracking-wider">
                    SUPERADMIN
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span>{mongoUser?.email || user?.email}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live MongoDB Sync
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Live Telemetry Badge */}
            {systemInfo && (
              <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/70 border border-slate-800/80 px-3 py-1.5 rounded-xl">
                <span>⚡ Latency: <strong className="text-emerald-400">{systemInfo.dbPingMs}ms</strong></span>
                <span>•</span>
                <span>RAM: <strong className="text-amber-400">{systemInfo.heapUsedMb}MB</strong></span>
              </div>
            )}

            <button
              onClick={() => fetchAdminData()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 text-slate-300 text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold transition-all shadow-sm group"
              title="Sign Out of ReactForge"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full min-h-0 flex overflow-hidden">
        {/* Fixed-Width Left Navigation Sidebar */}
        <aside className="w-64 min-w-[16rem] max-w-[16rem] h-full shrink-0 bg-[#07090e] border-r border-slate-800/80 p-4 flex flex-col justify-between z-30 shadow-xl overflow-y-auto">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1">
              Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && item.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-slate-950/30 text-slate-950"
                          : item.alert
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Bottom Status & Sign Out */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/60 text-[11px] font-mono text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Curriculum:</span>
                <span className="text-white font-bold">100 Tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Daily AI Limit:</span>
                <span className="text-amber-400 font-bold">100 / User</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Guest IP Cap:</span>
                <span className="text-cyan-400 font-bold">3 / Device</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold transition-all shadow-sm group"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Page Canvas (Full Width & Independent Scrolling) */}
        <main className="flex-1 w-full min-w-0 p-4 lg:p-8 space-y-6 overflow-y-auto max-w-[1920px]">
          {/* Feedback Message Alert */}
          <AnimatePresence>
            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xl ${
                  feedbackMsg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedbackMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{feedbackMsg.text}</span>
                </div>
                <button onClick={() => setFeedbackMsg(null)}>
                  <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {children}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* SLIDEOVER DRAWER: DEEP DEVELOPER INSPECTOR */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-[#07090e] border-l border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  {selectedUser.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedUser.photoURL}
                      alt={selectedUser.displayName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-base flex items-center justify-center">
                      {selectedUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedUser.displayName}</h2>
                    <span className="text-xs text-amber-400 font-mono block">@{selectedUser.username || "dev"}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{selectedUser.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Developer Profile Overview Card */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="text-white font-bold">{selectedUser.targetRole || "Frontend Engineer"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Experience Tier:</span>
                  <span className="text-amber-400 font-bold">{selectedUser.experienceLevel?.toUpperCase() || "JUNIOR"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Primary Focus:</span>
                  <span className="text-cyan-400 font-semibold">{selectedUser.primaryFocus || "Machine Coding"}</span>
                </div>
                {selectedUser.bio && (
                  <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-900">
                    &ldquo;{selectedUser.bio}&rdquo;
                  </p>
                )}
              </div>

              {/* AI Quota & Manager */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Daily AI Usage</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {selectedUser.aiUsage?.count || 0} / 100
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min(100, ((selectedUser.aiUsage?.count || 0) / 100) * 100)}%` }}
                  />
                </div>
                <button
                  onClick={() => executeAdminAction("reset_user_ai", { targetUid: selectedUser.uid })}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Today&apos;s AI Limit</span>
                </button>
              </div>

              {/* XP Manager */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Manage XP Points</span>
                  <span className="text-sm font-black text-amber-400 font-mono">{selectedUser.xp} XP</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => executeAdminAction("adjust_xp", { targetUid: selectedUser.uid, xpDelta: 50 })}
                    className="py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 font-mono font-bold text-xs"
                  >
                    +50 XP
                  </button>
                  <button
                    onClick={() => executeAdminAction("adjust_xp", { targetUid: selectedUser.uid, xpDelta: 100 })}
                    className="py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-400 font-mono font-bold text-xs"
                  >
                    +100 XP
                  </button>
                  <button
                    onClick={() => executeAdminAction("adjust_xp", { targetUid: selectedUser.uid, xpDelta: -50 })}
                    className="py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 font-mono font-bold text-xs"
                  >
                    -50 XP
                  </button>
                </div>
              </div>

              {/* Solved Tasks List */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800/80 space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Completed Challenges</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {selectedUser.completedTasks?.length || 0}
                  </span>
                </div>

                {(!selectedUser.completedTasks || selectedUser.completedTasks.length === 0) ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No challenges completed yet.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedUser.completedTasks.map((t) => (
                      <div
                        key={t}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-slate-300">/{t}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
