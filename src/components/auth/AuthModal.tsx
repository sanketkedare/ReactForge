"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmailPassword,
    registerWithEmailPassword,
    resetPassword,
    requiresOnboarding,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen || requiresOnboarding) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Google authentication failed");
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGithub();
    setLoading(false);
    if (!res.success) {
      setError(res.error || "GitHub authentication failed");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (authModalMode === "login") {
      const res = await loginWithEmailPassword(email, password);
      setLoading(false);
      if (!res.success) setError(res.error || "Invalid credentials");
    } else if (authModalMode === "register") {
      if (!displayName.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      const res = await registerWithEmailPassword(email, password, displayName);
      setLoading(false);
      if (!res.success) setError(res.error || "Registration failed");
    } else if (authModalMode === "forgot") {
      const res = await resetPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccessMsg("Password reset email sent! Check your inbox.");
      } else {
        setError(res.error || "Failed to send reset link");
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#07090e]/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md bg-[#0d1117] border border-amber-500/20 shadow-2xl shadow-amber-500/10 rounded-2xl p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/30 mb-3.5 shadow-[0_0_25px_-5px_rgba(245,158,11,0.35)] p-2.5">
              <Image
                src="/ReactForge_Icon.png"
                alt="ReactForge App Icon"
                width={40}
                height={40}
                priority
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {authModalMode === "login" && "Welcome back to ReactForge"}
              {authModalMode === "register" && "Create Developer Account"}
              {authModalMode === "forgot" && "Reset Password"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {authModalMode === "login" && "Sign in to save your 100-task progress & track streak."}
              {authModalMode === "register" && "Join ReactForge and track machine coding interview milestones."}
              {authModalMode === "forgot" && "Enter your email to receive recovery instructions."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {authModalMode !== "forgot" && (
            <div className="flex p-1 mb-6 bg-slate-900/80 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  openAuthModal("login");
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authModalMode === "login"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  openAuthModal("register");
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authModalMode === "register"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* OAuth Buttons (One-Tap / One-Click) */}
          {authModalMode !== "forgot" && (
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-slate-200 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <FaGoogle className="w-4 h-4 text-red-400" />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <FaGithub className="w-4 h-4 text-white" />
                <span>Continue with GitHub</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0d1117] px-3 text-slate-500 font-mono">
                    OR WITH EMAIL
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {authModalMode === "register" && (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Sanket Kedare"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dev@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {authModalMode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-400">
                    Password
                  </label>
                  {authModalMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        openAuthModal("forgot");
                      }}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === "login" && "Sign In"}
                    {authModalMode === "register" && "Create Account"}
                    {authModalMode === "forgot" && "Send Reset Link"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          {authModalMode === "forgot" && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>End-to-end authenticated via Firebase & MongoDB Cloud</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
