import { useEffect, useMemo, useState } from "react"

import { getCreativeGreeting } from "@/utils/greetings"

/**
 * Self-contained greeting hero that re-renders only when the hour changes.
 *
 * Maintains its own 60-second polling interval (just to detect hour
 * boundaries), so the parent tree never re-renders for greeting updates.
 */
export function LiveGreeting() {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours())

  useEffect(() => {
    // Check once per minute whether the hour has changed.
    // This is far cheaper than every second, and a ≤59 s delay on
    // a greeting change is imperceptible.
    const id = window.setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps -- currentHour is an intentional cache-buster
  const greeting = useMemo(() => getCreativeGreeting(), [currentHour])

  return (
    <div className="flex min-h-[7rem] w-full max-w-4xl items-center justify-center">
      <p className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-5xl leading-none font-bold tracking-tight text-foreground select-none sm:text-6xl md:text-7xl lg:text-8xl">
        <span className="inline-block max-w-3xl leading-tight text-balance">
          {greeting.text}
        </span>
        <span className="manual-emoji-reset inline-block shrink-0 animate-pulse align-middle text-5xl leading-none sm:text-6xl md:text-7xl lg:text-8xl">
          {greeting.emoji}
        </span>
      </p>
    </div>
  )
}
