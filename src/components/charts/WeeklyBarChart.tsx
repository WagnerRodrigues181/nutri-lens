import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNutritionData } from "@/hooks/useNutritionData";
import { formatDateWithLocale } from "@/utils/dateHelpers";

function WeeklyBarChart() {
  const { locale } = useSettingsStore();
  const { getLastDaysData } = useNutritionData();

  const weekData = getLastDaysData(7);

  const translations = {
    "pt-BR": {
      title: "Comparação Semanal",
      subtitle: "Últimos 7 dias",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
    },
    "en-US": {
      title: "Weekly Comparison",
      subtitle: "Last 7 days",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
    },
  };

  const t = translations[locale];

  const chartData = weekData.map((day) => ({
    date: formatDateWithLocale(day.date, locale, "EEE dd"),
    [t.calories]: Math.round(day.calories / 10),
    [t.protein]: Math.round(day.protein),
    [t.carbs]: Math.round(day.carbs),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.date}
          </p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}:{" "}
                <span className="font-bold">
                  {entry.name === t.calories ? entry.value * 10 : entry.value}
                  {entry.name === t.calories ? " kcal" : "g"}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
          <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-500" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
            iconType="square"
          />
          <Bar dataKey={t.calories} fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey={t.protein} fill="#ef4444" radius={[8, 8, 0, 0]} />
          <Bar dataKey={t.carbs} fill="#f59e0b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default memo(WeeklyBarChart);
