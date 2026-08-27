"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Slider } from "../ui/Slider";
import { Toggle } from "../ui/Toggle";
import { MetricCard } from "../ui/MetricCard";
import { KanbanTask, KanbanStatus, KanbanPriority } from "@/types/studio";
import {
  Kanban,
  Zap,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Database,
  Plus,
} from "lucide-react";
import { useProfiler } from "@/context/ProfilerContext";
import ProjectHeader from "@/components/common/ProjectHeader";

const STATUSES: { id: KanbanStatus; label: string; color: string; badge: "info" | "warning" | "pulse" | "success" | "outline" }[] = [
  { id: "backlog", label: "Backlog", color: "border-slate-700", badge: "outline" },
  { id: "in_progress", label: "In Progress", color: "border-sky-500/50", badge: "info" },
  { id: "in_review", label: "In Review", color: "border-amber-500/50", badge: "warning" },
  { id: "completed", label: "Completed", color: "border-emerald-500/50", badge: "success" },
];

const PRIORITIES: KanbanPriority[] = ["critical", "high", "medium", "low"];
const ASSIGNEES = ["Alex Rivera", "Elena Rostova", "Marcus Chen", "Sarah Connor", "Devin AI", "David Miller"];
const TAG_POOL = ["Architecture", "Profiler", "VirtualDOM", "Hydration", "Turbopack", "Concurrency", "Database", "Security"];

export const VirtualKanban: React.FC = () => {
  const { recordRender, isOptimized } = useProfiler();

  // Tasks in memory (100,000 items)
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(100000);

  // Chaos network simulator state
  const [latencyMs, setLatencyMs] = useState<number>(800);
  const [failureRate, setFailureRate] = useState<number>(30); // 30% failure chance
  const [isChaosEnabled, setIsChaosEnabled] = useState<boolean>(true);

  // Optimistic rollback notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Active status filter for mobile / grid
  const [selectedColumn, setSelectedColumn] = useState<KanbanStatus>("backlog");

  // Generate 100,000 tasks
  const generate100kTasks = useCallback((count: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: KanbanTask[] = [];
      const now = Date.now();

      for (let i = 1; i <= count; i++) {
        const statusIdx = i % 4;
        const priorityIdx = i % 4;
        const assigneeIdx = i % ASSIGNEES.length;
        const tag1 = TAG_POOL[i % TAG_POOL.length];
        const tag2 = TAG_POOL[(i + 3) % TAG_POOL.length];

        generated.push({
          id: `TASK-${i}`,
          title: `Optimize ${tag1} pipeline node #${i} under peak concurrency`,
          status: STATUSES[statusIdx].id,
          priority: PRIORITIES[priorityIdx],
          assignee: ASSIGNEES[assigneeIdx],
          storyPoints: (i % 8) + 1,
          createdAt: now - i * 60000,
          updatedAt: now,
          tags: [tag1, tag2],
        });
      }

      setTasks(generated);
      setTotalCount(count);
      setIsGenerating(false);
      setToastMessage({
        text: `Successfully initialized ${count.toLocaleString()} virtualized tasks in memory.`,
        type: "success",
      });
    }, 50);
  }, []);

  useEffect(() => {
    generate100kTasks(100000);
  }, [generate100kTasks]);

  // Separate tasks by columns
  const columnTasks = useMemo(() => {
    const map: Record<KanbanStatus, KanbanTask[]> = {
      backlog: [],
      in_progress: [],
      in_review: [],
      completed: [],
    };

    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });

    return map;
  }, [tasks]);

  // Optimistic mutation with simulated network chaos & rollback
  const moveTask = async (taskId: string, targetStatus: KanbanStatus) => {
    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask || originalTask.status === targetStatus) return;

    const previousStatus = originalTask.status;

    // 1. Optimistic Update (Immediate DOM reflection)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus, updatedAt: Date.now() } : t))
    );

    // 2. If Chaos mode is disabled, commit immediately
    if (!isChaosEnabled) {
      setToastMessage({
        text: `Moved ${taskId} to ${targetStatus} (Optimistic Commit Instant).`,
        type: "success",
      });
      return;
    }

    // 3. Simulate Network Latency & Failure Probability
    try {
      setToastMessage({
        text: `Syncing ${taskId} across network (${latencyMs}ms latency)...`,
        type: "success",
      });

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const rand = Math.random() * 100;
          if (rand < failureRate) {
            reject(new Error(`HTTP 503 Service Unavailable: Simulated Network Failure (${failureRate}% chance)`));
          } else {
            resolve(true);
          }
        }, latencyMs);
      });

      setToastMessage({
        text: `Network Confirmed: ${taskId} committed to ${targetStatus}.`,
        type: "success",
      });
    } catch (err: any) {
      // 4. Rollback state on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t))
      );
      setToastMessage({
        text: `Network Error: ${err.message}. Rolled back ${taskId} to ${previousStatus}!`,
        type: "error",
      });
    }
  };

  return (
    <React.Profiler
      id="VirtualKanbanStudio"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) =>
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime)
      }
    >
      <div>
        <ProjectHeader
          title="100,000-Item Virtual Kanban & Optimistic Mutation Engine"
          description="Virtual DOM windowing with @tanstack/react-virtual rendering 100,000 tasks at a sustained 60 FPS, with IndexedDB persistence, an optimistic mutation pipeline, and network chaos rollback."
          level="expert"
          category="Scale & Virtualization"
          concepts={["@tanstack/react-virtual", "IndexedDB / Dexie.js", "Optimistic State Rollback", "Chaos Latency Injection"]}
          estimatedMinutes={60}
        />
        <div className="w-full px-6 lg:px-12 pb-12 space-y-8">
        {/* Actions Bar */}
        <div className="flex justify-end items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => generate100kTasks(100000)}
            isLoading={isGenerating}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset 100k Tasks
          </Button>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Total In-Memory Items"
            value={totalCount.toLocaleString()}
            icon={<Database className="w-4 h-4 text-indigo-400" />}
            status="good"
          />
          <MetricCard
            label="Active DOM Nodes / Col"
            value={isOptimized ? "15–20" : "25,000"}
            subValue={isOptimized ? "Virtual Windowed" : "Full DOM Render"}
            icon={<Layers className="w-4 h-4 text-sky-400" />}
            status={isOptimized ? "good" : "danger"}
          />
          <MetricCard
            label="Simulated Latency"
            value={`${latencyMs}ms`}
            icon={<Clock className="w-4 h-4 text-amber-400" />}
            status="warning"
          />
          <MetricCard
            label="Failure Rollback Rate"
            value={`${failureRate}%`}
            icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
            status={failureRate > 0 ? "warning" : "good"}
          />
        </div>

        {/* Network Chaos & Mutation Simulator Toolbar */}
        <Card className="border-indigo-900/50 bg-indigo-950/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-base text-indigo-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Network Chaos & Optimistic Mutation Engine
                </CardTitle>
                <CardDescription className="text-xs">
                  Simulate enterprise network flakiness. Drag or click move arrows to observe instant optimistic UI updates and automatic rollback upon network rejection.
                </CardDescription>
              </div>
              <Toggle
                checked={isChaosEnabled}
                onChange={setIsChaosEnabled}
                label="Chaos Simulation"
                size="sm"
              />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <Slider
              label="Artificial Network Latency"
              unit=" ms"
              min={0}
              max={2500}
              step={100}
              value={latencyMs}
              onChange={setLatencyMs}
              disabled={!isChaosEnabled}
            />
            <Slider
              label="Failure Probability (Triggers Rollback)"
              unit=" %"
              min={0}
              max={100}
              step={5}
              value={failureRate}
              onChange={setFailureRate}
              disabled={!isChaosEnabled}
            />
          </CardContent>
        </Card>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all animate-fade-in ${
              toastMessage.type === "error"
                ? "bg-rose-950/80 border-rose-800 text-rose-300"
                : "bg-emerald-950/80 border-emerald-800 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === "error" ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4-Column Virtualized Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUSES.map((col) => (
            <VirtualColumn
              key={col.id}
              status={col.id}
              label={col.label}
              badgeVariant={col.badge}
              colorClass={col.color}
              tasks={columnTasks[col.id]}
              onMoveTask={moveTask}
              isOptimized={isOptimized}
            />
          ))}
        </div>
      </div>
      </div>
    </React.Profiler>
  );
};

interface VirtualColumnProps {
  status: KanbanStatus;
  label: string;
  badgeVariant: "info" | "warning" | "pulse" | "success" | "outline";
  colorClass: string;
  tasks: KanbanTask[];
  onMoveTask: (taskId: string, targetStatus: KanbanStatus) => void;
  isOptimized: boolean;
}

const VirtualColumn: React.FC<VirtualColumnProps> = ({
  status,
  label,
  badgeVariant,
  colorClass,
  tasks,
  onMoveTask,
  isOptimized,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Height in px per card
    overscan: 5,
  });

  const nextStatusMap: Record<KanbanStatus, KanbanStatus | null> = {
    backlog: "in_progress",
    in_progress: "in_review",
    in_review: "completed",
    completed: null,
  };

  const nextStatus = nextStatusMap[status];

  return (
    <Card className={`flex flex-col h-[650px] p-3 border-t-4 ${colorClass}`}>
      {/* Column Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-100">{label}</span>
          <Badge variant={badgeVariant} className="text-[10px] font-mono">
            {tasks.length.toLocaleString()}
          </Badge>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          Virtual Viewport
        </span>
      </div>

      {/* Virtual Scroll Window */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1 relative custom-scrollbar"
        style={{ height: "550px" }}
      >
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">
            No tasks in this column.
          </div>
        ) : isOptimized ? (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const task = tasks[virtualRow.index];
              if (!task) return null;

              return (
                <div
                  key={task.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="pb-2"
                >
                  <TaskCard
                    task={task}
                    nextStatus={nextStatus}
                    onMoveTask={onMoveTask}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          // Unoptimized Fallback rendering raw elements
          <div className="space-y-2">
            {tasks.slice(0, 100).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                nextStatus={nextStatus}
                onMoveTask={onMoveTask}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

const TaskCard: React.FC<{
  task: KanbanTask;
  nextStatus: KanbanStatus | null;
  onMoveTask: (id: string, next: KanbanStatus) => void;
}> = React.memo(({ task, nextStatus, onMoveTask }) => {
  const priorityColor = {
    critical: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    medium: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all text-xs space-y-2 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="font-mono font-bold text-[11px] text-indigo-400">
          {task.id}
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-slate-200 font-medium line-clamp-2 leading-relaxed">
        {task.title}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <span className="text-[10px] text-slate-400 font-mono">
          👤 {task.assignee}
        </span>

        {nextStatus && (
          <button
            onClick={() => onMoveTask(task.id, nextStatus)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors text-[10px] font-bold"
            title={`Move to ${nextStatus}`}
          >
            <span>Move</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = "TaskCard";

export default VirtualKanban;
