"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("FeatureErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="w-full p-6 my-4 bg-red-950/20 border border-red-500/30 rounded-2xl flex flex-col items-center text-center justify-center animate-in fade-in"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3.5 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-red-200 mb-1">
            {this.props.fallbackTitle || "Component Encountered an Error"}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            {this.props.fallbackMessage ||
              "An isolated failure occurred in this component. Other features continue to work normally."}
          </p>
          {this.state.error && (
            <div className="w-full max-w-md mb-4 p-3 bg-black/40 border border-slate-800 rounded-xl text-left overflow-x-auto">
              <p className="text-[11px] font-mono text-red-400 break-words">
                {this.state.error.message}
              </p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleReset}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-500/40 hover:bg-red-500/10 text-red-300"
          >
            Reset Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
