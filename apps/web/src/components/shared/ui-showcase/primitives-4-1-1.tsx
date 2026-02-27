"use client"

import { useState } from "react"
import {
  Button,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@talimy/ui"

export function PrimitivesShowcase411() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [agreementChecked, setAgreementChecked] = useState(true)

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Button / Input / Textarea</h2>

        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="showcase-email">Email</Label>
          <Input id="showcase-email" placeholder="admin@talimy.space" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="showcase-note">Izoh</Label>
          <Textarea id="showcase-note" placeholder="Qisqa izoh..." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Select / Checkbox / Radio / Switch
        </h2>

        <div className="space-y-2">
          <Label>Department</Label>
          <Select defaultValue="math">
            <SelectTrigger>
              <SelectValue placeholder="Department tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="language">Language</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="showcase-agreement"
            checked={agreementChecked}
            onCheckedChange={(checked) => setAgreementChecked(Boolean(checked))}
          />
          <Label htmlFor="showcase-agreement">Shartlarga roziman</Label>
        </div>

        <div className="space-y-2">
          <Label>Gender policy</Label>
          <RadioGroup defaultValue="mixed" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem id="mixed" value="mixed" />
              <Label htmlFor="mixed">Mixed</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="boys-only" value="boys-only" />
              <Label htmlFor="boys-only">Boys only</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="girls-only" value="girls-only" />
              <Label htmlFor="girls-only">Girls only</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="showcase-notifications"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
          <Label htmlFor="showcase-notifications">Push notifications</Label>
        </div>
      </section>
    </div>
  )
}
