import type { ReactNode } from "react"

export type RecordsTableCardFilterOption = {
  label: string
  value: string
}

export type RecordsTableCardColumn<TItem> = {
  cellClassName?: string
  columnClassName?: string
  headerClassName?: string
  key: string
  label: string
  render: (item: TItem) => ReactNode
  sortable?: boolean
}
