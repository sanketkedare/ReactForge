import type { Metadata } from "next";
import DragBall from "@/components/Drag_Ball/DragBall";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Drag the Ball Physics — Junior SDE-1 React Challenge",
  description: "Interactive draggable element in React 19 with container boundary detection and coordinate math.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/drag-ball",
  },
  openGraph: {
    title: "Drag the Ball Physics — Junior SDE-1 React Challenge | ReactForge",
    description: "Interactive draggable element in React 19 with container boundary detection and coordinate math.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Drag the Ball Physics — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function DragBallPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Drag the Ball Physics"
        description="Interactive draggable physics element bounded inside container constraints using mouse coordinates and touch events."
        level="beginner"
        category="Physics & Mouse Events"
        concepts={["Mouse Event Coordinates (clientX/Y)", "Bounding Client Rect", "CSS Transforms"]}
        estimatedMinutes={20}
      />
      <div className="w-full flex justify-center py-4">
        <DragBall />
      </div>
    </div>
  );
}
