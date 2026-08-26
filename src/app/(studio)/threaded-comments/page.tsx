import type { Metadata } from "next";
import ThreadedComments from "@/components/studio/ThreadedComments/ThreadedComments";

export const metadata: Metadata = {
  title: "Recursive Threaded Comments & Multi-Tab Sync | React Architecture Studio",
  description:
    "Infinite-depth recursive comment tree with sub-branch memoization, @ mention autocomplete, and zero-server BroadcastChannel multi-tab IPC synchronization.",
};

export default function ThreadedCommentsPage() {
  return <ThreadedComments />;
}
