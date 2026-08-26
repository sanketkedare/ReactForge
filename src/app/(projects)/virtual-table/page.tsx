"use client";

import React, { useState, useMemo, useRef } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { Search, ArrowUpDown, ShieldCheck, Activity, Database } from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  sender: string;
  category: "Payroll" | "Server Infrastructure" | "Subscription" | "Security Audit" | "Vendor";
  amount: number;
  status: "Completed" | "Pending" | "Settled";
}

// Generate 10,000 mock financial records
const GENERATE_TRANSACTIONS = (count: number): Transaction[] => {
  const categories: Transaction["category"][] = [
    "Payroll",
    "Server Infrastructure",
    "Subscription",
    "Security Audit",
    "Vendor",
  ];
  const statuses: Transaction["status"][] = ["Completed", "Pending", "Settled"];
  const senders = ["Stripe Inc.", "AWS Cloud Services", "GitHub Copilot", "Vercel Enterprise", "Cloudflare Pro", "Datadog Monitoring", "MongoDB Atlas"];

  const items: Transaction[] = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: i,
      date: `2026-08-${String((i % 28) + 1).padStart(2, "0")}`,
      sender: senders[i % senders.length],
      category: categories[i % categories.length],
      amount: Math.floor(Math.random() * 8500) + 150,
      status: statuses[i % statuses.length],
    });
  }
  return items;
};

const ALL_TRANSACTIONS = GENERATE_TRANSACTIONS(10000);

export default function VirtualTablePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Transaction>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [scrollTop, setScrollTop] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Virtualization constants
  const ROW_HEIGHT = 48; // px
  const CONTAINER_HEIGHT = 480; // px
  const BUFFER_COUNT = 5;

  // Filter and Sort
  const filteredData = useMemo(() => {
    let result = ALL_TRANSACTIONS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.sender.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.status.toLowerCase().includes(q) ||
          String(t.id).includes(q)
      );
    }

    return [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [searchQuery, sortField, sortOrder]);

  // Windowing Calculations
  const totalCount = filteredData.length;
  const totalHeight = totalCount * ROW_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_COUNT);
  const endIndex = Math.min(
    totalCount,
    Math.ceil((scrollTop + CONTAINER_HEIGHT) / ROW_HEIGHT) + BUFFER_COUNT
  );

  const visibleItems = filteredData.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Virtual Windowed Data Table (10k Rows)"
        description="Render and scroll through 10,000 real-time rows smoothly at 60 FPS by calculating dynamic viewport offsets and rendering only visible nodes."
        level="expert"
        category="Performance & Virtualization"
        skills={["DOM Virtual Windowing", "Sortable Multi-Column Matrix", "60 FPS Render Optimization"]}
        estimatedMinutes={50}
        whatYouWillBuild="A high-performance virtualized financial transaction table holding 10,000 records with column sorting and sub-millisecond search filters."
        keyTakeaways={[
          "Calculating startIndex and endIndex from scrollTop and container height",
          "Applying absolute transform/offset positioning for smooth scrolling without layout thrashing",
          "Handling multi-column sorting and in-memory search across thousands of records",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="space-y-6">
          {/* Controls Bar & Metrics */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 10,000 records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>

            {/* Live Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Total: {totalCount.toLocaleString()}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Rendered in DOM: {visibleItems.length} rows</span>
              </span>
            </div>
          </div>

          {/* Virtual Table Container */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
            {/* Table Header (Sticky) */}
            <div className="grid grid-cols-6 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 select-none">
              <div
                onClick={() => handleSort("id")}
                className="flex items-center gap-1 cursor-pointer hover:text-amber-300"
              >
                <span>ID</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
              <div
                onClick={() => handleSort("date")}
                className="flex items-center gap-1 cursor-pointer hover:text-amber-300"
              >
                <span>Date</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
              <div
                onClick={() => handleSort("sender")}
                className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-amber-300"
              >
                <span>Entity / Vendor</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
              <div
                onClick={() => handleSort("amount")}
                className="flex items-center gap-1 cursor-pointer hover:text-amber-300 justify-end pr-4"
              >
                <span>Amount</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
              <div
                onClick={() => handleSort("status")}
                className="flex items-center gap-1 cursor-pointer hover:text-amber-300"
              >
                <span>Status</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </div>

            {/* Virtual Scroll Window */}
            <div
              ref={containerRef}
              onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
              style={{ height: `${CONTAINER_HEIGHT}px` }}
              className="overflow-y-auto relative font-sans text-xs divide-y divide-slate-900"
            >
              {/* Virtual Height Spacer */}
              <div style={{ height: `${totalHeight}px`, position: "relative" }}>
                {/* Virtual Rows Window */}
                <div
                  style={{
                    transform: `translateY(${offsetY}px)`,
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                  }}
                >
                  {visibleItems.map((item) => (
                    <div
                      key={item.id}
                      style={{ height: `${ROW_HEIGHT}px` }}
                      className="grid grid-cols-6 px-6 items-center hover:bg-slate-900/60 transition-colors border-b border-slate-900/80"
                    >
                      <span className="font-mono text-slate-500">#{item.id}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.date}</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{item.sender}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-amber-300 text-right pr-4">
                        ${item.amount.toLocaleString()}
                      </span>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                            item.status === "Completed"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                              : item.status === "Settled"
                              ? "bg-indigo-950/80 text-indigo-400 border-indigo-800"
                              : "bg-amber-950/80 text-amber-400 border-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
