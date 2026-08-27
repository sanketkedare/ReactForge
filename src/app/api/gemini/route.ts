import { NextRequest, NextResponse } from "next/server";
import { getLocalGreetingResponse } from "@/lib/aiGreetings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      context = {},
      mode = "interview",
      userApiKey,
    } = body;

    const {
      taskTitle = "React Component",
      category = "Frontend Architecture",
      level = "Intermediate",
      concepts = [],
      code = "",
    } = context;

    // TOKEN SAVINGS: Intercept simple casual greetings without consuming API tokens
    const localGreeting = getLocalGreetingResponse(prompt, taskTitle);
    if (localGreeting) {
      return NextResponse.json({
        success: true,
        model: "local-fast",
        response: localGreeting,
      });
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

    // Available Active Gemini Models in priority order
    const geminiModels = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      // "gemini-1.5-flash",
      // "gemini-2.0-flash",
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
            return NextResponse.json({
              success: true,
              model,
              response: candidateText,
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
