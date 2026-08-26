"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import { Theme, ThemeContextType } from "@/types";
import ThemeProvider, { useTheme as useNewTheme } from "./ThemeContext";

export const THEME_CHOICES: Theme[] = [
  { name: "Dark", background: "#030712", text: "#f8fafc" },
  { name: "Light", background: "#f8fafc", text: "#0f172a" },
];

export const TheamContext = createContext<ThemeContextType>({
  theme: THEME_CHOICES[0],
  changeTheme: () => {},
});

interface TheamContextComponentProps {
  children: ReactNode;
}

export const TheamContextComponent: React.FC<TheamContextComponentProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LegacyThemeBridge>{children}</LegacyThemeBridge>
    </ThemeProvider>
  );
};

const LegacyThemeBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useNewTheme();

  const legacyTheme: Theme =
    theme === "dark" ? THEME_CHOICES[0] : THEME_CHOICES[1];

  return (
    <TheamContext.Provider value={{ theme: legacyTheme, changeTheme: toggleTheme }}>
      {children}
    </TheamContext.Provider>
  );
};

export default TheamContextComponent;
