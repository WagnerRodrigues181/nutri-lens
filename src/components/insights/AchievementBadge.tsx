import { Lock } from "lucide-react";
import type { Achievement } from "@/types";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({
  achievement,
}: AchievementBadgeProps) {
  const { title, description, icon, isUnlocked } = achievement;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
        isUnlocked
          ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-md hover:shadow-lg"
          : "border-gray-200 bg-gray-50 opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
            isUnlocked ? "bg-yellow-100 ring-2 ring-yellow-300" : "bg-gray-200"
          }`}
        >
          {isUnlocked ? icon : <Lock className="h-5 w-5 text-gray-400" />}
        </div>

        <div className="flex-1">
          <h4
            className={`font-semibold ${
              isUnlocked ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {title}
          </h4>
          <p
            className={`mt-1 text-sm ${
              isUnlocked ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute right-2 top-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
            <span className="text-xs">✓</span>
          </div>
        </div>
      )}
    </div>
  );
}
