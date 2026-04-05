"use client"

import { useSyncExternalStore } from "react"

const NAVIGATION_EVENT = "talimy:navigation-change"
const HISTORY_PATCH_FLAG = "__talimyHistoryPatched"

type PatchedWindow = Window &
  typeof globalThis & {
    [HISTORY_PATCH_FLAG]?: boolean
  }

function dispatchNavigationChangeEvent(): void {
  queueMicrotask(() => {
    window.dispatchEvent(new Event(NAVIGATION_EVENT))
  })
}

function patchHistoryMethods(): void {
  const patchedWindow = window as PatchedWindow

  if (patchedWindow[HISTORY_PATCH_FLAG]) {
    return
  }

  const originalPushState = window.history.pushState.bind(window.history)
  const originalReplaceState = window.history.replaceState.bind(window.history)

  window.history.pushState = ((data, unused, url) => {
    originalPushState(data, unused, url)
    dispatchNavigationChangeEvent()
  }) satisfies History["pushState"]

  window.history.replaceState = ((data, unused, url) => {
    originalReplaceState(data, unused, url)
    dispatchNavigationChangeEvent()
  }) satisfies History["replaceState"]

  patchedWindow[HISTORY_PATCH_FLAG] = true
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined
  }

  patchHistoryMethods()

  window.addEventListener("popstate", onStoreChange)
  window.addEventListener("hashchange", onStoreChange)
  window.addEventListener(NAVIGATION_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("popstate", onStoreChange)
    window.removeEventListener("hashchange", onStoreChange)
    window.removeEventListener(NAVIGATION_EVENT, onStoreChange)
  }
}

function getSnapshot(): string {
  if (typeof window === "undefined") {
    return "/"
  }

  return window.location.pathname
}

export function useCurrentPathname(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => "/")
}
