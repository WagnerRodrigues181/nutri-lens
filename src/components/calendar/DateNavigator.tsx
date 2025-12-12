import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  formatDateWithLocale,
  getPreviousDay,
  getNextDay,
  getTodayDate,
  isTodayDate,
} from "@/utils/dateHelpers";

export default function DateNavigator() {
  const { currentDate, setCurrentDate } = useNutritionStore();
  const { locale } = useSettingsStore();

  const isToday = isTodayDate(currentDate);

  const handlePrevious = () => {
    setCurrentDate(getPreviousDay(currentDate));
  };

  const handleNext = () => {
    if (!isToday) {
      setCurrentDate(getNextDay(currentDate));
    }
  };

  const handleToday = () => {
    setCurrentDate(getTodayDate());
  };

  const formattedDate = formatDateWithLocale(
    currentDate,
    locale,
    "EEEE, dd MMMM yyyy"
  );

  const translations = {
    "pt-BR": {
      today: "Hoje",
      previous: "Dia Anterior",
      next: "Próximo Dia",
    },
    "en-US": {
      today: "Today",
      previous: "Previous Day",
      next: "Next Day",
    },
  };

  const t = translations[locale];

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-all hover:border-green-500 hover:bg-green-50 hover:text-green-600"
        aria-label={t.previous}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Date Display */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">
            {formattedDate}
          </span>
        </div>
        {!isToday && (
          <button
            onClick={handleToday}
            className="mt-1 text-xs font-medium text-green-600 hover:text-green-700"
          >
            {t.today}
          </button>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={isToday}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
          isToday
            ? "cursor-not-allowed border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-600 hover:border-green-500 hover:bg-green-50 hover:text-green-600"
        }`}
        aria-label={t.next}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
