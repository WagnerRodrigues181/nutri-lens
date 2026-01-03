import { memo } from "react";
import { motion } from "framer-motion";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
  delay?: number;
}

function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#10b981",
  label,
  value,
  delay = 0,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;

  const getColor = () => {
    if (percentage >= 95 && percentage <= 105) return color;
    if (percentage < 95) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusLabel = () => {
    if (percentage >= 95 && percentage <= 105) return "on target";
    if (percentage < 95) return "below target";
    return "above target";
  };

  const strokeColor = getColor();
  const progressValue = Math.round(percentage);
  const progressDescription = label
    ? `${label}: ${
        value || ""
      } - ${progressValue}% complete, ${getStatusLabel()}`
    : `${progressValue}% complete, ${getStatusLabel()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={progressDescription}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        role="presentation"
        aria-hidden="true"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          role="presentation"
        />
      </svg>

      {/* Center Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        {value && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.5 }}
            className="text-2xl font-bold text-gray-900"
          >
            {value}
          </motion.span>
        )}
        {label && <span className="text-xs text-gray-500">{label}</span>}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.7 }}
          className="mt-1 text-sm font-semibold"
          style={{ color: strokeColor }}
        >
          {progressValue}%
        </motion.span>
      </div>

      {/* Screen Reader Only Description */}
      <span className="sr-only">{progressDescription}</span>

      {/* Hidden Progress Bar for Accessibility */}
      <div
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
        className="sr-only"
      >
        {progressValue}%
      </div>
    </motion.div>
  );
}

export default memo(CircularProgress);
