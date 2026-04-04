"use client"

import { CalendarDays } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@talimy/ui"

import { AdminDashboardRightPanelContent } from "@/components/dashboard/admin/admin-dashboard-right-panel-content"

export function AdminDashboardRightPanel() {
  const t = useTranslations("adminDashboard.sidebar")
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="xl:hidden">
        <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button className="w-full justify-start rounded-2xl" variant="outline">
              <CalendarDays className="mr-2 h-4 w-4" />
              {t("openPanel")}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh] overflow-hidden rounded-t-[28px] px-4 pb-6">
            <DrawerHeader className="pb-4 text-left">
              <DrawerTitle>{t("title")}</DrawerTitle>
              <DrawerDescription>{t("description")}</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto pr-1">
              <AdminDashboardRightPanelContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <aside aria-label={t("title")} className="hidden w-[304px] shrink-0 xl:block">
        <div className="sticky top-5">
          <AdminDashboardRightPanelContent />
        </div>
      </aside>
    </>
  )
}
