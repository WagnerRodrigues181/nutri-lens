import { useState, useRef } from "react";
import {
  Download,
  Upload,
  FileText,
  FileJson,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useToast } from "@/hooks/useToast";
import {
  exportToCSV,
  exportToJSON,
  exportWeeklyReport,
} from "@/services/export";
import { importFromJSON, importFromCSV } from "@/services/import";
import { getWeekRange } from "@/utils/dateHelpers";

export default function ImportExportData() {
  const { history, currentDate } = useNutritionStore();
  const { goals, locale, updateGoals } = useSettingsStore();
  const { success, error } = useToast();

  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingJSON, setLoadingJSON] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    "pt-BR": {
      title: "Importar & Exportar Dados",
      subtitle: "Faça backup ou restaure seus dados",
      importData: "Importar Dados",
      importDataDesc: "Restaurar de backup (JSON/CSV)",
      exportCSV: "Exportar CSV",
      exportCSVDesc: "Todos os dados em planilha",
      exportJSON: "Exportar JSON",
      exportJSONDesc: "Backup completo",
      weeklyReport: "Relatório Semanal",
      weeklyReportDesc: "Resumo da semana",
      successCSV: "CSV exportado com sucesso!",
      successJSON: "JSON exportado com sucesso!",
      successReport: "Relatório gerado!",
      successImport: "Dados importados com sucesso!",
      importWithGoals: "Dados e metas importados!",
      confirmImport: "Importar dados? Isso substituirá os dados atuais.",
    },
    "en-US": {
      title: "Import & Export Data",
      subtitle: "Backup or restore your data",
      importData: "Import Data",
      importDataDesc: "Restore from backup (JSON/CSV)",
      exportCSV: "Export CSV",
      exportCSVDesc: "All data in spreadsheet",
      exportJSON: "Export JSON",
      exportJSONDesc: "Complete backup",
      weeklyReport: "Weekly Report",
      weeklyReportDesc: "Current week summary",
      successCSV: "CSV exported successfully!",
      successJSON: "JSON exported successfully!",
      successReport: "Report generated!",
      successImport: "Data imported successfully!",
      importWithGoals: "Data and goals imported!",
      confirmImport: "Import data? This will replace current data.",
    },
  };

  const t = translations[locale];

  const handleExportCSV = async () => {
    setLoadingCSV(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const result = exportToCSV(history, locale);

      if (result.success) {
        success(t.successCSV);
      } else {
        error(result.error || "Export failed");
      }
    } catch (err) {
      error("Unexpected error");
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
      error("Unexpected error");
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
      error("Unexpected error");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Confirm before importing
    const confirmed = window.confirm(t.confirmImport);
    if (!confirmed) {
      // Reset input
      event.target.value = "";
      return;
    }

    setLoadingImport(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let result;

      // Determine file type and import
      if (file.name.endsWith(".json")) {
        result = await importFromJSON(file, locale);
      } else if (file.name.endsWith(".csv")) {
        result = await importFromCSV(file, locale);
      } else {
        error(
          locale === "pt-BR"
            ? "Formato não suportado. Use .json ou .csv"
            : "Unsupported format. Use .json or .csv"
        );
        return;
      }

      console.log("Import result:", result); // DEBUG

      if (result.success && result.data) {
        console.log("Imported data:", result.data); // DEBUG

        // Merge imported history with existing
        const store = useNutritionStore.getState();
        const mergedHistory = { ...store.history, ...result.data.history };

        console.log("Merged history:", mergedHistory); // DEBUG

        // Update store
        useNutritionStore.setState({ history: mergedHistory });

        console.log("Store updated!"); // DEBUG

        // Update goals if present
        if (result.data.goals) {
          updateGoals(result.data.goals);
          success(t.importWithGoals);
        } else {
          success(t.successImport);
        }
      } else {
        console.error("Import failed:", result.error); // DEBUG
        error(result.error || "Import failed");
      }
    } catch (err) {
      console.error("Exception during import:", err); // DEBUG
      error("Unexpected error");
    } finally {
      setLoadingImport(false);
      // Reset input
      event.target.value = "";
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Import Data */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleImportClick}
          disabled={loadingImport}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 transition-all hover:border-orange-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:from-orange-950/30 dark:to-amber-950/30 dark:hover:border-orange-600"
          aria-label={t.importData}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
            {loadingImport ? (
              <Loader2 className="h-6 w-6 animate-spin text-orange-600 dark:text-orange-500" />
            ) : (
              <Upload className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {t.importData}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {t.importDataDesc}
            </p>
          </div>
        </motion.button>

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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Import file"
      />
    </motion.div>
  );
}
