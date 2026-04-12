"use client"

import { StudentDetailPageContent } from "@/components/students/detail/student-detail-page-content"

const STUDENT_DETAIL_SHOWCASE_ID = "89131ed1-a80e-53cf-a642-5acb3bf9406b"

export function StudentDetailPageShowcase() {
  return <StudentDetailPageContent studentId={STUDENT_DETAIL_SHOWCASE_ID} />
}
