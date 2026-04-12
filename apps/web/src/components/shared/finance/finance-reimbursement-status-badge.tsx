import type { FinanceReimbursementStatus } from "@/components/finance/admin/finance-expenses-api.types"

type FinanceReimbursementStatusBadgeProps = {
  label: string
  status: Exclude<FinanceReimbursementStatus, "pending">
}

const STATUS_CLASS_NAMES: Record<Exclude<FinanceReimbursementStatus, "pending">, string> = {
  approved: "bg-[#dff8ef] text-[#39c7a5]",
  declined: "bg-[#ffe6e6] text-[#ff5a5f]",
}

export function FinanceReimbursementStatusBadge({
  label,
  status,
}: FinanceReimbursementStatusBadgeProps) {
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
