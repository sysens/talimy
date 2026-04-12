import type { NoticeListParams } from "@/components/admin/notices/notices-api.types"

export const noticesQueryKeys = {
  all: ["notices"] as const,
  list: (params: Omit<NoticeListParams, "search"> & { search?: string }) =>
    [...noticesQueryKeys.all, "list", params] as const,
}
