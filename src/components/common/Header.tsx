import { Calendar, Settings, Languages } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatDateWithLocale, getTodayDate } from "@/utils/dateHelpers";

interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  const { locale, setLocale } = useSettingsStore();

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
  };

  const today = getTodayDate();
  const formattedDate = formatDateWithLocale(
    today,
    locale,
    "EEEE, dd 'de' MMMM 'de' yyyy"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
              <span className="text-xl font-bold text-white">🥗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {locale === "pt-BR" ? "NutriLens" : "NutriLens"}
              </h1>
              <p className="text-xs text-gray-500">
                {locale === "pt-BR"
                  ? "Rastreador Inteligente de Dieta"
                  : "Smart Diet Tracker"}
              </p>
            </div>
          </div>

          {/* Data e Ações */}
          <div className="flex items-center gap-4">
            {/* Data Atual */}
            <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 md:flex">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {formattedDate}
              </span>
            </div>

            {/* Botão de Idioma */}
            <button
              onClick={toggleLocale}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-green-500 hover:bg-green-50"
              aria-label={
                locale === "pt-BR"
                  ? "Mudar para inglês"
                  : "Switch to Portuguese"
              }
            >
              <Languages className="h-5 w-5 text-gray-700" />
            </button>

            {/* Botão de Configurações */}
            <button
              onClick={onOpenSettings}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-green-500 hover:bg-green-50"
              aria-label={locale === "pt-BR" ? "Configurações" : "Settings"}
            >
              <Settings className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
