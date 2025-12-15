import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useInsights } from "@/hooks/useInsights";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { mockDailyNutrition, mockGoals } from "../mockData";

describe("useInsights hook", () => {
  beforeEach(() => {
    useNutritionStore.setState({
      history: {
        "2024-01-15": mockDailyNutrition,
      },
      currentDate: "2024-01-15",
      templates: [],
    });

    useSettingsStore.setState({
      goals: mockGoals,
      locale: "pt-BR",
    });
  });

  it("should return array of insights", () => {
    const { result } = renderHook(() => useInsights());

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBeGreaterThan(0);
  });

  it("should return insights with required fields", () => {
    const { result } = renderHook(() => useInsights());
    const insight = result.current[0];

    expect(insight).toHaveProperty("id");
    expect(insight).toHaveProperty("type");
    expect(insight).toHaveProperty("message");
    expect(insight).toHaveProperty("timestamp");
  });

  it("should generate insights based on current day data", () => {
    const { result } = renderHook(() => useInsights());

    expect(result.current.length).toBeGreaterThan(0);
  });

  it("should include streak in insights when provided", () => {
    const { result } = renderHook(() => useInsights(7));

    const streakInsight = result.current.find((i) =>
      i.message.includes("dias consecutivos")
    );

    expect(streakInsight).toBeDefined();
  });

  it("should update insights when data changes", async () => {
    const { result, rerender } = renderHook(() => useInsights());
    const initialInsights = [...result.current];

    useNutritionStore.getState().addMeal({
      name: "Nova Refeição",
      category: "snack",
      calories: 200,
      protein: 15,
      carbs: 20,
      fat: 8,
    });

    rerender();

    await waitFor(() => {
      const currentInsights = result.current;
      const hasChanged =
        currentInsights.length !== initialInsights.length ||
        currentInsights.some(
          (insight, idx) => insight.message !== initialInsights[idx]?.message
        );
      expect(hasChanged).toBe(true);
    });
  });

  it("should respect locale setting", () => {
    useSettingsStore.setState({ locale: "en-US" });

    const { result } = renderHook(() => useInsights());

    const hasEnglishText = result.current.some((i) => /[A-Z]/.test(i.message));

    expect(hasEnglishText).toBe(true);
  });
});
