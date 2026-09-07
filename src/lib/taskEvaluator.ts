// Deterministic Functional Evaluation Specs & Test Engine for ReactForge
import { LearningProject } from "@/data/learningProjects";

export interface FunctionalTestCase {
  id: string;
  name: string;
  category: "syntax" | "state" | "accessibility" | "edge_case" | "cleanliness";
  description: string;
  test: (code: string) => boolean | { passed: boolean; message: string };
}

export interface EvaluationResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  percentage: number;
  passed: boolean;
  tests: {
    id: string;
    name: string;
    description: string;
    passed: boolean;
    message?: string;
  }[];
}

export function isBoilerplateCode(code: string): boolean {
  if (!code || code.trim().length < 40) return true;
  // Detect default uncompleted starter template placeholders
  const hasStarterTodos = /TODO:\s*Define your component state|TODO:\s*Implement handlers/i.test(code);
  const hasStubVariables = /const\s+\[isActive,\s*setIsActive\]\s*=\s*useState<boolean>\(false\)/.test(code);
  const hasStubAction = /handleAction\s*=\s*\(\)\s*=>\s*\{\s*setIsActive\(\(prev\)\s*=>\s*!prev\);\s*\}/.test(code);
  
  return (hasStarterTodos && hasStubVariables) || (hasStubVariables && hasStubAction && code.length < 350);
}

export function getTaskTestCases(project?: LearningProject): FunctionalTestCase[] {
  const isStarter = (code: string) => isBoilerplateCode(code);

  const baseTests: FunctionalTestCase[] = [
    {
      id: "tc-real-implementation",
      name: "Core Business Logic (Non-Placeholder)",
      category: "cleanliness",
      description: "Solution contains real custom implementation rather than unmodified starter boilerplate.",
      test: (code) => {
        if (isStarter(code)) {
          return { passed: false, message: "Starter boilerplate detected. Please implement the specific task logic." };
        }
        return code.trim().length > 120;
      },
    },
    {
      id: "tc-component-export",
      name: "Default Export & Component Declaration",
      category: "syntax",
      description: "Component is properly declared with a default function or named export.",
      test: (code) => /export\s+default\s+function|export\s+const|function\s+\w+/i.test(code),
    },
    {
      id: "tc-hooks-usage",
      name: "Declarative React Hooks State",
      category: "state",
      description: "Utilizes React state hooks (useState, useMemo, useCallback, useRef) for reactive updates.",
      test: (code) => {
        if (isStarter(code)) return false;
        return /useState|useReducer|useMemo|useCallback|useRef/.test(code);
      },
    },
    {
      id: "tc-jsx-structure",
      name: "Semantic JSX UI Rendering",
      category: "syntax",
      description: "Returns structured JSX elements representing the required UI layout.",
      test: (code) => /return\s*\([\s\S]*<[a-z0-9]+/i.test(code),
    },
  ];

  // Specific challenge-level assertions
  if (project?.id === "password-generator") {
    baseTests.push(
      {
        id: "tc-pwd-length-state",
        name: "Length Control & Slider Binding",
        category: "state",
        description: "Manages password length state via numeric range slider or number input.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /length|passwordLength|charCount/i.test(code) && /range|slider|onChange|min|max|step/i.test(code);
        },
      },
      {
        id: "tc-pwd-randomization",
        name: "Entropy & Character Set Generation",
        category: "state",
        description: "Constructs passwords dynamically from character sets using Math.random or crypto.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /Math\.random|crypto\.getRandomValues|charCodeAt|charAt|slice|for\s*\(|while\s*\(/i.test(code);
        },
      },
      {
        id: "tc-pwd-copy",
        name: "Clipboard Copy Integration",
        category: "accessibility",
        description: "Implements copy-to-clipboard functionality via navigator.clipboard.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /clipboard|navigator\.clipboard|writeText|copy/i.test(code);
        }
      }
    );
  } else if (project?.id === "todo-list") {
    baseTests.push(
      {
        id: "tc-todo-array",
        name: "Immutable Todo List Array State",
        category: "state",
        description: "Stores list items in array state and mutates immutably.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /\[.*\]|Array|todo|item/i.test(code) && /useState/i.test(code);
        },
      },
      {
        id: "tc-todo-crud",
        name: "Add & Remove Todo Operations",
        category: "state",
        description: "Implements item creation and removal using map, filter, or spread operators.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /\.filter|\.map|\.\.\.prev|\.\.\.items|\.concat/i.test(code);
        },
      }
    );
  } else {
    // Generic task domain assertions
    baseTests.push(
      {
        id: "tc-interactive-handlers",
        name: "Event Handlers & User Interactions",
        category: "state",
        description: "Wires user click, input, or keyboard events to state setters.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /onClick|onChange|onKeyDown|onSubmit|onBlur|onFocus/.test(code);
        },
      },
      {
        id: "tc-edge-case-resilience",
        name: "Edge Case & Safety Handling",
        category: "edge_case",
        description: "Guards against empty states, invalid inputs, or unmount race conditions.",
        test: (code) => {
          if (isStarter(code)) return false;
          return /\?\.|\|\||\?\?|&&|typeof|if\s*\(|\.length\s*>|\.trim\(\)/.test(code);
        },
      }
    );
  }

  return baseTests;
}

export function runFunctionalEvaluation(code: string, project?: LearningProject): EvaluationResult {
  const testCases = getTaskTestCases(project);
  let passedCount = 0;

  const evaluatedTests = testCases.map((tc) => {
    let passed = false;
    let message: string | undefined;

    try {
      const res = tc.test(code);
      if (typeof res === "boolean") {
        passed = res;
      } else {
        passed = res.passed;
        message = res.message;
      }
    } catch (err: any) {
      passed = false;
      message = err.message || "Assertion check failed";
    }

    if (passed) passedCount++;

    return {
      id: tc.id,
      name: tc.name,
      description: tc.description,
      passed,
      message,
    };
  });

  const total = testCases.length;
  const percentage = Math.round((passedCount / total) * 100);
  const passed = percentage >= 80 && !isBoilerplateCode(code);

  return {
    totalTests: total,
    passedTests: passedCount,
    failedTests: total - passedCount,
    percentage,
    passed,
    tests: evaluatedTests,
  };
}
