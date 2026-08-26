"use client";

import React, { useState, useEffect, useRef } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Flag, Clock, Timer, Bell } from "lucide-react";

type Mode = "stopwatch" | "timer";

export default function StopwatchTimerPage() {
  const [mode, setMode] = useState<Mode>("stopwatch");

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 mins default
  const [timerInitial, setTimerInitial] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stopwatch Effect
  useEffect(() => {
    if (isStopwatchRunning) {
      const startTime = Date.now() - stopwatchTime;
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 10);
    } else {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    }

    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [isStopwatchRunning]);

  // Timer Effect
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            setIsAlarmActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  // Stopwatch Handlers
  const handleLap = () => {
    if (stopwatchTime > 0) {
      setLaps((prev) => [stopwatchTime, ...prev]);
    }
  };

  const handleStopwatchReset = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  // Timer Handlers
  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setIsAlarmActive(false);
    setTimerSeconds(timerInitial);
  };

  const setTimerPreset = (secs: number) => {
    setIsTimerRunning(false);
    setIsAlarmActive(false);
    setTimerInitial(secs);
    setTimerSeconds(secs);
  };

  // Format Stopwatch (mm:ss:ms)
  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(
      centiseconds
    ).padStart(2, "0")}`;
  };

  // Format Timer (mm:ss)
  const formatTimer = (totalSecs: number) => {
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Countdown Timer & Stopwatch"
        description="Build a precision dual-mode timekeeper featuring a millisecond stopwatch with lap tracking and a preset-driven countdown timer."
        level="beginner"
        category="Timers & Animation"
        skills={["Date.now() Precision Timing", "setInterval Cleanup", "Lap Calculation"]}
        estimatedMinutes={25}
        whatYouWillBuild="A precision stopwatch with lap split records and a Pomodoro countdown timer with customizable presets and alarm alerts."
        keyTakeaways={[
          "Using Date.now() offsets rather than incremental intervals to avoid timer drift",
          "Cleaning up timer references in useEffect teardown functions",
          "Calculating fastest vs slowest lap times dynamically",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-xl mx-auto p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-8 text-center">
          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-950 border border-slate-800">
            <button
              onClick={() => setMode("stopwatch")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                mode === "stopwatch"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Stopwatch</span>
            </button>
            <button
              onClick={() => setMode("timer")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                mode === "timer"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Countdown Timer</span>
            </button>
          </div>

          {/* STOPWATCH MODE */}
          {mode === "stopwatch" && (
            <div className="space-y-8">
              {/* Digital Dial */}
              <div className="py-8 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-inner">
                <span className="font-mono text-5xl sm:text-6xl font-bold tracking-wider text-amber-300">
                  {formatStopwatch(stopwatchTime)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg transition-all ${
                    isStopwatchRunning
                      ? "bg-red-500 hover:bg-red-400 text-white shadow-red-500/20"
                      : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20"
                  }`}
                >
                  {isStopwatchRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Start</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleLap}
                  disabled={!isStopwatchRunning}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lap</span>
                </button>

                <button
                  onClick={handleStopwatchReset}
                  className="p-3.5 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Reset Stopwatch"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Lap Records Table */}
              {laps.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-left">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Lap Split Records ({laps.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                    {laps.map((lapMs, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800/60 text-xs font-mono"
                      >
                        <span className="text-slate-400">Lap #{laps.length - idx}</span>
                        <span className="text-amber-200 font-semibold">{formatStopwatch(lapMs)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COUNTDOWN TIMER MODE */}
          {mode === "timer" && (
            <div className="space-y-8">
              {/* Presets */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: "1 Min", secs: 60 },
                  { label: "5 Min (Quick)", secs: 300 },
                  { label: "10 Min", secs: 600 },
                  { label: "25 Min (Pomodoro)", secs: 1500 },
                ].map((p) => (
                  <button
                    key={p.secs}
                    onClick={() => setTimerPreset(p.secs)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      timerInitial === p.secs
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Digital Dial */}
              <div
                className={`py-8 rounded-2xl bg-slate-950 border shadow-inner transition-colors ${
                  isAlarmActive
                    ? "border-red-500/80 bg-red-950/40 animate-pulse"
                    : "border-slate-800/80"
                }`}
              >
                <span className="font-mono text-5xl sm:text-6xl font-bold tracking-wider text-amber-300">
                  {formatTimer(timerSeconds)}
                </span>
                {isAlarmActive && (
                  <div className="mt-2 text-xs font-bold text-red-400 flex items-center justify-center gap-1.5">
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span>Time is Up!</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setIsAlarmActive(false);
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  disabled={timerSeconds === 0}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg transition-all ${
                    isTimerRunning
                      ? "bg-red-500 hover:bg-red-400 text-white shadow-red-500/20"
                      : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 disabled:opacity-40"
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Start Timer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleTimerReset}
                  className="p-3.5 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
