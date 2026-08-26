"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";
import { getLocalGreetingResponse } from "@/lib/aiGreetings";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
}

interface AIInterviewDrawerProps {
  taskTitle?: string;
  category?: string;
  level?: string;
  concepts?: string[];
  codeSnippet?: string;
}

export const AIInterviewDrawer: React.FC<AIInterviewDrawerProps> = ({
  taskTitle = "React Practice Lab",
  category = "Frontend Architecture",
  level = "Intermediate",
  concepts = [],
  codeSnippet = "",
}) => {
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
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage if present
  useEffect(() => {
    const savedKey = localStorage.getItem("REACT_LAB_GEMINI_API_KEY");
    if (savedKey) setUserApiKey(savedKey);
  }, []);

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

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string, mode: string = "interview") => {
    const queryToSend = customPrompt || inputQuery;
    if (!queryToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputQuery("");

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
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 150);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryToSend,
          mode,
          userApiKey: userApiKey || undefined,
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

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to communicate with AI.");
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.response || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        text: `⚠️ **Notice:** ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
          label: "🗺️ 7-Day Study Plan",
          prompt: "Recommend a 7-day study roadmap from the 100-task curriculum for SDE-2 interview prep with 5 key benchmark tasks.",
          mode: "interview",
        },
        {
          icon: <Layers className="w-3.5 h-3.5 text-indigo-400" />,
          label: "🏢 FAANG Common Tasks",
          prompt: "What are the top 5 most frequently asked frontend machine coding problems at Google, Meta, and Amazon from this 100-task catalog?",
          mode: "interview",
        },
        {
          icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
          label: "⚡ React 19 Hooks Guide",
          prompt: "Explain how to effectively use React 19 hooks (useTransition, useActionState, useOptimistic) in machine coding interviews.",
          mode: "interview",
        },
        {
          icon: <Trophy className="w-3.5 h-3.5 text-purple-400" />,
          label: "🔥 Mock System Design",
          prompt: "Act as a Senior FAANG Frontend Interviewer. Ask me 3 challenging machine coding interview questions regarding virtual tables, state syncing, and debouncing.",
          mode: "interview",
        },
      ]
    : [
        {
          icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" />,
          label: "💡 Hint",
          prompt: `Give me a progressive Level 1 hint for "${taskTitle}" (${category}). Guide my mental model and state architecture without writing the full code.`,
          mode: "hint",
        },
        {
          icon: <Code2 className="w-3.5 h-3.5 text-indigo-400" />,
          label: "🔍 Code Review",
          prompt: `Review my code implementation for "${taskTitle}". Analyze potential re-renders, hook choice, memory leaks, and time complexity.`,
          mode: "review",
        },
        {
          icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
          label: "🧪 Edge Cases",
          prompt: `What are 5 critical edge cases, boundary failures, and test assertions for "${taskTitle}"?`,
          mode: "edge_cases",
        },
        {
          icon: <Bot className="w-3.5 h-3.5 text-purple-400" />,
          label: "🔥 Grill Me",
          prompt: `Act as a Staff Frontend Interviewer. Ask me 3 challenging optimization follow-up questions specifically about "${taskTitle}".`,
          mode: "interview",
        },
      ];

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-bold text-xs shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] border border-amber-300 transition-all cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span>AI Interviewer</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/20 font-mono font-bold">
            Gemini
          </span>
        </motion.button>
      </div>

      {/* Drawer Overlay & Panel */}
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

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full ${
                isExpanded ? "w-full lg:w-[65vw]" : "w-full sm:w-[480px] lg:w-[520px]"
              } bg-[#07090e] border-l border-slate-800 shadow-2xl z-50 flex flex-col font-sans transition-all duration-300`}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-base shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {isGlobalHub ? "AI Interview Coach" : "AI Task Interviewer"}
                      </h3>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-light truncate max-w-[240px]">
                      {isGlobalHub ? "100 Tasks Curriculum" : `Task: ${taskTitle}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg border transition-colors ${
                      userApiKey
                        ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                    }`}
                    title="API Key Configuration"
                  >
                    <Key className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:inline-flex p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title={isExpanded ? "Collapse width" : "Expand width"}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                    className="p-4 border-b border-slate-800 bg-slate-950 space-y-3 text-xs"
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

              {/* Concise Quick Action Chips */}
              <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
                {quickActions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt, item.mode)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
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
                        <span>{msg.timestamp}</span>

                        {msg.role === "assistant" && (
                          <button
                            onClick={() => copyMessage(msg.id, msg.text)}
                            className="text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    </div>
                    <span className="font-mono text-[11px] text-amber-300">
                      AI is formulating response...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-amber-400 rounded-2xl p-1.5 transition-all shadow-inner"
                >
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

                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIInterviewDrawer;
