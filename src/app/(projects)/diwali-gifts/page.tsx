import type { Metadata } from "next";
import DiwaliGifts from "@/components/Diwali_Gifts/DiwaliGifts";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Diwali Gift Shuffler | React Tasks",
  description: "Gift allocation and array shuffling algorithm visualization.",
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
