import type { Metadata } from "next";
import ImageSlider from "@/components/Image_Slider/ImageSlider";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Image Carousel Slider — Junior SDE-1 React Challenge",
  description: "Framer Motion image slider in React 19 with auto-play interval, hover pause, and next/previous slide controls.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/image-slider",
  },
  openGraph: {
    title: "Image Carousel Slider — Junior SDE-1 React Challenge | ReactForge",
    description: "Framer Motion image slider in React 19 with auto-play interval, hover pause, and next/previous slide controls.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Image Carousel Slider — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
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
