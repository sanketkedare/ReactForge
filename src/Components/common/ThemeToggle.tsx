"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  className = "",
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-700/50 bg-slate-900/40 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
        isDark
          ? "border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-amber-400 hover:text-amber-300"
          : "border-slate-300 bg-slate-100 hover:bg-slate-200 text-indigo-600 hover:text-indigo-700 shadow-sm"
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
          {showLabel && (
            <span className="text-xs font-semibold text-slate-300 font-sans">
              Light Mode
            </span>
          )}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600 rotate-0 transition-transform duration-300" />
          {showLabel && (
            <span className="text-xs font-semibold text-slate-700 font-sans">
              Dark Mode
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
