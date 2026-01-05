import { memo } from "react";
import { TrendingUp, Calendar, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNutritionData } from "@/hooks/useNutritionData";
import { formatCalories, formatMacro, formatWater } from "@/utils/formatters";
import { formatDateWithLocale } from "@/utils/dateHelpers";

function WeeklySummary() {
  const { locale } = useSettingsStore();
  const { getLastDaysData, getWeeklyAverage, getDaysWithDataCount } =
    useNutritionData();

  const weekData = getLastDaysData(7);
  const weeklyAverage = getWeeklyAverage();
  const daysWithData = getDaysWithDataCount();

  const translations = {
    "pt-BR": {
      title: "Resumo Semanal",
      average: "Média Diária",
      daysTracked: "Dias Rastreados",
      totalMeals: "Refeições",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
      water: "Água",
      lastDays: "Últimos 7 Dias",
      noData: "Sem dados",
      meals: "refeições",
    },
    "en-US": {
      title: "Weekly Summary",
      average: "Daily Average",
      daysTracked: "Days Tracked",
      totalMeals: "Meals",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      water: "Water",
      lastDays: "Last 7 Days",
      noData: "No data",
      meals: "meals",
    },
  };

  const t = translations[locale];

  const totalMeals = weekData.reduce((sum, day) => sum + day.meals, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.lastDays}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/30">
          <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-500" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {t.daysTracked}
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {daysWithData}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UtensilsCrossed className="h-4 w-4" />
            {t.totalMeals}
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalMeals}
          </p>
        </div>
      </div>

      {/* Weekly Average */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t.average}
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-3 dark:border-gray-700 dark:from-green-950/30 dark:to-emerald-950/30">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.calories}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCalories(weeklyAverage.calories).replace(" kcal", "")}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-red-50 to-rose-50 p-3 dark:border-gray-700 dark:from-red-950/30 dark:to-rose-950/30">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.protein}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatMacro(weeklyAverage.protein)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3 dark:border-gray-700 dark:from-amber-950/30 dark:to-orange-950/30">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.carbs}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatMacro(weeklyAverage.carbs)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-3 dark:border-gray-700 dark:from-indigo-950/30 dark:to-purple-950/30">
            <p className="text-xs text-gray-600 dark:text-gray-400">{t.fat}</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatMacro(weeklyAverage.fat)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 dark:border-gray-700 dark:from-blue-950/30 dark:to-cyan-950/30">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.water}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatWater(weeklyAverage.water, locale)}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="space-y-2">
          {weekData.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    day.meals > 0
                      ? "bg-green-500 dark:bg-green-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatDateWithLocale(day.date, locale, "EEE, dd MMM")}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  {day.meals} {t.meals}
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {Math.round(day.calories)} kcal
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(WeeklySummary);
