import { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

interface KeyboardShortcutsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string;
  description: string;
}

export default function KeyboardShortcutsPopup({
  isOpen,
  onClose,
}: KeyboardShortcutsPopupProps) {
  const { locale } = useSettingsStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const translations = {
    "pt-BR": {
      title: "Atalhos de Teclado",
      subtitle: "Navegue pela aplicação usando apenas o teclado",
      closeButton: "Fechar atalhos de teclado",
      shortcuts: [
        {
          keys: "Tab",
          description: "Avançar para próximo elemento interativo",
        },
        {
          keys: "Shift + Tab",
          description: "Voltar para elemento anterior",
        },
        {
          keys: "Enter",
          description: "Ativar botão/link",
        },
        {
          keys: "Espaço",
          description: "Ativar botão/checkbox",
        },
        {
          keys: "Esc",
          description: "Fechar modal/dialog",
        },
        {
          keys: "← → ↑ ↓",
          description: "Navegar em grids/calendários",
        },
      ] as ShortcutItem[],
    },
    "en-US": {
      title: "Keyboard Shortcuts",
      subtitle: "Navigate the app using only your keyboard",
      closeButton: "Close keyboard shortcuts",
      shortcuts: [
        {
          keys: "Tab",
          description: "Move to next interactive element",
        },
        {
          keys: "Shift + Tab",
          description: "Move to previous element",
        },
        {
          keys: "Enter",
          description: "Activate button/link",
        },
        {
          keys: "Space",
          description: "Activate button/checkbox",
        },
        {
          keys: "Esc",
          description: "Close modal/dialog",
        },
        {
          keys: "← → ↑ ↓",
          description: "Navigate grids/calendars",
        },
      ] as ShortcutItem[],
    },
  };

  const t = translations[locale];

  // Focus close button on open
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ opacity: 0, x: 300, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 300, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed right-4 top-20 z-50 w-full max-w-sm"
          role="dialog"
          aria-modal="false"
          aria-labelledby="shortcuts-title"
          aria-describedby="shortcuts-description"
        >
          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 shadow-lg shadow-green-500/30">
                  <Keyboard className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="shortcuts-title"
                    className="text-lg font-bold text-gray-900"
                  >
                    {t.title}
                  </h2>
                  <p
                    id="shortcuts-description"
                    className="text-xs text-gray-600"
                  >
                    {t.subtitle}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={t.closeButton}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="max-h-96 overflow-y-auto p-4">
              <ul className="space-y-3" role="list">
                {t.shortcuts.map((shortcut, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    role="listitem"
                  >
                    {/* Key Badge */}
                    <kbd className="inline-flex min-w-fit shrink-0 items-center rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-xs font-semibold text-gray-700 shadow-sm">
                      {shortcut.keys}
                    </kbd>

                    {/* Description */}
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Footer Tip */}
            <div className="border-t border-gray-100 bg-blue-50 p-3">
              <p className="text-center text-xs text-blue-700">
                💡{" "}
                {locale === "pt-BR"
                  ? "Pressione Esc para fechar este painel"
                  : "Press Esc to close this panel"}
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
