import { createContext, useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Theme, ThemeContextValue } from "./theme.types";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;

  if (stored === "light" || stored === "dark") return stored;

  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply the class before the browser paints to prevent a flash of the wrong theme.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggle() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
