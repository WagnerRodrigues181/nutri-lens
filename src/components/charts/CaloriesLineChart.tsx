import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNutritionData } from "@/hooks/useNutritionData";
import { formatDateWithLocale } from "@/utils/dateHelpers";

export default function CaloriesLineChart() {
  const { locale, goals } = useSettingsStore();
  const { getLastDaysData } = useNutritionData();

  const weekData = getLastDaysData(7);

  const translations = {
    "pt-BR": {
      title: "Evolução de Calorias",
      subtitle: "Últimos 7 dias",
      calories: "Calorias",
      goal: "Meta",
    },
    "en-US": {
      title: "Calories Evolution",
      subtitle: "Last 7 days",
      calories: "Calories",
      goal: "Goal",
    },
  };

  const t = translations[locale];

  const chartData = weekData.map((day) => ({
    date: formatDateWithLocale(day.date, locale, "EEE dd"),
    calories: Math.round(day.calories),
    goal: goals.calories,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.date}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-green-600 dark:text-green-500">
              {t.calories}:{" "}
              <span className="font-bold">{payload[0].value} kcal</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.goal}:{" "}
              <span className="font-semibold">{payload[1].value} kcal</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/30">
          <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-500" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: "12px" }}
            stroke="currentColor"
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: "12px" }}
            stroke="currentColor"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="calories"
            name={t.calories}
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="goal"
            name={t.goal}
            stroke="#e5e7eb"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
