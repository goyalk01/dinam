"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CalendarIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CalendarIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SVG_VARIANTS: Variants = {
  normal: { scale: 1, y: 0 },
  animate: {
    scale: [1, 1.05, 1],
    y: [0, -2, 0],
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

const DAY_VARIANTS: Variants = {
  normal: { scale: 1, opacity: 1 },
  animate: (custom: number) => ({
    scale: [1, 1.3, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 0.4,
      delay: custom * 0.06,
      ease: "easeOut",
    },
  }),
};

const CalendarIcon = forwardRef<CalendarIconHandle, CalendarIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
          variants={SVG_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 2v4M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <motion.path custom={1} variants={DAY_VARIANTS} d="M8 14h.01" strokeWidth="3" />
          <motion.path custom={2} variants={DAY_VARIANTS} d="M12 14h.01" strokeWidth="3" />
          <motion.path custom={3} variants={DAY_VARIANTS} d="M16 14h.01" strokeWidth="3" />
          <motion.path custom={4} variants={DAY_VARIANTS} d="M8 18h.01" strokeWidth="3" />
          <motion.path custom={5} variants={DAY_VARIANTS} d="M12 18h.01" strokeWidth="3" />
          <motion.path custom={6} variants={DAY_VARIANTS} d="M16 18h.01" strokeWidth="3" />
        </motion.svg>
      </div>
    );
  }
);

CalendarIcon.displayName = "CalendarIcon";
export { CalendarIcon };