import type { NutritionHistory, DailyGoals } from "@/types";
import { formatDate } from "@/utils/formatters";

/**
 * Export data as CSV format
 */
export const exportToCSV = (
  history: NutritionHistory,
  dates: string[]
): string => {
  const headers = [
    "Data",
    "Calorias (kcal)",
    "Proteína (g)",
    "Carboidratos (g)",
    "Gordura (g)",
    "Água (L)",
    "Refeições",
  ];

  const rows = dates
    .filter((date) => history[date])
    .map((date) => {
      const dayData = history[date];
      return [
        formatDate(date, "pt-BR"),
        dayData.totalMacros.calories.toFixed(0),
        dayData.totalMacros.protein.toFixed(1),
        dayData.totalMacros.carbs.toFixed(1),
        dayData.totalMacros.fat.toFixed(1),
        dayData.water.toFixed(1),
        dayData.meals.length.toString(),
      ];
    });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
};

/**
 * Export detailed meals data as CSV
 */
export const exportMealsToCSV = (
  history: NutritionHistory,
  dates: string[]
): string => {
  const headers = [
    "Data",
    "Hora",
    "Refeição",
    "Categoria",
    "Calorias (kcal)",
    "Proteína (g)",
    "Carboidratos (g)",
    "Gordura (g)",
  ];

  const rows: string[][] = [];

  dates
    .filter((date) => history[date])
    .forEach((date) => {
      const dayData = history[date];
      dayData.meals.forEach((meal) => {
        const time = new Date(meal.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        rows.push([
          formatDate(date, "pt-BR"),
          time,
          meal.name,
          meal.category,
          meal.calories.toFixed(0),
          meal.protein.toFixed(1),
          meal.carbs.toFixed(1),
          meal.fat.toFixed(1),
        ]);
      });
    });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
};

/**
 * Export data as JSON format
 */
export const exportToJSON = (
  history: NutritionHistory,
  goals: DailyGoals,
  dates: string[]
): string => {
  const filteredHistory = dates.reduce((acc, date) => {
    if (history[date]) {
      acc[date] = history[date];
    }
    return acc;
  }, {} as NutritionHistory);

  const exportData = {
    exportDate: new Date().toISOString(),
    goals,
    history: filteredHistory,
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Download file to user's device
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export weekly report as CSV
 */
export const exportWeeklyReport = (
  history: NutritionHistory,
  dates: string[]
): void => {
  const csv = exportToCSV(history, dates);
  const filename = `nutrilens_weekly_${dates[0]}_to_${
    dates[dates.length - 1]
  }.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
};

/**
 * Export monthly report as CSV
 */
export const exportMonthlyReport = (
  history: NutritionHistory,
  dates: string[]
): void => {
  const csv = exportToCSV(history, dates);
  const filename = `nutrilens_monthly_${dates[0]}_to_${
    dates[dates.length - 1]
  }.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
};

/**
 * Export detailed meals report as CSV
 */
export const exportDetailedMealsReport = (
  history: NutritionHistory,
  dates: string[]
): void => {
  const csv = exportMealsToCSV(history, dates);
  const filename = `nutrilens_meals_${dates[0]}_to_${
    dates[dates.length - 1]
  }.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
};

/**
 * Export all data as JSON backup
 */
export const exportBackup = (
  history: NutritionHistory,
  goals: DailyGoals
): void => {
  const allDates = Object.keys(history).sort();
  const json = exportToJSON(history, goals, allDates);
  const filename = `nutrilens_backup_${
    new Date().toISOString().split("T")[0]
  }.json`;
  downloadFile(json, filename, "application/json;charset=utf-8;");
};
