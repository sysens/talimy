"use client"

import { useMemo, useState } from "react"
import {
  Button,
  Calendar,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@talimy/ui"

const COMMAND_ITEMS = [
  "Mark attendance",
  "Create invoice",
  "Add notice",
  "Open schedule",
  "Review grades",
]

export function PrimitivesShowcase414() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedCommand, setSelectedCommand] = useState("Mark attendance")

  const recentActions = useMemo(
    () => [
      { key: "A-112", action: "Attendance update", actor: "Teacher", status: "Done" },
      { key: "P-982", action: "Payment confirmation", actor: "Admin", status: "Pending" },
      { key: "N-311", action: "Notice published", actor: "Admin", status: "Done" },
    ],
    []
  )

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Sheet / ScrollArea / Command
        </h2>

        <div className="flex flex-wrap gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
                <SheetDescription>
                  Tenant ichida eng ko‘p ishlatiladigan tezkor amallar.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 px-4">
                {COMMAND_ITEMS.map((item) => (
                  <Button key={item} variant="secondary" className="justify-start">
                    {item}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Command className="rounded-lg border">
          <CommandInput placeholder="Buyruq qidiring..." />
          <CommandList>
            <CommandEmpty>Natija topilmadi</CommandEmpty>
            <CommandGroup heading="Main Actions">
              {COMMAND_ITEMS.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => setSelectedCommand(item)}
                  data-checked={selectedCommand === item}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <ScrollArea className="h-36 rounded-lg border p-3">
          <div className="space-y-2">
            {Array.from({ length: 10 }, (_, idx) => (
              <p key={idx} className="text-sm text-muted-foreground">
                Log #{idx + 1}: {selectedCommand} action queue ichiga yuborildi.
              </p>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Calendar / Table</h2>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-lg border"
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActions.map((row) => (
              <TableRow key={row.key}>
                <TableCell>{row.key}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.actor}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
