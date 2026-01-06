import { memo } from "react";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateGoalsProgress } from "@/utils/calculations";
import CircularProgress from "./CircularProgress";

function MacrosRing() {
  const { getCurrentDayData } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const dayData = getCurrentDayData();
  const { totalMacros, water } = dayData;

  const progress = calculateGoalsProgress({ ...totalMacros, water }, goals);

  const translations = {
    "pt-BR": {
      title: "Progresso Diário",
      subtitle: "Meta de macros de hoje",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
    },
    "en-US": {
      title: "Daily Progress",
      subtitle: "Today's macros goal",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30">
          <Target className="h-6 w-6 text-purple-600 dark:text-purple-500" />
        </div>
      </div>

      {/* Circular Progress Rings */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.calories}
            size={100}
            strokeWidth={6}
            color="#10b981"
            label={t.calories}
            value={Math.round(totalMacros.calories).toString()}
            delay={0}
          />
          <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            de {goals.calories}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.protein}
            size={100}
            strokeWidth={6}
            color="#ef4444"
            label={t.protein}
            value={Math.round(totalMacros.protein).toString()}
            delay={0.1}
          />
          <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            de {goals.protein}g
          </p>
        </div>

        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.carbs}
            size={100}
            strokeWidth={6}
            color="#f59e0b"
            label={t.carbs}
            value={Math.round(totalMacros.carbs).toString()}
            delay={0.2}
          />
          <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            de {goals.carbs}g
          </p>
        </div>

        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.fat}
            size={100}
            strokeWidth={6}
            color="#6366f1"
            label={t.fat}
            value={Math.round(totalMacros.fat).toString()}
            delay={0.3}
          />
          <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            de {goals.fat}g
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(MacrosRing);
