import { ReactNode, useState } from "react";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import Header from "./Header";
import { useTheme } from "@/hooks/useTheme";

interface LayoutProps {
  children: ReactNode;
  onOpenSettings: () => void;
}

export default function Layout({ children, onOpenSettings }: LayoutProps) {
  const [copied, setCopied] = useState(false);

  // Initialize theme on mount
  useTheme();

  const email = "rodrigueswagner181@gmail.com";
  const whatsappNumber = "5532999996976";

  function copyEmail() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function openWhatsApp() {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header onOpenSettings={onOpenSettings} />

      <main className="container mx-auto px-4 py-6 pb-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white via-green-50/30 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Texto */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Feito com 💚 por{" "}
                <span className="text-green-600 dark:text-green-500 font-semibold">
                  Wagner
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Outubro 2025
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/WagnerRodrigues181"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 rounded-full transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-md group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
              </a>

              <a
                href="https://linkedin.com/in/wagner-rodrigues-monteiro"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 rounded-full transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-md group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
              </a>

              <button
                onClick={copyEmail}
                className="p-3 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 rounded-full transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-md group relative"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs text-white bg-green-600 px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    Email copiado!
                  </span>
                )}
              </button>

              <button
                onClick={openWhatsApp}
                className="p-3 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 rounded-full transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-md group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
