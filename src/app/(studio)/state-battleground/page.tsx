import type { Metadata } from "next";
import StateBattleground from "@/components/studio/StateBattleground/StateBattleground";

export const metadata: Metadata = {
  title: "State Management Battleground | React Architecture Studio",
  description:
    "Live architectural benchmark comparing React Context, Redux Toolkit, Zustand, and Signals across a 150-node real-time matrix with re-render metrics.",
};

export default function StateBattlegroundPage() {
  return <StateBattleground />;
}
