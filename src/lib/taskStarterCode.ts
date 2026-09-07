// Comprehensive Starter Boilerplate Generator for ReactForge 100 Tasks
import { LearningProject } from "@/data/learningProjects";

export function getTaskStarterCode(project?: LearningProject): string {
  if (!project) {
    return `import React, { useState } from "react";

export default function CustomChallenge() {
  const [state, setState] = useState("");

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold">Custom React Component</h2>
      <p className="text-slate-400">Implement your solution here...</p>
    </div>
  );
}`;
  }

  const componentName = project.id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return `import React, { useState, useEffect, useMemo, useCallback } from "react";

/**
 * 🛠️ Machine Coding Challenge: ${project.title}
 * 🎯 Track: ${project.level.toUpperCase()} (${project.estimatedMinutes} mins)
 * 📂 Category: ${project.category}
 * 🔑 Key Skills: ${project.skills.join(", ")}
 * 
 * 📋 Requirements & Evaluation Criteria:
 * 1. Implement declarative state management without redundant effects.
 * 2. Maintain strict TypeScript typing.
 * 3. Ensure accessible semantic HTML with keyboard navigation (WCAG 2.1 AA).
 * 4. Handle edge cases (empty states, rapid clicks, component unmount).
 */

export default function ${componentName}() {
  // TODO: Define your component state here
  const [isActive, setIsActive] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  // TODO: Implement handlers and business logic
  const handleAction = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-amber-400">
          ${project.title}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ${project.description}
        </p>
      </div>

      {/* Interactive Controls & Workspace */}
      <div className="space-y-3 py-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type input here..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handleAction}
            className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-semibold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>

        {/* Live Output Feedback */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
          <div>Status: <span className={isActive ? "text-emerald-400 font-bold" : "text-slate-500"}>{isActive ? "ACTIVE" : "IDLE"}</span></div>
          <div>Current Value: &quot;{value || "none"}&quot;</div>
        </div>
      </div>
    </div>
  );
}
`;
}
