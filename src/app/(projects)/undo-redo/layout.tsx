import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Undo & Redo (useHistory Engine) — Senior SDE-3 React Challenge",
  description: "State history timeline manager in React 19 implementing past, present, future stack state reconciliation algorithms.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/undo-redo",
  },
  openGraph: {
    title: "Undo & Redo (useHistory Engine) — Senior SDE-3 React Challenge | ReactForge",
    description: "State history timeline manager in React 19 implementing past, present, future stack state reconciliation algorithms.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Undo & Redo Engine — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
