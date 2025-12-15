import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCalories,
  formatMacro,
  formatWater,
  formatPercentage,
  formatMealCategory,
  formatCompactNumber,
} from "@/utils/formatters";

describe("formatters", () => {
  describe("formatNumber", () => {
    it("should format number with default 0 decimals", () => {
      expect(formatNumber(42)).toBe("42");
    });

    it("should format number with specified decimals", () => {
      expect(formatNumber(3.14159, 2)).toBe("3.14");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-10.5, 1)).toBe("-10.5");
    });
  });

  describe("formatCalories", () => {
    it("should format calories with kcal suffix", () => {
      expect(formatCalories(2000)).toBe("2000 kcal");
    });

    it("should round calories to nearest integer", () => {
      expect(formatCalories(1999.7)).toBe("2000 kcal");
    });

    it("should handle zero calories", () => {
      expect(formatCalories(0)).toBe("0 kcal");
    });
  });

  describe("formatMacro", () => {
    it("should format macro with 1 decimal and g suffix", () => {
      expect(formatMacro(45.67)).toBe("45.7g");
    });

    it("should handle zero value", () => {
      expect(formatMacro(0)).toBe("0.0g");
    });

    it("should handle small decimals", () => {
      expect(formatMacro(0.05)).toBe("0.1g");
    });
  });

  describe("formatWater", () => {
    it("should format water in pt-BR", () => {
      expect(formatWater(2.5, "pt-BR")).toBe("2.5L");
    });

    it("should format water in en-US", () => {
      expect(formatWater(2.5, "en-US")).toBe("2.5L");
    });

    it("should round to 1 decimal", () => {
      expect(formatWater(2.567, "pt-BR")).toBe("2.6L");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage without decimals", () => {
      expect(formatPercentage(85.7)).toBe("86%");
    });

    it("should handle 100%", () => {
      expect(formatPercentage(100)).toBe("100%");
    });

    it("should handle 0%", () => {
      expect(formatPercentage(0)).toBe("0%");
    });
  });

  describe("formatMealCategory", () => {
    it("should format breakfast in pt-BR", () => {
      expect(formatMealCategory("breakfast", "pt-BR")).toBe("Café da Manhã");
    });

    it("should format lunch in en-US", () => {
      expect(formatMealCategory("lunch", "en-US")).toBe("Lunch");
    });

    it("should format dinner in pt-BR", () => {
      expect(formatMealCategory("dinner", "pt-BR")).toBe("Jantar");
    });

    it("should format snack in en-US", () => {
      expect(formatMealCategory("snack", "en-US")).toBe("Snack");
    });

    it("should return original value for unknown category", () => {
      expect(formatMealCategory("unknown", "pt-BR")).toBe("unknown");
    });
  });

  describe("formatCompactNumber", () => {
    it("should not compact numbers below 1000", () => {
      expect(formatCompactNumber(999)).toBe("999");
    });

    it("should compact 1000 to 1.0K", () => {
      expect(formatCompactNumber(1000)).toBe("1.0K");
    });

    it("should compact 5500 to 5.5K", () => {
      expect(formatCompactNumber(5500)).toBe("5.5K");
    });

    it("should handle large numbers", () => {
      expect(formatCompactNumber(15000)).toBe("15.0K");
    });
  });
});
