import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieGoal,
  calculateMacroGoals,
  calculateProgress,
  calculateGoalsProgress,
  calculateRemaining,
  areGoalsMet,
  calculateMacroDistribution,
} from "@/utils/calculations";
import { mockUserProfile, mockGoals } from "../mockData";

describe("calculations", () => {
  describe("calculateBMR", () => {
    it("should calculate BMR for male", () => {
      const bmr = calculateBMR(mockUserProfile);
      expect(bmr).toBeGreaterThan(0);
      expect(bmr).toBeCloseTo(1698.75, 0);
    });

    it("should calculate BMR for female", () => {
      const profile = { ...mockUserProfile, gender: "female" as const };
      const bmr = calculateBMR(profile);
      expect(bmr).toBeGreaterThan(0);
      expect(bmr).toBeLessThan(calculateBMR(mockUserProfile)!);
    });

    it("should calculate BMR for other gender", () => {
      const profile = { ...mockUserProfile, gender: "other" as const };
      const bmr = calculateBMR(profile);
      expect(bmr).toBeGreaterThan(0);
      expect(bmr).toBeCloseTo(1615.75, 0);
    });

    it("should return null for incomplete profile", () => {
      expect(calculateBMR({})).toBeNull();
    });
  });

  describe("calculateTDEE", () => {
    it("should calculate TDEE with activity level", () => {
      const tdee = calculateTDEE(mockUserProfile);
      expect(tdee).toBeGreaterThan(0);
      expect(tdee).toBeCloseTo(2633, 0);
    });

    it("should return null without activity level", () => {
      const profile = { ...mockUserProfile, activityLevel: undefined };
      expect(calculateTDEE(profile)).toBeNull();
    });
  });

  describe("calculateCalorieGoal", () => {
    it("should calculate calorie goal for weight loss", () => {
      const profile = { ...mockUserProfile, goal: "lose_weight" as const };
      const goal = calculateCalorieGoal(profile);
      expect(goal).toBe(2133);
    });

    it("should calculate calorie goal for maintenance", () => {
      const goal = calculateCalorieGoal(mockUserProfile);
      expect(goal).toBe(2633);
    });

    it("should calculate calorie goal for weight gain", () => {
      const profile = { ...mockUserProfile, goal: "gain_weight" as const };
      const goal = calculateCalorieGoal(profile);
      expect(goal).toBe(2933);
    });

    it("should calculate calorie goal for maintain", () => {
      const profile = { ...mockUserProfile, goal: "maintain" as const };
      const goal = calculateCalorieGoal(profile);
      expect(goal).toBe(2633);
    });

    it("should calculate calorie goal for gain muscle", () => {
      const profile = { ...mockUserProfile, goal: "gain_muscle" as const };
      const goal = calculateCalorieGoal(profile);
      expect(goal).toBe(3033);
    });

    it("should return null when goal is not defined", () => {
      const profile = { ...mockUserProfile, goal: undefined };
      const goal = calculateCalorieGoal(profile);
      expect(goal).toBeNull();
    });
  });

  describe("calculateMacroGoals", () => {
    it("should calculate macro goals from calories", () => {
      const macros = calculateMacroGoals(2000);
      expect(macros.calories).toBe(2000);
      expect(macros.protein).toBe(150);
      expect(macros.carbs).toBe(200);
      expect(macros.fat).toBe(67);
    });
  });

  describe("calculateProgress", () => {
    it("should calculate progress percentage", () => {
      expect(calculateProgress(100, 200)).toBe(50);
      expect(calculateProgress(200, 200)).toBe(100);
      expect(calculateProgress(300, 200)).toBe(150);
    });

    it("should handle zero goal", () => {
      expect(calculateProgress(100, 0)).toBe(0);
    });
  });

  describe("calculateGoalsProgress", () => {
    it("should calculate all goals progress", () => {
      const current = {
        calories: 1800,
        protein: 135,
        carbs: 180,
        fat: 58,
        water: 1.8,
      };

      const progress = calculateGoalsProgress(current, mockGoals);

      expect(progress.calories).toBe(90);
      expect(progress.protein).toBe(90);
      expect(progress.carbs).toBe(90);
      expect(progress.fat).toBe(89);
      expect(progress.water).toBe(90);
    });
  });

  describe("calculateRemaining", () => {
    it("should calculate remaining amount", () => {
      expect(calculateRemaining(100, 200)).toBe(100);
      expect(calculateRemaining(250, 200)).toBe(0);
    });

    it("should never return negative", () => {
      expect(calculateRemaining(300, 200)).toBe(0);
    });
  });

  describe("areGoalsMet", () => {
    it("should return true when all goals are met", () => {
      const progress = {
        calories: 100,
        protein: 98,
        carbs: 102,
        fat: 97,
        water: 103,
      };
      expect(areGoalsMet(progress)).toBe(true);
    });

    it("should return false when goals are not met", () => {
      const progress = {
        calories: 100,
        protein: 85,
        carbs: 102,
        fat: 97,
        water: 103,
      };
      expect(areGoalsMet(progress)).toBe(false);
    });
  });

  describe("calculateMacroDistribution", () => {
    it("should calculate macro distribution percentages", () => {
      const macros = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 67,
      };

      const distribution = calculateMacroDistribution(macros);

      expect(distribution.protein).toBeGreaterThan(0);
      expect(distribution.carbs).toBeGreaterThan(0);
      expect(distribution.fat).toBeGreaterThan(0);
      expect(
        distribution.protein + distribution.carbs + distribution.fat
      ).toBeLessThanOrEqual(101);
    });

    it("should handle zero macros", () => {
      const macros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      const distribution = calculateMacroDistribution(macros);

      expect(distribution.protein).toBe(0);
      expect(distribution.carbs).toBe(0);
      expect(distribution.fat).toBe(0);
    });
  });
});
