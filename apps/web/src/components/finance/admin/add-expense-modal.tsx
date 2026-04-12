"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@talimy/ui"
import { createFinanceExpenseFormSchema } from "@talimy/shared"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useTranslations } from "next-intl"
import { sileo } from "sileo"
import type { z } from "zod"

import { createFinanceExpense } from "@/components/finance/admin/finance-expenses-api"
import type { FinanceExpenseCategory } from "@/components/finance/admin/finance-expenses-api.types"
import { financeExpensesQueryKeys } from "@/components/finance/admin/finance-expenses-query-keys"

const DEPARTMENT_OPTIONS = [
  "Administration",
  "Arts",
  "Community",
  "Facilities",
  "Language",
  "Mathematics",
  "Operations",
  "Physical Education",
  "Science",
  "Social",
  "Student Affairs",
] as const

type AddExpenseModalProps = {
  month?: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

type AddExpenseFormInput = z.input<typeof createFinanceExpenseFormSchema>
type AddExpenseFormValues = z.output<typeof createFinanceExpenseFormSchema>

export function AddExpenseModal({ month, onOpenChange, open }: AddExpenseModalProps) {
  const t = useTranslations("adminFinanceExpenses.modal")
  const queryClient = useQueryClient()
  const form = useForm<AddExpenseFormInput, undefined, AddExpenseFormValues>({
    defaultValues: {
      amount: 0,
      category: "supplies",
      categoryLabel: "",
      department: "Mathematics",
      description: "",
      expenseDate: month ? `${month}-01` : undefined,
      quantity: "",
    },
    resolver: zodResolver(createFinanceExpenseFormSchema),
  })
  const selectedCategory = useWatch({ control: form.control, name: "category" })

  const createMutation = useMutation({
    mutationFn: createFinanceExpense,
    onError: () => {
      sileo.error({
        description: t("toasts.errorDescription"),
        title: t("toasts.errorTitle"),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: financeExpensesQueryKeys.all() })
      sileo.success({
        description: t("toasts.successDescription"),
        title: t("toasts.successTitle"),
      })
      form.reset({
        amount: 0,
        category: "supplies",
        categoryLabel: "",
        department: "Mathematics",
        description: "",
        expenseDate: month ? `${month}-01` : undefined,
        quantity: "",
      })
      onOpenChange(false)
    },
  })

  const categoryOptions: readonly { label: string; value: FinanceExpenseCategory }[] = [
    { label: t("categories.salaries"), value: "salaries" },
    { label: t("categories.supplies"), value: "supplies" },
    { label: t("categories.events"), value: "events" },
    { label: t("categories.maintenance"), value: "maintenance" },
    { label: t("categories.others"), value: "others" },
    { label: t("categories.custom"), value: "custom" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[24px] border-slate-100 p-0">
        <form
          className="space-y-6 p-6"
          onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold text-talimy-navy">
              {t("title")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="department"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="expense-department">{t("fields.departmentLabel")}</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue placeholder={t("fields.departmentPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENT_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error?.message ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="expense-category">{t("fields.categoryLabel")}</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue placeholder={t("fields.categoryPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error?.message ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>

          {selectedCategory === "custom" ? (
            <Controller
              control={form.control}
              name="categoryLabel"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="expense-category-label">{t("fields.categoryNameLabel")}</Label>
                  <Input
                    id="expense-category-label"
                    placeholder={t("fields.categoryNamePlaceholder")}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                  {fieldState.error?.message ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          ) : null}

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="expense-description">{t("fields.descriptionLabel")}</Label>
                <Textarea
                  id="expense-description"
                  placeholder={t("fields.descriptionPlaceholder")}
                  rows={4}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                />
                {fieldState.error?.message ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">{t("fields.amountLabel")}</Label>
                  <Input
                    id="expense-amount"
                    min="0"
                    placeholder={t("fields.amountPlaceholder")}
                    step="0.01"
                    type="number"
                    value={field.value === 0 ? "" : String(field.value)}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                  {fieldState.error?.message ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="expenseDate"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="expense-date">{t("fields.dateLabel")}</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                  {fieldState.error?.message ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("actions.cancel")}
            </Button>
            <Button
              className="bg-[var(--talimy-color-pink)] text-talimy-navy hover:bg-[var(--talimy-color-pink)]/90"
              disabled={createMutation.isPending}
              type="submit"
            >
              {createMutation.isPending ? t("actions.submitting") : t("actions.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
