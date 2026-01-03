import { ComponentType, memo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  goal: string;
  progress: number;
  color: "green" | "blue" | "amber" | "red" | "indigo";
  delay?: number;
}

const colorClasses = {
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    ring: "ring-green-500/20",
    progress: "bg-green-500",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    ring: "ring-blue-500/20",
    progress: "bg-blue-500",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    ring: "ring-amber-500/20",
    progress: "bg-amber-500",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    ring: "ring-red-500/20",
    progress: "bg-red-500",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    ring: "ring-indigo-500/20",
    progress: "bg-indigo-500",
  },
};

function MetricCard({
  icon: Icon,
  label,
  value,
  goal,
  progress,
  color,
  delay = 0,
}: MetricCardProps) {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (progress >= 95 && progress <= 105) {
      return <Minus className="h-4 w-4 text-gray-500" aria-hidden="true" />;
    }
    if (progress < 95) {
      return (
        <TrendingDown className="h-4 w-4 text-amber-500" aria-hidden="true" />
      );
    }
    return <TrendingUp className="h-4 w-4 text-red-500" aria-hidden="true" />;
  };

  const getTrendLabel = () => {
    if (progress >= 95 && progress <= 105) {
      return "on target";
    }
    if (progress < 95) {
      return "below target";
    }
    return "above target";
  };

  const getProgressColor = () => {
    if (progress >= 95 && progress <= 105) return colors.progress;
    if (progress < 95) return "bg-amber-500";
    return "bg-red-500";
  };

  const progressValue = Math.round(progress);
  const progressDescription = `${label}: ${value} of ${goal}, ${progressValue}% complete, ${getTrendLabel()}`;

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-gray-200/50"
      role="article"
      aria-label={progressDescription}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.1, type: "spring" }}
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ring-4 ${colors.ring}`}
        aria-hidden="true"
      >
        <Icon className={`h-6 w-6 ${colors.icon}`} />
      </motion.div>

      {/* Label */}
      <p
        className="mb-1 text-sm font-medium text-gray-600"
        id={`label-${label}`}
      >
        {label}
      </p>

      {/* Value and Goal */}
      <div className="mb-3 flex items-baseline gap-2">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
          className="text-3xl font-bold text-gray-900"
          aria-describedby={`label-${label}`}
        >
          {value}
        </motion.span>
        <span className="text-sm text-gray-500" aria-label={`goal ${goal}`}>
          / {goal}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} progress`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, delay: delay + 0.3, ease: "easeOut" }}
          className={`h-full ${getProgressColor()}`}
        />
      </div>

      {/* Progress Percentage and Trend */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium text-gray-600"
          aria-label={`${progressValue} percent complete`}
        >
          {progressValue}%
        </span>
        <div className="flex items-center gap-1" aria-label={getTrendLabel()}>
          {getTrendIcon()}
        </div>
      </div>

      {/* Screen Reader Only Description */}
      <span className="sr-only">{progressDescription}</span>
    </motion.article>
  );
}

export default memo(MetricCard);
