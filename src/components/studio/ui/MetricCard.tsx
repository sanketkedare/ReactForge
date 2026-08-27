import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  status?: "good" | "warning" | "danger" | "neutral";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  icon,
  status = "neutral",
  className,
}) => {
  const statusGlow = {
    good: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20",
    warning: "border-amber-500/30 text-amber-400 bg-amber-950/20",
    danger: "border-rose-500/30 text-rose-400 bg-rose-950/20",
    neutral: "border-slate-800 text-indigo-400 bg-slate-900/50",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 backdrop-blur-md flex flex-col justify-between transition-all",
        statusGlow[status],
        className
      )}
    >
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1">
        <span>{label}</span>
        {icon && <span className="opacity-80">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black font-mono tracking-tight text-white">
          {value}
        </span>
        {subValue && (
          <span className="text-xs font-medium text-slate-400">{subValue}</span>
        )}
      </div>
    </div>
  );
};
