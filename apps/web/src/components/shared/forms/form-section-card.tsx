import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, cn } from "@talimy/ui"

type FormSectionCardProps = {
  children: ReactNode
  className?: string
  description?: string
  title: string
}

export function FormSectionCard({ children, className, description, title }: FormSectionCardProps) {
  return (
    <Card className={cn("border-slate-200 bg-white mb-0 rounded-none", className)}>
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-base font-semibold text-slate-950">{title}</CardTitle>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
