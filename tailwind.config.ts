import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--bg-primary)",
          card: "var(--bg-card)",
          border: "var(--border-color)",
          text: "var(--text-primary)",
          muted: "var(--text-muted)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
