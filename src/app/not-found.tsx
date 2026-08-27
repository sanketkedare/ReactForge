import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Home, Compass, ArrowRight, Search, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Task Not Found | ReactForge",
  description: "The requested machine coding challenge could not be found in the ReactForge directory.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.08)] text-center relative z-10 space-y-7">
        {/* Brand Icon & 404 Super-Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Image
              src="/ReactForge_Icon.png"
              alt="ReactForge Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>HTTP 404 — Missing Resource</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Lost in the <span className="text-amber-400">Forge</span>?
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-light">
            The machine coding challenge or workbench page you are looking for does not exist or has been relocated.
          </p>
        </div>

        {/* Quick Curriculum Jump Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Looking for a specific track?</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-medium text-slate-300">
            <Link
              href="/tasks?track=beginner"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/50 hover:text-emerald-300 transition-all text-center"
            >
              🟢 Junior SDE-1
            </Link>
            <Link
              href="/tasks?track=intermediate"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 hover:text-amber-300 transition-all text-center"
            >
              🟡 Mid SDE-2
            </Link>
            <Link
              href="/tasks?track=expert"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/50 hover:text-purple-300 transition-all text-center"
            >
              🟣 Senior SDE-3
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <Link
            href="/tasks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Explore 100 Challenges</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs transition-all"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>ReactForge Engine</span>
          <a
            href="https://www.sanketkedare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-400"
          >
            <span>by Sanket Kedare</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
