import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessible Modal Dialog — Junior SDE-1 React Challenge",
  description: "Accessible modal dialog in React 19 with backdrop click dismissal, Escape key handling, and focus trap.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/modal",
  },
  openGraph: {
    title: "Accessible Modal Dialog — Junior SDE-1 React Challenge | ReactForge",
    description: "Accessible modal dialog in React 19 with backdrop click dismissal, Escape key handling, and focus trap.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Accessible Modal Dialog — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
