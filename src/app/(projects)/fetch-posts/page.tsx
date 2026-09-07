import type { Metadata } from "next";
import FetchPosts from "@/components/Fetch_Posts/FetchPosts";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

export const metadata: Metadata = {
  title: "Async Post Fetcher REST API — Mid-Level SDE-2 React Challenge",
  description: "REST API data fetching in React 19 with race-condition prevention, loading skeletons, and search filtering.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/fetch-posts",
  },
  openGraph: {
    title: "Async Post Fetcher REST API — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "REST API data fetching in React 19 with race-condition prevention, loading skeletons, and search filtering.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Async Post Fetcher REST API — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function FetchPostsPage() {
  return (
    <DynamicTaskClient slug="fetch-posts">
      <div className="w-full py-4">
        <FetchPosts />
      </div>
    </DynamicTaskClient>
  );
}
