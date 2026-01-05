import { memo } from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { Achievement } from "@/types";

interface AchievementBadgeProps {
  achievement: Achievement;
  delay?: number;
}

function AchievementBadge({ achievement, delay = 0 }: AchievementBadgeProps) {
  const { title, description, icon, isUnlocked } = achievement;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
        isUnlocked
          ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-md hover:shadow-lg dark:border-yellow-700 dark:from-yellow-950/30 dark:to-amber-950/30"
          : "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
      }`}
      role="article"
      aria-label={`Achievement: ${title}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
            isUnlocked
              ? "bg-yellow-100 ring-2 ring-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-700"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
          aria-hidden="true"
        >
          {isUnlocked ? (
            icon
          ) : (
            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          )}
        </div>

        <div className="flex-1">
          <h4
            className={`font-semibold ${
              isUnlocked
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-600"
            }`}
          >
            {title}
          </h4>
          <p
            className={`mt-1 text-sm ${
              isUnlocked
                ? "text-gray-600 dark:text-gray-400"
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute right-2 top-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white dark:bg-green-600 dark:text-gray-100">
            <span className="text-xs" aria-label="Unlocked">
              ✓
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default memo(AchievementBadge);
