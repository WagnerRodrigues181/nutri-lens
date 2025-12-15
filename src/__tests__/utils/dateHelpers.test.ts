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
  getRelativeDateText,
  getMonthDays,
  getWeekDays,
  getMonthRange,
  getWeekRange,
  formatDateWithLocale,
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

describe("formatDateWithLocale", () => {
  it("should format date with pt-BR locale", () => {
    const result = formatDateWithLocale("2024-01-15", "pt-BR");
    expect(result).toContain("jan");
    expect(result).toContain("2024");
  });

  it("should format date with en-US locale", () => {
    const result = formatDateWithLocale("2024-01-15", "en-US");
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });

  it("should accept custom format string", () => {
    const result = formatDateWithLocale("2024-01-15", "pt-BR", "yyyy-MM-dd");
    expect(result).toBe("2024-01-15");
  });

  it("should handle Date object", () => {
    const date = new Date("2024-01-15");
    const result = formatDateWithLocale(date, "pt-BR");
    expect(result).toContain("jan");
  });
});

describe("getWeekRange", () => {
  it("should return week range for string date", () => {
    const range = getWeekRange("2024-01-15");
    expect(range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should return week range for Date object", () => {
    const date = new Date("2024-01-15");
    const range = getWeekRange(date);
    expect(range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should start week on Sunday", () => {
    const range = getWeekRange("2024-01-15");
    const start = parseDate(range.start);
    expect(start.getDay()).toBe(0);
  });

  it("should end week on Saturday", () => {
    const range = getWeekRange("2024-01-15");
    const end = parseDate(range.end);
    expect(end.getDay()).toBe(6);
  });
});

describe("getMonthRange", () => {
  it("should return month range for string date", () => {
    const range = getMonthRange("2024-01-15");
    expect(range.start).toBe("2024-01-01");
    expect(range.end).toBe("2024-01-31");
  });

  it("should return month range for Date object", () => {
    const date = new Date("2024-01-15");
    const range = getMonthRange(date);
    expect(range.start).toBe("2024-01-01");
    expect(range.end).toBe("2024-01-31");
  });

  it("should handle February in leap year", () => {
    const range = getMonthRange("2024-02-15");
    expect(range.start).toBe("2024-02-01");
    expect(range.end).toBe("2024-02-29");
  });

  it("should handle February in non-leap year", () => {
    const range = getMonthRange("2023-02-15");
    expect(range.start).toBe("2023-02-01");
    expect(range.end).toBe("2023-02-28");
  });
});

describe("getWeekDays", () => {
  it("should return 7 days for string date", () => {
    const days = getWeekDays("2024-01-15");
    expect(days).toHaveLength(7);
  });

  it("should return 7 days for Date object", () => {
    const date = new Date("2024-01-15");
    const days = getWeekDays(date);
    expect(days).toHaveLength(7);
  });

  it("should start with Sunday", () => {
    const days = getWeekDays("2024-01-15");
    const firstDay = parseDate(days[0]);
    expect(firstDay.getDay()).toBe(0);
  });

  it("should end with Saturday", () => {
    const days = getWeekDays("2024-01-15");
    const lastDay = parseDate(days[6]);
    expect(lastDay.getDay()).toBe(6);
  });

  it("should return consecutive dates", () => {
    const days = getWeekDays("2024-01-15");
    for (let i = 1; i < days.length; i++) {
      const diff = daysBetween(days[i - 1], days[i]);
      expect(diff).toBe(1);
    }
  });
});

describe("getMonthDays", () => {
  it("should return all days in month for string date", () => {
    const days = getMonthDays("2024-01-15");
    expect(days).toHaveLength(31);
  });

  it("should return all days in month for Date object", () => {
    const date = new Date("2024-01-15");
    const days = getMonthDays(date);
    expect(days).toHaveLength(31);
  });

  it("should handle February in leap year", () => {
    const days = getMonthDays("2024-02-15");
    expect(days).toHaveLength(29);
  });

  it("should handle February in non-leap year", () => {
    const days = getMonthDays("2023-02-15");
    expect(days).toHaveLength(28);
  });

  it("should start with first day of month", () => {
    const days = getMonthDays("2024-01-15");
    expect(days[0]).toBe("2024-01-01");
  });

  it("should end with last day of month", () => {
    const days = getMonthDays("2024-01-15");
    expect(days[days.length - 1]).toBe("2024-01-31");
  });
});

describe("getRelativeDateText", () => {
  it("should return 'Hoje' for today in pt-BR", () => {
    const today = getTodayDate();
    const result = getRelativeDateText(today, "pt-BR");
    expect(result).toBe("Hoje");
  });

  it("should return 'Today' for today in en-US", () => {
    const today = getTodayDate();
    const result = getRelativeDateText(today, "en-US");
    expect(result).toBe("Today");
  });

  it("should return 'Ontem' for yesterday in pt-BR", () => {
    const yesterday = getPreviousDay(getTodayDate());
    const result = getRelativeDateText(yesterday, "pt-BR");
    expect(result).toBe("Ontem");
  });

  it("should return 'Yesterday' for yesterday in en-US", () => {
    const yesterday = getPreviousDay(getTodayDate());
    const result = getRelativeDateText(yesterday, "en-US");
    expect(result).toBe("Yesterday");
  });

  it("should return formatted date for other dates in pt-BR", () => {
    const result = getRelativeDateText("2024-01-15", "pt-BR");
    expect(result).toContain("jan");
    expect(result).toContain("2024");
  });

  it("should return formatted date for other dates in en-US", () => {
    const result = getRelativeDateText("2024-01-15", "en-US");
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });
});
