"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Flame,
  Zap,
  CheckCircle2,
  Bookmark,
  Shield,
  ChevronDown,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserMenu() {
  const { user, mongoUser, loading, isAuthenticated, openAuthModal, logout } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse border border-slate-700" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() => openAuthModal("login")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 font-semibold text-xs transition-all shadow-sm group hover:scale-[1.02]"
      >
        <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        <span>Sign In</span>
      </button>
    );
  }

  const displayName =
    mongoUser?.displayName || user.displayName || user.email?.split("@")[0] || "Developer";
  const solvedCount = mongoUser?.completedTasks?.length || 0;
  const xp = mongoUser?.xp || 0;
  const streak = mongoUser?.streak?.current || 1;
  const role = mongoUser?.role || "user";

  return (
    <div className="relative" ref={menuRef}>
      {/* User Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all text-left shadow-sm group"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold text-[10px] flex items-center justify-center border border-amber-400">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden sm:flex flex-col">
          <span className="text-[11px] font-semibold text-white leading-tight max-w-[90px] truncate">
            {displayName}
          </span>
          <span className="text-[9px] font-mono text-amber-400/90 leading-none">
            {xp} XP
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-amber-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-[#0d1117] border border-amber-500/20 rounded-2xl shadow-2xl shadow-black/80 p-3 z-50 overflow-hidden"
          >
            {/* Header info */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-2">
              <div className="flex items-center gap-2.5 mb-2">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold text-sm flex items-center justify-center border border-amber-400">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">
                      {displayName}
                    </span>
                    {role === "admin" && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Mini Stats Bar */}
              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-center">
                <div className="px-1 py-1 rounded bg-slate-950/60 border border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{solvedCount}</span>
                  </div>
                  <span className="text-[8px] text-slate-500">Solved</span>
                </div>

                <div className="px-1 py-1 rounded bg-slate-950/60 border border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-[10px] font-bold">
                    <Zap className="w-3 h-3" />
                    <span>{xp}</span>
                  </div>
                  <span className="text-[8px] text-slate-500">XP</span>
                </div>

                <div className="px-1 py-1 rounded bg-slate-950/60 border border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-orange-400 text-[10px] font-bold">
                    <Flame className="w-3 h-3" />
                    <span>{streak}d</span>
                  </div>
                  <span className="text-[8px] text-slate-500">Streak</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>My Profile & Progress</span>
              </Link>

              <Link
                href="/tasks"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>100-Task Curriculum</span>
              </Link>
            </div>

            {/* Sign out */}
            <div className="pt-2 mt-2 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
