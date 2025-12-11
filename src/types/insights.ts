export type InsightType = "success" | "warning" | "info" | "achievement";

export interface Insight {
  id: string;
  type: InsightType;
  message: string;
  icon?: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number; // 0-100
  isUnlocked: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface Statistics {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
  bestDay: {
    date: string;
    accuracy: number; // how close to goals (0-100)
  };
  worstDay: {
    date: string;
    accuracy: number;
  };
  goalsMetCount: number; // days where all goals were met
  totalDaysTracked: number;
}
