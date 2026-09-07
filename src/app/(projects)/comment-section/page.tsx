import type { Metadata } from "next";
import Comment from "@/components/Comment_Section/Comment";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

export const metadata: Metadata = {
  title: "Nested Comment System — Mid-Level SDE-2 React Challenge",
  description: "Threaded comment system in React 19 with user switching, recursive nesting, and upvote/downvote state.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/comment-section",
  },
  openGraph: {
    title: "Nested Comment System — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Threaded comment system in React 19 with user switching, recursive nesting, and upvote/downvote state.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Nested Comment System — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function CommentSectionPage() {
  return (
    <DynamicTaskClient slug="comment-section">
      <div className="w-full py-4">
        <Comment />
      </div>
    </DynamicTaskClient>
  );
}
