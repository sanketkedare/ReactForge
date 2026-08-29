import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { GuestUsage } from "@/models/GuestUsage";
import { sendWelcomeEmail } from "@/lib/email";
import { verifyAdminRequest } from "@/lib/adminGuard";

export async function POST(req: NextRequest) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 403 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const body = await req.json();
    const { action, targetUid, targetIp, xpDelta, testEmail, targetRole } = body;

    switch (action) {
      case "reset_user_ai": {
        if (!targetUid) return NextResponse.json({ error: "Missing targetUid" }, { status: 400 });
        const user = await User.findOne({ uid: targetUid });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        user.aiUsage = { date: "", count: 0 };
        await user.save();
        return NextResponse.json({ success: true, message: `Reset AI quota for @${user.username || user.displayName}` });
      }

      case "reset_guest_ip": {
        if (!targetIp) return NextResponse.json({ error: "Missing targetIp" }, { status: 400 });
        await GuestUsage.deleteOne({ ip: targetIp });
        return NextResponse.json({ success: true, message: `Cleared guest quota for IP: ${targetIp}` });
      }

      case "adjust_xp": {
        if (!targetUid || typeof xpDelta !== "number") {
          return NextResponse.json({ error: "Missing targetUid or xpDelta" }, { status: 400 });
        }
        const user = await User.findOne({ uid: targetUid });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        user.xp = Math.max(0, (user.xp || 0) + xpDelta);
        await user.save();
        return NextResponse.json({ success: true, message: `Updated XP by ${xpDelta > 0 ? "+" : ""}${xpDelta} for @${user.username || user.displayName}`, user });
      }

      case "send_test_email": {
        if (!testEmail || !testEmail.includes("@")) {
          return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }
        const sent = await sendWelcomeEmail({
          toEmail: testEmail.toLowerCase().trim(),
          displayName: "Admin Test Engineer",
          targetRole: "Senior Frontend Architect",
          experienceLevel: "expert",
          primaryFocus: "System Design & Machine Coding",
        });
        if (sent) {
          return NextResponse.json({ success: true, message: `Test welcome email dispatched to ${testEmail}` });
        } else {
          return NextResponse.json({ error: "Email delivery failed. Check FailedEmail collection for logs." }, { status: 500 });
        }
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin action execution error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute admin action" }, { status: 500 });
  }
}
