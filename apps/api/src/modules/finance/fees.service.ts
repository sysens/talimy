import { Injectable } from "@nestjs/common"
import type {
  FinanceFeesListQueryInput,
  FinanceFeesProgressQueryInput,
  FinanceFeesSummaryQueryInput,
  FinanceFeesTrendQueryInput,
} from "@talimy/shared"

import { FinanceFeesRepository } from "./fees.repository"

@Injectable()
export class FinanceFeesService {
  constructor(private readonly repository: FinanceFeesRepository) {}

  getSummary(query: FinanceFeesSummaryQueryInput) {
    return this.repository.getSummary(query)
  }

  getProgress(query: FinanceFeesProgressQueryInput) {
    return this.repository.getProgress(query)
  }

  getTrend(query: FinanceFeesTrendQueryInput) {
    return this.repository.getTrend(query)
  }

  list(query: FinanceFeesListQueryInput) {
    return this.repository.list(query)
  }
}
