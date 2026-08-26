"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { ProfilerState, ComponentMetric } from "@/types/studio";

const defaultState: ProfilerState = {
  metrics: {},
  fps: 60,
  memoryMB: 0,
  isOptimized: true,
  totalRenders: 0,
  recordRender: () => {},
  toggleOptimization: () => {},
  setOptimization: () => {},
  resetMetrics: () => {},
};

export const ProfilerContext = createContext<ProfilerState>(defaultState);

export const ProfilerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<Record<string, ComponentMetric>>({});
  const [fps, setFps] = useState<number>(60);
  const [memoryMB, setMemoryMB] = useState<number>(0);
  const [isOptimized, setIsOptimized] = useState<boolean>(true);
  const [totalRenders, setTotalRenders] = useState<number>(0);

  // Buffered Refs to prevent re-entrant render loops
  const metricsBufferRef = useRef<Record<string, ComponentMetric>>({});
  const totalRendersBufferRef = useRef<number>(0);
  const isFlushScheduledRef = useRef<boolean>(false);

  // FPS calculation refs
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null);

  // FPS and memory loop
  useEffect(() => {
    const updateFps = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastFpsUpdateRef.current;

      if (delta >= 500) {
        const calculatedFps = Math.round((frameCountRef.current * 1000) / delta);
        setFps(Math.min(calculatedFps, 120));
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;

        // Estimate memory if supported in Chromium browsers
        if (typeof window !== "undefined" && (performance as any).memory) {
          const usedBytes = (performance as any).memory.usedJSHeapSize;
          setMemoryMB(Math.round(usedBytes / (1024 * 1024)));
        }
      }

      rafIdRef.current = requestAnimationFrame(updateFps);
    };

    rafIdRef.current = requestAnimationFrame(updateFps);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Flush buffered metrics asynchronously outside of React render phase
  const scheduleFlush = useCallback(() => {
    if (isFlushScheduledRef.current) return;
    isFlushScheduledRef.current = true;

    setTimeout(() => {
      isFlushScheduledRef.current = false;
      setMetrics({ ...metricsBufferRef.current });
      setTotalRenders(totalRendersBufferRef.current);
    }, 50);
  }, []);

  const recordRender = useCallback(
    (
      id: string,
      phase: "mount" | "update" | "nested-update",
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      // Increment internal ref buffer without triggering immediate synchronous re-render
      totalRendersBufferRef.current += 1;

      const existing = metricsBufferRef.current[id];
      const newCount = (existing?.renderCount || 0) + 1;
      const newTotalDuration = (existing?.totalDuration || 0) + actualDuration;
      const newAvg = newTotalDuration / newCount;

      metricsBufferRef.current[id] = {
        id,
        renderCount: newCount,
        lastDuration: actualDuration,
        avgDuration: newAvg,
        totalDuration: newTotalDuration,
        lastPhase: phase,
        lastCommitTime: commitTime,
      };

      scheduleFlush();
    },
    [scheduleFlush]
  );

  const toggleOptimization = useCallback(() => {
    setIsOptimized((prev) => !prev);
  }, []);

  const setOptimization = useCallback((val: boolean) => {
    setIsOptimized(val);
  }, []);

  const resetMetrics = useCallback(() => {
    metricsBufferRef.current = {};
    totalRendersBufferRef.current = 0;
    setMetrics({});
    setTotalRenders(0);
  }, []);

  return (
    <ProfilerContext.Provider
      value={{
        metrics,
        fps,
        memoryMB,
        isOptimized,
        totalRenders,
        recordRender,
        toggleOptimization,
        setOptimization,
        resetMetrics,
      }}
    >
      {children}
    </ProfilerContext.Provider>
  );
};

export const useProfiler = () => useContext(ProfilerContext);

export default ProfilerProvider;
