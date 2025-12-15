import { describe, it, expect } from "vitest";
import { generateInsights } from "@/services/insights";
import { mockGoals } from "../mockData";

describe("insights service", () => {
  describe("generateInsights", () => {
    it("should generate no meals insight when no meals logged", () => {
      const insights = generateInsights({
        totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 },
        goals: mockGoals,
        locale: "pt-BR",
        mealsCount: 0,
        currentStreak: 0,
      });

      expect(insights).toHaveLength(1);
      expect(insights[0].message).toContain("refeições registradas");
      expect(insights[0].type).toBe("info");
    });

    it("should generate first meal insight", () => {
      const insights = generateInsights({
        totalMacros: {
          calories: 350,
          protein: 45,
          carbs: 5,
          fat: 15,
          water: 0,
        },
        goals: mockGoals,
        locale: "pt-BR",
        mealsCount: 1,
        currentStreak: 0,
      });

      const firstMealInsight = insights.find((i) =>
        i.message.includes("Primeira refeição")
      );
      expect(firstMealInsight).toBeDefined();
      expect(firstMealInsight?.type).toBe("success");
    });

    it("should generate perfect day insight when all goals met", () => {
      const insights = generateInsights({
        totalMacros: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
          water: 2.0,
        },
        goals: mockGoals,
        locale: "en-US",
        mealsCount: 3,
        currentStreak: 0,
      });

      const perfectDayInsight = insights.find((i) =>
        i.message.includes("Perfect day")
      );
      expect(perfectDayInsight).toBeDefined();
      expect(perfectDayInsight?.type).toBe("achievement");
    });

    it("should generate low intake warning", () => {
      const insights = generateInsights({
        totalMacros: {
          calories: 1000,
          protein: 50,
          carbs: 100,
          fat: 30,
          water: 1.0,
        },
        goals: mockGoals,
        locale: "pt-BR",
        mealsCount: 2,
        currentStreak: 0,
      });

      const lowCaloriesInsight = insights.find(
        (i) => i.type === "warning" && i.message.includes("calorias")
      );
      expect(lowCaloriesInsight).toBeDefined();
    });

    it("should generate streak insights for long streaks", () => {
      const insights = generateInsights({
        totalMacros: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
          water: 2.0,
        },
        goals: mockGoals,
        locale: "en-US",
        mealsCount: 3,
        currentStreak: 30,
      });

      const streakInsight = insights.find((i) => i.message.includes("30 day"));
      expect(streakInsight).toBeDefined();
      expect(streakInsight?.type).toBe("achievement");
    });

    it("should generate water reminder when low", () => {
      const insights = generateInsights({
        totalMacros: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
          water: 1.0,
        },
        goals: mockGoals,
        locale: "pt-BR",
        mealsCount: 3,
        currentStreak: 0,
      });

      const waterInsight = insights.find((i) => i.message.includes("água"));
      expect(waterInsight).toBeDefined();
      expect(waterInsight?.type).toBe("info");
    });

    it("should generate high protein insight", () => {
      const insights = generateInsights({
        totalMacros: {
          calories: 2000,
          protein: 200,
          carbs: 200,
          fat: 65,
          water: 2.0,
        },
        goals: mockGoals,
        locale: "en-US",
        mealsCount: 3,
        currentStreak: 0,
      });

      const proteinInsight = insights.find((i) =>
        i.message.includes("High protein")
      );
      expect(proteinInsight).toBeDefined();
    });
  });
});
