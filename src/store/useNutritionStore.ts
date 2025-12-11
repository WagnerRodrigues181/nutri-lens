import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import type {
  Meal,
  MealTemplate,
  NutritionHistory,
  DailyNutrition,
  Macros,
} from "@/types";

interface NutritionState {
  // Data
  history: NutritionHistory;
  templates: MealTemplate[];
  currentDate: string;

  // Actions - Meals
  addMeal: (meal: Omit<Meal, "id" | "timestamp" | "date">) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;

  // Actions - Templates
  addTemplate: (template: Omit<MealTemplate, "id">) => void;
  updateTemplate: (id: string, template: Partial<MealTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addMealFromTemplate: (templateId: string) => void;

  // Actions - Water
  updateWater: (date: string, amount: number) => void;

  // Actions - Date Navigation
  setCurrentDate: (date: string) => void;

  // Selectors
  getCurrentDayData: () => DailyNutrition;
  getTotalMacros: (date: string) => Macros;
}

const createEmptyDayData = (date: string): DailyNutrition => ({
  date,
  meals: [],
  water: 0,
  totalMacros: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
});

const calculateTotalMacros = (meals: Meal[]): Macros => {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      // Initial state
      history: {},
      templates: [],
      currentDate: format(new Date(), "yyyy-MM-dd"),

      // Meal actions
      addMeal: (mealData) => {
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        const date = get().currentDate;

        const meal: Meal = {
          ...mealData,
          id,
          timestamp,
          date,
        };

        set((state) => {
          const dayData = state.history[date] || createEmptyDayData(date);
          const updatedMeals = [...dayData.meals, meal];

          return {
            history: {
              ...state.history,
              [date]: {
                ...dayData,
                meals: updatedMeals,
                totalMacros: calculateTotalMacros(updatedMeals),
              },
            },
          };
        });
      },

      updateMeal: (id, updates) => {
        set((state) => {
          const date = get().currentDate;
          const dayData = state.history[date];

          if (!dayData) return state;

          const updatedMeals = dayData.meals.map((meal) =>
            meal.id === id ? { ...meal, ...updates } : meal
          );

          return {
            history: {
              ...state.history,
              [date]: {
                ...dayData,
                meals: updatedMeals,
                totalMacros: calculateTotalMacros(updatedMeals),
              },
            },
          };
        });
      },

      deleteMeal: (id) => {
        set((state) => {
          const date = get().currentDate;
          const dayData = state.history[date];

          if (!dayData) return state;

          const updatedMeals = dayData.meals.filter((meal) => meal.id !== id);

          return {
            history: {
              ...state.history,
              [date]: {
                ...dayData,
                meals: updatedMeals,
                totalMacros: calculateTotalMacros(updatedMeals),
              },
            },
          };
        });
      },

      // Template actions
      addTemplate: (templateData) => {
        const id = crypto.randomUUID();
        const template: MealTemplate = { ...templateData, id };

        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      addMealFromTemplate: (templateId) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return;

        get().addMeal({
          name: template.name,
          category: template.category,
          calories: template.calories,
          protein: template.protein,
          carbs: template.carbs,
          fat: template.fat,
        });
      },

      // Water actions
      updateWater: (date, amount) => {
        set((state) => {
          const dayData = state.history[date] || createEmptyDayData(date);

          return {
            history: {
              ...state.history,
              [date]: {
                ...dayData,
                water: amount,
              },
            },
          };
        });
      },

      // Date navigation
      setCurrentDate: (date) => {
        set({ currentDate: date });
      },

      // Selectors
      getCurrentDayData: () => {
        const date = get().currentDate;
        return get().history[date] || createEmptyDayData(date);
      },

      getTotalMacros: (date) => {
        const dayData = get().history[date];
        return (
          dayData?.totalMacros || { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
      },
    }),
    {
      name: "nutrilens-nutrition-storage",
    }
  )
);
