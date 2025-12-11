export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // in liters
}

export interface UserProfile {
  weight?: number; // in kg
  height?: number; // in cm
  age?: number;
  gender?: "male" | "female" | "other";
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal?: "lose_weight" | "maintain" | "gain_weight" | "gain_muscle";
}

export interface GoalsProgress {
  calories: number; // percentage 0-100+
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}
