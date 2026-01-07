import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

interface StreakBadgeProps {
  currentStreak: number;
  locale: "pt-BR" | "en-US";
}

function StreakBadge({ currentStreak, locale }: StreakBadgeProps) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 rounded-2xl border border-gray-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-6 shadow-lg"
    >
      {/* Fire Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
        <Flame
          className={`h-8 w-8 ${
            currentStreak > 0 ? "text-white" : "text-white/60"
          }`}
        />
      </div>

      {/* Streak Info */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
          {t.streak}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            {currentStreak}
          </span>
          <span className="text-sm text-gray-600 dark:text-slate-400">
            {t.days}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
          {currentStreak > 0 ? t.keepGoing : t.startToday}
        </p>
      </div>

      {/* Visual Indicator */}
      {currentStreak >= 7 && (
        <div className="flex items-center justify-center rounded-lg bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 dark:border-orange-500/30 px-3 py-1.5">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
            🔥 {currentStreak >= 30 ? "🏆" : ""}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default memo(StreakBadge);
