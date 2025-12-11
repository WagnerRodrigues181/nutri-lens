import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  onOpenSettings: () => void;
}

export default function Layout({ children, onOpenSettings }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Header onOpenSettings={onOpenSettings} />

      <main className="container mx-auto px-4 py-6 pb-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            Made with 💚 by{" "}
            <span className="font-semibold text-green-600">NutriLens</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
