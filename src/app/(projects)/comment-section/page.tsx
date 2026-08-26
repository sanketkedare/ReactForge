import type { Metadata } from "next";
import Comment from "@/components/Comment_Section/Comment";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Interactive Comment System | React Tasks",
  description: "User switching, article reading, likes/dislikes, and threaded comments.",
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
