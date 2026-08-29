"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminAiTelemetryPage() {
  const { stats, guestsList, executeAdminAction } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Authenticated Developer AI Messages</span>
          <div className="text-4xl font-black text-white">{stats?.totalAiMessagesToday || 0}</div>
          <span className="text-[10px] text-slate-500 font-mono">Server Quota Cap: 100/day/user (MongoDB)</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Guest IP Devices Tracked</span>
          <div className="text-4xl font-black text-amber-400">{stats?.totalGuests || 0}</div>
          <span className="text-[10px] text-slate-500 font-mono">Collection: GuestUsage (Max 3/IP)</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Guest Prompts Executed</span>
          <div className="text-4xl font-black text-cyan-400">{stats?.guestAiMessages || 0}</div>
          <span className="text-[10px] text-slate-500 font-mono">Conversion driver for new signups</span>
        </div>
      </div>

      {/* Guest Devices Telemetry Table */}
      <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Unauthenticated Guest Device Logs (MongoDB)</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Collection: GuestUsage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-3">Device / IP Address</th>
                <th className="p-3">Chats Used (Max 3)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Active Timestamp</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {guestsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No guest IP queries recorded in MongoDB.
                  </td>
                </tr>
              ) : (
                guestsList.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-slate-300 font-semibold">{g.ip}</td>
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {g.count} / 3
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          g.count >= 3
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {g.count >= 3 ? "Locked (3/3)" : "Active"}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] text-slate-500 font-mono">
                      {new Date(g.updatedAt || g.lastUsedAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => executeAdminAction("reset_guest_ip", { targetIp: g.ip })}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-red-500/20 hover:text-red-300 border border-slate-800 text-[10px] font-mono font-semibold transition-all"
                      >
                        Clear IP Quota
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
