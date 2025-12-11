import type { Locale } from "@/types";

/**
 * Format a number to a specific decimal places
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals);
};

/**
 * Format calories value (no decimals)
 */
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)} kcal`;
};

/**
 * Format macro value (1 decimal place)
 */
export const formatMacro = (grams: number): string => {
  return `${formatNumber(grams, 1)}g`;
};

/**
 * Format water value (1 decimal place)
 */
export const formatWater = (
  liters: number,
  locale: Locale = "pt-BR"
): string => {
  const value = formatNumber(liters, 1);
  return locale === "pt-BR" ? `${value}L` : `${value}L`;
};

/**
 * Format percentage value
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Format date to localized string
 */
export const formatDate = (
  date: string | Date,
  locale: Locale = "pt-BR"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format time from ISO string
 */
export const formatTime = (
  timestamp: string,
  locale: Locale = "pt-BR"
): string => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format meal category to readable text
 */
export const formatMealCategory = (
  category: string,
  locale: Locale = "pt-BR"
): string => {
  const translations: Record<string, Record<Locale, string>> = {
    breakfast: { "pt-BR": "Café da Manhã", "en-US": "Breakfast" },
    lunch: { "pt-BR": "Almoço", "en-US": "Lunch" },
    dinner: { "pt-BR": "Jantar", "en-US": "Dinner" },
    snack: { "pt-BR": "Lanche", "en-US": "Snack" },
  };

  return translations[category]?.[locale] || category;
};

/**
 * Format large numbers with K suffix
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
