import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  addDays,
  differenceInDays,
  isToday,
  isSameDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import type { Locale } from "@/types";

const localeMap = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export const getTodayDate = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

/**
 * Parse ISO date string to Date object
 */
export const parseDate = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Format date with locale support
 */
export const formatDateWithLocale = (
  date: string | Date,
  locale: Locale,
  formatStr: string = "PP"
): string => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  return format(dateObj, formatStr, { locale: localeMap[locale] });
};

/**
 * Get week range (start and end dates)
 */
export const getWeekRange = (
  date: string | Date
): { start: string; end: string } => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;

  return {
    start: format(startOfWeek(dateObj, { weekStartsOn: 0 }), "yyyy-MM-dd"),
    end: format(endOfWeek(dateObj, { weekStartsOn: 0 }), "yyyy-MM-dd"),
  };
};

/**
 * Get month range (start and end dates)
 */
export const getMonthRange = (
  date: string | Date
): { start: string; end: string } => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;

  return {
    start: format(startOfMonth(dateObj), "yyyy-MM-dd"),
    end: format(endOfMonth(dateObj), "yyyy-MM-dd"),
  };
};

/**
 * Get array of dates in a week
 */
export const getWeekDays = (date: string | Date): string[] => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  const start = startOfWeek(dateObj, { weekStartsOn: 0 });
  const end = endOfWeek(dateObj, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
};

/**
 * Get array of dates in a month
 */
export const getMonthDays = (date: string | Date): string[] => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  const start = startOfMonth(dateObj);
  const end = endOfMonth(dateObj);

  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
};

/**
 * Get last N days as array of date strings
 */
export const getLastNDays = (
  n: number,
  fromDate: string = getTodayDate()
): string[] => {
  const date = parseDate(fromDate);
  const dates: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    dates.push(format(subDays(date, i), "yyyy-MM-dd"));
  }

  return dates;
};

/**
 * Get previous day
 */
export const getPreviousDay = (date: string): string => {
  return format(subDays(parseDate(date), 1), "yyyy-MM-dd");
};

/**
 * Get next day
 */
export const getNextDay = (date: string): string => {
  return format(addDays(parseDate(date), 1), "yyyy-MM-dd");
};

/**
 * Check if date is today
 */
export const isTodayDate = (date: string): boolean => {
  return isToday(parseDate(date));
};

/**
 * Check if two dates are the same day
 */
export const areSameDay = (date1: string, date2: string): boolean => {
  return isSameDay(parseDate(date1), parseDate(date2));
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (startDate: string, endDate: string): number => {
  return differenceInDays(parseDate(endDate), parseDate(startDate));
};

/**
 * Get relative date text (Today, Yesterday, etc)
 */
export const getRelativeDateText = (date: string, locale: Locale): string => {
  const today = getTodayDate();
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  if (date === today) {
    return locale === "pt-BR" ? "Hoje" : "Today";
  }

  if (date === yesterday) {
    return locale === "pt-BR" ? "Ontem" : "Yesterday";
  }

  return formatDateWithLocale(date, locale, "dd MMM yyyy");
};
