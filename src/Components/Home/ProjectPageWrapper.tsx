"use client";

import React, { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import StudioNav from "@/components/studio/StudioNav";
import AIInterviewDrawer from "@/components/ai/AIInterviewDrawer";
import ProjectCodeSection from "@/components/common/ProjectCodeSection";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

interface ProjectPageWrapperProps {
  children: ReactNode;
}

export const ProjectPageWrapper: React.FC<ProjectPageWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  const currentProject = useMemo(() => {
    return LEARNING_PROJECTS.find(
      (p) => p.path === pathname || pathname.includes(p.id)
    );
  }, [pathname]);

  const slug = currentProject?.id || pathname.replace(/^\//, "");

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-slate-200 flex flex-col selection:bg-amber-400 selection:text-slate-950 relative transition-colors">
      <StudioNav />

      {/* Full width main container */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        {children}

        {/* Dedicated Code Section for Each Project (Left: Folder Tree, Right: Real Code, Initially Collapsed) */}
        {pathname !== "/" && pathname !== "/tasks" && pathname !== "/projects" && (
          <ProjectCodeSection
            slug={slug}
            title={currentProject?.title || "React Task"}
            category={currentProject?.category || "Frontend"}
          />
        )}
      </main>

      {/* Global AI Interview Assistant Drawer */}
      <AIInterviewDrawer
        taskTitle={currentProject?.title || "React Task"}
        category={currentProject?.category || "Frontend"}
        level={currentProject?.levelLabel || "Intermediate"}
        concepts={currentProject?.skills || []}
      />

      <footer className="border-t border-slate-800/80 bg-[#07090e] py-8 px-6 lg:px-12 text-center text-xs text-slate-500 font-sans transition-colors">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-400">
            ReactForge — Frontend Machine Coding Studio ({LEARNING_PROJECTS.length} Tasks)
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Next.js 16.3.2</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Gemini AI Integrated</span>
            <span>•</span>
            <span>Port 3002</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectPageWrapper;
