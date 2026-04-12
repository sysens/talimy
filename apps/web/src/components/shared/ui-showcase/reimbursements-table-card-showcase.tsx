"use client"

import { ReimbursementsTableCard } from "@/components/shared/finance/reimbursements-table-card"

const ROWS = [
  {
    amount: 120,
    department: "Mathematics",
    id: "1",
    proofLabel: "View File",
    proofUrl: null,
    purpose: "Books Purchase",
    requestCode: "RQ-3001",
    staffName: "Argen Maulie",
    status: "approved",
    submittedDate: "2035-03-02",
  },
  {
    amount: 250,
    department: "Science",
    id: "2",
    proofLabel: "View File",
    proofUrl: null,
    purpose: "Lab Equipment",
    requestCode: "RQ-3002",
    staffName: "Bella Cruz",
    status: "declined",
    submittedDate: "2035-03-03",
  },
  {
    amount: 180,
    department: "Physical Ed.",
    id: "3",
    proofLabel: "View File",
    proofUrl: null,
    purpose: "Sports Supplies",
    requestCode: "RQ-3003",
    staffName: "Francesca Gill",
    status: "approved",
    submittedDate: "2035-03-05",
  },
  {
    amount: 300,
    department: "Social Studies",
    id: "4",
    proofLabel: "View File",
    proofUrl: null,
    purpose: "Seminar Travel",
    requestCode: "RQ-3004",
    staffName: "Dariah Ahmed",
    status: "pending",
    submittedDate: "2035-03-06",
  },
  {
    amount: 90,
    department: "Arts",
    id: "5",
    proofLabel: "View File",
    proofUrl: null,
    purpose: "Art Materials",
    requestCode: "RQ-3005",
    staffName: "Esteban Perez",
    status: "pending",
    submittedDate: "2035-03-08",
  },
] as const

export function ReimbursementsTableCardShowcase() {
  return (
    <ReimbursementsTableCard
      actionLabels={{ approve: "Approve", decline: "Decline", viewFile: "View File" }}
      columns={{
        amount: "Amount",
        datePaid: "Date Paid",
        proof: "Proof",
        requestName: "Request Name",
        staffName: "Staff Name",
        status: "Status",
      }}
      emptyLabel="No reimbursements"
      filters={
        <div className="rounded-[16px] bg-(--talimy-color-sky)/70 px-4 py-2 text-sm font-medium text-talimy-navy">
          This Week
        </div>
      }
      formatCurrency={(value) => `$${value.toLocaleString()}`}
      formatDate={(value) =>
        new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(
          new Date(value)
        )
      }
      getDepartmentLabel={(value) => value}
      getStatusLabel={(status) => (status === "approved" ? "Approved" : "Declined")}
      onStatusChange={() => undefined}
      rows={ROWS}
      title="Reimbursements Tracking"
    />
  )
}
