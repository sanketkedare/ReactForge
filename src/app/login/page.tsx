"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import StudioNav from "@/components/studio/StudioNav";
import GlobalFooter from "@/components/common/GlobalFooter";

export default function LoginPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmailPassword,
    openAuthModal,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) router.push("/profile");
    else setError(res.error || "Google sign-in failed");
  };

  const handleGithub = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGithub();
    setLoading(false);
    if (res.success) router.push("/profile");
    else setError(res.error || "GitHub sign-in failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginWithEmailPassword(email, password);
    setLoading(false);
    if (res.success) router.push("/profile");
    else setError(res.error || "Invalid credentials");
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
      <StudioNav />

      <main className="flex-1 flex items-center justify-center p-4 py-16 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-[#0d1117]/90 border border-amber-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/80 relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Sign In to React<span className="text-amber-400">Forge</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Synchronize your 100-task progress across devices.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-slate-200 hover:text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50"
            >
              <FaGoogle className="w-4 h-4 text-red-400" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleGithub}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50"
            >
              <FaGithub className="w-4 h-4 text-white" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0d1117] px-3 text-slate-500 font-mono">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => openAuthModal("forgot")}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="text-center mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-amber-400 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Firebase & MongoDB Cloud Authentication</span>
          </div>
        </motion.div>
      </main>

      <GlobalFooter />
    </div>
  );
}
