import type { NutritionHistory, DailyGoals, Statistics } from "@/types";
import { getLastNDays } from "../utils/dateHelpers";
import { calculateProgress } from "../utils/calculations";

/**
 * Calculate average macros for a date range
 */
export const calculateAverageMacros = (
  history: NutritionHistory,
  dates: string[]
): {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
} => {
  const daysWithData = dates.filter((date) => history[date]);

  if (daysWithData.length === 0) {
    return {
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      averageWater: 0,
    };
  }

  const totals = daysWithData.reduce(
    (acc, date) => {
      const dayData = history[date];
      return {
        calories: acc.calories + dayData.totalMacros.calories,
        protein: acc.protein + dayData.totalMacros.protein,
        carbs: acc.carbs + dayData.totalMacros.carbs,
        fat: acc.fat + dayData.totalMacros.fat,
        water: acc.water + dayData.water,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 }
  );

  const count = daysWithData.length;

  return {
    averageCalories: Math.round(totals.calories / count),
    averageProtein: Math.round(totals.protein / count),
    averageCarbs: Math.round(totals.carbs / count),
    averageFat: Math.round(totals.fat / count),
    averageWater: Number((totals.water / count).toFixed(1)),
  };
};

/**
 * Calculate goal accuracy for a specific day (0-100)
 * Returns how close the user was to their goals
 */
export const calculateDayAccuracy = (
  history: NutritionHistory,
  date: string,
  goals: DailyGoals
): number => {
  const dayData = history[date];
  if (!dayData) return 0;

  const { totalMacros, water } = dayData;

  // Calculate how close each metric is to goal (penalty for going over or under)
  const caloriesAccuracy =
    100 -
    Math.abs(calculateProgress(totalMacros.calories, goals.calories) - 100);
  const proteinAccuracy =
    100 - Math.abs(calculateProgress(totalMacros.protein, goals.protein) - 100);
  const carbsAccuracy =
    100 - Math.abs(calculateProgress(totalMacros.carbs, goals.carbs) - 100);
  const fatAccuracy =
    100 - Math.abs(calculateProgress(totalMacros.fat, goals.fat) - 100);
  const waterAccuracy =
    100 - Math.abs(calculateProgress(water, goals.water) - 100);

  // Average accuracy across all metrics
  const totalAccuracy =
    (caloriesAccuracy +
      proteinAccuracy +
      carbsAccuracy +
      fatAccuracy +
      waterAccuracy) /
    5;

  return Math.max(0, Math.min(100, Math.round(totalAccuracy)));
};

/**
 * Find best and worst days in a date range based on goal accuracy
 */
export const findBestAndWorstDays = (
  history: NutritionHistory,
  dates: string[],
  goals: DailyGoals
): {
  bestDay: { date: string; accuracy: number };
  worstDay: { date: string; accuracy: number };
} => {
  const daysWithData = dates.filter((date) => history[date]);

  if (daysWithData.length === 0) {
    return {
      bestDay: { date: "", accuracy: 0 },
      worstDay: { date: "", accuracy: 0 },
    };
  }

  let bestDay = { date: daysWithData[0], accuracy: 0 };
  let worstDay = { date: daysWithData[0], accuracy: 100 };

  daysWithData.forEach((date) => {
    const accuracy = calculateDayAccuracy(history, date, goals);

    if (accuracy > bestDay.accuracy) {
      bestDay = { date, accuracy };
    }

    if (accuracy < worstDay.accuracy) {
      worstDay = { date, accuracy };
    }
  });

  return { bestDay, worstDay };
};

/**
 * Count days where all goals were met (95-105% accuracy)
 */
export const countGoalsMetDays = (
  history: NutritionHistory,
  dates: string[],
  goals: DailyGoals
): number => {
  return dates.filter((date) => {
    const accuracy = calculateDayAccuracy(history, date, goals);
    return accuracy >= 95;
  }).length;
};

/**
 * Calculate comprehensive statistics for a period
 */
export const calculateStatistics = (
  history: NutritionHistory,
  goals: DailyGoals,
  days: number = 30
): Statistics => {
  const dates = getLastNDays(days);
  const daysWithData = dates.filter((date) => history[date]);

  const averages = calculateAverageMacros(history, dates);
  const { bestDay, worstDay } = findBestAndWorstDays(history, dates, goals);
  const goalsMetCount = countGoalsMetDays(history, dates, goals);

  return {
    ...averages,
    bestDay,
    worstDay,
    goalsMetCount,
    totalDaysTracked: daysWithData.length,
  };
};
