"use client";

import React, { useState, useEffect } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from "lucide-react";

type ModalVariant = "confirm" | "form" | "danger";

export default function ModalDialogPage() {
  const [activeModal, setActiveModal] = useState<ModalVariant | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("Frontend Developer");
  const [notification, setNotification] = useState<string | null>(null);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Accessible Modal Dialog"
        description="Build an accessible popup modal with ESC key dismiss, backdrop click-outside detection, focus trapping, and smooth animations."
        level="beginner"
        category="UI Components"
        skills={["Keyboard Events (ESC)", "Click Outside Detection", "Body Scroll Locking", "Framer Motion"]}
        estimatedMinutes={20}
        whatYouWillBuild="An interactive modal trigger hub that presents confirmation, profile form, and danger alert dialogs with full keyboard and backdrop support."
        keyTakeaways={[
          "Closing dialogs smoothly with the Escape key",
          "Locking body scrolling when a modal overlay is open",
          "Distinguishing backdrop clicks from content clicks using event bubbling prevention",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-12">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-8 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-xl flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Triggers Dashboard */}
        <div className="max-w-3xl mx-auto p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-8 text-center">
          <div className="space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <Layers className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Modal Trigger Sandbox
            </h2>
            <p className="text-xs text-slate-400 font-light max-w-md mx-auto">
              Click any button below to launch a modal. Test closing via the ✕ button, clicking outside on the backdrop, or pressing the <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">ESC</kbd> key.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {/* Trigger 1: Confirmation */}
            <button
              onClick={() => setActiveModal("confirm")}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-amber-400/60 hover:bg-slate-900 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Standard</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-amber-300">Confirmation Modal</h3>
              <p className="text-[11px] text-slate-400 font-light">Ask for user confirmation before executing a non-destructive action.</p>
            </button>

            {/* Trigger 2: Form */}
            <button
              onClick={() => setActiveModal("form")}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-indigo-400/60 hover:bg-slate-900 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Interactive</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-indigo-300">Form Input Modal</h3>
              <p className="text-[11px] text-slate-400 font-light">Collect user feedback or edit profile fields in an overlay.</p>
            </button>

            {/* Trigger 3: Danger */}
            <button
              onClick={() => setActiveModal("danger")}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-red-400/60 hover:bg-slate-900 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">Critical</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-red-300">Danger Action Modal</h3>
              <p className="text-[11px] text-slate-400 font-light">Warn users about irreversible data deletion or state resets.</p>
            </button>
          </div>
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              {/* Modal Dialog Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 space-y-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Confirm Modal Content */}
                {activeModal === "confirm" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-400">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Publish React Task?</h3>
                        <p className="text-xs text-slate-400 font-light">This will make your submission visible to reviewers.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Are you sure you want to finalize your code submission? Once published, your solution will be benchmarked against time complexity constraints.
                    </p>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 rounded-full border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          triggerNotification("Task successfully published!");
                        }}
                        className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold shadow-md"
                      >
                        Confirm & Publish
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Modal Content */}
                {activeModal === "form" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800 text-indigo-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Edit Profile Details</h3>
                        <p className="text-xs text-slate-400 font-light">Update your public developer credentials.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Alex Carter"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400">Target Role</label>
                        <input
                          type="text"
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 rounded-full border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          triggerNotification(`Profile updated for ${userName || "Developer"}!`);
                        }}
                        className="px-6 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Danger Modal Content */}
                {activeModal === "danger" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800 text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Delete All Workspace Data?</h3>
                        <p className="text-xs text-red-400/80 font-light">This action is permanent and cannot be undone.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Are you certain you want to purge all local sandbox storage? All task progress and mock state records will be permanently erased.
                    </p>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 rounded-full border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          triggerNotification("Workspace data successfully purged.");
                        }}
                        className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md"
                      >
                        Yes, Delete Everything
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
