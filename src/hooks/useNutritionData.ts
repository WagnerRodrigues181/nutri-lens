import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getLastNDays } from "@/utils/dateHelpers";
import type { Macros } from "@/types";

interface DayData {
  date: string;
  meals: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export const useNutritionData = () => {
  const { history, currentDate } = useNutritionStore();
  const { goals } = useSettingsStore();

  /**
   * Get data for the last N days
   */
  const getLastDaysData = (days: number = 7): DayData[] => {
    const dates = getLastNDays(days, currentDate);

    return dates.map((date) => {
      const dayData = history[date];
      const totalMacros = dayData?.totalMacros || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      return {
        date,
        meals: dayData?.meals.length || 0,
        calories: totalMacros.calories,
        protein: totalMacros.protein,
        carbs: totalMacros.carbs,
        fat: totalMacros.fat,
        water: dayData?.water || 0,
      };
    });
  };

  /**
   * Get weekly average
   */
  const getWeeklyAverage = (): Macros & { water: number } => {
    const weekData = getLastDaysData(7);
    const daysWithData = weekData.filter((d) => d.meals > 0);

    if (daysWithData.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 };
    }

    const sum = daysWithData.reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
        water: acc.water + day.water,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 }
    );

    return {
      calories: Math.round(sum.calories / daysWithData.length),
      protein: Math.round(sum.protein / daysWithData.length),
      carbs: Math.round(sum.carbs / daysWithData.length),
      fat: Math.round(sum.fat / daysWithData.length),
      water: parseFloat((sum.water / daysWithData.length).toFixed(1)),
    };
  };

  /**
   * Get total meals count
   */
  const getTotalMealsCount = (): number => {
    return Object.values(history).reduce(
      (total, dayData) => total + dayData.meals.length,
      0
    );
  };

  /**
   * Get days with data count
   */
  const getDaysWithDataCount = (): number => {
    return Object.values(history).filter((dayData) => dayData.meals.length > 0)
      .length;
  };

  return {
    getLastDaysData,
    getWeeklyAverage,
    getTotalMealsCount,
    getDaysWithDataCount,
  };
};
