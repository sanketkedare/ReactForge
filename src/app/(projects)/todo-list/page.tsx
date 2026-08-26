import type { Metadata } from "next";
import ToDo from "@/components/To-Do_List/ToDo";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "To-Do List (CRUD) | React Tasks",
  description: "Task management with status categories and localStorage persistence.",
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
