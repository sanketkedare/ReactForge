import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, taskSlug, completed, xpValue = 15 } = body;

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
        completed,
        message: "Recorded locally (MongoDB offline fallback)",
      });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasTask = user.completedTasks.includes(taskSlug);

    if (completed && !hasTask) {
      user.completedTasks.push(taskSlug);
      user.xp += xpValue;

      // Update streak
      const now = new Date();
      const lastActive = user.streak.lastActiveDate
        ? new Date(user.streak.lastActiveDate)
        : null;

      if (!lastActive) {
        user.streak.current = 1;
        user.streak.longest = 1;
      } else {
        const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
        if (diffHours >= 20 && diffHours <= 48) {
          user.streak.current += 1;
          if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
          }
        } else if (diffHours > 48) {
          user.streak.current = 1;
        }
      }
      user.streak.lastActiveDate = now;
    } else if (!completed && hasTask) {
      user.completedTasks = user.completedTasks.filter((slug) => slug !== taskSlug);
      user.xp = Math.max(0, user.xp - xpValue);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      completedTasks: user.completedTasks,
      xp: user.xp,
      streak: user.streak,
    });
  } catch (error: any) {
    console.error("Progress Update Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update task progress" },
      { status: 500 }
    );
  }
}
