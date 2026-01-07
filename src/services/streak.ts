import type { NutritionHistory, DailyGoals } from "@/types";
import { format, subDays, parseISO, differenceInDays } from "date-fns";
import { calculateProgress } from "../utils/calculations";

export const isDayGoalMet = (
  history: NutritionHistory,
  date: string,
  goals: DailyGoals
): boolean => {
  const dayData = history[date];

  // Day must have data to count
  if (!dayData || dayData.meals.length === 0) {
    return false;
  }

  const { totalMacros, water } = dayData;

  // Calculate progress for each metric (0-100+)
  const caloriesProgress = calculateProgress(
    totalMacros.calories,
    goals.calories
  );
  const proteinProgress = calculateProgress(totalMacros.protein, goals.protein);
  const carbsProgress = calculateProgress(totalMacros.carbs, goals.carbs);
  const fatProgress = calculateProgress(totalMacros.fat, goals.fat);
  const waterProgress = calculateProgress(water, goals.water);

  // All metrics must be >= 80% to count as "goal met"
  return (
    caloriesProgress >= 80 &&
    proteinProgress >= 80 &&
    carbsProgress >= 80 &&
    fatProgress >= 80 &&
    waterProgress >= 80
  );
};

export const calculateCurrentStreak = (
  history: NutritionHistory,
  goals: DailyGoals
): number => {
  const allDates = Object.keys(history)
    .filter((date) => history[date].meals.length > 0)
    .sort()
    .reverse();

  if (allDates.length === 0) return 0;

  let streak = 0;
  let expectedDate = parseISO(allDates[0]); // Start from most recent date with data

  for (const dateStr of allDates) {
    const currentDate = parseISO(dateStr);

    // Check if this date is the expected consecutive date
    const daysDiff = differenceInDays(expectedDate, currentDate);

    // If gap is more than 0 days, streak is broken
    if (daysDiff > 0) {
      break;
    }

    // Check if this day met the goals
    if (!isDayGoalMet(history, dateStr, goals)) {
      break;
    }

    streak++;

    // Next expected date is one day before current
    expectedDate = subDays(currentDate, 1);
  }

  return streak;
};

/**
 * Calculate the longest streak ever achieved
 */
export const calculateLongestStreak = (
  history: NutritionHistory,
  goals: DailyGoals
): number => {
  const allDates = Object.keys(history).sort();

  if (allDates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const dateStr of allDates) {
    const currentDate = parseISO(dateStr);

    if (isDayGoalMet(history, dateStr, goals)) {
      if (previousDate) {
        const daysDiff = differenceInDays(currentDate, previousDate);

        if (daysDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      longestStreak = Math.max(longestStreak, currentStreak);
      previousDate = currentDate;
    } else {
      // Goals not met, reset current streak
      currentStreak = 0;
      previousDate = null;
    }
  }

  return longestStreak;
};

/**
 * Get streak statistics
 */
export const getStreakStats = (
  history: NutritionHistory,
  goals: DailyGoals
): {
  current: number;
  longest: number;
  todayComplete: boolean;
} => {
  const current = calculateCurrentStreak(history, goals);
  const longest = calculateLongestStreak(history, goals);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayComplete = isDayGoalMet(history, today, goals);

  return {
    current,
    longest,
    todayComplete,
  };
};
