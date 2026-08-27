"use client";

import React, { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import StudioNav from "@/components/studio/StudioNav";
import AIInterviewDrawer from "@/components/ai/AIInterviewDrawer";
import ProjectCodeSection from "@/components/common/ProjectCodeSection";
import GlobalFooter from "@/components/common/GlobalFooter";
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

      <GlobalFooter />
    </div>
  );
};

export default ProjectPageWrapper;
