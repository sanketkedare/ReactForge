"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {
  auth,
  signInWithGooglePopup,
  signInWithGithubPopup,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  sendPasswordReset,
} from "@/lib/firebase";

export interface MongoUserData {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  photoURL?: string;
  role: "user" | "pro" | "admin";
  isRegistrationComplete: boolean;
  experienceLevel?: "fresher" | "junior" | "mid" | "senior" | "architect";
  primaryFocus?: string;
  targetRole?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  completedTasks: string[];
  bookmarkedTasks: string[];
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
  xp: number;
  createdAt?: string;
}

export interface CompleteRegistrationData {
  displayName: string;
  username: string;
  targetRole: string;
  experienceLevel: "fresher" | "junior" | "mid" | "senior" | "architect";
  primaryFocus: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  mongoUser: MongoUserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  isAdmin: boolean;
  isPro: boolean;
  // Modal state
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register" | "forgot";
  openAuthModal: (mode?: "login" | "register" | "forgot") => void;
  closeAuthModal: () => void;
  // Auth methods
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithGithub: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmailPassword: (
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
  registerWithEmailPassword: (
    email: string,
    pass: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  completeRegistration: (
    data: CompleteRegistrationData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  // Progress & Bookmarks
  toggleTaskComplete: (slug: string, xpValue?: number) => Promise<boolean>;
  toggleTaskBookmark: (slug: string) => Promise<boolean>;
  isTaskCompleted: (slug: string) => boolean;
  isTaskBookmarked: (slug: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "forgot">("login");

  const openAuthModal = (mode: "login" | "register" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Sync Firebase user to MongoDB
  const syncWithMongo = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || "Frontend Engineer",
          photoURL: fbUser.photoURL || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setMongoUser(data.user);
        }
      }
    } catch (e) {
      console.error("Failed to sync with backend DB:", e);
      // Fallback local memory user
      setMongoUser({
        uid: fbUser.uid,
        email: fbUser.email || "",
        displayName: fbUser.displayName || "Frontend Engineer",
        photoURL: fbUser.photoURL || "",
        role: "user",
        isRegistrationComplete: false,
        completedTasks: [],
        bookmarkedTasks: [],
        streak: { current: 1, longest: 1, lastActiveDate: new Date().toISOString() },
        xp: 0,
      });
    }
  }, []);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        await syncWithMongo(fbUser);
      } else {
        setMongoUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncWithMongo]);

  // Google Login
  const loginWithGoogle = async () => {
    const res = await signInWithGooglePopup();
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || "Google login failed" };
  };

  // GitHub Login
  const loginWithGithub = async () => {
    const res = await signInWithGithubPopup();
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || "GitHub login failed" };
  };

  // Email Login
  const loginWithEmailPassword = async (email: string, pass: string) => {
    const res = await loginWithEmail(email, pass);
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || "Invalid credentials" };
  };

  // Email Register
  const registerWithEmailPassword = async (
    email: string,
    pass: string,
    name: string
  ) => {
    const res = await registerWithEmail(email, pass, name);
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || "Registration failed" };
  };

  // Complete Registration / Onboarding
  const completeRegistration = async (data: CompleteRegistrationData) => {
    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    try {
      const res = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...data,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return { success: false, error: json.error || "Failed to complete registration" };
      }

      if (json.user) {
        setMongoUser(json.user);
      }

      return { success: true };
    } catch (e: any) {
      console.error("Complete registration network error:", e);
      return { success: false, error: e.message || "Network error occurred" };
    }
  };

  // Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
    setMongoUser(null);
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    const res = await sendPasswordReset(email);
    return res;
  };

  // Toggle Task Completion
  const toggleTaskComplete = async (slug: string, xpValue: number = 15): Promise<boolean> => {
    if (!user) {
      openAuthModal("login");
      return false;
    }

    const currentCompleted = mongoUser?.completedTasks || [];
    const isCompleted = currentCompleted.includes(slug);
    const nextCompleted = !isCompleted;

    // Optimistic UI update
    setMongoUser((prev) => {
      if (!prev) return prev;
      const updatedTasks = nextCompleted
        ? [...prev.completedTasks, slug]
        : prev.completedTasks.filter((s) => s !== slug);
      const updatedXP = nextCompleted
        ? prev.xp + xpValue
        : Math.max(0, prev.xp - xpValue);

      return {
        ...prev,
        completedTasks: updatedTasks,
        xp: updatedXP,
      };
    });

    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          taskSlug: slug,
          completed: nextCompleted,
          xpValue,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.completedTasks) {
          setMongoUser((prev) =>
            prev ? { ...prev, completedTasks: data.completedTasks, xp: data.xp, streak: data.streak } : prev
          );
        }
      }
      return nextCompleted;
    } catch (e) {
      console.error("Progress save failed:", e);
      return nextCompleted;
    }
  };

  // Toggle Task Bookmark
  const toggleTaskBookmark = async (slug: string): Promise<boolean> => {
    if (!user) {
      openAuthModal("login");
      return false;
    }

    const currentBookmarks = mongoUser?.bookmarkedTasks || [];
    const isBookmarked = currentBookmarks.includes(slug);
    const nextBookmarked = !isBookmarked;

    // Optimistic update
    setMongoUser((prev) => {
      if (!prev) return prev;
      const updated = nextBookmarked
        ? [...prev.bookmarkedTasks, slug]
        : prev.bookmarkedTasks.filter((s) => s !== slug);
      return { ...prev, bookmarkedTasks: updated };
    });

    try {
      const res = await fetch("/api/user/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          taskSlug: slug,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.bookmarkedTasks) {
          setMongoUser((prev) =>
            prev ? { ...prev, bookmarkedTasks: data.bookmarkedTasks } : prev
          );
        }
      }
      return nextBookmarked;
    } catch (e) {
      console.error("Bookmark save failed:", e);
      return nextBookmarked;
    }
  };

  const isTaskCompleted = (slug: string) => {
    return Boolean(mongoUser?.completedTasks?.includes(slug));
  };

  const isTaskBookmarked = (slug: string) => {
    return Boolean(mongoUser?.bookmarkedTasks?.includes(slug));
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/profile?uid=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) setMongoUser(data.user);
      }
    } catch (e) {
      console.error("Failed to refresh profile:", e);
    }
  };

  const requiresOnboarding = Boolean(
    user && (!mongoUser || mongoUser.isRegistrationComplete === false)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        mongoUser,
        loading,
        isAuthenticated: !!user,
        requiresOnboarding,
        isAdmin: mongoUser?.role === "admin",
        isPro: mongoUser?.role === "pro" || mongoUser?.role === "admin",
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithGithub,
        loginWithEmailPassword,
        registerWithEmailPassword,
        completeRegistration,
        logout,
        resetPassword,
        toggleTaskComplete,
        toggleTaskBookmark,
        isTaskCompleted,
        isTaskBookmarked,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
