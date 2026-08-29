import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
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
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const query: any = {};
    if (role && ["user", "pro", "admin"].includes(role)) {
      query.role = role;
    }

    if (search.trim()) {
      const reg = new RegExp(search.trim(), "i");
      query.$or = [
        { email: reg },
        { displayName: reg },
        { username: reg },
        { targetRole: reg },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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
    const { uid, role, xpBonus } = body;

    if (!uid) {
      return NextResponse.json({ error: "User UID is required" }, { status: 400 });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (role && ["user", "pro", "admin"].includes(role)) {
      user.role = role;
    }

    if (typeof xpBonus === "number") {
      user.xp = Math.max(0, (user.xp || 0) + xpBonus);
    }

    await user.save();

    console.log(`🛡️ [Admin Action] Updated user @${user.username || user.email} | Role: ${user.role} | XP: ${user.xp}`);

    return NextResponse.json({
      success: true,
      message: `User updated successfully`,
      user,
    });
  } catch (error: any) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
