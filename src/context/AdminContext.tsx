"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";

export interface StatsData {
  totalUsers: number;
  activeToday: number;
  totalTasksCompleted: number;
  totalXP: number;
  totalAiMessagesToday: number;
  totalGuests: number;
  guestAiMessages: number;
  failedEmailsCount: number;
  roles: {
    admin: number;
    pro: number;
    user: number;
  };
  trackBreakdown?: {
    beginner: { total: number; solved: number };
    intermediate: { total: number; solved: number };
    expert: { total: number; solved: number };
  };
}

export interface UserItem {
  _id: string;
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  role: "user" | "pro" | "admin";
  xp: number;
  completedTasks: string[];
  bookmarkedTasks: string[];
  streak?: { current: number; longest: number };
  aiUsage?: { date: string; count: number };
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  targetRole?: string;
  experienceLevel?: string;
  primaryFocus?: string;
  bio?: string;
}

export interface GuestItem {
  _id: string;
  ip: string;
  count: number;
  lastUsedAt: string;
  updatedAt: string;
}

export interface FailedEmailItem {
  _id: string;
  toEmail: string;
  displayName: string;
  template: string;
  errorMessage: string;
  errorStack?: string;
  payload: any;
  attempts: number;
  status: "failed" | "retrying" | "resolved";
  createdAt: string;
}

export interface CurriculumItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  level: "beginner" | "intermediate" | "expert";
  levelLabel: string;
  path: string;
  slug: string;
  solves: number;
  bookmarks: number;
  estimatedMinutes: number;
}

export interface ActivityEvent {
  id: string;
  type: "login" | "task" | "email" | "guest" | "signup";
  title: string;
  subtitle: string;
  timestamp: string;
  badge?: string;
}

export interface SystemInfo {
  nodeVersion: string;
  platform: string;
  uptimeSeconds: number;
  memoryRssMb: number;
  heapUsedMb: number;
  dbPingMs: number;
  serverTime: string;
}

interface AdminContextType {
  stats: StatsData | null;
  usersList: UserItem[];
  guestsList: GuestItem[];
  failedEmails: FailedEmailItem[];
  curriculumStats: CurriculumItem[];
  activityFeed: ActivityEvent[];
  topUsers: UserItem[];
  systemInfo: SystemInfo | null;
  loading: boolean;
  actionLoadingId: string | null;
  feedbackMsg: { text: string; type: "success" | "error" } | null;
  selectedUser: UserItem | null;
  setSelectedUser: (user: UserItem | null) => void;
  setFeedbackMsg: (msg: { text: string; type: "success" | "error" } | null) => void;
  fetchAdminData: () => Promise<void>;
  executeAdminAction: (action: string, payload: any) => Promise<void>;
  handleUpdateRole: (targetUid: string, newRole: "user" | "pro" | "admin") => Promise<void>;
  handleRetryEmail: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [guestsList, setGuestsList] = useState<GuestItem[]>([]);
  const [failedEmails, setFailedEmails] = useState<FailedEmailItem[]>([]);
  const [curriculumStats, setCurriculumStats] = useState<CurriculumItem[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [topUsers, setTopUsers] = useState<UserItem[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const fetchAdminData = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: {
          "x-user-uid": user.uid,
          "x-user-email": user.email || "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsersList(data.allUsers || []);
        setGuestsList(data.recentGuests || []);
        setFailedEmails(data.recentFailedEmails || []);
        setCurriculumStats(data.curriculumStats || []);
        setActivityFeed(data.activityFeed || []);
        setTopUsers(data.topUsers || []);
        setSystemInfo(data.systemInfo || null);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.email]);

  useEffect(() => {
    if (isAdmin && user?.uid) {
      fetchAdminData();
    }
  }, [isAdmin, user?.uid, fetchAdminData]);

  const executeAdminAction = async (action: string, payload: any) => {
    if (!user?.uid) return;
    setActionLoadingId(action);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": user.uid,
          "x-user-email": user.email || "",
        },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg({ text: data.message || "Action executed successfully!", type: "success" });
        fetchAdminData();
      } else {
        setFeedbackMsg({ text: data.error || "Action failed", type: "error" });
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || "Execution error", type: "error" });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  const handleUpdateRole = async (targetUid: string, newRole: "user" | "pro" | "admin") => {
    if (!user?.uid) return;
    setActionLoadingId(targetUid);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": user.uid,
          "x-user-email": user.email || "",
        },
        body: JSON.stringify({ uid: targetUid, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
        );
        if (selectedUser?.uid === targetUid) {
          setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
        }
        setFeedbackMsg({ text: `Updated user role to ${newRole.toUpperCase()}`, type: "success" });
      } else {
        setFeedbackMsg({ text: data.error || "Role update failed", type: "error" });
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || "Failed to update role", type: "error" });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleRetryEmail = async (id: string) => {
    if (!user?.uid) return;
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": user.uid,
          "x-user-email": user.email || "",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setFailedEmails((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "resolved", errorMessage: "Resolved via retry" } : item
          )
        );
        setFeedbackMsg({ text: data.message || "Email re-sent successfully!", type: "success" });
      } else {
        setFeedbackMsg({ text: data.error || "Retry failed", type: "error" });
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || "Network error", type: "error" });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        usersList,
        guestsList,
        failedEmails,
        curriculumStats,
        activityFeed,
        topUsers,
        systemInfo,
        loading,
        actionLoadingId,
        feedbackMsg,
        selectedUser,
        setSelectedUser,
        setFeedbackMsg,
        fetchAdminData,
        executeAdminAction,
        handleUpdateRole,
        handleRetryEmail,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
