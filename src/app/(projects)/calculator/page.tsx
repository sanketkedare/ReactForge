import type { Metadata } from "next";
import Calculator from "@/components/Calculator/Calculator";
import ProjectHeader from "@/components/common/ProjectHeader";

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
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Interactive Calculator"
        description="Perform basic arithmetic calculations with numeric button keypad input, clear/backspace functions, and operator chaining."
        level="beginner"
        category="Mathematics"
        concepts={["Event Handlers", "String Parsing", "Keypad Layout", "Error Boundary"]}
        estimatedMinutes={20}
      />
      <div className="w-full flex justify-center py-4">
        <Calculator />
      </div>
    </div>
  );
}
