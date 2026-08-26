import type { Metadata } from "next";
import UserProfile from "@/components/User_Profile/UserProfile";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "User Profile Editor | React Tasks",
  description: "Interactive profile card with toggleable edit mode and controlled inputs.",
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
