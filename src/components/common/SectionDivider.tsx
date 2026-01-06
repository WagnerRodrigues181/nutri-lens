import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionDividerProps {
  title: string;
  icon?: LucideIcon;
  gradient?: "green" | "yellow" | "purple" | "blue";
}

const gradients = {
  green: "from-green-500 to-emerald-500",
  yellow: "from-yellow-500 to-orange-500",
  purple: "from-purple-500 to-pink-500",
  blue: "from-blue-500 to-cyan-500",
};

export default function SectionDivider({
  title,
  icon: Icon,
  gradient = "green",
}: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4"
    >
      {/* Gradient Line */}
      <div
        className={`h-1 w-12 rounded-full bg-gradient-to-r ${gradients[gradient]}`}
      />

      {Icon && (
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradients[gradient]} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      {/* Extending Line */}
      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
    </motion.div>
  );
}
