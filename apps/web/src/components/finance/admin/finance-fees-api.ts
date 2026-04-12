import { webApiFetch } from "@/lib/api"

import type {
  FinanceFeesListParams,
  FinanceFeesListResponse,
  FinanceFeesProgressResponse,
  FinanceFeesSummaryResponse,
  FinanceFeesTrendResponse,
} from "@/components/finance/admin/finance-fees-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

function buildSearch(params: Record<string, number | string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      searchParams.set(key, String(value))
    }
  }

  const serialized = searchParams.toString()
  return serialized.length > 0 ? `?${serialized}` : ""
}

export function getFinanceFeesSummary(month?: string) {
  return webApiFetch<SuccessEnvelope<FinanceFeesSummaryResponse>>(
    `/finance/fees/summary${buildSearch({ month })}`
  ).then((response) => response.data)
}

export function getFinanceFeesTrend(months: number) {
  return webApiFetch<SuccessEnvelope<FinanceFeesTrendResponse>>(
    `/finance/fees/trend${buildSearch({ months })}`
  ).then((response) => response.data)
}

export function getFinanceFeesProgress(month?: string) {
  return webApiFetch<SuccessEnvelope<FinanceFeesProgressResponse>>(
    `/finance/fees/progress${buildSearch({ month })}`
  ).then((response) => response.data)
}

export function getFinanceFeesList(params: FinanceFeesListParams) {
  return webApiFetch<SuccessEnvelope<FinanceFeesListResponse>>(
    `/finance/fees${buildSearch(params)}`
  ).then((response) => response.data)
}
