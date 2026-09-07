import type { Metadata } from "next";
import DiwaliLights from "@/components/Diwali_Lights/DiwaliLights";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

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
    <DynamicTaskClient slug="diwali-lights">
      <div className="w-full py-4">
        <DiwaliLights />
      </div>
    </DynamicTaskClient>
  );
}
