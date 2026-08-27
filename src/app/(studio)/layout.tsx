import React, { ReactNode } from "react";
import StudioNav from "@/components/studio/StudioNav";
import GlobalFooter from "@/components/common/GlobalFooter";
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
      <GlobalFooter />
    </div>
  );
}
