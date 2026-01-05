import { useState } from "react";
import { Download, FileText, FileJson, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useToast } from "@/hooks/useToast";
import {
  exportToCSV,
  exportToJSON,
  exportWeeklyReport,
} from "@/services/export";
import { getWeekRange } from "@/utils/dateHelpers";

export default function ExportData() {
  const { history, currentDate } = useNutritionStore();
  const { goals, locale } = useSettingsStore();
  const { success, error } = useToast();

  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingJSON, setLoadingJSON] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

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
      successCSV: "Arquivo CSV exportado com sucesso!",
      successJSON: "Arquivo JSON exportado com sucesso!",
      successReport: "Relatório semanal gerado com sucesso!",
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
      successCSV: "CSV file exported successfully!",
      successJSON: "JSON file exported successfully!",
      successReport: "Weekly report generated successfully!",
    },
  };

  const t = translations[locale];

  const handleExportCSV = async () => {
    setLoadingCSV(true);
    try {
      // Simulate small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = exportToCSV(history, locale);

      if (result.success) {
        success(t.successCSV);
      } else {
        error(result.error || "Export failed");
      }
    } catch (err) {
      error(
        locale === "pt-BR"
          ? "Erro inesperado ao exportar CSV"
          : "Unexpected error exporting CSV"
      );
    } finally {
      setLoadingCSV(false);
    }
  };

  const handleExportJSON = async () => {
    setLoadingJSON(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = exportToJSON(history, goals, locale);

      if (result.success) {
        success(t.successJSON);
      } else {
        error(result.error || "Export failed");
      }
    } catch (err) {
      error(
        locale === "pt-BR"
          ? "Erro inesperado ao exportar JSON"
          : "Unexpected error exporting JSON"
      );
    } finally {
      setLoadingJSON(false);
    }
  };

  const handleWeeklyReport = async () => {
    setLoadingReport(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { start, end } = getWeekRange(currentDate);
      const result = exportWeeklyReport(history, start, end, locale);

      if (result.success) {
        success(t.successReport);
      } else {
        error(result.error || "Export failed");
      }
    } catch (err) {
      error(
        locale === "pt-BR"
          ? "Erro inesperado ao gerar relatório"
          : "Unexpected error generating report"
      );
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
          <Download className="h-6 w-6 text-blue-600 dark:text-blue-500" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* CSV Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportCSV}
          disabled={loadingCSV}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:border-green-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:from-green-950/30 dark:to-emerald-950/30 dark:hover:border-green-600"
          aria-label={t.exportCSV}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
            {loadingCSV ? (
              <Loader2 className="h-6 w-6 animate-spin text-green-600 dark:text-green-500" />
            ) : (
              <FileText className="h-6 w-6 text-green-600 dark:text-green-500" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {t.exportCSV}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {t.exportCSVDesc}
            </p>
          </div>
        </motion.button>

        {/* JSON Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportJSON}
          disabled={loadingJSON}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 transition-all hover:border-blue-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:from-blue-950/30 dark:to-indigo-950/30 dark:hover:border-blue-600"
          aria-label={t.exportJSON}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
            {loadingJSON ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-500" />
            ) : (
              <FileJson className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {t.exportJSON}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {t.exportJSONDesc}
            </p>
          </div>
        </motion.button>

        {/* Weekly Report */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWeeklyReport}
          disabled={loadingReport}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all hover:border-purple-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:from-purple-950/30 dark:to-pink-950/30 dark:hover:border-purple-600"
          aria-label={t.weeklyReport}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
            {loadingReport ? (
              <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-500" />
            ) : (
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-500" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {t.weeklyReport}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {t.weeklyReportDesc}
            </p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
