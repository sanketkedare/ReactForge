import type { Metadata } from "next";
import DiwaliGifts from "@/components/Diwali_Gifts/DiwaliGifts";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Diwali Gift Shuffler & Allocator — Mid-Level SDE-2 React Challenge",
  description: "Randomized Fisher-Yates array shuffling algorithm visualization and gift distribution in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/diwali-gifts",
  },
  openGraph: {
    title: "Diwali Gift Shuffler & Allocator — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Randomized Fisher-Yates array shuffling algorithm visualization and gift distribution in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Diwali Gift Shuffler — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function DiwaliGiftsPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Diwali Gift Shuffler & Allocator"
        description="Dynamic gift distribution system with person addition, randomized Fisher-Yates array shuffling algorithms, and allocation table generation."
        level="intermediate"
        category="Algorithms & State"
        concepts={["Fisher-Yates Shuffle Algorithm", "Dynamic Table Mapping", "Array Transformations"]}
        estimatedMinutes={30}
      />
      <div className="w-full py-4">
        <DiwaliGifts />
      </div>
    </div>
  );
}
