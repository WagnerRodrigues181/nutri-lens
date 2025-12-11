import type { Macros, DailyGoals, UserProfile, GoalsProgress } from "@/types";

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 */
export const calculateBMR = (profile: UserProfile): number | null => {
  const { weight, height, age, gender } = profile;

  if (!weight || !height || !age || !gender) return null;

  // Mifflin-St Jeor: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
  // s = +5 for males, -161 for females
  const s = gender === "male" ? 5 : gender === "female" ? -161 : -78;

  return 10 * weight + 6.25 * height - 5 * age + s;
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure) based on BMR and activity level
 */
export const calculateTDEE = (profile: UserProfile): number | null => {
  const bmr = calculateBMR(profile);
  if (!bmr || !profile.activityLevel) return null;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * activityMultipliers[profile.activityLevel]);
};

/**
 * Calculate recommended calorie intake based on user goal
 */
export const calculateCalorieGoal = (profile: UserProfile): number | null => {
  const tdee = calculateTDEE(profile);
  if (!tdee || !profile.goal) return null;

  const goalAdjustments = {
    lose_weight: -500, // 500 calorie deficit
    maintain: 0,
    gain_weight: 300, // 300 calorie surplus
    gain_muscle: 400, // 400 calorie surplus
  };

  return Math.round(tdee + goalAdjustments[profile.goal]);
};

/**
 * Calculate recommended macros based on calorie goal
 * Using 30% protein, 40% carbs, 30% fat distribution
 */
export const calculateMacroGoals = (
  calorieGoal: number
): Omit<DailyGoals, "water"> => {
  const proteinCalories = calorieGoal * 0.3;
  const carbsCalories = calorieGoal * 0.4;
  const fatCalories = calorieGoal * 0.3;

  return {
    calories: calorieGoal,
    protein: Math.round(proteinCalories / 4), // 4 calories per gram
    carbs: Math.round(carbsCalories / 4), // 4 calories per gram
    fat: Math.round(fatCalories / 9), // 9 calories per gram
  };
};

/**
 * Calculate progress percentage for a specific macro
 */
export const calculateProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.round((current / goal) * 100);
};

/**
 * Calculate all goals progress
 */
export const calculateGoalsProgress = (
  current: Macros & { water: number },
  goals: DailyGoals
): GoalsProgress => {
  return {
    calories: calculateProgress(current.calories, goals.calories),
    protein: calculateProgress(current.protein, goals.protein),
    carbs: calculateProgress(current.carbs, goals.carbs),
    fat: calculateProgress(current.fat, goals.fat),
    water: calculateProgress(current.water, goals.water),
  };
};

/**
 * Calculate remaining macros to reach goal
 */
export const calculateRemaining = (current: number, goal: number): number => {
  return Math.max(0, goal - current);
};

/**
 * Check if all goals are met (within 95-105% range)
 */
export const areGoalsMet = (progress: GoalsProgress): boolean => {
  const metrics = [
    progress.calories,
    progress.protein,
    progress.carbs,
    progress.fat,
    progress.water,
  ];
  return metrics.every((value) => value >= 95 && value <= 105);
};

/**
 * Calculate macro distribution percentage
 */
export const calculateMacroDistribution = (
  macros: Macros
): { protein: number; carbs: number; fat: number } => {
  const proteinCalories = macros.protein * 4;
  const carbsCalories = macros.carbs * 4;
  const fatCalories = macros.fat * 9;
  const total = proteinCalories + carbsCalories + fatCalories;

  if (total === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }

  return {
    protein: Math.round((proteinCalories / total) * 100),
    carbs: Math.round((carbsCalories / total) * 100),
    fat: Math.round((fatCalories / total) * 100),
  };
};
