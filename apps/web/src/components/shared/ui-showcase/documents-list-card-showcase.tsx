"use client"

import { DocumentsListCard } from "@/components/shared/documents/documents-list-card"

const SHOWCASE_ITEMS = [
  {
    fileName: "Employment_Contract_CliffWilliam.pdf",
    formatLabel: "PDF",
    sizeLabel: "2.4 MB",
  },
  {
    fileName: "Certification_EnglishTeaching_CliffWilliam.pdf",
    formatLabel: "PDF",
    sizeLabel: "1.8 MB",
  },
  {
    fileName: "ID_Passport_CliffWilliam_T1003.pdf",
    formatLabel: "PDF",
    sizeLabel: "2.2 MB",
  },
] as const

export function DocumentsListCardShowcase() {
  return (
    <div className="max-w-75">
      <DocumentsListCard
        actionLabel="Documents actions"
        items={SHOWCASE_ITEMS}
        onActionPress={() => undefined}
        title="Documents & Compliance"
      />
    </div>
  )
}
