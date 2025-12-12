import type { NutritionHistory, Statistics, DailyGoals } from "@/types";
import { calculateGoalsProgress } from "@/utils/calculations";

/**
 * Calculate comprehensive statistics from nutrition history
 */
export const calculateStatistics = (
  history: NutritionHistory,
  goals: DailyGoals
): Statistics => {
  const daysWithData = Object.values(history).filter(
    (day) => day.meals.length > 0
  );

  if (daysWithData.length === 0) {
    return {
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      averageWater: 0,
      bestDay: { date: "", accuracy: 0 },
      worstDay: { date: "", accuracy: 0 },
      goalsMetCount: 0,
      totalDaysTracked: 0,
    };
  }

  const totals = daysWithData.reduce(
    (acc, day) => ({
      calories: acc.calories + day.totalMacros.calories,
      protein: acc.protein + day.totalMacros.protein,
      carbs: acc.carbs + day.totalMacros.carbs,
      fat: acc.fat + day.totalMacros.fat,
      water: acc.water + day.water,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 }
  );

  const count = daysWithData.length;

  const daysWithAccuracy = daysWithData.map((day) => {
    const progress = calculateGoalsProgress(
      { ...day.totalMacros, water: day.water },
      goals
    );

    const accuracies = [
      100 - Math.abs(progress.calories - 100),
      100 - Math.abs(progress.protein - 100),
      100 - Math.abs(progress.carbs - 100),
      100 - Math.abs(progress.fat - 100),
      100 - Math.abs(progress.water - 100),
    ];

    const averageAccuracy =
      accuracies.reduce((sum, acc) => sum + Math.max(0, acc), 0) /
      accuracies.length;

    return {
      date: day.date,
      accuracy: averageAccuracy,
    };
  });

  const sortedByAccuracy = [...daysWithAccuracy].sort(
    (a, b) => b.accuracy - a.accuracy
  );

  const bestDay = sortedByAccuracy[0];
  const worstDay = sortedByAccuracy[sortedByAccuracy.length - 1];

  const goalsMetCount = daysWithData.filter((day) => {
    const progress = calculateGoalsProgress(
      { ...day.totalMacros, water: day.water },
      goals
    );

    return Object.values(progress).every((p) => p >= 95 && p <= 105);
  }).length;

  return {
    averageCalories: Math.round(totals.calories / count),
    averageProtein: Math.round(totals.protein / count),
    averageCarbs: Math.round(totals.carbs / count),
    averageFat: Math.round(totals.fat / count),
    averageWater: parseFloat((totals.water / count).toFixed(1)),
    bestDay: {
      date: bestDay.date,
      accuracy: Math.round(bestDay.accuracy),
    },
    worstDay: {
      date: worstDay.date,
      accuracy: Math.round(worstDay.accuracy),
    },
    goalsMetCount,
    totalDaysTracked: count,
  };
};
