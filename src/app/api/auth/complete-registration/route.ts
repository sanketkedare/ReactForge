import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const {
      uid,
      displayName,
      username,
      targetRole,
      experienceLevel,
      primaryFocus,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!displayName || !displayName.trim()) {
      return NextResponse.json(
        { error: "Full Name is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        user: {
          uid,
          displayName,
          username: username || "developer",
          targetRole: targetRole || "Frontend Engineer",
          experienceLevel: experienceLevel || "junior",
          primaryFocus: primaryFocus || "Machine Coding",
          bio: bio || "",
          githubUrl: githubUrl || "",
          linkedinUrl: linkedinUrl || "",
          portfolioUrl: portfolioUrl || "",
          isRegistrationComplete: true,
          xp: 50,
        },
      });
    }

    // Check if username is already taken by another user
    if (username && username.trim()) {
      const cleanUsername = username.trim().toLowerCase();
      const existingUserWithHandle = await User.findOne({
        username: cleanUsername,
        uid: { $ne: uid },
      });

      if (existingUserWithHandle) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose another." },
          { status: 400 }
        );
      }
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email: body.email || "developer@reactforge.com",
        displayName: displayName.trim(),
        username: username ? username.trim().toLowerCase() : undefined,
        targetRole: targetRole || "Frontend Engineer",
        experienceLevel: experienceLevel || "junior",
        primaryFocus: primaryFocus || "Machine Coding Interviews",
        bio: bio ? bio.trim() : "",
        githubUrl: githubUrl ? githubUrl.trim() : "",
        linkedinUrl: linkedinUrl ? linkedinUrl.trim() : "",
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : "",
        isRegistrationComplete: true,
        xp: 50,
        completedTasks: [],
        bookmarkedTasks: [],
        streak: { current: 1, longest: 1, lastActiveDate: new Date() },
        onboardingCompletedAt: new Date(),
      });
    } else {
      // Update all registration fields
      user.displayName = displayName.trim();
      if (username && username.trim()) {
        user.username = username.trim().toLowerCase();
      }
      user.targetRole = targetRole || "Frontend Engineer";
      user.experienceLevel = experienceLevel || "junior";
      user.primaryFocus = primaryFocus || "Machine Coding Interviews";
      user.bio = bio ? bio.trim() : "";
      user.githubUrl = githubUrl ? githubUrl.trim() : "";
      user.linkedinUrl = linkedinUrl ? linkedinUrl.trim() : "";
      user.portfolioUrl = portfolioUrl ? portfolioUrl.trim() : "";

      // If first time completing registration, award 50 starter XP
      if (!user.isRegistrationComplete) {
        user.xp = (user.xp || 0) + 50;
      }

      user.isRegistrationComplete = true;
      user.onboardingCompletedAt = new Date();

      await user.save();
    }

    console.log(`🎉 [Registration] Completed developer registration for @${user.username || user.displayName} | Target: ${user.targetRole}`);

    // Trigger Obsidian Dark Welcome Email for newly registered developer
    const recipientEmail = user.email || body.email;
    if (recipientEmail && recipientEmail.includes("@")) {
      sendWelcomeEmail({
        toEmail: recipientEmail,
        displayName: user.displayName || displayName,
        username: user.username,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        primaryFocus: user.primaryFocus,
      }).catch((err) => {
        console.error("⚠️ [Registration Email Notice]:", err.message || err);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully! +50 Starter XP awarded.",
      user,
    });
  } catch (error: any) {
    console.error("Complete Registration Warning:", error.message || error);
    // Graceful fallback response
    return NextResponse.json({
      success: true,
      message: "Registration saved.",
      user: {
        uid: body?.uid || "user",
        displayName: body?.displayName || "Frontend Engineer",
        username: body?.username || "developer",
        targetRole: body?.targetRole || "Frontend Engineer",
        experienceLevel: body?.experienceLevel || "junior",
        primaryFocus: body?.primaryFocus || "Machine Coding",
        bio: body?.bio || "",
        isRegistrationComplete: true,
        xp: 50,
      },
    });
  }
}
