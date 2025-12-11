import type {
  Insight,
  InsightType,
  DailyNutrition,
  DailyGoals,
  GoalsProgress,
  StreakData,
  NutritionHistory,
} from "@/types";
import { calculateRemaining } from "@/utils/calculations";
import { getTodayDate, getPreviousDay, parseDate } from "@/utils/dateHelpers";

/**
 * Generate insights based on current day progress
 */
export const generateDailyInsights = (
  currentDay: DailyNutrition,
  goals: DailyGoals,
  progress: GoalsProgress
): Insight[] => {
  const insights: Insight[] = [];
  const now = new Date().toISOString();

  // Calories insight
  if (progress.calories >= 95 && progress.calories <= 105) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: `🎯 Você atingiu ${progress.calories}% da meta de calorias hoje!`,
      timestamp: now,
    });
  } else if (progress.calories > 105) {
    insights.push({
      id: crypto.randomUUID(),
      type: "warning",
      message: `⚠️ Calorias: ${Math.round(currentDay.totalMacros.calories)}/${
        goals.calories
      } kcal (+${progress.calories - 100}%)`,
      timestamp: now,
    });
  } else if (progress.calories < 50) {
    insights.push({
      id: crypto.randomUUID(),
      type: "info",
      message: `📊 Você está em ${progress.calories}% da meta. Continue registrando suas refeições!`,
      timestamp: now,
    });
  }

  // Protein insight
  const remainingProtein = calculateRemaining(
    currentDay.totalMacros.protein,
    goals.protein
  );
  if (progress.protein >= 95 && progress.protein <= 105) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: `💪 Meta de proteína alcançada! ${Math.round(
        currentDay.totalMacros.protein
      )}g/${goals.protein}g`,
      timestamp: now,
    });
  } else if (remainingProtein > 0 && progress.calories > 70) {
    insights.push({
      id: crypto.randomUUID(),
      type: "info",
      message: `💪 Faltam ${Math.round(
        remainingProtein
      )}g de proteína para sua meta`,
      timestamp: now,
    });
  }

  // Water insight
  if (progress.water >= 100) {
    insights.push({
      id: crypto.randomUUID(),
      type: "success",
      message: `💧 Excelente! Você atingiu sua meta de água (${currentDay.water.toFixed(
        1
      )}L)`,
      timestamp: now,
    });
  } else if (progress.water < 50) {
    insights.push({
      id: crypto.randomUUID(),
      type: "info",
      message: `💧 Lembre-se de beber mais água (${currentDay.water.toFixed(
        1
      )}L/${goals.water}L)`,
      timestamp: now,
    });
  }

  // Carbs excess warning
  if (progress.carbs > 120) {
    insights.push({
      id: crypto.randomUUID(),
      type: "warning",
      message: `⚠️ Carboidratos: ${Math.round(currentDay.totalMacros.carbs)}g/${
        goals.carbs
      }g (+${progress.carbs - 100}%)`,
      timestamp: now,
    });
  }

  // Fat excess warning
  if (progress.fat > 120) {
    insights.push({
      id: crypto.randomUUID(),
      type: "warning",
      message: `⚠️ Gordura: ${Math.round(currentDay.totalMacros.fat)}g/${
        goals.fat
      }g (+${progress.fat - 100}%)`,
      timestamp: now,
    });
  }

  // All goals met
  if (
    progress.calories >= 95 &&
    progress.calories <= 105 &&
    progress.protein >= 95 &&
    progress.protein <= 105 &&
    progress.carbs >= 95 &&
    progress.carbs <= 105 &&
    progress.fat >= 95 &&
    progress.fat <= 105 &&
    progress.water >= 95
  ) {
    insights.push({
      id: crypto.randomUUID(),
      type: "achievement",
      message: `🏆 Parabéns! Você atingiu todas as suas metas hoje!`,
      timestamp: now,
    });
  }

  return insights;
};

/**
 * Calculate streak data (consecutive days with activity)
 */
export const calculateStreak = (history: NutritionHistory): StreakData => {
  const today = getTodayDate();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastActivityDate: string | null = null;

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(history).sort(
    (a, b) => parseDate(b).getTime() - parseDate(a).getTime()
  );

  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  }

  lastActivityDate = sortedDates[0];

  // Calculate current streak (must include today or yesterday)
  let checkDate = today;
  while (history[checkDate] && history[checkDate].meals.length > 0) {
    currentStreak++;
    checkDate = getPreviousDay(checkDate);
  }

  // If today has no activity, check if yesterday does
  if (currentStreak === 0) {
    checkDate = getPreviousDay(today);
    if (history[checkDate] && history[checkDate].meals.length > 0) {
      currentStreak = 1;
      checkDate = getPreviousDay(checkDate);

      while (history[checkDate] && history[checkDate].meals.length > 0) {
        currentStreak++;
        checkDate = getPreviousDay(checkDate);
      }
    }
  }

  // Calculate longest streak
  sortedDates.forEach((date) => {
    if (history[date] && history[date].meals.length > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
  };
};

/**
 * Generate streak insights
 */
export const generateStreakInsight = (streak: StreakData): Insight | null => {
  if (streak.currentStreak === 0) return null;

  const messages: Record<number, string> = {
    3: "🔥 3 dias consecutivos! Continue assim!",
    7: "🔥 Streak de 7 dias! Você está no caminho certo!",
    14: "🔥 14 dias de streak! Incrível!",
    30: "🔥 30 dias de streak! Você é dedicado!",
    60: "🔥 60 dias de streak! Lendário!",
    90: "🔥 90 dias de streak! Você é imparável!",
  };

  const milestones = Object.keys(messages)
    .map(Number)
    .sort((a, b) => b - a);
  const milestone = milestones.find((m) => streak.currentStreak >= m);

  if (milestone) {
    return {
      id: crypto.randomUUID(),
      type: "achievement",
      message: messages[milestone],
      timestamp: new Date().toISOString(),
    };
  }

  if (streak.currentStreak >= 2) {
    return {
      id: crypto.randomUUID(),
      type: "success",
      message: `🔥 Streak de ${streak.currentStreak} dias! Continue assim!`,
      timestamp: new Date().toISOString(),
    };
  }

  return null;
};
