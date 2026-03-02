export type NavigationBadge = {
  type: "dot" | "count" | "label"
  value?: string | number
}

export type NavigationItem = {
  id: string
  label?: string
  labelKey?: string
  href: string
  icon: string
  section?: "main" | "updates"
  children?: NavigationItem[]
  matchPrefixes?: string[]
  disabled?: boolean
  badge?: NavigationBadge
}
