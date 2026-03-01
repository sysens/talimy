"use client"

import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  cn,
} from "@talimy/ui"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Clock3,
  FilePenLine,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  School,
  Settings,
  Star,
  User,
  Users,
  Wallet,
} from "lucide-react"

import type { NavigationItem } from "@/config/navigation/types"

const iconMap = {
  "book-open": BookOpen,
  "building-2": Building2,
  "calendar-check": CalendarCheck,
  "calendar-days": CalendarDays,
  "clock-3": Clock3,
  "clipboard-check": BookOpen,
  "clipboard-list": BookOpen,
  "file-pen-line": FilePenLine,
  "file-text": FileText,
  "graduation-cap": GraduationCap,
  "layout-dashboard": LayoutDashboard,
  megaphone: Megaphone,
  school: School,
  settings: Settings,
  star: Star,
  user: User,
  users: Users,
  wallet: Wallet,
} as const

type SidebarNavProps = {
  items: NavigationItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <SidebarGroup className="px-3">
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard
            const isActive = matchesItem(pathname, item)
            const label = resolveItemLabel(item, t)

            if (item.children?.length) {
              return (
                <SidebarMenuItem key={item.id}>
                  <Collapsible defaultOpen={isActive}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isActive}
                        className="h-11 rounded-2xl px-3 text-slate-600 data-[active=true]:bg-[color:var(--talimy-color-pink)]/52 data-[active=true]:text-[color:var(--talimy-color-navy)] hover:bg-white/70"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mx-2 mt-1 border-slate-200 pl-3">
                        {item.children.map((child) => {
                          const childActive = matchesItem(pathname, child)
                          return (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={childActive}
                                className={cn(
                                  "h-9 rounded-xl px-3 text-slate-500",
                                  childActive && "bg-white text-[color:var(--talimy-color-navy)]"
                                )}
                              >
                                <Link href={child.href}>
                                  <span>{resolveItemLabel(child, t)}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="h-11 rounded-2xl px-3 text-slate-600 data-[active=true]:bg-[color:var(--talimy-color-pink)]/52 data-[active=true]:text-[color:var(--talimy-color-navy)] hover:bg-white/70"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function resolveItemLabel(item: NavigationItem, t: ReturnType<typeof useTranslations>): string {
  if (item.label) {
    return item.label
  }

  if (item.labelKey) {
    return t(item.labelKey)
  }

  return item.id
}

function matchesItem(pathname: string, item: NavigationItem): boolean {
  if (pathname === item.href) {
    return true
  }

  if (item.matchPrefixes?.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }

  return item.children?.some((child) => matchesItem(pathname, child)) ?? false
}
