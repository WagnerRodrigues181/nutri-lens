import type { Achievement, NutritionHistory } from "@/types";

interface AchievementCheck {
  id: string;
  title: { "pt-BR": string; "en-US": string };
  description: { "pt-BR": string; "en-US": string };
  icon: string;
  check: (history: NutritionHistory, streak: number) => boolean;
}

const achievementDefinitions: AchievementCheck[] = [
  {
    id: "first-meal",
    title: {
      "pt-BR": "Primeira Refeição",
      "en-US": "First Meal",
    },
    description: {
      "pt-BR": "Registre sua primeira refeição",
      "en-US": "Log your first meal",
    },
    icon: "🍽️",
    check: (history) => {
      return Object.values(history).some((day) => day.meals.length > 0);
    },
  },
  {
    id: "streak-7",
    title: {
      "pt-BR": "Sequência de 7 Dias",
      "en-US": "7 Day Streak",
    },
    description: {
      "pt-BR": "Mantenha 7 dias consecutivos",
      "en-US": "Maintain a 7 day streak",
    },
    icon: "🔥",
    check: (_, streak) => streak >= 7,
  },
  {
    id: "streak-30",
    title: {
      "pt-BR": "Mestre da Consistência",
      "en-US": "Consistency Master",
    },
    description: {
      "pt-BR": "30 dias consecutivos de tracking",
      "en-US": "30 consecutive days of tracking",
    },
    icon: "🏆",
    check: (_, streak) => streak >= 30,
  },
  {
    id: "perfect-day",
    title: {
      "pt-BR": "Dia Perfeito",
      "en-US": "Perfect Day",
    },
    description: {
      "pt-BR": "Atinja todas as metas em um dia",
      "en-US": "Hit all goals in one day",
    },
    icon: "⭐",
    check: (history) => {
      return Object.values(history).some((day) => {
        const hasData = day.meals.length > 0;
        if (!hasData) return false;
        return true;
      });
    },
  },
  {
    id: "meals-100",
    title: {
      "pt-BR": "Centenário",
      "en-US": "Centurion",
    },
    description: {
      "pt-BR": "Registre 100 refeições",
      "en-US": "Log 100 meals",
    },
    icon: "💯",
    check: (history) => {
      const totalMeals = Object.values(history).reduce(
        (sum, day) => sum + day.meals.length,
        0
      );
      return totalMeals >= 100;
    },
  },
  {
    id: "protein-warrior",
    title: {
      "pt-BR": "Guerreiro da Proteína",
      "en-US": "Protein Warrior",
    },
    description: {
      "pt-BR": "Atinja a meta de proteína 7 dias seguidos",
      "en-US": "Hit protein goal 7 days in a row",
    },
    icon: "💪",
    check: (history) => {
      const days = Object.values(history).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      let consecutiveDays = 0;
      for (const day of days) {
        if (day.meals.length > 0 && day.totalMacros.protein > 0) {
          consecutiveDays++;
          if (consecutiveDays >= 7) return true;
        } else {
          break;
        }
      }
      return false;
    },
  },
  {
    id: "hydration-hero",
    title: {
      "pt-BR": "Herói da Hidratação",
      "en-US": "Hydration Hero",
    },
    description: {
      "pt-BR": "Beba 2L+ de água por 7 dias seguidos",
      "en-US": "Drink 2L+ water for 7 days straight",
    },
    icon: "💧",
    check: (history) => {
      const days = Object.values(history).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      let consecutiveDays = 0;
      for (const day of days) {
        if (day.water >= 2) {
          consecutiveDays++;
          if (consecutiveDays >= 7) return true;
        } else {
          break;
        }
      }
      return false;
    },
  },
  {
    id: "balanced",
    title: {
      "pt-BR": "Mestre do Equilíbrio",
      "en-US": "Balance Master",
    },
    description: {
      "pt-BR": "Mantenha macros equilibrados por 5 dias",
      "en-US": "Keep balanced macros for 5 days",
    },
    icon: "⚖️",
    check: (history) => {
      const daysWithBalance = Object.values(history).filter((day) => {
        if (day.meals.length === 0) return false;
        const proteinCal = day.totalMacros.protein * 4;
        const carbsCal = day.totalMacros.carbs * 4;
        const fatCal = day.totalMacros.fat * 9;
        const total = proteinCal + carbsCal + fatCal;
        if (total === 0) return false;
        const proteinPct = (proteinCal / total) * 100;
        const carbsPct = (carbsCal / total) * 100;
        const fatPct = (fatCal / total) * 100;
        return (
          proteinPct >= 25 &&
          proteinPct <= 35 &&
          carbsPct >= 35 &&
          carbsPct <= 50 &&
          fatPct >= 20 &&
          fatPct <= 35
        );
      });
      return daysWithBalance.length >= 5;
    },
  },
];

export const checkAchievements = (
  history: NutritionHistory,
  streak: number,
  locale: "pt-BR" | "en-US"
): Achievement[] => {
  return achievementDefinitions.map((def) => {
    const isUnlocked = def.check(history, streak);
    return {
      id: def.id,
      title: def.title[locale],
      description: def.description[locale],
      icon: def.icon,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
      progress: isUnlocked ? 100 : 0,
    };
  });
};
