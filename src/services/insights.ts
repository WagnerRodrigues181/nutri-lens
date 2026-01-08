import type { Insight, DailyGoals, Macros } from "@/types";
import { calculateGoalsProgress } from "@/utils/calculations";

interface InsightGeneratorParams {
  totalMacros: Macros & { water: number };
  goals: DailyGoals;
  locale: "pt-BR" | "en-US";
  mealsCount: number;
  currentStreak: number;
}

const translations = {
  "pt-BR": {
    goalReached: "🎯 Meta atingida!",
    closeToGoal: "💪 Você está a {percent}% da meta de {nutrient}",
    exceededGoal: "⚠️ Você excedeu a meta de {nutrient} em {percent}%",
    lowIntake: "📉 {nutrient}: apenas {percent}% da meta",
    perfectDay: "🏆 Dia perfeito! Todas as metas foram atingidas!",
    noMeals: "🍽️ Ainda não há refeições registradas hoje",
    firstMeal: "✨ Primeira refeição do dia registrada!",
    goodProgress: "👍 Bom progresso! Continue assim",
    drinkWater: "💧 Lembre-se de beber mais água ({current}L de {goal}L)",
    waterGoalReached: "💧 Meta de água atingida!",
    highProtein: "💪 Alto consumo de proteína hoje!",
    balancedMacros: "⚖️ Macros bem equilibrados hoje",
    streak: "🔥 {days} dias consecutivos! Continue assim!",
    longStreak: "🏆 Incrível! {days} dias de sequência!",
  },
  "en-US": {
    goalReached: "🎯 Goal reached!",
    closeToGoal: "💪 You're {percent}% of your {nutrient} goal",
    exceededGoal: "⚠️ You exceeded your {nutrient} goal by {percent}%",
    lowIntake: "📉 {nutrient}: only {percent}% of goal",
    perfectDay: "🏆 Perfect day! All goals were met!",
    noMeals: "🍽️ No meals logged yet today",
    firstMeal: "✨ First meal of the day logged!",
    goodProgress: "👍 Good progress! Keep it up",
    drinkWater: "💧 Remember to drink more water ({current}L of {goal}L)",
    waterGoalReached: "💧 Water goal reached!",
    highProtein: "💪 High protein intake today!",
    balancedMacros: "⚖️ Well-balanced macros today",
    streak: "🔥 {days} consecutive days! Keep going!",
    longStreak: "🏆 Amazing! {days} day streak!",
  },
};

export const generateInsights = ({
  totalMacros,
  goals,
  locale,
  mealsCount,
  currentStreak,
}: InsightGeneratorParams): Insight[] => {
  const insights: Insight[] = [];
  const t = translations[locale];

  const progress = calculateGoalsProgress(totalMacros, goals);

  if (mealsCount === 0) {
    insights.push({
      id: crypto.randomUUID(),
      type: "info",
      message: t.noMeals,
      timestamp: new Date().toISOString(),
    });
    return insights;
  }

  if (mealsCount === 1) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: t.firstMeal,
      timestamp: new Date().toISOString(),
    });
  }

  const allGoalsMet = Object.values(progress).every((p) => p >= 95 && p <= 105);

  if (allGoalsMet) {
    insights.push({
      id: crypto.randomUUID(),
      type: "achievement",
      message: t.perfectDay,
      icon: "🏆",
      timestamp: new Date().toISOString(),
    });
  }

  const checkNutrient = (
    nutrient: keyof typeof progress,
    nutrientName: string
  ) => {
    const p = progress[nutrient];

    if (p >= 95 && p <= 105) {
      insights.push({
        id: crypto.randomUUID(),
        type: "success",
        message: t.goalReached.replace("{nutrient}", nutrientName),
        timestamp: new Date().toISOString(),
      });
    } else if (p >= 85 && p < 95) {
      insights.push({
        id: crypto.randomUUID(),
        type: "info",
        message: t.closeToGoal
          .replace("{percent}", Math.round(p).toString())
          .replace("{nutrient}", nutrientName),
        timestamp: new Date().toISOString(),
      });
    } else if (p > 105) {
      insights.push({
        id: crypto.randomUUID(),
        type: "warning",
        message: t.exceededGoal
          .replace("{nutrient}", nutrientName)
          .replace("{percent}", Math.round(p - 100).toString()),
        timestamp: new Date().toISOString(),
      });
    } else if (p < 85) {
      insights.push({
        id: crypto.randomUUID(),
        type: "warning",
        message: t.lowIntake
          .replace("{nutrient}", nutrientName)
          .replace("{percent}", Math.round(p).toString()),
        timestamp: new Date().toISOString(),
      });
    }
  };

  const nutrientNames = {
    calories: locale === "pt-BR" ? "calorias" : "calories",
    protein: locale === "pt-BR" ? "proteína" : "protein",
    carbs: locale === "pt-BR" ? "carboidratos" : "carbs",
    fat: locale === "pt-BR" ? "gordura" : "fat",
  };

  checkNutrient("calories", nutrientNames.calories);
  checkNutrient("protein", nutrientNames.protein);

  if (progress.water >= 95 && progress.water <= 105) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: t.waterGoalReached,
      timestamp: new Date().toISOString(),
    });
  } else if (progress.water < 80) {
    insights.push({
      id: crypto.randomUUID(),
      type: "info",
      message: t.drinkWater
        .replace("{current}", totalMacros.water.toFixed(1))
        .replace("{goal}", goals.water.toFixed(1)),
      timestamp: new Date().toISOString(),
    });
  }

  if (progress.protein > 120) {
    insights.push({
      id: crypto.randomUUID(),
      type: "info",
      message: t.highProtein,
      icon: "💪",
      timestamp: new Date().toISOString(),
    });
  }

  const macroVariance =
    Math.abs(progress.protein - 100) +
    Math.abs(progress.carbs - 100) +
    Math.abs(progress.fat - 100);

  if (macroVariance < 30 && mealsCount >= 3) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: t.balancedMacros,
      timestamp: new Date().toISOString(),
    });
  }

  if (currentStreak >= 30) {
    insights.push({
      id: crypto.randomUUID(),
      type: "achievement",
      message: t.longStreak.replace("{days}", currentStreak.toString()),
      icon: "🏆",
      timestamp: new Date().toISOString(),
    });
  } else if (currentStreak >= 7) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: t.streak.replace("{days}", currentStreak.toString()),
      icon: "🔥",
      timestamp: new Date().toISOString(),
    });
  }

  return insights;
};
