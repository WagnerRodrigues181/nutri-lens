import type {
  Meal,
  MealTemplate,
  DailyNutrition,
  NutritionHistory,
  DailyGoals,
  UserProfile,
} from "@/types";

export const mockMeal: Meal = {
  id: "meal-1",
  name: "Frango Grelhado",
  category: "lunch",
  calories: 350,
  protein: 45,
  carbs: 5,
  fat: 15,
  timestamp: "2024-01-15T12:00:00.000Z",
  date: "2024-01-15",
};

export const mockMealTemplate: MealTemplate = {
  id: "template-1",
  name: "Frango com Batata Doce",
  category: "lunch",
  calories: 450,
  protein: 50,
  carbs: 40,
  fat: 10,
  isFavorite: true,
};

export const mockDailyNutrition: DailyNutrition = {
  date: "2024-01-15",
  meals: [mockMeal],
  water: 1.5,
  totalMacros: {
    calories: 350,
    protein: 45,
    carbs: 5,
    fat: 15,
  },
};

export const mockNutritionHistory: NutritionHistory = {
  "2024-01-15": mockDailyNutrition,
  "2024-01-14": {
    date: "2024-01-14",
    meals: [
      {
        ...mockMeal,
        id: "meal-2",
        date: "2024-01-14",
      },
    ],
    water: 2.0,
    totalMacros: {
      calories: 350,
      protein: 45,
      carbs: 5,
      fat: 15,
    },
  },
};

export const mockGoals: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  water: 2.0,
};

export const mockUserProfile: UserProfile = {
  weight: 75,
  height: 175,
  age: 30,
  gender: "male",
  activityLevel: "moderate",
  goal: "maintain",
};
