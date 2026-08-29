"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  RotateCcw,
  Square,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Zap,
  HelpCircle,
  Code2,
  Maximize2,
  Minimize2,
  Layers,
  Compass,
  Trophy,
  Upload,
  Trash2,
  FileCode,
  Paperclip,
  Plus,
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
  getUserDailyAiRemaining,
  AUTH_USER_DAILY_LIMIT,
  incrementUserDailyAiUsage,
  isUserDailyLimitReached,
} from "@/lib/guestAiQuota";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  promptQuery?: string;
  mode?: string;
}

interface AIInterviewDrawerProps {
  taskTitle?: string;
  category?: string;
  level?: string;
  concepts?: string[];
  codeSnippet?: string;
}

export const AIInterviewDrawer: React.FC<AIInterviewDrawerProps> = ({
  taskTitle = "React Machine Coding Task",
  category = "Frontend",
  level = "Intermediate",
  concepts = [],
  codeSnippet,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [guestRemaining, setGuestRemaining] = useState<number>(3);
  const [userDailyRemaining, setUserDailyRemaining] = useState<number>(100);

  const isGlobalHub =
    taskTitle.toLowerCase().includes("lab") ||
    taskTitle.toLowerCase().includes("directory") ||
    taskTitle.toLowerCase().includes("hub");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: isGlobalHub
        ? `👋 **Hi! I'm your AI Interview Coach for the React Machine Coding Lab.**\n\nI can help you build a personalized study roadmap from our **100 tasks**, review React 19 architectural patterns, explain time/space complexities, or simulate FAANG frontend system design interviews.\n\nClick any quick option below or ask me a specific question!`
        : `👋 **Hi! I'm your AI Interview Coach for "${taskTitle}".**\n\nI can help you ace this specific machine coding challenge with progressive hints, code reviews, or rapid-fire interview curveballs.\n\nClick any quick option below or ask me a specific question!`,
      timestamp: "Just now",
    },
  ]);

  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isCodeReviewOpen, setIsCodeReviewOpen] = useState<boolean>(false);
  const [candidateCode, setCandidateCode] = useState<string>("");
  const [isAIFullScreen, setIsAIFullScreen] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPromptRef = useRef<{ prompt: string; mode: string }>({ prompt: "", mode: "interview" });

  useEffect(() => {
    setMounted(true);
    setGuestRemaining(getGuestAiRemaining());
    setUserDailyRemaining(getUserDailyAiRemaining(user?.uid));

    const handleQuotaChange = () => {
      setGuestRemaining(getGuestAiRemaining());
      setUserDailyRemaining(getUserDailyAiRemaining(user?.uid));
    };

    window.addEventListener("guest-ai-quota-change", handleQuotaChange);
    window.addEventListener("user-ai-quota-change", handleQuotaChange);
    return () => {
      window.removeEventListener("guest-ai-quota-change", handleQuotaChange);
      window.removeEventListener("user-ai-quota-change", handleQuotaChange);
    };
  }, [user?.uid]);

  // Full Screen keyboard & scroll lock handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    if (isFullScreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.setAttribute("data-ai-fullscreen", "true");
      window.dispatchEvent(
        new CustomEvent("ai-fullscreen-change", { detail: { isFullScreen: true } })
      );
    } else if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.removeAttribute("data-ai-fullscreen");
      window.dispatchEvent(
        new CustomEvent("ai-fullscreen-change", { detail: { isFullScreen: false } })
      );
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.removeAttribute("data-ai-fullscreen");
      window.dispatchEvent(
        new CustomEvent("ai-fullscreen-change", { detail: { isFullScreen: false } })
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen, isOpen]);

  // Listen to external AI full screen events to completely hide trigger pill
  useEffect(() => {
    const handleExternalAIFullscreen = (e: Event) => {
      const customEvent = e as CustomEvent<{ isFullScreen: boolean }>;
      if (!isFullScreen) {
        setIsAIFullScreen(!!customEvent.detail?.isFullScreen);
      }
    };

    window.addEventListener("ai-fullscreen-change", handleExternalAIFullscreen);
    return () => {
      window.removeEventListener("ai-fullscreen-change", handleExternalAIFullscreen);
    };
  }, [isFullScreen]);

  // Load custom API key from localStorage if present
  useEffect(() => {
    const savedKey = localStorage.getItem("REACT_LAB_GEMINI_API_KEY");
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setInputQuery("");
    setCandidateCode("");
    setIsCodeReviewOpen(false);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: isGlobalHub
          ? `👋 **Hi! I'm your AI Interview Coach for the React Machine Coding Lab.**\n\nI can help you build a personalized study roadmap from our **100 tasks**, review React 19 architectural patterns, explain time/space complexities, or simulate FAANG frontend system design interviews.\n\nClick any quick option below or ask me a specific question!`
          : `👋 **Hi! I'm your AI Interview Coach for "${taskTitle}".**\n\nI can help you ace this specific machine coding challenge with progressive hints, code reviews, or rapid-fire interview curveballs.\n\nClick any quick option below or ask me a specific question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const saveCustomKey = (key: string) => {
    const trimmed = key.trim();
    setUserApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem("REACT_LAB_GEMINI_API_KEY", trimmed);
    } else {
      localStorage.removeItem("REACT_LAB_GEMINI_API_KEY");
    }
    setShowSettings(false);
  };

  const handleStopThinking = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCandidateCode(text);
        setIsCodeReviewOpen(true);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleSubmitCodeReview = () => {
    if (!candidateCode.trim() || isLoading) return;
    const prompt = `Please review and grade my implementation for "${taskTitle}" (${category}):\n\n\`\`\`tsx\n${candidateCode}\n\`\`\``;
    handleSendMessage(prompt, "review");
    setIsCodeReviewOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, isFullScreen]);

  const handleSendMessage = async (customPrompt?: string, mode: string = "interview") => {
    const queryToSend = customPrompt || inputQuery;
    if (!queryToSend.trim() || isLoading) return;

    lastPromptRef.current = { prompt: queryToSend, mode };

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: queryToSend,
      timestamp: "Just now",
      promptQuery: queryToSend,
      mode,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputQuery("");

    // 1. GUEST LIMIT INTERCEPTOR: Unauthenticated users are allowed max 3 AI chats
    if (!isAuthenticated) {
      if (isGuestAiLimitReached()) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              text: `🔒 **Free Guest Limit Reached (${GUEST_AI_MAX_LIMIT}/${GUEST_AI_MAX_LIMIT} chats used)**\n\nYou've used your 3 free questions on this device. Please **Sign In** with Google, GitHub, or Email to unlock **100 AI Coaching messages per day**, interview hints, and progress tracking!`,
              timestamp: "Just now",
            },
          ]);
        }, 150);
        openAuthModal("login");
        return;
      }
      incrementGuestAiUsage();
      setGuestRemaining(getGuestAiRemaining());
    } else if (!userApiKey) {
      // 2. AUTHENTICATED USER DAILY LIMIT: 100 messages / day (unless custom BYOK key is set)
      if (isUserDailyLimitReached(user?.uid)) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              text: `🔒 **Daily AI Limit Reached (100/100 chats used today)**\n\nYou have used your **100 daily AI coaching messages** for today. Your quota will automatically reset at midnight!\n\n💡 *Tip: You can also configure your own personal Google Gemini API Key in Settings (⚙️ icon) to continue without daily limits.*`,
              timestamp: "Just now",
            },
          ]);
        }, 150);
        return;
      }
      incrementUserDailyAiUsage(user?.uid);
      setUserDailyRemaining(getUserDailyAiRemaining(user?.uid));
    }

    // TOKEN SAVINGS INTERCEPTOR: Answer simple casual greetings locally without API calls
    const localGreeting = getLocalGreetingResponse(queryToSend, taskTitle);
    if (localGreeting) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: localGreeting,
            timestamp: "Just now",
            promptQuery: queryToSend,
            mode,
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
          prompt: queryToSend,
          mode,
          userApiKey: userApiKey || undefined,
          uid: user?.uid || undefined,
          context: {
            taskTitle,
            category,
            level,
            concepts,
            code: codeSnippet,
          },
        }),
      });

      const data = await res.json();

      if (data.remaining !== undefined && isAuthenticated) {
        setUserDailyRemaining(data.remaining);
      }

      if (!res.ok || data.error) {
        if (data.requiresAuth) {
          openAuthModal("login");
        }
        throw new Error(data.error || "Failed to communicate with AI.");
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.response || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        promptQuery: queryToSend,
        mode,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      if (err.name === "AbortError") {
        const cancelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "system",
          text: "⏹ *Generation stopped by user.*",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          promptQuery: queryToSend,
          mode,
        };
        setMessages((prev) => [...prev, cancelMsg]);
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "system",
          text: `⚠️ **Notice:** ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          promptQuery: queryToSend,
          mode,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = (promptToRetry?: string, modeToRetry: string = "interview") => {
    const p = promptToRetry || lastPromptRef.current.prompt;
    const m = modeToRetry || lastPromptRef.current.mode;
    if (p) handleSendMessage(p, m);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Concise Quick Prompts
  const quickActions = isGlobalHub
    ? [
        {
          icon: <Compass className="w-3.5 h-3.5 text-amber-400" />,
          label: "🗺️ 7-Day Plan",
          onClick: () =>
            handleSendMessage(
              "Recommend a 7-day study roadmap from the 100-task curriculum for SDE-2 interview prep with 5 key benchmark tasks.",
              "interview"
            ),
        },
        {
          icon: <Layers className="w-3.5 h-3.5 text-indigo-400" />,
          label: "🏢 FAANG Tasks",
          onClick: () =>
            handleSendMessage(
              "What are the top 5 most frequently asked frontend machine coding problems at Google, Meta, and Amazon from this 100-task catalog?",
              "interview"
            ),
        },
        {
          icon: <Code2 className="w-3.5 h-3.5 text-amber-400" />,
          label: "📋 Paste Code to Review",
          onClick: () => setIsCodeReviewOpen((prev) => !prev),
        },
        {
          icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
          label: "⚡ React 19 Hooks",
          onClick: () =>
            handleSendMessage(
              "Explain how to effectively use React 19 hooks (useTransition, useActionState, useOptimistic) in machine coding interviews.",
              "interview"
            ),
        },
      ]
    : [
        {
          icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" />,
          label: "💡 Hint",
          onClick: () =>
            handleSendMessage(
              `Give me a progressive Level 1 hint for "${taskTitle}" (${category}). Guide my mental model and state architecture without writing the full code.`,
              "hint"
            ),
        },
        {
          icon: <Code2 className="w-3.5 h-3.5 text-amber-400" />,
          label: "📋 Paste Code to Review",
          onClick: () => setIsCodeReviewOpen((prev) => !prev),
        },
        {
          icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
          label: "🧪 Edge Cases",
          onClick: () =>
            handleSendMessage(
              `What are 5 critical edge cases, boundary failures, and test assertions for "${taskTitle}"?`,
              "edge_cases"
            ),
        },
        {
          icon: <Bot className="w-3.5 h-3.5 text-purple-400" />,
          label: "🔥 Grill Me",
          onClick: () =>
            handleSendMessage(
              `Act as a Staff Frontend Interviewer. Ask me 3 challenging optimization follow-up questions specifically about "${taskTitle}".`,
              "interview"
            ),
        },
      ];

  // Completely hide trigger pill and drawer when Home AI Fullscreen is active
  if (isAIFullScreen) {
    return null;
  }

  const drawerOverlay = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

            {/* Slide-out Drawer Panel / Full Screen Overlay */}
            <motion.div
              initial={isFullScreen ? { opacity: 0 } : { x: "100%" }}
              animate={isFullScreen ? { opacity: 1, x: 0 } : { x: 0 }}
              exit={isFullScreen ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed ${
                isFullScreen
                  ? "inset-0 top-0 left-0 right-0 bottom-0 z-[999999] w-screen h-[100dvh] m-0 p-0"
                  : `top-0 right-0 h-full ${
                      isExpanded ? "w-full lg:w-[65vw]" : "w-full sm:w-[480px] lg:w-[520px]"
                    } border-l border-slate-800 z-50`
              } bg-[#07090e] shadow-2xl flex flex-col font-sans overflow-hidden`}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight whitespace-nowrap">
                      {isGlobalHub ? (
                        <>
                          React<span className="text-amber-400">Forge</span> AI Coach
                        </>
                      ) : (
                        "AI Task Interviewer"
                      )}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold flex-shrink-0">
                      Online
                    </span>

                    {isAuthenticated ? (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-semibold hidden sm:inline-flex items-center gap-1 flex-shrink-0"
                        title="100 AI chats allowed per day. Resets every midnight."
                      >
                        ✨ {userDailyRemaining}/{AUTH_USER_DAILY_LIMIT} Daily
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openAuthModal("login")}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 border border-amber-500/30 hover:border-amber-400 font-mono font-semibold flex items-center gap-1 flex-shrink-0 cursor-pointer"
                        title="3 free guest chats allowed. Click to Sign In for 100 daily chats."
                      >
                        <span>⚡ Guest: {guestRemaining}/{GUEST_AI_MAX_LIMIT} Left</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-light truncate max-w-[260px] mt-0.5">
                    {isGlobalHub ? "100 Tasks Curriculum" : `Task: ${taskTitle}`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {/* New Chat Button */}
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-800 transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Start fresh chat"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden md:inline text-[11px]">New Chat</span>
                  </button>

                  {/* API Key Configuration */}
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      userApiKey
                        ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                    }`}
                    title="API Key Configuration"
                  >
                    <Key className="w-4 h-4" />
                  </button>

                  {/* Full Screen Mode Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isFullScreen
                        ? "border-amber-500/40 bg-amber-500/15 text-amber-300 font-semibold px-3"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                    }`}
                    title={isFullScreen ? "Exit Full Screen (Esc)" : "Original Full Screen Chat"}
                  >
                    {isFullScreen ? (
                      <>
                        <Minimize2 className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px] hidden sm:inline">Exit Full Screen</span>
                      </>
                    ) : (
                      <Maximize2 className="w-4 h-4 text-amber-400" />
                    )}
                  </button>

                  {/* Close Drawer Button */}
                  <button
                    onClick={() => {
                      setIsFullScreen(false);
                      setIsOpen(false);
                    }}
                    className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* API Configuration Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 border-b border-slate-800 bg-slate-950 space-y-3 text-xs flex-shrink-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Custom API Key (Optional)
                      </span>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Get Free Key ↗
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="Paste your Google AI Studio API key..."
                        value={userApiKey}
                        onChange={(e) => setUserApiKey(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        onClick={() => saveCustomKey(userApiKey)}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Concise Quick Action Chips (auto-hidden after second message) */}
              <AnimatePresence>
                {messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] flex-shrink-0"
                  >
                    {quickActions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.onClick}
                        disabled={isLoading}
                        className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                          item.label.includes("Paste Code") && isCodeReviewOpen
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-sm"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Message Stream with Ambient Background Watermark */}
              <div className="relative flex-1 min-h-0 flex flex-col">
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

                <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                  {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
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
                          : "bg-slate-900/90 text-slate-100 border border-slate-800/90"
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
                              onClick={() => handleRetry(msg.promptQuery, msg.mode)}
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
                              onClick={() => copyMessage(msg.id, msg.text)}
                              className="text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer flex items-center gap-1"
                              title="Copy message"
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

                <div ref={messagesEndRef} />
              </div>
            </div>

              {/* Expandable Code Review Workbench */}
              <AnimatePresence>
                {isCodeReviewOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-t border-slate-800 bg-slate-950/95 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">Paste Solution to Review</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800 font-mono">
                          React / TypeScript
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* File Upload Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                          title="Upload .tsx / .ts / .jsx file"
                        >
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>Upload File</span>
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept=".tsx,.ts,.jsx,.js,.txt"
                          className="hidden"
                        />

                        {/* Clear Button */}
                        {candidateCode && (
                          <button
                            type="button"
                            onClick={() => setCandidateCode("")}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="Clear code"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Close Expander */}
                        <button
                          type="button"
                          onClick={() => setIsCodeReviewOpen(false)}
                          className="text-slate-500 hover:text-white p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Code Textarea with Monospace Font */}
                    <textarea
                      rows={6}
                      value={candidateCode}
                      onChange={(e) => setCandidateCode(e.target.value)}
                      placeholder={`// Paste your React component or custom hook for "${taskTitle}" here...\n\nexport default function Solution() {\n  const [state, setState] = useState();\n  // ...\n}`}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-100 placeholder-slate-600 outline-none focus:border-amber-400 resize-y leading-relaxed"
                    />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {candidateCode
                          ? `${candidateCode.split("\n").length} lines • ${candidateCode.length} chars`
                          : "Paste code or upload file"}
                      </span>

                      <button
                        type="button"
                        onClick={handleSubmitCodeReview}
                        disabled={!candidateCode.trim() || isLoading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Submit for AI Review</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isLoading) {
                      handleStopThinking();
                    } else {
                      handleSendMessage();
                    }
                  }}
                  className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-amber-400 rounded-2xl p-1.5 transition-all shadow-inner"
                >
                  {/* Quick Code Review Toggle Icon */}
                  <button
                    type="button"
                    onClick={() => setIsCodeReviewOpen((prev) => !prev)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isCodeReviewOpen
                        ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                        : "bg-slate-900 text-slate-400 hover:text-amber-300 border-slate-800"
                    }`}
                    title="Paste Code to Review"
                  >
                    <Code2 className="w-4 h-4" />
                  </button>

                  {/* Direct File Upload Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCodeReviewOpen(true);
                      fileInputRef.current?.click();
                    }}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
                    title="Upload Code File (.tsx, .ts, .jsx, .js)"
                  >
                    <Paperclip className="w-4 h-4 text-amber-400" />
                  </button>

                  <input
                    type="text"
                    placeholder={
                      isGlobalHub
                        ? "Ask about 100-task curriculum, roadmaps, or React architecture..."
                        : `Ask about ${taskTitle} architecture, hints, or reviews...`
                    }
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 outline-none disabled:opacity-50"
                  />

                  {isLoading ? (
                    <button
                      type="button"
                      onClick={handleStopThinking}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all shadow-md cursor-pointer flex-shrink-0"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputQuery.trim()}
                      className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );

    return (
      <>
        {/* Floating Trigger Pill */}
        <div className="fixed bottom-6 right-6 z-50 font-sans">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 pl-3.5 pr-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-bold text-xs shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] border border-amber-300 transition-all cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-950/20 p-0.5 flex items-center justify-center">
              <Image
                src="/ReactForge_Icon.png"
                alt="ReactForge AI"
                width={24}
                height={24}
                className="w-full h-full object-contain group-hover:rotate-12 transition-transform duration-300"
              />
            </div>
            <span>AI Interviewer</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/20 font-mono font-bold">
              Online
            </span>
          </motion.button>
        </div>

        {/* Portal-rendered drawer overlay onto document.body */}
        {mounted && typeof document !== "undefined"
          ? createPortal(drawerOverlay, document.body)
          : drawerOverlay}
      </>
    );
  };

  export default AIInterviewDrawer;
