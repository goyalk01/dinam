"use client";

import { motion, useAnimation } from "motion/react";
import type React from "react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface FileTextIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface FileTextIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FILE_TEXT = forwardRef<FileTextIconHandle, FileTextIconProps>(
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
          variants={{
            normal: { scale: 1 },
            animate: {
              scale: 1.03,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
          }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Document Wrapper Shape */}
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />

          {/* Line 1 (Top Short Line) */}
          <motion.path
            d="M8 9h2"
            variants={{
              normal: { pathLength: 1 },
              animate: {
                pathLength: [1, 0, 1],
                transition: {
                  duration: 0.6,
                  delay: 0.1,
                  ease: "easeInOut",
                },
              },
            }}
          />
          
          {/* Line 2 (Middle Full Line) */}
          <motion.path
            d="M8 13h8"
            variants={{
              normal: { pathLength: 1 },
              animate: {
                pathLength: [1, 0, 1],
                transition: {
                  duration: 0.6,
                  delay: 0.25,
                  ease: "easeInOut",
                },
              },
            }}
          />
          
          {/* Line 3 (Bottom Full Line) */}
          <motion.path
            d="M8 17h8"
            variants={{
              normal: { pathLength: 1 },
              animate: {
                pathLength: [1, 0, 1],
                transition: {
                  duration: 0.6,
                  delay: 0.4,
                  ease: "easeInOut",
                },
              },
            }}
          />
        </motion.svg>
      </div>
    );
  }
);

FILE_TEXT.displayName = "FileTextIcon";

export { FILE_TEXT as FileTextIcon };