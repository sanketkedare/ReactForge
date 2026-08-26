// Fast client/server local responder for casual greetings to save 100% API tokens on non-technical queries

export function getLocalGreetingResponse(prompt: string, contextTitle: string = "React Machine Coding Hub"): string | null {
  const normalized = prompt.trim().toLowerCase().replace(/[!?.,]/g, "");

  const greetings = [
    "hi",
    "hello",
    "hey",
    "heya",
    "hey there",
    "good morning",
    "good afternoon",
    "good evening",
    "hola",
    "sup",
    "yo",
  ];

  const whoAreYou = [
    "who are you",
    "what is this",
    "what can you do",
    "help",
    "how to use",
    "what are you",
  ];

  const thanks = [
    "thanks",
    "thank you",
    "thx",
    "thank you so much",
    "great thanks",
    "cool",
    "awesome",
    "got it",
    "ok",
    "okay",
  ];

  const bye = ["bye", "goodbye", "see ya", "cya", "exit"];

  if (greetings.includes(normalized)) {
    return `👋 **Hello! Welcome to the React Machine Coding Lab.**\n\nI am your AI Interview Coach for **${contextTitle}**. Ask me for progressive hints, architectural reviews, or let me grill you with interview curveballs!`;
  }

  if (whoAreYou.includes(normalized)) {
    return `🤖 **I'm your AI Machine Coding Interview Coach.**\n\nHere is how I can help you ace your frontend interviews:\n* **Progressive Hints**: Step-by-step guidance without giving away the solution.\n* **Code & Architecture Review**: Analyze re-renders, hook choice, and memory leaks.\n* **Edge-Case Generator**: Discover tricky failure states before the interviewer catches them.\n* **Interview Grill Mode**: Practice answering rapid-fire follow-up questions.`;
  }

  if (thanks.includes(normalized)) {
    return `🎉 **You're very welcome!** Keep practicing and writing clean, accessible React code. Let me know if you need another hint or want me to review your implementation!`;
  }

  if (bye.includes(normalized)) {
    return `👋 **Best of luck with your frontend interviews!** Come back anytime to practice more of the 100 machine coding challenges.`;
  }

  return null;
}
