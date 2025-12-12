import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getTodayDate, parseDate } from "@/utils/dateHelpers";

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week Day Headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-xs font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const status = getDayStatus(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                status === "today"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : status === "selected"
                  ? "bg-green-100 text-green-700 ring-2 ring-green-500"
                  : status === "has-data"
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-500" />
          <span className="text-xs text-gray-600">
            {locale === "pt-BR" ? "Hoje" : "Today"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-100 ring-2 ring-green-500" />
          <span className="text-xs text-gray-600">
            {locale === "pt-BR" ? "Selecionado" : "Selected"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-blue-50" />
          <span className="text-xs text-gray-600">
            {locale === "pt-BR" ? "Com dados" : "Has data"}
          </span>
        </div>
      </div>
    </div>
  );
}
