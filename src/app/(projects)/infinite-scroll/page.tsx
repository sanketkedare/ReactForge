"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, RotateCcw, Sliders, Layers } from "lucide-react";

interface FeedItem {
  id: number;
  title: string;
  category: string;
  likes: number;
  readTime: string;
  author: string;
}

const CATEGORIES = ["React 19", "Next.js", "Performance", "State Architecture", "TypeScript"];

export default function InfiniteScrollPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [simulatedDelay, setSimulatedDelay] = useState<number>(600); // ms

  const TOTAL_ITEMS = 50;
  const ITEMS_PER_PAGE = 10;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Mock API Fetcher
  const fetchPageData = useCallback(
    async (pageNumber: number) => {
      if (isLoading) return;
      setIsLoading(true);

      // Simulate network latency
      await new Promise((res) => setTimeout(res, simulatedDelay));

      const startIdx = (pageNumber - 1) * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;

      if (startIdx >= TOTAL_ITEMS) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const newBatch: FeedItem[] = [];
      for (let i = startIdx + 1; i <= Math.min(endIdx, TOTAL_ITEMS); i++) {
        newBatch.push({
          id: i,
          title: `Frontend Engineering Pattern #${i}: Scalable UI Architecture`,
          category: CATEGORIES[i % CATEGORIES.length],
          likes: Math.floor(Math.random() * 800) + 120,
          readTime: `${(i % 5) + 3} min read`,
          author: `Engineer @Lab_${(i % 4) + 1}`,
        });
      }

      setItems((prev) => [...prev, ...newBatch]);
      setPage(pageNumber + 1);
      if (endIdx >= TOTAL_ITEMS) {
        setHasMore(false);
      }
      setIsLoading(false);
    },
    [isLoading, simulatedDelay]
  );

  // Initial Load
  useEffect(() => {
    fetchPageData(1);
  }, []);

  // Intersection Observer for Sentinel element
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPageData(page);
        }
      },
      { rootMargin: "150px" } // trigger 150px before reaching viewport bottom
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, page, fetchPageData]);

  const handleReset = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchPageData(1);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Infinite Scroll List (Intersection Observer)"
        description="Build an infinite scrolling feed that monitors a sentinel element using the browser IntersectionObserver API to auto-paginate and render items smoothly."
        level="intermediate"
        category="API & Async"
        skills={["IntersectionObserver API", "Sentinel Pattern", "Simulated Pagination"]}
        estimatedMinutes={35}
        whatYouWillBuild="An infinite feed simulator loading batches of 10 cards per scroll threshold until reaching the 50-item cap."
        keyTakeaways={[
          "Setting up an IntersectionObserver with clean ref management",
          "Applying rootMargin to trigger the next fetch ahead of user reaching bottom",
          "Handling loading skeletons and the terminal end-of-list state",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">
                Loaded Items: <span className="text-amber-300">{items.length}</span> / {TOTAL_ITEMS}
              </span>
            </div>

            {/* Delay Slider */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Simulated Latency: {simulatedDelay}ms</span>
              <input
                type="range"
                min={200}
                max={1500}
                step={100}
                value={simulatedDelay}
                onChange={(e) => setSimulatedDelay(Number(e.target.value))}
                className="w-24 accent-amber-400"
              />
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Feed</span>
            </button>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">#{item.id}</span>
                  </div>
                  <h3 className="font-semibold text-base text-white">{item.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-light">
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                    <span>•</span>
                    <span className="text-amber-300/80">❤️ {item.likes}</span>
                  </div>
                </div>

                <button className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex-shrink-0">
                  Read Article
                </button>
              </motion.div>
            ))}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="space-y-3 pt-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-slate-800/50 bg-slate-900/20 animate-pulse space-y-3"
                  >
                    <div className="w-24 h-4 rounded bg-slate-800" />
                    <div className="w-3/4 h-5 rounded bg-slate-800" />
                    <div className="w-1/2 h-3 rounded bg-slate-800" />
                  </div>
                ))}
              </div>
            )}

            {/* Sentinel Element for IntersectionObserver */}
            <div ref={sentinelRef} className="h-6" />

            {/* End of list banner */}
            {!hasMore && (
              <div className="p-6 text-center text-xs text-slate-400 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You have reached the end of the feed (50 of 50 items loaded).</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
