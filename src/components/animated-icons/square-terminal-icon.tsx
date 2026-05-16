"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TerminalIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface TerminalIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const cursorVariants: Variants = {
  normal: { opacity: 1 },
  animate: { opacity: [1, 0, 1], transition: { duration: 0.6, repeat: Infinity, ease: "steps(2, start)" } },
};

const SquareTerminalIcon = forwardRef<TerminalIconHandle, TerminalIconProps>(
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
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 9l3 3-3 3" />
          <motion.path d="M13 15h4" variants={cursorVariants} />
        </motion.svg>
      </div>
    );
  }
);
SquareTerminalIcon.displayName = "SquareTerminalIcon";
export { SquareTerminalIcon };