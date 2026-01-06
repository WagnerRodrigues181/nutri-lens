import { Droplets, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateProgress } from "@/utils/calculations";
import { formatWater } from "@/utils/formatters";

interface WaterMetricCardProps {
  delay?: number;
}

export default function WaterMetricCard({ delay = 0 }: WaterMetricCardProps) {
  const { getCurrentDayData, updateWater, currentDate } = useNutritionStore();
  const { goals, locale } = useSettingsStore();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const dayData = getCurrentDayData();
  const { water } = dayData;

  const progress = calculateProgress(water, goals.water);

  const handleAddWater = (amount: number) => {
    const newAmount = Math.max(0, water + amount);
    updateWater(currentDate, newAmount);
    setShowQuickAdd(false);
  };

  const translations = {
    "pt-BR": {
      water: "Água",
    },
    "en-US": {
      water: "Water",
    },
  };

  const t = translations[locale];

  const quickAmounts = [0.25, 0.5, 1.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t.water}
          </span>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all hover:scale-110 hover:bg-blue-200 active:scale-95 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          aria-label="Add water"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Value Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatWater(water, locale).replace("L", "")}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            / {formatWater(goals.water, locale).replace("L", "")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full bg-blue-500 dark:bg-blue-400`}
        />
      </div>

      {/* Progress Percentage */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {progress.toFixed(0)}%
        </span>
        {progress >= 100 && (
          <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>
        )}
      </div>

      {/* Quick Add Menu */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-6 top-16 z-10 flex gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAddWater(amount)}
              className="flex h-10 w-16 flex-col items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-600 transition-all hover:scale-105 hover:border-blue-400 hover:bg-blue-100 active:scale-95 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:border-blue-600 dark:hover:bg-blue-900/50"
            >
              <Plus className="h-3 w-3" />
              {amount}L
            </button>
          ))}
        </motion.div>
      )}

      {showQuickAdd && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowQuickAdd(false)}
        />
      )}
    </motion.div>
  );
}
