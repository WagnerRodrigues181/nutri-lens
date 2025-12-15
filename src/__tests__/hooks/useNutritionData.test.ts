import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNutritionData } from "@/hooks/useNutritionData";
import { useNutritionStore } from "@/store/useNutritionStore";
import { mockNutritionHistory } from "../mockData";

describe("useNutritionData hook", () => {
  beforeEach(() => {
    const store = useNutritionStore.getState();
    store.history = mockNutritionHistory;
    store.currentDate = "2024-01-15";
  });

  describe("getLastDaysData", () => {
    it("should return data for last N days", () => {
      const { result } = renderHook(() => useNutritionData());
      const data = result.current.getLastDaysData(2);

      expect(data).toHaveLength(2);
      expect(data[0].date).toBeDefined();
      expect(data[0].meals).toBeGreaterThanOrEqual(0);
    });

    it("should include all required fields", () => {
      const { result } = renderHook(() => useNutritionData());
      const data = result.current.getLastDaysData(1);

      const dayData = data[0];
      expect(dayData).toHaveProperty("date");
      expect(dayData).toHaveProperty("meals");
      expect(dayData).toHaveProperty("calories");
      expect(dayData).toHaveProperty("protein");
      expect(dayData).toHaveProperty("carbs");
      expect(dayData).toHaveProperty("fat");
      expect(dayData).toHaveProperty("water");
    });
  });

  describe("getWeeklyAverage", () => {
    it("should calculate weekly averages", () => {
      const { result } = renderHook(() => useNutritionData());
      const average = result.current.getWeeklyAverage();

      expect(average.calories).toBeGreaterThanOrEqual(0);
      expect(average.protein).toBeGreaterThanOrEqual(0);
      expect(average.carbs).toBeGreaterThanOrEqual(0);
      expect(average.fat).toBeGreaterThanOrEqual(0);
      expect(average.water).toBeGreaterThanOrEqual(0);
    });

    it("should return zeros for empty history", () => {
      useNutritionStore.getState().history = {};

      const { result } = renderHook(() => useNutritionData());
      const average = result.current.getWeeklyAverage();

      expect(average.calories).toBe(0);
      expect(average.protein).toBe(0);
    });
  });

  describe("getTotalMealsCount", () => {
    it("should count total meals across all days", () => {
      const { result } = renderHook(() => useNutritionData());
      const count = result.current.getTotalMealsCount();

      expect(count).toBe(2);
    });

    it("should return 0 for empty history", () => {
      useNutritionStore.getState().history = {};

      const { result } = renderHook(() => useNutritionData());
      const count = result.current.getTotalMealsCount();

      expect(count).toBe(0);
    });
  });

  describe("getDaysWithDataCount", () => {
    it("should count days with meals", () => {
      const { result } = renderHook(() => useNutritionData());
      const count = result.current.getDaysWithDataCount();

      expect(count).toBe(2);
    });

    it("should exclude days without meals", () => {
      const historyWithEmpty = {
        ...mockNutritionHistory,
        "2024-01-16": {
          date: "2024-01-16",
          meals: [],
          water: 0,
          totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        },
      };

      useNutritionStore.getState().history = historyWithEmpty;

      const { result } = renderHook(() => useNutritionData());
      const count = result.current.getDaysWithDataCount();

      expect(count).toBe(2);
    });
  });
});
