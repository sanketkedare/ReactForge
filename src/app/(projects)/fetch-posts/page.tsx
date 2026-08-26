import type { Metadata } from "next";
import FetchPosts from "@/components/Fetch_Posts/FetchPosts";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Async Post Fetcher API | React Tasks",
  description: "REST API data fetching with search filtering and details preview.",
};

export default function FetchPostsPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Async Post Fetcher API"
        description="Fetch live REST API data from JSONPlaceholder with loading states, error handling, search filtering, and expand/collapse details."
        level="intermediate"
        category="Async API & Data"
        concepts={["async/await in useEffect", "Loading & Error States", "REST API Fetching", "Search Filtering"]}
        estimatedMinutes={35}
      />
      <div className="w-full py-4">
        <FetchPosts />
      </div>
    </div>
  );
}
