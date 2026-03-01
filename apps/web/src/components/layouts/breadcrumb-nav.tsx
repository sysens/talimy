"use client"

import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@talimy/ui"
import { usePathname } from "next/navigation"

export function BreadcrumbNav() {
  const pathname = usePathname()
  const parts = pathname.split("/").filter(Boolean)
  const segments = parts[0] === "admin" ? parts.slice(1) : parts

  const breadcrumbs = segments.map((segment, index) => ({
    href: `/${parts.slice(0, index + (parts[0] === "admin" ? 2 : 1)).join("/")}`,
    label: formatSegmentLabel(segment),
  }))

  if (breadcrumbs.length === 0) {
    return (
      <div className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight text-[color:var(--talimy-color-navy)]">
          Dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <p className="text-2xl font-semibold tracking-tight text-[color:var(--talimy-color-navy)]">
        {breadcrumbs[breadcrumbs.length - 1]?.label}
      </p>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <BreadcrumbItem key={breadcrumb.href}>
                {isLast ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

function formatSegmentLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
