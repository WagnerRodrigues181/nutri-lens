import { useState } from "react";
import Layout from "./components/common/Layout";
import DailyOverview from "./components/dashboard/DailyOverview";
import StreakBadge from "./components/dashboard/StreakBadge";
import MacrosRing from "./components/dashboard/MacrosRing";
import WeeklySummary from "./components/dashboard/WeeklySummary";
import WeeklyBarChart from "./components/charts/WeeklyBarChart";
import ProgressAreaChart from "./components/charts/ProgressAreaChart";
import CaloriesLineChart from "./components/charts/CaloriesLineChart";
import MacrosPieChart from "./components/charts/MacrosPieChart";
import DateNavigator from "./components/calendar/DateNavigator";
import CalendarView from "./components/calendar/CalendarView";
import MealList from "./components/meals/MealList";
import MealTemplates from "./components/meals/MealTemplates";
import GoalsModal from "./components/goals/GoalsModal";
import InsightsList from "./components/insights/InsightsList";
import { useSettingsStore } from "./store/useSettingsStore";

export default function App() {
  const { locale } = useSettingsStore();
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);

  const currentStreak = 0;

  return (
    <>
      <Layout onOpenSettings={() => setIsGoalsModalOpen(true)}>
        <div className="space-y-6">
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

          <StreakBadge currentStreak={currentStreak} locale={locale} />
          <InsightsList />
          <DateNavigator />
          <DailyOverview />
          <MacrosRing />
          <MealList />
          <MealTemplates />
          <CalendarView />
          <WeeklySummary />
          <WeeklyBarChart />
          <ProgressAreaChart />
          <CaloriesLineChart />
          <MacrosPieChart />
        </div>
      </Layout>

      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
      />
    </>
  );
}
