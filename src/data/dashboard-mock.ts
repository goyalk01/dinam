export type CalendarEventMock = {
  id: string
  timeLabel: string
  title: string
}

export type QuickLaunchIconKey =
  | "mail"
  | "file"
  | "calendar"
  | "terminal"
  | "folder"
  | "music"
  | "camera"
  | "scan"
  | "sun"
  | "brightness"
  | "moon"
  | "dark"

export type QuickLaunchItem = {
  id: string
  name: string
  href: string
  icon: QuickLaunchIconKey
}

/** Icons assigned to new slots by order (cycles). */
export const QUICK_LAUNCH_ICON_POOL: readonly QuickLaunchIconKey[] = [
  "mail",
  "file",
  "calendar",
  "terminal",
  "folder",
  "music",
  "camera",
  "scan",
  "sun",
  "brightness",
  "moon",
  "dark",
] as const

export type BookmarkItem = {
  id: string
  title: string
  href: string
}

export const MOCK_QUOTE = {
  text: "The details are not the details. They make the design.",
  author: "Charles Eames",
} as const

export const MOCK_CALENDAR: CalendarEventMock[] = [
  { id: "c1", timeLabel: "10:00 AM", title: "Design sync — Dinam new tab" },
  { id: "c2", timeLabel: "2:30 PM", title: "Focus block — deep work" },
]

export const MOCK_QUICK_LAUNCH: QuickLaunchItem[] = [
  { id: "q1", name: "Mail", href: "https://mail.google.com", icon: "mail" },
  { id: "q2", name: "Documents", href: "https://notion.so", icon: "file" },
  {
    id: "q3",
    name: "Calendar",
    href: "https://calendar.google.com",
    icon: "calendar",
  },
  { id: "q4", name: "Terminal", href: "https://github.com", icon: "terminal" },
  { id: "q5", name: "Files", href: "#", icon: "folder" },
  { id: "q6", name: "Music", href: "#", icon: "music" },
  { id: "q7", name: "Camera", href: "#", icon: "camera" },
]

export const MOCK_BOOKMARKS: BookmarkItem[] = [
  {
    id: "b1",
    title: "Design reference",
    href: "https://www.are.na",
  },
  {
    id: "b2",
    title: "Typography",
    href: "https://fonts.google.com",
  },
  {
    id: "b3",
    title: "Color & contrast",
    href: "https://coolors.co",
  },
  {
    id: "b4",
    title: "Documentation",
    href: "https://developer.mozilla.org",
  },
]

export const MOCK_STREAK_DAYS = 5
