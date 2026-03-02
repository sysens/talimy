import type { AppShellSidebarData } from "./types"

export const APP_SHELL_SIDEBAR_DATA: AppShellSidebarData = {
  logo: {
    title: "Talimy",
    description: "School workspace",
  },
  homeHref: "/admin/dashboard",
  breadcrumbRootLabel: "School",
  navGroups: [
    {
      title: "Main menu",
      defaultOpen: true,
      items: [
        { label: "Dashboard", icon: "layout-dashboard", href: "/admin/dashboard", matchPrefixes: ["/admin/dashboard"] },
        { label: "Teachers", icon: "graduation-cap", href: "/admin/teachers", matchPrefixes: ["/admin/teachers"] },
        { label: "Students", icon: "users", href: "/admin/students", matchPrefixes: ["/admin/students"] },
        { label: "Attendance", icon: "calendar-check", href: "/admin/attendance", matchPrefixes: ["/admin/attendance"] },
        {
          label: "Finance",
          icon: "wallet",
          href: "/admin/finance",
          matchPrefixes: ["/admin/finance"],
          children: [
            { label: "Fees Collection", icon: "wallet", href: "/admin/finance/payments" },
            { label: "Expenses", icon: "wallet", href: "/admin/finance/expenses" },
          ],
        },
      ],
    },
    {
      title: "Updates",
      defaultOpen: false,
      items: [
        { label: "Inbox", icon: "inbox", href: "/admin/inbox", matchPrefixes: ["/admin/inbox"] },
        { label: "Calendar", icon: "calendar-days", href: "/admin/calendar", matchPrefixes: ["/admin/calendar"] },
        { label: "Notice Board", icon: "megaphone", href: "/admin/notices", matchPrefixes: ["/admin/notices"] },
      ],
    },
  ],
  footerGroup: {
    title: "Account",
    items: [
      { label: "Profile", icon: "user", href: "/admin/profile", matchPrefixes: ["/admin/profile"] },
      { label: "Settings", icon: "settings", href: "/admin/settings", matchPrefixes: ["/admin/settings"] },
    ],
  },
  user: {
    name: "School Admin",
    email: "admin@talimy.space",
  },
  userMenuLabels: {
    account: "Account",
    logout: "Log out",
  },
}
