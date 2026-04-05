"use client"

import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"

export function TeachersPaginationShowcase() {
  return (
    <TeachersPagination
      currentPage={1}
      nextLabel="Next"
      onPageChange={() => undefined}
      previousLabel="Previous"
      totalPages={11}
    />
  )
}
