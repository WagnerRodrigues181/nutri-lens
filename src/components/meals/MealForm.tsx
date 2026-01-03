import { useState, useEffect, useRef } from "react";
import { X, Flame, Beef, Wheat, Droplet } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import type { Meal, MealCategory } from "@/types";
import { createMealSchema } from "@/schemas/nutrition.schemas";
import { ZodIssue } from "zod";

interface MealFormProps {
  meal?: Meal;
  onClose: () => void;
}

export default function MealForm({ meal, onClose }: MealFormProps) {
  const { addMeal, updateMeal } = useNutritionStore();
  const { locale } = useSettingsStore();

  const [formData, setFormData] = useState({
    name: meal?.name || "",
    category: meal?.category || ("breakfast" as MealCategory),
    calories: meal?.calories || 0,
    protein: meal?.protein || 0,
    carbs: meal?.carbs || 0,
    fat: meal?.fat || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const translations = {
    "pt-BR": {
      addMeal: "Adicionar Refeição",
      editMeal: "Editar Refeição",
      mealName: "Nome da Refeição",
      category: "Categoria",
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche",
      calories: "Calorias",
      protein: "Proteína (g)",
      carbs: "Carboidratos (g)",
      fat: "Gordura (g)",
      save: "Salvar",
      cancel: "Cancelar",
      namePlaceholder: "Ex: Frango grelhado com arroz",
      closeDialog: "Fechar diálogo",
    },
    "en-US": {
      addMeal: "Add Meal",
      editMeal: "Edit Meal",
      mealName: "Meal Name",
      category: "Category",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      calories: "Calories",
      protein: "Protein (g)",
      carbs: "Carbs (g)",
      fat: "Fat (g)",
      save: "Save",
      cancel: "Cancel",
      namePlaceholder: "Ex: Grilled chicken with rice",
      closeDialog: "Close dialog",
    },
  };

  const t = translations[locale];

  const categories: { value: MealCategory; label: string }[] = [
    { value: "breakfast", label: t.breakfast },
    { value: "lunch", label: t.lunch },
    { value: "dinner", label: t.dinner },
    { value: "snack", label: t.snack },
  ];

  // Focus first input on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validate with Zod
    const result = createMealSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      result.error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[field.toString()] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    // Save meal
    if (meal) {
      updateMeal(meal.id, formData);
    } else {
      addMeal(formData);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-form-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="meal-form-title" className="text-2xl font-bold text-gray-900">
            {meal ? t.editMeal : t.addMeal}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={t.closeDialog}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meal Name */}
          <div>
            <label
              htmlFor="meal-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {t.mealName}
            </label>
            <input
              ref={firstInputRef}
              id="meal-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t.namePlaceholder}
              className={`w-full rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="meal-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {t.category}
            </label>
            <select
              id="meal-category"
              value={formData.category}
              onChange={(e) =>
                handleChange("category", e.target.value as MealCategory)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Calories */}
            <div>
              <label
                htmlFor="calories"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Flame className="h-4 w-4 text-green-600" aria-hidden="true" />
                {t.calories}
              </label>
              <input
                id="calories"
                type="number"
                min="0"
                step="1"
                value={formData.calories}
                onChange={(e) =>
                  handleChange("calories", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.calories ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                aria-invalid={!!errors.calories}
                aria-describedby={
                  errors.calories ? "calories-error" : undefined
                }
                required
              />
              {errors.calories && (
                <p
                  id="calories-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.calories}
                </p>
              )}
            </div>

            {/* Protein */}
            <div>
              <label
                htmlFor="protein"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Beef className="h-4 w-4 text-red-600" aria-hidden="true" />
                {t.protein}
              </label>
              <input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) =>
                  handleChange("protein", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.protein ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                aria-invalid={!!errors.protein}
                aria-describedby={errors.protein ? "protein-error" : undefined}
                required
              />
              {errors.protein && (
                <p
                  id="protein-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.protein}
                </p>
              )}
            </div>

            {/* Carbs */}
            <div>
              <label
                htmlFor="carbs"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Wheat className="h-4 w-4 text-amber-600" aria-hidden="true" />
                {t.carbs}
              </label>
              <input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) =>
                  handleChange("carbs", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.carbs ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                aria-invalid={!!errors.carbs}
                aria-describedby={errors.carbs ? "carbs-error" : undefined}
                required
              />
              {errors.carbs && (
                <p
                  id="carbs-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.carbs}
                </p>
              )}
            </div>

            {/* Fat */}
            <div>
              <label
                htmlFor="fat"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Droplet
                  className="h-4 w-4 text-indigo-600"
                  aria-hidden="true"
                />
                {t.fat}
              </label>
              <input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) =>
                  handleChange("fat", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.fat ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                aria-invalid={!!errors.fat}
                aria-describedby={errors.fat ? "fat-error" : undefined}
                required
              />
              {errors.fat && (
                <p
                  id="fat-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.fat}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 font-medium text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
