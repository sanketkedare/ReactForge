import type { Metadata } from "next";
import Calculator from "@/components/Calculator/Calculator";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

export const metadata: Metadata = {
  title: "Interactive Calculator — Junior SDE-1 React Challenge",
  description: "Responsive arithmetic keypad calculator in React 19 with operator chaining and error boundary handling.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/calculator",
  },
  openGraph: {
    title: "Interactive Calculator — Junior SDE-1 React Challenge | ReactForge",
    description: "Responsive arithmetic keypad calculator in React 19 with operator chaining and error boundary handling.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Interactive Calculator — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function CalculatorPage() {
  return (
    <DynamicTaskClient slug="calculator">
      <Calculator />
    </DynamicTaskClient>
  );
}
