"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion } from "framer-motion";
import { Undo2, Redo2, RotateCcw, Palette, Type, Sparkles, History } from "lucide-react";

interface CanvasState {
  text: string;
  textColor: string;
  bgColor: string;
  fontSize: number;
  borderRadius: number;
}

const INITIAL_CANVAS: CanvasState = {
  text: "React 19 State Engine",
  textColor: "#FCD34D", // Amber
  bgColor: "#1E1B4B", // Indigo
  fontSize: 24,
  borderRadius: 24,
};

export default function UndoRedoPage() {
  const [past, setPast] = useState<CanvasState[]>([]);
  const [present, setPresent] = useState<CanvasState>(INITIAL_CANVAS);
  const [future, setFuture] = useState<CanvasState[]>([]);

  // Push new state onto the timeline
  const setCanvasState = useCallback(
    (newState: CanvasState) => {
      setPast((prev) => [...prev, present]);
      setPresent(newState);
      setFuture([]); // clear redo stack on new action
    },
    [present]
  );

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((prev) => [present, ...prev]);
    setPresent(previous);
    setPast(newPast);
  }, [past, present]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [future, present]);

  // Keyboard Shortcuts (Cmd+Z / Ctrl+Z, Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleReset = () => {
    setPast([]);
    setPresent(INITIAL_CANVAS);
    setFuture([]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Undo / Redo Time-Travel State (`useHistory`)"
        description="Build a time-travel state machine with past/present/future stacks, keyboard shortcuts (Cmd+Z, Cmd+Shift+Z), and timeline inspection."
        level="expert"
        category="State Architecture"
        skills={["Immutable Stacks", "History State Machine", "Keyboard Shortcuts (Cmd+Z)"]}
        estimatedMinutes={50}
        whatYouWillBuild="An interactive canvas designer where every style or text edit generates an undoable snapshot with bidirectional time-travel navigation."
        keyTakeaways={[
          "Structuring undo/redo with past, present, and future stack arrays",
          "Clearing the future stack whenever a new fork state is applied",
          "Binding global window keydown shortcuts for desktop usability",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Action Header & History Controls */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={past.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
                title="Undo (Cmd+Z)"
              >
                <Undo2 className="w-4 h-4 text-amber-400" />
                <span>Undo ({past.length})</span>
              </button>

              <button
                onClick={handleRedo}
                disabled={future.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo2 className="w-4 h-4 text-indigo-400" />
                <span>Redo ({future.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-500 font-mono">
                Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">⌘Z</kbd> to Undo, <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">⌘⇧Z</kbd> to Redo
              </span>
              <button
                onClick={handleReset}
                className="p-2.5 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Reset to Default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Canvas Preview */}
          <div className="p-12 rounded-3xl border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[260px] shadow-2xl">
            <motion.div
              layout
              style={{
                backgroundColor: present.bgColor,
                color: present.textColor,
                fontSize: `${present.fontSize}px`,
                borderRadius: `${present.borderRadius}px`,
              }}
              className="px-8 py-6 shadow-2xl font-bold text-center transition-all duration-200"
            >
              {present.text}
            </motion.div>
          </div>

          {/* Editor Controls Grid */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Text Input */}
            <div className="space-y-1.5">
              <label className="text-slate-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Canvas Text</span>
              </label>
              <input
                type="text"
                value={present.text}
                onChange={(e) => setCanvasState({ ...present, text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Font Size:</span>
                <span className="font-mono text-amber-300">{present.fontSize}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={48}
                value={present.fontSize}
                onChange={(e) => setCanvasState({ ...present, fontSize: Number(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Corner Radius Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Border Radius:</span>
                <span className="font-mono text-amber-300">{present.borderRadius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={present.borderRadius}
                onChange={(e) =>
                  setCanvasState({ ...present, borderRadius: Number(e.target.value) })
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Quick Themes */}
            <div className="space-y-1.5">
              <label className="text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Preset Themes</span>
              </label>
              <div className="flex items-center gap-2">
                {[
                  { bg: "#1E1B4B", text: "#FCD34D", name: "Amber & Indigo" },
                  { bg: "#064E3B", text: "#6EE7B7", name: "Emerald Forest" },
                  { bg: "#831843", text: "#FBCFE8", name: "Rose Ruby" },
                  { bg: "#0F172A", text: "#38BDF8", name: "Cyan Slate" },
                ].map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setCanvasState({ ...present, bgColor: t.bg, textColor: t.text })}
                    style={{ backgroundColor: t.bg, borderColor: t.text }}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-sm"
                    title={t.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
