import { describe, it, expect } from "vitest";
import {
  isPositiveNumber,
  isInRange,
  isValidCalories,
  isValidMacro,
  isValidWater,
  isValidMealName,
  isValidWeight,
  isValidHeight,
  isValidAge,
  sanitizeString,
  sanitizeNumber,
} from "@/utils/validators";

describe("validators", () => {
  describe("isPositiveNumber", () => {
    it("should return true for positive numbers", () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100)).toBe(true);
    });

    it("should return false for zero and negative numbers", () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
    });
  });

  describe("isInRange", () => {
    it("should return true for values in range", () => {
      expect(isInRange(50, 0, 100)).toBe(true);
      expect(isInRange(0, 0, 100)).toBe(true);
      expect(isInRange(100, 0, 100)).toBe(true);
    });

    it("should return false for values out of range", () => {
      expect(isInRange(-1, 0, 100)).toBe(false);
      expect(isInRange(101, 0, 100)).toBe(false);
    });
  });

  describe("isValidCalories", () => {
    it("should return true for valid calorie values", () => {
      expect(isValidCalories(500)).toBe(true);
      expect(isValidCalories(2000)).toBe(true);
    });

    it("should return false for invalid values", () => {
      expect(isValidCalories(0)).toBe(false);
      expect(isValidCalories(-100)).toBe(false);
      expect(isValidCalories(10001)).toBe(false);
    });
  });

  describe("isValidMacro", () => {
    it("should return true for valid macro values", () => {
      expect(isValidMacro(0)).toBe(true);
      expect(isValidMacro(50)).toBe(true);
      expect(isValidMacro(1000)).toBe(true);
    });

    it("should return false for invalid values", () => {
      expect(isValidMacro(-1)).toBe(false);
      expect(isValidMacro(1001)).toBe(false);
    });
  });

  describe("isValidWater", () => {
    it("should return true for valid water values", () => {
      expect(isValidWater(0)).toBe(true);
      expect(isValidWater(2.5)).toBe(true);
      expect(isValidWater(10)).toBe(true);
    });

    it("should return false for invalid values", () => {
      expect(isValidWater(-1)).toBe(false);
      expect(isValidWater(11)).toBe(false);
    });
  });

  describe("isValidMealName", () => {
    it("should return true for valid meal names", () => {
      expect(isValidMealName("Frango")).toBe(true);
      expect(isValidMealName("  Arroz  ")).toBe(true);
    });

    it("should return false for empty or too long names", () => {
      expect(isValidMealName("")).toBe(false);
      expect(isValidMealName("   ")).toBe(false);
      expect(isValidMealName("a".repeat(101))).toBe(false);
    });
  });

  describe("isValidWeight", () => {
    it("should return true for valid weights", () => {
      expect(isValidWeight(70)).toBe(true);
      expect(isValidWeight(20)).toBe(true);
      expect(isValidWeight(300)).toBe(true);
    });

    it("should return false for invalid weights", () => {
      expect(isValidWeight(19)).toBe(false);
      expect(isValidWeight(301)).toBe(false);
    });
  });

  describe("isValidHeight", () => {
    it("should return true for valid heights", () => {
      expect(isValidHeight(170)).toBe(true);
      expect(isValidHeight(50)).toBe(true);
      expect(isValidHeight(250)).toBe(true);
    });

    it("should return false for invalid heights", () => {
      expect(isValidHeight(49)).toBe(false);
      expect(isValidHeight(251)).toBe(false);
    });
  });

  describe("isValidAge", () => {
    it("should return true for valid ages", () => {
      expect(isValidAge(25)).toBe(true);
      expect(isValidAge(10)).toBe(true);
      expect(isValidAge(120)).toBe(true);
    });

    it("should return false for invalid ages", () => {
      expect(isValidAge(9)).toBe(false);
      expect(isValidAge(121)).toBe(false);
    });
  });

  describe("sanitizeString", () => {
    it("should trim whitespace", () => {
      expect(sanitizeString("  hello  ")).toBe("hello");
    });

    it("should limit length to default 100 chars", () => {
      const longString = "a".repeat(200);
      expect(sanitizeString(longString).length).toBe(100);
    });

    it("should limit length to custom max", () => {
      const longString = "a".repeat(100);
      expect(sanitizeString(longString, 50).length).toBe(50);
    });
  });

  describe("sanitizeNumber", () => {
    it("should return valid numbers unchanged", () => {
      expect(sanitizeNumber(50, 0, 100)).toBe(50);
    });

    it("should clamp to min value", () => {
      expect(sanitizeNumber(-10, 0, 100)).toBe(0);
    });

    it("should clamp to max value", () => {
      expect(sanitizeNumber(150, 0, 100)).toBe(100);
    });

    it("should return min for NaN", () => {
      expect(sanitizeNumber(NaN, 0, 100)).toBe(0);
    });
  });
});
