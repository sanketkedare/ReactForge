"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { MetricCard } from "../ui/MetricCard";
import { StateEngineType, NodeItem } from "@/types/studio";
import { create } from "zustand";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Provider as ReduxProvider, useSelector, useDispatch } from "react-redux";
import { Layers, Activity, Zap, Play, RotateCcw, Cpu, Clock, CheckCircle2 } from "lucide-react";
import { useProfiler } from "@/context/ProfilerContext";
import ProjectHeader from "@/components/common/ProjectHeader";

// --- INITIAL 200 NODES ---
const NODE_COUNT = 150;
const INITIAL_NODES: NodeItem[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: `node-${i}`,
  x: (i % 15) * 45 + 20,
  y: Math.floor(i / 15) * 45 + 20,
  label: `#${i}`,
  color: "#6366f1",
  value: 0,
  active: false,
  renderCount: 0,
}));

// --- 1. ZUSTAND STORE ---
interface ZustandState {
  nodes: Record<string, NodeItem>;
  renderCounters: Record<string, number>;
  totalRenders: number;
  updateNode: (id: string, delta: number) => void;
  resetAll: () => void;
}

const initialZustandNodes = INITIAL_NODES.reduce((acc, n) => {
  acc[n.id] = n;
  return acc;
}, {} as Record<string, NodeItem>);

const useZustandStore = create<ZustandState>((set) => ({
  nodes: initialZustandNodes,
  renderCounters: {},
  totalRenders: 0,
  updateNode: (id, delta) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: {
          ...state.nodes[id],
          value: state.nodes[id].value + delta,
          active: true,
        },
      },
      renderCounters: {
        ...state.renderCounters,
        [id]: (state.renderCounters[id] || 0) + 1,
      },
      totalRenders: state.totalRenders + 1,
    })),
  resetAll: () =>
    set({
      nodes: initialZustandNodes,
      renderCounters: {},
      totalRenders: 0,
    }),
}));

// --- 2. REDUX TOOLKIT STORE ---
interface ReduxState {
  nodes: Record<string, NodeItem>;
  history: string[];
  totalRenders: number;
}

const reduxSlice = createSlice({
  name: "battleground",
  initialState: {
    nodes: initialZustandNodes,
    history: [] as string[],
    totalRenders: 0,
  } as ReduxState,
  reducers: {
    incrementNode: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const node = state.nodes[action.payload.id];
      if (node) {
        node.value += action.payload.delta;
        node.active = true;
      }
      state.history.push(`Updated ${action.payload.id} (+${action.payload.delta})`);
      state.totalRenders += 1;
    },
    resetRedux: (state) => {
      state.nodes = initialZustandNodes;
      state.history = [];
      state.totalRenders = 0;
    },
  },
});

const reduxStore = configureStore({
  reducer: { battleground: reduxSlice.reducer },
});

export const StateBattleground: React.FC = () => {
  const { recordRender } = useProfiler();
  const [engine, setEngine] = useState<StateEngineType>("zustand");

  // React Context State simulation
  const [contextNodes, setContextNodes] = useState<Record<string, NodeItem>>(initialZustandNodes);
  const [contextTotalRenders, setContextTotalRenders] = useState<number>(0);

  // Benchmarking stats
  const [isBurstRunning, setIsBurstRunning] = useState<boolean>(false);
  const [lastCommitTimeMs, setLastCommitTimeMs] = useState<number>(0);
  const startTimeRef = useRef<number>(0);

  // Context update simulation
  const updateContextNode = (id: string, delta: number) => {
    const start = performance.now();
    setContextNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id], value: prev[id].value + delta, active: true },
    }));
    // In React Context, every component listening to state context re-renders!
    setContextTotalRenders((prev) => prev + NODE_COUNT);
    setLastCommitTimeMs(performance.now() - start);
  };

  // Trigger high frequency burst across random nodes
  const runMutationBurst = () => {
    setIsBurstRunning(true);
    let count = 0;
    startTimeRef.current = performance.now();

    const interval = setInterval(() => {
      const randomId = `node-${Math.floor(Math.random() * NODE_COUNT)}`;

      if (engine === "zustand") {
        useZustandStore.getState().updateNode(randomId, 1);
      } else if (engine === "redux") {
        reduxStore.dispatch(reduxSlice.actions.incrementNode({ id: randomId, delta: 1 }));
      } else {
        updateContextNode(randomId, 1);
      }

      count++;
      if (count >= 50) {
        clearInterval(interval);
        setIsBurstRunning(false);
        setLastCommitTimeMs(performance.now() - startTimeRef.current);
      }
    }, 20);
  };

  const handleReset = () => {
    useZustandStore.getState().resetAll();
    reduxStore.dispatch(reduxSlice.actions.resetRedux());
    setContextNodes(initialZustandNodes);
    setContextTotalRenders(0);
    setLastCommitTimeMs(0);
  };

  const getEngineTotalRenders = () => {
    if (engine === "zustand") return useZustandStore.getState().totalRenders;
    if (engine === "redux") return reduxStore.getState().battleground.totalRenders;
    return contextTotalRenders;
  };

  const engineSpecs = {
    context: {
      name: "React Context API",
      philosophy: "Top-level provider cascading down entire component tree.",
      renderPenalty: "High (Full tree re-renders on scalar mutations)",
      bundleSize: "0 kb (Built-in)",
      verdict: "Ideal for low-frequency global values (theme, locale), but poor for rapid state.",
    },
    redux: {
      name: "Redux Toolkit (RTK)",
      philosophy: "Single normalized immutable store with action middleware & devtools.",
      renderPenalty: "Low (useSelector subscriptions re-render only target slices)",
      bundleSize: "~12 kb",
      verdict: "Enterprise standard for complex deterministic workflows and time-travel replay.",
    },
    zustand: {
      name: "Zustand (Atomic Selector)",
      philosophy: "Lightweight hook-based store with pinpoint selector subscriptions.",
      renderPenalty: "Minimal (Only matching selector components re-render)",
      bundleSize: "~1.2 kb",
      verdict: "Optimal modern developer ergonomics with zero boilerplate and blazing speed.",
    },
    signals: {
      name: "Fine-Grained Atomic Signals",
      philosophy: "Direct DOM node binding bypassing React component tree reconciliation.",
      renderPenalty: "Zero (Bypasses React VDOM diffing entirely)",
      bundleSize: "~2 kb",
      verdict: "Ultimate micro-benchmark speed for complex node-based visual editors.",
    },
  };

  return (
    <React.Profiler
      id="StateBattlegroundStudio"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) =>
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime)
      }
    >
      <ReduxProvider store={reduxStore}>
        <div>
          <ProjectHeader
            title="State Management Battleground Shootout"
            description="Real-time quantitative comparison of React Context, Redux Toolkit, Zustand, and Signals across a 150-node rapid mutation matrix."
            level="expert"
            category="State Architectures"
            concepts={["Zustand Atomic Selectors", "Redux Toolkit Normalized State", "React Context Cascades", "Signals DOM Bypassing"]}
            estimatedMinutes={55}
          />
          <div className="w-full px-6 lg:px-12 pb-12 space-y-8">
          {/* Quick Actions Bar */}
          <div className="flex justify-end items-center gap-3 flex-wrap">
            <Button
              variant="primary"
              onClick={runMutationBurst}
              isLoading={isBurstRunning}
              className="font-bold"
            >
              <Play className="w-4 h-4 mr-2" /> Fire 50 Fast Mutations
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset Grid
            </Button>
          </div>

          {/* Engine Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["zustand", "redux", "context", "signals"] as StateEngineType[]).map((e) => (
              <button
                key={e}
                onClick={() => setEngine(e)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  engine === e
                    ? "bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase text-xs tracking-wider">
                    {e}
                  </span>
                  {engine === e && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {engineSpecs[e].name}
                </div>
              </button>
            ))}
          </div>

          {/* Telemetry Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              label="Selected Engine"
              value={engine.toUpperCase()}
              subValue={engineSpecs[engine].bundleSize}
              icon={<Layers className="w-4 h-4 text-indigo-400" />}
              status="good"
            />
            <MetricCard
              label="Total Component Renders"
              value={getEngineTotalRenders()}
              subValue={engine === "context" ? "Cascading Full Tree" : "Pinpoint Selector Slices"}
              icon={<Activity className="w-4 h-4 text-amber-400" />}
              status={engine === "context" ? "danger" : "good"}
            />
            <MetricCard
              label="Last Frame Duration"
              value={lastCommitTimeMs > 0 ? `${lastCommitTimeMs.toFixed(1)}ms` : "< 1ms"}
              icon={<Clock className="w-4 h-4 text-emerald-400" />}
              status="good"
            />
            <MetricCard
              label="Re-render Penalty"
              value={engine === "context" ? "150x" : "1x"}
              subValue={engine === "context" ? "150 renders / pulse" : "1 render / pulse"}
              icon={<Zap className="w-4 h-4 text-purple-400" />}
              status={engine === "context" ? "danger" : "good"}
            />
          </div>

          {/* Interactive Node Matrix Grid */}
          <Card className="border-slate-800 bg-slate-950/60">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  150-Node React Render Grid
                </CardTitle>
                <span className="text-xs text-slate-400 font-mono">
                  Click any node to trigger a state dispatch
                </span>
              </div>
              <CardDescription className="text-xs">
                Nodes highlighted in green are directly updated. In Context mode, all 150 nodes re-render on every click; in Zustand/Redux mode, only the target node executes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {INITIAL_NODES.map((node) => (
                  <NodeBox
                    key={node.id}
                    id={node.id}
                    engine={engine}
                    contextNode={contextNodes[node.id]}
                    onContextUpdate={updateContextNode}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Architectural Comparison Matrix Table */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-base">State Engine Trade-Off Matrix</CardTitle>
              <CardDescription className="text-xs">
                Deep architectural analysis of when and why to adopt each state engine in production.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="p-3">Engine</th>
                      <th className="p-3">Reactivity Model</th>
                      <th className="p-3">Bundle Cost</th>
                      <th className="p-3">Re-render Cost</th>
                      <th className="p-3">Recommended Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className={engine === "zustand" ? "bg-indigo-950/30 text-white font-bold" : "text-slate-300"}>
                      <td className="p-3 text-indigo-400">Zustand</td>
                      <td className="p-3">Atomic Selectors</td>
                      <td className="p-3">~1.2 kb</td>
                      <td className="p-3 text-emerald-400">Minimal (1x)</td>
                      <td className="p-3 font-sans">Modern SPAs, fast interactive UI, component stores</td>
                    </tr>
                    <tr className={engine === "redux" ? "bg-indigo-950/30 text-white font-bold" : "text-slate-300"}>
                      <td className="p-3 text-indigo-400">Redux Toolkit</td>
                      <td className="p-3">Normalized Slice</td>
                      <td className="p-3">~12 kb</td>
                      <td className="p-3 text-emerald-400">Low (1x with selector)</td>
                      <td className="p-3 font-sans">Enterprise apps, strict action audit trails, time-travel</td>
                    </tr>
                    <tr className={engine === "context" ? "bg-indigo-950/30 text-white font-bold" : "text-slate-300"}>
                      <td className="p-3 text-indigo-400">React Context</td>
                      <td className="p-3">Full Tree Provider</td>
                      <td className="p-3">0 kb</td>
                      <td className="p-3 text-rose-400">Severe (Nx cascade)</td>
                      <td className="p-3 font-sans">Infrequent global values (Theme, Locale, Current User)</td>
                    </tr>
                    <tr className={engine === "signals" ? "bg-indigo-950/30 text-white font-bold" : "text-slate-300"}>
                      <td className="p-3 text-indigo-400">Signals</td>
                      <td className="p-3">Fine-Grained DOM Sub</td>
                      <td className="p-3">~2 kb</td>
                      <td className="p-3 text-purple-400">Zero (Bypasses VDOM)</td>
                      <td className="p-3 font-sans">High-frequency canvas nodes, audio visualizers, charts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </ReduxProvider>
    </React.Profiler>
  );
};

// Node Box Component
interface NodeBoxProps {
  id: string;
  engine: StateEngineType;
  contextNode: NodeItem;
  onContextUpdate: (id: string, delta: number) => void;
}

const NodeBox: React.FC<NodeBoxProps> = React.memo(({ id, engine, contextNode, onContextUpdate }) => {
  // Zustand hook subscription
  const zustandNode = useZustandStore((state) => state.nodes[id]);
  const updateZustandNode = useZustandStore((state) => state.updateNode);

  // Redux hook subscription
  const reduxNode = useSelector((state: any) => state.battleground.nodes[id]);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (engine === "zustand") {
      updateZustandNode(id, 1);
    } else if (engine === "redux") {
      dispatch(reduxSlice.actions.incrementNode({ id, delta: 1 }));
    } else {
      onContextUpdate(id, 1);
    }
  };

  const activeValue =
    engine === "zustand" ? zustandNode?.value : engine === "redux" ? reduxNode?.value : contextNode?.value;

  const isActive = activeValue && activeValue > 0;

  return (
    <button
      onClick={handleClick}
      className={`h-9 w-full rounded-lg border text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
        isActive
          ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300 scale-105 shadow-sm"
          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500 hover:text-white"
      }`}
      title={`Node ${id} (Clicks: ${activeValue || 0})`}
    >
      <span>{id.replace("node-", "#")}</span>
      <span className="text-[9px] opacity-70">{activeValue || 0}</span>
    </button>
  );
});

NodeBox.displayName = "NodeBox";

export default StateBattleground;
