"use client"

import * as React from "react"
import { Ellipsis, Pencil, Plus, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Skeleton,
  cn,
} from "@talimy/ui"

import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import {
  PlayfulTodolist,
  type PlayfulTodoItem,
} from "@/components/animate-ui/components/community/playful-todolist"
import type { AppLocale } from "@/config/site"
import { formatMonthDayYear } from "@/lib/dashboard/dashboard-formatters"

type DashboardTodo = {
  done: boolean
  dueDate: string
  id: string
  title: string
}

function mapTodoItem(locale: string, todo: DashboardTodo): PlayfulTodoItem {
  return {
    checked: todo.done,
    dateLabel: formatMonthDayYear(locale, todo.dueDate),
    id: todo.id,
    title: todo.title,
  }
}

export function AdminDashboardTodoListSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard.todo")
  const hasInitializedTodos = React.useRef(false)
  const [todos, setTodos] = React.useState<DashboardTodo[]>([])
  const [isAdding, setIsAdding] = React.useState(false)
  const [draftTitle, setDraftTitle] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingTitle, setEditingTitle] = React.useState("")

  const todosQuery = useQuery({
    queryKey: adminDashboardQueryKeys.todos(locale),
    queryFn: async () => [
      {
        id: "todo-1",
        title: t("items.reviewTeacherAttendanceRecords"),
        dueDate: "2035-03-11",
        done: true,
      },
      {
        id: "todo-2",
        title: t("items.prepareScienceFairGuidelines"),
        dueDate: "2035-03-13",
        done: false,
      },
      {
        id: "todo-3",
        title: t("items.updateLibraryBookInventory"),
        dueDate: "2035-03-14",
        done: false,
      },
    ],
    refetchInterval: 60_000,
  })

  React.useEffect(() => {
    if (!todosQuery.data || hasInitializedTodos.current) {
      return
    }

    setTodos(todosQuery.data)
    hasInitializedTodos.current = true
  }, [todosQuery.data])

  const items = React.useMemo(() => todos.map((todo) => mapTodoItem(locale, todo)), [locale, todos])

  const startAddMode = React.useCallback(() => {
    setEditingId(null)
    setEditingTitle("")
    setIsAdding(true)
  }, [])

  const handleToggle = React.useCallback((id: string, checked: boolean) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, done: checked } : todo))
    )
  }, [])

  const handleDelete = React.useCallback(
    (id: string) => {
      setTodos((current) => current.filter((todo) => todo.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setEditingTitle("")
      }
    },
    [editingId]
  )

  const handleStartEdit = React.useCallback((item: PlayfulTodoItem) => {
    setIsAdding(false)
    setDraftTitle("")
    setEditingId(item.id)
    setEditingTitle(item.title)
  }, [])

  const handleCancelEdit = React.useCallback(() => {
    setEditingId(null)
    setEditingTitle("")
  }, [])

  const handleSaveEdit = React.useCallback(() => {
    const normalizedTitle = editingTitle.trim()

    if (!editingId || normalizedTitle.length === 0) {
      return
    }

    setTodos((current) =>
      current.map((todo) => (todo.id === editingId ? { ...todo, title: normalizedTitle } : todo))
    )
    setEditingId(null)
    setEditingTitle("")
  }, [editingId, editingTitle])

  const handleCreateTodo = React.useCallback(() => {
    const normalizedTitle = draftTitle.trim()

    if (normalizedTitle.length === 0) {
      return
    }

    setTodos((current) => [
      ...current,
      {
        id: `todo-${crypto.randomUUID()}`,
        title: normalizedTitle,
        dueDate: "2035-03-15",
        done: false,
      },
    ])
    setDraftTitle("")
    setIsAdding(false)
  }, [draftTitle])

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-4 xl:flex xl:h-full xl:min-h-[300px] xl:flex-col">
      <header className="mb-2 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-[1.05rem] leading-none font-semibold tracking-tight text-talimy-navy">
            {t("title")}
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={t("menuAriaLabel")}
              className="size-9 rounded-full text-slate-500 hover:text-talimy-navy"
              size="icon"
              variant="ghost"
            >
              <Ellipsis className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={startAddMode}>
              <Plus className="mr-2 size-4" />
              {t("menu.addTask")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setTodos((current) => current.map((todo) => ({ ...todo, done: true })))
              }
            >
              {t("menu.markAllDone")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setTodos((current) => current.filter((todo) => !todo.done))}
            >
              {t("menu.clearCompleted")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="space-y-3 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
        {isAdding ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
            initial={{ opacity: 0, y: -8 }}
          >
            <Input
              autoFocus
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder={t("addPlaceholder")}
              value={draftTitle}
            />
            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => setIsAdding(false)} size="sm" variant="ghost">
                {t("buttons.cancel")}
              </Button>
              <Button onClick={handleCreateTodo} size="sm">
                {t("buttons.save")}
              </Button>
            </div>
          </motion.div>
        ) : null}

        {editingId ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
            initial={{ opacity: 0, y: -8 }}
          >
            <Input
              autoFocus
              onChange={(event) => setEditingTitle(event.target.value)}
              value={editingTitle}
            />
            <div className="flex items-center justify-end gap-2">
              <Button onClick={handleCancelEdit} size="sm" variant="ghost">
                {t("buttons.cancel")}
              </Button>
              <Button onClick={handleSaveEdit} size="sm">
                {t("buttons.update")}
              </Button>
            </div>
          </motion.div>
        ) : null}

        {todosQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        ) : (
          <ScrollArea className="xl:min-h-0 xl:flex-1">
            <PlayfulTodolist
              className="pr-2"
              emptyState={t("emptyState")}
              items={items}
              onCheckedChange={handleToggle}
              renderActions={(item) => (
                <div className="flex items-center gap-1">
                  <Button
                    aria-label={t("actions.edit", { title: item.title })}
                    className={cn(
                      "size-7 rounded-full text-slate-500 hover:text-talimy-navy",
                      editingId === item.id && "text-talimy-navy"
                    )}
                    onClick={() => handleStartEdit(item)}
                    size="icon"
                    variant="ghost"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    aria-label={t("actions.delete", { title: item.title })}
                    className="size-7 rounded-full text-slate-500 hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}
            />
          </ScrollArea>
        )}
      </div>
    </section>
  )
}
