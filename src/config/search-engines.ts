export const SEARCH_ENGINES = [
  {
    id: "google",
    label: "Google",
    template: "https://www.google.com/search?q=%s",
  },
  {
    id: "bing",
    label: "Bing",
    template: "https://www.bing.com/search?q=%s",
  },
  {
    id: "duckduckgo",
    label: "DuckDuckGo",
    template: "https://duckduckgo.com/?q=%s",
  },
  {
    id: "brave",
    label: "Brave",
    template: "https://search.brave.com/search?q=%s",
  },
] as const

export type SearchEngineId = (typeof SEARCH_ENGINES)[number]["id"]

export type SearchEngine = (typeof SEARCH_ENGINES)[number]

export function getSearchEngineById(
  id: SearchEngineId
): SearchEngine | undefined {
  return SEARCH_ENGINES.find((engine) => engine.id === id)
}

export function getSearchEngineIdFromTemplate(
  template: string
): SearchEngineId | null {
  const trimmed = template.trim()
  return (
    SEARCH_ENGINES.find((engine) => engine.template === trimmed)?.id ?? null
  )
}
