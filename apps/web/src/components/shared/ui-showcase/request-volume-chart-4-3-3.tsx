"use client"

import { RequestVolumeChart } from "@talimy/ui"

const REQUEST_VOLUME_DATA = [
  { api: 1820, month: "January", webhook: 1640 },
  { api: 2340, month: "February", webhook: 2160 },
  { api: 1960, month: "March", webhook: 1880 },
  { api: 2780, month: "April", webhook: 2540 },
  { api: 2100, month: "May", webhook: 1920 },
  { api: 3120, month: "June", webhook: 2880 },
  { api: 2540, month: "July", webhook: 2320 },
  { api: 3480, month: "August", webhook: 3160 },
  { api: 2860, month: "September", webhook: 2580 },
  { api: 2420, month: "October", webhook: 2140 },
  { api: 3240, month: "November", webhook: 2960 },
  { api: 2680, month: "December", webhook: 2440 },
]

export function RequestVolumeChartShowcase433() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/platform/dashboard</h3>
      <RequestVolumeChart data={REQUEST_VOLUME_DATA} title="Request Volume" />
    </div>
  )
}
