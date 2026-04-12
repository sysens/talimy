import { Injectable } from "@nestjs/common"
import type {
  CreateFinanceExpenseInput,
  FinanceExpensesBreakdownQueryInput,
  FinanceExpensesListQueryInput,
  FinanceExpensesTrendQueryInput,
  FinanceReimbursementsQueryInput,
  FinanceReimbursementStatusUpdateInput,
} from "@talimy/shared"

import { FinanceExpensesRepository } from "./expenses.repository"

@Injectable()
export class FinanceExpensesService {
  constructor(private readonly repository: FinanceExpensesRepository) {}

  getTrend(query: FinanceExpensesTrendQueryInput) {
    return this.repository.getTrend(query)
  }

  getBreakdown(query: FinanceExpensesBreakdownQueryInput) {
    return this.repository.getBreakdown(query)
  }

  listReimbursements(query: FinanceReimbursementsQueryInput) {
    return this.repository.listReimbursements(query)
  }

  updateReimbursementStatus(
    tenantId: string,
    reimbursementId: string,
    payload: FinanceReimbursementStatusUpdateInput
  ) {
    return this.repository.updateReimbursementStatus(tenantId, reimbursementId, payload)
  }

  listExpenses(query: FinanceExpensesListQueryInput) {
    return this.repository.listExpenses(query)
  }

  createExpense(payload: CreateFinanceExpenseInput) {
    return this.repository.createExpense(payload)
  }
}
