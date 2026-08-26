"use client";

import React, { useState, useEffect } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight, HelpCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What happens when you pass an empty dependency array `[]` to useEffect?",
    options: [
      "The effect never runs",
      "The effect runs only once after the initial render and mount",
      "The effect runs on every single state update",
      "The effect causes an infinite loop",
    ],
    correctAnswer: 1,
    explanation:
      "An empty dependency array indicates that the effect does not depend on any props or state, so React only executes it once upon mounting.",
  },
  {
    id: 2,
    question: "Why should keys in a list be stable unique identifiers instead of array indices?",
    options: [
      "Indices are not supported in React 19",
      "Using indices causes visual glitches, wrong state association, and poor reconciliation performance during insertions or deletions",
      "Indices increase the JavaScript bundle size",
      "Keys must always be alphanumeric strings from a database",
    ],
    correctAnswer: 1,
    explanation:
      "When items are inserted, deleted, or reordered, array indices shift. If keys change, React may confuse component states across sibling elements.",
  },
  {
    id: 3,
    question: "What is the primary purpose of React.memo?",
    options: [
      "To save data into localStorage",
      "To memoize expensive math calculations inside a function",
      "To prevent a component from re-rendering if its props have not changed",
      "To create a persistent ref",
    ],
    correctAnswer: 2,
    explanation:
      "React.memo is a higher-order component that skips rendering a component if its incoming props are shallowly equal to the previous props.",
  },
  {
    id: 4,
    question: "How does React batch multiple state updates inside event handlers in React 18+?",
    options: [
      "It renders sequentially after every setState call",
      "It automatically batches updates (even in async/promises) into a single render pass",
      "It requires unstable_batchedUpdates to combine renders",
      "It delays rendering until the window loses focus",
    ],
    correctAnswer: 1,
    explanation:
      "React 18 introduced Automatic Batching across all promises, setTimeout, and event handlers to drastically reduce unnecessary re-renders.",
  },
  {
    id: 5,
    question: "What is the key difference between Controlled and Uncontrolled form inputs?",
    options: [
      "Controlled inputs use React state as the single source of truth; Uncontrolled inputs let the DOM maintain state via refs",
      "Controlled inputs are only for numbers; Uncontrolled are for text",
      "Controlled inputs require a backend server",
      "Uncontrolled inputs cannot use onChange handlers",
    ],
    correctAnswer: 0,
    explanation:
      "In a controlled input, the input value is bound to React state and updated via an onChange handler. In an uncontrolled component, the DOM handles the value internally.",
  },
];

export default function QuizAppPage() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setUserAnswers((prev) => [...prev, index]);
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Interactive React Quiz App"
        description="Build a step-by-step interview quiz with real-time score tracking, immediate explanation feedback, and a comprehensive end-of-test review."
        level="beginner"
        category="State & Evaluation"
        skills={["Multi-Step Wizard State", "Conditional Option Feedback", "Score Calculation"]}
        estimatedMinutes={20}
        whatYouWillBuild="A multi-question quiz testing foundational React concepts with instant visual feedback and score calculation."
        keyTakeaways={[
          "Tracking user selection states alongside question indexes",
          "Locking answers once selected to prevent multiple score increments",
          "Rendering review screens mapping over recorded user responses",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-8">
          {!isFinished ? (
            <div className="space-y-6">
              {/* Progress Header */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-amber-300">
                  Question {currentIdx + 1} of {QUESTIONS.length}
                </span>
                <span className="font-mono">Current Score: {score}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question Headline */}
              <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                {currentQ.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((option, idx) => {
                  let btnStyle =
                    "border-slate-800 bg-slate-950/80 text-slate-200 hover:border-slate-700 hover:bg-slate-900";

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswer) {
                      btnStyle =
                        "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/20";
                    } else if (idx === selectedOption) {
                      btnStyle =
                        "border-red-500 bg-red-950/60 text-red-200 ring-2 ring-red-500/20";
                    } else {
                      btnStyle = "border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs text-slate-300 space-y-1.5"
                >
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p className="font-light leading-relaxed">{currentQ.explanation}</p>
                </motion.div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-7 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                  >
                    <span>
                      {currentIdx === QUESTIONS.length - 1 ? "See Final Results" : "Next Question"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* SCORECARD REVIEW */
            <div className="space-y-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shadow-xl">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-sm text-slate-400 font-light">
                  You scored <span className="font-bold text-amber-300">{score}</span> out of{" "}
                  <span className="font-bold text-white">{QUESTIONS.length}</span> (
                  {Math.round((score / QUESTIONS.length) * 100)}%)
                </p>
              </div>

              {/* Action */}
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-8 py-3.5 mx-auto rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
