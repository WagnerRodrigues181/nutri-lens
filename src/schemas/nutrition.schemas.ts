import { z } from "zod";

/**
 * Macros schema - base for all nutritional data
 */
export const macrosSchema = z.object({
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
});

/**
 * Meal category schema
 */
export const mealCategorySchema = z.enum([
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

/**
 * Meal schema
 */
export const mealSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).trim(),
  category: mealCategorySchema,
  timestamp: z.string().datetime(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
});

/**
 * Create meal input schema (for form validation)
 */
export const createMealSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100).trim(),
  category: mealCategorySchema,
  calories: z
    .number()
    .min(0, "Calorias devem ser positivas")
    .max(10000, "Valor muito alto"),
  protein: z
    .number()
    .min(0, "Proteína deve ser positiva")
    .max(1000, "Valor muito alto"),
  carbs: z
    .number()
    .min(0, "Carboidratos devem ser positivos")
    .max(1000, "Valor muito alto"),
  fat: z
    .number()
    .min(0, "Gordura deve ser positiva")
    .max(1000, "Valor muito alto"),
});

/**
 * Meal template schema
 */
export const mealTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).trim(),
  category: mealCategorySchema,
  isFavorite: z.boolean(),
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
});

/**
 * Daily goals schema
 */
export const dailyGoalsSchema = z.object({
  calories: z.number().min(500, "Muito baixo").max(10000, "Muito alto"),
  protein: z.number().min(20, "Muito baixo").max(500, "Muito alto"),
  carbs: z.number().min(20, "Muito baixo").max(800, "Muito alto"),
  fat: z.number().min(20, "Muito baixo").max(300, "Muito alto"),
  water: z.number().min(0.5, "Muito baixo").max(10, "Muito alto"),
});

/**
 * User profile schema
 */
export const userProfileSchema = z.object({
  weight: z.number().min(20).max(300).optional(),
  height: z.number().min(50).max(250).optional(),
  age: z.number().min(10).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  activityLevel: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .optional(),
  goal: z
    .enum(["lose_weight", "maintain", "gain_weight", "gain_muscle"])
    .optional(),
});

/**
 * Water update schema
 */
export const waterUpdateSchema = z.object({
  amount: z.number().min(0).max(10),
});

/**
 * Date range schema
 */
export const dateRangeSchema = z
  .object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Data inicial deve ser anterior à data final",
  });

// Export types inferred from schemas
export type CreateMealInput = z.infer<typeof createMealSchema>;
export type DailyGoalsInput = z.infer<typeof dailyGoalsSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type WaterUpdateInput = z.infer<typeof waterUpdateSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
