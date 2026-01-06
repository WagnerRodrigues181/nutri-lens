import { useState } from "react";
import Layout from "./components/common/Layout";
import DailyOverview from "./components/dashboard/DailyOverview";
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
import AchievementsList from "./components/insights/AchievementsList";
import ImportExportData from "./components/dashboard/ImportExportData";
import StatisticsPanel from "./components/dashboard/StatisticsPanel";
import { ToastContainer } from "./components/common/Toast";

import { useSettingsStore } from "./store/useSettingsStore";
import { useNutritionStore } from "./store/useNutritionStore";
import { useToast } from "./hooks/useToast";
import { calculateCurrentStreak } from "./services/streak";

export default function App() {
  const { locale, goals } = useSettingsStore();
  const { history } = useNutritionStore();
  const { toasts, removeToast } = useToast();
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);

  const currentStreak = calculateCurrentStreak(history, goals);

  return (
    <>
      <Layout onOpenSettings={() => setIsGoalsModalOpen(true)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {locale === "pt-BR" ? "Dashboard" : "Dashboard"}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {locale === "pt-BR"
                  ? "Acompanhe seu progresso nutricional diário"
                  : "Track your daily nutritional progress"}
              </p>
            </div>
          </div>

          {/* StreakBadge is now inside DailyOverview */}
          <InsightsList />
          <AchievementsList currentStreak={currentStreak} />
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

          <StatisticsPanel />

          <ImportExportData />
        </div>
      </Layout>

      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
