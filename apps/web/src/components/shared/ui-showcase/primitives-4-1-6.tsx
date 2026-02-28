"use client"

import type { ChartConfig } from "@talimy/ui"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@talimy/ui"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

const attendanceChartData = [
  { day: "Mon", attendance: 95 },
  { day: "Tue", attendance: 97 },
  { day: "Wed", attendance: 96 },
  { day: "Thu", attendance: 98 },
  { day: "Fri", attendance: 94 },
]

const attendanceChartConfig = {
  attendance: {
    label: "Attendance",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function PrimitivesShowcase416() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Breadcrumb / Pagination</h2>

        <div className="space-y-4 rounded-lg border p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Finance</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Chart (Recharts wrapper)</h2>

        <div className="rounded-lg border p-4">
          <ChartContainer config={attendanceChartConfig} className="h-56 w-full">
            <LineChart data={attendanceChartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line
                dataKey="attendance"
                type="monotone"
                stroke="var(--color-attendance)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </section>
    </div>
  )
}
