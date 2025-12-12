import { BarChart3, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateStatistics } from "@/services/statistics";
import { formatDateWithLocale } from "@/utils/dateHelpers";
import { formatCalories, formatMacro, formatWater } from "@/utils/formatters";

export default function StatisticsPanel() {
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
    },
  };

  const t = translations[locale];

  if (stats.totalDaysTracked === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-gray-500">{t.noData}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700">
            {t.averages}
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">{t.calories}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatCalories(stats.averageCalories).replace(" kcal", "")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">{t.protein}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatMacro(stats.averageProtein)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">{t.carbs}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatMacro(stats.averageCarbs)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">{t.fat}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatMacro(stats.averageFat)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">{t.water}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatWater(stats.averageWater, locale)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700">
            {t.performance}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-green-700">
                <TrendingUp className="h-4 w-4" />
                {t.bestDay}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDateWithLocale(
                  stats.bestDay.date,
                  locale,
                  "dd MMM yyyy"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {t.accuracy}:{" "}
                <span className="font-bold text-green-600">
                  {stats.bestDay.accuracy}%
                </span>
              </p>
            </div>

            <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-amber-700">
                <TrendingDown className="h-4 w-4" />
                {t.worstDay}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDateWithLocale(
                  stats.worstDay.date,
                  locale,
                  "dd MMM yyyy"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {t.accuracy}:{" "}
                <span className="font-bold text-amber-600">
                  {stats.worstDay.accuracy}%
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
              <Target className="h-4 w-4" />
              {t.goalsMetDays}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.goalsMetCount}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {((stats.goalsMetCount / stats.totalDaysTracked) * 100).toFixed(
                0
              )}
              % {locale === "pt-BR" ? "dos dias" : "of days"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
              <BarChart3 className="h-4 w-4" />
              {t.totalDays}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalDaysTracked}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {locale === "pt-BR" ? "dias com dados" : "days with data"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
