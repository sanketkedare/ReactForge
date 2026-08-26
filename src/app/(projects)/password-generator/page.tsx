import type { Metadata } from "next";
import PasswordGenerator from "@/components/Password_Genrator/PasswordGenrator";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Password Generator | React Tasks",
  description: "Generate secure passwords of customizable length, numbers, and symbols.",
};

export default function PasswordGeneratorPage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Password Generator"
        description="Generate secure custom passwords based on user-selected length, uppercase/lowercase letters, numbers, and symbols."
        level="beginner"
        category="Security & Strings"
        concepts={["useState", "Math.random()", "Checkbox Controlled Inputs", "Clipboard API"]}
        estimatedMinutes={20}
      />
      <div className="w-full flex justify-center py-6">
        <PasswordGenerator />
      </div>
    </div>
  );
}
