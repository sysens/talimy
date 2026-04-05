import { Fragment } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  cn,
} from "@talimy/ui"

type DetailPageHeaderBreadcrumb = {
  href?: string
  label: string
}

type DetailPageHeaderProps = {
  backHref: string
  backLabel: string
  breadcrumbs: readonly DetailPageHeaderBreadcrumb[]
  className?: string
  title: string
}

export function DetailPageHeader({
  backHref,
  backLabel,
  breadcrumbs,
  className,
  title,
}: DetailPageHeaderProps) {
  const lastIndex = breadcrumbs.length - 1

  return (
    <header className={cn("space-y-3 pt-4 px-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="rounded-full px-3" size="sm" variant="outline">
          <Link href={backHref}>
            <ArrowLeft className="size-4" />
            <span>{backLabel}</span>
          </Link>
        </Button>

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--talimy-color-navy)]">
          {title}
        </h1>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => {
            const isLast = index === lastIndex

            return (
              <Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast ? <BreadcrumbSeparator /> : null}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
