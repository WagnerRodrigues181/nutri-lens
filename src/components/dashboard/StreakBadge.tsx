import { Flame } from "lucide-react";

interface StreakBadgeProps {
  currentStreak: number;
  locale: "pt-BR" | "en-US";
}

export default function StreakBadge({
  currentStreak,
  locale,
}: StreakBadgeProps) {
  const translations = {
    "pt-BR": {
      streak: "Sequência",
      days: currentStreak === 1 ? "dia" : "dias",
      keepGoing: "Continue assim!",
      startToday: "Comece hoje!",
    },
    "en-US": {
      streak: "Streak",
      days: currentStreak === 1 ? "day" : "days",
      keepGoing: "Keep it up!",
      startToday: "Start today!",
    },
  };

  const t = translations[locale];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-sm">
      {/* Fire Icon with Animation */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
        <Flame className="h-8 w-8 text-orange-500" />
      </div>

      {/* Streak Info */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{t.streak}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {currentStreak}
          </span>
          <span className="text-sm text-gray-600">{t.days}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {currentStreak > 0 ? t.keepGoing : t.startToday}
        </p>
      </div>

      {/* Visual Indicator */}
      {currentStreak >= 7 && (
        <div className="flex items-center justify-center rounded-lg bg-orange-100 px-3 py-1.5">
          <span className="text-xs font-semibold text-orange-700">
            🔥 {currentStreak >= 30 ? "🏆" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
