import type { Metadata } from "next";
import ProfilerLab from "@/components/studio/ProfilerLab/ProfilerLab";

export const metadata: Metadata = {
  title: "Real-Time Profiler Lab & Optimization Switch | React Architecture Studio",
  description:
    "Quantitative benchmark measuring React commit durations and component re-render cascades across 600 interactive nodes under unmemoized vs memoized architectures.",
};

export default function ProfilerLabPage() {
  return <ProfilerLab />;
}
