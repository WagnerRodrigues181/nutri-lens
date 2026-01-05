import { useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const { theme, setTheme } = useSettingsStore();

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Determine actual theme (resolve "system" to light/dark)
    let actualTheme = theme;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      actualTheme = systemTheme;
    }

    // Apply theme class
    root.classList.add(actualTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      const systemTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
