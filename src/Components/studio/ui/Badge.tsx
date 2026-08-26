import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "pulse";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  const variantStyles = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    success: "bg-emerald-950/70 text-emerald-400 border-emerald-800/60",
    warning: "bg-amber-950/70 text-amber-400 border-amber-800/60",
    danger: "bg-rose-950/70 text-rose-400 border-rose-800/60",
    info: "bg-indigo-950/70 text-indigo-400 border-indigo-800/60",
    outline: "bg-transparent text-slate-300 border-slate-700",
    pulse: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
