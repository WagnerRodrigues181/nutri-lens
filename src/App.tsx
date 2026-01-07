import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "./components/common/Layout";
import DailyOverview from "./components/dashboard/DailyOverview";
import MacrosRing from "./components/dashboard/MacrosRing";
import DateNavigator from "./components/calendar/DateNavigator";
import MealList from "./components/meals/MealList";
import MealTemplates from "./components/meals/MealTemplates";
import GoalsModal from "./components/goals/GoalsModal";
import InsightsList from "./components/insights/InsightsList";
import AchievementsList from "./components/insights/AchievementsList";
import ImportExportData from "./components/dashboard/ImportExportData";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
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

  const translations = {
    "pt-BR": {
      title: "Dashboard",
      subtitle: "Acompanhe seu progresso nutricional diário",
      todaySection: "Visão Geral de Hoje",
      mealsSection: "Minhas Refeições",
      insightsSection: "Análise & Progresso",
      analyticsSection: "Dados & Estatísticas",
    },
    "en-US": {
      title: "Dashboard",
      subtitle: "Track your daily nutritional progress",
      todaySection: "Today's Overview",
      mealsSection: "My Meals",
      insightsSection: "Analysis & Progress",
      analyticsSection: "Data & Statistics",
    },
  };

  const t = translations[locale];

  return (
    <>
      <Layout onOpenSettings={() => setIsGoalsModalOpen(true)}>
        <div className="space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {t.title}
              </h1>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                {t.subtitle}
              </p>
            </div>
          </motion.div>

          {/* SECTION 1: Today's Overview (Hero Content) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-gray-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-6 shadow-xl space-y-6"
          >
            <DailyOverview />

            {/* Divider */}
            <div className="border-t border-gray-200/50 dark:border-slate-700/50" />

            {/* Macros Ring */}
            <div className="flex justify-center pt-2">
              <MacrosRing />
            </div>
          </motion.section>

          {/* SECTION 2: Meals (Primary Action Area) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.mealsSection}
              </h2>
            </div>

            <DateNavigator />
            <MealList />
            <MealTemplates />
          </section>

          {/* SECTION 3: Insights & Progress (Contextual Feedback) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.insightsSection}
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <InsightsList currentStreak={currentStreak} />
              <AchievementsList currentStreak={currentStreak} />
            </div>
          </section>

          {/* SECTION 4: Analytics Dashboard (Deep Dive) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.analyticsSection}
              </h2>
            </div>

            <AnalyticsDashboard />
          </section>

          {/* SECTION 5: Data Management (Footer Actions) */}
          <section className="pb-8">
            <ImportExportData />
          </section>
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
