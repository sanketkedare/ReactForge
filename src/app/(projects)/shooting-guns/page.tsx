import type { Metadata } from "next";
import ShootingGuns from "@/components/Shooting_Guns/ShootingGuns";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Event Rate Limiter (Debounce vs Throttle) — Mid-Level SDE-2 Challenge",
  description: "Visual simulation demonstrating unthrottled clicks, custom useDebounce, and useThrottle hooks in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/shooting-guns",
  },
  openGraph: {
    title: "Event Rate Limiter (Debounce vs Throttle) — Mid-Level SDE-2 Challenge | ReactForge",
    description: "Visual simulation demonstrating unthrottled clicks, custom useDebounce, and useThrottle hooks in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Event Rate Limiter — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function ShootingGunsPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Event Rate Limiter (Debounce vs Throttle)"
        description="Visual simulation demonstrating the difference between unthrottled rapid clicks, debounced quiet intervals, and throttled periodic executions."
        level="intermediate"
        category="Performance & Timers"
        concepts={["Custom useDebounce Hook", "Custom useThrottle Hook", "useRef for Timers", "Rate Limiting"]}
        estimatedMinutes={30}
      />
      <div className="w-full py-4">
        <ShootingGuns />
      </div>
    </div>
  );
}
