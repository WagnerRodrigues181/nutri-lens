import Layout from "./components/common/Layout";
import DailyOverview from "./components/dashboard/DailyOverview";
import StreakBadge from "./components/dashboard/StreakBadge";
import { useSettingsStore } from "./store/useSettingsStore";

export default function App() {
  const { locale } = useSettingsStore();

  // Temporary streak data (will be calculated later)
  const currentStreak = 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {locale === "pt-BR" ? "Dashboard" : "Dashboard"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {locale === "pt-BR"
                ? "Acompanhe seu progresso nutricional diário"
                : "Track your daily nutritional progress"}
            </p>
          </div>
        </div>

        {/* Streak Badge */}
        <StreakBadge currentStreak={currentStreak} locale={locale} />

        {/* Metrics Overview */}
        <DailyOverview />

        {/* Placeholder for future sections */}
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-sm text-gray-500">
            {locale === "pt-BR"
              ? "Mais componentes virão aqui..."
              : "More components coming here..."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
