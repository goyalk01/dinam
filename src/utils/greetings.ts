export interface GreetingConfig {
  text: string
  emoji: string
}

export function getCreativeGreeting(): GreetingConfig {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    const morningPhrases = [
      "Let's conquer the day",
      "Rise and grind",
      "Ready to smash some goals?",
      "Fresh morning, fresh focus",
    ]
    return {
      text: morningPhrases[Math.floor(Math.random() * morningPhrases.length)]!,
      emoji: "🌅",
    }
  }

  if (hour >= 12 && hour < 17) {
    const afternoonPhrases = [
      "Keep up the momentum",
      "Making solid progress",
      "Mid-day check-in",
      "Stay focused, you've got this",
    ]
    return {
      text: afternoonPhrases[
        Math.floor(Math.random() * afternoonPhrases.length)
      ]!,
      emoji: "🌤️",
    }
  }

  if (hour >= 17 && hour < 22) {
    const eveningPhrases = [
      "Wrapping up strong",
      "Productive evening ahead",
      "Time to bring it home",
      "Reviewing the day's wins",
    ]
    return {
      text: eveningPhrases[Math.floor(Math.random() * eveningPhrases.length)]!,
      emoji: "🌆",
    }
  }

  const nightPhrases = [
    "Prepping for tomorrow",
    "Burning the midnight oil",
    "Quiet focus time",
    "Rest up soon",
  ]
  return {
    text: nightPhrases[Math.floor(Math.random() * nightPhrases.length)]!,
    emoji: "🌙",
  }
}
