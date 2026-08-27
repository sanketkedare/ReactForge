import type { Metadata } from "next";
import ToDo from "@/components/To-Do_List/ToDo";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "To-Do List (CRUD) — Junior SDE-1 React Challenge",
  description: "Complete CRUD task management in React 19 with optimistic updates, status categories, and localStorage sync.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/todo-list",
  },
  openGraph: {
    title: "To-Do List (CRUD) — Junior SDE-1 React Challenge | ReactForge",
    description: "Complete CRUD task management in React 19 with optimistic updates, status categories, and localStorage sync.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "To-Do List — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function TodoListPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="To-Do List (CRUD Operations)"
        description="Create, read, update, and delete tasks with status categories (Upcoming, In Progress, Completed, Deleted) and localStorage persistence."
        level="beginner"
        category="Productivity"
        concepts={["Array in State (filter/map)", "localStorage Persistence", "Form Submission", "Dynamic IDs"]}
        estimatedMinutes={30}
      />
      <div className="w-full py-4">
        <ToDo />
      </div>
    </div>
  );
}
