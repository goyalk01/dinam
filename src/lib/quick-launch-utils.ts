export function normalizeQuickLaunchHref(raw: string): string {
  let href = raw.trim()
  if (!href) return "#"
  if (
    !href.startsWith("http://") &&
    !href.startsWith("https://") &&
    href !== "#"
  ) {
    href = `https://${href}`
  }
  return href
}

export function fallbackNameFromQuickLaunchHref(href: string): string {
  if (href === "#") return "Link"
  try {
    const u = new URL(href)
    return u.hostname.replace(/^www\./, "") || "Link"
  } catch {
    return "Link"
  }
}
