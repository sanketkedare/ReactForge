import type { Metadata } from "next";
import Comment from "@/components/Comment_Section/Comment";
import ProjectHeader from "@/components/common/ProjectHeader";

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
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Interactive Comment System"
        description="Multi-user commenting platform with user profile switching, article reading, likes/dislikes counters, and reply nesting."
        level="intermediate"
        category="Social & Nesting"
        concepts={["Context Switching", "Nested Array Mutations", "Upvoting Heuristics"]}
        estimatedMinutes={35}
      />
      <div className="w-full py-4">
        <Comment />
      </div>
    </div>
  );
}
