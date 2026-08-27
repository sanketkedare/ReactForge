import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stopwatch & Countdown Timer — Junior SDE-1 React Challenge",
  description: "Precision stopwatch and lap timer in React 19 with millisecond precision and lap splits.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/stopwatch-timer",
  },
  openGraph: {
    title: "Stopwatch & Countdown Timer — Junior SDE-1 React Challenge | ReactForge",
    description: "Precision stopwatch and lap timer in React 19 with millisecond precision and lap splits.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Stopwatch & Countdown Timer — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
