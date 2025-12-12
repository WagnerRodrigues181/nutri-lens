import { Lightbulb } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useInsights } from "@/hooks/useInsights";
import InsightCard from "./InsightCard";

interface InsightsListProps {
  currentStreak?: number;
}

export default function InsightsList({ currentStreak = 0 }: InsightsListProps) {
  const { locale } = useSettingsStore();
  const insights = useInsights(currentStreak);

  const translations = {
    "pt-BR": {
      title: "Insights do Dia",
      subtitle: "Análise inteligente do seu progresso",
    },
    "en-US": {
      title: "Daily Insights",
      subtitle: "Smart analysis of your progress",
    },
  };

  const t = translations[locale];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
