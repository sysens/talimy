"use client"

import { useTranslations } from "next-intl"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Button,
} from "@talimy/ui"

export function SchoolInfoTab() {
  const t = useTranslations("adminSettings")

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>{t("schoolInfo.title")}</CardTitle>
        <CardDescription>{t("schoolInfo.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("schoolInfo.schoolName")}</Label>
            <Input defaultValue="Talimy School Main Branch" />
          </div>
          <div className="space-y-2">
            <Label>{t("schoolInfo.email")}</Label>
            <Input type="email" defaultValue="hello@talimy.space" />
          </div>
          <div className="space-y-2">
            <Label>{t("schoolInfo.phone")}</Label>
            <Input type="tel" defaultValue="+998 90 123 45 67" />
          </div>
          <div className="space-y-2">
            <Label>{t("schoolInfo.address")}</Label>
            <Input defaultValue="Tashkent, Uzbekistan" />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Button>{t("schoolInfo.save")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
