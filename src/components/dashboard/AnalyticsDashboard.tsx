import { useState } from "react";
import { BarChart3, LineChart, Calendar, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import CaloriesLineChart from "../charts/CaloriesLineChart";
import MacrosPieChart from "../charts/MacrosPieChart";
import WeeklyBarChart from "../charts/WeeklyBarChart";
import ProgressAreaChart from "../charts/ProgressAreaChart";
import WeeklySummary from "./WeeklySummary";
import StatisticsPanel from "./StatisticsPanel";
import CalendarView from "../calendar/CalendarView";

type TabType = "charts" | "statistics" | "calendar";

export default function AnalyticsDashboard() {
  const { locale } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<TabType>("charts");

  const translations = {
    "pt-BR": {
      title: "Análises & Relatórios",
      subtitle: "Visualize seu progresso em detalhes",
      charts: "Gráficos",
      statistics: "Estatísticas",
      calendar: "Calendário",
    },
    "en-US": {
      title: "Analytics & Reports",
      subtitle: "Visualize your progress in detail",
      charts: "Charts",
      statistics: "Statistics",
      calendar: "Calendar",
    },
  };

  const t = translations[locale];

  const tabs = [
    {
      id: "charts" as const,
      label: t.charts,
      icon: LineChart,
    },
    {
      id: "statistics" as const,
      label: t.statistics,
      icon: TrendingUp,
    },
    {
      id: "calendar" as const,
      label: t.calendar,
      icon: Calendar,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30">
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-2 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "charts" && (
            <motion.div
              key="charts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <CaloriesLineChart />
              <div className="grid gap-6 lg:grid-cols-2">
                <MacrosPieChart />
                <WeeklyBarChart />
              </div>
              <ProgressAreaChart />
            </motion.div>
          )}

          {activeTab === "statistics" && (
            <motion.div
              key="statistics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <WeeklySummary />
              <StatisticsPanel />
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
