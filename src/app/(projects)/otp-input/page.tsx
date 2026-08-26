"use client";

import React, { useState, useRef, useEffect } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RefreshCw, KeyRound, ShieldCheck, Copy, Check } from "lucide-react";

export default function OtpInputPage() {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only numeric digits
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    setIsVerified(false);

    // Auto-focus next input
    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    // Extract only digits up to OTP_LENGTH
    const digits = pastedData.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");

    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    setOtp(newOtp);
    setIsVerified(false);

    // Focus the next empty input or the last input
    const nextEmptyIndex = digits.length < OTP_LENGTH ? digits.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleVerify = () => {
    if (otp.every((d) => d !== "")) {
      setIsVerified(true);
    }
  };

  const handleReset = () => {
    setOtp(new Array(OTP_LENGTH).fill(""));
    setIsVerified(false);
    inputRefs.current[0]?.focus();
  };

  const handleCopyCode = () => {
    const fullCode = otp.join("");
    if (fullCode) {
      navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="OTP 6-Digit Input Box"
        description="Build a high-performance verification code input with auto-advance, backspace retreat, and full clipboard paste support."
        level="beginner"
        category="Forms & State"
        skills={["useRef Focus Management", "Clipboard Paste Handling", "Keyboard Events"]}
        estimatedMinutes={20}
        whatYouWillBuild="A 6-digit OTP verification widget that automatically advances focus, retreats on backspace, and supports pasting full 6-digit codes."
        keyTakeaways={[
          "Using an array of refs to control input focus programmatically",
          "Handling paste events by sanitizing clipboard text and distributing characters",
          "Providing accessible keyboard navigation (ArrowLeft, ArrowRight, Backspace)",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-12">
        <div className="max-w-xl mx-auto p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-8">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Two-Factor Authentication
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Enter the 6-digit verification code sent to your registered device.
            </p>
          </div>

          {/* OTP Input Grid */}
          <div className="flex justify-center items-center gap-2 sm:gap-3.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border outline-none transition-all shadow-inner ${
                  digit
                    ? "border-amber-400 bg-amber-950/30 text-amber-200 ring-2 ring-amber-400/20"
                    : "border-slate-800 bg-slate-950 text-white focus:border-amber-400/70 focus:bg-slate-900"
                }`}
              />
            ))}
          </div>

          {/* Quick Paste Mock Code helper */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Demo code:</span>
            <button
              onClick={() => {
                const demo = ["7", "4", "9", "2", "1", "8"];
                setOtp(demo);
                setIsVerified(false);
                inputRefs.current[OTP_LENGTH - 1]?.focus();
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono transition-colors"
            >
              749218 (Click to Fill)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleVerify}
              disabled={!isComplete}
              className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isComplete
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Code</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset code"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyCode}
              disabled={!otp.some((d) => d !== "")}
              className="p-3.5 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Verification Alert Banner */}
          <AnimatePresence>
            {isVerified && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/50 flex items-center gap-3 text-emerald-300 text-sm shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Code Verified Successfully!</div>
                  <div className="text-xs text-emerald-400/80">
                    OTP authentication complete for code: {otp.join("")}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
