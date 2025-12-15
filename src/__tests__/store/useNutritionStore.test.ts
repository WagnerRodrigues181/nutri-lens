import { describe, it, expect, beforeEach } from "vitest";
import { useNutritionStore } from "@/store/useNutritionStore";
import { mockMeal, mockMealTemplate } from "../mockData";

describe("useNutritionStore", () => {
  beforeEach(() => {
    useNutritionStore.setState({
      history: {},
      templates: [],
      currentDate: "2024-01-15",
    });
  });

  describe("addMeal", () => {
    it("should add meal to current date", () => {
      const store = useNutritionStore.getState();
      const mealData = {
        name: mockMeal.name,
        category: mockMeal.category,
        calories: mockMeal.calories,
        protein: mockMeal.protein,
        carbs: mockMeal.carbs,
        fat: mockMeal.fat,
      };

      store.addMeal(mealData);

      const dayData = useNutritionStore.getState().getCurrentDayData();
      expect(dayData.meals).toHaveLength(1);
      expect(dayData.meals[0].name).toBe(mockMeal.name);
    });

    it("should calculate total macros", () => {
      const store = useNutritionStore.getState();

      store.addMeal({
        name: "Meal 1",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
      });

      const dayData = useNutritionStore.getState().getCurrentDayData();
      expect(dayData.totalMacros.calories).toBe(500);
      expect(dayData.totalMacros.protein).toBe(50);
    });
  });

  describe("updateMeal", () => {
    it("should update existing meal", () => {
      const store = useNutritionStore.getState();

      store.addMeal({
        name: "Original",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
      });

      const dayData = useNutritionStore.getState().getCurrentDayData();
      const mealId = dayData.meals[0].id;

      store.updateMeal(mealId, { name: "Updated" });

      const updatedData = useNutritionStore.getState().getCurrentDayData();
      expect(updatedData.meals[0].name).toBe("Updated");
    });

    it("should recalculate totals after update", () => {
      const store = useNutritionStore.getState();

      store.addMeal({
        name: "Meal",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
      });

      const dayData = useNutritionStore.getState().getCurrentDayData();
      const mealId = dayData.meals[0].id;

      store.updateMeal(mealId, { calories: 1000 });

      const updatedData = useNutritionStore.getState().getCurrentDayData();
      expect(updatedData.totalMacros.calories).toBe(1000);
    });
  });

  describe("deleteMeal", () => {
    it("should remove meal", () => {
      const store = useNutritionStore.getState();

      store.addMeal({
        name: "Meal",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
      });

      const dayData = useNutritionStore.getState().getCurrentDayData();
      const mealId = dayData.meals[0].id;

      store.deleteMeal(mealId);

      const updatedData = useNutritionStore.getState().getCurrentDayData();
      expect(updatedData.meals).toHaveLength(0);
    });

    it("should recalculate totals after delete", () => {
      const store = useNutritionStore.getState();

      store.addMeal({
        name: "Meal",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
      });

      const dayData = useNutritionStore.getState().getCurrentDayData();
      const mealId = dayData.meals[0].id;

      store.deleteMeal(mealId);

      const updatedData = useNutritionStore.getState().getCurrentDayData();
      expect(updatedData.totalMacros.calories).toBe(0);
    });
  });

  describe("templates", () => {
    it("should add template", () => {
      const store = useNutritionStore.getState();

      store.addTemplate({
        name: mockMealTemplate.name,
        category: mockMealTemplate.category,
        calories: mockMealTemplate.calories,
        protein: mockMealTemplate.protein,
        carbs: mockMealTemplate.carbs,
        fat: mockMealTemplate.fat,
        isFavorite: mockMealTemplate.isFavorite,
      });

      const state = useNutritionStore.getState();
      expect(state.templates).toHaveLength(1);
      expect(state.templates[0].name).toBe(mockMealTemplate.name);
    });

    it("should update template", () => {
      const store = useNutritionStore.getState();

      store.addTemplate({
        name: "Original",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
        isFavorite: false,
      });

      const templateId = useNutritionStore.getState().templates[0].id;
      store.updateTemplate(templateId, { name: "Updated" });

      const state = useNutritionStore.getState();
      expect(state.templates[0].name).toBe("Updated");
    });

    it("should delete template", () => {
      const store = useNutritionStore.getState();

      store.addTemplate({
        name: "Template",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
        isFavorite: false,
      });

      const templateId = useNutritionStore.getState().templates[0].id;
      store.deleteTemplate(templateId);

      const state = useNutritionStore.getState();
      expect(state.templates).toHaveLength(0);
    });

    it("should add meal from template", () => {
      const store = useNutritionStore.getState();

      store.addTemplate({
        name: "Template",
        category: "lunch",
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
        isFavorite: false,
      });

      const templateId = useNutritionStore.getState().templates[0].id;
      store.addMealFromTemplate(templateId);

      const dayData = useNutritionStore.getState().getCurrentDayData();
      expect(dayData.meals).toHaveLength(1);
      expect(dayData.meals[0].name).toBe("Template");
    });
  });

  describe("water tracking", () => {
    it("should update water for specific date", () => {
      const store = useNutritionStore.getState();

      store.updateWater("2024-01-15", 2.5);

      const dayData = useNutritionStore.getState().getCurrentDayData();
      expect(dayData.water).toBe(2.5);
    });
  });

  describe("date navigation", () => {
    it("should change current date", () => {
      const store = useNutritionStore.getState();

      store.setCurrentDate("2024-01-16");

      expect(useNutritionStore.getState().currentDate).toBe("2024-01-16");
    });
  });

  describe("getCurrentDayData", () => {
    it("should return empty data for date without meals", () => {
      const store = useNutritionStore.getState();

      const dayData = store.getCurrentDayData();

      expect(dayData.meals).toHaveLength(0);
      expect(dayData.water).toBe(0);
      expect(dayData.totalMacros.calories).toBe(0);
    });
  });
});
