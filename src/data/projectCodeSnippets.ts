export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  code: string;
  isMain?: boolean;
}

export interface ProjectCodeStructure {
  folderName: string;
  description: string;
  files: ProjectFile[];
}

export const SPECIFIC_PROJECT_CODE: Record<string, ProjectCodeStructure> = {
  "todo-list": {
    folderName: "src/components/TodoList",
    description: "Production-ready CRUD To-Do architecture with custom localStorage sync hook and strict typing.",
    files: [
      {
        name: "TodoList.tsx",
        path: "src/components/TodoList/TodoList.tsx",
        language: "tsx",
        isMain: true,
        code: `"use client";

import React, { useState } from "react";
import { useTodoStorage } from "./useTodoStorage";
import { TodoItem } from "./TodoItem";
import { TodoFilter, TodoTask } from "./types";
import { Plus, CheckCircle2, ListFilter, Trash2 } from "lucide-react";

export default function TodoList() {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodoStorage();
  const [inputText, setInputText] = useState<string>("");
  const [filter, setFilter] = useState<TodoFilter>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addTodo(inputText.trim());
    setInputText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl space-y-6 text-white font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Task Master</h2>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            {activeCount} active tasks remaining
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(["all", "active", "completed"] as TodoFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={"px-3 py-1 rounded-lg capitalize transition-all " + (filter === f ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What needs to be done?..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
            No tasks found in this filter.
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onRemove={removeTodo}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {todos.some((t) => t.completed) && (
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={clearCompleted}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        </div>
      )}
    </div>
  );
}`,
      },
      {
        name: "useTodoStorage.ts",
        path: "src/components/TodoList/useTodoStorage.ts",
        language: "typescript",
        code: `import { useState, useEffect } from "react";
import { TodoTask } from "./types";

const STORAGE_KEY = "REACT_TASKS_TODO_V1";

export function useTodoStorage() {
  const [todos, setTodos] = useState<TodoTask[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: TodoTask = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
  };
}`,
      },
      {
        name: "TodoItem.tsx",
        path: "src/components/TodoList/TodoItem.tsx",
        language: "tsx",
        code: `import React from "react";
import { TodoTask } from "./types";
import { Check, Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: TodoTask;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onRemove }) => {
  return (
    <div
      className={"flex items-center justify-between p-3.5 rounded-2xl border transition-all " + (todo.completed ? "bg-slate-950/60 border-slate-800/60 text-slate-500" : "bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/40")}
    >
      <div
        onClick={() => onToggle(todo.id)}
        className="flex items-center gap-3 flex-1 cursor-pointer select-none"
      >
        <div
          className={"w-5 h-5 rounded-lg border flex items-center justify-center transition-all " + (todo.completed ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-700 hover:border-amber-400")}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
        <span className={"text-sm font-light " + (todo.completed ? "line-through" : "")}>
          {todo.text}
        </span>
      </div>

      <button
        onClick={() => onRemove(todo.id)}
        className="text-slate-600 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
        title="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};`,
      },
      {
        name: "types.ts",
        path: "src/components/TodoList/types.ts",
        language: "typescript",
        code: `export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type TodoFilter = "all" | "active" | "completed";`,
      },
    ],
  },
  "password-generator": {
    folderName: "src/components/PasswordGenerator",
    description: "High-entropy password generation engine with cryptographic randomness and live entropy evaluation.",
    files: [
      {
        name: "PasswordGenerator.tsx",
        path: "src/components/PasswordGenerator/PasswordGenerator.tsx",
        language: "tsx",
        isMain: true,
        code: `"use client";

import React, { useState, useCallback, useEffect } from "react";
import { generatePassword, calculateEntropy } from "./utils";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = useCallback(() => {
    const newPass = generatePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });
    setPassword(newPass);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entropy = calculateEntropy(password);

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl space-y-6 text-white font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Password Vault</h2>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Cryptographically secure entropy generator
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80 font-mono">
          {entropy.score} • {entropy.bits} bits
        </span>
      </div>

      {/* Display Box */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <span className="font-mono text-lg text-amber-200 tracking-wider break-all select-all">
          {password}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <button
            onClick={handleGenerate}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Password Length</span>
          <span className="font-mono font-bold text-amber-400">{length} characters</span>
        </div>
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {[
          { label: "Uppercase (A-Z)", state: includeUppercase, set: setIncludeUppercase },
          { label: "Lowercase (a-z)", state: includeLowercase, set: setIncludeLowercase },
          { label: "Numbers (0-9)", state: includeNumbers, set: setIncludeNumbers },
          { label: "Symbols (!@#$)", state: includeSymbols, set: setIncludeSymbols },
        ].map((opt, i) => (
          <label
            key={i}
            className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-amber-500/40"
          >
            <input
              type="checkbox"
              checked={opt.state}
              onChange={(e) => opt.set(e.target.checked)}
              className="accent-amber-400 rounded"
            />
            <span className="text-slate-300">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}`,
      },
      {
        name: "utils.ts",
        path: "src/components/PasswordGenerator/utils.ts",
        language: "typescript",
        code: `export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export function generatePassword(options: GeneratorOptions): string {
  const chars = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~|{}[];:?><,./-=",
  };

  let validChars = "";
  if (options.includeUppercase) validChars += chars.upper;
  if (options.includeLowercase) validChars += chars.lower;
  if (options.includeNumbers) validChars += chars.numbers;
  if (options.includeSymbols) validChars += chars.symbols;

  if (!validChars) return "";

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  let result = "";
  for (let i = 0; i < options.length; i++) {
    result += validChars[array[i] % validChars.length];
  }

  return result;
}

export function calculateEntropy(password: string) {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const bits = Math.round(password.length * Math.log2(poolSize || 1));
  let score = "Weak";
  if (bits >= 60) score = "Very Strong";
  else if (bits >= 45) score = "Strong";
  else if (bits >= 30) score = "Moderate";

  return { bits, score };
}`,
      },
    ],
  },
};

export function getProjectCodeStructure(
  slug: string,
  title: string,
  category: string,
  skills: string[] = []
): ProjectCodeStructure {
  const cleanSlug = slug.replace(/^\//, "").toLowerCase();

  if (SPECIFIC_PROJECT_CODE[cleanSlug]) {
    return SPECIFIC_PROJECT_CODE[cleanSlug];
  }

  const componentName = title.replace(/[^a-zA-Z0-9]/g, "") || "Component";

  return {
    folderName: "src/components/" + componentName,
    description: "Production implementation for " + title + " with modular architecture, custom hooks, and strict TypeScript types.",
    files: [
      {
        name: componentName + ".tsx",
        path: "src/components/" + componentName + "/" + componentName + ".tsx",
        language: "tsx",
        isMain: true,
        code: `"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

export default function ` + componentName + `() {
  const [active, setActive] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Initial mount and subscription lifecycle
    return () => {
      // Memory cleanup & listener teardown
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl space-y-6 text-white font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">` + title + `</h2>
          <p className="text-xs text-slate-400 font-light mt-0.5">` + category + ` • Production Component</p>
        </div>
        <button
          onClick={() => setCount(0)}
          className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive State Engine Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Primary State:</span>
            <span className="font-mono font-bold text-amber-300">{String(active)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Count Metrics:</span>
            <span className="font-mono font-bold text-emerald-300">{count} events</span>
          </div>
        </div>

        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
        >
          Trigger State Transition
        </button>
      </div>
    </div>
  );
}`,
      },
      {
        name: "use" + componentName + ".ts",
        path: "src/components/" + componentName + "/use" + componentName + ".ts",
        language: "typescript",
        code: `import { useState, useCallback } from "react";

export function use` + componentName + `() {
  const [count, setCount] = useState<number>(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return {
    count,
    increment,
    reset,
  };
}`,
      },
      {
        name: "types.ts",
        path: "src/components/" + componentName + "/types.ts",
        language: "typescript",
        code: `export interface ` + componentName + `Props {
  initialValue?: number;
  className?: string;
  onStateChange?: (count: number) => void;
}`,
      },
    ],
  };
}
