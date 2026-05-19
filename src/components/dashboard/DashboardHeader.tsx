import {
    MessageSquare,
    Mic,
    Moon,
    ScanSearch,
    Search,
    Settings,
    Sun,
} from "lucide-react"
import {
    type ChangeEvent,
    type FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react"

import { DashboardSettingsModal } from "@/components/dashboard/DashboardSettingsModal"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MOCK_WEATHER } from "@/data/dashboard-mock"
import {
    openGoogleSearchByImage,
    resolveNavigationHref,
} from "@/lib/search-engine"
import { getCreativeGreeting } from "@/utils/greetings"

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

function subscribePreferredColorScheme(onStoreChange: () => void) {
    const mq = window.matchMedia(COLOR_SCHEME_QUERY)
    mq.addEventListener("change", onStoreChange)
    return () => mq.removeEventListener("change", onStoreChange)
}

function getPreferredColorSchemeSnapshot(): "dark" | "light" {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function getPreferredColorSchemeServerSnapshot(): "dark" | "light" {
    return "light"
}

function getSpeechRecognitionCtor():
    | (new () => SpeechRecognition)
    | undefined {
    if (typeof window === "undefined") {
        return undefined
    }
    return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

type DashboardHeaderProps = {
    onOpenAssistant?: () => void
}

export function DashboardHeader({ onOpenAssistant }: DashboardHeaderProps) {
    const { theme, setTheme, searchUrlTemplate } = useTheme()
    const [now, setNow] = useState(() => new Date())
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [voiceListening, setVoiceListening] = useState(false)
    const imageSearchInputRef = useRef<HTMLInputElement>(null)
    const speechRecognitionRef = useRef<SpeechRecognition | null>(null)
    const lastVoiceTranscriptRef = useRef("")
    const voiceUserStoppedRef = useRef(false)
    const voiceSessionFailedRef = useRef(false)
    const systemPref = useSyncExternalStore(
        subscribePreferredColorScheme,
        getPreferredColorSchemeSnapshot,
        getPreferredColorSchemeServerSnapshot,
    )
    const resolvedTheme: "dark" | "light" =
        theme === "system" ? systemPref : theme

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000)
        return () => window.clearInterval(id)
    }, [])

    useEffect(() => {
        return () => {
            speechRecognitionRef.current?.abort()
            speechRecognitionRef.current = null
        }
    }, [])

    const runSearchNavigation = useCallback(() => {
        const href = resolveNavigationHref(searchQuery, searchUrlTemplate)
        if (href !== null) {
            window.location.assign(href)
        }
    }, [searchUrlTemplate, searchQuery])

    const handleSearchSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            runSearchNavigation()
        },
        [runSearchNavigation],
    )

    const handleImageSearchPick = useCallback(() => {
        imageSearchInputRef.current?.click()
    }, [])

    const handleImageSearchFile = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (!file?.type.startsWith("image/")) {
                return
            }
            openGoogleSearchByImage(file)
        },
        [],
    )

    const toggleVoiceSearch = useCallback(() => {
        const Ctor = getSpeechRecognitionCtor()
        if (Ctor === undefined) {
            return
        }

        if (speechRecognitionRef.current !== null) {
            voiceUserStoppedRef.current = true
            speechRecognitionRef.current.stop()
            return
        }

        lastVoiceTranscriptRef.current = ""
        voiceUserStoppedRef.current = false
        voiceSessionFailedRef.current = false
        const recognition = new Ctor()
        recognition.lang = navigator.language || "en-US"
        recognition.interimResults = true
        recognition.continuous = false

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let text = ""
            for (let i = 0; i < event.results.length; i += 1) {
                text += event.results[i][0].transcript
            }
            const trimmed = text.trim()
            lastVoiceTranscriptRef.current = trimmed
            setSearchQuery(trimmed)
        }

        recognition.onerror = () => {
            voiceSessionFailedRef.current = true
            setVoiceListening(false)
            speechRecognitionRef.current = null
            voiceUserStoppedRef.current = false
        }

        recognition.onend = () => {
            setVoiceListening(false)
            speechRecognitionRef.current = null
            const userStopped = voiceUserStoppedRef.current
            const failed = voiceSessionFailedRef.current
            voiceUserStoppedRef.current = false
            voiceSessionFailedRef.current = false
            if (userStopped || failed) {
                return
            }
            const transcript = lastVoiceTranscriptRef.current
            if (transcript.length > 0) {
                const href = resolveNavigationHref(
                    transcript,
                    searchUrlTemplate,
                )
                if (href !== null) {
                    window.location.assign(href)
                }
            }
        }

        speechRecognitionRef.current = recognition
        setVoiceListening(true)
        recognition.start()
    }, [searchUrlTemplate])

    const speechSupported = useMemo(
        () => getSpeechRecognitionCtor() !== undefined,
        [],
    )

    // Robust native JS string formatting replacements 
    const timeWithPeriod = now.toLocaleTimeString(navigator.language || "en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })

    const shortDateLine = now.toLocaleDateString(navigator.language || "en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    }).toUpperCase()
    
    // FIX: Memoize the greeting string using currentHour dependencies to completely block re-rendering calculations on matching intervals
    const currentHour = now.getHours()
    const greeting = useMemo(() => getCreativeGreeting(), [currentHour])

    return (
        <header className="w-full">
            <div className="flex items-start justify-between gap-4 px-1">
                <p
                    className="flex max-w-[min(100%,36rem)] flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem] font-medium tracking-wide text-primary/70"
                    role="status"
                    aria-label={`${timeWithPeriod}, ${shortDateLine}, ${MOCK_WEATHER.city}, ${MOCK_WEATHER.summary}`}
                >
                    <span className="text-foreground/90">{timeWithPeriod}</span>
                    <span className="text-primary/55">•</span>
                    <span>{shortDateLine}</span>
                    <span className="text-primary/55">•</span>
                    <span className="inline-flex items-center gap-1 text-foreground/85">
                        <Sun
                            className="size-3.5 shrink-0 text-chart-1"
                            strokeWidth={2}
                        />
                        {MOCK_WEATHER.city}
                        <span className="text-primary/55">·</span>
                        <span className="text-muted-foreground">
                            {MOCK_WEATHER.summary}
                        </span>
                    </span>
                </p>
                <div className="flex shrink-0 items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-muted-foreground"
                                aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            >
                                {resolvedTheme === "dark" ? (
                                    <Sun className="size-5" strokeWidth={2} />
                                ) : (
                                    <Moon className="size-5" strokeWidth={2} />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6}>
                            {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                        </TooltipContent>
                    </Tooltip>
                    {onOpenAssistant ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-muted-foreground"
                                    onClick={onOpenAssistant}
                                >
                                    <MessageSquare className="size-5" strokeWidth={2} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" sideOffset={6}>
                                Chat assistant
                            </TooltipContent>
                        </Tooltip>
                    ) : null}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-muted-foreground"
                                onClick={() => setSettingsOpen(true)}
                            >
                                <Settings className="size-5" strokeWidth={2} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6}>
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <DashboardSettingsModal
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
            />

            <div className="mt-10 flex flex-col items-center text-center sm:mt-14">
                <p className="flex items-center justify-center gap-3 text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl">
                    {greeting.text} <span className="animate-pulse">{greeting.emoji}</span>
                </p>

                <form className="relative mt-8 w-full max-w-xl sm:mt-10" onSubmit={handleSearchSubmit}>
                    <input
                        ref={imageSearchInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageSearchFile}
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-5 z-1 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                    <Input
                        id="dashboard-search"
                        name="q"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search the web or type a URL"
                        autoComplete="off"
                        className="h-auto rounded-full border-border/80 bg-card py-3.5 pr-21 pl-14 text-center shadow-sm placeholder:text-muted-foreground focus-visible:ring-ring/25 sm:text-left"
                    />
                </form>
            </div>
        </header>
    )
}