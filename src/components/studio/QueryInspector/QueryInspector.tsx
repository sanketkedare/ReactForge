"use client";

import React, { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { MetricCard } from "../ui/MetricCard";
import { MockPost } from "@/types/studio";
import {
  Server,
  RefreshCw,
  AlertTriangle,
  Zap,
  Clock,
  Database,
  Trash2,
  ThumbsUp,
  RotateCcw,
  CheckCircle2,
  WifiOff,
} from "lucide-react";
import { useProfiler } from "@/context/ProfilerContext";
import ProjectHeader from "@/components/common/ProjectHeader";

// Initial mock database
const INITIAL_POSTS: MockPost[] = [
  {
    id: 1,
    title: "Zero-Latency Client State with TanStack Query v5",
    body: "By keeping server cache keys separated from UI state, frontend applications eliminate redundant roundtrips and stale data bugs.",
    category: "Architecture",
    views: 1420,
    likes: 89,
    author: "Elena Rostova",
    updatedAt: Date.now() - 120000,
  },
  {
    id: 2,
    title: "Optimistic UI Mutations and Automated Cache Invalidation",
    body: "Mutate local query cache instantly and perform silent background sync. Rollback automatically if the server responds with 5xx status codes.",
    category: "Performance",
    views: 980,
    likes: 64,
    author: "Marcus Chen",
    updatedAt: Date.now() - 60000,
  },
  {
    id: 3,
    title: "Handling Network Chaos: Exponential Backoff & Retry Policies",
    body: "Configure resilient retry heuristics (1s, 2s, 4s, 8s) with circuit breakers to safeguard client experience during API outages.",
    category: "Reliability",
    views: 2100,
    likes: 120,
    author: "Alex Rivera",
    updatedAt: Date.now() - 30000,
  },
];

// Chaos configuration
let simulatedChaos = {
  shouldFail500: false,
  shouldFail401: false,
  isOffline: false,
  networkDelayMs: 600,
};

// Mock API functions
const fetchMockPosts = async (): Promise<MockPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, simulatedChaos.networkDelayMs));

  if (simulatedChaos.isOffline) {
    throw new Error("NetworkError: Failed to fetch (Offline Mode)");
  }
  if (simulatedChaos.shouldFail401) {
    throw new Error("HTTP 401 Unauthorized: Session Token Expired");
  }
  if (simulatedChaos.shouldFail500) {
    throw new Error("HTTP 500 Internal Server Error: Simulated API Crash");
  }

  return JSON.parse(localStorage.getItem("mock_posts") || JSON.stringify(INITIAL_POSTS));
};

const mutateLikePost = async (id: number): Promise<MockPost> => {
  await new Promise((resolve) => setTimeout(resolve, simulatedChaos.networkDelayMs));

  if (simulatedChaos.isOffline) {
    throw new Error("NetworkError: Offline mutation failed");
  }
  if (simulatedChaos.shouldFail500) {
    throw new Error("HTTP 500: Mutation rejected by server");
  }

  const current: MockPost[] = JSON.parse(
    localStorage.getItem("mock_posts") || JSON.stringify(INITIAL_POSTS)
  );
  const updated = current.map((p) => (p.id === id ? { ...p, likes: p.likes + 1, updatedAt: Date.now() } : p));
  localStorage.setItem("mock_posts", JSON.stringify(updated));

  return updated.find((p) => p.id === id)!;
};

// Root Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000, // 15 seconds fresh
      gcTime: 60000, // 1 minute before GC
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
  },
});

export const QueryInspectorWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryInspector />
    </QueryClientProvider>
  );
};

const QueryInspector: React.FC = () => {
  const { recordRender } = useProfiler();
  const client = useQueryClient();

  // Chaos controls
  const [inject500, setInject500] = useState<boolean>(false);
  const [inject401, setInject401] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [networkDelay, setNetworkDelay] = useState<number>(600);

  // Sync state to global chaos object
  useEffect(() => {
    simulatedChaos = {
      shouldFail500: inject500,
      shouldFail401: inject401,
      isOffline: isOffline,
      networkDelayMs: networkDelay,
    };
  }, [inject500, inject401, isOffline, networkDelay]);

  // Main Posts Query
  const {
    data: posts,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    dataUpdatedAt,
    failureCount,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchMockPosts,
  });

  // Like Mutation with Optimistic Updates
  const likeMutation = useMutation({
    mutationFn: mutateLikePost,
    onMutate: async (postId: number) => {
      await client.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = client.getQueryData<MockPost[]>(["posts"]);

      if (previousPosts) {
        client.setQueryData<MockPost[]>(
          ["posts"],
          previousPosts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
      }
      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        client.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Query Cache Subscriptions
  const cache = client.getQueryCache();
  const allQueries = cache.getAll();

  const resetAllData = () => {
    localStorage.removeItem("mock_posts");
    client.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <React.Profiler
      id="QueryInspectorStudio"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) =>
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime)
      }
    >
      <div>
        <ProjectHeader
          title="TanStack Query v5 Cache & Chaos Inspector"
          description="Server-state management with live query cache inspection, staleTime/gcTime countdown timers, optimistic mutations, and simulated backend chaos injection."
          level="expert"
          category="Server State & Caching"
          concepts={["TanStack Query v5", "staleTime vs gcTime", "Exponential Backoff Retries", "Optimistic Mutations", "Cache Invalidation"]}
          estimatedMinutes={50}
        />
        <div className="w-full px-6 lg:px-12 pb-12 space-y-8">
        {/* Quick Actions Bar */}
        <div className="flex justify-end items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            onClick={() => refetch()}
            isLoading={isFetching}
            size="sm"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Invalidate & Refetch
          </Button>
          <Button variant="outline" onClick={resetAllData} size="sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset DB
          </Button>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Query Fetch Status"
            value={isFetching ? "Fetching..." : isLoading ? "Loading" : "Fresh"}
            subValue={isError ? `Error: (Retry #${failureCount})` : "Cached in Memory"}
            icon={<Server className="w-4 h-4 text-indigo-400" />}
            status={isError ? "danger" : isFetching ? "warning" : "good"}
          />
          <MetricCard
            label="Active Cached Queries"
            value={allQueries.length}
            icon={<Database className="w-4 h-4 text-sky-400" />}
            status="good"
          />
          <MetricCard
            label="Cache staleTime"
            value="15s Fresh"
            subValue="Zero network refetch"
            icon={<Clock className="w-4 h-4 text-emerald-400" />}
            status="good"
          />
          <MetricCard
            label="Garbage Collection"
            value="60s (gcTime)"
            subValue="Auto-evicts unused keys"
            icon={<Trash2 className="w-4 h-4 text-amber-400" />}
            status="neutral"
          />
        </div>

        {/* Chaos Injection Toolbar */}
        <Card className="border-rose-900/50 bg-rose-950/20">
          <CardHeader>
            <CardTitle className="text-base text-rose-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              API Chaos Simulator & Failure Injection
            </CardTitle>
            <CardDescription className="text-xs">
              Inject intentional HTTP failures to verify how TanStack Query automatically triggers exponential backoff retry algorithms and optimistic rollbacks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <Button
              variant={inject500 ? "danger" : "outline"}
              onClick={() => setInject500((p) => !p)}
              size="sm"
              className="font-mono text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              {inject500 ? "500 Crash: Active" : "Inject HTTP 500"}
            </Button>

            <Button
              variant={inject401 ? "danger" : "outline"}
              onClick={() => setInject401((p) => !p)}
              size="sm"
              className="font-mono text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              {inject401 ? "401 Expired: Active" : "Inject HTTP 401"}
            </Button>

            <Button
              variant={isOffline ? "danger" : "outline"}
              onClick={() => setIsOffline((p) => !p)}
              size="sm"
              className="font-mono text-xs"
            >
              <WifiOff className="w-3.5 h-3.5 mr-1" />
              {isOffline ? "Offline: Active" : "Simulate Offline"}
            </Button>

            <Button
              variant={networkDelay > 1000 ? "danger" : "secondary"}
              onClick={() => setNetworkDelay((p) => (p === 600 ? 2500 : 600))}
              size="sm"
              className="font-mono text-xs"
            >
              <Clock className="w-3.5 h-3.5 mr-1" />
              {networkDelay > 1000 ? "Slow 3G (2.5s)" : "Normal Latency"}
            </Button>
          </CardContent>
        </Card>

        {/* Error Alert Banner */}
        {isError && (
          <div className="p-4 rounded-xl border border-rose-800 bg-rose-950/80 text-rose-300 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Query Error:</strong> {(error as any)?.message} (Retry Attempt #{failureCount})
              </span>
            </div>
            <Button size="sm" variant="danger" onClick={() => refetch()}>
              Retry Query
            </Button>
          </div>
        )}

        {/* Main Content Split: Live Query Cache Explorer & Data Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Cache Tree Inspector */}
          <Card className="lg:col-span-1 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Query Cache Tree
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time inspection of active query keys, subscriber counts, and invalidation states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {allQueries.map((q) => {
                const queryState = q.state;
                const isStale = q.isStale();

                return (
                  <div
                    key={q.queryHash}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-400 truncate">
                        {JSON.stringify(q.queryKey)}
                      </span>
                      <Badge
                        variant={isStale ? "warning" : "success"}
                        className="text-[10px]"
                      >
                        {isStale ? "STALE" : "FRESH"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <div>
                        Status:{" "}
                        <span className="text-slate-200 uppercase font-bold">
                          {queryState.status}
                        </span>
                      </div>
                      <div>
                        Observers:{" "}
                        <span className="text-slate-200 font-bold">
                          {q.getObserversCount()}
                        </span>
                      </div>
                      <div>
                        Updated:{" "}
                        <span className="text-slate-200">
                          {new Date(queryState.dataUpdatedAt).toLocaleTimeString([], {
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                      <div>
                        Failures:{" "}
                        <span className="text-rose-400 font-bold">
                          {queryState.fetchFailureCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Posts List & Optimistic Mutation Demo */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" />
                Live Cached Server Data Stream
              </span>
              <span className="text-xs font-mono text-slate-400">
                Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </span>
            </h2>

            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400 font-mono">
                Fetching posts over simulated network ({networkDelay}ms)...
              </div>
            ) : (
              <div className="space-y-4">
                {(posts || []).map((post) => (
                  <Card key={post.id} className="border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {post.category}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-mono">
                            By {post.author}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-100">{post.title}</h3>
                      </div>
                      <span className="text-xs font-mono text-slate-500">#{post.id}</span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">{post.body}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
                      <span className="text-slate-400">👁 {post.views} views</span>

                      <button
                        onClick={() => likeMutation.mutate(post.id)}
                        disabled={likeMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all text-xs font-bold"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likes} Likes (Optimistic)</span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </React.Profiler>
  );
};

export default QueryInspectorWrapper;
