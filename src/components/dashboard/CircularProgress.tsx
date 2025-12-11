interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
}

export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#10b981",
  label,
  value,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;

  // Determinar cor baseada na porcentagem
  const getColor = () => {
    if (percentage >= 95 && percentage <= 105) return color;
    if (percentage < 95) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const strokeColor = getColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90 transform">
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value && (
          <span className="text-2xl font-bold text-gray-900">{value}</span>
        )}
        {label && <span className="text-xs text-gray-500">{label}</span>}
        <span
          className="mt-1 text-sm font-semibold"
          style={{ color: strokeColor }}
        >
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
