"use client";

import React, { useState, useMemo } from "react";
import { Mail, RotateCcw } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminEmailsPage() {
  const { failedEmails, handleRetryEmail, actionLoadingId } = useAdmin();

  const [emailStatusFilter, setEmailStatusFilter] = useState<string>("all");

  const filteredEmails = useMemo(() => {
    return failedEmails.filter((e) => {
      if (emailStatusFilter === "all") return true;
      return e.status === emailStatusFilter;
    });
  }, [failedEmails, emailStatusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-3xl bg-[#0a0d14] border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-white">Failed Email Dispatch Logs (MongoDB)</h3>
        </div>

        <div className="flex items-center gap-2">
          {["all", "failed", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setEmailStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                emailStatusFilter === s
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[#0a0d14] border border-slate-800/80 overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
            <tr>
              <th className="p-4">Recipient</th>
              <th className="p-4">Template</th>
              <th className="p-4">Error Message</th>
              <th className="p-4">Status & Attempts</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEmails.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500">
                  No failed email logs in database.
                </td>
              </tr>
            ) : (
              filteredEmails.map((log) => (
                <tr key={log._id} className="hover:bg-slate-900/40">
                  <td className="p-4">
                    <div className="font-bold text-white">{log.displayName}</div>
                    <span className="text-[10px] text-amber-400 font-mono">{log.toEmail}</span>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    {log.template}
                  </td>

                  <td className="p-4 max-w-sm truncate text-red-400 font-mono text-[10px]">
                    {log.errorMessage}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        log.status === "resolved"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {log.status} ({log.attempts}x)
                    </span>
                  </td>

                  <td className="p-4 text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRetryEmail(log._id)}
                      disabled={actionLoadingId === log._id || log.status === "resolved"}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-900 text-slate-950 disabled:text-slate-600 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${actionLoadingId === log._id ? "animate-spin" : ""}`} />
                      <span>Retry Send</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
