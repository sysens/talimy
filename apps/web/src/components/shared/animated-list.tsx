"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"

import { cn } from "@/lib/utils"

type AnimatedListItemProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  index: number
  onClick?: () => void
  onMouseEnter?: () => void
}

function AnimatedListItem({
  children,
  className,
  delay = 0,
  index,
  onClick,
  onMouseEnter,
}: AnimatedListItemProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.45, once: false })

  return (
    <motion.div
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
      className={cn("cursor-pointer", className)}
      data-index={index}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={ref}
      transition={{ delay, duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export type AnimatedListProps<T> = {
  className?: string
  displayScrollbar?: boolean
  enableArrowNavigation?: boolean
  getItemKey: (item: T, index: number) => string
  initialSelectedIndex?: number
  itemClassName?: string
  items: readonly T[]
  onItemSelect?: (item: T, index: number) => void
  renderItem: (item: T, options: { index: number; isSelected: boolean }) => React.ReactNode
  showGradients?: boolean
  viewportClassName?: string
}

export function AnimatedList<T>({
  className,
  displayScrollbar = true,
  enableArrowNavigation = true,
  getItemKey,
  initialSelectedIndex = -1,
  itemClassName,
  items,
  onItemSelect,
  renderItem,
  showGradients = true,
  viewportClassName,
}: AnimatedListProps<T>) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(initialSelectedIndex)
  const [keyboardNavigation, setKeyboardNavigation] = React.useState(false)
  const [topGradientOpacity, setTopGradientOpacity] = React.useState(0)
  const [bottomGradientOpacity, setBottomGradientOpacity] = React.useState(1)

  const handleItemMouseEnter = React.useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleItemSelect = React.useCallback(
    (item: T, index: number) => {
      setSelectedIndex(index)
      onItemSelect?.(item, index)
    },
    [onItemSelect]
  )

  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget

    setTopGradientOpacity(Math.min(scrollTop / 48, 1))

    const bottomDistance = scrollHeight - (scrollTop + clientHeight)
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 48, 1))
  }, [])

  React.useEffect(() => {
    if (!enableArrowNavigation || items.length === 0) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
        event.preventDefault()
        setKeyboardNavigation(true)
        setSelectedIndex((previousIndex) => Math.min(previousIndex + 1, items.length - 1))
      } else if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault()
        setKeyboardNavigation(true)
        setSelectedIndex((previousIndex) => Math.max(previousIndex - 1, 0))
      } else if (event.key === "Enter" && selectedIndex >= 0 && selectedIndex < items.length) {
        event.preventDefault()
        const selectedItem = items[selectedIndex]

        if (selectedItem !== undefined) {
          onItemSelect?.(selectedItem, selectedIndex)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableArrowNavigation, items, onItemSelect, selectedIndex])

  React.useEffect(() => {
    if (!keyboardNavigation || selectedIndex < 0 || !listRef.current) {
      return
    }

    const container = listRef.current
    const selectedItem = container.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`)

    if (selectedItem) {
      const extraMargin = 36
      const containerHeight = container.clientHeight
      const containerScrollTop = container.scrollTop
      const itemBottom = selectedItem.offsetTop + selectedItem.offsetHeight
      const itemTop = selectedItem.offsetTop

      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ behavior: "smooth", top: itemTop - extraMargin })
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          behavior: "smooth",
          top: itemBottom - containerHeight + extraMargin,
        })
      }
    }

    setKeyboardNavigation(false)
  }, [keyboardNavigation, selectedIndex])

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "overflow-y-auto",
          displayScrollbar
            ? "[&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-thumb]:bg-[#d6dde6] [&::-webkit-scrollbar]:w-[6px]"
            : "scrollbar-hide",
          viewportClassName
        )}
        onScroll={handleScroll}
        ref={listRef}
        style={{
          scrollbarColor: displayScrollbar ? "#d6dde6 transparent" : "transparent transparent",
          scrollbarWidth: displayScrollbar ? "thin" : "none",
        }}
      >
        {items.map((item, index) => (
          <AnimatedListItem
            className={itemClassName}
            delay={index * 0.04}
            index={index}
            key={getItemKey(item, index)}
            onClick={() => handleItemSelect(item, index)}
            onMouseEnter={() => handleItemMouseEnter(index)}
          >
            {renderItem(item, { index, isSelected: selectedIndex === index })}
          </AnimatedListItem>
        ))}
      </div>

      {showGradients ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent transition-opacity duration-300"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent transition-opacity duration-300"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      ) : null}
    </div>
  )
}
