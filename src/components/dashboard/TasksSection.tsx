import { Check, Pencil, Plus, Trash2, Calendar, Percent } from "lucide-react"
import { useCallback, useRef, useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useDashboardState } from "@/context/dashboard-state"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TasksSection() {
    const { todos = [], toggleTodo, deleteTodo, addTodo, updateTodo } =
        useDashboardState()
    
    const [newTaskLabel, setNewTaskLabel] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [progress, setProgress] = useState(0)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editLabel, setEditLabel] = useState("")
    const [editStartDate, setEditStartDate] = useState("")
    const [editDueDate, setEditDueDate] = useState("")

    const addTask = () => {
        const label = newTaskLabel.trim()
        if (!label) return
        
        addTodo(label, startDate, dueDate, progress)
        
        setNewTaskLabel("")
        setStartDate("")
        setDueDate("")
        setProgress(0)
    }

    const startEditTodo = (id: string, label: string, start: string, due: string) => {
        setEditingId(id)
        setEditLabel(label)
        setEditStartDate(start || "")
        setEditDueDate(due || "")
    }

    const commitEditTodo = useCallback(() => {
        const id = editingId
        if (!id) return
        const label = editLabel.trim()
        if (!label) {
            setEditingId(null)
            return
        }
        
        const currentTodo = todos?.find(t => t.id === id)
        updateTodo(id, { 
            label,
            startDate: editStartDate,
            dueDate: editDueDate,
            progress: currentTodo?.progress
        })
        setEditingId(null)
    }, [editLabel, editStartDate, editDueDate, editingId, todos, updateTodo])

    const isOverdue = (dateStr?: string, isDone?: boolean) => {
        if (!dateStr || isDone) return false
        const today = new Date().toISOString().split('T')[0]
        return dateStr < today
    }

    const handleIncrement = (id: string, currentVal: number) => {
        const nextVal = Math.min(currentVal + 10, 100)
        const currentTodo = todos.find(t => t.id === id)
        if (currentTodo) {
            updateTodo(id, { ...currentTodo, progress: nextVal })
        }
    }

    const handleDecrement = (id: string, currentVal: number) => {
        const nextVal = Math.max(currentVal - 10, 0)
        const currentTodo = todos.find(t => t.id === id)
        if (currentTodo) {
            updateTodo(id, { ...currentTodo, progress: nextVal })
        }
    }

    return (
        <article className="flex min-h-0 flex-col rounded-[1.75rem] bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
            <div className="mb-6 flex shrink-0 items-center justify-between gap-3">
                <h2 className={dashboardSectionLabelClassName}>Focus items</h2>
            </div>

            {/* Header Grid */}
            {todos && todos.length > 0 && (
                <div className="mb-3 grid grid-cols-12 gap-2 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/30 pb-2 items-center">
                    <div className="col-span-5">Task Name</div>
                    <div className="col-span-4 text-center">Timeline</div>
                    <div className="col-span-3 text-center">Progress Adjust</div>
                </div>
            )}

            <div
                className={cn(
                    "min-h-0 flex-1",
                    todos && todos.length > 3 && "max-h-64 overflow-y-auto pr-1",
                )}
            >
                {!todos || todos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No focus items yet. Add a task below to get started.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {todos.map((todo) => {
                            if (!todo) return null
                            const overdue = isOverdue(todo.dueDate, todo.done)
                            const currentVal = todo.done ? 100 : (todo.progress || 0)
                            const isEditing = editingId === todo.id

                            return (
                                <li key={todo.id} className="rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 p-3.5 transition-colors group/task flex flex-col gap-2.5">
                                    
                                    {/* MAIN LAYOUT GRID ROW */}
                                    <div className="grid grid-cols-12 gap-2 items-center w-full">
                                        
                                        {/* 1. Task Name Column (col-span-5) */}
                                        <div className="col-span-5 flex items-center gap-2 min-w-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleTodo(todo.id)}
                                                disabled={isEditing}
                                                className={cn(
                                                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                                    todo.done
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-primary/35 bg-transparent",
                                                    isEditing && "opacity-40 pointer-events-none"
                                                )}
                                            >
                                                {todo.done ? <Check className="size-3" strokeWidth={3} /> : null}
                                            </button>

                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editLabel}
                                                    onChange={(e) => setEditLabel(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") commitEditTodo()
                                                    }}
                                                    className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/25"
                                                    placeholder="Task title..."
                                                    autoFocus
                                                />
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTodo(todo.id)}
                                                    className={cn(
                                                        "min-w-0 flex-1 truncate text-left text-sm leading-snug",
                                                        todo.done ? "text-muted-foreground line-through" : "font-medium text-card-foreground",
                                                        overdue && "text-destructive font-bold"
                                                    )}
                                                >
                                                    {todo.label}
                                                </button>
                                            )}
                                        </div>

                                        {/* 2. Display Timeline Column (col-span-4) */}
                                        <div className={cn(
                                            "col-span-4 text-center text-xs font-mono select-none truncate px-1",
                                            overdue ? "text-destructive font-bold animate-pulse" : "text-muted-foreground/90"
                                        )}>
                                            {isEditing ? (
                                                <span className="text-[11px] text-muted-foreground italic font-sans">
                                                    Editing timeline below...
                                                </span>
                                            ) : todo.startDate || todo.dueDate ? (
                                                <span className="inline-flex items-center gap-1 flex-wrap justify-center">
                                                    <span>{todo.startDate || "—"}</span>
                                                    <span className="text-muted-foreground/50">→</span>
                                                    <span>{todo.dueDate || "—"}</span>
                                                </span>
                                            ) : (
                                                "—"
                                            )}
                                        </div>

                                        {/* 3. Centered Progress Adjust Block (col-span-3) */}
                                        <div className="col-span-3 flex items-center justify-center min-w-0">
                                            <div className={cn(
                                                "inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5 shadow-sm transition-opacity",
                                                isEditing && "opacity-40 pointer-events-none"
                                            )}>
                                                <button
                                                    type="button"
                                                    disabled={todo.done || currentVal === 0}
                                                    onClick={() => handleDecrement(todo.id, currentVal)}
                                                    className="flex size-6 items-center justify-center rounded-md font-sans text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center font-mono text-xs font-bold text-foreground select-none">
                                                    {currentVal}%
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={todo.done || currentVal === 100}
                                                    onClick={() => handleIncrement(todo.id, currentVal)}
                                                    className="flex size-6 items-center justify-center rounded-md font-sans text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* 4. SEPARATE ACCESSIBLE DATE EDIT ROW (Only renders when active) */}
                                    {isEditing && (
                                        <div className="mt-1 flex flex-wrap items-center gap-4 bg-background/50 border border-border/40 p-2.5 rounded-xl transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="size-3.5 text-primary/70" />
                                                <span className="font-medium">Start:</span>
                                                <input 
                                                    type="date" 
                                                    value={editStartDate}
                                                    onChange={(e) => setEditStartDate(e.target.value)}
                                                    className="bg-card border border-border/60 rounded-lg px-2 py-1 outline-none text-foreground text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary/25"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="size-3.5 text-destructive/70" />
                                                <span className="font-medium">Finish:</span>
                                                <input 
                                                    type="date" 
                                                    value={editDueDate}
                                                    onChange={(e) => setEditDueDate(e.target.value)}
                                                    className="bg-card border border-border/60 rounded-lg px-2 py-1 outline-none text-foreground text-xs font-mono focus-border-primary focus:ring-1 focus:ring-primary/25"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* BOTTOM ACTIONS CONTROL PANEL */}
                                    <div className="flex items-center justify-end gap-3 border-t border-border/20 pt-2 mt-0.5">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="rounded-lg px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm active:scale-98"
                                                    onClick={commitEditTodo}
                                                >
                                                    <Check className="size-3.5" strokeWidth={3} />
                                                    <span>Save Changes</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-card-foreground transition-colors"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground/80 hover:bg-muted hover:text-card-foreground transition-colors flex items-center gap-1.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        startEditTodo(todo.id, todo.label, todo.startDate || "", todo.dueDate || "")
                                                    }}
                                                >
                                                    <Pencil className="size-3" />
                                                    <span>Edit Task</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-1.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteTodo(todo.id)
                                                    }}
                                                >
                                                    <Trash2 className="size-3" />
                                                    <span>Delete</span>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* Input Footer for Creating Tasks */}
            <div className="mt-4 shrink-0 border-t border-border/50 pt-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={newTaskLabel}
                        onChange={(e) => setNewTaskLabel(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTask()
                        }}
                        placeholder="New task title…"
                        className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring/25"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-muted/40 p-2.5 rounded-xl border border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 text-primary/70" />
                        <span>Start:</span>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-card border border-border/60 rounded px-1.5 py-0.5 outline-none text-foreground text-xs focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 text-destructive/70" />
                        <span>Finish:</span>
                        <input 
                            type="date" 
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-card border border-border/60 rounded px-1.5 py-0.5 outline-none text-foreground text-xs focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-1 min-w-[10rem] justify-end">
                        <Percent className="size-3.5 text-primary/70" />
                        <span>Progress:</span>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={progress}
                            onChange={(e) => setProgress(parseInt(e.target.value))}
                            className="w-16 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="font-mono text-[11px] min-w-[1.5rem] text-right">{progress}%</span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-primary hover:text-primary h-8 px-2.5 text-xs"
                        onClick={addTask}
                    >
                        <Plus className="size-4" strokeWidth={2.5} />
                        Add task
                    </Button>
                </div>
            </div>
        </article>
    )
}