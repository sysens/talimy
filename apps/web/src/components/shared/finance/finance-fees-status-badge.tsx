import type { FinanceFeeStatus } from "@/components/finance/admin/finance-fees-api.types"

type FinanceFeesStatusBadgeProps = {
  label: string
  status: FinanceFeeStatus
}

const STATUS_CLASS_NAMES: Record<FinanceFeeStatus, string> = {
  overdue: "bg-[#ffe6e6] text-[#ff5a5f]",
  paid: "bg-[#dff8ef] text-[#39c7a5]",
  partially_paid: "bg-[#dff1fb] text-[#5fa9d6]",
  pending: "bg-[#f6d6ff] text-[#cf68e2]",
}

export function FinanceFeesStatusBadge({ label, status }: FinanceFeesStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-7 items-center rounded-full px-3 text-[11px] font-medium whitespace-nowrap",
        STATUS_CLASS_NAMES[status],
      ].join(" ")}
    >
      {label}
    </span>
  )
}
