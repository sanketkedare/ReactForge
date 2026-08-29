import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FailedEmail } from "@/models/FailedEmail";
import { sendWelcomeEmail } from "@/lib/email";
import { verifyAdminRequest } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 403 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    const query: any = {};
    if (status && ["failed", "retrying", "resolved"].includes(status)) {
      query.status = status;
    }

    const logs = await FailedEmail.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    console.error("Admin emails API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}

// RETRY SENDING A FAILED EMAIL
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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Email log ID is required" }, { status: 400 });
    }

    const log = await FailedEmail.findById(id);
    if (!log) {
      return NextResponse.json({ error: "Log record not found" }, { status: 404 });
    }

    log.attempts += 1;
    log.status = "retrying";
    await log.save();

    const success = await sendWelcomeEmail({
      toEmail: log.toEmail,
      displayName: log.displayName || "Developer",
      username: log.payload?.username,
      targetRole: log.payload?.targetRole,
      experienceLevel: log.payload?.experienceLevel,
      primaryFocus: log.payload?.primaryFocus,
    });

    if (success) {
      log.status = "resolved";
      log.errorMessage = "Resolved via admin retry";
      await log.save();

      return NextResponse.json({
        success: true,
        message: `Email successfully re-sent to ${log.toEmail}!`,
        log,
      });
    } else {
      log.status = "failed";
      await log.save();

      return NextResponse.json(
        {
          success: false,
          error: "Retry failed. Check SMTP configuration in environment.",
          log,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Admin retry email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retry email" },
      { status: 500 }
    );
  }
}

// TOGGLE STATUS
export async function PATCH(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const log = await FailedEmail.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
