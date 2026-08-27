"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, Home, Compass, AlertTriangle, ArrowRight } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log runtime errors for diagnostics
    console.error("ReactForge Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl border border-red-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center relative z-10 space-y-6">
        {/* Top Warning Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-lg animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-red-950 to-slate-900 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        {/* Brand & Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-mono">
            <span>Runtime Exception</span>
            {error.digest && (
              <>
                <span>•</span>
                <span>Digest: {error.digest.slice(0, 8)}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Something Went Wrong in the Forge
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            An unexpected error occurred during component lifecycle execution. The error has been captured and safely contained.
          </p>
        </div>

        {/* Error Details Accordion/Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-1 overflow-hidden">
          <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
            Exception Message
          </span>
          <p className="text-xs font-mono text-slate-300 break-words leading-relaxed">
            {error.message || "An unknown rendering error occurred."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-render Component</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs transition-all"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Hub</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>100 Tasks Curriculum</span>
          </Link>

          <a
            href="https://www.sanketkedare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Architected by Sanket Kedare</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
