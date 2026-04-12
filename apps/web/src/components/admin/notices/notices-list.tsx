"use client"

import { FileText } from "lucide-react"

import type { Notice } from "@/components/admin/notices/notices-api.types"
import { NoticeCard } from "@/components/admin/notices/notice-card"

type NoticeListProps = {
  activeNoticeId?: string | null
  emptyLabel: string
  formatDate: (value: string) => string
  getCategoryLabel: (category: Notice["category"]) => string
  getStatusLabel: (status: Notice["status"]) => string
  labels: {
    createdBy: string
    expDate: string
    postDate: string
  }
  notices: Notice[]
  onNoticeClick: (notice: Notice) => void
}

export function NoticeList({
  activeNoticeId,
  emptyLabel,
  formatDate,
  getCategoryLabel,
  getStatusLabel,
  labels,
  notices,
  onNoticeClick,
}: NoticeListProps) {
  if (notices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-white py-16">
        <div className="flex size-14 items-center justify-center rounded-full bg-slate-100">
          <FileText className="size-6 text-slate-400" />
        </div>
        <p className="text-[14px] text-slate-500">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {notices.map((notice) => (
        <NoticeCard
          formatDate={formatDate}
          getCategoryLabel={getCategoryLabel}
          getStatusLabel={getStatusLabel}
          isActive={activeNoticeId === notice.id}
          key={notice.id}
          labels={labels}
          notice={notice}
          onClick={onNoticeClick}
        />
      ))}
    </div>
  )
}
