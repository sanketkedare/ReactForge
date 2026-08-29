import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export interface AdminVerificationResult {
  authorized: boolean;
  user?: any;
  error?: string;
  status?: number;
}

/**
 * Server-side Admin Authorization Guard
 * Validates that the incoming request is issued by a verified 'admin' user in MongoDB.
 */
export async function verifyAdminRequest(
  req: NextRequest
): Promise<AdminVerificationResult> {
  try {
    const uid =
      req.headers.get("x-user-uid") ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const emailHeader = req.headers.get("x-user-email")?.toLowerCase().trim();

    if (!uid && !emailHeader) {
      console.warn(`🔒 [Security Guard] Blocked unauthenticated admin request from IP: ${req.headers.get("x-forwarded-for") || "unknown"}`);
      return {
        authorized: false,
        error: "Authentication required: Missing admin credentials in headers.",
        status: 401,
      };
    }

    const db = await connectToDatabase();
    if (!db) {
      return {
        authorized: false,
        error: "Security database unreachable.",
        status: 503,
      };
    }

    let userDoc: any = null;

    if (uid) {
      userDoc = await User.findOne({ uid });
    }

    if (!userDoc && emailHeader) {
      userDoc = await User.findOne({ email: emailHeader });
    }

    if (!userDoc) {
      console.warn(`🔒 [Security Guard] Blocked request: User not found in database.`);
      return {
        authorized: false,
        error: "Unauthorized: User record does not exist.",
        status: 403,
      };
    }

    // Check if user has explicit 'admin' role in MongoDB or is the primary owner
    const isSuperAdmin = userDoc.email?.toLowerCase().trim() === "sanketkedare200@gmail.com";
    const hasAdminRole = userDoc.role === "admin" || isSuperAdmin;

    if (!hasAdminRole) {
      console.warn(
        `🚨 [Security Alert] Forbidden admin access attempt by @${userDoc.username || userDoc.email} (${userDoc.role})`
      );
      return {
        authorized: false,
        error: "Forbidden: Admin Architect role required to access this resource.",
        status: 403,
      };
    }

    return {
      authorized: true,
      user: userDoc,
    };
  } catch (error: any) {
    console.error("Admin verification exception:", error);
    return {
      authorized: false,
      error: "Internal security verification failure.",
      status: 500,
    };
  }
}
