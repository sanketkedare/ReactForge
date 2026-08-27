import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infinite Scroll Feed — Mid-Level SDE-2 React Challenge",
  description: "Infinite scroll feed with IntersectionObserver API, loading skeletons, and throttle throttling in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/infinite-scroll",
  },
  openGraph: {
    title: "Infinite Scroll Feed — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Infinite scroll feed with IntersectionObserver API, loading skeletons, and throttle throttling in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Infinite Scroll Feed — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
