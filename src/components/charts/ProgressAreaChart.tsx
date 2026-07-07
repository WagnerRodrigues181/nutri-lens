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
import type { TooltipContentProps } from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNutritionData } from "@/hooks/useNutritionData";
import { formatDateWithLocale } from "@/utils/dateHelpers";

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    date: string;
    [key: string]: string | number;
  };
}

interface CustomTooltipProps extends TooltipContentProps<ValueType, NameType> {
  translations: {
    calories: string;
    protein: string;
    carbs: string;
  };
}

function CustomTooltip({ active, payload, translations }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const t = translations;
    const items = payload as unknown as TooltipPayloadItem[];
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {items[0].payload.date}
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-green-600 dark:text-green-500">
            {t.calories}:{" "}
            <span className="font-bold">{items[0].value} kcal</span>
          </p>
          <p className="text-sm text-red-600 dark:text-red-500">
            {t.protein}:{" "}
            <span className="font-bold">{Math.round(items[1].value / 4)}g</span>
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-500">
            {t.carbs}:{" "}
            <span className="font-bold">{Math.round(items[2].value / 4)}g</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function ProgressAreaChart() {
  const { locale } = useSettingsStore();
  const { getLastDaysData } = useNutritionData();

  const weekData = getLastDaysData(14);

  const translations = {
    "pt-BR": {
      title: "Evolução Quinzenal",
      subtitle: "Últimos 14 dias",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
    },
    "en-US": {
      title: "Biweekly Evolution",
      subtitle: "Last 14 days",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
    },
  };

  const t = translations[locale];

  const chartData = weekData.map((day) => ({
    date: formatDateWithLocale(day.date, locale, "dd/MM"),
    [t.calories]: Math.round(day.calories),
    [t.protein]: Math.round(day.protein * 4),
    [t.carbs]: Math.round(day.carbs * 4),
  }));

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
          <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorCarbs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
          <Tooltip
            content={(props) => <CustomTooltip {...props} translations={t} />}
          />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey={t.calories}
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCalories)"
          />
          <Area
            type="monotone"
            dataKey={t.protein}
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProtein)"
          />
          <Area
            type="monotone"
            dataKey={t.carbs}
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCarbs)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default ProgressAreaChart;
