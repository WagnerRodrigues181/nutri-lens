import { useState } from "react";
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
    },
  };

  const t = translations[locale];

  const categories: { value: MealCategory; label: string }[] = [
    { value: "breakfast", label: t.breakfast },
    { value: "lunch", label: t.lunch },
    { value: "dinner", label: t.dinner },
    { value: "snack", label: t.snack },
  ];

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

  const handleSubmit = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {meal ? t.editMeal : t.addMeal}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Meal Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.mealName}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t.namePlaceholder}
              className={`w-full rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.category}
            </label>
            <select
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
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Flame className="h-4 w-4 text-green-600" />
                {t.calories}
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) =>
                  handleChange("calories", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.calories ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
              {errors.calories && (
                <p className="mt-1 text-sm text-red-600">{errors.calories}</p>
              )}
            </div>

            {/* Protein */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Beef className="h-4 w-4 text-red-600" />
                {t.protein}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={(e) =>
                  handleChange("protein", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.protein ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
              {errors.protein && (
                <p className="mt-1 text-sm text-red-600">{errors.protein}</p>
              )}
            </div>

            {/* Carbs */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Wheat className="h-4 w-4 text-amber-600" />
                {t.carbs}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={(e) =>
                  handleChange("carbs", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.carbs ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
              {errors.carbs && (
                <p className="mt-1 text-sm text-red-600">{errors.carbs}</p>
              )}
            </div>

            {/* Fat */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Droplet className="h-4 w-4 text-indigo-600" />
                {t.fat}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={(e) =>
                  handleChange("fat", parseFloat(e.target.value) || 0)
                }
                className={`w-full rounded-lg border ${
                  errors.fat ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
              {errors.fat && (
                <p className="mt-1 text-sm text-red-600">{errors.fat}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 font-medium text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
