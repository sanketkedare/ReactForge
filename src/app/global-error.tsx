"use client";

import React, { useEffect } from "react";
import { RotateCcw, AlertOctagon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ReactForge Root Critical Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090e] text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/30 bg-slate-950/90 backdrop-blur-xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Application Exception</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical layout exception occurred. Please reload or reset the application.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase block mb-1">
              Error Details
            </span>
            <p className="text-xs font-mono text-slate-300 break-words">
              {error.message || "Root layout failed to load."}
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer hover:opacity-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
