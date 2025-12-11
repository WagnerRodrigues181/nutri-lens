import { ComponentType } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  goal: string;
  progress: number;
  color: "green" | "blue" | "amber" | "red" | "indigo";
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

export default function MetricCard({
  icon: Icon,
  label,
  value,
  goal,
  progress,
  color,
}: MetricCardProps) {
  const colors = colorClasses[color];

  // Determinar tendência
  const getTrendIcon = () => {
    if (progress >= 95 && progress <= 105) {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
    if (progress < 95) {
      return <TrendingDown className="h-4 w-4 text-amber-500" />;
    }
    return <TrendingUp className="h-4 w-4 text-red-500" />;
  };

  const getProgressColor = () => {
    if (progress >= 95 && progress <= 105) return colors.progress;
    if (progress < 95) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-gray-200/50">
      {/* Icon */}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ring-4 ${colors.ring}`}
      >
        <Icon className={`h-6 w-6 ${colors.icon}`} />
      </div>

      {/* Label */}
      <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>

      {/* Value and Goal */}
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">/ {goal}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">
          {Math.round(progress)}%
        </span>
        <div className="flex items-center gap-1">{getTrendIcon()}</div>
      </div>
    </div>
  );
}
