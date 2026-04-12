import { AdminFinanceFeesProgressSection } from "@/components/finance/admin/admin-finance-fees-progress-section"
import { AdminFinanceFeesStatsColumn } from "@/components/finance/admin/admin-finance-fees-stats-column"
import { AdminFinanceFeesTableSection } from "@/components/finance/admin/admin-finance-fees-table-section"
import { AdminFinanceFeesTrendSection } from "@/components/finance/admin/admin-finance-fees-trend-section"

export function AdminFinancePaymentsPageContent() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[270px_minmax(0,1fr)_440px] xl:items-start">
        <div className="min-w-0">
          <AdminFinanceFeesStatsColumn />
        </div>
        <div className="min-w-0">
          <AdminFinanceFeesTrendSection />
        </div>
        <div className="min-w-0">
          <AdminFinanceFeesProgressSection />
        </div>
      </section>

      <AdminFinanceFeesTableSection />
    </div>
  )
}
