import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { locale } = useSettingsStore();

  const isDark = theme === "dark";

  const translations = {
    "pt-BR": {
      light: "Mudar para modo escuro",
      dark: "Mudar para modo claro",
    },
    "en-US": {
      light: "Switch to dark mode",
      dark: "Switch to light mode",
    },
  };

  const t = translations[locale];
  const ariaLabel = isDark ? t.dark : t.light;

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500 dark:hover:bg-gray-700"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0.8 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-gray-300" aria-hidden="true" />
        ) : (
          <Sun className="h-5 w-5 text-gray-700" aria-hidden="true" />
        )}
      </motion.div>
    </button>
  );
}
