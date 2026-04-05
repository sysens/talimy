type RememberMeWorkspaceKind = "platform" | "school"

const REMEMBERED_EMAIL_STORAGE_PREFIX = "talimy:auth:remembered-email"

export function loadRememberedEmail(workspaceKind: RememberMeWorkspaceKind): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(resolveRememberedEmailStorageKey(workspaceKind))
}

export function saveRememberedEmail(workspaceKind: RememberMeWorkspaceKind, email: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(resolveRememberedEmailStorageKey(workspaceKind), email)
}

export function clearRememberedEmail(workspaceKind: RememberMeWorkspaceKind): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(resolveRememberedEmailStorageKey(workspaceKind))
}

function resolveRememberedEmailStorageKey(workspaceKind: RememberMeWorkspaceKind): string {
  const host = typeof window === "undefined" ? "server" : window.location.host.toLowerCase()
  return `${REMEMBERED_EMAIL_STORAGE_PREFIX}:${workspaceKind}:${host}`
}
