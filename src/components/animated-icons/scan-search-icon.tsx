"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@/lib/utils"

export interface ScanSearchIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface ScanSearchIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

const cornerVariants: Variants = {
  normal: { scale: 1 },
  animate: { scale: 1.12, transition: { duration: 0.25, ease: "easeOut" } },
}

const glassVariants: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, 1.5, -0.5, 0],
    y: [0, -1.5, 0.5, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
}

const ScanSearchIcon = forwardRef<ScanSearchIconHandle, ScanSearchIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 24, ...props }, ref) => {
    const controls = useAnimation()
    const isControlledRef = useRef(false)

    useImperativeHandle(ref, () => {
      isControlledRef.current = true
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        controls.start("animate")
        onMouseEnter?.(e)
      },
      [controls, onMouseEnter]
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        controls.start("normal")
        onMouseLeave?.(e)
      },
      [controls, onMouseLeave]
    )

    return (
      <div
        className={cn(
          "inline-flex h-full w-full items-center justify-center",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          initial="normal"
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M3 7V5a2 2 0 0 1 2-2h2"
            style={{ transformOrigin: "3px 3px" }}
            variants={cornerVariants}
          />
          <motion.path
            d="M17 3h2a2 2 0 0 1 2 2v2"
            style={{ transformOrigin: "21px 3px" }}
            variants={cornerVariants}
          />
          <motion.path
            d="M21 17v2a2 2 0 0 1-2 2h-2"
            style={{ transformOrigin: "21px 21px" }}
            variants={cornerVariants}
          />
          <motion.path
            d="M7 21H5a2 2 0 0 1-2-2v-2"
            style={{ transformOrigin: "3px 21px" }}
            variants={cornerVariants}
          />

          <motion.g
            style={{ transformOrigin: "11px 11px" }}
            variants={glassVariants}
          >
            <circle cx="11" cy="11" r="3" />
            <path d="m16 16-2.5-2.5" />
          </motion.g>
        </motion.svg>
      </div>
    )
  }
)
ScanSearchIcon.displayName = "ScanSearchIcon"
export { ScanSearchIcon }
