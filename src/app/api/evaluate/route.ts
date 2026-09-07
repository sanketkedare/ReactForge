import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { isBoilerplateCode } from "@/lib/taskEvaluator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      taskId,
      taskTitle = "React Component",
      category = "Frontend Architecture",
      level = "intermediate",
      code = "",
      uid,
      functionalPercentage = 100,
    } = body;

    if (!code || code.trim().length < 20) {
      return NextResponse.json(
        {
          error: "Submitted code is too short to evaluate. Please provide a functional implementation.",
        },
        { status: 400 }
      );
    }

    const xpAward =
      level === "expert" ? 50 : level === "intermediate" ? 25 : 10;

    // IMMEDIATE REJECTION: Unmodified starter boilerplate detection
    if (isBoilerplateCode(code)) {
      return NextResponse.json({
        success: true,
        taskId,
        xpEarned: 0,
        evaluation: {
          score: 2,
          passed: false,
          verdict: "NEEDS_REVISION",
          summary: `The submitted code is uncompleted starter boilerplate. Please implement the actual logic and UI requirements for ${taskTitle} before submitting.`,
          complexity: {
            time: "N/A (Incomplete)",
            space: "N/A (Incomplete)",
          },
          strengths: ["Boilerplate scaffold is loaded"],
          improvements: [
            `Implement specific state management and algorithms for ${taskTitle}`,
            "Replace starter template placeholders and TODO comments with real React 19 code",
          ],
          accessibility: "Provide real interactive handlers and WCAG 2.1 keyboard focus states.",
        },
      });
    }

    // AI Review prompt
    const systemInstruction = `You are a Principal Frontend Architect conducting a strict, official evaluation of a candidate's solution for the machine coding challenge: "${taskTitle}" (${level} level, category: ${category}).

STRICT GRADING RULES:
1. If the candidate code does not actually implement the core requirements of "${taskTitle}", you MUST set score <= 4 and passed: false.
2. If the code contains mostly placeholder comments or stub methods, you MUST set score <= 3 and passed: false.
3. Only award passed: true if score >= 7 AND the solution genuinely solves the challenge with robust state management.

Evaluate the candidate's code rigorously according to this exact structured JSON format. Return ONLY valid JSON with no markdown wrapping:
{
  "score": <number between 1 and 10>,
  "passed": <boolean, true if score >= 7 and implementation meets requirements, else false>,
  "verdict": "<'PASSED' | 'NEEDS_REVISION'>",
  "summary": "<2-sentence executive summary of the implementation quality>",
  "complexity": {
    "time": "<Asymptotic time complexity, e.g. O(1) or O(N)>",
    "space": "<Asymptotic space complexity, e.g. O(1) or O(N)>"
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>"],
  "accessibility": "<Evaluation of keyboard navigation, aria attributes, and focus management>"
}`;

    const userContentText = `Candidate's Solution Code:\n\`\`\`tsx\n${code}\n\`\`\`\n\nFunctional Test Suite Pass Rate: ${functionalPercentage}%`;

    const apiKey = process.env.GEMINI_API_KEY;
    let aiEvaluation: any = null;

    const geminiModels = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-flash-latest",
    ];

    if (apiKey && apiKey.startsWith("AIzaSy")) {
      for (const model of geminiModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ role: "user", parts: [{ text: userContentText }] }],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 2000,
                  responseMimeType: "application/json",
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              try {
                aiEvaluation = JSON.parse(rawText);
                break;
              } catch {
                // If direct JSON parse fails, try extracting from brackets
                const match = rawText.match(/\{[\s\S]*\}/);
                if (match) {
                  aiEvaluation = JSON.parse(match[0]);
                  break;
                }
              }
            }
          }
        } catch {
          // Cascade silently to next model in waterfall
        }
      }
    }

    // Dynamic Intelligent Fallback Synthesizer if offline or remote API unconfigured
    if (!aiEvaluation) {
      const codeLength = code.length;
      const hasHooks = /useState|useReducer|useMemo|useCallback/.test(code);
      const hasA11y = /aria-|role=|onClick|onChange/.test(code);
      const isGenuineImplementation = codeLength > 220 && hasHooks && !isBoilerplateCode(code) && functionalPercentage >= 80;

      const fallbackScore = isGenuineImplementation ? 8 : 4;
      const passed = isGenuineImplementation;

      aiEvaluation = {
        score: fallbackScore,
        passed,
        verdict: passed ? "PASSED" : "NEEDS_REVISION",
        summary: passed
          ? `Solid React 19 architecture with declarative state bindings and modular component separation for ${taskTitle}.`
          : `Implementation did not meet the functional specifications or contained uncompleted logic for ${taskTitle}.`,
        complexity: {
          time: passed ? "O(1) / O(N)" : "N/A",
          space: passed ? "O(1) memory" : "N/A",
        },
        strengths: passed
          ? [
              "Declarative JSX structure with clean styling hierarchy",
              "Appropriate use of React hooks for component state management",
            ]
          : ["Scaffold is loaded"],
        improvements: [
          "Ensure all interactive handlers have defensive boundary checks",
          "Add explicit ARIA attributes (role, aria-label) for screen readers",
        ],
        accessibility: hasA11y
          ? "Standard interactive accessibility indicators detected."
          : "Consider adding explicit focus rings and aria-labels for enhanced WCAG 2.1 compliance.",
      };
    }

    // Persist verified completion in MongoDB if user is authenticated
    let xpEarned = 0;
    if (uid && aiEvaluation.passed) {
      try {
        const db = await connectToDatabase();
        if (db) {
          const userDoc = await User.findOne({ uid });
          if (userDoc) {
            const alreadyCompleted = userDoc.completedTasks.includes(taskId);
            if (!alreadyCompleted) {
              userDoc.completedTasks.push(taskId);
              userDoc.xp = (userDoc.xp || 0) + xpAward;
              xpEarned = xpAward;

              // Update streak
              const now = new Date();
              const lastActive = userDoc.streak?.lastActiveDate
                ? new Date(userDoc.streak.lastActiveDate)
                : null;

              if (!lastActive) {
                userDoc.streak = { current: 1, longest: 1, lastActiveDate: now };
              } else {
                const diffDays = Math.floor(
                  (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
                );
                if (diffDays === 1) {
                  const newCurrent = (userDoc.streak.current || 0) + 1;
                  userDoc.streak.current = newCurrent;
                  userDoc.streak.longest = Math.max(
                    userDoc.streak.longest || 0,
                    newCurrent
                  );
                  userDoc.streak.lastActiveDate = now;
                } else if (diffDays > 1) {
                  userDoc.streak.current = 1;
                  userDoc.streak.lastActiveDate = now;
                }
              }
            }

            // Record submission
            if (!userDoc.taskSubmissions) userDoc.taskSubmissions = [];
            userDoc.taskSubmissions.push({
              taskId,
              score: aiEvaluation.score,
              passed: aiEvaluation.passed,
              code: code.slice(0, 10000),
              feedback: aiEvaluation.summary,
              evaluatedAt: new Date(),
            });

            await userDoc.save();
          }
        }
      } catch (dbErr) {
        console.error("⚠️ [Evaluation API] Failed to update user record in DB:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      taskId,
      xpEarned,
      evaluation: aiEvaluation,
    });
  } catch (error: any) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during evaluation" },
      { status: 500 }
    );
  }
}
