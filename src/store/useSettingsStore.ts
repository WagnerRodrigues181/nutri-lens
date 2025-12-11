import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DailyGoals, UserProfile, Locale } from "@/types";

interface SettingsState {
  // Data
  goals: DailyGoals;
  profile: UserProfile;
  locale: Locale;

  // Actions
  updateGoals: (goals: Partial<DailyGoals>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setLocale: (locale: Locale) => void;
  resetGoals: () => void;
}

const defaultGoals: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  water: 2.0,
};

const defaultProfile: UserProfile = {
  weight: undefined,
  height: undefined,
  age: undefined,
  gender: undefined,
  activityLevel: undefined,
  goal: undefined,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      goals: defaultGoals,
      profile: defaultProfile,
      locale: "pt-BR",

      // Actions
      updateGoals: (newGoals) => {
        set((state) => ({
          goals: { ...state.goals, ...newGoals },
        }));
      },

      updateProfile: (newProfile) => {
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        }));
      },

      setLocale: (locale) => {
        set({ locale });
      },

      resetGoals: () => {
        set({ goals: defaultGoals });
      },
    }),
    {
      name: "nutrilens-settings-storage",
    }
  )
);
