import type { Metadata } from "next";
import DiwaliLights from "@/components/Diwali_Lights/DiwaliLights";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Diwali Lights Pattern Animator | React Tasks",
  description: "Dynamic light animations with speed and pattern adjustments.",
};

export default function DiwaliLightsPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Diwali Lights Pattern Animator"
        description="Create festive multi-colored light animations with speed controllers, blinking/fading patterns, and dynamic interval generation."
        level="intermediate"
        category="Intervals & Animation"
        concepts={["setInterval Lifecycle", "CSS Keyframe Transitions", "Custom Hooks", "Speed Multipliers"]}
        estimatedMinutes={25}
      />
      <div className="w-full py-4">
        <DiwaliLights />
      </div>
    </div>
  );
}
