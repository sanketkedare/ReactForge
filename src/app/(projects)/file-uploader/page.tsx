"use client";

import React, { useState, useRef } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  X,
  AlertCircle,
  HardDrive,
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  errorMessage?: string;
}

export default function FileUploaderPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    const newEntries: UploadedFile[] = Array.from(incomingFiles).map((file) => {
      const isSizeValid = file.size <= MAX_FILE_SIZE;
      const isTypeValid = ALLOWED_TYPES.includes(file.type);

      let status: "uploading" | "error" = "uploading";
      let errorMessage: string | undefined;

      if (!isTypeValid) {
        status = "error";
        errorMessage = "Unsupported format (Only PNG, JPG, WEBP, PDF allowed).";
      } else if (!isSizeValid) {
        status = "error";
        errorMessage = "File exceeds 5MB size limit.";
      }

      const entry: UploadedFile = {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: status === "error" ? 0 : 10,
        status,
        errorMessage,
      };

      // Simulate upload progress if valid
      if (status === "uploading") {
        simulateUpload(entry.id);
      }

      return entry;
    });

    setFiles((prev) => [...newEntries, ...prev]);
  };

  const simulateUpload = (fileId: string) => {
    let current = 15;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 25) + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "completed" } : f))
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: current } : f))
        );
      }
    }, 300);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Drag & Drop File Uploader"
        description="Build a drag-and-drop file upload zone with file size/type validation, thumbnail previews, and simulated progress bars."
        level="intermediate"
        category="Forms & Media"
        skills={["Drag & Drop API (onDragOver, onDrop)", "URL.createObjectURL()", "Progress Simulation"]}
        estimatedMinutes={35}
        whatYouWillBuild="A file uploader supporting drag-and-drop and manual file selection with instant client validation and progress feedback."
        keyTakeaways={[
          "Preventing default browser file-opening behavior with onDragOver and onDrop",
          "Generating local image previews safely with URL.createObjectURL",
          "Displaying multi-state file status tags (uploading, completed, error)",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Dropzone Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragOver
                ? "border-amber-400 bg-amber-950/30 scale-[1.01]"
                : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp, application/pdf"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Drag & drop files here, or browse</h3>
            <p className="text-xs text-slate-400 font-light mt-1">
              Supports PNG, JPG, WEBP, and PDF up to 5MB
            </p>
          </div>

          {/* File Queue List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Upload Queue ({files.length})</span>
                <button
                  onClick={() => setFiles([])}
                  className="text-amber-400 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2.5">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail / Icon */}
                        {file.previewUrl ? (
                          <img
                            src={file.previewUrl}
                            alt="preview"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white truncate max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>

                          {/* Progress Bar or Error */}
                          {file.status === "uploading" && (
                            <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-amber-400 transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}

                          {file.status === "completed" && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Uploaded</span>
                            </span>
                          )}

                          {file.status === "error" && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-red-400">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{file.errorMessage}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
