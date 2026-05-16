"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MusicIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MusicIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const NOTE_VARIANTS: Variants = {
  normal: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.05, 0.98, 1],
    rotate: [0, -3, 3, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const BUBBLE_NOTE_1: Variants = {
  normal: { opacity: 0, scale: 0, x: 0, y: 0 },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [0.4, 0.7, 0.7, 0.3],
    x: [0, 8, 14],
    y: [0, -8, -16],
    transition: { duration: 0.8, ease: "easeOut", delay: 0.1 },
  },
};

const BUBBLE_NOTE_2: Variants = {
  normal: { opacity: 0, scale: 0, x: 0, y: 0 },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [0.3, 0.6, 0.6, 0.2],
    x: [0, -6, -10],
    y: [0, -6, -14],
    transition: { duration: 0.7, ease: "easeOut", delay: 0.25 },
  },
};

const MusicIcon = forwardRef<MusicIconHandle, MusicIconProps>(
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
        className={cn("inline-flex items-center justify-center relative", className)}
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
          strokeWidth="1.5"
          variants={NOTE_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 9L19.5 6M19.5 12.5528V16.3028C19.5 17.3074 18.834 18.1903 17.8681 18.4663L16.5481 18.8434C15.3964 19.1724 14.25 18.3077 14.25 17.1099C14.25 16.305 14.7836 15.5975 15.5576 15.3764L17.8681 14.7163C18.834 14.4403 19.5 13.5574 19.5 12.5528ZM19.5 12.5528V2.25L9 5.25V15.5528M9 15.5528V19.3028C9 20.3074 8.33405 21.1903 7.36812 21.4663L6.04814 21.8434C4.89645 22.1724 3.75 21.3077 3.75 20.1099C3.75 19.305 4.2836 18.5975 5.05757 18.3764L7.36812 17.7163C8.33405 17.4403 9 16.5574 9 15.5528Z" />
          <motion.path variants={BUBBLE_NOTE_1} d="M16 6.5V3.5M16 3.5C16 3.5 17 2.5 18.5 3" strokeWidth="1.2" />
          <motion.circle variants={BUBBLE_NOTE_2} cx="6" cy="10" r="1" fill="currentColor" />
        </motion.svg>
      </div>
    );
  }
);

MusicIcon.displayName = "MusicIcon";
export { MusicIcon };