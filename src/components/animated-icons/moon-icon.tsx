"use client"

import { motion, useAnimation, type Variants } from "motion/react"
import { useCallback, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface MoonIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

export function MoonIcon({
  className,
  size = 24,
  onMouseEnter,
  onMouseLeave,
  ...props
}: MoonIconProps) {
  const controls = useAnimation()

  const moonVariants: Variants = {
    rest: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    hover: {
      rotate: [0, -20, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },
  }

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      controls.start("hover")
      onMouseEnter?.(e)
    },
    [controls, onMouseEnter]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      controls.start("rest")
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
        initial="rest"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.g
          variants={moonVariants}
          style={{ transformOrigin: "12px 12px" }}
        >
          <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
        </motion.g>
      </motion.svg>
    </div>
  )
}
