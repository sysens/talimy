import {
  Building2,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FilePenLine,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Settings,
  Star,
  User,
  Users,
  Wallet,
} from "lucide-react"

import type { LucideIcon } from "lucide-react"

const APP_SHELL_ICON_MAP: Record<string, LucideIcon> = {
  "building-2": Building2,
  "calendar-check": CalendarCheck,
  "calendar-days": CalendarDays,
  "clipboard-check": ClipboardCheck,
  "clipboard-list": ClipboardList,
  "clock-3": Clock3,
  "file-pen-line": FilePenLine,
  "file-text": FileText,
  "graduation-cap": GraduationCap,
  inbox: Inbox,
  "layout-dashboard": LayoutDashboard,
  megaphone: Megaphone,
  settings: Settings,
  star: Star,
  user: User,
  users: Users,
  wallet: Wallet,
}

export function resolveAppShellIcon(icon: string): LucideIcon {
  return APP_SHELL_ICON_MAP[icon] ?? LayoutDashboard
}
