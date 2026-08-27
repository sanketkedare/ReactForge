"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  RotateCcw,
  Square,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Code2,
  Trophy,
  Compass,
  Key,
  Layers,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Paperclip,
  FileCode,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";
import { getLocalGreetingResponse } from "@/lib/aiGreetings";
import { useAuth } from "@/hooks/useAuth";
import {
  getGuestAiUsageCount,
  incrementGuestAiUsage,
  isGuestAiLimitReached,
  getGuestAiRemaining,
  GUEST_AI_MAX_LIMIT,
} from "@/lib/guestAiQuota";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  promptQuery?: string;
}

export const HomeAIChat: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [guestRemaining, setGuestRemaining] = useState<number>(3);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text: `👋 **Welcome to the ReactForge AI Interview Coach!**\n\nI can help you build a personalized study roadmap from our **100 tasks**, review React 19 architectural patterns, explain time/space complexities, or simulate FAANG frontend system design interviews.\n\nTry clicking any quick question below or type your own question!`,
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSentQueryRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
    setGuestRemaining(getGuestAiRemaining());
    const saved = localStorage.getItem("REACT_LAB_GEMINI_API_KEY");
    if (saved) setUserApiKey(saved);

    const handleQuotaChange = () => {
      setGuestRemaining(getGuestAiRemaining());
    };
    window.addEventListener("guest-ai-quota-change", handleQuotaChange);
    return () => window.removeEventListener("guest-ai-quota-change", handleQuotaChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.setAttribute("data-ai-fullscreen", "true");
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.removeAttribute("data-ai-fullscreen");
    }

    window.dispatchEvent(
      new CustomEvent("ai-fullscreen-change", { detail: { isFullScreen } })
    );

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.removeAttribute("data-ai-fullscreen");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  const handleSaveKey = (key: string) => {
    const trimmed = key.trim();
    setUserApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem("REACT_LAB_GEMINI_API_KEY", trimmed);
    } else {
      localStorage.removeItem("REACT_LAB_GEMINI_API_KEY");
    }
    setShowKeyInput(false);
  };

  const handleStopThinking = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setInput("");
    setAttachedFile(null);
    setMessages([
      {
        id: "intro",
        role: "assistant",
        text: `👋 **Welcome to the ReactForge AI Interview Coach!**\n\nI can help you build a personalized study roadmap from our **100 tasks**, review React 19 architectural patterns, explain time/space complexities, or simulate FAANG frontend system design interviews.\n\nTry clicking any quick question below or type your own question!`,
        timestamp: "Just now",
      },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || "";
      setAttachedFile({
        name: file.name,
        content,
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if ((!textToSend.trim() && !attachedFile) || isLoading) return;

    let displayUserText = textToSend;
    let actualPromptToSend = textToSend;

    if (attachedFile) {
      displayUserText = textToSend
        ? `${textToSend}\n\n📎 Attached File: \`${attachedFile.name}\``
        : `📎 Attached File: \`${attachedFile.name}\` (Please review this code)`;

      actualPromptToSend = `${
        textToSend ? textToSend + "\n\n" : "Please analyze, review, and suggest optimizations for the following code file:\n\n"
      }File Name: ${attachedFile.name}\n\`\`\`tsx\n${attachedFile.content}\n\`\`\``;
    }

    lastSentQueryRef.current = actualPromptToSend;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: displayUserText,
      timestamp: "Just now",
      promptQuery: actualPromptToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput("");
    setAttachedFile(null);

    // GUEST LIMIT INTERCEPTOR: Unauthenticated users are allowed max 3 AI chats
    if (!isAuthenticated) {
      if (isGuestAiLimitReached()) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              text: `🔒 **Free Guest Limit Reached (${GUEST_AI_MAX_LIMIT}/${GUEST_AI_MAX_LIMIT} chats used)**\n\nYou've used your 3 free questions on this device. Please **Sign In** to unlock **Unlimited AI Coaching**, customized 7-day study plans, and automatic progress tracking!`,
              timestamp: "Just now",
            },
          ]);
        }, 150);
        openAuthModal("login");
        return;
      }
      incrementGuestAiUsage();
      setGuestRemaining(getGuestAiRemaining());
    }

    // TOKEN SAVINGS INTERCEPTOR: Answer simple casual greetings locally without API calls
    const localGreeting = !attachedFile ? getLocalGreetingResponse(textToSend, "React Machine Coding Hub") : null;
    if (localGreeting) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: localGreeting,
            timestamp: "Just now",
            promptQuery: textToSend,
          },
        ]);
      }, 150);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: actualPromptToSend,
          mode: "interview",
          userApiKey: userApiKey || undefined,
          context: {
            taskTitle: "React Machine Coding Hub",
            category: "Full 100-Task Curriculum",
            level: "SDE-1, SDE-2 & Senior",
            concepts: ["React 19", "Virtualization", "Custom Hooks", "State Management", "Performance"],
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to receive response from AI.");
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.response || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        promptQuery: textToSend,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      if (err.name === "AbortError") {
        const cancelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "system",
          text: "⏹ *Generation stopped by user.*",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          promptQuery: textToSend,
        };
        setMessages((prev) => [...prev, cancelMsg]);
      } else {
        const errMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "system",
          text: `⚠️ **Notice:** ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          promptQuery: textToSend,
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = (queryToRetry?: string) => {
    const target = queryToRetry || lastSentQueryRef.current;
    if (target) handleSend(target);
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Distinct Home-Level Global Quick Options
  const homeQuickPrompts = [
    {
      icon: <Compass className="w-3.5 h-3.5 text-amber-400" />,
      label: "🗺️ Recommend a 7-day study plan for SDE-2 interviews",
      query: "I am preparing for an SDE-2 Frontend Machine Coding interview in 2 weeks. Recommend a prioritized 7-day study roadmap from the 100-task curriculum with 5 key benchmark tasks.",
    },
    {
      icon: <Layers className="w-3.5 h-3.5 text-indigo-400" />,
      label: "🏢 Top tasks asked at Google, Meta & Amazon?",
      query: "What are the top 5 most frequently asked machine coding problems at Google, Meta, and Amazon from this 100-task catalog?",
    },
    {
      icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
      label: "⚡ Compare useTransition vs useDeferredValue",
      query: "In React 19, what is the exact architectural difference between useTransition and useDeferredValue? Provide a concise interview answer with short code examples.",
    },
    {
      icon: <Trophy className="w-3.5 h-3.5 text-purple-400" />,
      label: "🏗️ How to structure a 45-min System Design round",
      query: "What is the best 45-minute pacing strategy for a Senior Frontend Machine Coding round (Virtual Tables, Infinite Canvas, Multi-tab Sync)?",
    },
  ];

  // Shared Chat UI content
  const chatUI = (
    <div
      className={`font-sans transition-all duration-200 ${
        isFullScreen
          ? "fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] w-screen h-[100dvh] bg-[#07090e] flex flex-col justify-between overflow-hidden m-0 p-0"
          : "w-full rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-[#0a0e17] to-slate-950 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between gap-4 border-b border-slate-800/80 flex-shrink-0 ${
          isFullScreen ? "px-6 py-3.5 bg-[#07090e]" : "pb-4"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              React<span className="text-amber-400">Forge</span> AI Coach
            </h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono font-bold">
              Online
            </span>

            {isAuthenticated ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-semibold hidden sm:flex items-center gap-1">
                ✨ Unlimited AI
              </span>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/30 hover:border-amber-400 font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Guest mode: 3 free chats allowed. Click to Sign In for unlimited access."
              >
                <span>⚡ Guest: {guestRemaining}/{GUEST_AI_MAX_LIMIT} Left</span>
                <span className="text-slate-500 hidden md:inline">• Sign In</span>
              </button>
            )}

            {isFullScreen && (
              <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
                Press Esc to exit
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-light hidden sm:block mt-0.5">
            Curriculum guidance, interview roadmaps, and React 19 architectural advice across all 100 tasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-amber-300 hover:bg-slate-800 hover:border-amber-500/40 cursor-pointer shadow-sm font-medium"
            title="Start a fresh conversation"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">New Chat</span>
          </button>

          {/* API Key Settings Button */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors border ${
              userApiKey
                ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title="Custom API Key Configuration"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="text-[11px]">{userApiKey ? "Custom Key Set" : "API Key"}</span>
          </button>

          {/* Full Screen Toggle / Exit Button */}
          {isFullScreen ? (
            <button
              type="button"
              onClick={() => setIsFullScreen(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 cursor-pointer shadow-sm font-semibold"
              title="Exit Full Screen (Esc)"
            >
              <X className="w-4 h-4 text-amber-400" />
              <span>Exit Full Screen (Esc)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsFullScreen(true)}
              className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer shadow-sm"
              title="Expand Full Screen"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Full Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Custom Key Input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs flex-shrink-0 ${
              isFullScreen ? "mx-6 my-2" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300">Custom Gemini API Key (Optional)</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-amber-400 hover:underline"
              >
                Get Free Google AI Studio Key ↗
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Paste your Google AI Studio key..."
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
              />
              <button
                onClick={() => handleSaveKey(userApiKey)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home-Specific Quick Prompts (only visible on initial state, disabled after second message) */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex-shrink-0 overflow-hidden ${
              isFullScreen
                ? "px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/60"
                : "space-y-2"
            }`}
          >
            {!isFullScreen && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Curriculum & Strategy Discussion Starters:
              </span>
            )}
            <div
              className={`grid gap-2 text-xs ${
                isFullScreen
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {homeQuickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.query)}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/80 hover:bg-slate-900 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all text-left flex items-start gap-2 group cursor-pointer disabled:opacity-50 ${
                    isFullScreen ? "text-[11px]" : ""
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <span className="font-light leading-snug group-hover:text-amber-200 line-clamp-2">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Conversation Scroll Area with Background Watermark */}
      <div className={`relative flex-col ${isFullScreen ? "flex-1 min-h-0 flex" : ""}`}>
        {/* Ambient Large Brand Icon Watermark in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 opacity-[0.04] flex items-center justify-center">
            <Image
              src="/ReactForge_Icon.png"
              alt="ReactForge Watermark"
              width={280}
              height={280}
              className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(245,158,11,0.2)]"
            />
          </div>
        </div>

        <div
          ref={chatScrollRef}
          className={`relative z-10 overflow-y-auto space-y-4 text-xs ${
            isFullScreen
              ? "flex-1 min-h-0 px-6 sm:px-12 py-4 bg-slate-950/20"
              : "p-4 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800/80 max-h-[460px] min-h-[220px]"
          }`}
        >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
                msg.role === "user"
                  ? "bg-amber-400 text-slate-950 font-bold"
                  : msg.role === "system"
                  ? "bg-rose-950 text-rose-300 border border-rose-800"
                  : "bg-slate-800 text-amber-300 border border-slate-700"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[88%] rounded-2xl p-4 space-y-2 relative group shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 text-white border border-amber-500/40"
                  : msg.role === "system"
                  ? "bg-rose-950/40 text-rose-200 border border-rose-800/50"
                  : "bg-slate-900 text-slate-200 border border-slate-800"
              }`}
            >
              {msg.role === "user" ? (
                <div className="text-xs text-amber-50 font-normal leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </div>
              ) : (
                <MarkdownRenderer content={msg.text} />
              )}

              <div
                className={`flex items-center justify-between pt-1.5 text-[10px] font-mono border-t ${
                  msg.role === "user"
                    ? "border-amber-500/20 text-amber-300/80"
                    : "border-slate-800/60 text-slate-400"
                }`}
              >
                <span suppressHydrationWarning>{msg.timestamp}</span>

                <div className="flex items-center gap-2">
                  {msg.promptQuery && (
                    <button
                      onClick={() => handleRetry(msg.promptQuery)}
                      disabled={isLoading}
                      className="text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer flex items-center gap-1 disabled:opacity-40"
                      title="Regenerate this response"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="text-[9px]">Retry</span>
                    </button>
                  )}

                  {msg.role === "assistant" && (
                    <button
                      onClick={() => copyText(msg.id, msg.text)}
                      className="text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[9px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[9px]">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Live Animated Thinking Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-slate-800 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 shadow-lg space-y-2 max-w-[88%]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>AI is thinking & formulating response...</span>
                </div>

                <button
                  type="button"
                  onClick={handleStopThinking}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                  title="Stop AI Generation"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </button>
              </div>

              {/* Shimmering Gold Progress Indicator */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Input Box with File Upload, Stop Thinking & Ask Toggle */}
      <div className={`flex-shrink-0 ${isFullScreen ? "px-6 sm:px-12 py-3.5 border-t border-slate-800 bg-[#07090e]" : ""}`}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".tsx,.ts,.jsx,.js,.json,.css,.txt,.py,.html"
          className="hidden"
        />

        {/* Attached File Chip Preview */}
        {attachedFile && (
          <div className="max-w-7xl mx-auto mb-2 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono shadow-sm">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{attachedFile.name}</span>
              <span className="text-[10px] text-amber-400/70">
                ({(attachedFile.content.length / 1024).toFixed(1)} KB)
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="p-0.5 hover:bg-amber-800/60 rounded-full text-amber-400 hover:text-white cursor-pointer ml-1 transition-colors"
                title="Remove attached file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isLoading) {
              handleStopThinking();
            } else {
              handleSend();
            }
          }}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-amber-400 rounded-2xl p-2 transition-all shadow-inner max-w-7xl mx-auto"
        >
          {/* Always-Visible File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-800 transition-all cursor-pointer flex-shrink-0"
            title="Attach Code File (.tsx, .ts, .jsx, .js, .json, .css)"
          >
            <Paperclip className="w-4 h-4 text-amber-400" />
          </button>

          <input
            type="text"
            placeholder={
              attachedFile
                ? `Ask a question about ${attachedFile.name} (or leave blank for code review)...`
                : "Ask about 100-task curriculum, roadmaps, or React 19 architecture..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-2 text-xs text-white placeholder-slate-500 outline-none disabled:opacity-50"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={handleStopThinking}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Thinking</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() && !attachedFile}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );

  // If FullScreen mode is active, render via Portal onto document.body to completely escape all parent offsets & layout containers
  if (isFullScreen && mounted) {
    return createPortal(chatUI, document.body);
  }

  return chatUI;
};

export default HomeAIChat;
