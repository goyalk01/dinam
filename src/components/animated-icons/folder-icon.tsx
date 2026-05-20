"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { cn } from "@/lib/utils"

export interface FolderIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface FolderIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

const flapVariants: Variants = {
  normal: {
    d: "M20 20H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.93a2 2 0 0 0 1.66-.9l.82-1.2a2 2 0 0 1 1.66-.9H20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2Z",
  },
  animate: {
    d: "M20 20H4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h3.93a2 2 0 0 0 1.66-.9l.82-1.2a2 2 0 0 1 1.66-.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z",
    transition: { duration: 0.25, ease: "easeOut" },
  },
}

const FolderIcon = forwardRef<FolderIconHandle, FolderIconProps>(
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

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={(e) =>
          isControlledRef.current
            ? onMouseEnter?.(e)
            : controls.start("animate")
        }
        onMouseLeave={(e) =>
          isControlledRef.current ? onMouseLeave?.(e) : controls.start("normal")
        }
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
          <path
            d="M2 10V6a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v1"
            opacity="0.6"
          />
          <motion.path variants={flapVariants} />
        </motion.svg>
      </div>
    )
  }
)
FolderIcon.displayName = "FolderIcon"
export { FolderIcon }
