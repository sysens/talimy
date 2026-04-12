"use client"

import * as React from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Card, CardContent, Skeleton } from "@talimy/ui"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { sileo } from "sileo"

import { getNoticesList } from "@/components/admin/notices/notices-api"
import type {
  Notice,
  NoticeCategoryFilter,
  NoticeStatusFilter,
} from "@/components/admin/notices/notices-api.types"
import { AddEditNoticeModal } from "@/components/admin/notices/add-edit-notice-modal"
import { NoticeDetailPanel } from "@/components/admin/notices/notice-detail-panel"
import { NoticeFilterBar } from "@/components/admin/notices/notice-filter-bar"
import { NoticeList } from "@/components/admin/notices/notices-list"
import {
  NOTICE_CATEGORY_VALUES,
  NOTICE_STATUS_VALUES,
  getNoticeCategoryTranslationKey,
  getNoticeStatusTranslationKey,
} from "@/components/admin/notices/notices-helpers"
import { noticesQueryKeys } from "@/components/admin/notices/notices-query-keys"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"

const PAGE_LIMIT = 9

function formatNoticeDate(locale: string, value: string): string {
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale === "uz" ? "ru" : locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

type AdminNoticesBoardSectionProps = {
  locale: string
}

export function AdminNoticesBoardSection({ locale }: AdminNoticesBoardSectionProps) {
  const t = useTranslations("adminNotices")
  const queryClient = useQueryClient()

  // ── State ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [category, setCategory] = React.useState<NoticeCategoryFilter>("all")
  const [status, setStatus] = React.useState<NoticeStatusFilter>("all")
  const [page, setPage] = React.useState(1)
  const [selectedNotice, setSelectedNotice] = React.useState<Notice | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingNotice, setEditingNotice] = React.useState<Notice | null>(null)

  // Debounce search
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(timeout)
  }, [search])

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1)
  }, [category, status])

  // ── Query ──────────────────────────────────────────────────────────────────
  const noticesQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      getNoticesList({
        category,
        limit: PAGE_LIMIT,
        page,
        search: debouncedSearch,
        status,
      }),
    queryKey: noticesQueryKeys.list({
      category,
      limit: PAGE_LIMIT,
      page,
      search: debouncedSearch,
      status,
    }),
    staleTime: 30_000,
  })

  // Fix page overflow
  React.useEffect(() => {
    const totalPages = noticesQuery.data?.meta.totalPages
    if (typeof totalPages === "number" && page > totalPages) {
      setPage(Math.max(1, totalPages))
    }
  }, [noticesQuery.data?.meta.totalPages, page])

  // ── Mutations (mock) ───────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (_data: unknown) => {
      await new Promise((r) => setTimeout(r, 600))
    },
    onError: () => {
      sileo.error({
        description: t("toasts.createErrorDescription"),
        title: t("toasts.createErrorTitle"),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noticesQueryKeys.all })
      sileo.success({
        description: t("toasts.createSuccessDescription"),
        title: t("toasts.createSuccessTitle"),
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (_id: string) => {
      await new Promise((r) => setTimeout(r, 400))
    },
    onError: () => {
      sileo.error({
        description: t("toasts.deleteErrorDescription"),
        title: t("toasts.deleteErrorTitle"),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noticesQueryKeys.all })
      sileo.success({
        description: t("toasts.deleteSuccessDescription"),
        title: t("toasts.deleteSuccessTitle"),
      })
      setSelectedNotice(null)
    },
  })

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = React.useCallback((value: string) => formatNoticeDate(locale, value), [locale])

  const getCategoryLabel = React.useCallback(
    (cat: Notice["category"]) => t(`categories.${getNoticeCategoryTranslationKey(cat)}`),
    [t]
  )

  const getStatusLabel = React.useCallback(
    (s: Notice["status"]) => t(`statuses.${getNoticeStatusTranslationKey(s)}`),
    [t]
  )

  // ── Filter options ─────────────────────────────────────────────────────────
  const categoryOptions = React.useMemo(
    () =>
      NOTICE_CATEGORY_VALUES.map((v) => ({
        label: v === "all" ? t("filters.allCategories") : t(`categories.${v}`),
        value: v,
      })),
    [t]
  )

  const statusOptions = React.useMemo(
    () =>
      NOTICE_STATUS_VALUES.map((v) => ({
        label: v === "all" ? t("filters.allStatuses") : t(`statuses.${v}`),
        value: v,
      })),
    [t]
  )

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleNoticeClick(notice: Notice) {
    setSelectedNotice((prev) => (prev?.id === notice.id ? null : notice))
  }

  function handleEdit(notice: Notice) {
    setEditingNotice(notice)
    setIsModalOpen(true)
  }

  function handleAddNew() {
    setEditingNotice(null)
    setIsModalOpen(true)
  }

  async function handleModalSubmit(data: Parameters<typeof createMutation.mutateAsync>[0]) {
    await createMutation.mutateAsync(data)
  }

  // ── Skeleton ───────────────────────────────────────────────────────────────
  const isLoading = noticesQuery.isLoading && !noticesQuery.data
  const notices = noticesQuery.data?.rows ?? []
  const meta = noticesQuery.data?.meta

  return (
    <section className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-talimy-navy">{t("pageTitle")}</h1>
      </div>

      {/* Filter bar */}
      <NoticeFilterBar
        action={
          <Button
            className="h-10 rounded-[16px] bg-talimy-pink px-4 text-[13px] font-medium text-talimy-navy shadow-none hover:bg-talimy-pink/90"
            onClick={handleAddNew}
            type="button"
          >
            <Plus className="me-1 size-4" />
            {t("actions.add")}
          </Button>
        }
        filters={[
          {
            ariaLabel: t("filters.categoryAriaLabel"),
            onValueChange: (v) => {
              setCategory(
                NOTICE_CATEGORY_VALUES.includes(v as NoticeCategoryFilter)
                  ? (v as NoticeCategoryFilter)
                  : "all"
              )
            },
            options: categoryOptions,
            triggerClassName: "min-w-[152px]",
            value: category,
          },
          {
            ariaLabel: t("filters.statusAriaLabel"),
            onValueChange: (v) => {
              setStatus(
                NOTICE_STATUS_VALUES.includes(v as NoticeStatusFilter)
                  ? (v as NoticeStatusFilter)
                  : "all"
              )
            },
            options: statusOptions,
            triggerClassName: "min-w-[130px]",
            value: status,
          },
        ]}
        onSearchChange={setSearch}
        searchPlaceholder={t("filters.searchPlaceholder")}
        searchValue={search}
      />

      {/* Main content — list + detail panel */}
      <div className="flex gap-4">
        {/* Notices list */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {isLoading ? (
            <Card className="rounded-[20px] border border-slate-100 bg-white shadow-none">
              <CardContent className="space-y-3 p-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton className="h-[88px] rounded-[16px]" key={`notice-skeleton-${i}`} />
                ))}
              </CardContent>
            </Card>
          ) : (
            <NoticeList
              activeNoticeId={selectedNotice?.id}
              emptyLabel={noticesQuery.isError ? t("states.loadError") : t("states.empty")}
              formatDate={formatDate}
              getCategoryLabel={getCategoryLabel}
              getStatusLabel={getStatusLabel}
              labels={{
                createdBy: t("detail.createdBy"),
                expDate: t("columns.expDate"),
                postDate: t("columns.postDate"),
              }}
              notices={notices}
              onNoticeClick={handleNoticeClick}
            />
          )}

          {/* Pagination */}
          {!isLoading && meta && meta.totalPages > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-2">
              <TeachersResultsSummary
                limit={PAGE_LIMIT}
                limitOptions={[]}
                ofLabel={t("pagination.of")}
                onLimitChange={() => undefined}
                resultsLabel={t("pagination.results")}
                showLabel={t("pagination.show")}
                total={meta.total}
              />
              <TeachersPagination
                currentPage={page}
                nextLabel={t("pagination.next")}
                onPageChange={setPage}
                previousLabel={t("pagination.previous")}
                totalPages={meta.totalPages}
              />
            </div>
          )}
        </div>

        {/* Detail panel — only visible when a notice is selected */}
        {selectedNotice && (
          <div className="hidden w-[340px] shrink-0 lg:block">
            <div className="sticky top-4 max-h-[calc(100vh-120px)] overflow-hidden rounded-[24px]">
              <NoticeDetailPanel
                editLabel={t("actions.edit")}
                formatDate={formatDate}
                getCategoryLabel={getCategoryLabel}
                getStatusLabel={getStatusLabel}
                archiveLabel={t("actions.archive")}
                labels={{
                  attachments: t("detail.attachments"),
                  audience: t("detail.audience"),
                  content: t("detail.content"),
                  createdBy: t("detail.createdBy"),
                  createdByLabel: t("detail.createdByLabel"),
                  deleteLabel: t("actions.delete"),
                  detailBoard: t("detail.detailBoard"),
                  expDate: t("columns.expDate"),
                  postDate: t("columns.postDate"),
                  shareLabel: t("actions.share"),
                  views: t("detail.views"),
                }}
                notice={selectedNotice}
                onArchive={() => sileo.info({ description: "", title: t("toasts.archiveInfo") })}
                onClose={() => setSelectedNotice(null)}
                onDelete={(id) => deleteMutation.mutate(id)}
                onEdit={handleEdit}
                onShare={() => sileo.info({ description: "", title: t("toasts.shareInfo") })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <AddEditNoticeModal
        initialData={editingNotice}
        onOpenChange={setIsModalOpen}
        onSubmit={handleModalSubmit}
        open={isModalOpen}
      />
    </section>
  )
}
