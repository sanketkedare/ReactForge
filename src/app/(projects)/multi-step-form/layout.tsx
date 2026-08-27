import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Step Form Wizard — Mid-Level SDE-2 React Challenge",
  description: "Multi-step form wizard in React 19 with progress indicators, field validation, and draft persistence.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/multi-step-form",
  },
  openGraph: {
    title: "Multi-Step Form Wizard — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Multi-step form wizard in React 19 with progress indicators, field validation, and draft persistence.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Multi-Step Form Wizard — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
