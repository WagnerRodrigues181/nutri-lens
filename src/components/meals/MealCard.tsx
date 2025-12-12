import {
  Edit2,
  Trash2,
  Clock,
  Flame,
  Beef,
  Wheat,
  Droplet,
} from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatTime, formatMealCategory } from "@/utils/formatters";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  breakfast: "from-amber-50 to-orange-50 border-amber-200",
  lunch: "from-green-50 to-emerald-50 border-green-200",
  dinner: "from-blue-50 to-indigo-50 border-blue-200",
  snack: "from-purple-50 to-pink-50 border-purple-200",
};

const categoryIcons = {
  breakfast: "☀️",
  lunch: "🍽️",
  dinner: "🌙",
  snack: "🍿",
};

export default function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
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
    <div
      className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 shadow-sm transition-all hover:shadow-md ${
        categoryColors[meal.category]
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[meal.category]}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{meal.name}</h3>
            <p className="text-xs text-gray-600">
              {formatMealCategory(meal.category, locale)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(meal)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-gray-600 transition-colors hover:bg-white hover:text-green-600"
            aria-label="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-gray-600 transition-colors hover:bg-white hover:text-red-600"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Macros Grid */}
      <div className="mb-3 grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center rounded-lg bg-white/60 p-2">
          <Flame className="mb-1 h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-gray-900">
            {Math.round(meal.calories)}
          </span>
          <span className="text-[10px] text-gray-500">kcal</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-white/60 p-2">
          <Beef className="mb-1 h-4 w-4 text-red-600" />
          <span className="text-xs font-medium text-gray-900">
            {meal.protein.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500">g</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-white/60 p-2">
          <Wheat className="mb-1 h-4 w-4 text-amber-600" />
          <span className="text-xs font-medium text-gray-900">
            {meal.carbs.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500">g</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-white/60 p-2">
          <Droplet className="mb-1 h-4 w-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-900">
            {meal.fat.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500">g</span>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <span>{formatTime(meal.timestamp, locale)}</span>
      </div>
    </div>
  );
}
