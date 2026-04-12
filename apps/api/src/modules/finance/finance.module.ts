import { Module } from "@nestjs/common"

import { AuthModule } from "../auth/auth.module"
import { FinanceController } from "./finance.controller"
import { FinanceExpensesRepository } from "./expenses.repository"
import { FinanceExpensesService } from "./expenses.service"
import { FinanceFeesRepository } from "./fees.repository"
import { FinanceFeesService } from "./fees.service"
import { FinanceRepository } from "./finance.repository"
import { FinanceService } from "./finance.service"

@Module({
  imports: [AuthModule],
  controllers: [FinanceController],
  providers: [
    FinanceService,
    FinanceRepository,
    FinanceFeesService,
    FinanceFeesRepository,
    FinanceExpensesService,
    FinanceExpensesRepository,
  ],
  exports: [FinanceService, FinanceFeesService, FinanceExpensesService],
})
export class FinanceModule {}
