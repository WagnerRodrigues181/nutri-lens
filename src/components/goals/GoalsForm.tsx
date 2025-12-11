import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Flame, Beef, Wheat, Droplet, Droplets } from "lucide-react";
import type { DailyGoals } from "@/types";

interface GoalsFormProps {
  onClose: () => void;
}

export default function GoalsForm({ onClose }: GoalsFormProps) {
  const { goals, locale, updateGoals, resetGoals } = useSettingsStore();

  const [formData, setFormData] = useState<DailyGoals>(goals);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DailyGoals, string>>
  >({});

  const translations = {
    "pt-BR": {
      title: "Configurar Metas Diárias",
      calories: "Calorias (kcal)",
      protein: "Proteína (g)",
      carbs: "Carboidratos (g)",
      fat: "Gordura (g)",
      water: "Água (L)",
      save: "Salvar Metas",
      cancel: "Cancelar",
      reset: "Restaurar Padrões",
      minValue: "Valor muito baixo",
      maxValue: "Valor muito alto",
    },
    "en-US": {
      title: "Set Daily Goals",
      calories: "Calories (kcal)",
      protein: "Protein (g)",
      carbs: "Carbs (g)",
      fat: "Fat (g)",
      water: "Water (L)",
      save: "Save Goals",
      cancel: "Cancel",
      reset: "Reset Defaults",
      minValue: "Value too low",
      maxValue: "Value too high",
    },
  };

  const t = translations[locale];

  const fields = [
    {
      key: "calories" as const,
      label: t.calories,
      icon: Flame,
      color: "green",
      min: 500,
      max: 10000,
    },
    {
      key: "protein" as const,
      label: t.protein,
      icon: Beef,
      color: "red",
      min: 20,
      max: 500,
    },
    {
      key: "carbs" as const,
      label: t.carbs,
      icon: Wheat,
      color: "amber",
      min: 20,
      max: 800,
    },
    {
      key: "fat" as const,
      label: t.fat,
      icon: Droplet,
      color: "indigo",
      min: 20,
      max: 300,
    },
    {
      key: "water" as const,
      label: t.water,
      icon: Droplets,
      color: "blue",
      min: 0.5,
      max: 10,
      step: 0.1,
    },
  ];

  const validate = (key: keyof DailyGoals, value: number): string | null => {
    const field = fields.find((f) => f.key === key);
    if (!field) return null;

    if (value < field.min) return t.minValue;
    if (value > field.max) return t.maxValue;
    return null;
  };

  const handleChange = (key: keyof DailyGoals, value: string) => {
    const numValue = parseFloat(value);
    setFormData((prev) => ({ ...prev, [key]: numValue }));

    const error = validate(key, numValue);
    setErrors((prev) => ({ ...prev, [key]: error || undefined }));
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Partial<Record<keyof DailyGoals, string>> = {};
    fields.forEach((field) => {
      const error = validate(field.key, formData[field.key]);
      if (error) newErrors[field.key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateGoals(formData);
    onClose();
  };

  const handleReset = () => {
    resetGoals();
    onClose();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>

      <div className="space-y-4">
        {fields.map(({ key, label, icon: Icon, color }) => (
          <div key={key}>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Icon className={`h-4 w-4 text-${color}-600`} />
              {label}
            </label>
            <input
              type="number"
              step={key === "water" ? "0.1" : "1"}
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full rounded-lg border ${
                errors[key] ? "border-red-500" : "border-gray-300"
              } px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
            {errors[key] && (
              <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t.cancel}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t.reset}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 font-medium text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
}
