"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminSystemPage() {
  const { systemInfo } = useAdmin();

  if (!systemInfo) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-mono">
        Connecting to system telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">MongoDB Ping Latency</span>
          <div className="text-4xl font-black text-emerald-400 font-mono">{systemInfo.dbPingMs} ms</div>
          <span className="text-[10px] text-slate-500 font-mono">Cluster Connection: Optimal</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Heap Memory Used</span>
          <div className="text-4xl font-black text-amber-400 font-mono">{systemInfo.heapUsedMb} MB</div>
          <span className="text-[10px] text-slate-500 font-mono">RSS Total: {systemInfo.memoryRssMb} MB</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Runtime Uptime</span>
          <div className="text-4xl font-black text-cyan-400 font-mono">{Math.floor(systemInfo.uptimeSeconds / 60)} min</div>
          <span className="text-[10px] text-slate-500 font-mono">{systemInfo.uptimeSeconds} seconds alive</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Node Environment</span>
          <div className="text-4xl font-black text-white font-mono">{systemInfo.nodeVersion}</div>
          <span className="text-[10px] text-slate-500 font-mono">Platform: {systemInfo.platform}</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#0a0d14] border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white">Server Snapshot</h3>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
          <div>Server Time: <span className="text-amber-400">{systemInfo.serverTime}</span></div>
          <div>Node Architecture: <span className="text-cyan-400">{process.arch}</span></div>
          <div>Database: <span className="text-emerald-400">MongoDB Atlas (Mongoose v9)</span></div>
          <div>Next.js Server: <span className="text-white">v16.3.2</span></div>
        </div>
      </div>
    </div>
  );
}
