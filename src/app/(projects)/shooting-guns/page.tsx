import type { Metadata } from "next";
import ShootingGuns from "@/components/Shooting_Guns/ShootingGuns";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Event Rate Limiter (Debounce vs Throttle) | React Tasks",
  description: "Visual comparison between standard execution, debouncing, and throttling.",
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
