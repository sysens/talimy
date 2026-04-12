import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import {
  createFeeStructureSchema,
  createFinanceExpenseSchema,
  createInvoiceSchema,
  createPaymentPlanSchema,
  createPaymentSchema,
  financeExpensesBreakdownQuerySchema,
  financeExpensesListQuerySchema,
  financeExpensesTrendQuerySchema,
  financeFeesListQuerySchema,
  financeFeesProgressQuerySchema,
  financeFeesSummaryQuerySchema,
  financeFeesTrendQuerySchema,
  financeReimbursementsQuerySchema,
  financeReimbursementStatusUpdateSchema,
  type CreateFinanceExpenseInput,
  type FinanceExpensesBreakdownQueryInput,
  type FinanceExpensesListQueryInput,
  type FinanceExpensesTrendQueryInput,
  type FinanceFeesListQueryInput,
  type FinanceFeesProgressQueryInput,
  type FinanceFeesSummaryQueryInput,
  type FinanceFeesTrendQueryInput,
  type FinanceReimbursementsQueryInput,
  type FinanceReimbursementStatusUpdateInput,
  updateFeeStructureSchema,
  updatePaymentPlanSchema,
  updatePaymentSchema,
  userTenantQuerySchema,
} from "@talimy/shared"
import { z } from "zod"

import { Roles } from "@/common/decorators/roles.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { FinanceFeesService } from "./fees.service"
import { FinanceExpensesService } from "./expenses.service"
import { FinanceService } from "./finance.service"
import { CreateFeeStructureDto, UpdateFeeStructureDto } from "./dto/fee-structure.dto"
import { CreateInvoiceDto } from "./dto/create-invoice.dto"
import { CreatePaymentDto, UpdatePaymentDto } from "./dto/create-payment.dto"
import { CacheService } from "../cache/cache.service"
import {
  CACHE_TTLS,
  financeCachePrefix,
  financeOverviewCacheKey,
  financePaymentsSummaryCacheKey,
} from "../cache/cache.keys"
import { CreatePaymentPlanDto, UpdatePaymentPlanDto } from "./dto/payment-plan.dto"

@Controller("finance")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Roles("platform_admin", "school_admin")
export class FinanceController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly financeFeesService: FinanceFeesService,
    private readonly financeExpensesService: FinanceExpensesService,
    private readonly cacheService: CacheService
  ) {}
  private static readonly idParamSchema = z.object({ id: z.string().uuid() })

  @Get("overview")
  getOverview(@Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown) {
    const query = queryInput as { tenantId: string }
    return this.cacheService.wrapJson(
      financeOverviewCacheKey(query.tenantId),
      CACHE_TTLS.financeOverviewSeconds,
      () => this.financeService.getOverview(query.tenantId)
    )
  }

  @Get("payments/summary")
  getPaymentsSummary(@Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown) {
    const query = queryInput as { tenantId: string }
    return this.cacheService.wrapJson(
      financePaymentsSummaryCacheKey(query.tenantId),
      CACHE_TTLS.financePaymentsSummarySeconds,
      () => this.financeService.getPaymentsSummary(query.tenantId)
    )
  }

  @Get("fees/summary")
  getFeesSummary(
    @Query(new ZodValidationPipe(financeFeesSummaryQuerySchema))
    query: FinanceFeesSummaryQueryInput
  ) {
    return this.financeFeesService.getSummary(query)
  }

  @Get("fees/trend")
  getFeesTrend(
    @Query(new ZodValidationPipe(financeFeesTrendQuerySchema))
    query: FinanceFeesTrendQueryInput
  ) {
    return this.financeFeesService.getTrend(query)
  }

  @Get("fees/progress")
  getFeesProgress(
    @Query(new ZodValidationPipe(financeFeesProgressQuerySchema))
    query: FinanceFeesProgressQueryInput
  ) {
    return this.financeFeesService.getProgress(query)
  }

  @Get("fees")
  listFees(
    @Query(new ZodValidationPipe(financeFeesListQuerySchema))
    query: FinanceFeesListQueryInput
  ) {
    return this.financeFeesService.list(query)
  }

  @Get("expenses/trend")
  getExpensesTrend(
    @Query(new ZodValidationPipe(financeExpensesTrendQuerySchema))
    query: FinanceExpensesTrendQueryInput
  ) {
    return this.financeExpensesService.getTrend(query)
  }

  @Get("expenses/breakdown")
  getExpensesBreakdown(
    @Query(new ZodValidationPipe(financeExpensesBreakdownQuerySchema))
    query: FinanceExpensesBreakdownQueryInput
  ) {
    return this.financeExpensesService.getBreakdown(query)
  }

  @Get("reimbursements")
  listReimbursements(
    @Query(new ZodValidationPipe(financeReimbursementsQuerySchema))
    query: FinanceReimbursementsQueryInput
  ) {
    return this.financeExpensesService.listReimbursements(query)
  }

  @Patch("reimbursements/:id/status")
  updateReimbursementStatus(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: { tenantId: string },
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) params: { id: string },
    @Body(new ZodValidationPipe(financeReimbursementStatusUpdateSchema))
    payload: FinanceReimbursementStatusUpdateInput
  ) {
    return this.financeExpensesService.updateReimbursementStatus(query.tenantId, params.id, payload)
  }

  @Get("expenses")
  listExpenses(
    @Query(new ZodValidationPipe(financeExpensesListQuerySchema))
    query: FinanceExpensesListQueryInput
  ) {
    return this.financeExpensesService.listExpenses(query)
  }

  @Post("expenses")
  createExpense(
    @Body(new ZodValidationPipe(createFinanceExpenseSchema)) payload: CreateFinanceExpenseInput
  ) {
    return this.financeExpensesService.createExpense(payload).then(async (created) => {
      await this.invalidateFinanceCache(payload.tenantId)
      return created
    })
  }

  @Get("fee-structures")
  listFeeStructures(@Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown) {
    const query = queryInput as { tenantId: string }
    return this.financeService.listFeeStructures(query.tenantId)
  }

  @Get("fee-structures/:id")
  getFeeStructureById(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) paramsInput: unknown
  ) {
    const params = paramsInput as { id: string }
    const query = queryInput as { tenantId: string }
    return this.financeService.getFeeStructureById(query.tenantId, params.id)
  }

  @Post("fee-structures")
  @Roles("platform_admin", "school_admin")
  createFeeStructure(@Body(new ZodValidationPipe(createFeeStructureSchema)) payloadInput: unknown) {
    const payload = payloadInput as CreateFeeStructureDto
    return this.financeService.createFeeStructure(payload).then(async (created) => {
      await this.invalidateFinanceCache(payload.tenantId)
      return created
    })
  }

  @Patch("fee-structures/:id")
  @Roles("platform_admin", "school_admin")
  updateFeeStructure(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) paramsInput: unknown,
    @Body(new ZodValidationPipe(updateFeeStructureSchema)) payloadInput: unknown
  ) {
    const params = paramsInput as { id: string }
    const query = queryInput as { tenantId: string }
    const payload = payloadInput as UpdateFeeStructureDto
    return this.financeService
      .updateFeeStructure(query.tenantId, params.id, payload)
      .then(async (updated) => {
        await this.invalidateFinanceCache(query.tenantId)
        return updated
      })
  }

  @Delete("fee-structures/:id")
  @Roles("platform_admin", "school_admin")
  deleteFeeStructure(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) paramsInput: unknown
  ) {
    const params = paramsInput as { id: string }
    const query = queryInput as { tenantId: string }
    return this.financeService
      .deleteFeeStructure(query.tenantId, params.id)
      .then(async (result) => {
        await this.invalidateFinanceCache(query.tenantId)
        return result
      })
  }

  @Get("payment-plans")
  listPaymentPlans(@Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown) {
    const query = queryInput as { tenantId: string }
    return this.financeService.listPaymentPlans(query.tenantId)
  }

  @Post("payment-plans")
  @Roles("platform_admin", "school_admin")
  createPaymentPlan(@Body(new ZodValidationPipe(createPaymentPlanSchema)) payloadInput: unknown) {
    const payload = payloadInput as CreatePaymentPlanDto
    return this.financeService.createPaymentPlan(payload).then(async (created) => {
      await this.invalidateFinanceCache(payload.tenantId)
      return created
    })
  }

  @Patch("payment-plans/:id")
  @Roles("platform_admin", "school_admin")
  updatePaymentPlan(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) paramsInput: unknown,
    @Body(new ZodValidationPipe(updatePaymentPlanSchema)) payloadInput: unknown
  ) {
    const params = paramsInput as { id: string }
    const query = queryInput as { tenantId: string }
    const payload = payloadInput as UpdatePaymentPlanDto
    return this.financeService
      .updatePaymentPlan(query.tenantId, params.id, payload)
      .then(async (updated) => {
        await this.invalidateFinanceCache(query.tenantId)
        return updated
      })
  }

  @Delete("payment-plans/:id")
  @Roles("platform_admin", "school_admin")
  deletePaymentPlan(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) paramsInput: unknown
  ) {
    const params = paramsInput as { id: string }
    const query = queryInput as { tenantId: string }
    return this.financeService.deletePaymentPlan(query.tenantId, params.id).then(async (result) => {
      await this.invalidateFinanceCache(query.tenantId)
      return result
    })
  }

  @Get("payments")
  listPayments(@Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown) {
    const query = queryInput as { tenantId: string }
    return this.financeService.listPayments(query.tenantId)
  }

  @Post("payments")
  @Roles("platform_admin", "school_admin")
  createPayment(@Body(new ZodValidationPipe(createPaymentSchema)) payloadInput: unknown) {
    const payload = payloadInput as CreatePaymentDto
    return this.financeService.createPayment(payload).then(async (created) => {
      await this.invalidateFinanceCache(payload.tenantId)
      return created
    })
  }

  @Patch("payments/:id")
  @Roles("platform_admin", "school_admin")
  updatePayment(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Param(new ZodValidationPipe(FinanceController.idParamSchema)) paramsInput: unknown,
    @Body(new ZodValidationPipe(updatePaymentSchema)) payloadInput: unknown
  ) {
    const params = paramsInput as { id: string }
    const query = queryInput as { tenantId: string }
    const payload = payloadInput as UpdatePaymentDto
    return this.financeService
      .updatePayment(query.tenantId, params.id, payload)
      .then(async (updated) => {
        await this.invalidateFinanceCache(query.tenantId)
        return updated
      })
  }

  @Get("invoices")
  listInvoices(@Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown) {
    const query = queryInput as { tenantId: string }
    return this.financeService.listInvoices(query.tenantId)
  }

  @Post("invoices")
  @Roles("platform_admin", "school_admin")
  createInvoice(@Body(new ZodValidationPipe(createInvoiceSchema)) payloadInput: unknown) {
    const payload = payloadInput as CreateInvoiceDto
    return this.financeService.createInvoice(payload).then(async (created) => {
      await this.invalidateFinanceCache(payload.tenantId)
      return created
    })
  }

  private async invalidateFinanceCache(tenantId: string): Promise<void> {
    await this.cacheService.delByPrefix(financeCachePrefix(tenantId))
  }
}
