"use client"

import * as React from "react"
import type { ReactNode } from "react"

import { Avatar, Button, Chip, Table } from "@heroui/react"
import { Icon } from "@iconify/react"

import { ChartFilterSelect } from "@talimy/ui"

export type FeedSortOrder = "latest" | "oldest" | "popular"

export type FeedBadge = {
  className: string
  label: string
}

export type FeedMeta = {
  label: string
  value: string
}

export type FeedItem = {
  badges: readonly FeedBadge[]
  id: string
  imageFallback: string
  imageUrl: string
  metadata: readonly FeedMeta[]
  popularity: number
  publishedAt: string
  title: string
}

type FeedTableProps = {
  actionsLabel?: (item: FeedItem) => string
  ariaLabel?: string
  emptyState?: string
  items: readonly FeedItem[]
  sortLabel?: string
  sortOptions?: ReadonlyArray<{ label: string; value: FeedSortOrder }>
  title: string
}

const DEFAULT_SORT_OPTIONS: ReadonlyArray<{ label: string; value: FeedSortOrder }> = [
  { value: "popular", label: "Popular" },
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
]

const META_COLUMN_CLASS_NAMES = ["w-[18%]", "w-[16%]", "w-[20%]"] as const

function HiddenHeader({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}

function MetaCell({ label, value }: FeedMeta) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  )
}

function isFeedSortOrder(value: string): value is FeedSortOrder {
  return value === "popular" || value === "latest" || value === "oldest"
}

function parsePublishedAt(publishedAt: string): number {
  return new Date(publishedAt).getTime()
}

export function FeedTable({
  actionsLabel,
  ariaLabel = "Collection preview table",
  emptyState = "No items found.",
  items,
  sortLabel = "Sort by:",
  sortOptions = DEFAULT_SORT_OPTIONS,
  title,
}: FeedTableProps) {
  const [sortOrder, setSortOrder] = React.useState<FeedSortOrder>("popular")

  const metadataLabels = React.useMemo(() => {
    return items[0]?.metadata.map((entry) => entry.label) ?? []
  }, [items])

  const sortedItems = React.useMemo(() => {
    const nextItems = [...items]

    if (sortOrder === "popular") {
      nextItems.sort((firstItem, secondItem) => secondItem.popularity - firstItem.popularity)
      return nextItems
    }

    nextItems.sort(
      (firstItem, secondItem) =>
        parsePublishedAt(firstItem.publishedAt) - parsePublishedAt(secondItem.publishedAt)
    )

    if (sortOrder === "latest") {
      nextItems.reverse()
    }

    return nextItems
  }, [items, sortOrder])

  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-[#1f4d7b]">{title}</h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{sortLabel}</span>
          <ChartFilterSelect
            ariaLabel={`${title} sorting`}
            className="shrink-0"
            onValueChange={(value) => {
              if (isFeedSortOrder(value)) {
                setSortOrder(value)
              }
            }}
            options={[...sortOptions]}
            triggerClassName="h-10 min-w-24 rounded-2xl px-3 text-sm font-semibold"
            value={sortOrder}
          />
        </div>
      </div>

      <Table className="bg-transparent" variant="secondary">
        <Table.ScrollContainer>
          {sortedItems.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
              {emptyState}
            </div>
          ) : (
            <Table.Content aria-label={ariaLabel} className="min-w-[980px] [&_thead]:sr-only">
              <Table.Header>
                <Table.Column className="w-[39%] px-2 py-2" isRowHeader>
                  <HiddenHeader>{title}</HiddenHeader>
                </Table.Column>
                {metadataLabels.map((label, index) => (
                  <Table.Column
                    className={`${META_COLUMN_CLASS_NAMES[index] ?? "w-[20%]"} px-2 py-2`}
                    key={label}
                  >
                    <HiddenHeader>{label}</HiddenHeader>
                  </Table.Column>
                ))}
                <Table.Column className="w-12 px-2 py-2 text-right">
                  <HiddenHeader>Actions</HiddenHeader>
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {sortedItems.map((item) => (
                  <Table.Row id={item.id} key={item.id}>
                    <Table.Cell className="px-2 py-2">
                      <div className="flex items-start gap-4">
                        <Avatar className="mt-1 size-11 rounded-xl" size="sm">
                          <Avatar.Image className="rounded-xl object-cover" src={item.imageUrl} />
                          <Avatar.Fallback className="rounded-xl bg-sky-100 text-xs font-semibold text-sky-700">
                            {item.imageFallback}
                          </Avatar.Fallback>
                        </Avatar>

                        <div className="min-w-0 space-y-2">
                          <p className="whitespace-nowrap text-base font-medium text-slate-700">
                            {item.title}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            {item.badges.map((badge) => (
                              <Chip
                                className={`rounded-md px-0.5 text-[0.75rem] font-medium shadow-none ${badge.className}`}
                                key={`${item.id}-${badge.label}`}
                                size="sm"
                                variant="soft"
                              >
                                {badge.label}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>

                    {item.metadata.map((entry) => (
                      <Table.Cell className="px-2 py-2" key={`${item.id}-${entry.label}`}>
                        <MetaCell label={entry.label} value={entry.value} />
                      </Table.Cell>
                    ))}

                    <Table.Cell className="px-2 py-2">
                      <div className="flex justify-end">
                        <Button
                          isIconOnly
                          aria-label={actionsLabel?.(item) ?? `${item.title} actions`}
                          size="sm"
                          variant="ghost"
                        >
                          <Icon
                            className="size-5 text-slate-500"
                            icon="heroicons:ellipsis-horizontal-20-solid"
                          />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          )}
        </Table.ScrollContainer>
      </Table>
    </div>
  )
}
