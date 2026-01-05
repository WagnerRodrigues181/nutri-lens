import { ReactNode } from "react";
import Header from "./Header";
import { useTheme } from "@/hooks/useTheme";

interface LayoutProps {
  children: ReactNode;
  onOpenSettings: () => void;
}

export default function Layout({ children, onOpenSettings }: LayoutProps) {
  // Initialize theme on mount
  useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header onOpenSettings={onOpenSettings} />

      <main className="container mx-auto px-4 py-6 pb-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 py-6 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Made with 💚 by{" "}
            <span className="font-semibold text-green-600 dark:text-green-500">
              NutriLens
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
