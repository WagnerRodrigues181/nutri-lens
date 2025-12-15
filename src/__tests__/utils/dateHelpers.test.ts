import { describe, it, expect } from "vitest";
import {
  getTodayDate,
  parseDate,
  getPreviousDay,
  getNextDay,
  isTodayDate,
  areSameDay,
  daysBetween,
  getLastNDays,
} from "@/utils/dateHelpers";

describe("dateHelpers", () => {
  describe("getTodayDate", () => {
    it("should return today's date in ISO format", () => {
      const today = getTodayDate();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("parseDate", () => {
    it("should parse ISO date string to Date object", () => {
      const date = parseDate("2024-01-15");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });
  });

  describe("getPreviousDay", () => {
    it("should return previous day", () => {
      expect(getPreviousDay("2024-01-15")).toBe("2024-01-14");
    });

    it("should handle month transition", () => {
      expect(getPreviousDay("2024-02-01")).toBe("2024-01-31");
    });
  });

  describe("getNextDay", () => {
    it("should return next day", () => {
      expect(getNextDay("2024-01-15")).toBe("2024-01-16");
    });

    it("should handle month transition", () => {
      expect(getNextDay("2024-01-31")).toBe("2024-02-01");
    });
  });

  describe("isTodayDate", () => {
    it("should return true for today", () => {
      const today = getTodayDate();
      expect(isTodayDate(today)).toBe(true);
    });

    it("should return false for other dates", () => {
      expect(isTodayDate("2024-01-01")).toBe(false);
    });
  });

  describe("areSameDay", () => {
    it("should return true for same dates", () => {
      expect(areSameDay("2024-01-15", "2024-01-15")).toBe(true);
    });

    it("should return false for different dates", () => {
      expect(areSameDay("2024-01-15", "2024-01-16")).toBe(false);
    });
  });

  describe("daysBetween", () => {
    it("should calculate days between dates", () => {
      expect(daysBetween("2024-01-01", "2024-01-10")).toBe(9);
    });

    it("should handle same date", () => {
      expect(daysBetween("2024-01-01", "2024-01-01")).toBe(0);
    });

    it("should handle negative ranges", () => {
      expect(daysBetween("2024-01-10", "2024-01-01")).toBe(-9);
    });
  });

  describe("getLastNDays", () => {
    it("should return last N days including from date", () => {
      const days = getLastNDays(3, "2024-01-15");
      expect(days).toHaveLength(3);
      expect(days[0]).toBe("2024-01-13");
      expect(days[1]).toBe("2024-01-14");
      expect(days[2]).toBe("2024-01-15");
    });

    it("should use today if no date provided", () => {
      const days = getLastNDays(1);
      expect(days).toHaveLength(1);
      expect(days[0]).toBe(getTodayDate());
    });
  });
});
