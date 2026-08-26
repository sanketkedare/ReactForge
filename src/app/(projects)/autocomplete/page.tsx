"use client";

import React, { useState, useEffect, useRef } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Search, History, Sparkles, ArrowRight, X } from "lucide-react";

interface SearchItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

const SAMPLE_DATABASE: SearchItem[] = [
  { id: "1", name: "React 19 Server Components", category: "Framework", description: "Zero-bundle-size React components executed on server" },
  { id: "2", name: "React Query (TanStack Query)", category: "Data Fetching", description: "Powerful async state management and caching for TS/JS" },
  { id: "3", name: "Redux Toolkit (RTK Query)", category: "State Management", description: "The official, opinionated, batteries-included toolset for Redux" },
  { id: "4", name: "Zustand State Store", category: "State Management", description: "Bearbones state-management solution using simplified flux principles" },
  { id: "5", name: "Next.js App Router", category: "Framework", description: "React full-stack framework with streaming, layouts, and server actions" },
  { id: "6", name: "TypeScript Generics & Utilities", category: "Language", description: "Static typing system for JavaScript with advanced utility types" },
  { id: "7", name: "Tailwind CSS v4", category: "Styling", description: "Utility-first CSS framework for rapid modern UI development" },
  { id: "8", name: "Framer Motion Animations", category: "Animation", description: "Production-ready motion library for React components" },
  { id: "9", name: "Jest & React Testing Library", category: "Testing", description: "Lightweight utility for testing React DOM component trees" },
  { id: "10", name: "Vite Next-Gen Bundler", category: "Build Tools", description: "Blazing fast frontend build tool powered by esbuild and Rollup" },
];

export default function AutocompletePage() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "React Query",
    "Zustand State Store",
  ]);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounce logic (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Query filtering
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const q = debouncedQuery.toLowerCase();
    const filtered = SAMPLE_DATABASE.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );

    setResults(filtered);
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        selectResult(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setResults([]);
      setSelectedIndex(-1);
    }
  };

  const selectResult = (item: SearchItem) => {
    setSelectedItem(item);
    setQuery(item.name);
    setResults([]);
    // Add to recent searches
    setRecentSearches((prev) => [item.name, ...prev.filter((s) => s !== item.name)].slice(0, 5));
  };

  // Match Highlighter helper
  const highlightMatch = (text: string, match: string) => {
    if (!match.trim()) return text;
    const regex = new RegExp(`(${match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-400/30 text-amber-200 rounded px-0.5 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Autocomplete & Typeahead Search"
        description="Build a debounced search input with matched keyword highlighting, keyboard navigation (Arrow keys/Enter), and recent search history."
        level="intermediate"
        category="Search & UX"
        skills={["Debounced Search", "Substring Match Highlighting", "Keyboard Navigation (ArrowUp/Down)"]}
        estimatedMinutes={35}
        whatYouWillBuild="A search engine typeahead interface that debounces queries, highlights character matches in yellow, and allows full keyboard-driven navigation."
        keyTakeaways={[
          "Debouncing state changes to prevent aggressive re-renders and unnecessary network requests",
          "Highlighting substrings safely using RegExp and string splitting",
          "Controlling focused search index with ArrowUp, ArrowDown, and Enter handlers",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Box Card */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-4 relative">
            <div className="relative">
              <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tools, frameworks, libraries (e.g. 'React', 'Zustand')..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setSelectedItem(null);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Dropdown Menu */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden divide-y divide-slate-900"
                >
                  {results.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => selectResult(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-4 text-left cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                          isSelected ? "bg-amber-950/40 text-amber-200" : "hover:bg-slate-900/80 text-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {highlightMatch(item.name, debouncedQuery)}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-light line-clamp-1">
                            {highlightMatch(item.description, debouncedQuery)}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Searches Tags */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                  <History className="w-3 h-3" /> Recent:
                </span>
                {recentSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      const found = SAMPLE_DATABASE.find((i) => i.name === tag);
                      if (found) setSelectedItem(found);
                    }}
                    className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 text-[11px] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Item Preview Detail Card */}
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl border border-amber-500/40 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {selectedItem.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ID #{selectedItem.id}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {selectedItem.description}
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
