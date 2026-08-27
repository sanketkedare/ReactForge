"use client";

import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Copy,
  Check,
  Code2,
  Terminal,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectCodeStructure, ProjectFile } from "@/data/projectCodeSnippets";

interface CodeViewerSectionProps {
  slug: string;
  title: string;
  category: string;
  skills?: string[];
}

export const CodeViewerSection: React.FC<CodeViewerSectionProps> = ({
  slug,
  title,
  category,
  skills = [],
}) => {
  const structure = getProjectCodeStructure(slug, title, category, skills);
  const [selectedFileName, setSelectedFileName] = useState<string>(
    structure.files.find((f: ProjectFile) => f.isMain)?.name || structure.files[0]?.name || "Component.tsx"
  );
  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(true);
  const [isFolderExpanded, setIsFolderExpanded] = useState<boolean>(true);
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);

  const currentFile: ProjectFile | undefined =
    structure.files.find((f: ProjectFile) => f.name === selectedFileName) || structure.files[0];

  const handleCopyCode = (fileName: string, code: string) => {
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
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="w-full mt-10 mb-10 font-sans space-y-4">
      {/* Section Header with Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Source Code & File Structure</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-900 text-amber-300 border border-slate-800 font-mono">
                {structure.files.length} Files
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Production-ready architecture, custom hooks, and strict TypeScript types.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span>{isSectionOpen ? "Hide Code" : "Show Full Code"}</span>
          {isSectionOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Code & Structure Container */}
      <AnimatePresence>
        {isSectionOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-800 bg-[#07090e] shadow-2xl overflow-hidden">
              {/* Left Column: Interactive File Tree Explorer (4 cols on lg) */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/70 p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    <span>Project Explorer</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">React 19 + TS</span>
                </div>

                {/* Visual Folder Tree */}
                <div className="space-y-1 text-xs font-mono select-none">
                  {/* Root Folder */}
                  <div className="flex items-center gap-1.5 text-slate-400 py-1 px-2 rounded-lg hover:bg-slate-900/50">
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                    <span>src/</span>
                  </div>

                  {/* Components Folder */}
                  <div className="pl-4 space-y-1">
                    <div
                      onClick={() => setIsFolderExpanded(!isFolderExpanded)}
                      className="flex items-center gap-1.5 text-slate-300 py-1 px-2 rounded-lg hover:bg-slate-900 cursor-pointer"
                    >
                      {isFolderExpanded ? (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      )}
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-amber-200">
                        {structure.folderName.replace("src/components/", "")}/
                      </span>
                    </div>

                    {/* Files inside folder */}
                    <AnimatePresence>
                      {isFolderExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-5 space-y-1"
                        >
                          {structure.files.map((file: ProjectFile) => {
                            const isSelected = selectedFileName === file.name;
                            return (
                              <button
                                key={file.name}
                                onClick={() => setSelectedFileName(file.name)}
                                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-amber-400/10 text-amber-300 border border-amber-500/30 font-bold shadow-sm"
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Architecture Note Box */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Design Philosophy</span>
                  </span>
                  <p className="text-slate-400 text-[11px] font-light leading-relaxed">
                    {structure.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Multi-File Code Viewer (8 cols on lg) */}
              <div className="lg:col-span-8 flex flex-col bg-slate-950">
                {/* Code Window Header / File Tabs */}
                <div className="p-2 sm:px-4 sm:py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  {/* File Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
                    {structure.files.map((file: ProjectFile) => {
                      const isSelected = selectedFileName === file.name;
                      return (
                        <button
                          key={file.name}
                          onClick={() => setSelectedFileName(file.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-950 text-amber-300 border border-slate-700 shadow-sm font-bold"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                          }`}
                        >
                          {getFileIcon(file.name)}
                          <span>{file.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Copy Button */}
                  {currentFile && (
                    <button
                      onClick={() => handleCopyCode(currentFile.name, currentFile.code)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all shadow-sm cursor-pointer ml-auto"
                      title="Copy full file code"
                    >
                      {copiedFileName === currentFile.name ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono text-[11px]">Copy File</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Code Body with Line Numbers */}
                <div className="p-4 overflow-x-auto max-h-[520px] font-mono text-xs text-amber-100 leading-relaxed bg-slate-950">
                  <pre className="grid grid-cols-[auto,1fr] gap-4">
                    {/* Line Numbers */}
                    <span className="select-none text-slate-600 text-right pr-2 border-r border-slate-800/80">
                      {currentFile?.code.split("\n").map((_, i) => (
                        <span key={i} className="block text-[11px]">
                          {i + 1}
                        </span>
                      ))}
                    </span>

                    {/* Actual Code */}
                    <code className="text-amber-200 whitespace-pre">
                      {currentFile?.code}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeViewerSection;
