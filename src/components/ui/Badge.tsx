import React from "react";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "amber" | "outline" | "blue" | "purple";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  icon,
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border border-slate-700/60",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
    error: "bg-red-500/10 text-red-400 border border-red-500/30",
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
    outline: "bg-transparent text-slate-300 border border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
