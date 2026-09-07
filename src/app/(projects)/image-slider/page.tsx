import type { Metadata } from "next";
import ImageSlider from "@/components/Image_Slider/ImageSlider";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

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
    <DynamicTaskClient slug="image-slider">
      <ImageSlider />
    </DynamicTaskClient>
  );
}
