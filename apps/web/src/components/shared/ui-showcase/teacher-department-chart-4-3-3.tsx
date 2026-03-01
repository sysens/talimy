"use client"

import { ChartRadialStacked } from "@talimy/ui"

const DEPARTMENT_SEGMENTS = [
  { color: "var(--talimy-color-navy)", key: "science", label: "Science", value: 22 },
  { color: "var(--talimy-color-sky)", key: "mathematics", label: "Mathematics", value: 20 },
  { color: "var(--talimy-color-pink)", key: "language", label: "Language", value: 18 },
  { color: "#FCEBFD", key: "social", label: "Social", value: 15 },
  { color: "#B2B4B3", key: "arts", label: "Arts", value: 13 },
  { color: "#DCDEDD", key: "physicalEducation", label: "Physical Education", value: 12 },
] as const

const DEPARTMENT_STATS = [
  { color: "var(--talimy-color-navy)", count: 19, label: "Science", percent: "22%" },
  { color: "var(--talimy-color-sky)", count: 17, label: "Mathematics", percent: "20%" },
  { color: "var(--talimy-color-pink)", count: 15, label: "Language", percent: "18%" },
  { color: "#FCEBFD", count: 13, label: "Social", percent: "15%" },
  { color: "#B2B4B3", count: 11, label: "Arts", percent: "13%" },
  { color: "#DCDEDD", count: 11, label: "Physical Education", percent: "12%" },
] as const

export function TeacherDepartmentChartShowcase433() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/teachers</h3>

      <div className="max-w-sm rounded-[28px] bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base font-semibold text-[var(--talimy-color-navy)]">Department</h4>
          <button
            aria-label="Department chart actions"
            className="text-xl leading-none text-[var(--talimy-color-gray)]"
            type="button"
          >
            ...
          </button>
        </div>

        <div className="mt-2">
          <ChartRadialStacked
            centerLabel="Total Teachers"
            centerValue="86"
            className="min-h-[170px]"
            hideHeader
            innerRadius={66}
            outerRadius={104}
            segments={[...DEPARTMENT_SEGMENTS]}
          />
        </div>

        <div className="mt-4 border-t border-[color:color-mix(in_srgb,var(--talimy-color-gray)_25%,white_75%)] pt-4">
          <div className="space-y-3">
            {DEPARTMENT_STATS.map((item) => (
              <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_32px_40px] items-center gap-3">
                <div className="flex items-center gap-3 text-sm text-[var(--talimy-color-gray)]">
                  <span className="size-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
                <span className="text-right text-sm text-[var(--talimy-color-gray)]">{item.count}</span>
                <span className="text-right text-sm font-semibold text-[var(--talimy-color-navy)]">
                  {item.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
