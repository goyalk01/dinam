"use client";

import { motion, useAnimation } from 'motion/react';
import { useCallback, type HTMLAttributes } from 'react';
import { cn } from "@/lib/utils";

interface SunIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function SunIcon({ className, size = 24, onMouseEnter, onMouseLeave, ...props }: SunIconProps) {
  const controls = useAnimation();

  const sunVariants = {
    rest: { rotate: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    hover: {
      rotate: [0, 180, 360],
      scale: [1, 1.15, 1],
      transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    controls.start("hover");
    onMouseEnter?.(e);
  }, [controls, onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    controls.start("rest");
    onMouseLeave?.(e);
  }, [controls, onMouseLeave]);

  return (
    <div
      className={cn("inline-flex items-center justify-center w-full h-full", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.svg
        animate={controls}
        initial="rest"
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.g variants={sunVariants} style={{ transformOrigin: "12px 12px" }}>
          <circle cx='12' cy='12' r='4' />
          <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
        </motion.g>
      </motion.svg>
    </div>
  );
}