import {useEffect, useMemo, useState} from "react";
import ThemeContext from "../../shared/hooks/themeContext";

const STORAGE_KEY = "rps-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
};

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;



