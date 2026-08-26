"use client";

import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  FileCode,
  FileText,
  Copy,
  Check,
  Code2,
  Terminal,
  ChevronRight,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  code: string;
  isMain?: boolean;
}

interface ProjectCodeData {
  folderName: string;
  description: string;
  files: ProjectFile[];
}

interface ProjectCodeSectionProps {
  slug: string;
  title?: string;
  category?: string;
}

export const ProjectCodeSection: React.FC<ProjectCodeSectionProps> = ({
  slug,
  title = "React Component",
  category = "Frontend",
}) => {
  const cleanSlug = slug.replace(/^\//, "").toLowerCase();

  // Initially kept collapsed as requested
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [codeData, setCodeData] = useState<ProjectCodeData | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);
  const [isFullHeight, setIsFullHeight] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCode() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/project-code?slug=${cleanSlug}`);
        if (res.ok) {
          const data: ProjectCodeData = await res.json();
          if (isMounted && data.files && data.files.length > 0) {
            setCodeData(data);
            const mainFile = data.files.find((f) => f.isMain) || data.files[0];
            setSelectedFileName(mainFile.name);
          }
        }
      } catch (e) {
        console.error("Failed to load project code:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCode();
    return () => {
      isMounted = false;
    };
  }, [cleanSlug]);

  const currentFile: ProjectFile | undefined =
    codeData?.files.find((f) => f.name === selectedFileName) || codeData?.files[0];

  const handleCopy = (fileName: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFileName(fileName);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")) {
      return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (fileName.endsWith(".ts") || fileName.endsWith(".js")) {
      return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (fileName.endsWith(".json")) {
      return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="w-full mt-10 mb-8 font-sans space-y-4">
      {/* Collapsible Bar Header */}
      <div className="w-full rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/95 via-[#0a0e17] to-slate-950 p-4 sm:p-5 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Project Source Code & Architecture
              </h3>
              {codeData?.files && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 border border-slate-800 font-mono">
                  {codeData.files.length} {codeData.files.length === 1 ? "File" : "Files"}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Live codebase with modular file hierarchy and TypeScript implementations.
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-md cursor-pointer ${
            isExpanded
              ? "bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20"
              : "bg-slate-900 text-amber-300 border-amber-500/30 hover:bg-slate-800 hover:border-amber-500/60"
          }`}
        >
          <Code2 className={`w-3.5 h-3.5 ${isExpanded ? "text-slate-950" : "text-amber-400"}`} />
          <span>{isExpanded ? "Hide Code Section" : "💻 View Source Code & Folder Structure"}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Split-View Code Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {isLoading ? (
              <div className="p-12 rounded-3xl border border-slate-800 bg-[#07090e] text-center text-slate-400 text-xs flex items-center justify-center gap-3">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Loading project source files...</span>
              </div>
            ) : !codeData || codeData.files.length === 0 ? (
              <div className="p-8 rounded-3xl border border-slate-800 bg-[#07090e] text-center text-slate-400 text-xs">
                No source files found for this task.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-800 bg-[#07090e] shadow-2xl overflow-hidden">
                {/* Left Side: Folder Structure / File Tree (4 cols on lg) */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/80 p-4 space-y-4 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Folder Structure</span>
                    </span>
                    <span className="text-[10px] text-slate-500">React 19</span>
                  </div>

                  {/* Visual Directory Tree */}
                  <div className="space-y-1.5 text-xs select-none">
                    {/* Root Folder */}
                    <div className="flex items-center gap-1.5 text-slate-400 py-1 px-2 rounded-lg">
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      <span>src/</span>
                    </div>

                    {/* Component Directory */}
                    <div className="pl-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-200 py-1 px-2 rounded-lg bg-slate-900/40">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <span className="font-bold">{codeData.folderName.replace("src/", "")}/</span>
                      </div>

                      {/* File Items */}
                      <div className="pl-4 space-y-1">
                        {codeData.files.map((file) => {
                          const isSelected = selectedFileName === file.name;
                          return (
                            <button
                              key={file.name}
                              onClick={() => setSelectedFileName(file.name)}
                              className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-amber-400/10 text-amber-300 border border-amber-500/40 font-bold shadow-sm"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {getFileIcon(file.name)}
                                <span className="truncate">{file.name}</span>
                              </div>

                              {file.isMain && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/80 font-sans">
                                  Main
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Architecture Description */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 font-sans space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Architecture Notes</span>
                    </span>
                    <p className="text-slate-400 text-[11px] font-light leading-relaxed">
                      {codeData.description}
                    </p>
                  </div>
                </div>

                {/* Right Side: Code Viewer for Selected File (8 cols on lg) */}
                <div className="lg:col-span-8 flex flex-col bg-slate-950">
                  {/* File Tabs & Header */}
                  <div className="p-2 sm:px-4 sm:py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap font-mono">
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                      {codeData.files.map((file) => {
                        const isSelected = selectedFileName === file.name;
                        return (
                          <button
                            key={file.name}
                            onClick={() => setSelectedFileName(file.name)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                              isSelected
                                ? "bg-slate-950 text-amber-300 border border-slate-700 font-bold shadow-sm"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                          >
                            {getFileIcon(file.name)}
                            <span>{file.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setIsFullHeight(!isFullHeight)}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={isFullHeight ? "Collapse height" : "Expand full height"}
                      >
                        {isFullHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>

                      {currentFile && (
                        <button
                          onClick={() => handleCopy(currentFile.name, currentFile.code)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
                          title="Copy file content"
                        >
                          {copiedFileName === currentFile.name ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy {currentFile.name}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Code Editor Body with Line Numbers */}
                  <div
                    className={`p-4 overflow-x-auto font-mono text-xs text-amber-100 leading-relaxed bg-slate-950 ${
                      isFullHeight ? "max-h-none" : "max-h-[540px]"
                    }`}
                  >
                    {currentFile ? (
                      <pre className="grid grid-cols-[auto,1fr] gap-4">
                        {/* Line Numbers */}
                        <span className="select-none text-slate-600 text-right pr-3 border-r border-slate-800/80 font-mono">
                          {currentFile.code.split("\n").map((_, i) => (
                            <span key={i} className="block text-[11px]">
                              {i + 1}
                            </span>
                          ))}
                        </span>

                        {/* File Content */}
                        <code className="text-amber-200 whitespace-pre overflow-x-auto">
                          {currentFile.code}
                        </code>
                      </pre>
                    ) : (
                      <div className="text-slate-500 py-8 text-center">Select a file from the explorer</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectCodeSection;
