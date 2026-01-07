import type { NutritionHistory, DailyGoals } from "@/types";

interface ImportResult {
  success: boolean;
  data?: {
    history: NutritionHistory;
    goals?: DailyGoals;
  };
  error?: string;
}

/**
 * Validate if imported data has correct structure
 */
const validateHistory = (data: unknown): data is NutritionHistory => {
  if (!data || typeof data !== "object") return false;

  const history = data as Record<string, unknown>;

  // Check if all keys are valid dates and values are DailyNutrition objects
  return Object.entries(history).every(([date, dayData]) => {
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    if (!dayData || typeof dayData !== "object") return false;

    const day = dayData as Record<string, unknown>;

    // Check required fields
    if (!Array.isArray(day.meals)) return false;
    if (typeof day.water !== "number") return false;
    if (!day.totalMacros || typeof day.totalMacros !== "object") return false;

    return true;
  });
};

/**
 * Validate goals structure
 */
const validateGoals = (data: unknown): data is DailyGoals => {
  if (!data || typeof data !== "object") return false;

  const goals = data as Record<string, unknown>;

  return (
    typeof goals.calories === "number" &&
    typeof goals.protein === "number" &&
    typeof goals.carbs === "number" &&
    typeof goals.fat === "number" &&
    typeof goals.water === "number"
  );
};

/**
 * Import data from JSON file
 */
export const importFromJSON = async (
  file: File,
  locale: "pt-BR" | "en-US"
): Promise<ImportResult> => {
  try {
    // Check file type
    if (!file.name.endsWith(".json")) {
      return {
        success: false,
        error:
          locale === "pt-BR" ? "Arquivo deve ser .json" : "File must be .json",
      };
    }

    // Read file
    const text = await file.text();
    const parsed = JSON.parse(text);

    // Validate structure
    if (!parsed.history || !validateHistory(parsed.history)) {
      return {
        success: false,
        error:
          locale === "pt-BR"
            ? "Formato de dados inválido"
            : "Invalid data format",
      };
    }

    // Extract data
    const result: ImportResult["data"] = {
      history: parsed.history,
    };

    // Optional: import goals if present
    if (parsed.goals && validateGoals(parsed.goals)) {
      result.goals = parsed.goals;
    }

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      error:
        locale === "pt-BR"
          ? "Erro ao ler arquivo JSON"
          : "Error reading JSON file",
    };
  }
};

/**
 * Import data from CSV file
 */
export const importFromCSV = async (
  file: File,
  locale: "pt-BR" | "en-US"
): Promise<ImportResult> => {
  try {
    // Check file type
    if (!file.name.endsWith(".csv")) {
      return {
        success: false,
        error:
          locale === "pt-BR" ? "Arquivo deve ser .csv" : "File must be .csv",
      };
    }

    // Read file
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return {
        success: false,
        error:
          locale === "pt-BR"
            ? "Arquivo CSV vazio ou inválido"
            : "Empty or invalid CSV file",
      };
    }

    // Parse header
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());

    // Map PT-BR column names to English
    const columnMap: Record<string, string> = {
      data: "date",
      refeições: "meals",
      calorias: "calories",
      "proteína (g)": "protein",
      "proteina (g)": "protein",
      "carboidratos (g)": "carbs",
      "gordura (g)": "fat",
      "água (l)": "water",
      "agua (l)": "water",
      // English names
      date: "date",
      meals: "meals",
      calories: "calories",
      protein: "protein",
      "protein (g)": "protein",
      carbs: "carbs",
      "carbs (g)": "carbs",
      fat: "fat",
      "fat (g)": "fat",
      water: "water",
      "water (l)": "water",
      // Additional mappings
      meal_name: "meal_name",
      category: "category",
    };

    // Normalize header
    const normalizedHeader = header.map((col) => columnMap[col] || col);

    // Validate required columns (simplified format)
    const hasDateColumn = normalizedHeader.includes("date");

    if (!hasDateColumn) {
      return {
        success: false,
        error:
          locale === "pt-BR"
            ? "Coluna 'Data' obrigatória faltando no CSV"
            : "Required 'Date' column missing in CSV",
      };
    }

    // Build history from CSV
    const history: NutritionHistory = {};

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};

      normalizedHeader.forEach((col, idx) => {
        row[col] = values[idx] || "";
      });

      // Parse date (handle YYYY-MM-DD or DD/MM/YYYY)
      let date = row.date;

      // Convert DD/MM/YYYY to YYYY-MM-DD
      if (date.includes("/")) {
        const parts = date.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

      const calories = parseFloat(row.calories) || 0;
      const protein = parseFloat(row.protein) || 0;
      const carbs = parseFloat(row.carbs) || 0;
      const fat = parseFloat(row.fat) || 0;
      const water = parseFloat(row.water) || 0;

      // Initialize day if not exists
      if (!history[date]) {
        history[date] = {
          date,
          meals: [],
          water: 0,
          totalMacros: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
        };
      }

      // If this format has individual meal data
      if (row.meal_name) {
        const meal = {
          id: crypto.randomUUID(),
          name: row.meal_name,
          category: (row.category || "snack") as
            | "breakfast"
            | "lunch"
            | "dinner"
            | "snack",
          calories: calories,
          protein: protein,
          carbs: carbs,
          fat: fat,
          timestamp: new Date().toISOString(),
          date,
        };

        history[date].meals.push(meal);

        history[date].totalMacros.calories += calories;
        history[date].totalMacros.protein += protein;
        history[date].totalMacros.carbs += carbs;
        history[date].totalMacros.fat += fat;
        history[date].water += water;
      }
      // If this is aggregated data (no meal_name), create a summary meal
      else if (calories > 0) {
        const summaryMeal = {
          id: crypto.randomUUID(),
          name: locale === "pt-BR" ? "Dados Importados" : "Imported Data",
          category: "snack" as const,
          calories: calories,
          protein: protein,
          carbs: carbs,
          fat: fat,
          timestamp: new Date().toISOString(),
          date,
        };

        history[date].meals.push(summaryMeal);
        history[date].totalMacros = {
          calories: calories,
          protein: protein,
          carbs: carbs,
          fat: fat,
        };
        history[date].water = water;
      }
    }

    return {
      success: true,
      data: { history },
    };
  } catch (err) {
    return {
      success: false,
      error:
        locale === "pt-BR"
          ? "Erro ao ler arquivo CSV"
          : "Error reading CSV file",
    };
  }
};
