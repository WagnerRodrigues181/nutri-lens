import { CheckCircle, AlertCircle, Info, Trophy } from "lucide-react";
import type { Insight } from "@/types";

interface InsightCardProps {
  insight: Insight;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    iconColor: "text-green-600",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-600",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-600",
  },
  achievement: {
    icon: Trophy,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    iconColor: "text-purple-600",
  },
};

export default function InsightCard({ insight }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${config.borderColor} ${config.bgColor} p-4 transition-all hover:shadow-md`}
    >
      {insight.icon ? (
        <span className="text-2xl">{insight.icon}</span>
      ) : (
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
      )}
      <p className={`text-sm font-medium ${config.textColor}`}>
        {insight.message}
      </p>
    </div>
  );
}
