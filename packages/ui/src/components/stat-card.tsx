import * as React from "react"

import { cn } from "../lib/utils"
import { Card } from "./ui/card"

export type StatCardVariant = "horizontal" | "stacked" | "pill" | "finance"
export type StatCardTone = "navy" | "pink" | "sky" | "gray"

type StatCardIcon =
  | React.ComponentType<{ className?: string }>
  | React.ReactElement<{ className?: string }>

export type StatCardProps = Omit<React.ComponentPropsWithoutRef<typeof Card>, "children"> & {
  active?: boolean
  icon?: StatCardIcon
  sparkline?: React.ReactNode
  subtitle?: React.ReactNode
  title: string
  tone?: StatCardTone
  trend?: React.ReactNode
  value: React.ReactNode
  variant?: StatCardVariant
}

const toneMap: Record<StatCardTone, string> = {
  navy: "bg-talimy-navy text-white dark:bg-talimy-navy dark:text-white",
  pink: "bg-[var(--talimy-color-pink)] text-talimy-navy dark:bg-[var(--talimy-color-pink)] dark:text-talimy-navy",
  sky: "bg-[var(--talimy-color-sky)] text-talimy-navy dark:bg-[var(--talimy-color-sky)] dark:text-talimy-navy",
  gray: "bg-[var(--talimy-color-gray)] text-white dark:bg-[var(--talimy-color-gray)] dark:text-white",
}

function renderIcon(icon: StatCardIcon | undefined, className: string) {
  if (!icon) {
    return null
  }

  if (React.isValidElement<{ className?: string }>(icon)) {
    return React.cloneElement(icon, {
      className: cn(className, icon.props.className),
    })
  }

  const IconComponent = icon
  return <IconComponent className={className} />
}

export function StatCard({
  active = false,
  className,
  icon,
  sparkline,
  subtitle,
  title,
  tone = "navy",
  trend,
  value,
  variant = "horizontal",
  ...props
}: StatCardProps) {
  const iconTone = toneMap[tone]

  if (variant === "stacked") {
    return (
      <Card
        className={cn(
          "rounded-3xl border-0 p-0 shadow-none",
          active ? "bg-(--talimy-color-sky) dark:bg-sky-900/40" : "bg-card",
          className
        )}
        {...props}
      >
        <div className="relative flex min-h-36 flex-col justify-end px-5 py-4">
          <span
            className={cn(
              "absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full",
              iconTone
            )}
          >
            {renderIcon(icon, "size-5")}
          </span>
          <p className="text-3xl leading-none font-semibold tracking-tight text-talimy-navy dark:text-sky-200">
            {value}
          </p>
          <p className="mt-1 text-[1rem] leading-tight text-muted-foreground">{title}</p>
          {trend ? <p className="mt-2 text-xs font-medium text-muted-foreground">{trend}</p> : null}
        </div>
      </Card>
    )
  }

  if (variant === "pill") {
    return (
      <Card
        className={cn(
          "rounded-3xl border-0 bg-card p-0 shadow-none",
          active ? "bg-(--talimy-color-sky) dark:bg-sky-900/40" : "",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 px-4 py-4 ">
          <span
            className={cn("inline-flex size-9 items-center justify-center rounded-full", iconTone)}
          >
            {renderIcon(icon, "size-4")}
          </span>
          <p className="truncate text-[1rem] font-medium text-foreground">{title}</p>
          <p className="ml-auto text-xl leading-none font-semibold text-talimy-navy dark:text-sky-200">
            {value}
          </p>
        </div>
      </Card>
    )
  }

  if (variant === "finance") {
    return (
      <Card
        className={cn("rounded-2xl border-0 bg-card p-0 shadow-none min-h-0! ", className)}
        {...props}
      >
        <div className="flex items-center gap-3 px-4 py-4 ">
          <span
            className={cn("inline-flex size-11 items-center justify-center rounded-xl", iconTone)}
          >
            {renderIcon(icon, "size-5")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-2xl leading-none font-semibold text-talimy-navy dark:text-sky-200">
              {value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{title}</p>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={cn("rounded-3xl border-0 ring-0 bg-card p-0 shadow-none", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-[1rem] leading-tight text-[var(--talimy-color-gray)] dark:text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-2xl leading-none font-semibold tracking-tight text-talimy-navy dark:text-sky-200">
            {value}
          </p>
          {trend ? <p className="mt-2 text-xs font-medium text-muted-foreground">{trend}</p> : null}
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex size-12 shrink-0 items-center justify-center rounded-full",
            iconTone
          )}
        >
          {renderIcon(icon, "size-5")}
        </span>
      </div>
      {sparkline ? <div className="px-5 pb-4">{sparkline}</div> : null}
    </Card>
  )
}
