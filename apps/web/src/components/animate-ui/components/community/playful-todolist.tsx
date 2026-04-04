"use client"

import * as React from "react"
import { motion, type Transition } from "motion/react"

import { Label, cn } from "@talimy/ui"

import { Checkbox, CheckboxIndicator } from "@/components/animate-ui/primitives/radix/checkbox"

export type PlayfulTodoItem = {
  checked: boolean
  dateLabel: string
  id: string
  title: string
}

type PlayfulTodolistProps = {
  className?: string
  emptyState?: React.ReactNode
  items: PlayfulTodoItem[]
  onCheckedChange: (id: string, checked: boolean) => void
  renderActions?: (item: PlayfulTodoItem) => React.ReactNode
}

const STRIKE_PATH =
  "M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"

function getPathAnimate(isChecked: boolean) {
  return {
    opacity: isChecked ? 1 : 0,
    pathLength: isChecked ? 1 : 0,
  }
}

function getPathTransition(isChecked: boolean): Transition {
  return {
    opacity: {
      delay: isChecked ? 0 : 1,
      duration: 0.01,
    },
    pathLength: { duration: 1, ease: "easeInOut" },
  }
}

export function PlayfulTodolist({
  className,
  emptyState,
  items,
  onCheckedChange,
  renderActions,
}: PlayfulTodolistProps) {
  if (items.length === 0) {
    return <div className={cn("py-4 text-sm text-muted-foreground", className)}>{emptyState}</div>
  }

  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="space-y-3 py-2.5 first:pt-0 last:pb-0">
          <div className="group flex items-start gap-3">
            <Checkbox
              aria-label={`${item.title} task holatini almashtirish`}
              checked={item.checked}
              className={cn(
                "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors",
                item.checked
                  ? "border-[var(--talimy-color-navy)] bg-[var(--talimy-color-navy)] text-white"
                  : "border-slate-300 bg-white text-transparent hover:border-slate-400"
              )}
              id={`todo-${item.id}`}
              onCheckedChange={(value) => onCheckedChange(item.id, value === true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
            >
              <CheckboxIndicator className="size-3" />
            </Checkbox>

            <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] gap-x-2 gap-y-2">
              <div className="relative col-span-2 col-start-1 row-start-1 min-w-0 max-w-full overflow-hidden">
                <Label
                  className={cn(
                    "block w-full min-w-0 max-w-full overflow-hidden text-[0.875rem] leading-5 font-medium text-foreground",
                    item.checked && "text-slate-500"
                  )}
                  htmlFor={`todo-${item.id}`}
                >
                  <span className="block w-full truncate" title={item.title}>
                    {item.title}
                  </span>
                </Label>

                <motion.svg
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-0 z-10 h-10 w-full -translate-y-1/2"
                  fill="none"
                  height="32"
                  viewBox="0 0 340 32"
                  width="340"
                >
                  <motion.path
                    animate={getPathAnimate(item.checked)}
                    className="stroke-[var(--talimy-color-navy)]/80 dark:stroke-sky-100"
                    d={STRIKE_PATH}
                    fill="none"
                    initial={false}
                    strokeLinecap="round"
                    strokeMiterlimit={10}
                    strokeWidth={2}
                    transition={getPathTransition(item.checked)}
                    vectorEffect="non-scaling-stroke"
                  />
                </motion.svg>
              </div>

              <div className="col-start-1 row-start-2 inline-flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5 text-[0.78rem] text-[var(--talimy-color-navy)]">
                <span aria-hidden="true" className="text-[0.8rem]">
                  📅
                </span>
                <span className="truncate">{item.dateLabel}</span>
              </div>

              {renderActions ? (
                <div className="col-start-2 row-start-2 flex flex-none items-center gap-0.5 self-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {renderActions(item)}
                </div>
              ) : null}
            </div>
          </div>

          {index !== items.length - 1 ? <div className="border-t border-slate-200/90" /> : null}
        </div>
      ))}
    </div>
  )
}
