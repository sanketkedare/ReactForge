// Telemetry and Profiler Types

export interface ComponentMetric {
  id: string;
  renderCount: number;
  lastDuration: number;
  avgDuration: number;
  totalDuration: number;
  lastPhase: "mount" | "update" | "nested-update";
  lastCommitTime: number;
}

export interface ProfilerState {
  metrics: Record<string, ComponentMetric>;
  fps: number;
  memoryMB: number;
  isOptimized: boolean;
  totalRenders: number;
  recordRender: (
    id: string,
    phase: "mount" | "update" | "nested-update",
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => void;
  toggleOptimization: () => void;
  setOptimization: (val: boolean) => void;
  resetMetrics: () => void;
}

// Event Pipeline Types
export interface EventStreamPulse {
  id: string;
  timestamp: number;
  value: number;
  source: string;
}

export interface LaneExecutionLog {
  laneId: string;
  laneName: string;
  pulseCount: number;
  executedCount: number;
  droppedCount: number;
  lastExecutionTime: number;
  latencyMs: number;
}

// Virtual Kanban Types
export type KanbanStatus = "backlog" | "in_progress" | "in_review" | "completed";
export type KanbanPriority = "critical" | "high" | "medium" | "low";

export interface KanbanTask {
  id: string;
  title: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  assignee: string;
  storyPoints: number;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface ChaosConfig {
  latencyMs: number;
  failureRate: number; // 0 to 1
  isChaosEnabled: boolean;
}

// Threaded Comments Types
export interface ThreadedComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: number;
  upvotes: number;
  userVoted?: "up" | "down";
  parentId: string | null;
  children: ThreadedComment[];
  isCollapsed?: boolean;
}

export interface BroadcastPayload {
  type: "NEW_COMMENT" | "UPVOTE" | "DELETE_COMMENT" | "TYPING";
  senderId: string;
  data: any;
  timestamp: number;
}

// State Battleground Types
export type StateEngineType = "context" | "redux" | "zustand" | "signals";

export interface NodeItem {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  value: number;
  active: boolean;
  renderCount?: number;
}

export interface EngineScoreboard {
  engine: StateEngineType;
  totalRenders: number;
  lastFrameDurationMs: number;
  scriptTimeMs: number;
}

// Query Inspector Types
export interface MockPost {
  id: number;
  title: string;
  body: string;
  category: string;
  views: number;
  likes: number;
  author: string;
  updatedAt: number;
}
