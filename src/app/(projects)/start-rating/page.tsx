import type { Metadata } from "next";
import StartRating from "@/components/Start_Rating/StartRating";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Star Rating Component — Junior SDE-1 React Challenge",
  description: "Interactive star rating with dynamic mood emoji feedback and hover effects.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/star-rating",
  },
  openGraph: {
    title: "Star Rating Component — Junior SDE-1 React Challenge | ReactForge",
    description: "Interactive star rating with dynamic mood emoji feedback and hover effects.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Star Rating — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function StartRatingPage() {
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
