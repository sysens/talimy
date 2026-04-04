"use client"

import { Skeleton } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getDashboardNotices } from "@/components/dashboard/admin/dashboard-api"
import { mapNoticesToFeed } from "@/components/dashboard/admin/dashboard-api.mappers"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import type { AppLocale } from "@/config/site"
import { FeedTable, type FeedItem } from "@/components/shared/feed/feed-table"

export function AdminDashboardNoticeBoardSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard.noticeBoard")

  const noticeBoardQuery = useQuery({
    queryKey: adminDashboardQueryKeys.notices(locale),
    queryFn: async () => {
      const response = await getDashboardNotices("popular", 4)

      return {
        actionsLabel: (item: FeedItem) => t("actionsAriaLabel", { title: item.title }),
        emptyState: t("emptyState"),
        items: mapNoticesToFeed(locale, t, response),
        sortLabel: t("sortLabel"),
        sortOptions: [
          { label: t("sortOptions.popular"), value: "popular" },
          { label: t("sortOptions.latest"), value: "latest" },
          { label: t("sortOptions.oldest"), value: "oldest" },
        ] as const,
        title: t("title"),
      }
    },
    refetchInterval: 60_000,
  })

  if (noticeBoardQuery.isLoading || !noticeBoardQuery.data) {
    return <Skeleton className="h-[360px] rounded-[28px]" />
  }

  return (
    <FeedTable
      actionsLabel={noticeBoardQuery.data.actionsLabel}
      emptyState={noticeBoardQuery.data.emptyState}
      items={noticeBoardQuery.data.items}
      sortLabel={noticeBoardQuery.data.sortLabel}
      sortOptions={noticeBoardQuery.data.sortOptions}
      title={noticeBoardQuery.data.title}
    />
  )
}
