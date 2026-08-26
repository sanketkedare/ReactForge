import type { Metadata } from "next";
import ImageSlider from "@/components/Image_Slider/ImageSlider";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Image Carousel Slider | React Tasks",
  description: "Framer Motion carousel with auto-slide timer, thumbnails, and next/prev controls.",
};

export default function ImageSliderPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Image Carousel Slider"
        description="Smooth sliding carousel with next/previous buttons, active thumbnail dots, and auto-play interval with hover pause."
        level="beginner"
        category="Media & Animation"
        concepts={["useEffect Timers", "Index Wrapping (% length)", "Framer Motion Transitions"]}
        estimatedMinutes={25}
      />
      <div className="w-full flex justify-center py-4">
        <ImageSlider />
      </div>
    </div>
  );
}
