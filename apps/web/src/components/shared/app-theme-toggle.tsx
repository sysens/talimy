"use client"

import { useRef } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@talimy/ui"

type AppThemeToggleProps = {
  className?: string
  ariaLabel: string
}

export function AppThemeToggle({ className, ariaLabel }: AppThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const applyThemeToDocument = (theme: "light" | "dark") => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.style.colorScheme = theme
  }

  const handleToggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark"
    const documentWithTransition = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> }
    }
    const root = document.documentElement
    const buttonRect = buttonRef.current?.getBoundingClientRect()

    root.dataset.themeTransition = nextTheme
    root.style.setProperty("--theme-switch-origin-x", `${buttonRect?.left ?? window.innerWidth * 0.88}px`)
    root.style.setProperty("--theme-switch-origin-y", `${buttonRect?.top ?? 0}px`)

    if (!documentWithTransition.startViewTransition) {
      applyThemeToDocument(nextTheme)
      setTheme(nextTheme)
      delete root.dataset.themeTransition
      return
    }

    const transition = documentWithTransition.startViewTransition(() => {
      flushSync(() => {
        applyThemeToDocument(nextTheme)
        setTheme(nextTheme)
      })
    })

    void transition.finished.finally(() => {
      delete root.dataset.themeTransition
    })
  }

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      className={className}
      onClick={handleToggleTheme}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  )
}
