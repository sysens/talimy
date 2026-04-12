"use client"

import { ExpensesTableCard } from "@/components/shared/finance/expenses-table-card"

const ROWS = [
  {
    amount: 750,
    categoryId: "supplies",
    categoryLabel: null,
    department: "Mathematics",
    description: "Graphing calculators",
    expenseCode: "EX-5001",
    expenseDate: "2035-03-01",
    id: "1",
    quantity: "15",
  },
  {
    amount: 1200,
    categoryId: "maintenance",
    categoryLabel: null,
    department: "Science",
    description: "Lab equipment servicing",
    expenseCode: "EX-5002",
    expenseDate: "2035-03-01",
    id: "2",
    quantity: "-",
  },
  {
    amount: 1000,
    categoryId: "supplies",
    categoryLabel: null,
    department: "Language",
    description: "English literature textbooks",
    expenseCode: "EX-5003",
    expenseDate: "2035-03-02",
    id: "3",
    quantity: "40",
  },
  {
    amount: 900,
    categoryId: "events",
    categoryLabel: null,
    department: "Social",
    description: "Field trip bus rental",
    expenseCode: "EX-5004",
    expenseDate: "2035-03-03",
    id: "4",
    quantity: "2 buses",
  },
  {
    amount: 600,
    categoryId: "supplies",
    categoryLabel: null,
    department: "Arts",
    description: "Paint sets & brushes",
    expenseCode: "EX-5005",
    expenseDate: "2035-03-03",
    id: "5",
    quantity: "25 sets",
  },
  {
    amount: 2500,
    categoryId: "maintenance",
    categoryLabel: null,
    department: "Physical Education",
    description: "Gym floor repairs",
    expenseCode: "EX-5006",
    expenseDate: "2035-03-04",
    id: "6",
    quantity: "-",
  },
  {
    amount: 5000,
    categoryId: "salaries",
    categoryLabel: null,
    department: "Mathematics",
    description: "Monthly teacher salary",
    expenseCode: "EX-5007",
    expenseDate: "2035-03-05",
    id: "7",
    quantity: "-",
  },
  {
    amount: 5000,
    categoryId: "salaries",
    categoryLabel: null,
    department: "Science",
    description: "Monthly teacher salary",
    expenseCode: "EX-5008",
    expenseDate: "2035-03-06",
    id: "8",
    quantity: "-",
  },
] as const

export function ExpensesTableCardShowcase() {
  return (
    <ExpensesTableCard
      columns={{
        amount: "Amount",
        category: "Category",
        date: "Date",
        department: "Department",
        description: "Description",
        quantity: "Quantity",
      }}
      emptyLabel="No expenses"
      filters={
        <div className="flex gap-3">
          <div className="rounded-[16px] bg-(--talimy-color-sky)/70 px-4 py-2 text-sm font-medium text-talimy-navy">
            All Categories
          </div>
          <div className="rounded-[16px] bg-(--talimy-color-sky)/70 px-4 py-2 text-sm font-medium text-talimy-navy">
            This Month
          </div>
        </div>
      }
      formatAmount={(value) => `$${value.toLocaleString()}`}
      formatDate={(value) =>
        new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(
          new Date(value)
        )
      }
      getCategoryLabel={(value) =>
        ({
          events: "Events",
          maintenance: "Maintenance",
          others: "Others",
          salaries: "Salaries",
          supplies: "Supplies",
          custom: "Custom",
        })[value] as string
      }
      getDepartmentLabel={(value) => value}
      rows={ROWS}
      title="Expenses"
    />
  )
}
