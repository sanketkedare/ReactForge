"use client";

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Copy, Check, RefreshCw, Shield, Zap, Sparkles, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const passRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [length, setLength] = useState<number>(16);
  const [hasUpper, setHasUpper] = useState<boolean>(true);
  const [hasLower, setHasLower] = useState<boolean>(true);
  const [hasNum, setHasNum] = useState<boolean>(true);
  const [hasSym, setHasSym] = useState<boolean>(true);

  // Strength score calculation
  const strengthInfo = useMemo(() => {
    let score = 0;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNum) score += 1;
    if (hasSym) score += 1;

    if (score <= 2) {
      return { label: "Weak", color: "bg-rose-500", text: "text-rose-400", percent: 25 };
    } else if (score === 3) {
      return { label: "Fair", color: "bg-amber-500", text: "text-amber-400", percent: 50 };
    } else if (score === 4) {
      return { label: "Strong", color: "bg-emerald-400", text: "text-emerald-300", percent: 80 };
    } else {
      return { label: "Very Strong", color: "bg-emerald-500", text: "text-emerald-400", percent: 100 };
    }
  }, [length, hasUpper, hasLower, hasNum, hasSym]);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (hasUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (hasLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (hasNum) charset += "0123456789";
    if (hasSym) charset += "!@#$%^&*()_+~|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("");
      return;
    }

    let pass = "";
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * charset.length);
      pass += charset[random];
    }

    setPassword(pass);
    setCopied(false);
  }, [length, hasUpper, hasLower, hasNum, hasSym]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyPassword = useCallback(() => {
    if (!password) return;
    if (passRef.current) {
      passRef.current.select();
    }
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-[#0a0e17] to-slate-950 shadow-2xl backdrop-blur-xl space-y-8"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 text-lg shadow-sm">
              🔑
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Interactive Generator</h2>
              <p className="text-xs text-slate-400 font-light">Custom entropy with one-click copy</p>
            </div>
          </div>

          <button
            onClick={generatePassword}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 text-xs transition-all cursor-pointer"
            title="Generate new password"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>

        {/* Password Output Box */}
        <div className="relative group">
          <div className="flex items-center w-full bg-slate-950 border border-slate-800 focus-within:border-amber-400 rounded-2xl p-2 transition-all shadow-inner">
            <input
              type="text"
              readOnly
              value={password || "Select at least 1 option..."}
              ref={passRef}
              className="w-full bg-transparent px-4 py-3 font-mono text-base sm:text-lg text-amber-300 tracking-wider outline-none select-all"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyPassword}
              disabled={!password}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer flex-shrink-0 ${
                copied
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Strength Meter Bar */}
          <div className="mt-3 flex items-center justify-between gap-4 px-1">
            <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strengthInfo.percent}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full ${strengthInfo.color}`}
              />
            </div>
            <span className={`text-xs font-mono font-bold ${strengthInfo.text} flex-shrink-0`}>
              {strengthInfo.label}
            </span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-6 pt-2 border-t border-slate-800/80">
          {/* Length Slider & Quick Presets */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Password Length</span>
              </span>
              <span className="font-mono text-amber-300 font-bold bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                {length} Characters
              </span>
            </div>

            <input
              type="range"
              min={6}
              max={40}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-950 rounded-lg border border-slate-800"
            />

            {/* Quick length presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500 font-mono">Quick length:</span>
              {[8, 12, 16, 20, 24, 32].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLength(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    length === preset
                      ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Character Type Toggles */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Included Character Sets</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Uppercase Letters (A-Z)", checked: hasUpper, setter: setHasUpper, sample: "ABC..." },
                { label: "Lowercase Letters (a-z)", checked: hasLower, setter: setHasLower, sample: "abc..." },
                { label: "Numbers (0-9)", checked: hasNum, setter: setHasNum, sample: "123..." },
                { label: "Symbols (!@#$%)", checked: hasSym, setter: setHasSym, sample: "@#$..." },
              ].map((opt) => (
                <label
                  key={opt.label}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                    opt.checked
                      ? "border-amber-500/40 bg-amber-950/20 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={(e) => opt.setter(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer rounded"
                    />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">{opt.sample}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordGenerator;
