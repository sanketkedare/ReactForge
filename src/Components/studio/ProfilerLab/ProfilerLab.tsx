"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Toggle } from "../ui/Toggle";
import { MetricCard } from "../ui/MetricCard";
import { Activity, Zap, Play, RotateCcw, Cpu, Clock, Layers, Sparkles } from "lucide-react";
import { useProfiler } from "@/context/ProfilerContext";
import ProjectHeader from "@/components/common/ProjectHeader";

const NODE_COUNT = 600;

export const ProfilerLab: React.FC = () => {
  const { isOptimized, toggleOptimization, recordRender } = useProfiler();

  const [nodes, setNodes] = useState<{ id: number; val: number }[]>(() =>
    Array.from({ length: NODE_COUNT }, (_, i) => ({ id: i, val: 0 }))
  );
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [parentCounter, setParentCounter] = useState<number>(0);
  const [renderCountTotal, setRenderCountTotal] = useState<number>(0);

  // Optimized click handler (useCallback)
  const handleOptimizedClick = useCallback((id: number) => {
    setActiveNodeId(id);
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, val: n.val + 1 } : n))
    );
    setRenderCountTotal((prev) => prev + 1);
  }, []);

  // Unoptimized click handler (creates new closure every time)
  const handleUnoptimizedClick = (id: number) => {
    setActiveNodeId(id);
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, val: n.val + 1 } : n))
    );
    // In unoptimized mode, parent state triggers all 600 nodes
    setRenderCountTotal((prev) => prev + NODE_COUNT);
  };

  const fireContinuousStressTest = () => {
    let count = 0;
    const interval = setInterval(() => {
      const randomId = Math.floor(Math.random() * NODE_COUNT);
      if (isOptimized) {
        handleOptimizedClick(randomId);
      } else {
        handleUnoptimizedClick(randomId);
        setParentCounter((p) => p + 1);
      }
      count++;
      if (count >= 30) clearInterval(interval);
    }, 30);
  };

  const handleReset = () => {
    setNodes(Array.from({ length: NODE_COUNT }, (_, i) => ({ id: i, val: 0 })));
    setActiveNodeId(null);
    setParentCounter(0);
    setRenderCountTotal(0);
  };

  return (
    <React.Profiler
      id="ProfilerLabStudio"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) =>
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime)
      }
    >
      <div>
        <ProjectHeader
          title="Real-Time Performance Profiler & Optimization Lab"
          description="Benchmark React commit durations and cascading re-renders across 600 nodes. Switch live between unmemoized anonymous closures and optimized React.memo selector isolation."
          level="expert"
          category="Performance & Profiling"
          concepts={["React.Profiler onRender", "React.memo", "useCallback", "Selector Colocation", "VDOM Diffing"]}
          estimatedMinutes={45}
        />
        <div className="w-full px-6 lg:px-12 pb-12 space-y-8">
        {/* Quick Actions Bar */}
        <div className="flex justify-end items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            onClick={fireContinuousStressTest}
            className="font-bold"
          >
            <Play className="w-4 h-4 mr-2" /> Run Stress Test (30 Bursts)
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset Grid
          </Button>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Active Architecture"
            value={isOptimized ? "Optimized" : "Unoptimized"}
            subValue={isOptimized ? "React.memo + useCallback" : "Anonymous closures"}
            icon={<Zap className="w-4 h-4 text-indigo-400" />}
            status={isOptimized ? "good" : "danger"}
          />
          <MetricCard
            label="Total Node Renders"
            value={renderCountTotal}
            subValue={isOptimized ? "Target 1 node / click" : "Cascades all 600 nodes / click"}
            icon={<Activity className="w-4 h-4 text-amber-400" />}
            status={isOptimized ? "good" : "danger"}
          />
          <MetricCard
            label="Matrix Node Count"
            value={NODE_COUNT}
            icon={<Layers className="w-4 h-4 text-sky-400" />}
            status="neutral"
          />
          <MetricCard
            label="Active Node"
            value={activeNodeId !== null ? `#${activeNodeId}` : "None"}
            icon={<Sparkles className="w-4 h-4 text-purple-400" />}
            status="good"
          />
        </div>

        {/* Optimization Master Split Switch */}
        <Card className="border-indigo-900/50 bg-indigo-950/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-base text-indigo-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Split Architecture Engine: {isOptimized ? "Memoized Mode" : "Unmemoized Cascade Mode"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Switch between <strong>Optimized</strong> (React.memo + useCallback selector isolation) and <strong>Unoptimized</strong> (inline closures and parent state cascade) to observe the live React.Profiler telemetry reaction.
                </CardDescription>
              </div>
              <Toggle
                checked={isOptimized}
                onChange={toggleOptimization}
                label={isOptimized ? "Optimization ON" : "Optimization OFF"}
                size="md"
              />
            </div>
          </CardHeader>
        </Card>

        {/* 600-Node Stress Test Grid */}
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                600-Node Interactive Stress Test Grid
              </CardTitle>
              <span className="text-xs font-mono text-slate-400">
                Click any cell to trigger a render commit
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-30 gap-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
              {nodes.map((node) =>
                isOptimized ? (
                  <OptimizedCell
                    key={node.id}
                    id={node.id}
                    val={node.val}
                    isActive={node.id === activeNodeId}
                    onClick={handleOptimizedClick}
                  />
                ) : (
                  <UnoptimizedCell
                    key={node.id}
                    id={node.id}
                    val={node.val}
                    isActive={node.id === activeNodeId}
                    onClick={() => handleUnoptimizedClick(node.id)}
                    parentCounter={parentCounter}
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </React.Profiler>
  );
};

// Optimized Cell: Wrapped in React.memo with stable callback
const OptimizedCell: React.FC<{
  id: number;
  val: number;
  isActive: boolean;
  onClick: (id: number) => void;
}> = React.memo(({ id, val, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`h-7 w-full rounded-md border text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
        isActive
          ? "bg-emerald-500 text-slate-950 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30"
          : val > 0
          ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white"
      }`}
      title={`Optimized Cell #${id} (Renders only on own click)`}
    >
      {val > 0 ? val : id}
    </button>
  );
});

OptimizedCell.displayName = "OptimizedCell";

// Unoptimized Cell: No React.memo, receives parent counter forcing re-render
const UnoptimizedCell: React.FC<{
  id: number;
  val: number;
  isActive: boolean;
  onClick: () => void;
  parentCounter: number;
}> = ({ id, val, isActive, onClick, parentCounter }) => {
  return (
    <button
      onClick={onClick}
      className={`h-7 w-full rounded-md border text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
        isActive
          ? "bg-rose-500 text-white border-rose-400 scale-110 shadow-lg shadow-rose-500/30"
          : val > 0
          ? "bg-amber-600/30 border-amber-500/50 text-amber-300"
          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white"
      }`}
      title={`Unoptimized Cell #${id} (Re-renders on every parent change! Counter: ${parentCounter})`}
    >
      {val > 0 ? val : id}
    </button>
  );
};

export default ProfilerLab;
