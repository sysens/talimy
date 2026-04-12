import { Injectable } from "@nestjs/common"
import {
  classes,
  db,
  feeStructures,
  payments,
  studentProfiles,
  students,
  users,
} from "@talimy/database"
import type {
  FinanceFeesListQueryInput,
  FinanceFeesProgressQueryInput,
  FinanceFeesSummaryQueryInput,
  FinanceFeesTrendQueryInput,
  FinanceFeeCategory,
  FinanceFeeStatus,
} from "@talimy/shared"
import { and, asc, desc, eq, gte, isNotNull, isNull, lt, sql } from "drizzle-orm"

import { DEFAULT_MONTHLY_FEE_TOTAL, FEE_CATEGORY_CONFIG } from "./fees.constants"
import type {
  FinanceFeesListView,
  FinanceFeesProgressView,
  FinanceFeesStudentGroupView,
  FinanceFeesSummaryView,
  FinanceFeesTrendView,
} from "./fees.types"
import {
  buildDueDate,
  buildMonthEndExclusive,
  buildMonthStart,
  buildMonthValue,
  buildRecentMonthSeries,
  clampCurrency,
  compareMonthValues,
  normalizeMonthValue,
  parseMoney,
  roundCurrency,
} from "./fees.utils"

type StudentFeeSource = {
  classId: string | null
  classLabel: string
  monthlyFeeTotal: number
  paidAmount: number
  studentCode: string
  studentId: string
  studentName: string
}

type StudentFeeItem = FinanceFeesStudentGroupView["items"][number] & {
  collectedAmount: number
}

@Injectable()
export class FinanceFeesRepository {
  async getSummary(query: FinanceFeesSummaryQueryInput): Promise<FinanceFeesSummaryView> {
    const month = normalizeMonthValue(query.month)
    const groups = await this.buildStudentFeeGroups(query.tenantId, month)
    const todayMonth = buildMonthValue(new Date())
    const todayDay = new Date().getUTCDate()

    const aggregated = groups
      .flatMap((group) => group.items)
      .reduce(
        (accumulator, item) => {
          accumulator.collected += item.collectedAmount

          const remainingAmount = roundCurrency(item.totalAmount - item.collectedAmount)
          if (remainingAmount <= 0) {
            return accumulator
          }

          const [_, __, dueDayText] = item.dueDate.split("-")
          const dueDay = Number(dueDayText)
          const isOverdue =
            compareMonthValues(month, todayMonth) < 0 ||
            (compareMonthValues(month, todayMonth) === 0 && dueDay < todayDay)

          if (isOverdue) {
            accumulator.overdue += remainingAmount
          } else {
            accumulator.pending += remainingAmount
          }

          return accumulator
        },
        { collected: 0, overdue: 0, pending: 0 }
      )

    return {
      amounts: {
        collected: roundCurrency(aggregated.collected),
        overdue: roundCurrency(aggregated.overdue),
        pending: roundCurrency(aggregated.pending),
      },
      month,
    }
  }

  async getProgress(query: FinanceFeesProgressQueryInput): Promise<FinanceFeesProgressView> {
    const month = normalizeMonthValue(query.month)
    const groups = await this.buildStudentFeeGroups(query.tenantId, month)

    const categoryTotals = new Map<
      FinanceFeeCategory,
      { collectedAmount: number; targetAmount: number }
    >()

    for (const config of FEE_CATEGORY_CONFIG) {
      categoryTotals.set(config.categoryId, { collectedAmount: 0, targetAmount: 0 })
    }

    for (const item of groups.flatMap((group) => group.items)) {
      const current = categoryTotals.get(item.categoryId)
      if (!current) {
        continue
      }

      current.collectedAmount = roundCurrency(current.collectedAmount + item.collectedAmount)
      current.targetAmount = roundCurrency(current.targetAmount + item.totalAmount)
    }

    return {
      categories: FEE_CATEGORY_CONFIG.map((config) => {
        const totals = categoryTotals.get(config.categoryId)
        const targetAmount = totals?.targetAmount ?? 0
        const collectedAmount = totals?.collectedAmount ?? 0
        const progressPercentage =
          targetAmount > 0 ? roundCurrency((collectedAmount / targetAmount) * 100) : 0

        return {
          categoryId: config.categoryId,
          collectedAmount,
          progressPercentage,
          targetAmount,
        }
      }),
      month,
    }
  }

  async getTrend(query: FinanceFeesTrendQueryInput): Promise<FinanceFeesTrendView> {
    const monthSeries = buildRecentMonthSeries(query.months)
    const startMonth = monthSeries[0]
    const endMonth = monthSeries[monthSeries.length - 1]

    if (!startMonth || !endMonth) {
      return { months: query.months, points: [] }
    }

    const startDate = buildMonthStart(startMonth)
    const endExclusiveDate = buildMonthEndExclusive(endMonth)

    const monthExpression = sql<string>`to_char(date_trunc('month', ${payments.date}::date), 'YYYY-MM')`

    const rows = await db
      .select({
        amount: sql<string>`coalesce(sum(case when ${payments.status} = 'paid' then ${payments.amount} else 0 end), 0)::text`,
        month: monthExpression,
      })
      .from(payments)
      .where(
        and(
          eq(payments.tenantId, query.tenantId),
          gte(payments.date, startDate),
          lt(payments.date, endExclusiveDate),
          isNull(payments.deletedAt)
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

  async list(query: FinanceFeesListQueryInput): Promise<FinanceFeesListView> {
    const month = normalizeMonthValue(query.month)
    const groups = await this.buildStudentFeeGroups(query.tenantId, month)

    const classOptions = this.buildClassOptions(groups)

    const filteredGroups = groups
      .filter((group) =>
        typeof query.classId === "string" ? group.classId === query.classId : true
      )
      .map((group) => ({
        ...group,
        items:
          query.status === "all"
            ? group.items
            : group.items.filter((item) => item.status === query.status),
      }))
      .filter((group) => group.items.length > 0)

    const total = filteredGroups.length
    const totalPages = Math.max(1, Math.ceil(total / query.limit))
    const page = Math.min(query.page, totalPages)
    const startIndex = (page - 1) * query.limit
    const rows = filteredGroups.slice(startIndex, startIndex + query.limit)

    return {
      classOptions,
      meta: {
        limit: query.limit,
        page,
        total,
        totalPages,
      },
      month,
      rows,
    }
  }

  private async buildStudentFeeGroups(
    tenantId: string,
    month: string
  ): Promise<
    ReadonlyArray<FinanceFeesStudentGroupView & { items: ReadonlyArray<StudentFeeItem> }>
  > {
    const [studentSources, classFeeMap, monthlyPaidMap] = await Promise.all([
      this.listStudentFeeSources(tenantId),
      this.getLatestClassFeeMap(tenantId),
      this.getMonthlyPaidAmountMap(tenantId, month),
    ])

    return studentSources.map((source) => {
      const totalFee =
        source.monthlyFeeTotal > 0
          ? source.monthlyFeeTotal
          : (classFeeMap.get(source.classId ?? "") ?? DEFAULT_MONTHLY_FEE_TOTAL)
      const paidAmount = clampCurrency(
        monthlyPaidMap.get(source.studentId) ?? source.paidAmount,
        0,
        totalFee
      )
      const items = this.buildStudentFeeItems(totalFee, paidAmount, month)

      return {
        classId: source.classId,
        classLabel: source.classLabel,
        items,
        studentCode: source.studentCode,
        studentId: source.studentId,
        studentName: source.studentName,
      }
    })
  }

  private buildStudentFeeItems(
    totalFee: number,
    paidAmount: number,
    month: string
  ): ReadonlyArray<StudentFeeItem> {
    let remainingPaidAmount = paidAmount
    let allocatedAmount = 0

    return FEE_CATEGORY_CONFIG.map((config, index) => {
      const isLast = index === FEE_CATEGORY_CONFIG.length - 1
      const totalAmount = isLast
        ? roundCurrency(totalFee - allocatedAmount)
        : roundCurrency(totalFee * config.share)

      allocatedAmount = roundCurrency(allocatedAmount + totalAmount)

      const collectedAmount = clampCurrency(remainingPaidAmount, 0, totalAmount)
      remainingPaidAmount = roundCurrency(Math.max(remainingPaidAmount - collectedAmount, 0))

      return {
        categoryId: config.categoryId,
        collectedAmount,
        dueDate: buildDueDate(month, config.dueDay),
        status: this.resolveFeeStatus(month, config.dueDay, totalAmount, collectedAmount),
        totalAmount,
      }
    })
  }

  private resolveFeeStatus(
    month: string,
    dueDay: number,
    totalAmount: number,
    collectedAmount: number
  ): FinanceFeeStatus {
    if (collectedAmount >= totalAmount) {
      return "paid"
    }

    if (collectedAmount > 0) {
      return "partially_paid"
    }

    const today = new Date()
    const todayMonth = buildMonthValue(today)
    const monthComparison = compareMonthValues(month, todayMonth)

    if (monthComparison < 0) {
      return "overdue"
    }

    if (monthComparison > 0) {
      return "pending"
    }

    return dueDay < today.getUTCDate() ? "overdue" : "pending"
  }

  private buildClassOptions(
    groups: ReadonlyArray<Pick<FinanceFeesStudentGroupView, "classId" | "classLabel">>
  ): ReadonlyArray<{ id: string; label: string }> {
    const classMap = new Map<string, string>()

    for (const group of groups) {
      if (
        typeof group.classId === "string" &&
        group.classId.length > 0 &&
        !classMap.has(group.classId)
      ) {
        classMap.set(group.classId, group.classLabel)
      }
    }

    return Array.from(classMap.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((left, right) => left.label.localeCompare(right.label))
  }

  private async listStudentFeeSources(tenantId: string): Promise<ReadonlyArray<StudentFeeSource>> {
    const rows = await db
      .select({
        classId: classes.id,
        classLabel: classes.name,
        firstName: users.firstName,
        lastName: users.lastName,
        paidAmount: studentProfiles.paidAmount,
        studentCode: students.studentId,
        studentId: students.id,
        totalFee: studentProfiles.totalFee,
      })
      .from(students)
      .innerJoin(users, and(eq(users.id, students.userId), isNull(users.deletedAt)))
      .leftJoin(classes, and(eq(classes.id, students.classId), isNull(classes.deletedAt)))
      .leftJoin(
        studentProfiles,
        and(eq(studentProfiles.studentId, students.id), isNull(studentProfiles.deletedAt))
      )
      .where(
        and(
          eq(students.tenantId, tenantId),
          eq(students.status, "active"),
          isNull(students.deletedAt)
        )
      )
      .orderBy(asc(users.firstName), asc(users.lastName))

    return rows.map((row) => ({
      classId: row.classId,
      classLabel: row.classLabel ?? "—",
      monthlyFeeTotal: parseMoney(row.totalFee),
      paidAmount: parseMoney(row.paidAmount),
      studentCode: row.studentCode,
      studentId: row.studentId,
      studentName: `${row.firstName} ${row.lastName}`,
    }))
  }

  private async getLatestClassFeeMap(tenantId: string): Promise<ReadonlyMap<string, number>> {
    const rows = await db
      .select({
        amount: feeStructures.amount,
        classId: feeStructures.classId,
      })
      .from(feeStructures)
      .where(
        and(
          eq(feeStructures.tenantId, tenantId),
          isNotNull(feeStructures.classId),
          isNull(feeStructures.deletedAt)
        )
      )
      .orderBy(desc(feeStructures.createdAt))

    const feeMap = new Map<string, number>()

    for (const row of rows) {
      if (typeof row.classId === "string" && !feeMap.has(row.classId)) {
        feeMap.set(row.classId, parseMoney(row.amount))
      }
    }

    return feeMap
  }

  private async getMonthlyPaidAmountMap(
    tenantId: string,
    month: string
  ): Promise<ReadonlyMap<string, number>> {
    const startDate = buildMonthStart(month)
    const endExclusiveDate = buildMonthEndExclusive(month)

    const rows = await db
      .select({
        paidAmount: sql<string>`coalesce(sum(case when ${payments.status} = 'paid' then ${payments.amount} else 0 end), 0)::text`,
        studentId: payments.studentId,
      })
      .from(payments)
      .where(
        and(
          eq(payments.tenantId, tenantId),
          gte(payments.date, startDate),
          lt(payments.date, endExclusiveDate),
          isNull(payments.deletedAt)
        )
      )
      .groupBy(payments.studentId)

    return new Map(rows.map((row) => [row.studentId, parseMoney(row.paidAmount)] as const))
  }
}
