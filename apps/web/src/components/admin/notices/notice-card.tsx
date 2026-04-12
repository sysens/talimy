"use client"

import * as React from "react"
import Image from "next/image"
import { CalendarDays, Users } from "lucide-react"

import type { Notice } from "@/components/admin/notices/notices-api.types"
import {
  NOTICE_CATEGORY_COLORS,
  NOTICE_STATUS_STYLES,
} from "@/components/admin/notices/notices-helpers"

type NoticeCardProps = {
  formatDate: (value: string) => string
  getCategoryLabel: (category: Notice["category"]) => string
  getStatusLabel: (status: Notice["status"]) => string
  isActive?: boolean
  labels: {
    createdBy: string
    expDate: string
    postDate: string
  }
  notice: Notice
  onClick: (notice: Notice) => void
}

export function NoticeCard({
  formatDate,
  getCategoryLabel,
  getStatusLabel,
  isActive = false,
  labels,
  notice,
  onClick,
}: NoticeCardProps) {
  return (
    <button
      className={[
        "group w-full rounded-[20px] border px-5 py-4 text-start transition-all duration-200",
        isActive
          ? "border-(--talimy-color-pink)/30 bg-(--talimy-color-pink)/10 shadow-sm"
          : "border-transparent bg-white hover:border-(--talimy-color-pink)/20 hover:bg-(--talimy-color-pink)/5",
      ].join(" ")}
      onClick={() => onClick(notice)}
      type="button"
    >
      <div className="flex items-center gap-4 ">
        {/* Thumbnail */}
        <div className="relative size-[72px] shrink-0 overflow-hidden rounded-[14px] bg-slate-100">
          {notice.imageUrl ? (
            <Image
              alt={notice.title}
              className="object-cover"
              fill
              sizes="72px"
              src={notice.imageUrl}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <CalendarDays className="size-7 text-slate-300" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between w-full">
          {/* Content */}
          <div className="flex min-w-0 flex-col gap-1 w-64">
            {/* Category badge */}
            <span
              className={[
                "w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                NOTICE_CATEGORY_COLORS[notice.category],
              ].join(" ")}
            >
              {getCategoryLabel(notice.category)}
            </span>

            {/* Title */}
            <h3 className="line-clamp-1 text-[14px] font-semibold text-slate-800 group-hover:text-talimy-navy">
              {notice.title}
            </h3>

            {/* Audience */}
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <Users className="size-3.5 shrink-0" />
              <span className="truncate">{notice.audienceLabel}</span>
            </div>
          </div>

          <div className="hidden shrink-0 flex-col gap-1 sm:flex justify-between">
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <CalendarDays className="size-3.5 text-slate-400" />
              <span className="text-[11px] text-nowrap font-medium text-slate-400">
                {labels.postDate}
              </span>
              <span className="text-[12px] text-slate-700">{formatDate(notice.postDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <CalendarDays className="size-3.5 text-slate-400" />
              <span className="text-[11px] text-nowrap font-medium text-slate-400">
                {labels.expDate}
              </span>
              <span className="text-[12px] text-slate-700">
                {formatDate(notice.expirationDate)}
              </span>
            </div>
          </div>

          {/* Creator */}
          <div className="hidden shrink-0 flex-col gap-0.5 lg:flex">
            <span className="text-[11px] font-medium text-slate-400">{labels.createdBy}</span>
            <span className="text-[13px] font-semibold text-slate-700">{notice.createdBy}</span>
          </div>

          {/* Status badge */}
          <div className="shrink-0 self-center">
            <span
              className={[
                "rounded-full px-3 py-1 text-[12px] font-semibold capitalize",
                NOTICE_STATUS_STYLES[notice.status],
              ].join(" ")}
            >
              {getStatusLabel(notice.status)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
