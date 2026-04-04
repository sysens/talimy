"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

type TimelineProps = {
  children: React.ReactNode
  className?: string
}

type TimelineItemProps = {
  children: React.ReactNode
  className?: string
  isLast?: boolean
}

type TimelineMarkerProps = {
  children: React.ReactNode
  className?: string
  lineClassName?: string
}

type TimelineContentProps = {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn("space-y-5", className)}>{children}</div>
}

export function TimelineItem({ children, className, isLast = false }: TimelineItemProps) {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={cn("grid grid-cols-[40px_minmax(0,1fr)] gap-4", className)}
      initial={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child
        }

        if (child.type === TimelineMarker) {
          return React.cloneElement(child, { isLast } as { isLast: boolean })
        }

        return child
      })}
    </motion.div>
  )
}

export function TimelineMarker({
  children,
  className,
  lineClassName,
  ...props
}: TimelineMarkerProps & { isLast?: boolean }) {
  const { isLast = false } = props

  return (
    <div className="relative flex justify-center">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-[#264f79] text-white",
          className
        )}
      >
        {children}
      </div>

      {!isLast ? (
        <div
          className={cn(
            "absolute top-11 bottom-[-20px] left-1/2 w-px -translate-x-1/2 border-l border-dashed border-[#e7ebf0]",
            lineClassName
          )}
        />
      ) : null}
    </div>
  )
}

export function TimelineContent({ children, className }: TimelineContentProps) {
  return <div className={cn("min-w-0 space-y-2 pt-1", className)}>{children}</div>
}
