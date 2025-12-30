import { Calendar, Settings, Languages } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatDateWithLocale, getTodayDate } from "@/utils/dateHelpers";
import nutrilensIcon from "@/assets/nutrilens-icon3.png";

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
          <div className="flex items-center gap-3">
            <div className="flex h-15 w-15 items-center justify-center">
              <img
                src={nutrilensIcon}
                alt="NutriLens Logo"
                className="h-12 w-12 object-contain rounded-2xl"
              />
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

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 md:flex">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {formattedDate}
              </span>
            </div>

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
