import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateGoalsProgress } from "@/utils/calculations";
import { formatCalories } from "@/utils/formatters";
import CircularProgress from "./CircularProgress";

export default function MacrosRing() {
  const { getCurrentDayData } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const dayData = getCurrentDayData();
  const { totalMacros, water } = dayData;

  const progress = calculateGoalsProgress({ ...totalMacros, water }, goals);

  const translations = {
    "pt-BR": {
      title: "Progresso Diário",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
      of: "de",
    },
    "en-US": {
      title: "Daily Progress",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      of: "of",
    },
  };

  const t = translations[locale];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">{t.title}</h3>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {/* Calories */}
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.calories}
            size={100}
            strokeWidth={6}
            color="#10b981"
            value={Math.round(totalMacros.calories).toString()}
          />
          <p className="mt-3 text-sm font-medium text-gray-700">{t.calories}</p>
          <p className="text-xs text-gray-500">
            {t.of} {formatCalories(goals.calories)}
          </p>
        </div>

        {/* Protein */}
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.protein}
            size={100}
            strokeWidth={6}
            color="#ef4444"
            value={Math.round(totalMacros.protein).toString()}
          />
          <p className="mt-3 text-sm font-medium text-gray-700">{t.protein}</p>
          <p className="text-xs text-gray-500">
            {t.of} {goals.protein}g
          </p>
        </div>

        {/* Carbs */}
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.carbs}
            size={100}
            strokeWidth={6}
            color="#f59e0b"
            value={Math.round(totalMacros.carbs).toString()}
          />
          <p className="mt-3 text-sm font-medium text-gray-700">{t.carbs}</p>
          <p className="text-xs text-gray-500">
            {t.of} {goals.carbs}g
          </p>
        </div>

        {/* Fat */}
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={progress.fat}
            size={100}
            strokeWidth={6}
            color="#6366f1"
            value={Math.round(totalMacros.fat).toString()}
          />
          <p className="mt-3 text-sm font-medium text-gray-700">{t.fat}</p>
          <p className="text-xs text-gray-500">
            {t.of} {goals.fat}g
          </p>
        </div>
      </div>
    </div>
  );
}
