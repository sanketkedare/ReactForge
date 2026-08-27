import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "React Quiz & Score Engine — Junior SDE-1 React Challenge",
  description: "Timed quiz application in React 19 with score calculation, review mode, and progress tracking.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/quiz-app",
  },
  openGraph: {
    title: "React Quiz & Score Engine — Junior SDE-1 React Challenge | ReactForge",
    description: "Timed quiz application in React 19 with score calculation, review mode, and progress tracking.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "React Quiz & Score Engine — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
