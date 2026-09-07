import type { Metadata } from "next";
import UserProfile from "@/components/User_Profile/UserProfile";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

export const metadata: Metadata = {
  title: "User Profile Form Editor — Junior SDE-1 React Challenge",
  description: "Interactive user profile card in React 19 with toggleable edit mode, avatar display, and controlled input validation.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/user-profile",
  },
  openGraph: {
    title: "User Profile Form Editor — Junior SDE-1 React Challenge | ReactForge",
    description: "Interactive user profile card in React 19 with toggleable edit mode, avatar display, and controlled input validation.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "User Profile Form Editor — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function UserProfilePage() {
  return (
    <DynamicTaskClient slug="user-profile">
      <div className="w-full flex justify-center py-4">
        <UserProfile />
      </div>
    </DynamicTaskClient>
  );
}
