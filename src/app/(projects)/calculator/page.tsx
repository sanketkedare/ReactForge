import type { Metadata } from "next";
import Calculator from "@/components/Calculator/Calculator";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Interactive Calculator | React Tasks",
  description: "Responsive calculator with real-time arithmetic expression evaluation.",
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
