import type { Metadata } from "next";
import UserProfile from "@/components/User_Profile/UserProfile";
import ProjectHeader from "@/components/common/ProjectHeader";

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
    <div className="w-full space-y-6">
      <ProjectHeader
        title="User Profile Form Editor"
        description="Multi-field profile form with toggleable view/edit modes, avatar display, bio update, and controlled input validation."
        level="beginner"
        category="Forms & Profile"
        concepts={["Controlled Inputs", "Edit/View State Toggling", "Object State Updates"]}
        estimatedMinutes={20}
      />
      <div className="w-full flex justify-center py-4">
        <UserProfile />
      </div>
    </div>
  );
}
