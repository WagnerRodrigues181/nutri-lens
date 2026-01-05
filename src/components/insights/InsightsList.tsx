import { memo } from "react";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useInsights } from "@/hooks/useInsights";
import InsightCard from "./InsightCard";

interface InsightsListProps {
  currentStreak?: number;
}

function InsightsList({ currentStreak = 0 }: InsightsListProps) {
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
          <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            delay={index * 0.05}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default memo(InsightsList);
