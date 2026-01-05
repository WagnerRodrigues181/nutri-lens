import { ComponentType, memo } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </motion.div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="rounded-lg bg-green-500 px-6 py-2.5 font-medium text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 dark:bg-green-600 dark:hover:bg-green-700"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

export default memo(EmptyState);
