import React, { ReactNode } from "react";
import StudioNav from "@/components/studio/StudioNav";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

export default function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#07090e] text-slate-200 flex flex-col selection:bg-amber-400 selection:text-slate-950 relative font-sans transition-colors">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      <StudioNav />

      {/* Main Container with pt-24 offset below navbar */}
      <main className="flex-1 w-full relative z-10 pt-24 pb-12">{children}</main>

      {/* Global Studio Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] py-8 px-6 lg:px-12 text-center text-xs text-slate-500 font-sans relative z-10 transition-colors">
        <div className="w-[92%] lg:w-[80%] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-400">
            React Lab — {LEARNING_PROJECTS.length} Practical Projects for{" "}
            <span className="text-slate-200 font-semibold">Developers of All Levels</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Next.js 16.3.2</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Port 3002</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
