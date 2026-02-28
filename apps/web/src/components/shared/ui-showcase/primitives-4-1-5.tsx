"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Progress,
  Slider,
} from "@talimy/ui"
import { sileo } from "sileo"

export function PrimitivesShowcase415() {
  const [progressValue, setProgressValue] = useState(68)
  const [sliderValue, setSliderValue] = useState<number[]>([68])

  const handleDemoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sileo.success({
      title: "Form saved",
      description: "4.1.5 form + toast flow ishladi.",
    })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Form (Field) / Toast (Sileo)
        </h2>

        <form className="space-y-4 rounded-lg border p-4" onSubmit={handleDemoSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="school-name">School name</FieldLabel>
              <Input id="school-name" placeholder="Mezana School" required />
              <FieldDescription>Tenant display name uchun ishlatiladi.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
              <Input id="contact-email" type="email" placeholder="admin@talimy.space" required />
            </Field>
          </FieldGroup>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                sileo.info({
                  title: "Validation note",
                  description: "Form demo holatda ishlayapti.",
                })
              }
            >
              Info toast
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Progress / Slider / Accordion
        </h2>

        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Upload progress</span>
            <span className="font-medium">{progressValue}%</span>
          </div>
          <Progress value={progressValue} />
          <Slider
            value={sliderValue}
            onValueChange={(value) => {
              setSliderValue(value)
              setProgressValue(value[0] ?? 0)
            }}
            max={100}
            step={1}
          />
        </div>

        <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
          <AccordionItem value="security">
            <AccordionTrigger>Security policy</AccordionTrigger>
            <AccordionContent>
              Platform va school admin uchun har bir action audit logga yoziladi.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="queue">
            <AccordionTrigger>Queue behavior</AccordionTrigger>
            <AccordionContent>
              Worker alohida process bo‘lsa `QUEUE_WORKERS_ENABLED=true` faqat worker service’da
              ishlaydi.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tenant">
            <AccordionTrigger>Tenant isolation</AccordionTrigger>
            <AccordionContent>
              Har bir so‘rov tenant scope bo‘yicha filtrlanadi: `tenantId` majburiy.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
