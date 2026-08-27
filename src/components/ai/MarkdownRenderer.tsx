"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Format inline markdown (bold, code, italics)
  const formatInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const codeMatch = remaining.match(/`([^`]+)`/);
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

      let firstMatch: { type: "code" | "bold"; match: RegExpMatchArray; index: number } | null = null;

      if (codeMatch && codeMatch.index !== undefined) {
        firstMatch = { type: "code", match: codeMatch, index: codeMatch.index };
      }

      if (boldMatch && boldMatch.index !== undefined) {
        if (!firstMatch || boldMatch.index < firstMatch.index) {
          firstMatch = { type: "bold", match: boldMatch, index: boldMatch.index };
        }
      }

      if (!firstMatch) {
        parts.push(<span key={keyIdx++}>{remaining}</span>);
        break;
      }

      if (firstMatch.index > 0) {
        parts.push(<span key={keyIdx++}>{remaining.substring(0, firstMatch.index)}</span>);
      }

      if (firstMatch.type === "code") {
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[11px] border border-slate-800"
          >
            {firstMatch.match[1]}
          </code>
        );
      } else if (firstMatch.type === "bold") {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-amber-100">
            {firstMatch.match[1]}
          </strong>
        );
      }

      remaining = remaining.substring(firstMatch.index + firstMatch.match[0].length);
    }

    return parts;
  };

  // Render text lines, headings, lists
  const renderTextBlocks = (rawText: string) => {
    const lines = rawText.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

    const flushList = () => {
      if (currentList) {
        if (currentList.type === "ul") {
          elements.push(
            <ul key={`ul-${elements.length}`} className="space-y-1.5 my-2 pl-2">
              {currentList.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200 text-xs leading-relaxed">
                  <span className="text-amber-400 font-bold text-sm leading-none mt-0.5">•</span>
                  <div className="flex-1">{formatInline(item)}</div>
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`ol-${elements.length}`} className="space-y-1.5 my-2 pl-2">
              {currentList.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200 text-xs leading-relaxed">
                  <span className="text-amber-400 font-mono text-xs font-bold mt-0.5">{idx + 1}.</span>
                  <div className="flex-1">{formatInline(item)}</div>
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        return;
      }

      // Heading 1 (# ...)
      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h3 key={lineIdx} className="text-base font-bold text-white mt-3 mb-1 tracking-tight">
            {formatInline(trimmed.replace("# ", ""))}
          </h3>
        );
        return;
      }

      // Heading 2 (## ...)
      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h4 key={lineIdx} className="text-sm font-bold text-amber-300 mt-3 mb-1">
            {formatInline(trimmed.replace("## ", ""))}
          </h4>
        );
        return;
      }

      // Heading 3 (### ...)
      if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h5 key={lineIdx} className="text-xs font-bold text-amber-200 uppercase tracking-wider mt-2.5 mb-1">
            {formatInline(trimmed.replace("### ", ""))}
          </h5>
        );
        return;
      }

      // Horizontal line
      if (trimmed === "---" || trimmed === "***") {
        flushList();
        elements.push(<hr key={lineIdx} className="border-slate-800/80 my-3" />);
        return;
      }

      // Bullet item (* or -)
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const text = trimmed.replace(/^[\*\-]\s+/, "");
        if (!currentList || currentList.type !== "ul") {
          flushList();
          currentList = { type: "ul", items: [text] };
        } else {
          currentList.items.push(text);
        }
        return;
      }

      // Numbered list item (1. ...)
      if (/^\d+\.\s+/.test(trimmed)) {
        const text = trimmed.replace(/^\d+\.\s+/, "");
        if (!currentList || currentList.type !== "ol") {
          flushList();
          currentList = { type: "ol", items: [text] };
        } else {
          currentList.items.push(text);
        }
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={lineIdx} className="text-xs text-slate-200 font-light leading-relaxed my-1">
          {formatInline(line)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  // Parse code blocks vs text blocks
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const blocks: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      blocks.push(
        <div key={`text-${lastIndex}`} className="space-y-1">
          {renderTextBlocks(textBefore)}
        </div>
      );
    }

    const language = match[1] || "tsx";
    const code = match[2].trim();

    blocks.push(
      <CodeBlockSnippet key={`code-${match.index}`} language={language} code={code} />
    );

    lastIndex = match.index + match[0].length;
  }

  const textAfter = content.substring(lastIndex);
  if (textAfter.trim()) {
    blocks.push(
      <div key={`text-${lastIndex}`} className="space-y-1">
        {renderTextBlocks(textAfter)}
      </div>
    );
  }

  return <div className="space-y-2 font-sans">{blocks}</div>;
};

const CodeBlockSnippet: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl font-mono">
      {/* Code Header */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase text-[10px] font-bold text-amber-300">{language || "tsx"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-sans font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-xs text-amber-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default MarkdownRenderer;
