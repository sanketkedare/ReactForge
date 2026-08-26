import type { Metadata } from "next";
import EventPipeline from "@/components/studio/EventPipeline/EventPipeline";

export const metadata: Metadata = {
  title: "Event Pipeline & Concurrency Stream | React Architecture Studio",
  description:
    "High-frequency reactive event stream oscilloscope comparing raw execution, debouncing edges, throttle intervals, RAF, and React 19 concurrent transitions.",
};

export default function EventPipelinePage() {
  return <EventPipeline />;
}
