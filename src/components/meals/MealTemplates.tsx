import { useState } from "react";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Heart,
} from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatMealCategory } from "@/utils/formatters";
import type { MealTemplate, MealCategory } from "@/types";

interface TemplateFormData {
  name: string;
  category: MealCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isFavorite: boolean;
}

export default function MealTemplates() {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addMealFromTemplate,
  } = useNutritionStore();
  const { locale } = useSettingsStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    MealTemplate | undefined
  >();

  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    category: "breakfast",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    isFavorite: false,
  });

  const translations = {
    "pt-BR": {
      title: "Refeições Favoritas",
      subtitle: "Salve suas refeições frequentes para adicionar rapidamente",
      addTemplate: "Novo Template",
      editTemplate: "Editar Template",
      save: "Salvar",
      cancel: "Cancelar",
      addToDay: "Adicionar",
      noTemplates: "Nenhum template salvo ainda",
      name: "Nome",
      category: "Categoria",
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche",
      favorite: "Favorito",
      namePlaceholder: "Ex: Frango com batata doce",
    },
    "en-US": {
      title: "Favorite Meals",
      subtitle: "Save your frequent meals to add them quickly",
      addTemplate: "New Template",
      editTemplate: "Edit Template",
      save: "Save",
      cancel: "Cancel",
      addToDay: "Add",
      noTemplates: "No templates saved yet",
      name: "Name",
      category: "Category",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      favorite: "Favorite",
      namePlaceholder: "Ex: Chicken with sweet potato",
    },
  };

  const t = translations[locale];

  const handleEdit = (template: MealTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      calories: template.calories,
      protein: template.protein,
      carbs: template.carbs,
      fat: template.fat,
      isFavorite: template.isFavorite,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const message =
      locale === "pt-BR"
        ? "Tem certeza que deseja deletar este template?"
        : "Are you sure you want to delete this template?";

    if (confirm(message)) {
      deleteTemplate(id);
    }
  };

  const handleAddToDay = (templateId: string) => {
    addMealFromTemplate(templateId);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, formData);
    } else {
      addTemplate(formData);
    }

    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTemplate(undefined);
    setFormData({
      name: "",
      category: "breakfast",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      isFavorite: false,
    });
  };

  const handleOpenForm = () => {
    setEditingTemplate(undefined);
    setFormData({
      name: "",
      category: "breakfast",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      isFavorite: false,
    });
    setIsFormOpen(true);
  };

  const favoriteTemplates = templates.filter((t) => t.isFavorite);
  const regularTemplates = templates.filter((t) => !t.isFavorite);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <button
            onClick={handleOpenForm}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            {t.addTemplate}
          </button>
        </div>
      </div>

      {/* Templates List */}
      {templates.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Heart className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-600">{t.noTemplates}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Favorites */}
          {favoriteTemplates.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {t.favorite}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddToDay={handleAddToDay}
                    locale={locale}
                    addLabel={t.addToDay}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Templates */}
          {regularTemplates.length > 0 && (
            <div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {regularTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddToDay={handleAddToDay}
                    locale={locale}
                    addLabel={t.addToDay}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Template Form Modal */}
      {isFormOpen && (
        <TemplateFormModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          isEditing={!!editingTemplate}
          locale={locale}
        />
      )}
    </div>
  );
}

// Template Card Component
interface TemplateCardProps {
  template: MealTemplate;
  onEdit: (template: MealTemplate) => void;
  onDelete: (id: string) => void;
  onAddToDay: (id: string) => void;
  locale: "pt-BR" | "en-US";
  addLabel: string;
}

function TemplateCard({
  template,
  onEdit,
  onDelete,
  onAddToDay,
  locale,
  addLabel,
}: TemplateCardProps) {
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
      {template.isFavorite && (
        <div className="absolute right-2 top-2">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
        </div>
      )}

      <div className="mb-3">
        <h4 className="font-semibold text-gray-900">{template.name}</h4>
        <p className="text-xs text-gray-600">
          {formatMealCategory(template.category, locale)}
        </p>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center rounded bg-white p-1.5">
          <Flame className="mb-0.5 h-3 w-3 text-green-600" />
          <span className="text-[10px] font-medium">
            {Math.round(template.calories)}
          </span>
        </div>
        <div className="flex flex-col items-center rounded bg-white p-1.5">
          <Beef className="mb-0.5 h-3 w-3 text-red-600" />
          <span className="text-[10px] font-medium">
            {template.protein.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col items-center rounded bg-white p-1.5">
          <Wheat className="mb-0.5 h-3 w-3 text-amber-600" />
          <span className="text-[10px] font-medium">
            {template.carbs.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col items-center rounded bg-white p-1.5">
          <Droplet className="mb-0.5 h-3 w-3 text-indigo-600" />
          <span className="text-[10px] font-medium">
            {template.fat.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAddToDay(template.id)}
          className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600"
        >
          {addLabel}
        </button>
        <button
          onClick={() => onEdit(template)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// Template Form Modal
interface TemplateFormModalProps {
  formData: TemplateFormData;
  setFormData: (data: TemplateFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  isEditing: boolean;
  locale: "pt-BR" | "en-US";
}

function TemplateFormModal({
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing,
  locale,
}: TemplateFormModalProps) {
  const t = {
    "pt-BR": {
      add: "Novo Template",
      edit: "Editar Template",
      name: "Nome",
      category: "Categoria",
      breakfast: "Café",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche",
      favorite: "Favorito",
      save: "Salvar",
      cancel: "Cancelar",
      placeholder: "Ex: Frango com batata doce",
    },
    "en-US": {
      add: "New Template",
      edit: "Edit Template",
      name: "Name",
      category: "Category",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      favorite: "Favorite",
      save: "Save",
      cancel: "Cancel",
      placeholder: "Ex: Chicken with sweet potato",
    },
  }[locale];

  const categories = [
    { value: "breakfast", label: t.breakfast },
    { value: "lunch", label: t.lunch },
    { value: "dinner", label: t.dinner },
    { value: "snack", label: t.snack },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6">
        <h3 className="mb-4 text-xl font-bold">{isEditing ? t.edit : t.add}</h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">{t.name}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t.placeholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() =>
                  setFormData({
                    ...formData,
                    category: cat.value as MealCategory,
                  })
                }
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  formData.category === cat.value
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm">Calorias</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    calories: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Proteína (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    protein: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Carboidratos (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carbs: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Gordura (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fat: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fav"
              checked={formData.isFavorite}
              onChange={(e) =>
                setFormData({ ...formData, isFavorite: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="fav" className="text-sm font-medium">
              {t.favorite}
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium"
          >
            {t.cancel}
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 font-medium text-white"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
