import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing required fields: uid, email" },
        { status: 400 }
      );
    }

    console.log(`📥 [Auth Sync] Incoming login sync for: ${email} (${uid.slice(0, 8)}...)`);

    const db = await connectToDatabase();

    if (!db) {
      console.warn(`⚠️ [Auth Sync] Proceeding with offline fallback for: ${email}`);
      // Fallback response if DB is temporarily unreachable
      return NextResponse.json({
        success: true,
        user: {
          uid,
          email,
          displayName: displayName || "Frontend Engineer",
          photoURL: photoURL || "",
          role: "user",
          isRegistrationComplete: false,
          completedTasks: [],
          bookmarkedTasks: [],
          streak: { current: 1, longest: 1, lastActiveDate: new Date() },
          xp: 0,
          bio: "Passionate React developer.",
          targetRole: "Frontend Engineer",
          isOfflineFallback: true,
        },
        requiresOnboarding: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isAdminEmail = cleanEmail === "sanketkedare200@gmail.com";

    // Upsert user in MongoDB
    let user = await User.findOne({ uid });
    let isNewUser = false;

    if (!user) {
      // Check if user exists by email (e.g. signed up with email first, now Google)
      user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.uid = uid;
        if (photoURL && !user.photoURL) user.photoURL = photoURL;
        if (user.isRegistrationComplete === undefined || user.isRegistrationComplete === null) {
          user.isRegistrationComplete = false;
        }
        if (isAdminEmail) {
          user.role = "admin";
        }
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        isNewUser = true;
        // Create new user record
        user = await User.create({
          uid,
          email: cleanEmail,
          displayName: displayName || "Frontend Engineer",
          photoURL: photoURL || "",
          role: isAdminEmail ? "admin" : "user",
          isRegistrationComplete: false,
          welcomeEmailSent: true,
          completedTasks: [],
          bookmarkedTasks: [],
          streak: {
            current: 1,
            longest: 1,
            lastActiveDate: new Date(),
          },
          xp: 0,
          lastLoginAt: new Date(),
        });
      }
    } else {
      user.lastLoginAt = new Date();
      if (displayName && (user.displayName === "Frontend Engineer" || !user.displayName)) {
        user.displayName = displayName;
      }
      if (photoURL && !user.photoURL) {
        user.photoURL = photoURL;
      }
      if (isAdminEmail) {
        user.role = "admin";
      }
      // If the user already has a custom name/username, or completed tasks, or was created previously:
      // mark registration as completed so they are never trapped in onboarding.
      if (
        user.isRegistrationComplete === true ||
        (user.displayName && user.displayName !== "Frontend Engineer") ||
        user.username ||
        (user.completedTasks && user.completedTasks.length > 0)
      ) {
        user.isRegistrationComplete = true;
      } else if (user.isRegistrationComplete === undefined || user.isRegistrationComplete === null) {
        user.isRegistrationComplete = true;
      }
      await user.save();
    }

    // Dispatch welcome email on fresh registration
    if (isNewUser || (!user.welcomeEmailSent && email && email.includes("@"))) {
      user.welcomeEmailSent = true;
      await user.save();

      sendWelcomeEmail({
        toEmail: email.toLowerCase().trim(),
        displayName: displayName || user.displayName || "Frontend Engineer",
        username: user.username,
        targetRole: user.targetRole || "Frontend Engineer",
        experienceLevel: user.experienceLevel || "junior",
        primaryFocus: user.primaryFocus || "Machine Coding Interviews",
      }).catch((err) => {
        console.error("⚠️ [Auth Sync Welcome Email Error]:", err.message || err);
      });
    }

    console.log(`✅ [Auth Sync] Synced ${email} in MongoDB | isRegistrationComplete: ${user.isRegistrationComplete}`);

    return NextResponse.json({
      success: true,
      user,
      requiresOnboarding: !user.isRegistrationComplete,
    });
  } catch (error: any) {
    console.error("Auth Sync Warning:", error.message || error);
    // Bug fix: Do NOT return requiresOnboarding: true in the catch block.
    // A network/DB error should never open the onboarding modal for existing users.
    // Mark the response as an offline fallback so the client can guard against it.
    return NextResponse.json({
      success: true,
      user: {
        uid: body?.uid || "user",
        email: body?.email || "dev@example.com",
        displayName: body?.displayName || "Frontend Engineer",
        photoURL: body?.photoURL || "",
        role: "user",
        isRegistrationComplete: true,   // assume complete — don't punish user for DB errors
        completedTasks: [],
        bookmarkedTasks: [],
        streak: { current: 1, longest: 1, lastActiveDate: new Date() },
        xp: 0,
        isOfflineFallback: true,         // client guards requiresOnboarding against this flag
      },
      requiresOnboarding: false,         // never force onboarding on error
    });
  }
}
