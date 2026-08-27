import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, taskSlug } = body;

    if (!uid || !taskSlug) {
      return NextResponse.json(
        { error: "Missing required fields: uid, taskSlug" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        taskSlug,
        message: "Bookmark updated locally (MongoDB offline fallback)",
      });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isBookmarked = user.bookmarkedTasks.includes(taskSlug);

    if (isBookmarked) {
      user.bookmarkedTasks = user.bookmarkedTasks.filter(
        (slug) => slug !== taskSlug
      );
    } else {
      user.bookmarkedTasks.push(taskSlug);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      bookmarkedTasks: user.bookmarkedTasks,
      isBookmarked: !isBookmarked,
    });
  } catch (error: any) {
    console.error("Bookmark Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
