import { memo } from "react";
import {
  Edit2,
  Trash2,
  Clock,
  Flame,
  Beef,
  Wheat,
  Droplet,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatTime, formatMealCategory } from "@/utils/formatters";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  breakfast:
    "from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-900",
  lunch:
    "from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-900",
  dinner:
    "from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900",
  snack:
    "from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950/30 dark:to-pink-950/30 dark:border-purple-900",
};

const categoryIcons = {
  breakfast: "☀️",
  lunch: "🍽️",
  dinner: "🌙",
  snack: "🍿",
};

function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  const { locale } = useSettingsStore();

  const handleDelete = () => {
    const message =
      locale === "pt-BR"
        ? "Tem certeza que deseja deletar esta refeição?"
        : "Are you sure you want to delete this meal?";

    if (confirm(message)) {
      onDelete(meal.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      layout
      className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 shadow-sm transition-all hover:shadow-md ${
        categoryColors[meal.category]
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="text-2xl"
          >
            {categoryIcons[meal.category]}
          </motion.span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {meal.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatMealCategory(meal.category, locale)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(meal)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-gray-600 transition-colors hover:bg-white hover:text-green-600 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-green-400"
            aria-label="Edit meal"
          >
            <Edit2 className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-gray-600 transition-colors hover:bg-white hover:text-red-600 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-red-400"
            aria-label="Delete meal"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Macros Grid */}
      <div className="mb-3 grid grid-cols-4 gap-2">
        {[
          {
            icon: Flame,
            value: Math.round(meal.calories),
            unit: "kcal",
            color: "text-green-600 dark:text-green-500",
          },
          {
            icon: Beef,
            value: meal.protein.toFixed(1),
            unit: "g",
            color: "text-red-600 dark:text-red-500",
          },
          {
            icon: Wheat,
            value: meal.carbs.toFixed(1),
            unit: "g",
            color: "text-amber-600 dark:text-amber-500",
          },
          {
            icon: Droplet,
            value: meal.fat.toFixed(1),
            unit: "g",
            color: "text-indigo-600 dark:text-indigo-500",
          },
        ].map((macro, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex flex-col items-center rounded-lg bg-white/60 p-2 dark:bg-gray-700/60"
          >
            <macro.icon className={`mb-1 h-4 w-4 ${macro.color}`} />
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
              {macro.value}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {macro.unit}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Clock className="h-3 w-3" />
        <span>{formatTime(meal.timestamp, locale)}</span>
      </div>
    </motion.div>
  );
}

export default memo(MealCard);
