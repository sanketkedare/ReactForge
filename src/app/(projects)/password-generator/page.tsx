import type { Metadata } from "next";
import PasswordGenerator from "@/components/Password_Genrator/PasswordGenrator";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

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
    <DynamicTaskClient slug="password-generator">
      <PasswordGenerator />
    </DynamicTaskClient>
  );
}
