import type { Metadata } from "next";
import QueryInspectorWrapper from "@/components/studio/QueryInspector/QueryInspector";

export const metadata: Metadata = {
  title: "TanStack Query v5 Cache & Chaos Inspector | React Architecture Studio",
  description:
    "Server state management with live visual query cache exploration, staleTime/gcTime timers, optimistic mutations, and backend failure chaos injection.",
};

export default function QueryInspectorPage() {
  return <QueryInspectorWrapper />;
}
