import type { Metadata } from "next";
import StartRating from "@/components/Start_Rating/StartRating";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

export const metadata: Metadata = {
  title: "Star Rating Component — Junior SDE-1 React Challenge",
  description: "Interactive 5-star rating widget in React 19 with hover preview states and dynamic feedback.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/star-rating",
  },
  openGraph: {
    title: "Star Rating Component — Junior SDE-1 React Challenge | ReactForge",
    description: "Interactive 5-star rating widget in React 19 with hover preview states and dynamic feedback.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Star Rating — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function StarRatingAliasPage() {
  return (
    <DynamicTaskClient slug="star-rating">
      <StartRating />
    </DynamicTaskClient>
  );
}
