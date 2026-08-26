"use client";

import React, { useState } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus, Search, CheckCircle2 } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  category: string;
  content: string;
  codeSnippet?: string;
}

const ACCORDION_DATA: AccordionItem[] = [
  {
    id: "1",
    title: "How does the virtual DOM improve React rendering speed?",
    category: "Architecture",
    content:
      "React creates a lightweight in-memory representation of the actual DOM. When state changes occur, React computes a diff between the previous and new virtual DOM trees, updating only the changed DOM nodes instead of recalculating the entire page layout.",
    codeSnippet: "const element = <h1>Hello React 19</h1>;",
  },
  {
    id: "2",
    title: "What is the difference between useState and useRef?",
    category: "Hooks",
    content:
      "useState triggers a component re-render whenever the state updater function is called. In contrast, useRef holds a mutable .current property that persists across renders without triggering a re-render when mutated.",
    codeSnippet: "const countRef = useRef(0); // Mutating countRef.current does not re-render",
  },
  {
    id: "3",
    title: "When should you use useMemo vs useCallback?",
    category: "Performance",
    content:
      "useMemo memoizes the calculated result of an expensive function, whereas useCallback memoizes the function definition itself so that child components receiving it as a prop won't unnecessarily re-render.",
    codeSnippet: "const memoizedValue = useMemo(() => computeHeavy(a, b), [a, b]);",
  },
  {
    id: "4",
    title: "Why is state immutability mandatory in React?",
    category: "State",
    content:
      "React relies on shallow equality reference comparisons to detect state changes. If you mutate an existing array or object in place, the object reference remains identical, and React will skip rendering updates.",
    codeSnippet: "setItems(prev => [...prev, newItem]); // Clean immutable append",
  },
  {
    id: "5",
    title: "What are React 19 Server Actions and Transitions?",
    category: "React 19",
    content:
      "React 19 Server Actions enable async functions to run directly on the server from client form triggers. useTransition enables developers to mark state updates as non-blocking transitions, keeping user interactions smooth.",
    codeSnippet: "const [isPending, startTransition] = useTransition();",
  },
];

export default function AccordionPage() {
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [openIds, setOpenIds] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleItem = (id: string) => {
    if (multiSelect) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const handleExpandAll = () => {
    setOpenIds(ACCORDION_DATA.map((i) => i.id));
  };

  const handleCollapseAll = () => {
    setOpenIds([]);
  };

  const filteredItems = ACCORDION_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Accordion & Multi-Collapse"
        description="Build an interactive accordion component supporting single-active vs multi-collapse modes, live search filtering, and smooth height transitions."
        level="beginner"
        category="UI Components"
        skills={["Array State Toggling", "Framer Motion Height Transitions", "Search Filtering"]}
        estimatedMinutes={20}
        whatYouWillBuild="A FAQ / Interview Q&A accordion that seamlessly switches between single-item expand and multi-expand with animated collapse transitions."
        keyTakeaways={[
          "Toggling between single ID state and array ID state for multi-select",
          "Using AnimatePresence and height: 'auto' for smooth expand/collapse animations",
          "Handling dynamic search queries across titles, categories, and answers",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            {/* Mode Switcher */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-300">
                Multi-Expand Mode:
              </label>
              <button
                onClick={() => {
                  setMultiSelect(!multiSelect);
                  // If switching to single mode and multiple are open, keep only the first open
                  if (multiSelect && openIds.length > 1) {
                    setOpenIds([openIds[0]]);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  multiSelect
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {multiSelect ? "Enabled (Multiple Open)" : "Disabled (Single Open)"}
              </button>
            </div>

            {/* Expand / Collapse All */}
            <div className="flex items-center gap-2 font-sans">
              <button
                onClick={handleExpandAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Expand All</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-400 outline-none focus:border-amber-400 transition-colors shadow-inner"
            />
          </div>

          {/* Accordion Items List */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 rounded-3xl border border-slate-800">
                No matching questions found for &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isOpen = openIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-amber-500/40 bg-slate-900/80 shadow-lg shadow-black/40"
                        : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                          {item.category}
                        </span>
                        <h3 className="font-semibold text-sm text-white">
                          {item.title}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-slate-400 flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    {/* Accordion Collapsible Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 pt-1 space-y-3 text-xs text-slate-300 font-light border-t border-slate-800/60 leading-relaxed">
                            <p>{item.content}</p>
                            {item.codeSnippet && (
                              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-200 overflow-x-auto">
                                <code>{item.codeSnippet}</code>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
