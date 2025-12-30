import type { NutritionHistory, DailyGoals } from "@/types";
import { formatDate } from "@/utils/formatters";

/**
 * Export nutrition data as CSV
 */
export const exportToCSV = (
  history: NutritionHistory,
  locale: "pt-BR" | "en-US"
): { success: boolean; error?: string } => {
  try {
    const headers =
      locale === "pt-BR"
        ? [
            "Data",
            "Refeições",
            "Calorias",
            "Proteína (g)",
            "Carboidratos (g)",
            "Gordura (g)",
            "Água (L)",
          ]
        : [
            "Date",
            "Meals",
            "Calories",
            "Protein (g)",
            "Carbs (g)",
            "Fat (g)",
            "Water (L)",
          ];

    const rows = Object.values(history)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((day) => [
        formatDate(day.date, locale),
        day.meals.length,
        Math.round(day.totalMacros.calories),
        day.totalMacros.protein.toFixed(1),
        day.totalMacros.carbs.toFixed(1),
        day.totalMacros.fat.toFixed(1),
        day.water.toFixed(1),
      ]);

    if (rows.length === 0) {
      return {
        success: false,
        error:
          locale === "pt-BR"
            ? "Nenhum dado disponível para exportar"
            : "No data available to export",
      };
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    downloadFile(csvContent, "nutrilens-data.csv", "text/csv");
    return { success: true };
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return {
      success: false,
      error:
        locale === "pt-BR"
          ? "Erro ao exportar arquivo CSV"
          : "Error exporting CSV file",
    };
  }
};

/**
 * Export nutrition data as JSON
 */
export const exportToJSON = (
  history: NutritionHistory,
  goals: DailyGoals,
  locale: "pt-BR" | "en-US" = "pt-BR"
): { success: boolean; error?: string } => {
  try {
    const exportData = {
      exportDate: new Date().toISOString(),
      goals,
      history,
    };

    if (Object.keys(history).length === 0) {
      return {
        success: false,
        error:
          locale === "pt-BR"
            ? "Nenhum dado disponível para exportar"
            : "No data available to export",
      };
    }

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, "nutrilens-backup.json", "application/json");
    return { success: true };
  } catch (error) {
    console.error("Error exporting JSON:", error);
    return {
      success: false,
      error:
        locale === "pt-BR"
          ? "Erro ao exportar arquivo JSON"
          : "Error exporting JSON file",
    };
  }
};

/**
 * Generate weekly report as CSV
 */
export const exportWeeklyReport = (
  history: NutritionHistory,
  startDate: string,
  endDate: string,
  locale: "pt-BR" | "en-US"
): { success: boolean; error?: string } => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const weekData = Object.values(history).filter((day) => {
      const date = new Date(day.date);
      return date >= start && date <= end;
    });

    if (weekData.length === 0) {
      return {
        success: false,
        error:
          locale === "pt-BR"
            ? "Nenhum dado encontrado para o período selecionado"
            : "No data found for the selected period",
      };
    }

    const headers =
      locale === "pt-BR"
        ? [
            "Data",
            "Dia",
            "Refeições",
            "Calorias",
            "Proteína",
            "Carboidratos",
            "Gordura",
            "Água",
          ]
        : [
            "Date",
            "Day",
            "Meals",
            "Calories",
            "Protein",
            "Carbs",
            "Fat",
            "Water",
          ];

    const dayNames =
      locale === "pt-BR"
        ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const rows = weekData
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((day) => {
        const date = new Date(day.date);
        const dayName = dayNames[date.getDay()];

        return [
          formatDate(day.date, locale),
          dayName,
          day.meals.length,
          Math.round(day.totalMacros.calories),
          day.totalMacros.protein.toFixed(1),
          day.totalMacros.carbs.toFixed(1),
          day.totalMacros.fat.toFixed(1),
          day.water.toFixed(1),
        ];
      });

    const totals = weekData.reduce(
      (acc, day) => ({
        meals: acc.meals + day.meals.length,
        calories: acc.calories + day.totalMacros.calories,
        protein: acc.protein + day.totalMacros.protein,
        carbs: acc.carbs + day.totalMacros.carbs,
        fat: acc.fat + day.totalMacros.fat,
        water: acc.water + day.water,
      }),
      { meals: 0, calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 }
    );

    const averages = {
      meals: (totals.meals / weekData.length).toFixed(1),
      calories: Math.round(totals.calories / weekData.length),
      protein: (totals.protein / weekData.length).toFixed(1),
      carbs: (totals.carbs / weekData.length).toFixed(1),
      fat: (totals.fat / weekData.length).toFixed(1),
      water: (totals.water / weekData.length).toFixed(1),
    };

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "",
      locale === "pt-BR" ? "MÉDIAS" : "AVERAGES",
      [
        locale === "pt-BR" ? "Média Semanal" : "Weekly Average",
        "",
        averages.meals,
        averages.calories,
        averages.protein,
        averages.carbs,
        averages.fat,
        averages.water,
      ].join(","),
    ].join("\n");

    downloadFile(csvContent, "nutrilens-weekly-report.csv", "text/csv");
    return { success: true };
  } catch (error) {
    console.error("Error exporting weekly report:", error);
    return {
      success: false,
      error:
        locale === "pt-BR"
          ? "Erro ao gerar relatório semanal"
          : "Error generating weekly report",
    };
  }
};

/**
 * Helper function to download file
 */
const downloadFile = (
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
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
