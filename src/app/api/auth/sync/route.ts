import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

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
        requiresOnboarding: true,
      });
    }

    // Upsert user in MongoDB
    let user = await User.findOne({ uid });

    if (!user) {
      // Check if user exists by email (e.g. signed up with email first, now Google)
      user = await User.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        user.uid = uid;
        if (photoURL && !user.photoURL) user.photoURL = photoURL;
        if (user.isRegistrationComplete === undefined || user.isRegistrationComplete === null) {
          user.isRegistrationComplete = false;
        }
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        // Create new user record with isRegistrationComplete = false
        user = await User.create({
          uid,
          email: email.toLowerCase().trim(),
          displayName: displayName || "Frontend Engineer",
          photoURL: photoURL || "",
          role: "user",
          isRegistrationComplete: false,
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
      if (user.isRegistrationComplete === undefined || user.isRegistrationComplete === null) {
        user.isRegistrationComplete = false;
      }
      await user.save();
    }

    console.log(`✅ [Auth Sync] Synced ${email} in MongoDB | isRegistrationComplete: ${user.isRegistrationComplete}`);

    return NextResponse.json({
      success: true,
      user,
      requiresOnboarding: !user.isRegistrationComplete,
    });
  } catch (error: any) {
    console.error("Auth Sync Warning:", error.message || error);
    // Gracefully return fallback so client UI never breaks
    return NextResponse.json({
      success: true,
      user: {
        uid: body?.uid || "user",
        email: body?.email || "dev@example.com",
        displayName: body?.displayName || "Frontend Engineer",
        photoURL: body?.photoURL || "",
        role: "user",
        isRegistrationComplete: false,
        completedTasks: [],
        bookmarkedTasks: [],
        streak: { current: 1, longest: 1, lastActiveDate: new Date() },
        xp: 0,
        isOfflineFallback: true,
      },
      requiresOnboarding: true,
    });
  }
}
