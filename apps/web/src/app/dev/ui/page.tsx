import { Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { DataTableShowcase42 } from "@/components/shared/ui-showcase/data-table-4-2"
import { PrimitivesShowcase411 } from "@/components/shared/ui-showcase/primitives-4-1-1"
import { PrimitivesShowcase412 } from "@/components/shared/ui-showcase/primitives-4-1-2"
import { PrimitivesShowcase413 } from "@/components/shared/ui-showcase/primitives-4-1-3"
import { PrimitivesShowcase414 } from "@/components/shared/ui-showcase/primitives-4-1-4"
import { PrimitivesShowcase415 } from "@/components/shared/ui-showcase/primitives-4-1-5"
import { PrimitivesShowcase416 } from "@/components/shared/ui-showcase/primitives-4-1-6"
import { StatCardShowcase431 } from "@/components/shared/ui-showcase/stat-card-4-3-1"
import { ThemePreviewToggle } from "@/components/shared/ui-showcase/theme-preview-toggle"

export default function UiShowcasePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">UI Showcase</h1>
          <p className="text-sm text-muted-foreground">
            FAZA 4 preview sahifasi. Komponentlar tasklar bo&apos;yicha ketma-ket qo&apos;shiladi.
          </p>
        </div>
        <ThemePreviewToggle />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.1 - Core Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase411 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.2 - Overlays & Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase412 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.3 - Display Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase413 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.4 - Layout + Data Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase414 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.5 - Form + Feedback Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase415 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.6 - Navigation + Analytics Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase416 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.2 - Data Table Components</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTableShowcase42 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.3.1 - Stat Card</CardTitle>
        </CardHeader>
        <CardContent>
          <StatCardShowcase431 />
        </CardContent>
      </Card>
    </main>
  )
}
