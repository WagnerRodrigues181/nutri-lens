export type Locale = "pt-BR" | "en-US";

export interface Translation {
  common: {
    appName: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    add: string;
    close: string;
    confirm: string;
    search: string;
    loading: string;
  };
  dashboard: {
    title: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    water: string;
    dailyGoal: string;
    currentStreak: string;
    days: string;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    addMeal: string;
    editMeal: string;
    mealName: string;
    category: string;
    noMeals: string;
    favorites: string;
    addToFavorites: string;
  };
  goals: {
    title: string;
    setGoals: string;
    dailyGoals: string;
    editGoals: string;
    caloriesGoal: string;
    proteinGoal: string;
    carbsGoal: string;
    fatGoal: string;
    waterGoal: string;
  };
  insights: {
    title: string;
    achievements: string;
    statistics: string;
    noInsights: string;
  };
  export: {
    title: string;
    exportData: string;
    exportCSV: string;
    exportJSON: string;
    weeklyReport: string;
    monthlyReport: string;
  };
}
