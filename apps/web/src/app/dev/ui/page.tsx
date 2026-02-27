import { Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { PrimitivesShowcase411 } from "@/components/shared/ui-showcase/primitives-4-1-1"

export default function UiShowcasePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">UI Showcase</h1>
        <p className="text-sm text-muted-foreground">
          FAZA 4 preview sahifasi. Komponentlar tasklar bo‘yicha ketma-ket qo‘shiladi.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.1 — Core Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase411 />
        </CardContent>
      </Card>
    </main>
  )
}
