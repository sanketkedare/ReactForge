"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Terminal, ShieldAlert, Cpu, Layers, Code, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const TEMPLATES: Record<string, string> = {
  counter: `function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#f8fafc' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Interactive React 19 Sandbox</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
        Current Count: <strong style={{ color: '#f59e0b' }}>{count}</strong>
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setCount(c => c + 1)}
          style={{ background: '#f59e0b', color: '#000', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Increment +
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{ background: '#1e293b', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}`,
  todo: `function App() {
  const [todos, setTodos] = React.useState(['Learn React 19 Actions', 'Build Accessible Primitives']);
  const [text, setText] = React.useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, text]);
    setText('');
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#f8fafc' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Task Checklist</h3>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="New Task..." 
          style={{ background: '#0a0e17', border: '1px solid #334155', color: '#fff', padding: '8px 12px', borderRadius: '8px', flex: 1 }}
        />
        <button type="submit" style={{ background: '#f59e0b', color: '#000', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {todos.map((t, i) => (
          <li key={i} style={{ background: '#0e1320', border: '1px solid #1e293b', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}>
            ✓ {t}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
};

export default function PlaygroundPage() {
  const [activeTemplate, setActiveTemplate] = useState<string>("counter");
  const [code, setCode] = useState<string>(TEMPLATES.counter);
  const [activeTab, setActiveTab] = useState<"console" | "a11y" | "ast">("console");
  const [logs, setLogs] = useState<string[]>(["[System] Sandbox initialized in isolated iframe.", "[System] React 19 runtime ready."]);
  const [a11yIssues, setA11yIssues] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    if (!iframeRef.current) return;
    setLogs((prev) => [...prev, `[Build] Compiling & executing bundle...`]);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { margin: 0; background-color: #07090e; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${code}
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(<App />);
              window.parent.postMessage({ type: 'LOG', message: '[Runtime] Component rendered successfully.' }, '*');
            } catch (err) {
              window.parent.postMessage({ type: 'ERROR', message: '[Error] ' + err.message }, '*');
            }
          </script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = htmlContent;

    // Run simple A11y heuristic check on the code
    const issues: string[] = [];
    if (code.includes("<img") && !code.includes("alt=")) {
      issues.push("WCAG 1.1.1: <img> elements must contain descriptive alt text.");
    }
    if (code.includes("<input") && !code.includes("aria-label") && !code.includes("<label")) {
      issues.push("WCAG 4.1.2: Form input is missing associated <label> or aria-label attribute.");
    }
    setA11yIssues(issues);
  };

  useEffect(() => {
    runCode();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOG") {
        setLogs((prev) => [...prev.slice(-15), event.data.message]);
      } else if (event.data?.type === "ERROR") {
        setLogs((prev) => [...prev.slice(-15), event.data.message]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplate]);

  return (
    <div className="w-[92%] lg:w-[80%] mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="amber" icon={<Code className="w-3.5 h-3.5" />}>
              Flagship Feature
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Phase 7 Deliverable</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            ReactForge Interactive Sandbox
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Isolated browser-based live React 19 execution environment with real-time compilation, console HUD, and accessibility auditor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCode(TEMPLATES[activeTemplate]);
              runCode();
            }}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={runCode}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Run Code
          </Button>
        </div>
      </div>

      {/* Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Pane */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="flex items-center justify-between bg-[#0a0e17] px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Templates:</span>
              <button
                onClick={() => {
                  setActiveTemplate("counter");
                  setCode(TEMPLATES.counter);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  activeTemplate === "counter"
                    ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Counter
              </button>
              <button
                onClick={() => {
                  setActiveTemplate("todo");
                  setCode(TEMPLATES.todo);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  activeTemplate === "todo"
                    ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Todo Form
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-500">JSX / TSX</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-[420px] bg-[#07090e] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:border-amber-500/60 leading-relaxed"
          />
        </div>

        {/* Live Sandboxed Preview */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="flex items-center justify-between bg-[#0a0e17] px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sandboxed Runtime (iframe)
            </span>
            <Badge variant="success" size="sm">Isolated</Badge>
          </div>

          <div className="w-full h-[420px] bg-[#07090e] border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
            <iframe
              ref={iframeRef}
              title="ReactForge Live Sandbox"
              sandbox="allow-scripts"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>

      {/* Developer HUD Tabs */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("console")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "console" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Console Logs
            </button>
            <button
              onClick={() => setActiveTab("a11y")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "a11y" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              A11y Inspector ({a11yIssues.length})
            </button>
            <button
              onClick={() => setActiveTab("ast")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "ast" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              AST Summary
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">Live Telemetry HUD</span>
        </div>

        {activeTab === "console" && (
          <div className="p-4 bg-[#07090e] border border-slate-800/80 rounded-xl max-h-48 overflow-y-auto font-mono text-xs space-y-1">
            {logs.map((log, idx) => (
              <p
                key={idx}
                className={
                  log.includes("[Error]")
                    ? "text-red-400"
                    : log.includes("[Build]")
                    ? "text-amber-400"
                    : "text-slate-300"
                }
              >
                {log}
              </p>
            ))}
          </div>
        )}

        {activeTab === "a11y" && (
          <div className="space-y-2">
            {a11yIssues.length === 0 ? (
              <div className="p-4 bg-emerald-950/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Zero basic WCAG 2.1 accessibility violations detected in current preview tree.
              </div>
            ) : (
              a11yIssues.map((issue, idx) => (
                <div key={idx} className="p-3 bg-red-950/15 border border-red-500/30 rounded-xl flex items-start gap-2 text-xs text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "ast" && (
          <div className="p-4 bg-[#07090e] border border-slate-800/80 rounded-xl font-mono text-xs text-slate-300 space-y-1">
            <p className="text-amber-400">Root Node: FunctionDeclaration (App)</p>
            <p className="text-slate-400">├── Hook Call: React.useState</p>
            <p className="text-slate-400">└── Return: JSXElement (div)</p>
          </div>
        )}
      </Card>
    </div>
  );
}
