"use client";

import React, { useState } from "react";
import { AlertOctagon, CheckCircle2, RefreshCw, Terminal, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Incident {
  id: string;
  title: string;
  severity: "SEV-1" | "SEV-2" | "SEV-3";
  symptoms: string;
  impact: string;
  rootCause: string;
  fix: string;
  regressionPrevention: string;
  snippetBuggy: string;
  snippetFixed: string;
}

const INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    title: "Search Typeahead Async Race Condition",
    severity: "SEV-1",
    symptoms: "User types 'react' then quickly types 'hooks'. The search results for 'react' return second and overwrite 'hooks'.",
    impact: "Users see wrong and outdated results after rapid typing; high user confusion and reported search bug.",
    rootCause: "Uncontrolled async fetch promises resolving out-of-order without cancellation or version tagging.",
    fix: "Use AbortController to abort in-flight requests on each new keystroke, or maintain a request sequence counter.",
    regressionPrevention: "Automated async race test asserting that stale responses are safely dropped when a newer query is initiated.",
    snippetBuggy: `// ❌ Buggy: Older requests resolve after newer ones and overwrite state
useEffect(() => {
  fetch('/api/search?q=' + query)
    .then(res => res.json())
    .then(data => setResults(data));
}, [query]);`,
    snippetFixed: `// ✅ Fixed: AbortController cancels in-flight requests cleanly
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/search?q=' + query, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setResults(data))
    .catch(err => { if (err.name !== 'AbortError') setError(err); });
  return () => controller.abort();
}, [query]);`,
  },
  {
    id: "INC-002",
    title: "Timer & Event Listener Memory Leak on Unmount",
    severity: "SEV-2",
    symptoms: "Browser tab memory climbs steadily during navigation; background polling continues after leaving the page.",
    impact: "Progressive performance degradation, eventual tab crash on low-memory mobile devices.",
    rootCause: "setInterval and window.addEventListener created in useEffect without returning a cleanup function.",
    fix: "Always return a cleanup closure invoking clearInterval() and removeEventListener().",
    regressionPrevention: "Component unmount memory leak tests via React Testing Library.",
    snippetBuggy: `// ❌ Buggy: Polling timer leaks after component unmounts
useEffect(() => {
  setInterval(() => {
    fetchMetrics();
  }, 1000);
}, []);`,
    snippetFixed: `// ✅ Fixed: Cleanup function clears interval upon unmount
useEffect(() => {
  const intervalId = setInterval(() => {
    fetchMetrics();
  }, 1000);
  return () => clearInterval(intervalId);
}, []);`,
  },
  {
    id: "INC-003",
    title: "Unnecessary Global Render Cascade via God Context",
    severity: "SEV-2",
    symptoms: "Typing a single character in an input field causes 50+ unrelated dashboard widgets to re-render, dropping FPS to < 20.",
    impact: "High input latency, sluggish typing experience.",
    rootCause: "Monolithic context value object re-instantiated on every render, invalidating all consumer components.",
    fix: "Split god context into specialized sliced contexts or adopt primitive selectors via Zustand.",
    regressionPrevention: "Profiler render-count assertion test verifying unaffected nodes do not reconcile.",
    snippetBuggy: `// ❌ Buggy: New object reference triggers full-tree re-render
const value = { user, theme, search, notifications, activeTab };
return <AppContext.Provider value={value}>{children}</AppContext.Provider>;`,
    snippetFixed: `// ✅ Fixed: Sliced Contexts or Memoized Values
const userValue = useMemo(() => ({ user }), [user]);
return (
  <UserContext.Provider value={userValue}>
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  </UserContext.Provider>
);`,
  },
  {
    id: "INC-004",
    title: "Large DOM List Scrolling Freeze (10k Rows)",
    severity: "SEV-1",
    symptoms: "Rendering an un-virtualized 5,000 item table freezes the browser UI for 3.2 seconds.",
    impact: "Unresponsive page, browser 'Page Unresponsive' dialog displayed to users.",
    rootCause: "Mounting 50,000 DOM elements into the document tree simultaneously.",
    fix: "Implement viewport virtualization with @tanstack/react-virtual to render only visible rows.",
    regressionPrevention: "Performance budget test enforcing maximum DOM node count under 200.",
    snippetBuggy: `// ❌ Buggy: 10,000 DOM elements mounted at once
return <div>{items.map(item => <Row key={item.id} data={item} />)}</div>;`,
    snippetFixed: `// ✅ Fixed: Virtualized windowing renders ~25 visible rows only
const virtualizer = useVirtualizer({ count: items.length, getScrollElement: () => parentRef.current, estimateSize: () => 40 });
return (
  <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
    {virtualizer.getVirtualItems().map(virtualRow => (
      <Row key={virtualRow.index} data={items[virtualRow.index]} style={{ transform: \`translateY(\${virtualRow.start}px)\` }} />
    ))}
  </div>
);`,
  },
  {
    id: "INC-005",
    title: "Modal Focus Trap Escape & Screen Reader Isolation",
    severity: "SEV-2",
    symptoms: "Keyboard Tab navigation escapes open modal dialog into background page elements.",
    impact: "Severe accessibility barrier for blind and keyboard-only users (WCAG 2.1 Failure).",
    rootCause: "Missing Tab key trapping and missing aria-modal='true' attribute.",
    fix: "Trap Tab key cycle within modal bounds and restore focus to previous element upon close.",
    regressionPrevention: "Automated accessibility axe-core and keyboard tab loop assertions.",
    snippetBuggy: `// ❌ Buggy: Standard div modal without focus management
return <div className="modal">{children}</div>;`,
    snippetFixed: `// ✅ Fixed: Full focus trapping and ARIA dialog properties
<div role="dialog" aria-modal="true" onKeyDown={handleFocusTrap}>
  {children}
</div>`,
  },
  {
    id: "INC-006",
    title: "Stale Cache Overwriting Optimistic Update",
    severity: "SEV-2",
    symptoms: "User clicks 'Like', counter jumps to 11 (optimistic), then flashes back to 10 due to background revalidation.",
    impact: "Flickering UI, perceived bug where user action appears lost.",
    rootCause: "Background query resolved with pre-mutation snapshot without cache invalidation sync.",
    fix: "Cancel ongoing refetches before setting optimistic state, rollback on failure, and refetch on settle.",
    regressionPrevention: "Mutation rollback and snapshot synchronization test.",
    snippetBuggy: `// ❌ Buggy: Optimistic update without cancelling background refetches
setCount(c => c + 1);
api.likePost();`,
    snippetFixed: `// ✅ Fixed: TanStack Query onMutate snapshot & rollback
onMutate: async () => {
  await queryClient.cancelQueries({ queryKey: ['post'] });
  const prev = queryClient.getQueryData(['post']);
  queryClient.setQueryData(['post'], old => ({ ...old, likes: old.likes + 1 }));
  return { prev };
},
onError: (err, newTodo, context) => { queryClient.setQueryData(['post'], context.prev); }`,
  },
  {
    id: "INC-007",
    title: "Layout Shift (CLS Spike) from Late-Loading Media",
    severity: "SEV-3",
    symptoms: "Content jumps down 300px when dynamic project hero images load, causing misclicks.",
    impact: "High Cumulative Layout Shift (CLS > 0.4), poor Core Web Vitals rating.",
    rootCause: "Images rendered without explicit width/height or CSS aspect-ratio placeholders.",
    fix: "Reserve layout geometry with CSS aspect-ratio or Next.js Image with explicit dimensions.",
    regressionPrevention: "CLS metric threshold test in CI (CLS < 0.1).",
    snippetBuggy: `// ❌ Buggy: No dimensions reserved; causes severe layout jump
<img src="/hero.png" alt="Preview" />`,
    snippetFixed: `// ✅ Fixed: Aspect-ratio wrapper reserves space before image arrives
<div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden">
  <img src="/hero.png" alt="Preview" className="w-full h-full object-cover" />
</div>`,
  },
  {
    id: "INC-008",
    title: "Unhandled Async Throw Crashing Entire React Fiber Tree",
    severity: "SEV-1",
    symptoms: "Clicking a broken action button crashes the entire page into a blank white screen.",
    impact: "Total application unavailability requiring hard page refresh.",
    rootCause: "Missing Feature-level Error Boundary to catch render/lifecycle exceptions in child widgets.",
    fix: "Wrap isolated widgets with FeatureErrorBoundary with contextual retry actions.",
    regressionPrevention: "Error boundary test asserting child failure displays isolated fallback UI.",
    snippetBuggy: `// ❌ Buggy: No error boundary wrapping dynamic experimental widget
<ExperimentalWidget data={untrustedData} />`,
    snippetFixed: `// ✅ Fixed: FeatureErrorBoundary isolates failure and provides retry
<FeatureErrorBoundary fallbackTitle="Widget Unavailable">
  <ExperimentalWidget data={untrustedData} />
</FeatureErrorBoundary>`,
  },
];

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(INCIDENTS[0]);
  const [viewMode, setViewMode] = useState<"fixed" | "buggy">("fixed");

  return (
    <div className="w-[92%] lg:w-[80%] mx-auto py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="amber" icon={<AlertOctagon className="w-3.5 h-3.5" />}>
              Engineering Postmortems
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Phase 6 Deliverable</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Production Incident Simulator & Postmortems
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-world frontend production failures: symptoms, root cause analysis, code diffs, and regression prevention strategies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incident List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Incident Log ({INCIDENTS.length} Postmortems)
          </h3>
          <div className="space-y-2">
            {INCIDENTS.map((inc) => {
              const isSelected = inc.id === selectedIncident.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? "bg-[#0f1422] border-amber-500/50 shadow-md"
                      : "bg-[#090d15] border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-amber-400">{inc.id}</span>
                    <Badge
                      variant={inc.severity === "SEV-1" ? "error" : "warning"}
                      size="sm"
                    >
                      {inc.severity}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">
                    {inc.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident Detail & Code Comparison */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-amber-400">{selectedIncident.id}</span>
                  <Badge variant={selectedIncident.severity === "SEV-1" ? "error" : "warning"}>
                    {selectedIncident.severity} Incident
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-100">{selectedIncident.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "fixed" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setViewMode("fixed")}
                >
                  Fixed Implementation
                </Button>
                <Button
                  variant={viewMode === "buggy" ? "danger" : "secondary"}
                  size="sm"
                  onClick={() => setViewMode("buggy")}
                >
                  Buggy Scenario
                </Button>
              </div>
            </div>

            {/* Postmortem Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800/80 space-y-1">
                <span className="font-semibold text-red-400 uppercase tracking-wider text-[10px]">
                  Symptoms & Impact
                </span>
                <p className="text-slate-300">{selectedIncident.symptoms}</p>
                <p className="text-slate-400 pt-1">{selectedIncident.impact}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800/80 space-y-1">
                <span className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">
                  Root Cause Analysis
                </span>
                <p className="text-slate-300">{selectedIncident.rootCause}</p>
              </div>
            </div>

            {/* Code Diff Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono px-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  {viewMode === "fixed" ? "Production Hardened Code" : "Original Root Cause Code"}
                </span>
                <span className={viewMode === "fixed" ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                  {viewMode === "fixed" ? "✅ Resolution Applied" : "❌ Vulnerable State"}
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-[#07090e] border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{viewMode === "fixed" ? selectedIncident.snippetFixed : selectedIncident.snippetBuggy}</code>
              </pre>
            </div>

            {/* Regression Prevention */}
            <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold text-emerald-300">Regression Prevention Strategy</h5>
                <p className="text-xs text-slate-400 mt-0.5">{selectedIncident.regressionPrevention}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
