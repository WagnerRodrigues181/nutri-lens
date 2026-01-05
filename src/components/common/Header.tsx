import { useState } from "react";
import { Calendar, Settings, Languages, Info } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatDateWithLocale, getTodayDate } from "@/utils/dateHelpers";
import nutrilensIcon from "@/assets/nutrilens-icon3.png";
import KeyboardShortcutsPopup from "./KeyboardShortcutsPopup";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  const { locale, setLocale } = useSettingsStore();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const toggleLocale = () => {
    const newLocale = locale === "pt-BR" ? "en-US" : "pt-BR";
    setLocale(newLocale);
  };

  const toggleShortcuts = () => {
    setIsShortcutsOpen((prev) => !prev);
  };

  const today = getTodayDate();
  const formattedDate = formatDateWithLocale(
    today,
    locale,
    "EEEE, dd 'de' MMMM 'de' yyyy"
  );

  const translations = {
    "pt-BR": {
      appTitle: "NutriLens - Rastreador Inteligente de Dieta",
      subtitle: "Rastreador Inteligente de Dieta",
      currentDate: `Data atual: ${formattedDate}`,
      switchLanguage: "Mudar idioma para Inglês",
      openSettings: "Abrir configurações",
      keyboardShortcuts: "Ver atalhos de teclado",
    },
    "en-US": {
      appTitle: "NutriLens - Smart Diet Tracker",
      subtitle: "Smart Diet Tracker",
      currentDate: `Current date: ${formattedDate}`,
      switchLanguage: "Switch language to Portuguese",
      openSettings: "Open settings",
      keyboardShortcuts: "View keyboard shortcuts",
    },
  };

  const t = translations[locale];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80"
        role="banner"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-15 w-15 items-center justify-center">
                <img
                  src={nutrilensIcon}
                  alt="NutriLens Logo"
                  className="h-12 w-12 rounded-2xl object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {locale === "pt-BR" ? "NutriLens" : "NutriLens"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Actions */}
            <nav
              className="flex items-center gap-4"
              aria-label="Main navigation"
            >
              {/* Current Date Display */}
              <div
                className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800 md:flex"
                aria-live="polite"
                aria-atomic="true"
              >
                <Calendar
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="sr-only">{t.currentDate}</span>
                  <span aria-hidden="true">{formattedDate}</span>
                </span>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Keyboard Shortcuts Button */}
              <button
                onClick={toggleShortcuts}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500 dark:hover:bg-gray-700"
                aria-label={t.keyboardShortcuts}
                title={t.keyboardShortcuts}
                aria-expanded={isShortcutsOpen}
                aria-controls="keyboard-shortcuts-popup"
              >
                <Info
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  aria-hidden="true"
                />
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500 dark:hover:bg-gray-700"
                aria-label={t.switchLanguage}
                title={t.switchLanguage}
              >
                <Languages
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  aria-hidden="true"
                />
              </button>

              {/* Settings Button */}
              <button
                onClick={onOpenSettings}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500 dark:hover:bg-gray-700"
                aria-label={t.openSettings}
                title={t.openSettings}
              >
                <Settings
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                  aria-hidden="true"
                />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Popup */}
      <KeyboardShortcutsPopup
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}
