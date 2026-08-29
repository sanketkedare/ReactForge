"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminCurriculumPage() {
  const { curriculumStats } = useAdmin();

  const [curriculumTrackFilter, setCurriculumTrackFilter] = useState<string>("all");
  const [taskSearch, setTaskSearch] = useState("");

  const filteredCurriculum = useMemo(() => {
    return curriculumStats.filter((c) => {
      const matchesTrack = curriculumTrackFilter === "all" || c.level === curriculumTrackFilter;
      const matchesSearch =
        c.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        c.category.toLowerCase().includes(taskSearch.toLowerCase()) ||
        c.slug.toLowerCase().includes(taskSearch.toLowerCase());
      return matchesTrack && matchesSearch;
    });
  }, [curriculumStats, curriculumTrackFilter, taskSearch]);

  return (
    <div className="space-y-6">
      {/* Track & Search Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-[#0a0d14] border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            placeholder="Search task by title or slug..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: `All 100 Tasks` },
            { id: "beginner", label: "🟢 SDE-1 (40)" },
            { id: "intermediate", label: "🟡 SDE-2 (35)" },
            { id: "expert", label: "🟣 SDE-3 (25)" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setCurriculumTrackFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                curriculumTrackFilter === t.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filteredCurriculum.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800/80 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-2xl shrink-0">{t.icon}</span>
              <div className="overflow-hidden">
                <div className="font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                  {t.title}
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {t.category} • ~{t.estimatedMinutes}m
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                {t.solves} solves
              </span>
              <Link
                href={t.path}
                target="_blank"
                prefetch={false}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
