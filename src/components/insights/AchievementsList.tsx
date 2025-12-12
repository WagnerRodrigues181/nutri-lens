import { Trophy } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { checkAchievements } from "@/services/achievements";
import AchievementBadge from "./AchievementBadge";

interface AchievementsListProps {
  currentStreak?: number;
}

export default function AchievementsList({
  currentStreak = 0,
}: AchievementsListProps) {
  const { history } = useNutritionStore();
  const { locale } = useSettingsStore();

  const achievements = checkAchievements(history, currentStreak, locale);
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const translations = {
    "pt-BR": {
      title: "Conquistas",
      subtitle: `${unlockedCount} de ${achievements.length} desbloqueadas`,
    },
    "en-US": {
      title: "Achievements",
      subtitle: `${unlockedCount} of ${achievements.length} unlocked`,
    },
  };

  const t = translations[locale];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
          <Trophy className="h-6 w-6 text-amber-600" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
