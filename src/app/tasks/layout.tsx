import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "All 100 React Machine Coding Challenges — Full Curriculum",
  description:
    "Explore 100 hands-on React machine coding questions categorized by Junior (SDE-1), Mid-Level (SDE-2), and Senior/System Design (SDE-3). Live code sandboxes, automated tests, and AI interview evaluations.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/tasks",
  },
  openGraph: {
    title: "All 100 React Machine Coding Challenges — Full Curriculum | ReactForge",
    description:
      "Explore 100 hands-on React machine coding questions categorized by Junior (SDE-1), Mid-Level (SDE-2), and Senior/System Design (SDE-3). Live code sandboxes, automated tests, and AI interview evaluations.",
    url: "https://reactforge.sanketkedare.com/tasks",
    type: "website",
    images: [
      {
        url: "/ReactForge.png",
        width: 1200,
        height: 630,
        alt: "ReactForge Tasks Directory — 100 Coding Challenges",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All 100 React Machine Coding Challenges — Full Curriculum | ReactForge",
    description:
      "Explore 100 hands-on React machine coding questions categorized by Junior (SDE-1), Mid-Level (SDE-2), and Senior/System Design (SDE-3).",
    images: ["/ReactForge.png"],
    creator: "@sanketkedare",
  },
};

const tasksJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Round 1: Junior SDE-1 Curriculum (40 Tasks)",
      description: "Foundation frontend components, state manipulation, and core DOM behaviors.",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Round 2: Mid-Level SDE-2 Curriculum (35 Tasks)",
      description: "Custom React hooks, async data fetching, debounce/throttle, and complex state management.",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Round 3: Senior & System Design Curriculum (25 Tasks)",
      description: "100k Virtual Kanban, Profiler Lab, AST Analyzers, Web Workers, and Multi-Tab sync.",
    },
  ],
};

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tasksJsonLd) }}
      />
      {children}
    </>
  );
}
