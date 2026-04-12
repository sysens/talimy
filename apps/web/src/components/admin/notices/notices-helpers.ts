import type {
  NoticeCategory,
  NoticeCategoryFilter,
  NoticeStatus,
  NoticeStatusFilter,
} from "@/components/admin/notices/notices-api.types"

export const NOTICE_CATEGORY_COLORS: Record<NoticeCategory, string> = {
  academic: "text-[#9c5fd4] bg-[#f3eaff]",
  events: "text-[#2d7be6] bg-[#e6f0ff]",
  maintenance: "text-[#cb6f1e] bg-[#fff2e2]",
  finance: "text-[#1a8a50] bg-[#e4f7ed]",
  holiday: "text-[#b84daa] bg-[#fceeff]",
  sports: "text-[#d44b4b] bg-[#ffeaea]",
  other: "text-slate-600 bg-slate-100",
}

export const NOTICE_STATUS_STYLES: Record<NoticeStatus, string> = {
  active: "bg-[#1cc886] text-white",
  scheduled: "bg-[#2e3e6e] text-white",
  archived: "bg-slate-400 text-white",
  draft: "bg-amber-400 text-white",
}

export function getNoticeCategoryTranslationKey(category: NoticeCategory): string {
  return category
}

export function getNoticeStatusTranslationKey(status: NoticeStatus): string {
  return status
}

export function getNoticeCategoryFilterTranslationKey(filter: NoticeCategoryFilter): string {
  return filter
}

export function getNoticeStatusFilterTranslationKey(filter: NoticeStatusFilter): string {
  return filter
}

export const NOTICE_CATEGORY_VALUES: readonly NoticeCategoryFilter[] = [
  "all",
  "academic",
  "events",
  "maintenance",
  "finance",
  "holiday",
  "sports",
  "other",
] as const

export const NOTICE_STATUS_VALUES: readonly NoticeStatusFilter[] = [
  "all",
  "active",
  "scheduled",
  "archived",
  "draft",
] as const
