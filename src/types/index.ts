// Re-export all types from a single entry point
export type {
  MealCategory,
  Macros,
  Meal,
  MealTemplate,
  DailyNutrition,
  NutritionHistory,
} from "./nutrition";

export type { DailyGoals, UserProfile, GoalsProgress } from "./goals";

export type {
  InsightType,
  Insight,
  Achievement,
  StreakData,
  Statistics,
} from "./insights";

export type { Locale, Translation } from "./i18n";
