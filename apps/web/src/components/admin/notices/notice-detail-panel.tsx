"use client"

import Image from "next/image"
import { CalendarDays, Download, Eye, FileText, Share2, Trash2, X } from "lucide-react"
import { Button } from "@talimy/ui"

import type { Notice } from "@/components/admin/notices/notices-api.types"
import {
  NOTICE_CATEGORY_COLORS,
  NOTICE_STATUS_STYLES,
} from "@/components/admin/notices/notices-helpers"

type NoticeDetailPanelProps = {
  archiveLabel: string
  editLabel: string
  formatDate: (value: string) => string
  formatDateTime?: (value: string) => string
  getCategoryLabel: (category: Notice["category"]) => string
  getStatusLabel: (status: Notice["status"]) => string
  labels: {
    audience: string
    attachments: string
    content: string
    createdBy: string
    createdByLabel: string
    deleteLabel: string
    detailBoard: string
    expDate: string
    postDate: string
    shareLabel: string
    views: string
  }
  notice: Notice
  onClose: () => void
  onDelete: (id: string) => void
  onEdit: (notice: Notice) => void
  onShare: (notice: Notice) => void
  onArchive: (notice: Notice) => void
}

export function NoticeDetailPanel({
  archiveLabel,
  editLabel,
  formatDate,
  getCategoryLabel,
  getStatusLabel,
  labels,
  notice,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  onShare,
}: NoticeDetailPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-slate-800">{labels.detailBoard}</h2>
        <button
          aria-label={labels.shareLabel}
          className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero image */}
        {notice.imageUrl && (
          <div className="relative h-[160px] w-full overflow-hidden">
            <Image
              alt={notice.title}
              className="object-cover"
              fill
              sizes="(max-width:480px) 100vw, 400px"
              src={notice.imageUrl}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="space-y-4 p-5">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                NOTICE_CATEGORY_COLORS[notice.category],
              ].join(" ")}
            >
              {getCategoryLabel(notice.category)}
            </span>
            {notice.viewCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <Eye className="size-3" />
                {notice.viewCount} {labels.views}
              </span>
            )}
            <span
              className={[
                "ms-auto rounded-full px-3 py-0.5 text-[12px] font-semibold capitalize",
                NOTICE_STATUS_STYLES[notice.status],
              ].join(" ")}
            >
              {getStatusLabel(notice.status)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[16px] font-bold leading-snug text-slate-800">{notice.title}</h3>
          <p className="text-[12px] text-slate-500">
            {labels.createdByLabel} {notice.createdBy}
          </p>

          {/* Meta */}
          <div className="space-y-1.5 rounded-[14px] bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">{labels.audience}</span>
              <span className="font-medium text-slate-700">{notice.audienceLabel}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CalendarDays className="size-3.5" />
                {labels.postDate}
              </span>
              <span className="font-medium text-slate-700">
                {formatDate(notice.postDate)} – 08:00 AM
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CalendarDays className="size-3.5" />
                {labels.expDate}
              </span>
              <span className="font-medium text-slate-700">
                {formatDate(notice.expirationDate)} – 03:00 PM
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              {labels.content}
            </h4>
            <p className="text-[13px] leading-relaxed text-slate-600">{notice.content}</p>
          </div>

          {/* Attachments */}
          {notice.attachments.length > 0 && (
            <div>
              <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                {labels.attachments}
              </h4>
              <div className="flex flex-col gap-2">
                {notice.attachments.map((att) => (
                  <a
                    className="flex items-center gap-3 rounded-[14px] border border-slate-100 bg-white px-4 py-3 transition-colors hover:bg-slate-50"
                    href={att.url}
                    key={att.id}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="flex size-9 items-center justify-center rounded-[10px] bg-(--talimy-color-pink)/10">
                      <FileText className="size-4 text-talimy-pink" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-slate-700">{att.name}</p>
                      <p className="text-[11px] text-slate-400">PDF · {att.sizeLabel}</p>
                    </div>
                    <Download className="size-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
        <div className="mb-3 flex gap-2">
          <Button
            className="h-9 flex-1 rounded-[14px] bg-(--talimy-color-pink)/15 text-[13px] font-semibold text-talimy-pink shadow-none hover:bg-(--talimy-color-pink)/25"
            onClick={() => onEdit(notice)}
            type="button"
            variant="ghost"
          >
            {editLabel}
          </Button>
          <Button
            className="h-9 flex-1 rounded-[14px] bg-slate-100 text-[13px] font-semibold text-slate-600 shadow-none hover:bg-slate-200"
            onClick={() => onShare(notice)}
            type="button"
            variant="ghost"
          >
            <Share2 className="me-1.5 size-3.5" />
            {labels.shareLabel}
          </Button>
          <Button
            className="h-9 flex-1 rounded-[14px] bg-slate-100 text-[13px] font-semibold text-slate-600 shadow-none hover:bg-slate-200"
            onClick={() => onArchive(notice)}
            type="button"
            variant="ghost"
          >
            {archiveLabel}
          </Button>
        </div>
        <Button
          className="h-9 w-full rounded-[14px] bg-red-50 text-[13px] font-semibold text-red-500 shadow-none hover:bg-red-100"
          onClick={() => onDelete(notice.id)}
          type="button"
          variant="ghost"
        >
          <Trash2 className="me-1.5 size-3.5" />
          {labels.deleteLabel}
        </Button>

        {/* Social / share icons */}
        <div className="mt-4 flex items-center justify-center gap-4">
          {(["telegram", "twitter", "whatsapp", "facebook"] as const).map((icon) => (
            <button
              className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              key={icon}
              title={icon}
              type="button"
            >
              <SocialIcon name={icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SocialIcon({ name }: { name: "telegram" | "twitter" | "whatsapp" | "facebook" }) {
  switch (name) {
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.02c-.12.57-.46.71-.93.44l-2.58-1.9-1.24 1.19c-.14.14-.26.25-.52.25l.19-2.66 4.82-4.35c.21-.19-.05-.29-.32-.11L7.39 14.4l-2.53-.79c-.55-.17-.56-.55.12-.82l9.88-3.81c.46-.17.86.11.78.82z" />
        </svg>
      )
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
  }
}
