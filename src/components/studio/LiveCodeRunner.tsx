"use client";

import React, { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class LiveErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Live Component Runtime Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

interface LiveCodeRunnerProps {
  code: string;
  taskTitle?: string;
}

export const LiveCodeRunner: React.FC<LiveCodeRunnerProps> = ({ code, taskTitle }) => {
  const [ComponentToRender, setComponentToRender] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBabelLoaded, setIsBabelLoaded] = useState<boolean>(false);

  // Load Babel Standalone for real-time in-browser TSX/JSX compilation
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).Babel) {
      setIsBabelLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.10/babel.min.js";
    script.async = true;
    script.onload = () => {
      setIsBabelLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load in-browser compiler. Please check your network connection.");
    };
    document.head.appendChild(script);
  }, []);

  // Compile and instantiate the candidate's component
  useEffect(() => {
    if (!isBabelLoaded || !code.trim()) return;

    const timer = setTimeout(() => {
      try {
        setError(null);
        const Babel = (window as any).Babel;

        if (!Babel) {
          setError("In-browser compiler is initializing...");
          return;
        }

        // Clean code: Remove import statements and handle export assignments
        let cleanCode = code
          .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "")
          .replace(/export\s+default\s+function\s*(\w+)/g, "function $1")
          .replace(/export\s+default\s+/g, "exports.default = ");

        // Extract component name if declared as function Name()
        const functionMatch = cleanCode.match(/function\s+([A-Z]\w*)/);
        const compName = functionMatch ? functionMatch[1] : null;

        // Compile TSX/JSX to standard ES5 JavaScript
        const transformed = Babel.transform(cleanCode, {
          presets: ["react", "typescript"],
          filename: "Solution.tsx",
        }).code;

        // Custom sandbox require scope
        const customRequire = (moduleName: string) => {
          if (moduleName === "react") return React;
          if (moduleName === "lucide-react") return LucideIcons;
          if (moduleName === "framer-motion") return { motion, AnimatePresence };
          return {};
        };

        const customExports: { default?: any; [key: string]: any } = {};

        // Execute transpiled component within isolated scope
        const runnerFn = new Function(
          "React",
          "useState",
          "useEffect",
          "useMemo",
          "useCallback",
          "useRef",
          "useReducer",
          "useContext",
          "motion",
          "AnimatePresence",
          "LucideIcons",
          "require",
          "exports",
          `
          try {
            ${transformed}
            ${compName ? `if (typeof ${compName} !== 'undefined' && !exports.default) { exports.default = ${compName}; }` : ""}
          } catch(e) {
            throw e;
          }
          `
        );

        runnerFn(
          React,
          React.useState,
          React.useEffect,
          React.useMemo,
          React.useCallback,
          React.useRef,
          React.useReducer,
          React.useContext,
          motion,
          AnimatePresence,
          LucideIcons,
          customRequire,
          customExports
        );

        // Extract compiled component
        const ExportedComp =
          customExports.default ||
          Object.values(customExports).find((val) => typeof val === "function");

        if (ExportedComp && typeof ExportedComp === "function") {
          setComponentToRender(() => ExportedComp);
        } else {
          setError("No React component found. Ensure your function is declared and exported.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to compile your code.");
      }
    }, 250); // 250ms debounce for typing performance

    return () => clearTimeout(timer);
  }, [code, isBabelLoaded]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[280px]">
      {error ? (
        <div className="w-full max-w-lg p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 space-y-2 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <LucideIcons.AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Compilation / Runtime Error</span>
          </div>
          <p className="text-[11px] leading-relaxed break-words opacity-90">{error}</p>
          <span className="text-[10px] text-slate-400 block pt-1 font-sans">
            Fix the syntax in your editor below to see your component update live.
          </span>
        </div>
      ) : ComponentToRender ? (
        <LiveErrorBoundary
          fallback={(runtimeError) => (
            <div className="w-full max-w-lg p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 space-y-2 text-xs font-mono shadow-xl">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <LucideIcons.AlertCircle className="w-4 h-4 shrink-0" />
                <span>Component Runtime Error</span>
              </div>
              <p className="text-[11px] leading-relaxed break-words opacity-90">{runtimeError.message}</p>
            </div>
          )}
        >
          <div className="w-full flex justify-center py-2 animate-fadeIn">
            <ComponentToRender />
          </div>
        </LiveErrorBoundary>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-slate-400 py-8">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Initializing live execution environment...</span>
        </div>
      )}
    </div>
  );
};

export default LiveCodeRunner;
