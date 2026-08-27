"use client";

export const GUEST_AI_STORAGE_KEY = "reactforge_guest_ai_usage_count";
export const GUEST_AI_MAX_LIMIT = 3;

/**
 * Get current device AI usage count for unauthenticated guests
 */
export function getGuestAiUsageCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(GUEST_AI_STORAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * Increment device AI usage count by 1 and dispatch custom event
 */
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

/**
 * Check if the unauthenticated device has reached the 3-chat limit
 */
export function isGuestAiLimitReached(): boolean {
  return getGuestAiUsageCount() >= GUEST_AI_MAX_LIMIT;
}

/**
 * Get remaining free AI chats for guest device
 */
export function getGuestAiRemaining(): number {
  return Math.max(0, GUEST_AI_MAX_LIMIT - getGuestAiUsageCount());
}
