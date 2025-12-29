import { Flame, Beef, Wheat, Droplet, Droplets } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateGoalsProgress } from "@/utils/calculations";
import { formatCalories, formatMacro, formatWater } from "@/utils/formatters";
import MetricCard from "./MetricCard";

export default function DailyOverview() {
  const { getCurrentDayData } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const dayData = getCurrentDayData();
  const { totalMacros, water } = dayData;

  const progress = calculateGoalsProgress({ ...totalMacros, water }, goals);

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

      <MetricCard
        icon={Droplets}
        label={t.water}
        value={formatWater(water, locale).replace("L", "")}
        goal={formatWater(goals.water, locale).replace("L", "")}
        progress={progress.water}
        color="blue"
        delay={0.4}
      />
    </div>
  );
}
