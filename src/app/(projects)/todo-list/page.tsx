import type { Metadata } from "next";
import ToDo from "@/components/To-Do_List/ToDo";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

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
    <DynamicTaskClient slug="todo-list">
      <ToDo />
    </DynamicTaskClient>
  );
}
