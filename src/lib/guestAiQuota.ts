"use client";

export const GUEST_AI_STORAGE_KEY = "reactforge_guest_ai_usage_count";
export const GUEST_AI_MAX_LIMIT = 3;

export const AUTH_USER_STORAGE_KEY = "reactforge_user_daily_ai_quota";
export const AUTH_USER_DAILY_LIMIT = 100;

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

interface DailyQuotaRecord {
  date: string;
  count: number;
  uid?: string;
}

// ==========================================
// 1. GUEST QUOTA (3 Free chats per device)
// ==========================================

export function getGuestAiUsageCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(GUEST_AI_STORAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementGuestAiUsage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const current = getGuestAiUsageCount();
    const next = current + 1;
    localStorage.setItem(GUEST_AI_STORAGE_KEY, next.toString());
    window.dispatchEvent(
      new CustomEvent("guest-ai-quota-change", { detail: { count: next } })
    );
    return next;
  } catch {
    return 0;
  }
}

export function isGuestAiLimitReached(): boolean {
  return getGuestAiUsageCount() >= GUEST_AI_MAX_LIMIT;
}

export function getGuestAiRemaining(): number {
  return Math.max(0, GUEST_AI_MAX_LIMIT - getGuestAiUsageCount());
}

// ==========================================
// 2. AUTHENTICATED USER QUOTA (100 chats / day)
// ==========================================

export function getUserDailyAiUsageCount(uid?: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return 0;
    const record: DailyQuotaRecord = JSON.parse(raw);
    const today = getTodayKey();

    // Reset if it's a new calendar day
    if (record.date !== today) {
      return 0;
    }

    // If uid matches or general authenticated device count
    return record.count || 0;
  } catch {
    return 0;
  }
}

export function incrementUserDailyAiUsage(uid?: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const today = getTodayKey();
    const current = getUserDailyAiUsageCount(uid);
    const next = current + 1;
    const record: DailyQuotaRecord = {
      date: today,
      count: next,
      uid: uid || "user",
    };
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(
      new CustomEvent("user-ai-quota-change", { detail: { count: next, date: today } })
    );
    return next;
  } catch {
    return 0;
  }
}

export function isUserDailyLimitReached(uid?: string): boolean {
  return getUserDailyAiUsageCount(uid) >= AUTH_USER_DAILY_LIMIT;
}

export function getUserDailyAiRemaining(uid?: string): number {
  return Math.max(0, AUTH_USER_DAILY_LIMIT - getUserDailyAiUsageCount(uid));
}
