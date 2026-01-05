import { memo } from "react";
import { CheckCircle, AlertCircle, Info, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { Insight } from "@/types";

interface InsightCardProps {
  insight: Insight;
  delay?: number;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-900",
    textColor: "text-green-700 dark:text-green-400",
    iconColor: "text-green-600 dark:text-green-500",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-900",
    textColor: "text-amber-700 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-900",
    textColor: "text-blue-700 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-500",
  },
  achievement: {
    icon: Trophy,
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-900",
    textColor: "text-purple-700 dark:text-purple-400",
    iconColor: "text-purple-600 dark:text-purple-500",
  },
};

function InsightCard({ insight, delay = 0 }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex items-start gap-3 rounded-lg border ${config.borderColor} ${config.bgColor} p-4 transition-all hover:shadow-md`}
      role="status"
      aria-live="polite"
    >
      {insight.icon ? (
        <span className="text-2xl" aria-hidden="true">
          {insight.icon}
        </span>
      ) : (
        <Icon
          className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`}
          aria-hidden="true"
        />
      )}
      <p className={`text-sm font-medium ${config.textColor}`}>
        {insight.message}
      </p>
    </motion.div>
  );
}

export default memo(InsightCard);
