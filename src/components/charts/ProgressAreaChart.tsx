import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNutritionData } from "@/hooks/useNutritionData";
import { formatDateWithLocale } from "@/utils/dateHelpers";

export default function ProgressAreaChart() {
  const { locale } = useSettingsStore();
  const { getLastDaysData } = useNutritionData();

  const weekData = getLastDaysData(14);

  const translations = {
    "pt-BR": {
      title: "Evolução Quinzenal",
      subtitle: "Progresso dos macros nos últimos 14 dias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
    },
    "en-US": {
      title: "Biweekly Evolution",
      subtitle: "Macros progress over the last 14 days",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
    },
  };

  const t = translations[locale];

  const chartData = weekData.map((day) => ({
    date: formatDateWithLocale(day.date, locale, "dd/MM"),
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
          <Activity className="h-6 w-6 text-purple-600" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorCarbs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="protein"
            name={t.protein}
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProtein)"
          />
          <Area
            type="monotone"
            dataKey="carbs"
            name={t.carbs}
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCarbs)"
          />
          <Area
            type="monotone"
            dataKey="fat"
            name={t.fat}
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFat)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
