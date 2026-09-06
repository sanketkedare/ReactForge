"use client";

import React, { useState, useEffect } from "react";
import { Activity, Gauge, Zap, Clock, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Metric {
  name: string;
  value: number | null;
  unit: string;
  rating: "good" | "needs-improvement" | "poor" | "measuring";
  description: string;
  threshold: { good: number; poor: number };
}

export const WebVitalsHUD: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, Metric>>({
    LCP: {
      name: "Largest Contentful Paint (LCP)",
      value: null,
      unit: "ms",
      rating: "measuring",
      description: "Perceived load speed. Measures when main content is likely loaded.",
      threshold: { good: 2500, poor: 4000 },
    },
    INP: {
      name: "Interaction to Next Paint (INP)",
      value: null,
      unit: "ms",
      rating: "measuring",
      description: "Responsiveness. Measures latency of user interactions.",
      threshold: { good: 200, poor: 500 },
    },
    CLS: {
      name: "Cumulative Layout Shift (CLS)",
      value: null,
      unit: "",
      rating: "measuring",
      description: "Visual stability. Quantifies unexpected layout shifts.",
      threshold: { good: 0.1, poor: 0.25 },
    },
    TTFB: {
      name: "Time to First Byte (TTFB)",
      value: null,
      unit: "ms",
      rating: "measuring",
      description: "Server response time for initial document request.",
      threshold: { good: 800, poor: 1800 },
    },
    FCP: {
      name: "First Contentful Paint (FCP)",
      value: null,
      unit: "ms",
      rating: "measuring",
      description: "Time until browser renders first piece of DOM content.",
      threshold: { good: 1800, poor: 3000 },
    },
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    // Measure Navigation Timing (TTFB)
    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = Math.round(navEntry.responseStart);
        updateMetric("TTFB", ttfb);
      }
    } catch {
      // Ignore unsupported entry
    }

    // Measure Paint Timing (FCP)
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            updateMetric("FCP", Math.round(entry.startTime));
          }
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
    } catch {
      // Ignore
    }

    // Measure LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          updateMetric("LCP", Math.round(lastEntry.startTime));
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Ignore
    }

    // Measure CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!layoutShift.hadRecentInput && layoutShift.value) {
            clsValue += layoutShift.value;
            updateMetric("CLS", Number(clsValue.toFixed(3)));
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      // Ignore
    }

    function updateMetric(key: string, val: number) {
      setMetrics((prev) => {
        const item = prev[key];
        if (!item) return prev;
        let rating: Metric["rating"] = "good";
        if (val > item.threshold.poor) rating = "poor";
        else if (val > item.threshold.good) rating = "needs-improvement";

        return {
          ...prev,
          [key]: { ...item, value: val, rating },
        };
      });
    }
  }, []);

  const getBadgeVariant = (rating: Metric["rating"]) => {
    switch (rating) {
      case "good":
        return "success";
      case "needs-improvement":
        return "warning";
      case "poor":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full bg-[#0a0e17] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Live Client Web Vitals</h3>
            <p className="text-xs text-slate-400">
              Captured via native PerformanceObserver API in your active browser session
            </p>
          </div>
        </div>
        <Badge variant="amber" icon={<Zap className="w-3 h-3" />}>
          Real-Time
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(metrics).map(([key, metric]) => (
          <div
            key={key}
            className="p-4 rounded-xl bg-[#0e1320] border border-slate-800/70 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                {key === "LCP" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                {key === "INP" && <Zap className="w-3.5 h-3.5 text-blue-400" />}
                {key === "CLS" && <Layers className="w-3.5 h-3.5 text-emerald-400" />}
                {key === "TTFB" && <Gauge className="w-3.5 h-3.5 text-purple-400" />}
                {key === "FCP" && <Activity className="w-3.5 h-3.5 text-cyan-400" />}
                {key}
              </span>
              <Badge variant={getBadgeVariant(metric.rating)} size="sm">
                {metric.rating === "measuring" ? "Measuring..." : metric.rating.toUpperCase()}
              </Badge>
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono text-slate-100">
                {metric.value !== null ? metric.value : "—"}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">{metric.unit}</span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
