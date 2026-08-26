import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Mapping of project slugs to actual filesystem directories in src/components
const SLUG_TO_DIR_MAP: Record<string, string> = {
  "todo-list": "To-Do_List",
  "password-generator": "Password_Genrator",
  "tic-tac-toe": "Tic_Tac_Toe",
  "calculator": "Calculator",
  "comment-section": "Comment_Section",
  "fetch-posts": "Fetch_Posts",
  "image-slider": "Image_Slider",
  "user-profile": "User_Profile",
  "start-rating": "Start_Rating",
  "star-rating": "Start_Rating",
  "shooting-guns": "Shooting_Guns",
  "drag-ball": "Drag_Ball",
  "diwali-lights": "Diwali_Lights",
  "diwali-gifts": "Diwali_Gifts",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = (searchParams.get("slug") || "").replace(/^\//, "").toLowerCase();

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 });
    }

    const dirName = SLUG_TO_DIR_MAP[slug];
    const componentsRoot = path.join(process.cwd(), "src", "components");

    if (dirName) {
      const targetDir = path.join(componentsRoot, dirName);

      if (fs.existsSync(targetDir)) {
        const fileNames = fs.readdirSync(targetDir);
        const files = fileNames
          .filter((name) => {
            const ext = path.extname(name).toLowerCase();
            return [".tsx", ".ts", ".jsx", ".js", ".json", ".css"].includes(ext);
          })
          .map((fileName) => {
            const filePath = path.join(targetDir, fileName);
            const content = fs.readFileSync(filePath, "utf-8");
            const ext = path.extname(fileName).toLowerCase();

            let language = "tsx";
            if (ext === ".ts") language = "typescript";
            if (ext === ".json") language = "json";
            if (ext === ".css") language = "css";

            const isMain =
              fileName.toLowerCase().includes(slug.replace(/[^a-z0-9]/g, "")) ||
              fileName.toLowerCase().startsWith("to") ||
              fileName.toLowerCase().startsWith("calc") ||
              fileName.toLowerCase().startsWith("pass") ||
              fileName.toLowerCase().startsWith("tic") ||
              fileName === fileNames[0];

            return {
              name: fileName,
              path: `src/components/${dirName}/${fileName}`,
              language,
              code: content,
              isMain,
            };
          });

        return NextResponse.json({
          folderName: `src/components/${dirName}`,
          description: `Direct source code implementation from ${dirName} with all modular files and hooks.`,
          files,
        });
      }
    }

    // Check if there is an explicit page in src/app/(projects)/[slug]/page.tsx
    const projectPagePath = path.join(process.cwd(), "src", "app", "(projects)", slug, "page.tsx");
    if (fs.existsSync(projectPagePath)) {
      const pageContent = fs.readFileSync(projectPagePath, "utf-8");
      return NextResponse.json({
        folderName: `src/app/(projects)/${slug}`,
        description: `Source code for ${slug} page component.`,
        files: [
          {
            name: "page.tsx",
            path: `src/app/(projects)/${slug}/page.tsx`,
            language: "tsx",
            code: pageContent,
            isMain: true,
          },
        ],
      });
    }

    // Dynamic curriculum task structure
    const componentName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

    return NextResponse.json({
      folderName: `src/components/${componentName}`,
      description: `Production-ready architecture for ${slug} with separation of concerns.`,
      files: [
        {
          name: `${componentName}.tsx`,
          path: `src/components/${componentName}/${componentName}.tsx`,
          language: "tsx",
          isMain: true,
          code: `"use client";\n\nimport React, { useState, useEffect } from "react";\n\nexport default function ${componentName}() {\n  const [active, setActive] = useState<boolean>(true);\n  const [value, setValue] = useState<number>(0);\n\n  useEffect(() => {\n    // Component Lifecycle & Event Subscriptions\n    return () => {\n      // Teardown & cleanup\n    };\n  }, []);\n\n  return (\n    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 text-white font-sans space-y-4">\n      <h2 className="text-xl font-bold">${componentName} Component</h2>\n      <p className="text-xs text-slate-400">Interactive production implementation.</p>\n      <button\n        onClick={() => setValue((v) => v + 1)}\n        className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"\n      >\n        Trigger Update ({value})\n      </button>\n    </div>\n  );\n}`,
        },
        {
          name: `use${componentName}.ts`,
          path: `src/components/${componentName}/use${componentName}.ts`,
          language: "typescript",
          code: `import { useState, useCallback } from "react";\n\nexport function use${componentName}() {\n  const [state, setState] = useState({ active: true, count: 0 });\n\n  const update = useCallback(() => {\n    setState((prev) => ({ ...prev, count: prev.count + 1 }));\n  }, []);\n\n  return { state, update };\n}`,
        },
        {
          name: "types.ts",
          path: `src/components/${componentName}/types.ts`,
          language: "typescript",
          code: `export interface ${componentName}Props {\n  initialValue?: number;\n  className?: string;\n  onComplete?: () => void;\n}`,
        },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load project code" }, { status: 500 });
  }
}
