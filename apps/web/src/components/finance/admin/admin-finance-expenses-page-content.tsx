import { AdminFinanceExpenseBreakdownSection } from "@/components/finance/admin/admin-finance-expense-breakdown-section"
import { AdminFinanceExpenseTrendSection } from "@/components/finance/admin/admin-finance-expense-trend-section"
import { AdminFinanceExpensesTableSection } from "@/components/finance/admin/admin-finance-expenses-table-section"
import { AdminFinanceReimbursementsSection } from "@/components/finance/admin/admin-finance-reimbursements-section"

export function AdminFinanceExpensesPageContent() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[500px_minmax(0,1fr)] xl:items-start">
        <div className="min-w-0 space-y-4">
          <AdminFinanceExpenseTrendSection />
          <AdminFinanceExpenseBreakdownSection />
        </div>
        <div className="min-w-0">
          <AdminFinanceReimbursementsSection />
        </div>
      </section>

      <AdminFinanceExpensesTableSection />
    </div>
  )
}
