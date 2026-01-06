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
      of: "de",
    },
    "en-US": {
      title: "Daily Progress",
      subtitle: "Today's macros goal",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      of: "of",
    },
  };

  const t = translations[locale];

  const macros = [
    {
      label: t.calories,
      value: Math.round(totalMacros.calories),
      goal: goals.calories,
      unit: "",
      progress: progress.calories,
      color: "#10b981",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      delay: 0,
    },
    {
      label: t.protein,
      value: Math.round(totalMacros.protein),
      goal: goals.protein,
      unit: "g",
      progress: progress.protein,
      color: "#ef4444",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      delay: 0.1,
    },
    {
      label: t.carbs,
      value: Math.round(totalMacros.carbs),
      goal: goals.carbs,
      unit: "g",
      progress: progress.carbs,
      color: "#f59e0b",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      delay: 0.2,
    },
    {
      label: t.fat,
      value: Math.round(totalMacros.fat),
      goal: goals.fat,
      unit: "g",
      progress: progress.fat,
      color: "#6366f1",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30"
        >
          <Target className="h-5 w-5 text-white" />
        </motion.div>
      </div>

      {/* Circular Progress Grid - Wide Layout */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-center gap-6 lg:gap-8">
          {macros.map((macro) => (
            <motion.div
              key={macro.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: macro.delay }}
              className="flex flex-col items-center gap-3"
            >
              {/* Circular Progress */}
              <div className="relative">
                <CircularProgress
                  percentage={macro.progress}
                  size={130}
                  strokeWidth={9}
                  color={macro.color}
                  value={macro.value.toString()}
                  delay={macro.delay}
                />
              </div>

              {/* Label */}
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {macro.label}
                </p>
                <div className={`rounded-full px-3 py-1 ${macro.bgColor}`}>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.of} {macro.goal}
                    {macro.unit}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(MacrosRing);
