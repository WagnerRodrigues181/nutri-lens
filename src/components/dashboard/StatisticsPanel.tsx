import { memo } from "react";
import { BarChart3, TrendingUp, TrendingDown, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateStatistics } from "@/services/statistics";
import { formatDateWithLocale } from "@/utils/dateHelpers";
import { formatCalories, formatMacro, formatWater } from "@/utils/formatters";

function StatisticsPanel() {
  const { history } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const stats = calculateStatistics(history, goals);

  const translations = {
    "pt-BR": {
      title: "Estatísticas Gerais",
      subtitle: "Análise completa do seu histórico",
      averages: "Médias Gerais",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
      water: "Água",
      performance: "Performance",
      bestDay: "Melhor Dia",
      worstDay: "Pior Dia",
      accuracy: "Precisão",
      goalsMetDays: "Dias com Metas Atingidas",
      totalDays: "Total de Dias Rastreados",
      noData: "Sem dados suficientes para estatísticas",
      ofDays: "dos dias",
      daysWithData: "dias com dados",
    },
    "en-US": {
      title: "Overall Statistics",
      subtitle: "Complete analysis of your history",
      averages: "Overall Averages",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      water: "Water",
      performance: "Performance",
      bestDay: "Best Day",
      worstDay: "Worst Day",
      accuracy: "Accuracy",
      goalsMetDays: "Days Goals Met",
      totalDays: "Total Days Tracked",
      noData: "Not enough data for statistics",
      ofDays: "of days",
      daysWithData: "days with data",
    },
  };

  const t = translations[locale];

  if (stats.totalDaysTracked === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.noData}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
          <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Averages */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t.averages}
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.calories}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatCalories(stats.averageCalories).replace(" kcal", "")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.protein}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatMacro(stats.averageProtein)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.carbs}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatMacro(stats.averageCarbs)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.fat}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatMacro(stats.averageFat)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.water}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatWater(stats.averageWater, locale)}
              </p>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t.performance}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Best Day */}
            <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/30">
              <div className="mb-2 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                {t.bestDay}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDateWithLocale(
                  stats.bestDay.date,
                  locale,
                  "dd MMM yyyy"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {t.accuracy}:{" "}
                <span className="font-bold text-green-600 dark:text-green-500">
                  {stats.bestDay.accuracy}%
                </span>
              </p>
            </div>

            {/* Worst Day */}
            <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-900 dark:from-amber-950/30 dark:to-orange-950/30">
              <div className="mb-2 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                <TrendingDown className="h-4 w-4" />
                {t.worstDay}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDateWithLocale(
                  stats.worstDay.date,
                  locale,
                  "dd MMM yyyy"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {t.accuracy}:{" "}
                <span className="font-bold text-amber-600 dark:text-amber-500">
                  {stats.worstDay.accuracy}%
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Goals and Days */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Target className="h-4 w-4" />
              {t.goalsMetDays}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.goalsMetCount}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {((stats.goalsMetCount / stats.totalDaysTracked) * 100).toFixed(
                0
              )}
              % {t.ofDays}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <BarChart3 className="h-4 w-4" />
              {t.totalDays}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalDaysTracked}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {t.daysWithData}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(StatisticsPanel);
