import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNutritionData } from "@/hooks/useNutritionData";
import { formatDateWithLocale } from "@/utils/dateHelpers";

export default function WeeklyBarChart() {
  const { locale } = useSettingsStore();
  const { getLastDaysData } = useNutritionData();

  const weekData = getLastDaysData(7);

  const translations = {
    "pt-BR": {
      title: "Comparação Semanal",
      subtitle: "Macros dos últimos 7 dias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
    },
    "en-US": {
      title: "Weekly Comparison",
      subtitle: "Macros from the last 7 days",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
    },
  };

  const t = translations[locale];

  const chartData = weekData.map((day) => ({
    date: formatDateWithLocale(day.date, locale, "EEE dd"),
    protein: Math.round(day.protein),
    carbs: Math.round(day.carbs),
    fat: Math.round(day.fat),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 text-sm font-semibold text-gray-900">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: <span className="font-bold">{entry.value}g</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            label={{
              value: "Gramas (g)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: "12px" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
            iconType="square"
          />
          <Bar
            dataKey="protein"
            name={t.protein}
            fill="#ef4444"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="carbs"
            name={t.carbs}
            fill="#f59e0b"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="fat"
            name={t.fat}
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
