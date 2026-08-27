import type { Metadata } from "next";
import DiwaliLights from "@/components/Diwali_Lights/DiwaliLights";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Diwali Lights Pattern Animator — Mid-Level SDE-2 React Challenge",
  description: "Dynamic multi-color light animations in React 19 with speed controllers and pattern interval generation.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/diwali-lights",
  },
  openGraph: {
    title: "Diwali Lights Pattern Animator — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Dynamic multi-color light animations in React 19 with speed controllers and pattern interval generation.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Diwali Lights — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
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
