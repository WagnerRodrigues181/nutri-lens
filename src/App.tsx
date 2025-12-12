import { useState } from "react";
import Layout from "./components/common/Layout";
import DailyOverview from "./components/dashboard/DailyOverview";
import StreakBadge from "./components/dashboard/StreakBadge";
import MacrosRing from "./components/dashboard/MacrosRing";
import MealList from "./components/meals/MealList";
import { useSettingsStore } from "./store/useSettingsStore";

export default function App() {
  const { locale } = useSettingsStore();
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);

  // Temporary streak data (will be calculated later)
  const currentStreak = 0;

  return (
    <>
      <Layout onOpenSettings={() => setIsGoalsModalOpen(true)}>
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

          {/* Macros Progress Rings */}
          <MacrosRing />

          {/* Meals List */}
          <MealList />
        </div>
      </Layout>
    </>
  );
}
