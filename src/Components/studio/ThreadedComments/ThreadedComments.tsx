"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { MetricCard } from "../ui/MetricCard";
import { ThreadedComment, BroadcastPayload } from "@/types/studio";
import {
  MessageSquare,
  CornerDownRight,
  ChevronDown,
  ChevronRight,
  ThumbsUp,
  Radio,
  Send,
  Sparkles,
  Trash2,
  Share2,
} from "lucide-react";
import { useProfiler } from "@/context/ProfilerContext";
import ProjectHeader from "@/components/common/ProjectHeader";

const INITIAL_COMMENTS: ThreadedComment[] = [
  {
    id: "c-1",
    author: "Alex Rivera",
    role: "Staff Infrastructure Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    content: "Why are we rendering 100k items in React instead of paginating? Let's benchmark the DOM memory footprint.",
    timestamp: Date.now() - 3600000 * 2,
    upvotes: 42,
    parentId: null,
    children: [
      {
        id: "c-1-1",
        author: "Marcus Chen",
        role: "Frontend Architect",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        content: "Pagination requires network roundtrips. With @tanstack/react-virtual, we only maintain 15 DOM nodes in the viewport while keeping the full 100k state local in memory/IndexedDB.",
        timestamp: Date.now() - 3600000,
        upvotes: 28,
        parentId: "c-1",
        children: [
          {
            id: "c-1-1-1",
            author: "Elena Rostova",
            role: "Principal Systems Engineer",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
            content: "Exactly. Plus, with BroadcastChannel synchronization, cross-tab mutations sync in sub-millisecond local IPC time without hitting the server.",
            timestamp: Date.now() - 1800000,
            upvotes: 19,
            parentId: "c-1-1",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "c-2",
    author: "Sarah Connor",
    role: "Lead Performance Tester",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    content: "Open this page in a second browser window side-by-side. Post a reply or upvote and observe instant multi-tab sync without WebSockets or polling!",
    timestamp: Date.now() - 900000,
    upvotes: 35,
    parentId: null,
    children: [],
  },
];

const MENTION_USERS = [
  { name: "Alex Rivera", handle: "@alex", role: "Staff Engineer" },
  { name: "Marcus Chen", handle: "@marcus", role: "Architect" },
  { name: "Elena Rostova", handle: "@elena", role: "Principal Engineer" },
  { name: "Sarah Connor", handle: "@sarah", role: "Performance Lead" },
  { name: "Devin AI", handle: "@devin", role: "Autonomous Agent" },
];

export const ThreadedComments: React.FC = () => {
  const { recordRender } = useProfiler();
  const [comments, setComments] = useState<ThreadedComment[]>(INITIAL_COMMENTS);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [newRootText, setNewRootText] = useState<string>("");
  const [channelConnected, setChannelConnected] = useState<boolean>(false);
  const [remoteEvents, setRemoteEvents] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Mention state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIdx, setMentionIdx] = useState<number>(0);

  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const clientId = useRef<string>(`tab-${Math.random().toString(36).substring(2, 7)}`);

  // Count total recursive comments
  const countAllComments = (list: ThreadedComment[]): number => {
    return list.reduce((acc, c) => acc + 1 + countAllComments(c.children), 0);
  };

  // Helper to deep insert
  const addNestedComment = (
    list: ThreadedComment[],
    parentId: string | null,
    newComment: ThreadedComment
  ): ThreadedComment[] => {
    if (!parentId) return [newComment, ...list];

    return list.map((item) => {
      if (item.id === parentId) {
        return { ...item, children: [...item.children, newComment] };
      }
      if (item.children.length > 0) {
        return {
          ...item,
          children: addNestedComment(item.children, parentId, newComment),
        };
      }
      return item;
    });
  };

  // Helper to deep upvote
  const updateNestedVote = (list: ThreadedComment[], commentId: string, delta: number): ThreadedComment[] => {
    return list.map((c) => {
      if (c.id === commentId) {
        return { ...c, upvotes: Math.max(0, c.upvotes + delta) };
      }
      if (c.children.length > 0) {
        return { ...c, children: updateNestedVote(c.children, commentId, delta) };
      }
      return c;
    });
  };

  // Helper to deep delete
  const deleteNestedComment = (list: ThreadedComment[], commentId: string): ThreadedComment[] => {
    return list
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        children: deleteNestedComment(c.children, commentId),
      }));
  };

  // Helper to toggle collapse
  const toggleCollapse = (list: ThreadedComment[], commentId: string): ThreadedComment[] => {
    return list.map((c) => {
      if (c.id === commentId) {
        return { ...c, isCollapsed: !c.isCollapsed };
      }
      if (c.children.length > 0) {
        return { ...c, children: toggleCollapse(c.children, commentId) };
      }
      return c;
    });
  };

  // BroadcastChannel Setup for Multi-Tab Synchronization
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel("studio_threaded_comments");
    broadcastRef.current = channel;
    setChannelConnected(true);

    channel.onmessage = (event: MessageEvent<BroadcastPayload>) => {
      const { type, senderId, data } = event.data;
      if (senderId === clientId.current) return; // ignore self

      if (type === "NEW_COMMENT") {
        setComments((prev) => addNestedComment(prev, data.parentId, data.comment));
        setRemoteEvents((prev) => [
          `New comment from ${data.comment.author} via ${senderId}`,
          ...prev.slice(0, 4),
        ]);
      } else if (type === "UPVOTE") {
        setComments((prev) => updateNestedVote(prev, data.commentId, data.delta));
        setRemoteEvents((prev) => [
          `Vote on ${data.commentId} synced from ${senderId}`,
          ...prev.slice(0, 4),
        ]);
      } else if (type === "DELETE_COMMENT") {
        setComments((prev) => deleteNestedComment(prev, data.commentId));
        setRemoteEvents((prev) => [
          `Comment deleted via ${senderId}`,
          ...prev.slice(0, 4),
        ]);
      } else if (type === "TYPING") {
        setTypingUser(data.author);
        setTimeout(() => setTypingUser(null), 2500);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const submitComment = (parentId: string | null, text: string) => {
    if (!text.trim()) return;

    const newComment: ThreadedComment = {
      id: `c-${Date.now().toString(36)}`,
      author: "Senior Architect (You)",
      role: "Studio Reviewer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      content: text.trim(),
      timestamp: Date.now(),
      upvotes: 1,
      parentId,
      children: [],
    };

    setComments((prev) => addNestedComment(prev, parentId, newComment));
    setActiveReplyId(null);
    setReplyText("");
    setNewRootText("");

    // Broadcast across tabs
    broadcastRef.current?.postMessage({
      type: "NEW_COMMENT",
      senderId: clientId.current,
      data: { parentId, comment: newComment },
      timestamp: Date.now(),
    });
  };

  const handleVote = (commentId: string, delta: number) => {
    setComments((prev) => updateNestedVote(prev, commentId, delta));
    broadcastRef.current?.postMessage({
      type: "UPVOTE",
      senderId: clientId.current,
      data: { commentId, delta },
      timestamp: Date.now(),
    });
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => deleteNestedComment(prev, commentId));
    broadcastRef.current?.postMessage({
      type: "DELETE_COMMENT",
      senderId: clientId.current,
      data: { commentId },
      timestamp: Date.now(),
    });
  };

  const handleTextChange = (text: string, setter: (val: string) => void) => {
    setter(text);

    // Broadcast typing indicator
    broadcastRef.current?.postMessage({
      type: "TYPING",
      senderId: clientId.current,
      data: { author: "Colleague on other tab" },
      timestamp: Date.now(),
    });

    // Check @ mention
    const lastWord = text.split(/\s/).pop() || "";
    if (lastWord.startsWith("@")) {
      setMentionQuery(lastWord.slice(1));
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (handle: string, currentText: string, setter: (val: string) => void) => {
    const words = currentText.split(/\s/);
    words.pop();
    const updated = [...words, `${handle} `].join(" ");
    setter(updated);
    setMentionQuery(null);
  };

  const filteredMentions = MENTION_USERS.filter((u) =>
    mentionQuery ? u.name.toLowerCase().includes(mentionQuery.toLowerCase()) || u.handle.toLowerCase().includes(mentionQuery.toLowerCase()) : true
  );

  return (
    <React.Profiler
      id="ThreadedCommentsStudio"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) =>
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime)
      }
    >
      <div>
        <ProjectHeader
          title="Recursive Infinite Comment Tree & Multi-Tab Broadcast Sync"
          description="Hierarchical recursive tree rendering with memoized sub-branches, inline @ mention autocomplete, and zero-server multi-tab synchronization via the browser BroadcastChannel API."
          level="expert"
          category="Tree Data Structures & IPC"
          concepts={["Recursive Component Rendering", "BroadcastChannel API (Cross-Tab IPC)", "Subtree Memoization", "@ Mention Autocomplete"]}
          estimatedMinutes={50}
        />
        <div className="w-full px-6 lg:px-12 pb-12 space-y-8">
        {/* Tab ID Pill */}
        <div className="flex justify-end items-center gap-2">
          <Badge variant="success" className="px-3 py-1.5 font-mono text-xs flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Tab ID: {clientId.current}
          </Badge>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Total Comments in Tree"
            value={countAllComments(comments)}
            icon={<MessageSquare className="w-4 h-4 text-indigo-400" />}
            status="good"
          />
          <MetricCard
            label="Broadcast IPC Status"
            value={channelConnected ? "Connected" : "Offline"}
            subValue="Zero-Latency Cross-Tab IPC"
            icon={<Radio className="w-4 h-4 text-emerald-400" />}
            status="good"
          />
          <MetricCard
            label="Recursive Max Depth"
            value="Infinite"
            subValue="Memoized Subtrees"
            icon={<CornerDownRight className="w-4 h-4 text-purple-400" />}
            status="neutral"
          />
          <MetricCard
            label="Typing Stream"
            value={typingUser ? "Active" : "Quiet"}
            subValue={typingUser ? `${typingUser} is typing...` : "Listening for tabs"}
            icon={<Sparkles className="w-4 h-4 text-amber-400" />}
            status={typingUser ? "warning" : "neutral"}
          />
        </div>

        {/* Multi-Tab Remote Broadcast Activity Feed */}
        {remoteEvents.length > 0 && (
          <Card className="border-indigo-900/40 bg-indigo-950/20 p-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
              <Share2 className="w-3.5 h-3.5 animate-spin" />
              <span className="font-bold uppercase tracking-wider">Live Cross-Tab Sync Stream:</span>
              <span className="truncate">{remoteEvents[0]}</span>
            </div>
          </Card>
        )}

        {/* New Root Comment Box */}
        <Card className="border-slate-800 relative">
          <CardHeader>
            <CardTitle className="text-base">Start an Architectural Discussion</CardTitle>
            <CardDescription className="text-xs">
              Type <strong className="text-indigo-400">@</strong> to mention colleagues. Submissions immediately broadcast across all open browser windows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <textarea
                value={newRootText}
                onChange={(e) => handleTextChange(e.target.value, setNewRootText)}
                placeholder="Share architectural feedback, benchmark metrics, or tag @marcus / @elena..."
                className="w-full min-h-[90px] p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
              />

              {/* @ Mention Autocomplete Popup */}
              {mentionQuery !== null && filteredMentions.length > 0 && (
                <div className="absolute bottom-12 left-2 z-20 w-64 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-1.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1">
                    Mention Colleague:
                  </div>
                  {filteredMentions.map((user) => (
                    <button
                      key={user.handle}
                      onClick={() => insertMention(user.handle, newRootText, setNewRootText)}
                      className="w-full text-left p-2 rounded-lg hover:bg-indigo-600/30 text-xs flex items-center justify-between text-slate-200 transition-colors"
                    >
                      <span className="font-bold text-indigo-400">{user.handle}</span>
                      <span className="text-[10px] text-slate-400">{user.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => submitComment(null, newRootText)}
                disabled={!newRootText.trim()}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" /> Post Discussion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recursive Comment Tree */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Threaded Architecture Discussion ({countAllComments(comments)})
          </h2>

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                depth={0}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                replyText={replyText}
                setReplyText={setReplyText}
                onVote={handleVote}
                onDelete={handleDelete}
                onToggleCollapse={(id) => setComments((prev) => toggleCollapse(prev, id))}
                onSubmitReply={submitComment}
                onTextChange={handleTextChange}
                mentionQuery={mentionQuery}
                filteredMentions={filteredMentions}
                insertMention={insertMention}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </React.Profiler>
  );
};

// Recursive Node Component
interface CommentNodeProps {
  comment: ThreadedComment;
  depth: number;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  replyText: string;
  setReplyText: (val: string) => void;
  onVote: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onSubmitReply: (parentId: string, text: string) => void;
  onTextChange: (text: string, setter: (val: string) => void) => void;
  mentionQuery: string | null;
  filteredMentions: typeof MENTION_USERS;
  insertMention: (handle: string, currentText: string, setter: (val: string) => void) => void;
}

const CommentNode: React.FC<CommentNodeProps> = React.memo(
  ({
    comment,
    depth,
    activeReplyId,
    setActiveReplyId,
    replyText,
    setReplyText,
    onVote,
    onDelete,
    onToggleCollapse,
    onSubmitReply,
    onTextChange,
    mentionQuery,
    filteredMentions,
    insertMention,
  }) => {
    const isReplying = activeReplyId === comment.id;

    return (
      <div
        className={`relative ${
          depth > 0 ? "ml-4 sm:ml-8 pl-3 border-l-2 border-slate-800/80 mt-3" : ""
        }`}
      >
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/80 hover:border-slate-700/80 transition-all text-xs space-y-3 shadow-md">
          {/* Author Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">
                    {comment.author}
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {comment.role}
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(comment.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Collapse / Expand Toggle */}
            {comment.children.length > 0 && (
              <button
                onClick={() => onToggleCollapse(comment.id)}
                className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-slate-800"
              >
                {comment.isCollapsed ? (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>Expand ({comment.children.length})</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Collapse</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Comment Body */}
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Actions Strip */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote(comment.id, 1)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-bold">{comment.upvotes}</span>
              </button>

              <button
                onClick={() =>
                  setActiveReplyId(isReplying ? null : comment.id)
                }
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>

            <button
              onClick={() => onDelete(comment.id)}
              className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
              title="Delete Comment Subtree"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inline Reply Form */}
          {isReplying && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
              <div className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => onTextChange(e.target.value, setReplyText)}
                  placeholder={`Reply to ${comment.author}... Type @ for mentions`}
                  className="w-full min-h-[70px] p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 text-xs outline-none focus:border-indigo-500 resize-none"
                  autoFocus
                />

                {/* Autocomplete Popup */}
                {mentionQuery !== null && filteredMentions.length > 0 && (
                  <div className="absolute bottom-10 left-2 z-20 w-60 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-1.5 space-y-1">
                    {filteredMentions.map((user) => (
                      <button
                        key={user.handle}
                        onClick={() =>
                          insertMention(user.handle, replyText, setReplyText)
                        }
                        className="w-full text-left p-1.5 rounded hover:bg-indigo-600/30 text-xs flex items-center justify-between text-slate-200"
                      >
                        <span className="font-bold text-indigo-400">
                          {user.handle}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {user.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveReplyId(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onSubmitReply(comment.id, replyText)}
                  disabled={!replyText.trim()}
                >
                  Post Reply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Recursive Child Nodes */}
        {!comment.isCollapsed && comment.children.length > 0 && (
          <div className="space-y-3">
            {comment.children.map((child) => (
              <CommentNode
                key={child.id}
                comment={child}
                depth={depth + 1}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                replyText={replyText}
                setReplyText={setReplyText}
                onVote={onVote}
                onDelete={onDelete}
                onToggleCollapse={onToggleCollapse}
                onSubmitReply={onSubmitReply}
                onTextChange={onTextChange}
                mentionQuery={mentionQuery}
                filteredMentions={filteredMentions}
                insertMention={insertMention}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

CommentNode.displayName = "CommentNode";

export default ThreadedComments;
