import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "@/store/useSettingsStore";

describe("useSettingsStore", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      goals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
        water: 2.0,
      },
      profile: {},
      locale: "pt-BR",
    });
  });

  describe("updateGoals", () => {
    it("should update goals partially", () => {
      const store = useSettingsStore.getState();

      store.updateGoals({ calories: 2500 });

      expect(useSettingsStore.getState().goals.calories).toBe(2500);
      expect(useSettingsStore.getState().goals.protein).toBe(150);
    });

    it("should update multiple goals at once", () => {
      const store = useSettingsStore.getState();

      store.updateGoals({
        calories: 2500,
        protein: 180,
      });

      expect(useSettingsStore.getState().goals.calories).toBe(2500);
      expect(useSettingsStore.getState().goals.protein).toBe(180);
    });
  });

  describe("updateProfile", () => {
    it("should update profile partially", () => {
      const store = useSettingsStore.getState();

      store.updateProfile({
        weight: 75,
        height: 180,
      });

      expect(useSettingsStore.getState().profile.weight).toBe(75);
      expect(useSettingsStore.getState().profile.height).toBe(180);
    });

    it("should update activity level", () => {
      const store = useSettingsStore.getState();

      store.updateProfile({ activityLevel: "active" });

      expect(useSettingsStore.getState().profile.activityLevel).toBe("active");
    });

    it("should update goal", () => {
      const store = useSettingsStore.getState();

      store.updateProfile({ goal: "lose_weight" });

      expect(useSettingsStore.getState().profile.goal).toBe("lose_weight");
    });
  });

  describe("setLocale", () => {
    it("should change locale to en-US", () => {
      const store = useSettingsStore.getState();

      store.setLocale("en-US");

      expect(useSettingsStore.getState().locale).toBe("en-US");
    });

    it("should change locale to pt-BR", () => {
      useSettingsStore.setState({ locale: "en-US" });
      const store = useSettingsStore.getState();

      store.setLocale("pt-BR");

      expect(useSettingsStore.getState().locale).toBe("pt-BR");
    });
  });

  describe("resetGoals", () => {
    it("should reset goals to defaults", () => {
      const store = useSettingsStore.getState();

      store.updateGoals({ calories: 3000, protein: 200 });
      store.resetGoals();

      const state = useSettingsStore.getState();
      expect(state.goals.calories).toBe(2000);
      expect(state.goals.protein).toBe(150);
      expect(state.goals.carbs).toBe(200);
      expect(state.goals.fat).toBe(65);
      expect(state.goals.water).toBe(2.0);
    });
  });

  describe("default state", () => {
    it("should have correct default goals", () => {
      const store = useSettingsStore.getState();
      store.resetGoals();

      const state = useSettingsStore.getState();
      expect(state.goals.calories).toBe(2000);
      expect(state.goals.protein).toBe(150);
    });

    it("should have default locale as pt-BR", () => {
      const freshStore = useSettingsStore.getState();

      expect(freshStore.locale).toBe("pt-BR");
    });
  });
});
