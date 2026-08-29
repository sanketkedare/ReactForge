"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Bot,
  Layers,
  Mail,
  Award,
  Zap,
  Radio,
  Send,
  Database,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminOverviewPage() {
  const { stats, topUsers, activityFeed, setSelectedUser, executeAdminAction, fetchAdminData } =
    useAdmin();

  const [testEmailInput, setTestEmailInput] = useState("");
  const [testEmailSending, setTestEmailSending] = useState(false);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailInput) return;
    setTestEmailSending(true);
    await executeAdminAction("send_test_email", { testEmail: testEmailInput });
    setTestEmailSending(false);
    setTestEmailInput("");
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Developers</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">{stats?.totalUsers || 0}</span>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/30">
              +{stats?.activeToday || 0} active today
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-900">
            <span>👑 Admins: {stats?.roles?.admin || 0}</span>
            <span>•</span>
            <span>⚡ Pro: {stats?.roles?.pro || 0}</span>
            <span>•</span>
            <span>👤 Users: {stats?.roles?.user || 0}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Chats Dispatched Today</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">{stats?.totalAiMessagesToday || 0}</span>
            <span className="text-xs text-cyan-400 font-mono">queries (100 cap)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-900">
            <span>🌐 Guest IP Queries: {stats?.guestAiMessages || 0}</span>
            <span>•</span>
            <span>Devices: {stats?.totalGuests || 0}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasks Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">{stats?.totalTasksCompleted || 0}</span>
            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/30">
              {stats?.totalXP || 0} Total XP ⭐
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-900">
            <span>🟢 SDE-1: {stats?.trackBreakdown?.beginner.solved || 0}</span>
            <span>•</span>
            <span>🟡 SDE-2: {stats?.trackBreakdown?.intermediate.solved || 0}</span>
            <span>•</span>
            <span>🟣 SDE-3: {stats?.trackBreakdown?.expert.solved || 0}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-3 relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failed Email Delivery</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${(stats?.failedEmailsCount || 0) > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {stats?.failedEmailsCount || 0}
            </span>
            <span className="text-xs text-slate-400 font-mono">logged in MongoDB</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-900">
            <span>Audit Model: FailedEmail</span>
          </div>
        </div>
      </div>

      {/* 3-Column Command Grid: Leaderboard, Activity Feed, Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Developer Leaderboard */}
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Top Developer Leaderboard</h3>
            </div>
            <Link
              href="/admin/users"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Inspect all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {topUsers.slice(0, 5).map((u, i) => (
              <div
                key={u.uid}
                onClick={() => setSelectedUser(u)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/60 hover:border-amber-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center border ${
                      i === 0
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {u.displayName}
                      </span>
                      {u.role === "admin" && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      @{u.username || "dev"} • {u.completedTasks?.length || 0} solved
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">{u.xp} XP</span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    🔥 {u.streak?.current || 1}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Real-Time Activity Feed */}
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live Activity Stream</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Auto-synced</span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {activityFeed.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 flex items-start justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">{ev.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-[220px]">
                    {ev.subtitle}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {ev.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono block mb-1">
                      {ev.badge}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-600 font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Quick Admin Action Hub */}
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Quick Action Hub</h3>
          </div>

          {/* Send Test Email Tool */}
          <form onSubmit={handleSendTestEmail} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">Dispatch Test Welcome Email</span>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={testEmailInput}
                onChange={(e) => setTestEmailInput(e.target.value)}
                placeholder="recipient@domain.com"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={testEmailSending || !testEmailInput}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </div>
          </form>

          {/* Quick System Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fetchAdminData()}
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all text-xs font-semibold text-slate-300 hover:text-white"
            >
              <Database className="w-4 h-4 text-cyan-400 mb-1.5" />
              <div>Force Sync DB</div>
              <span className="text-[10px] text-slate-500 block font-normal">Pull fresh metrics</span>
            </button>

            <Link
              href="/admin/emails"
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all text-xs font-semibold text-slate-300 hover:text-white block"
            >
              <Mail className="w-4 h-4 text-red-400 mb-1.5" />
              <div>Audit Delivery</div>
              <span className="text-[10px] text-slate-500 block font-normal">Inspect error logs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
