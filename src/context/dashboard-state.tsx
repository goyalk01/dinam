/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  MOCK_BOOKMARKS,
  MOCK_QUICK_LAUNCH,
  QUICK_LAUNCH_ICON_POOL,
  type BookmarkItem,
  type QuickLaunchIconKey,
  type QuickLaunchItem,
} from "@/data/dashboard-mock"
import {
  fallbackNameFromQuickLaunchHref,
  normalizeQuickLaunchHref,
} from "@/lib/quick-launch-utils"

export type DashboardTodo = {
  id: string
  label: string
  done: boolean
}

const TODOS_KEY = "dinam-dashboard-todos"
const BOOKMARKS_KEY = "dinam-dashboard-bookmarks"
const QUICK_LAUNCH_KEY = "dinam-dashboard-quick-launch"

function newTodoId() {
  return `t-${crypto.randomUUID()}`
}

function newBookmarkId() {
  return `b-${crypto.randomUUID()}`
}

function loadTodos(): DashboardTodo[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is DashboardTodo =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as DashboardTodo).id === "string" &&
        typeof (x as DashboardTodo).label === "string" &&
        typeof (x as DashboardTodo).done === "boolean"
    )
  } catch {
    return []
  }
}

function loadBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    if (!raw) return [...MOCK_BOOKMARKS]
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...MOCK_BOOKMARKS]
    const next = parsed.filter(
      (x): x is BookmarkItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as BookmarkItem).id === "string" &&
        typeof (x as BookmarkItem).title === "string" &&
        typeof (x as BookmarkItem).href === "string"
    )
    return next.length > 0 ? next : [...MOCK_BOOKMARKS]
  } catch {
    return [...MOCK_BOOKMARKS]
  }
}

function loadQuickLaunch(): QuickLaunchItem[] {
  try {
    const raw = localStorage.getItem(QUICK_LAUNCH_KEY)
    if (!raw) return [...MOCK_QUICK_LAUNCH]
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...MOCK_QUICK_LAUNCH]
    const next = parsed.filter(
      (x): x is QuickLaunchItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as QuickLaunchItem).id === "string" &&
        typeof (x as QuickLaunchItem).name === "string" &&
        typeof (x as QuickLaunchItem).href === "string" &&
        typeof (x as QuickLaunchItem).icon === "string"
    )
    return next.length > 0 ? next : [...MOCK_QUICK_LAUNCH]
  } catch {
    return [...MOCK_QUICK_LAUNCH]
  }
}

export type DashboardStateContextValue = {
  todos: DashboardTodo[]
  bookmarks: BookmarkItem[]
  quickLaunchItems: QuickLaunchItem[]
  addTodo: (label: string) => string
  toggleTodo: (id: string) => void
  updateTodo: (id: string, patch: { label?: string; done?: boolean }) => void
  deleteTodo: (id: string) => void
  clearCompletedTodos: () => void
  addBookmark: (title: string, href: string) => string
  deleteBookmark: (id: string) => void
  setQuickLaunchItems: (items: QuickLaunchItem[]) => void
  addQuickLaunchItem: (
    name: string,
    href: string,
    icon?: QuickLaunchIconKey
  ) => string
  removeQuickLaunchItem: (id: string) => void
  updateQuickLaunchItem: (
    id: string,
    patch: Partial<Pick<QuickLaunchItem, "name" | "href" | "icon">>
  ) => void
}

const DashboardStateContext = createContext<DashboardStateContextValue | null>(
  null
)

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  const [todos, setTodosState] = useState<DashboardTodo[]>(loadTodos)
  const [bookmarks, setBookmarksState] = useState<BookmarkItem[]>(loadBookmarks)
  const [quickLaunchItems, setQuickLaunchState] =
    useState<QuickLaunchItem[]>(loadQuickLaunch)

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return ""

    const id = newTodoId()

    setTodosState((prev) => [...prev, { id, label: trimmed, done: false }])

    return id
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodosState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }, [])

  const updateTodo = useCallback(
    (id: string, patch: { label?: string; done?: boolean }) => {
      setTodosState((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t

          return {
            ...t,
            ...(patch.label !== undefined
              ? { label: patch.label.trim() || t.label }
              : {}),
            ...(patch.done !== undefined ? { done: patch.done } : {}),
          }
        })
      )
    },
    []
  )

  const deleteTodo = useCallback((id: string) => {
    setTodosState((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompletedTodos = useCallback(() => {
    setTodosState((prev) => prev.filter((t) => !t.done))
  }, [])

  const addBookmark = useCallback((title: string, href: string) => {
    const t = title.trim()
    const h = href.trim()

    if (!t || !h) return ""

    const id = newBookmarkId()

    setBookmarksState((prev) => {
      const next = [...prev, { id, title: t, href: h }]
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next))
      return next
    })

    return id
  }, [])

  const deleteBookmark = useCallback((id: string) => {
    setBookmarksState((prev) => {
      const next = prev.filter((b) => b.id !== id)
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setQuickLaunchItems = useCallback((items: QuickLaunchItem[]) => {
    localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(items))
    setQuickLaunchState(items)
  }, [])

  const addQuickLaunchItem = useCallback(
    (name: string, href: string, icon?: QuickLaunchIconKey) => {
      const hrefNorm = normalizeQuickLaunchHref(href)
      const nameTrim = name.trim()

      const resolvedName = nameTrim || fallbackNameFromQuickLaunchHref(hrefNorm)

      if (!resolvedName && hrefNorm === "#") return ""

      const id = `q-${crypto.randomUUID()}`

      setQuickLaunchState((prev) => {
        const nextIcon: QuickLaunchIconKey =
          icon ??
          QUICK_LAUNCH_ICON_POOL[prev.length % QUICK_LAUNCH_ICON_POOL.length]!

        const next = [
          ...prev,
          {
            id,
            name: resolvedName,
            href: hrefNorm,
            icon: nextIcon,
          },
        ]

        localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(next))

        return next
      })

      return id
    },
    []
  )

  const removeQuickLaunchItem = useCallback((id: string) => {
    setQuickLaunchState((prev) => {
      const next = prev.filter((q) => q.id !== id)

      localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(next))

      return next
    })
  }, [])

  const updateQuickLaunchItem = useCallback(
    (
      id: string,
      patch: Partial<Pick<QuickLaunchItem, "name" | "href" | "icon">>
    ) => {
      setQuickLaunchState((prev) => {
        const next = prev.map((q) => {
          if (q.id !== id) return q

          let href = q.href

          if (patch.href !== undefined) {
            href = normalizeQuickLaunchHref(patch.href)
          }

          let name = q.name

          if (patch.name !== undefined) {
            name = patch.name.trim() || fallbackNameFromQuickLaunchHref(href)
          }

          return {
            ...q,
            name,
            href,
            ...(patch.icon !== undefined ? { icon: patch.icon } : {}),
          }
        })

        localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(next))

        return next
      })
    },
    []
  )

  const value = useMemo<DashboardStateContextValue>(
    () => ({
      todos,
      bookmarks,
      quickLaunchItems,
      addTodo,
      toggleTodo,
      updateTodo,
      deleteTodo,
      clearCompletedTodos,
      addBookmark,
      deleteBookmark,
      setQuickLaunchItems,
      addQuickLaunchItem,
      removeQuickLaunchItem,
      updateQuickLaunchItem,
    }),
    [
      todos,
      bookmarks,
      quickLaunchItems,
      addTodo,
      toggleTodo,
      updateTodo,
      deleteTodo,
      clearCompletedTodos,
      addBookmark,
      deleteBookmark,
      setQuickLaunchItems,
      addQuickLaunchItem,
      removeQuickLaunchItem,
      updateQuickLaunchItem,
    ]
  )

  return (
    <DashboardStateContext.Provider value={value}>
      {children}
    </DashboardStateContext.Provider>
  )
}

export function useDashboardState(): DashboardStateContextValue {
  const ctx = useContext(DashboardStateContext)

  if (!ctx) {
    throw new Error(
      "useDashboardState must be used within DashboardStateProvider"
    )
  }

  return ctx
}
