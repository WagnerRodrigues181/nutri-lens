import { describe, it, expect } from "vitest";
import { calculateStatistics } from "@/services/statistics";
import { mockNutritionHistory, mockGoals } from "../mockData";

describe("statistics service", () => {
  describe("calculateStatistics", () => {
    it("should return zero statistics for empty history", () => {
      const stats = calculateStatistics({}, mockGoals);

      expect(stats.averageCalories).toBe(0);
      expect(stats.averageProtein).toBe(0);
      expect(stats.totalDaysTracked).toBe(0);
      expect(stats.goalsMetCount).toBe(0);
    });

    it("should calculate average macros correctly", () => {
      const stats = calculateStatistics(mockNutritionHistory, mockGoals);

      expect(stats.averageCalories).toBe(350);
      expect(stats.averageProtein).toBe(45);
      expect(stats.averageCarbs).toBe(5);
      expect(stats.averageFat).toBe(15);
    });

    it("should track total days with data", () => {
      const stats = calculateStatistics(mockNutritionHistory, mockGoals);

      expect(stats.totalDaysTracked).toBe(2);
    });

    it("should identify best and worst days", () => {
      const stats = calculateStatistics(mockNutritionHistory, mockGoals);

      expect(stats.bestDay.date).toBeDefined();
      expect(stats.worstDay.date).toBeDefined();
      expect(stats.bestDay.accuracy).toBeGreaterThanOrEqual(
        stats.worstDay.accuracy
      );
    });

    it("should calculate goals met count", () => {
      const perfectHistory = {
        "2024-01-15": {
          date: "2024-01-15",
          meals: [
            {
              id: "1",
              name: "Perfect Meal",
              category: "lunch" as const,
              calories: 2000,
              protein: 150,
              carbs: 200,
              fat: 65,
              timestamp: "2024-01-15T12:00:00.000Z",
              date: "2024-01-15",
            },
          ],
          water: 2.0,
          totalMacros: {
            calories: 2000,
            protein: 150,
            carbs: 200,
            fat: 65,
          },
        },
      };

      const stats = calculateStatistics(perfectHistory, mockGoals);

      expect(stats.goalsMetCount).toBeGreaterThan(0);
    });

    it("should calculate average water intake", () => {
      const stats = calculateStatistics(mockNutritionHistory, mockGoals);

      expect(stats.averageWater).toBe(1.8);
    });

    it("should calculate accuracy for best day", () => {
      const stats = calculateStatistics(mockNutritionHistory, mockGoals);

      expect(stats.bestDay.accuracy).toBeGreaterThan(0);
      expect(stats.bestDay.accuracy).toBeLessThanOrEqual(100);
    });
  });
});
