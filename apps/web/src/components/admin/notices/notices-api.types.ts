export type NoticeCategory =
  | "academic"
  | "events"
  | "maintenance"
  | "finance"
  | "holiday"
  | "sports"
  | "other"

export type NoticeStatus = "active" | "scheduled" | "archived" | "draft"

export type NoticeAudience = "students" | "teachers" | "parents" | "all" | "staff"

export type NoticeAttachment = {
  id: string
  name: string
  sizeLabel: string
  url: string
}

export type Notice = {
  id: string
  title: string
  content: string
  category: NoticeCategory
  status: NoticeStatus
  audience: NoticeAudience[]
  audienceLabel: string
  postDate: string
  expirationDate: string
  createdBy: string
  imageUrl: string | null
  attachments: NoticeAttachment[]
  viewCount: number
}

export type NoticeListResponse = {
  rows: Notice[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type NoticeCategoryFilter = NoticeCategory | "all"
export type NoticeStatusFilter = NoticeStatus | "all"

export type NoticeListParams = {
  page: number
  limit: number
  category: NoticeCategoryFilter
  status: NoticeStatusFilter
  search?: string
}

export type CreateNoticePayload = {
  title: string
  content: string
  category: NoticeCategory
  audience: NoticeAudience[]
  postDate: string
  expirationDate: string
}
