import type { Metadata } from "next";
import PasswordGenerator from "@/components/Password_Genrator/PasswordGenrator";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Password Generator — Junior SDE-1 React Challenge",
  description: "Build a customizable, secure password generator in React 19 with entropy calculation and one-click clipboard copying.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/password-generator",
  },
  openGraph: {
    title: "Password Generator — Junior SDE-1 React Challenge | ReactForge",
    description: "Build a customizable, secure password generator in React 19 with entropy calculation and one-click clipboard copying.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Password Generator — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
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
