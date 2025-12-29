import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ScaleInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.2,
  ...props
}: ScaleInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
