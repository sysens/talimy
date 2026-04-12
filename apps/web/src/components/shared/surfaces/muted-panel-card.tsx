"use client"

import type { ReactNode } from "react"
import { Card } from "@heroui/react"

type MutedPanelCardProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function MutedPanelCard({ children, className, contentClassName }: MutedPanelCardProps) {
  return (
    <Card
      className={[
        "rounded-3xl border p-0 border-[#f1f3f7] bg-[#f8f8f6] shadow-none",
        className ?? "",
      ].join(" ")}
    >
      <Card.Content className={["p-3", contentClassName ?? ""].join(" ")}>{children}</Card.Content>
    </Card>
  )
}
