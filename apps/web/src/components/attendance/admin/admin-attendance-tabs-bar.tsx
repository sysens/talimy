"use client"

import { ChartFilterSelect, Tabs, TabsList, TabsTrigger } from "@talimy/ui"

import type { AdminAttendanceEntityType } from "@/components/attendance/admin/admin-attendance-api.types"

type FilterOption = {
  label: string
  value: string
}

type AdminAttendanceTabsBarProps = {
  activeType: AdminAttendanceEntityType
  classOptions: readonly FilterOption[]
  departmentOptions: readonly FilterOption[]
  monthOptions: readonly FilterOption[]
  monthValue: string
  onClassChange: (value: string) => void
  onDepartmentChange: (value: string) => void
  onMonthChange: (value: string) => void
  onTypeChange: (value: AdminAttendanceEntityType) => void
  selectedClassId?: string
  selectedDepartment?: string
  tabLabels: Record<AdminAttendanceEntityType, string>
}

export function AdminAttendanceTabsBar({
  activeType,
  classOptions,
  departmentOptions,
  monthOptions,
  monthValue,
  onClassChange,
  onDepartmentChange,
  onMonthChange,
  onTypeChange,
  selectedClassId,
  selectedDepartment,
  tabLabels,
}: AdminAttendanceTabsBarProps) {
  const showClassFilter = activeType === "students" && classOptions.length > 0
  const showDepartmentFilter = activeType === "teachers" && departmentOptions.length > 0

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <Tabs
        value={activeType}
        onValueChange={(value) => onTypeChange(value as AdminAttendanceEntityType)}
      >
        <TabsList className="h-11 rounded-[18px] bg-slate-100 p-1">
          <TabsTrigger className="rounded-[14px] px-4 text-sm font-semibold" value="students">
            {tabLabels.students}
          </TabsTrigger>
          <TabsTrigger className="rounded-[14px] px-4 text-sm font-semibold" value="teachers">
            {tabLabels.teachers}
          </TabsTrigger>
          <TabsTrigger className="rounded-[14px] px-4 text-sm font-semibold" value="staff">
            {tabLabels.staff}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        {showClassFilter ? (
          <ChartFilterSelect
            ariaLabel={tabLabels.students}
            onValueChange={onClassChange}
            options={[...classOptions]}
            triggerClassName="h-11 min-w-[132px] rounded-[18px] bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy"
            value={selectedClassId}
          />
        ) : null}

        {showDepartmentFilter ? (
          <ChartFilterSelect
            ariaLabel={tabLabels.teachers}
            onValueChange={onDepartmentChange}
            options={[...departmentOptions]}
            triggerClassName="h-11 min-w-[168px] rounded-[18px] bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy"
            value={selectedDepartment}
          />
        ) : null}

        <ChartFilterSelect
          ariaLabel="Attendance month"
          onValueChange={onMonthChange}
          options={[...monthOptions]}
          triggerClassName="h-11 min-w-[142px] rounded-[18px] bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy"
          value={monthValue}
        />
      </div>
    </div>
  )
}
