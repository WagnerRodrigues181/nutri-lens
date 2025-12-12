import { Download, FileText, FileJson, Calendar } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  exportToCSV,
  exportToJSON,
  exportWeeklyReport,
} from "@/services/export";
import { getWeekRange } from "@/utils/dateHelpers";

export default function ExportData() {
  const { history, currentDate } = useNutritionStore();
  const { goals, locale } = useSettingsStore();

  const translations = {
    "pt-BR": {
      title: "Exportar Dados",
      subtitle: "Baixe seus dados para backup ou análise",
      exportCSV: "Exportar CSV",
      exportCSVDesc: "Todos os dados em formato planilha",
      exportJSON: "Exportar JSON",
      exportJSONDesc: "Backup completo dos dados",
      weeklyReport: "Relatório Semanal",
      weeklyReportDesc: "Resumo da semana atual",
    },
    "en-US": {
      title: "Export Data",
      subtitle: "Download your data for backup or analysis",
      exportCSV: "Export CSV",
      exportCSVDesc: "All data in spreadsheet format",
      exportJSON: "Export JSON",
      exportJSONDesc: "Complete data backup",
      weeklyReport: "Weekly Report",
      weeklyReportDesc: "Current week summary",
    },
  };

  const t = translations[locale];

  const handleExportCSV = () => {
    exportToCSV(history, locale);
  };

  const handleExportJSON = () => {
    exportToJSON(history, goals);
  };

  const handleWeeklyReport = () => {
    const { start, end } = getWeekRange(currentDate);
    exportWeeklyReport(history, start, end, locale);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <Download className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={handleExportCSV}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:border-green-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{t.exportCSV}</p>
            <p className="mt-1 text-xs text-gray-600">{t.exportCSVDesc}</p>
          </div>
        </button>

        <button
          onClick={handleExportJSON}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
            <FileJson className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{t.exportJSON}</p>
            <p className="mt-1 text-xs text-gray-600">{t.exportJSONDesc}</p>
          </div>
        </button>

        <button
          onClick={handleWeeklyReport}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{t.weeklyReport}</p>
            <p className="mt-1 text-xs text-gray-600">{t.weeklyReportDesc}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
