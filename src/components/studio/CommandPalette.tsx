"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  icon: string | React.ReactNode;
  levelColor: string;
  levelLabel: string;
  skills?: string[];
}

const STUDIO_LABS: SearchableItem[] = [
  {
    id: "lab-performance",
    title: "⚡ Performance & Profiler Lab",
    description: "10k-Row Virtualization benchmark, React Tree Profiler & live Web Vitals HUD",
    category: "Studio Lab",
    path: "/performance",
    icon: "⚡",
    levelColor: "border-emerald-500/50 text-emerald-400 bg-emerald-950/30",
    levelLabel: "Enterprise Lab",
    skills: ["Virtualization", "Performance", "Web Vitals", "Profiler"],
  },
  {
    id: "lab-incidents",
    title: "🚨 Production Incident Simulator",
    description: "8 interactive postmortems (Memory leaks, hydration mismatch, race conditions)",
    category: "Studio Lab",
    path: "/incidents",
    icon: "🚨",
    levelColor: "border-rose-500/50 text-rose-400 bg-rose-950/30",
    levelLabel: "Postmortems",
    skills: ["Debugging", "Memory Leaks", "Hydration", "Race Conditions"],
  },
  {
    id: "lab-playground",
    title: "📝 Live React 19 Playground",
    description: "Interactive code editor with isolated sandbox runner, Console & A11y HUD",
    category: "Studio Lab",
    path: "/playground",
    icon: "📝",
    levelColor: "border-indigo-500/50 text-indigo-400 bg-indigo-950/30",
    levelLabel: "Sandbox",
    skills: ["Live Editor", "Iframe Sandbox", "Accessibility", "A11y"],
  },
  {
    id: "lab-case-study",
    title: "📄 Architectural Case Study",
    description: "Deep dive into the 10-year senior frontend engineering transformation",
    category: "Studio Lab",
    path: "/case-study",
    icon: "📄",
    levelColor: "border-purple-500/50 text-purple-400 bg-purple-950/30",
    levelLabel: "Architecture",
    skills: ["System Design", "ADR", "Testing", "Case Study"],
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const allItems: SearchableItem[] = [
    ...STUDIO_LABS,
    ...LEARNING_PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      path: p.path,
      icon: p.icon,
      levelColor: p.levelColor,
      levelLabel: p.levelLabel,
      skills: p.skills,
    })),
  ];

  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.skills?.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search projects (e.g. 'todo', 'calculator', 'api')..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-base font-medium"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-[380px] overflow-y-auto space-y-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No projects matching &quot;{query}&quot;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                          : "hover:bg-slate-800/60 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-base">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            {item.title}
                            <span className={`text-[10px] px-2 py-0.2 rounded-full border font-bold ${item.levelColor}`}>
                              {item.levelLabel}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">
                        {item.path}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>Navigation: Click or Enter</span>
              <span>ESC to Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
