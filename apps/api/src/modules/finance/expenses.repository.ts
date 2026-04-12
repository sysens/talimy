import { Injectable } from "@nestjs/common"
import { db, financeExpenses, financeReimbursements } from "@talimy/database"
import type {
  CreateFinanceExpenseInput,
  FinanceExpensesBreakdownQueryInput,
  FinanceExpensesListQueryInput,
  FinanceExpensesTrendQueryInput,
  FinanceReimbursementsQueryInput,
  FinanceReimbursementStatusUpdateInput,
} from "@talimy/shared"
import { and, asc, desc, eq, gte, isNull, lt, sql } from "drizzle-orm"

import { FINANCE_EXPENSE_BREAKDOWN_CATEGORY_ORDER } from "./expenses.constants"
import type {
  FinanceExpenseBreakdownView,
  FinanceExpensesListView,
  FinanceExpenseTrendView,
  FinanceReimbursementsView,
} from "./expenses.types"
import {
  buildMonthEndExclusive,
  buildMonthStart,
  buildRecentMonthSeries,
  buildWeekRange,
  normalizeMonthValue,
  parseMoney,
  resolveExpenseCode,
  roundCurrency,
} from "./expenses.utils"

@Injectable()
export class FinanceExpensesRepository {
  async getTrend(query: FinanceExpensesTrendQueryInput): Promise<FinanceExpenseTrendView> {
    const monthSeries = buildRecentMonthSeries(query.months)
    const startMonth = monthSeries[0]
    const endMonth = monthSeries[monthSeries.length - 1]

    if (!startMonth || !endMonth) {
      return { months: query.months, points: [] }
    }

    const monthExpression = sql<string>`to_char(date_trunc('month', ${financeExpenses.expenseDate}::date), 'YYYY-MM')`
    const rows = await db
      .select({
        amount: sql<string>`coalesce(sum(${financeExpenses.amount}), 0)::text`,
        month: monthExpression,
      })
      .from(financeExpenses)
      .where(
        and(
          eq(financeExpenses.tenantId, query.tenantId),
          gte(financeExpenses.expenseDate, buildMonthStart(startMonth)),
          lt(financeExpenses.expenseDate, buildMonthEndExclusive(endMonth)),
          isNull(financeExpenses.deletedAt)
        )
      )
      .groupBy(monthExpression)
      .orderBy(asc(monthExpression))

    const amountByMonth = new Map(rows.map((row) => [row.month, parseMoney(row.amount)] as const))

    return {
      months: query.months,
      points: monthSeries.map((month) => ({
        amount: amountByMonth.get(month) ?? 0,
        month,
      })),
    }
  }

  async getBreakdown(
    query: FinanceExpensesBreakdownQueryInput
  ): Promise<FinanceExpenseBreakdownView> {
    const month = normalizeMonthValue(undefined)
    const rows = await db
      .select({
        amount: sql<string>`coalesce(sum(${financeExpenses.amount}), 0)::text`,
        categoryId: financeExpenses.category,
      })
      .from(financeExpenses)
      .where(
        and(
          eq(financeExpenses.tenantId, query.tenantId),
          gte(financeExpenses.expenseDate, buildMonthStart(month)),
          lt(financeExpenses.expenseDate, buildMonthEndExclusive(month)),
          isNull(financeExpenses.deletedAt)
        )
      )
      .groupBy(financeExpenses.category)

    const amountByCategory = new Map(
      rows.map((row) => [row.categoryId, parseMoney(row.amount)] as const)
    )
    const totalAmount = roundCurrency(
      FINANCE_EXPENSE_BREAKDOWN_CATEGORY_ORDER.reduce(
        (sum, categoryId) => sum + (amountByCategory.get(categoryId) ?? 0),
        0
      )
    )

    return {
      items: FINANCE_EXPENSE_BREAKDOWN_CATEGORY_ORDER.map((categoryId) => {
        const amount = roundCurrency(amountByCategory.get(categoryId) ?? 0)
        const percentage = totalAmount > 0 ? roundCurrency((amount / totalAmount) * 100) : 0

        return {
          amount,
          categoryId,
          percentage,
        }
      }),
      totalAmount,
    }
  }

  async listReimbursements(
    query: FinanceReimbursementsQueryInput
  ): Promise<FinanceReimbursementsView> {
    const weekRange = buildWeekRange(new Date(), query.week)
    const rows = await db
      .select({
        amount: financeReimbursements.amount,
        department: financeReimbursements.department,
        id: financeReimbursements.id,
        proofLabel: financeReimbursements.proofLabel,
        proofUrl: financeReimbursements.proofUrl,
        purpose: financeReimbursements.purpose,
        requestCode: financeReimbursements.requestCode,
        staffName: financeReimbursements.staffName,
        status: financeReimbursements.status,
        submittedDate: financeReimbursements.submittedDate,
      })
      .from(financeReimbursements)
      .where(
        and(
          eq(financeReimbursements.tenantId, query.tenantId),
          gte(financeReimbursements.submittedDate, weekRange.start),
          lt(financeReimbursements.submittedDate, weekRange.endExclusive),
          isNull(financeReimbursements.deletedAt)
        )
      )
      .orderBy(asc(financeReimbursements.submittedDate), asc(financeReimbursements.requestCode))

    return {
      rows: rows.map((row) => ({
        amount: parseMoney(row.amount),
        department: row.department,
        id: row.id,
        proofLabel: row.proofLabel,
        proofUrl: row.proofUrl,
        purpose: row.purpose,
        requestCode: row.requestCode,
        staffName: row.staffName,
        status: row.status,
        submittedDate: row.submittedDate,
      })),
      week: query.week,
    }
  }

  async updateReimbursementStatus(
    tenantId: string,
    reimbursementId: string,
    payload: FinanceReimbursementStatusUpdateInput
  ): Promise<void> {
    await db
      .update(financeReimbursements)
      .set({
        status: payload.status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(financeReimbursements.tenantId, tenantId),
          eq(financeReimbursements.id, reimbursementId),
          isNull(financeReimbursements.deletedAt)
        )
      )
  }

  async listExpenses(query: FinanceExpensesListQueryInput): Promise<FinanceExpensesListView> {
    const month = normalizeMonthValue(query.month)
    const filters = [
      eq(financeExpenses.tenantId, query.tenantId),
      gte(financeExpenses.expenseDate, buildMonthStart(month)),
      lt(financeExpenses.expenseDate, buildMonthEndExclusive(month)),
      isNull(financeExpenses.deletedAt),
    ]

    if (query.category !== "all") {
      filters.push(eq(financeExpenses.category, query.category))
    }

    const [countRows, rows] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(financeExpenses)
        .where(and(...filters)),
      db
        .select({
          amount: financeExpenses.amount,
          categoryId: financeExpenses.category,
          categoryLabel: financeExpenses.categoryLabel,
          department: financeExpenses.department,
          description: financeExpenses.description,
          expenseCode: financeExpenses.expenseCode,
          expenseDate: financeExpenses.expenseDate,
          id: financeExpenses.id,
          quantity: financeExpenses.quantity,
        })
        .from(financeExpenses)
        .where(and(...filters))
        .orderBy(asc(financeExpenses.expenseDate), asc(financeExpenses.expenseCode))
        .limit(query.limit)
        .offset((query.page - 1) * query.limit),
    ])

    const total = typeof countRows[0]?.count === "number" ? countRows[0].count : 0
    const totalPages = Math.max(1, Math.ceil(total / query.limit))
    const page = Math.min(query.page, totalPages)

    return {
      meta: {
        limit: query.limit,
        page,
        total,
        totalPages,
      },
      month,
      rows: rows.map((row) => ({
        amount: parseMoney(row.amount),
        categoryId: row.categoryId,
        categoryLabel: row.categoryLabel,
        department: row.department,
        description: row.description,
        expenseCode: row.expenseCode,
        expenseDate: row.expenseDate,
        id: row.id,
        quantity: row.quantity,
      })),
    }
  }

  async createExpense(payload: CreateFinanceExpenseInput) {
    const latest = await db
      .select({ expenseCode: financeExpenses.expenseCode })
      .from(financeExpenses)
      .where(and(eq(financeExpenses.tenantId, payload.tenantId), isNull(financeExpenses.deletedAt)))
      .orderBy(desc(financeExpenses.expenseCode))
      .limit(1)

    const latestCode = latest[0]?.expenseCode
    const latestSequence =
      typeof latestCode === "string" ? Number(latestCode.replace(/^EX-/, "")) : 5000
    const nextExpenseCode = resolveExpenseCode(
      Number.isFinite(latestSequence) ? latestSequence + 1 : 5001
    )
    const expenseDate = payload.expenseDate ?? new Date().toISOString().slice(0, 10)

    const createdRows = await db
      .insert(financeExpenses)
      .values({
        amount: String(payload.amount),
        category: payload.category,
        categoryLabel: payload.category === "custom" ? (payload.categoryLabel ?? null) : null,
        department: payload.department,
        description: payload.description,
        expenseCode: nextExpenseCode,
        expenseDate,
        quantity: payload.quantity ?? null,
        tenantId: payload.tenantId,
      })
      .returning({
        amount: financeExpenses.amount,
        categoryId: financeExpenses.category,
        categoryLabel: financeExpenses.categoryLabel,
        department: financeExpenses.department,
        description: financeExpenses.description,
        expenseCode: financeExpenses.expenseCode,
        expenseDate: financeExpenses.expenseDate,
        id: financeExpenses.id,
        quantity: financeExpenses.quantity,
      })

    const created = createdRows[0]
    if (!created) {
      throw new Error("Failed to create finance expense record")
    }

    return {
      amount: parseMoney(created.amount),
      categoryId: created.categoryId,
      categoryLabel: created.categoryLabel,
      department: created.department,
      description: created.description,
      expenseCode: created.expenseCode,
      expenseDate: created.expenseDate,
      id: created.id,
      quantity: created.quantity,
    }
  }
}
