import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "circle" | "chart";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "card",
  count = 1,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (variant === "card") {
    return (
      <>
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-4 w-24 rounded bg-gray-200"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="h-8 w-32 rounded bg-gray-200"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="h-2 w-full rounded bg-gray-200"
              />
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  if (variant === "text") {
    return (
      <>
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            className="h-4 w-full rounded bg-gray-200"
          />
        ))}
      </>
    );
  }

  if (variant === "circle") {
    return (
      <>
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            className="h-32 w-32 rounded-full bg-gray-200"
          />
        ))}
      </>
    );
  }

  if (variant === "chart") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="space-y-4">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-6 w-48 rounded bg-gray-200"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="h-64 w-full rounded bg-gray-100"
          />
        </div>
      </motion.div>
    );
  }

  return null;
}
