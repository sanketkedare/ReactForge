import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accordion Component — Junior SDE-1 React Challenge",
  description: "Collapsible accordion component with single and multi-open modes, animated smooth transitions in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/accordion",
  },
  openGraph: {
    title: "Accordion Component — Junior SDE-1 React Challenge | ReactForge",
    description: "Collapsible accordion component with single and multi-open modes, animated smooth transitions in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Accordion Component — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
