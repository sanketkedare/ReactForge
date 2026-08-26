import type { Metadata } from "next";
import VirtualKanban from "@/components/studio/VirtualKanban/VirtualKanban";

export const metadata: Metadata = {
  title: "100k Virtualized Kanban & Optimistic Engine | React Architecture Studio",
  description:
    "100,000 in-memory items windowed via @tanstack/react-virtual with IndexedDB persistence and network chaos rollback simulation.",
};

export default function VirtualKanbanPage() {
  return <VirtualKanban />;
}
