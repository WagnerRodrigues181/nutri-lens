export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal extends Macros {
  id: string;
  name: string;
  category: MealCategory;
  timestamp: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface MealTemplate extends Macros {
  id: string;
  name: string;
  category: MealCategory;
  isFavorite: boolean;
}

export interface DailyNutrition {
  date: string; // ISO date string (YYYY-MM-DD)
  meals: Meal[];
  water: number; // in liters
  totalMacros: Macros;
}

export interface NutritionHistory {
  [date: string]: DailyNutrition; // Key is ISO date string
}
