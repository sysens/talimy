"use client"

import * as React from "react"
import { ChevronDown, Filter, Plus, Search } from "lucide-react"
import {
  Button,
  ChartFilterSelect,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@talimy/ui"

import type {
  TeachersFilterBarProps,
  TeachersFilterOption,
  TeachersFilterState,
} from "@/components/teachers/list/teachers-filter-bar.types"

type FilterGroupKey = keyof TeachersFilterState

function FilterGroup({
  label,
  options,
  selectedValues,
  onToggle,
}: {
  label: string
  onToggle: (value: string) => void
  options: readonly TeachersFilterOption[]
  selectedValues: readonly string[]
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <div className="grid gap-2">
        {options.map((option) => {
          const checked = selectedValues.includes(option.value)

          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Checkbox checked={checked} onCheckedChange={() => onToggle(option.value)} />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function getNextValues(values: readonly string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function getActiveFilterCount(filters: TeachersFilterState): number {
  return filters.departments.length + filters.statuses.length + filters.genders.length
}

export function TeachersFilterBar({
  addTeacherLabel = "Add Teacher",
  applyFiltersLabel = "Apply",
  clearFiltersLabel = "Clear",
  departmentOptions,
  departmentLabel = "Department",
  filters,
  filterButtonLabel = "Filter",
  filterTitle = "Filter teachers",
  genderLabel = "Gender",
  genderOptions,
  onAddTeacher,
  onFiltersChange,
  onSearchChange,
  onSortChange,
  searchPlaceholder = "Search teacher",
  searchValue,
  statusLabel = "Status",
  sortOptions,
  sortValue,
  statusOptions,
}: TeachersFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [draftFilters, setDraftFilters] = React.useState<TeachersFilterState>(filters)

  React.useEffect(() => {
    if (!isFilterOpen) {
      setDraftFilters(filters)
    }
  }, [filters, isFilterOpen])

  const activeFilterCount = React.useMemo(() => getActiveFilterCount(filters), [filters])

  function toggleFilter(group: FilterGroupKey, value: string): void {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [group]: getNextValues(currentFilters[group], value),
    }))
  }

  function applyFilters(): void {
    onFiltersChange(draftFilters)
    setIsFilterOpen(false)
  }

  function clearFilters(): void {
    const clearedFilters: TeachersFilterState = {
      departments: [],
      genders: [],
      statuses: [],
    }

    setDraftFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    setIsFilterOpen(false)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-end gap-3 xl:flex-nowrap">
      <div className="relative w-full min-w-0 md:w-[220px] md:flex-none">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[15px] -translate-y-1/2 text-slate-400" />
        <Input
          className="h-11 rounded-[18px] border-0 bg-white pl-11 pr-4 text-sm text-slate-700 shadow-none placeholder:text-slate-400"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          type="search"
          value={searchValue}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Popover onOpenChange={setIsFilterOpen} open={isFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              className="h-11 rounded-[18px] bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy hover:bg-[var(--talimy-color-sky)]/80"
              type="button"
              variant="ghost"
            >
              <Filter className="size-[15px]" />
              <span>{filterButtonLabel}</span>
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-talimy-navy">
                  {activeFilterCount}
                </span>
              ) : null}
              <ChevronDown className="size-[15px]" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-[440px] rounded-[24px] border-slate-100 p-4">
            <PopoverHeader className="mb-1">
              <PopoverTitle className="text-sm font-semibold text-slate-700">
                {filterTitle}
              </PopoverTitle>
            </PopoverHeader>

            <div className="grid grid-cols-2 gap-5">
              <FilterGroup
                label={departmentLabel}
                onToggle={(value) => toggleFilter("departments", value)}
                options={departmentOptions}
                selectedValues={draftFilters.departments}
              />
              <FilterGroup
                label={statusLabel}
                onToggle={(value) => toggleFilter("statuses", value)}
                options={statusOptions}
                selectedValues={draftFilters.statuses}
              />
              <FilterGroup
                label={genderLabel}
                onToggle={(value) => toggleFilter("genders", value)}
                options={genderOptions}
                selectedValues={draftFilters.genders}
              />
            </div>

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button onClick={clearFilters} size="sm" type="button" variant="ghost">
                {clearFiltersLabel}
              </Button>
              <Button
                className="rounded-xl bg-talimy-navy text-white hover:bg-talimy-navy/90"
                onClick={applyFilters}
                size="sm"
                type="button"
              >
                {applyFiltersLabel}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <ChartFilterSelect
            ariaLabel="Sort teachers"
            onValueChange={onSortChange}
            options={[...sortOptions]}
            triggerClassName="h-11 min-w-[120px] rounded-[18px] bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy"
            value={sortValue}
          />
        </div>

        <Button
          className="h-11 rounded-[18px] bg-[var(--talimy-color-pink)]/70 px-5 text-sm font-semibold text-talimy-navy hover:bg-[var(--talimy-color-pink)]/85"
          onClick={onAddTeacher}
          type="button"
        >
          <Plus className="size-[15px]" />
          <span>{addTeacherLabel}</span>
        </Button>
      </div>
    </div>
  )
}
