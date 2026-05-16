import { Globe, Loader2, Plus, Trash2, X } from "lucide-react"
import { useCallback, useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDashboardState } from "@/context/dashboard-state"
import type { QuickLinkItem } from "@/data/dashboard-mock"
import { fetchQuickLinkMetadata, normalizeUrl } from "@/lib/quick-link-metadata"
import { cn } from "@/lib/utils"

type FetchStatus = "idle" | "loading" | "error"

export function QuickLinksSection() {
  const { quickLinks, addQuickLink, removeQuickLink } = useDashboardState()

  const [urlInput, setUrlInput] = useState("")
  const [status, setStatus] = useState<FetchStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const clearError = () => {
    setStatus("idle")
    setErrorMessage("")
  }

  const handleAdd = useCallback(async () => {
    const raw = urlInput.trim()
    if (!raw) return

    const normalized = normalizeUrl(raw)

    // Check for duplicates before fetching
    const alreadyExists = quickLinks.some(
      (link) => link.url.toLowerCase() === normalized.toLowerCase()
    )
    if (alreadyExists) {
      setStatus("error")
      setErrorMessage("This link has already been added")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      const metadata = await fetchQuickLinkMetadata(raw)

      const newLink: QuickLinkItem = {
        id: `ql-${crypto.randomUUID()}`,
        url: normalized,
        title: metadata.title || normalized,
        description: metadata.description,
        favicon: metadata.favicon,
      }

      addQuickLink(newLink)
      setUrlInput("")
      setStatus("idle")
    } catch (err) {
      setStatus("error")
      setErrorMessage(
        err instanceof Error ? err.message : "Could not fetch metadata"
      )
    }
  }, [urlInput, quickLinks, addQuickLink])

  return (
    <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
      <h2 className={dashboardSectionLabelClassName}>Quick Links</h2>

      {/* URL input */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value)
            if (status === "error") clearError()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd()
          }}
          placeholder="https://example.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-50"
          aria-label="Add a quick link URL"
        />
        <Button
          type="button"
          variant="ghost"
          className="gap-2 text-primary hover:text-primary"
          onClick={handleAdd}
          disabled={status === "loading" || !urlInput.trim()}
        >
          {status === "loading" ? (
            <Loader2 className="size-5 animate-spin" strokeWidth={2.5} />
          ) : (
            <Plus className="size-5" strokeWidth={2.5} />
          )}
          {status === "loading" ? "Fetching…" : "Add link"}
        </Button>
      </div>

      {/* Error / duplicate message */}
      {status === "error" && errorMessage ? (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span className="min-w-0 flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={clearError}
            className="shrink-0 rounded p-0.5 transition-colors hover:bg-destructive/20"
            aria-label="Dismiss error"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      ) : null}

      {/* Links list */}
      {quickLinks.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          No quick links yet. Add a URL above to get started.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-1">
          {quickLinks.map((link) => (
            <li key={link.id}>
              <div className="group/link flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/80">
                {/* Favicon */}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                  {link.favicon ? (
                    <img
                      src={link.favicon}
                      alt=""
                      className="size-5 rounded-sm object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        const fallback = e.currentTarget.nextElementSibling
                        if (fallback instanceof HTMLElement) {
                          fallback.style.display = "block"
                        }
                      }}
                    />
                  ) : null}
                  <Globe
                    className={cn(
                      "size-4 text-muted-foreground",
                      link.favicon ? "hidden" : "block"
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>

                {/* Title + description */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex min-w-0 flex-1 flex-col gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      <span className="truncate text-sm font-medium text-card-foreground">
                        {link.title}
                      </span>
                      {link.description ? (
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          {link.description}
                        </span>
                      ) : null}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={6}>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{link.title}</span>
                      <span className="max-w-[16rem] truncate text-[0.65rem] opacity-80">
                        {link.url}
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>

                {/* Delete button */}
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover/link:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100"
                  onClick={() => removeQuickLink(link.id)}
                  aria-label={`Remove ${link.title}`}
                >
                  <Trash2 className="size-4" strokeWidth={2} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
