"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Code2,
  Trophy,
  Compass,
  Key,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";
import { getLocalGreetingResponse } from "@/lib/aiGreetings";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
}

export const HomeAIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text: `👋 **Welcome to the React Lab AI Interview Coach!**\n\nI can help you build a personalized study roadmap from our **100 tasks**, review React 19 architectural patterns, explain time/space complexities, or simulate FAANG frontend system design interviews.\n\nTry clicking any quick question below or type your own question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("REACT_LAB_GEMINI_API_KEY");
    if (saved) setUserApiKey(saved);
  }, []);

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

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput("");

    // TOKEN SAVINGS INTERCEPTOR: Answer simple casual greetings locally without API calls
    const localGreeting = getLocalGreetingResponse(textToSend, "React Machine Coding Hub");
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
          prompt: textToSend,
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
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "system",
        text: `⚠️ **Notice:** ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="w-full rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-[#0a0e17] to-slate-950 shadow-2xl p-6 sm:p-8 backdrop-blur-xl font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">AI Interview Assistant</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Curriculum guidance, interview roadmaps, and React 19 architectural advice across all 100 tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Optional Custom Key Input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
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

      {/* Home-Specific Quick Prompts */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Curriculum & Strategy Discussion Starters:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {homeQuickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              disabled={isLoading}
              className="p-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 hover:bg-slate-900 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all text-left flex items-start gap-2.5 group cursor-pointer disabled:opacity-50"
            >
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <span className="font-light text-[11px] leading-relaxed group-hover:text-amber-200">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Scroll Area */}
      <div
        ref={chatScrollRef}
        className="max-h-[420px] min-h-[200px] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-4 text-xs"
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
                <span>{msg.timestamp}</span>

                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyText(msg.id, msg.text)}
                    className="text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer"
                    title="Copy response"
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
              AI is analyzing and formulating response...
            </span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-amber-400 rounded-2xl p-2 transition-all shadow-inner"
      >
        <input
          type="text"
          placeholder="Ask about 100-task curriculum, roadmaps, or React 19 architecture..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer flex-shrink-0"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default HomeAIChat;
