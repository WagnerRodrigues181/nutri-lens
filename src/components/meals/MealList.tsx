import { useState, memo } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import MealCard from "./MealCard";
import MealForm from "./MealForm";
import EmptyState from "../common/EmptyState";
import type { Meal, MealCategory } from "@/types";

function MealList() {
  const { getCurrentDayData, deleteMeal } = useNutritionStore();
  const { locale } = useSettingsStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();

  const dayData = getCurrentDayData();
  const { meals } = dayData;

  const translations = {
    "pt-BR": {
      title: "Refeições de Hoje",
      addMeal: "Adicionar Refeição",
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanches",
      noMeals: "Nenhuma refeição registrada",
      noMealsDesc: "Comece adicionando sua primeira refeição do dia",
      addFirst: "Adicionar Primeira Refeição",
    },
    "en-US": {
      title: "Today's Meals",
      addMeal: "Add Meal",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snacks",
      noMeals: "No meals recorded",
      noMealsDesc: "Start by adding your first meal of the day",
      addFirst: "Add First Meal",
    },
  };

  const t = translations[locale];

  const categoryLabels: Record<MealCategory, string> = {
    breakfast: t.breakfast,
    lunch: t.lunch,
    dinner: t.dinner,
    snack: t.snack,
  };

  const mealsByCategory = meals.reduce((acc, meal) => {
    if (!acc[meal.category]) {
      acc[meal.category] = [];
    }
    acc[meal.category].push(meal);
    return acc;
  }, {} as Record<MealCategory, Meal[]>);

  const categories: MealCategory[] = ["breakfast", "lunch", "dinner", "snack"];

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMeal(undefined);
  };

  const handleAddNew = () => {
    setEditingMeal(undefined);
    setIsFormOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          {t.title}
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
        >
          <Plus className="h-4 w-4" />
          {t.addMeal}
        </motion.button>
      </div>

      {/* Empty State */}
      {meals.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title={t.noMeals}
          description={t.noMealsDesc}
          action={{
            label: t.addFirst,
            onClick: handleAddNew,
          }}
        />
      )}

      {/* Meals by Category */}
      {meals.length > 0 && (
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryMeals = mealsByCategory[category] || [];
            if (categoryMeals.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-slate-300">
                  {categoryLabels[category]}
                </h4>
                <AnimatePresence mode="popLayout">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categoryMeals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onEdit={handleEdit}
                        onDelete={deleteMeal}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Meal Form Modal */}
      {isFormOpen && <MealForm meal={editingMeal} onClose={handleCloseForm} />}
    </motion.div>
  );
}

export default memo(MealList);
