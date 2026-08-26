"use client";

import React, { useState } from "react";
import { useProfiler } from "@/context/ProfilerContext";
import { Activity, Zap, Cpu, RefreshCw, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { Badge } from "./ui/Badge";
import { Toggle } from "./ui/Toggle";
import { formatDuration } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const PerformanceHUD: React.FC = () => {
  const {
    fps,
    memoryMB,
    isOptimized,
    toggleOptimization,
    totalRenders,
    metrics,
    resetMetrics,
  } = useProfiler();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getFpsColor = (val: number) => {
    if (val >= 55) return "text-emerald-400 border-emerald-500/40 bg-emerald-950/40";
    if (val >= 30) return "text-amber-400 border-amber-500/40 bg-amber-950/40";
    return "text-rose-400 border-rose-500/40 bg-rose-950/40";
  };

  const metricList = Object.values(metrics).sort(
    (a, b) => b.lastCommitTime - a.lastCommitTime
  );

  return (
    <aside aria-label="Performance Profiler Telemetry HUD" className="fixed bottom-5 right-5 z-50 select-none font-sans">
      <motion.div
        layout
        className="rounded-2xl border border-slate-700/80 bg-slate-950/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-slate-100 overflow-hidden w-[340px] md:w-[380px]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Telemetry HUD
                </span>
                <Badge
                  variant={isOptimized ? "success" : "warning"}
                  className="text-[10px] py-0 px-2 uppercase"
                >
                  {isOptimized ? "Optimized" : "Unoptimized"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={resetMetrics}
              title="Reset Render Counters"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Primary Metrics Strip */}
        <div className="p-3 grid grid-cols-3 gap-2 bg-slate-950/40">
          {/* FPS Gauge */}
          <div className={`p-2 rounded-xl border text-center ${getFpsColor(fps)}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              FPS
            </div>
            <div className="text-lg font-black font-mono">{fps}</div>
          </div>

          {/* Re-render Count */}
          <div className="p-2 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-indigo-300 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              Renders
            </div>
            <div className="text-lg font-black font-mono">{totalRenders}</div>
          </div>

          {/* Memory Heap */}
          <div className="p-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3" /> Heap
            </div>
            <div className="text-lg font-black font-mono">
              {memoryMB > 0 ? `${memoryMB}MB` : "--"}
            </div>
          </div>
        </div>

        {/* Global Optimization Toggle */}
        <div className="px-3.5 py-2.5 bg-indigo-950/30 border-y border-indigo-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap
              className={`w-4 h-4 ${
                isOptimized ? "text-emerald-400" : "text-amber-400"
              }`}
            />
            <span className="text-xs font-semibold text-slate-200">
              {isOptimized ? "Architecture Mode: Optimized" : "Architecture Mode: Raw/Unmemoized"}
            </span>
          </div>
          <Toggle
            checked={isOptimized}
            onChange={toggleOptimization}
            size="sm"
          />
        </div>

        {/* Expandable Profiler Breakdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3.5 border-t border-slate-800 space-y-2.5 max-h-[260px] overflow-y-auto"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Component Activity
                </span>
                <span>Last Commit</span>
              </div>

              {metricList.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 italic">
                  Interact with the studio to stream live React.Profiler telemetry.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {metricList.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate max-w-[190px]">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                        <span className="font-mono font-medium truncate text-slate-200">
                          {item.id}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                          ×{item.renderCount}
                        </span>
                      </div>
                      <span className="font-mono text-emerald-400 text-xs shrink-0">
                        {formatDuration(item.lastDuration)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};

export default PerformanceHUD;
