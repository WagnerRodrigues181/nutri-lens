import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Activity } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateMacroDistribution } from "@/utils/calculations";

export default function MacrosPieChart() {
  const { getCurrentDayData } = useNutritionStore();
  const { locale } = useSettingsStore();

  const dayData = getCurrentDayData();
  const { totalMacros } = dayData;

  const distribution = calculateMacroDistribution(totalMacros);

  const translations = {
    "pt-BR": {
      title: "Distribuição de Macros",
      subtitle: "Proporção calórica de hoje",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
      noData: "Sem dados para exibir",
    },
    "en-US": {
      title: "Macros Distribution",
      subtitle: "Today's caloric proportion",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      noData: "No data to display",
    },
  };

  const t = translations[locale];

  const chartData = [
    { name: t.protein, value: distribution.protein, color: "#ef4444" },
    { name: t.carbs, value: distribution.carbs, color: "#f59e0b" },
    { name: t.fat, value: distribution.fat, color: "#6366f1" },
  ];

  const hasData = totalMacros.calories > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p
            className="mt-1 text-lg font-bold"
            style={{ color: data.payload.color }}
          >
            {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <Activity className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "14px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">{t.noData}</p>
        </div>
      )}

      {hasData && (
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600">{t.protein}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {distribution.protein}%
            </p>
            <p className="text-xs text-gray-500">
              {totalMacros.protein.toFixed(1)}g
            </p>
          </div>

          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-600">{t.carbs}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {distribution.carbs}%
            </p>
            <p className="text-xs text-gray-500">
              {totalMacros.carbs.toFixed(1)}g
            </p>
          </div>

          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
              <span className="text-xs text-gray-600">{t.fat}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {distribution.fat}%
            </p>
            <p className="text-xs text-gray-500">
              {totalMacros.fat.toFixed(1)}g
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
