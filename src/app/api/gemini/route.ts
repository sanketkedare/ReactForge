import { NextRequest, NextResponse } from "next/server";
import { getLocalGreetingResponse } from "@/lib/aiGreetings";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { GuestUsage } from "@/models/GuestUsage";

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

const AUTH_DAILY_MAX = 100;
const GUEST_MAX = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      context = {},
      mode = "interview",
      userApiKey,
      uid,
    } = body;

    const {
      taskTitle = "React Component",
      category = "Frontend Architecture",
      level = "Intermediate",
      concepts = [],
      code = "",
    } = context;

    // 1. TOKEN SAVINGS: Intercept simple casual greetings without consuming API tokens
    const localGreeting = getLocalGreetingResponse(prompt, taskTitle);
    if (localGreeting) {
      return NextResponse.json({
        success: true,
        model: "local-fast",
        response: localGreeting,
      });
    }

    // 2. SERVER-SIDE MONGODB RATE LIMITING
    let userDoc: any = null;
    let guestDoc: any = null;
    let userRemaining = AUTH_DAILY_MAX;
    const isCustomKey = Boolean(userApiKey && userApiKey.trim());

    if (!isCustomKey) {
      const db = await connectToDatabase();

      if (db) {
        const todayStr = getTodayString();

        if (uid) {
          // ==========================================
          // AUTHENTICATED USER: 100 MESSAGES / DAY
          // ==========================================
          userDoc = await User.findOne({ uid });

          if (userDoc) {
            const currentUsageDate = userDoc.aiUsage?.date || "";
            let currentCount = userDoc.aiUsage?.count || 0;

            // Reset count if it's a new calendar day
            if (currentUsageDate !== todayStr) {
              currentCount = 0;
              userDoc.aiUsage = { date: todayStr, count: 0 };
            }

            if (currentCount >= AUTH_DAILY_MAX) {
              return NextResponse.json(
                {
                  error: `🔒 Daily AI Limit Reached (${AUTH_DAILY_MAX}/${AUTH_DAILY_MAX} chats used today). Your quota will automatically reset at midnight. You can also configure your personal Google Gemini API Key in Settings to continue without limits.`,
                  remaining: 0,
                  limitReached: true,
                },
                { status: 429 }
              );
            }

            userRemaining = Math.max(0, AUTH_DAILY_MAX - currentCount - 1);
          }
        } else {
          // ==========================================
          // GUEST USER: 3 MESSAGES MAX (TRACKED VIA IP)
          // ==========================================
          const forwarded = req.headers.get("x-forwarded-for");
          const realIp = req.headers.get("x-real-ip");
          const ip = (forwarded ? forwarded.split(",")[0].trim() : realIp) || "anonymous-guest";

          guestDoc = await GuestUsage.findOne({ ip });

          if (!guestDoc) {
            guestDoc = new GuestUsage({ ip, count: 0, lastUsedAt: new Date() });
          }

          if (guestDoc.count >= GUEST_MAX) {
            return NextResponse.json(
              {
                error: `🔒 Free Guest Limit Reached (${GUEST_MAX}/${GUEST_MAX} chats used). Please Sign In with Google, GitHub, or Email to unlock 100 AI Coaching messages per day!`,
                remaining: 0,
                limitReached: true,
                requiresAuth: true,
              },
              { status: 429 }
            );
          }
        }
      }
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key is required. Please configure your Google AI Studio key in settings.",
        },
        { status: 400 }
      );
    }

    let systemInstruction = "";

    switch (mode) {
      case "review":
        systemInstruction = `You are a Principal Frontend Engineer and strict React 19 code reviewer.
Review the candidate's code for "${taskTitle}" (${level} level, category: ${category}).
Be concise and structured:
1. ⏱️ **Time & Space Complexity**: Asymptotic analysis.
2. ⚡ **Performance & Re-Renders**: Redundant renders or missing memoization.
3. 🛡️ **Memory Leaks & Cleanup**: Effect / listener teardown.
4. ♿ **Accessibility**: Keyboard / ARIA review.
5. 📊 **Score (/10)** with 3 bulleted actionable improvements. Keep code snippets brief.`;
        break;

      case "edge_cases":
        systemInstruction = `You are a Senior QA / Frontend Architect.
List 5 critical edge cases, failure states, and test assertions for "${taskTitle}". Keep explanations direct and concise.`;
        break;

      case "hint":
        systemInstruction = `You are a FAANG technical interviewer helping a candidate on "${taskTitle}".
Provide a concise progressive hint (Mental model guidance & hook choice). Keep it brief without full solution code.`;
        break;

      case "interview":
      default:
        systemInstruction = `You are a Staff Frontend Engineer conducting a live Machine Coding Interview for "${taskTitle}" (${category}, ${level}).
Provide direct, concise, high-density responses with structured markdown, bullet points, and short code examples. Avoid conversational filler.`;
        break;
    }

    const userContentText = `${prompt}${
      code ? `\n\nCandidate's Current Code:\n\`\`\`tsx\n${code}\n\`\`\`` : ""
    }`;

    // Verified active Gemini Models in priority order
    const geminiModels = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-flash-latest",
    ];

    let lastError = "";

    for (const model of geminiModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: userContentText }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 3000,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            // 3. PERSIST USAGE INCREMENT IN MONGODB ON SUCCESS
            if (!isCustomKey) {
              try {
                if (userDoc) {
                  userDoc.aiUsage.count = (userDoc.aiUsage.count || 0) + 1;
                  userDoc.aiUsage.date = getTodayString();
                  await userDoc.save();
                } else if (guestDoc) {
                  guestDoc.count = (guestDoc.count || 0) + 1;
                  guestDoc.lastUsedAt = new Date();
                  await guestDoc.save();
                }
              } catch (dbSaveErr) {
                console.error("⚠️ [AI Quota] Failed to increment count in DB:", dbSaveErr);
              }
            }

            return NextResponse.json({
              success: true,
              model,
              response: candidateText,
              remaining: userRemaining,
            });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    return NextResponse.json(
      {
        error: `AI Service Notice: ${lastError || "Could not connect to Gemini API."}`,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("AI API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
