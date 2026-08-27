"use client";

import React, { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { Badge } from "../ui/Badge";
import { MetricCard } from "../ui/MetricCard";
import { Play, Square, Flame, Activity, Clock, Layers, Sparkles } from "lucide-react";
import { useProfiler } from "@/context/ProfilerContext";
import ProjectHeader from "@/components/common/ProjectHeader";

interface LaneMetric {
  executed: number;
  dropped: number;
  lastFired: number;
}

export const EventPipeline: React.FC = () => {
  const { recordRender } = useProfiler();

  // Burst generator controls
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [frequencyHz, setFrequencyHz] = useState<number>(30); // 1 to 200 Hz
  const [totalPulses, setTotalPulses] = useState<number>(0);
  const [delayMs, setDelayMs] = useState<number>(300);

  // Lane metrics
  const [rawMetrics, setRawMetrics] = useState<LaneMetric>({ executed: 0, dropped: 0, lastFired: 0 });
  const [debounceTrailing, setDebounceTrailing] = useState<LaneMetric>({ executed: 0, dropped: 0, lastFired: 0 });
  const [debounceLeading, setDebounceLeading] = useState<LaneMetric>({ executed: 0, dropped: 0, lastFired: 0 });
  const [throttleMetrics, setThrottleMetrics] = useState<LaneMetric>({ executed: 0, dropped: 0, lastFired: 0 });
  const [rafMetrics, setRafMetrics] = useState<LaneMetric>({ executed: 0, dropped: 0, lastFired: 0 });
  const [concurrentMetrics, setConcurrentMetrics] = useState<LaneMetric>({ executed: 0, dropped: 0, lastFired: 0 });

  // React 19 transition state
  const [isPending, startTransition] = useTransition();
  const [concurrentValue, setConcurrentValue] = useState<number>(0);

  // Timers and lock refs
  const debounceTrailingTimer = useRef<NodeJS.Timeout | null>(null);
  const debounceLeadingTimer = useRef<NodeJS.Timeout | null>(null);
  const leadingLocked = useRef<boolean>(false);
  const throttleLastTime = useRef<number>(0);
  const rafPendingRef = useRef<boolean>(false);

  // Canvas ref for visual oscilloscope
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pulsesRef = useRef<{ lane: number; x: number; color: string }[]>([]);

  // Pulse dispatcher
  const dispatchPulse = useCallback(() => {
    const now = performance.now();
    setTotalPulses((p) => p + 1);

    // 1. Raw Lane
    setRawMetrics((prev) => ({
      executed: prev.executed + 1,
      dropped: 0,
      lastFired: now,
    }));
    pulsesRef.current.push({ lane: 0, x: 0, color: "#f43f5e" });

    // 2. Debounce Trailing Lane
    if (debounceTrailingTimer.current) clearTimeout(debounceTrailingTimer.current);
    setDebounceTrailing((prev) => ({ ...prev, dropped: prev.dropped + 1 }));
    debounceTrailingTimer.current = setTimeout(() => {
      setDebounceTrailing((prev) => ({
        ...prev,
        executed: prev.executed + 1,
        lastFired: performance.now(),
      }));
      pulsesRef.current.push({ lane: 1, x: 0, color: "#38bdf8" });
    }, delayMs);

    // 3. Debounce Leading Lane
    if (!leadingLocked.current) {
      leadingLocked.current = true;
      setDebounceLeading((prev) => ({
        ...prev,
        executed: prev.executed + 1,
        lastFired: now,
      }));
      pulsesRef.current.push({ lane: 2, x: 0, color: "#818cf8" });
    } else {
      setDebounceLeading((prev) => ({ ...prev, dropped: prev.dropped + 1 }));
    }
    if (debounceLeadingTimer.current) clearTimeout(debounceLeadingTimer.current);
    debounceLeadingTimer.current = setTimeout(() => {
      leadingLocked.current = false;
    }, delayMs);

    // 4. Throttle Lane
    if (now - throttleLastTime.current >= delayMs) {
      throttleLastTime.current = now;
      setThrottleMetrics((prev) => ({
        ...prev,
        executed: prev.executed + 1,
        lastFired: now,
      }));
      pulsesRef.current.push({ lane: 3, x: 0, color: "#34d399" });
    } else {
      setThrottleMetrics((prev) => ({ ...prev, dropped: prev.dropped + 1 }));
    }

    // 5. RAF Lane
    if (!rafPendingRef.current) {
      rafPendingRef.current = true;
      requestAnimationFrame(() => {
        setRafMetrics((prev) => ({
          ...prev,
          executed: prev.executed + 1,
          lastFired: performance.now(),
        }));
        pulsesRef.current.push({ lane: 4, x: 0, color: "#fbbf24" });
        rafPendingRef.current = false;
      });
    } else {
      setRafMetrics((prev) => ({ ...prev, dropped: prev.dropped + 1 }));
    }

    // 6. React 19 Concurrent useTransition Lane
    startTransition(() => {
      setConcurrentValue(now);
      setConcurrentMetrics((prev) => ({
        ...prev,
        executed: prev.executed + 1,
        lastFired: now,
      }));
      pulsesRef.current.push({ lane: 5, x: 0, color: "#c084fc" });
    });
  }, [delayMs]);

  // Burst generator interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStreaming) {
      const intervalMs = Math.max(5, 1000 / frequencyHz);
      interval = setInterval(dispatchPulse, intervalMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, frequencyHz, dispatchPulse]);

  // Canvas animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderOscilloscope = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw 6 lane divider lines
      const laneHeight = canvas.height / 6;
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, i * laneHeight);
        ctx.lineTo(canvas.width, i * laneHeight);
        ctx.stroke();
      }

      // Move & draw pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        pulse.x += 4;
        const y = pulse.lane * laneHeight + laneHeight / 2;

        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(canvas.width - pulse.x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return pulse.x < canvas.width;
      });

      animId = requestAnimationFrame(renderOscilloscope);
    };

    animId = requestAnimationFrame(renderOscilloscope);
    return () => cancelAnimationFrame(animId);
  }, []);

  const triggerBurst = (count: number) => {
    let fired = 0;
    const timer = setInterval(() => {
      dispatchPulse();
      fired++;
      if (fired >= count) clearInterval(timer);
    }, 10);
  };

  const resetAll = () => {
    setIsStreaming(false);
    setTotalPulses(0);
    setRawMetrics({ executed: 0, dropped: 0, lastFired: 0 });
    setDebounceTrailing({ executed: 0, dropped: 0, lastFired: 0 });
    setDebounceLeading({ executed: 0, dropped: 0, lastFired: 0 });
    setThrottleMetrics({ executed: 0, dropped: 0, lastFired: 0 });
    setRafMetrics({ executed: 0, dropped: 0, lastFired: 0 });
    setConcurrentMetrics({ executed: 0, dropped: 0, lastFired: 0 });
    pulsesRef.current = [];
  };

  const laneData = [
    {
      name: "1. Raw Unthrottled",
      type: "Blocking",
      color: "border-rose-500 text-rose-400 bg-rose-950/20",
      dot: "bg-rose-500",
      metric: rawMetrics,
      desc: "Executes unconditionally on every trigger event.",
    },
    {
      name: "2. Debounce (Trailing)",
      type: "Post-Inactivity",
      color: "border-sky-500 text-sky-400 bg-sky-950/20",
      dot: "bg-sky-400",
      metric: debounceTrailing,
      desc: "Delays execution until after quiet inactivity period.",
    },
    {
      name: "3. Debounce (Leading)",
      type: "Immediate Lock",
      color: "border-indigo-500 text-indigo-400 bg-indigo-950/20",
      dot: "bg-indigo-400",
      metric: debounceLeading,
      desc: "Fires instantly on first pulse, locks subsequent calls.",
    },
    {
      name: "4. Throttle (Periodic)",
      type: "Fixed Window",
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/20",
      dot: "bg-emerald-400",
      metric: throttleMetrics,
      desc: "Guarantees execution at most once per time window.",
    },
    {
      name: "5. RequestAnimationFrame",
      type: "V-Sync 60Hz",
      color: "border-amber-500 text-amber-400 bg-amber-950/20",
      dot: "bg-amber-400",
      metric: rafMetrics,
      desc: "Synchronizes event dispatch to monitor refresh cycle.",
    },
    {
      name: "6. React 19 useTransition",
      type: "Concurrent",
      color: "border-purple-500 text-purple-400 bg-purple-950/20",
      dot: "bg-purple-400",
      metric: concurrentMetrics,
      desc: "Non-blocking concurrent priority interruptible rendering.",
    },
  ];

  return (
    <React.Profiler
      id="EventPipelineVisualizer"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) =>
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime)
      }
    >
      <div>
        <ProjectHeader
          title="Event Pipeline & Concurrency Stream Oscilloscope"
          description="High-frequency event bus visualizer benchmarking execution throttling, leading/trailing debounce edges, RAF 60Hz, and React 19 concurrent useTransition under 200 Hz bursts."
          level="expert"
          category="Concurrency & Streams"
          concepts={["React 19 useTransition", "requestAnimationFrame Loop", "HTML5 Canvas Oscilloscope", "Main-Thread Offloading"]}
          estimatedMinutes={50}
        />
        <div className="w-full px-6 lg:px-12 pb-12 space-y-8">
          {/* Quick Burst Control */}
          <div className="flex justify-end items-center gap-2 flex-wrap">
            <Button
              variant={isStreaming ? "danger" : "primary"}
              onClick={() => setIsStreaming((prev) => !prev)}
              className="font-bold min-w-[140px]"
            >
              {isStreaming ? (
                <>
                  <Square className="w-4 h-4 mr-2" /> Stop Stream
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Start Stream
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => triggerBurst(100)}>
              <Flame className="w-4 h-4 mr-1 text-amber-400" /> Burst 100
            </Button>
            <Button variant="outline" onClick={resetAll}>
              Reset
            </Button>
          </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Total Pulses Generated"
            value={totalPulses}
            icon={<Activity className="w-4 h-4 text-indigo-400" />}
            status="neutral"
          />
          <MetricCard
            label="Frequency Rate"
            value={`${frequencyHz} Hz`}
            subValue={`${Math.round(1000 / frequencyHz)}ms / pulse`}
            icon={<Clock className="w-4 h-4 text-amber-400" />}
            status="warning"
          />
          <MetricCard
            label="Throttle/Debounce Delay"
            value={`${delayMs}ms`}
            icon={<Layers className="w-4 h-4 text-emerald-400" />}
            status="good"
          />
          <MetricCard
            label="Concurrent Status"
            value={isPending ? "Transitioning..." : "Idle"}
            subValue={`v: ${concurrentValue > 0 ? concurrentValue.toFixed(0) : "0"}`}
            icon={<Sparkles className="w-4 h-4 text-purple-400" />}
            status={isPending ? "warning" : "good"}
          />
        </div>

        {/* Stream Oscilloscope & Interactive Control Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <Card className="lg:col-span-1 space-y-6">
            <CardHeader>
              <CardTitle>Pulse Generator Controls</CardTitle>
              <CardDescription>
                Tweak event emission frequency and delay intervals to observe lane behaviors under heavy load.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Slider
                label="Stream Pulse Frequency"
                unit=" pulses/sec"
                min={1}
                max={150}
                step={1}
                value={frequencyHz}
                onChange={setFrequencyHz}
              />

              <Slider
                label="Execution Delay Window (Debounce / Throttle)"
                unit=" ms"
                min={50}
                max={1000}
                step={25}
                value={delayMs}
                onChange={setDelayMs}
              />

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                <span className="font-bold text-slate-200 block">
                  How This Benchmark Works:
                </span>
                <p>
                  High-frequency event bursts simulate rapid mouse movement, continuous window resizing, or fast keypress searches.
                </p>
                <p>
                  Watch how <strong className="text-emerald-400">Throttle</strong>, <strong className="text-sky-400">Debounce</strong>, and <strong className="text-purple-400">useTransition</strong> save hundreds of redundant executions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Live Waveform Oscilloscope Canvas */}
          <Card className="lg:col-span-2 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Multi-Lane Stream Oscilloscope</span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </CardTitle>
              <CardDescription>
                Real-time visual pulse oscilloscope rendering execution triggers across all 6 lanes simultaneously.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={240}
                  className="w-full h-[240px] block"
                />
              </div>

              {/* Lane Labels Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                {laneData.map((l) => (
                  <div key={l.name} className="flex items-center gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                    <span className="truncate text-slate-300">{l.name.split(". ")[1]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lane Comparison Scoreboard */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Execution Telemetry & Efficiency Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laneData.map((lane) => {
              const efficiency = totalPulses > 0 ? Math.round((lane.metric.dropped / totalPulses) * 100) : 0;
              return (
                <Card key={lane.name} className="relative overflow-hidden border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{lane.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{lane.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {lane.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-slate-800/80 text-center font-mono">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Fired</div>
                      <div className="text-lg font-bold text-white">{lane.metric.executed}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Dropped</div>
                      <div className="text-lg font-bold text-amber-400">{lane.metric.dropped}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Saved</div>
                      <div className="text-lg font-bold text-emerald-400">{efficiency}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
                    <span>Last Fired:</span>
                    <span>{lane.metric.lastFired > 0 ? `${(performance.now() - lane.metric.lastFired).toFixed(0)}ms ago` : "Never"}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </React.Profiler>
  );
};

export default EventPipeline;
