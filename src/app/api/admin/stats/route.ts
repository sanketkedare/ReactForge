import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { GuestUsage } from "@/models/GuestUsage";
import { FailedEmail } from "@/models/FailedEmail";
import { verifyAdminRequest } from "@/lib/adminGuard";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now();

    // 🛡️ Guard: Check Admin Authorization
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status || 403 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const dbPingMs = Date.now() - startTime;
    const todayStr = getTodayString();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeTodayCount,
      adminCount,
      proCount,
      userRoleCount,
      allUsers,
      totalGuests,
      allGuests,
      failedEmailsCount,
      recentFailedEmails,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLoginAt: { $gte: startOfToday } }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "pro" }),
      User.countDocuments({ role: "user" }),
      User.find({}, "uid email displayName username role xp completedTasks bookmarkedTasks streak lastLoginAt createdAt aiUsage photoURL targetRole experienceLevel primaryFocus bio")
        .sort({ lastLoginAt: -1 })
        .lean(),
      GuestUsage.countDocuments(),
      GuestUsage.find({}).sort({ updatedAt: -1 }).limit(50).lean(),
      FailedEmail.countDocuments({ status: "failed" }),
      FailedEmail.find({}).sort({ createdAt: -1 }).limit(20).lean(),
    ]);

    // Calculate aggregated metrics
    let totalTasksCompleted = 0;
    let totalXP = 0;
    let totalAiMessagesToday = 0;
    const taskCompletionMap: Record<string, number> = {};
    const taskBookmarkMap: Record<string, number> = {};

    for (const u of allUsers) {
      totalXP += u.xp || 0;
      if (u.completedTasks && Array.isArray(u.completedTasks)) {
        totalTasksCompleted += u.completedTasks.length;
        for (const task of u.completedTasks) {
          taskCompletionMap[task] = (taskCompletionMap[task] || 0) + 1;
        }
      }
      if (u.bookmarkedTasks && Array.isArray(u.bookmarkedTasks)) {
        for (const task of u.bookmarkedTasks) {
          taskBookmarkMap[task] = (taskBookmarkMap[task] || 0) + 1;
        }
      }
      if (u.aiUsage && u.aiUsage.date === todayStr) {
        totalAiMessagesToday += u.aiUsage.count || 0;
      }
    }

    let guestAiMessages = 0;
    for (const g of allGuests) {
      guestAiMessages += g.count || 0;
    }

    // Build complete curriculum metadata with solve & bookmark counts
    const curriculumStats = LEARNING_PROJECTS.map((proj) => {
      const slug = proj.path.replace(/^\//, "");
      return {
        id: proj.id,
        title: proj.title,
        icon: proj.icon,
        category: proj.category,
        level: proj.level,
        levelLabel: proj.levelLabel,
        path: proj.path,
        slug,
        solves: taskCompletionMap[slug] || taskCompletionMap[proj.id] || 0,
        bookmarks: taskBookmarkMap[slug] || taskBookmarkMap[proj.id] || 0,
        estimatedMinutes: proj.estimatedMinutes,
      };
    }).sort((a, b) => b.solves - a.solves);

    // Track level breakdown
    const trackBreakdown = {
      beginner: { total: 40, solved: 0 },
      intermediate: { total: 35, solved: 0 },
      expert: { total: 25, solved: 0 },
    };

    for (const c of curriculumStats) {
      if (c.level === "beginner") trackBreakdown.beginner.solved += c.solves;
      else if (c.level === "intermediate") trackBreakdown.intermediate.solved += c.solves;
      else if (c.level === "expert") trackBreakdown.expert.solved += c.solves;
    }

    // Top XP Leaderboard
    const topUsers = [...allUsers]
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 10);

    // Generate real-time activity feed
    const activityFeed: Array<{
      id: string;
      type: "login" | "task" | "email" | "guest" | "signup";
      title: string;
      subtitle: string;
      timestamp: Date;
      badge?: string;
    }> = [];

    // Recent logins
    for (const u of allUsers.slice(0, 8)) {
      if (u.lastLoginAt) {
        activityFeed.push({
          id: `login-${u.uid}`,
          type: "login",
          title: `@${u.username || u.displayName} authenticated`,
          subtitle: `${u.email} • ${u.xp || 0} XP`,
          timestamp: new Date(u.lastLoginAt),
          badge: u.role.toUpperCase(),
        });
      }
    }

    // Recent failed emails
    for (const em of recentFailedEmails.slice(0, 4)) {
      activityFeed.push({
        id: `email-${em._id}`,
        type: "email",
        title: `Email delivery issue to ${em.toEmail}`,
        subtitle: em.errorMessage.slice(0, 60),
        timestamp: new Date(em.createdAt),
        badge: "EMAIL ERROR",
      });
    }

    // Recent guest activity
    for (const g of allGuests.slice(0, 4)) {
      activityFeed.push({
        id: `guest-${g._id}`,
        type: "guest",
        title: `Guest query from IP ${g.ip}`,
        subtitle: `Used ${g.count}/3 quota queries`,
        timestamp: new Date(g.updatedAt || g.lastUsedAt),
        badge: "GUEST IP",
      });
    }

    activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Server Memory and Telemetry
    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeToday: activeTodayCount,
        totalTasksCompleted,
        totalXP,
        totalAiMessagesToday,
        totalGuests,
        guestAiMessages,
        failedEmailsCount,
        roles: {
          admin: adminCount,
          pro: proCount,
          user: userRoleCount,
        },
        trackBreakdown,
      },
      curriculumStats,
      topUsers,
      allUsers,
      recentGuests: allGuests,
      recentFailedEmails,
      activityFeed: activityFeed.slice(0, 15),
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        dbPingMs,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Admin stats API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
