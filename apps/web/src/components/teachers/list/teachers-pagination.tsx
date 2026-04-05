"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@talimy/ui"

function buildVisiblePages(
  currentPage: number,
  totalPages: number
): ReadonlyArray<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages]
}

type TeachersPaginationProps = {
  currentPage: number
  nextLabel: string
  onPageChange: (page: number) => void
  previousLabel: string
  totalPages: number
}

export function TeachersPagination({
  currentPage,
  nextLabel,
  onPageChange,
  previousLabel,
  totalPages,
}: TeachersPaginationProps) {
  const visiblePages = buildVisiblePages(currentPage, totalPages)

  return (
    <nav aria-label="Teachers pagination" className="flex items-center gap-2">
      <Button
        aria-label={previousLabel}
        className="size-8 rounded-[10px] border border-slate-100 bg-white p-0 text-slate-300 shadow-none hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
        variant="ghost"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {visiblePages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              className="flex size-8 items-center justify-center text-sm text-slate-400"
              key={`teachers-pagination-ellipsis-${index}`}
            >
              <MoreHorizontal className="size-4" />
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <Button
            aria-current={isActive ? "page" : undefined}
            className={[
              "size-8 rounded-[10px] p-0 text-sm font-semibold shadow-none",
              isActive
                ? "bg-[var(--talimy-color-pink)]/70 text-talimy-navy hover:bg-[var(--talimy-color-pink)]/80"
                : "bg-[var(--talimy-color-sky)]/45 text-talimy-navy hover:bg-[var(--talimy-color-sky)]/60",
            ].join(" ")}
            key={`teachers-pagination-page-${page}`}
            onClick={() => onPageChange(page)}
            type="button"
            variant="ghost"
          >
            {page}
          </Button>
        )
      })}

      <Button
        aria-label={nextLabel}
        className="size-8 rounded-[10px] border border-slate-100 bg-[var(--talimy-color-sky)]/45 p-0 text-talimy-navy shadow-none hover:bg-[var(--talimy-color-sky)]/60 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
        variant="ghost"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
