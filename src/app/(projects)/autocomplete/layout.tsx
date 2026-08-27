import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autocomplete Typeahead — Mid-Level SDE-2 React Challenge",
  description: "Debounced autocomplete search with async querying, keyboard arrow navigation, and highlighted matching terms in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/autocomplete",
  },
  openGraph: {
    title: "Autocomplete Typeahead — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Debounced autocomplete search with async querying, keyboard arrow navigation, and highlighted matching terms in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Autocomplete Typeahead — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
