import type { Metadata } from "next";
import StartRating from "@/components/Start_Rating/StartRating";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Star Rating Component | React Tasks",
  description: "Interactive star rating with dynamic mood emoji feedback and hover effects.",
};

export default function StarRatingAliasPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Star Rating Component"
        description="Interactive rating widget updating star fill highlights on mouse hover and persisting score selection with mood feedback."
        level="beginner"
        category="UI Components"
        concepts={["Hover State (onMouseEnter/Leave)", "Conditional CSS Classes", "Custom SVGs"]}
        estimatedMinutes={15}
      />
      <div className="w-full flex justify-center py-4">
        <StartRating />
      </div>
    </div>
  );
}
