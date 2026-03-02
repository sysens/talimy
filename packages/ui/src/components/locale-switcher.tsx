"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "../lib/utils"

type LocaleSwitcherItem = {
  value: string
  label: string
}

export type LocaleSwitcherProps = {
  items: LocaleSwitcherItem[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

type IndicatorStyle = {
  width: number
  transform: string
}

export function LocaleSwitcher({
  items,
  value,
  onChange,
  disabled = false,
  className,
}: LocaleSwitcherProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    width: 0,
    transform: "translateX(0px)",
  })

  const activeIndex = useMemo(() => {
    const index = items.findIndex((item) => item.value === value)
    return index >= 0 ? index : 0
  }, [items, value])

  useEffect(() => {
    const activeButton = buttonRefs.current[activeIndex]

    if (!activeButton) {
      return
    }

    setIndicatorStyle({
      width: activeButton.offsetWidth - 2.6,
      transform: `translateX(${activeButton.offsetLeft - 2}px)`,
    })
  }, [activeIndex, items])

  return (
    <div
      className={cn(
        "relative inline-flex h-10 max-w-full items-center rounded-full bg-talimy-sky p-1 shadow-[0_12px_28px_rgba(21,68,110,0.12)] ring-1 ring-talimy-sky/70",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute left-1 top-1 h-8 rounded-full bg-[color:var(--talimy-color-navy)] shadow-[0_6px_16px_rgba(21,68,110,0.2)] transition-[transform,width] duration-300 ease-out"
        style={indicatorStyle}
      />
      {items.map((item, index) => {
        const active = item.value === value

        return (
          <button
            key={item.value}
            ref={(element) => {
              buttonRefs.current[index] = element
            }}
            type="button"
            disabled={disabled}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative z-10 flex h-8 flex-1 cursor-pointer items-center justify-center rounded-full px-3 py-0 text-[13px] font-semibold transition-colors duration-200 disabled:cursor-not-allowed",
              active
                ? "text-white"
                : "text-[color:var(--talimy-color-navy)] hover:bg-[rgba(254,204,253,0.65)] hover:text-[color:var(--talimy-color-navy)]"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
