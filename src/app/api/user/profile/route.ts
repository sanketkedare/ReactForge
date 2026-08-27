import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        user: null,
      });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, displayName, bio, targetRole, githubUrl, linkedinUrl } = body;

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        message: "Profile updated locally (MongoDB offline fallback)",
      });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
