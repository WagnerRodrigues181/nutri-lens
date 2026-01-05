import { memo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { formatDateWithLocale, getTodayDate } from "@/utils/dateHelpers";
import { addDays, subDays } from "date-fns";

function DateNavigator() {
  const { currentDate, setCurrentDate } = useNutritionStore();
  const { locale } = useSettingsStore();

  const translations = {
    "pt-BR": {
      previousDay: "Dia anterior",
      nextDay: "Próximo dia",
      today: "Hoje",
      goToToday: "Ir para hoje",
    },
    "en-US": {
      previousDay: "Previous day",
      nextDay: "Next day",
      today: "Today",
      goToToday: "Go to today",
    },
  };

  const t = translations[locale];

  const handlePreviousDay = () => {
    const newDate = subDays(new Date(currentDate), 1);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const newDate = addDays(new Date(currentDate), 1);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setCurrentDate(getTodayDate());
  };

  const isToday = currentDate === getTodayDate();
  const formattedDate = formatDateWithLocale(
    currentDate,
    locale,
    "EEEE, dd 'de' MMMM 'de' yyyy"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Previous Day Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePreviousDay}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={t.previousDay}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {/* Current Date Display */}
      <div className="flex flex-1 items-center justify-center gap-3 px-4">
        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formattedDate}
          </p>
          {isToday && (
            <span className="text-xs font-semibold text-green-600 dark:text-green-500">
              {t.today}
            </span>
          )}
        </div>
      </div>

      {/* Today Button (only show if not today) */}
      {!isToday && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToday}
          className="mr-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-600 dark:hover:bg-green-700"
          aria-label={t.goToToday}
        >
          {t.today}
        </motion.button>
      )}

      {/* Next Day Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextDay}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={t.nextDay}
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
}

export default memo(DateNavigator);
