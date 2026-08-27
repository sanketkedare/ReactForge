"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  AtSign,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Globe,
  Award,
  ShieldCheck,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";

const TARGET_ROLES = [
  { id: "SDE-1 Frontend", label: "SDE-1 Frontend Engineer", exp: "Junior" },
  { id: "SDE-2 Senior React Engineer", label: "SDE-2 Senior React Engineer", exp: "Mid-Level" },
  { id: "Full Stack Engineer", label: "Full Stack Engineer (React/Node)", exp: "Full Stack" },
  { id: "Frontend Architect", label: "Frontend Architect / Staff Engineer", exp: "Staff/Lead" },
];

const EXPERIENCE_TIERS: Array<{
  id: "fresher" | "junior" | "mid" | "senior" | "architect";
  label: string;
  desc: string;
}> = [
  { id: "fresher", label: "Fresher / 0-1 Yrs", desc: "Starting frontend journey" },
  { id: "junior", label: "Junior / 1-3 Yrs", desc: "Targeting SDE-1 rounds" },
  { id: "mid", label: "Mid-Level / 3-5 Yrs", desc: "Targeting SDE-2 rounds" },
  { id: "senior", label: "Senior / 5+ Yrs", desc: "Targeting Senior / Lead" },
  { id: "architect", label: "Architect / Staff", desc: "System design & scale" },
];

const PRIMARY_FOCUSES = [
  "Machine Coding Interviews (Live Coding)",
  "Frontend System Design & Architecture",
  "React 19, Turbopack & Next.js 16",
  "JavaScript Core, DOM & Performance",
];

export default function RegistrationOnboardingModal() {
  const { user, mongoUser, requiresOnboarding, completeRegistration, logout } =
    useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [targetRole, setTargetRole] = useState("SDE-1 Frontend");
  const [experienceLevel, setExperienceLevel] = useState<
    "fresher" | "junior" | "mid" | "senior" | "architect"
  >("junior");
  const [primaryFocus, setPrimaryFocus] = useState(PRIMARY_FOCUSES[0]);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill initial data from Firebase / GitHub if available
  useEffect(() => {
    if (user) {
      if (user.displayName && !displayName) {
        setDisplayName(user.displayName);
      }
      if (!username && user.email) {
        const handle = user.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
        setUsername(handle);
      }
    }
  }, [user, displayName, username]);

  if (!requiresOnboarding) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!displayName.trim()) {
        setError("Please enter your full name");
        return;
      }
      if (!username.trim() || username.length < 3) {
        setError("Username must be at least 3 characters");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await completeRegistration({
      displayName,
      username,
      targetRole,
      experienceLevel,
      primaryFocus,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    });

    setLoading(false);

    if (res.success) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#f59e0b", "#10b981", "#06b6d4", "#ec4899", "#8b5cf6"],
      });
    } else {
      setError(res.error || "Failed to complete registration");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Locked Backdrop - No click dismissal */}
      <div className="fixed inset-0 bg-[#07090e]/95 backdrop-blur-xl" />

      {/* Modal Window */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-xl bg-[#0d1117] border border-amber-500/30 shadow-2xl shadow-amber-500/10 rounded-3xl p-6 sm:p-8 z-10 overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Progress Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/30 p-1.5 flex items-center justify-center shadow-inner">
              <Image
                src="/ReactForge_Icon.png"
                alt="ReactForge App Icon"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Compulsory Onboarding
              </span>
              <span className="text-[10px] text-amber-400 font-mono block">
                Step {step} of 3 • ReactForge Developer Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s
                    ? "w-7 bg-amber-400"
                    : step > s
                    ? "w-4 bg-emerald-500"
                    : "w-4 bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* STEP 1: Developer Identity */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Complete Your Developer Identity
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Please provide your name and unique developer handle for leaderboard & interview tracking.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Sanket Kedare"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Developer Handle / Username <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                    }
                    placeholder="e.g. sanket_dev"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-sm focus:outline-none transition-colors font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Your profile URL: reactforge.sanketkedare.com/@{username || "username"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Authenticated Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800/80 rounded-xl text-slate-400 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Sign out & exit
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Career Targets & Experience */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Target Role & Preparation Focus
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize your practice curriculum benchmarks according to your target interview round.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Target Interview Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TARGET_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setTargetRole(r.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        targetRole === r.id
                          ? "bg-amber-500/10 border-amber-500/50 text-white shadow-sm shadow-amber-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{r.label}</div>
                      <span className="text-[10px] text-amber-400/90 font-mono">{r.exp} Tier</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Years of Experience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXPERIENCE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setExperienceLevel(tier.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        experienceLevel === tier.id
                          ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs">{tier.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Primary Preparation Goal
                </label>
                <select
                  value={primaryFocus}
                  onChange={(e) => setPrimaryFocus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
                >
                  {PRIMARY_FOCUSES.map((focus) => (
                    <option key={focus} value={focus} className="bg-slate-900">
                      {focus}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Social Handles & Bio */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Developer Links & Bio
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Showcase your portfolio and complete your registration to claim +50 Starter XP.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourhandle"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Short Developer Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Passionate React developer preparing for high-impact frontend engineering rounds..."
                  className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Bonus Banner */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Welcome Reward:</strong> +50 Starter XP will be deposited directly to your MongoDB profile!
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/30 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Complete Registration & Claim +50 XP</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Compulsory registration enforced & stored in MongoDB Cloud</span>
        </div>
      </motion.div>
    </div>
  );
}
