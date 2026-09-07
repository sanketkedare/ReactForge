import type { Metadata } from "next";
import DragBall from "@/components/Drag_Ball/DragBall";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

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
    <DynamicTaskClient slug="drag-ball">
      <div className="w-full flex justify-center py-4">
        <DragBall />
      </div>
    </DynamicTaskClient>
  );
}
