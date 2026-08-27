import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-md dark:shadow-2xl transition-all duration-300",
        glow && "border-indigo-400 dark:border-indigo-500/30 shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-slate-200 dark:border-slate-800/50", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={cn("text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2", className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn("text-sm text-slate-600 dark:text-slate-400 font-normal", className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn("pt-4", className)}>{children}</div>;
