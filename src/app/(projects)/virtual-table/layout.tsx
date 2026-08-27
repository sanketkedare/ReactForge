import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Windowed Table (10k Rows) — Senior SDE-3 React Challenge",
  description: "High-performance virtual scrolling table rendering 10,000 items with 60 FPS DOM windowing in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/virtual-table",
  },
  openGraph: {
    title: "Virtual Windowed Table (10k Rows) — Senior SDE-3 React Challenge | ReactForge",
    description: "High-performance virtual scrolling table rendering 10,000 items with 60 FPS DOM windowing in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Virtual Windowed Table — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
