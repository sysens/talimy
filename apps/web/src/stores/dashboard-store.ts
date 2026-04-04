import { create } from "zustand"

import type {
  DashboardGradeFilter,
  DashboardPeriodFilters,
} from "@/components/dashboard/admin/dashboard.types"

type DashboardStoreState = {
  activeGradeFilter: DashboardGradeFilter
  activePeriodFilters: DashboardPeriodFilters
  selectedDate: string
  setActiveGradeFilter: (value: DashboardGradeFilter) => void
  setPeriodFilter: <TKey extends keyof DashboardPeriodFilters>(
    key: TKey,
    value: DashboardPeriodFilters[TKey]
  ) => void
  setSelectedDate: (value: string) => void
}

const DEFAULT_PERIOD_FILTERS: DashboardPeriodFilters = {
  earnings: "lastYear",
  studentAttendance: "weekly",
  studentPerformance: "lastSemester",
}

function getDefaultSelectedDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  activeGradeFilter: "grade9",
  activePeriodFilters: DEFAULT_PERIOD_FILTERS,
  selectedDate: getDefaultSelectedDate(),
  setActiveGradeFilter: (value) => set({ activeGradeFilter: value }),
  setPeriodFilter: (key, value) =>
    set((state) => ({
      activePeriodFilters: {
        ...state.activePeriodFilters,
        [key]: value,
      },
    })),
  setSelectedDate: (value) => set({ selectedDate: value }),
}))
