import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getTodayDate } from "@/utils/dateHelpers";

export default function CalendarView() {
  const { history, currentDate, setCurrentDate } = useNutritionStore();
  const { locale } = useSettingsStore();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const weekDays =
    locale === "pt-BR"
      ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthNames =
    locale === "pt-BR"
      ? [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

  const translations = {
    "pt-BR": {
      previousMonth: "Mês anterior",
      nextMonth: "Próximo mês",
      today: "Hoje",
      selected: "Selecionado",
      hasData: "Com dados",
      selectDay: (day: number) => `Selecionar dia ${day}`,
    },
    "en-US": {
      previousMonth: "Previous month",
      nextMonth: "Next month",
      today: "Today",
      selected: "Selected",
      hasData: "Has data",
      selectDay: (day: number) => `Select day ${day}`,
    },
  };

  const t = translations[locale];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);
  const emptyCells = Array(firstDayOfWeek).fill(null);

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setCurrentDate(dateString);
  };

  const getDayStatus = (
    day: number
  ): "empty" | "has-data" | "today" | "selected" => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const today = getTodayDate();

    if (dateString === today) return "today";
    if (dateString === currentDate) return "selected";
    if (history[dateString] && history[dateString].meals.length > 0)
      return "has-data";
    return "empty";
  };

  const getDayAriaLabel = (day: number) => {
    const status = getDayStatus(day);
    const dateString = `${monthNames[month]} ${day}, ${year}`;

    if (status === "today") return `${dateString} (${t.today})`;
    if (status === "selected") return `${dateString} (${t.selected})`;
    if (status === "has-data") return `${dateString} (${t.hasData})`;
    return dateString;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      role="region"
      aria-label={`Calendar for ${monthNames[month]} ${year}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100"
          id="calendar-title"
        >
          {monthNames[month]} {year}
        </h3>
        <div
          className="flex gap-2"
          role="group"
          aria-label="Calendar navigation"
        >
          <button
            onClick={handlePreviousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
            aria-label={t.previousMonth}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
            aria-label={t.nextMonth}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className="grid grid-cols-7 gap-1"
        role="grid"
        aria-labelledby="calendar-title"
      >
        {/* Week Day Headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400"
            role="columnheader"
            aria-label={day}
          >
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-10" role="gridcell" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const status = getDayStatus(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                status === "today"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30 dark:bg-green-600"
                  : status === "selected"
                  ? "bg-green-100 text-green-700 ring-2 ring-green-500 dark:bg-green-900/30 dark:text-green-400"
                  : status === "has-data"
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              role="gridcell"
              aria-label={getDayAriaLabel(day)}
              aria-current={status === "today" ? "date" : undefined}
              aria-pressed={status === "selected"}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="mt-4 flex flex-wrap gap-3 border-t border-gray-200 pt-4 dark:border-gray-700"
        role="list"
        aria-label="Calendar legend"
      >
        <div className="flex items-center gap-2" role="listitem">
          <div
            className="h-3 w-3 rounded bg-green-500 dark:bg-green-600"
            aria-hidden="true"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {t.today}
          </span>
        </div>
        <div className="flex items-center gap-2" role="listitem">
          <div
            className="h-3 w-3 rounded bg-green-100 ring-2 ring-green-500 dark:bg-green-900/30 dark:ring-green-400"
            aria-hidden="true"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {t.selected}
          </span>
        </div>
        <div className="flex items-center gap-2" role="listitem">
          <div
            className="h-3 w-3 rounded bg-blue-50 dark:bg-blue-900/30"
            aria-hidden="true"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {t.hasData}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
