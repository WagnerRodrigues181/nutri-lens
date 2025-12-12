import { useMemo } from "react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { generateInsights } from "@/services/insights";
import type { Insight } from "@/types";

export const useInsights = (currentStreak: number = 0): Insight[] => {
  const { getCurrentDayData } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const dayData = getCurrentDayData();
  const { totalMacros, water, meals } = dayData;

  const insights = useMemo(() => {
    return generateInsights({
      totalMacros: { ...totalMacros, water },
      goals,
      locale,
      mealsCount: meals.length,
      currentStreak,
    });
  }, [totalMacros, water, goals, locale, meals.length, currentStreak]);

  return insights;
};
