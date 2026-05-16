"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SquarePenIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SquarePenIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const penVariants: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, 2, -1, 0],
    y: [0, -2, 1, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const SquarePenIcon = forwardRef<SquarePenIconHandle, SquarePenIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 24, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={(e) => isControlledRef.current ? onMouseEnter?.(e) : controls.start("animate")}
        onMouseLeave={(e) => isControlledRef.current ? onMouseLeave?.(e) : controls.start("normal")}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <motion.path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" variants={penVariants} />
        </motion.svg>
      </div>
    );
  }
);
SquarePenIcon.displayName = "SquarePenIcon";
export { SquarePenIcon };