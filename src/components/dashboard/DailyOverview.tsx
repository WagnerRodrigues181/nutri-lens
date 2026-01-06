import { Flame, Beef, Wheat, Droplet, Droplets } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateGoalsProgress } from "@/utils/calculations";
import { formatCalories, formatMacro, formatWater } from "@/utils/formatters";
import { calculateCurrentStreak } from "@/services/streak";
import MetricCard from "./MetricCard";
import StreakBadge from "./StreakBadge";
import WaterMetricCard from "./WaterMetricCard";

export default function DailyOverview() {
  const { getCurrentDayData, history } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const dayData = getCurrentDayData();
  const { totalMacros, water } = dayData;

  const progress = calculateGoalsProgress({ ...totalMacros, water }, goals);

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(history, goals);

  const translations = {
    "pt-BR": {
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
      water: "Água",
    },
    "en-US": {
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      water: "Water",
    },
  };

  const t = translations[locale];

  return (
    <div className="space-y-6">
      {/* Streak Badge */}
      <StreakBadge currentStreak={currentStreak} locale={locale} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          icon={Flame}
          label={t.calories}
          value={formatCalories(totalMacros.calories).replace(" kcal", "")}
          goal={formatCalories(goals.calories).replace(" kcal", "")}
          progress={progress.calories}
          color="green"
          delay={0}
        />

        <MetricCard
          icon={Beef}
          label={t.protein}
          value={formatMacro(totalMacros.protein).replace("g", "")}
          goal={formatMacro(goals.protein).replace("g", "")}
          progress={progress.protein}
          color="red"
          delay={0.1}
        />

        <MetricCard
          icon={Wheat}
          label={t.carbs}
          value={formatMacro(totalMacros.carbs).replace("g", "")}
          goal={formatMacro(goals.carbs).replace("g", "")}
          progress={progress.carbs}
          color="amber"
          delay={0.2}
        />

        <MetricCard
          icon={Droplet}
          label={t.fat}
          value={formatMacro(totalMacros.fat).replace("g", "")}
          goal={formatMacro(goals.fat).replace("g", "")}
          progress={progress.fat}
          color="indigo"
          delay={0.3}
        />

        {/* Water Card with Controls */}
        <WaterMetricCard delay={0.4} />
      </div>
    </div>
  );
}
